// ==UserScript==
// @name         Podcast Index Local Tesseract OCR Extractor
// @namespace    http://tampermonkey.net/
// @version      9.4
// @description  Zero-CSP OCR runner with high-contrast UI, ASCII filter, and selectable textarea output
// @author       Christopher Isene <christopher.isene@gmail.com>
// @match        https://api.podcastindex.org/*
// @match        https://*.podcastindex.org/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Podcast Index OCR v9.4] Initialized (Textarea Output Mode).");

    const DOMAIN_REGEX = /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+(?:com|net|org|site|vip|cc|xyz|club|bet|live|top|co|se|cn|me|app)\b/gi;
    const SOCIAL_REGEX = /(?:t\.me\/|telegram:|whatsapp:|wa\.me\/|line\.me\/|@)[a-zA-Z0-9_]+/gi;

    let ocrIframe = null;
    let iframeReadyPromise = null;

    function buildSandboxHTML() {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script>
        // Filter out non-fatal Tesseract WASM parameter notices
        const originalWarn = console.warn;
        console.warn = function(...args) {
            if (args[0] && typeof args[0] === 'string' && args[0].includes('Parameter not found')) {
                return;
            }
            originalWarn.apply(console, args);
        };
    <\/script>
    <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"><\/script>
</head>
<body>
    <script>
        let worker = null;

        window.addEventListener('message', async (event) => {
            const { action, imageDataBase64, id } = event.data || {};
            if (action !== 'RUN_OCR') return;

            try {
                if (!worker) {
                    worker = await Tesseract.createWorker('eng');
                }
                const result = await worker.recognize(imageDataBase64);
                window.parent.postMessage({ id, status: 'SUCCESS', text: result.data.text }, '*');
            } catch (err) {
                window.parent.postMessage({ id, status: 'ERROR', error: err.toString() }, '*');
            }
        });

        window.parent.postMessage({ action: 'SANDBOX_READY' }, '*');
    <\/script>
</body>
</html>`;
    }

    function getOCRSandboxIframe() {
        if (ocrIframe) return Promise.resolve(ocrIframe);
        if (iframeReadyPromise) return iframeReadyPromise;

        iframeReadyPromise = new Promise((resolve) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.id = 'ocr-data-sandbox';

            const htmlContent = buildSandboxHTML();
            iframe.src = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;

            function onReady(event) {
                if (event.data && event.data.action === 'SANDBOX_READY') {
                    window.removeEventListener('message', onReady);
                    ocrIframe = iframe;
                    resolve(iframe);
                }
            }

            window.addEventListener('message', onReady);
            document.body.appendChild(iframe);
        });

        return iframeReadyPromise;
    }

    function hasYellowStyle(element) {
        let current = element;
        while (current && current !== document.body) {
            const inlineStyle = (current.getAttribute('style') || '').toLowerCase();
            if (inlineStyle.includes('yellow')) return true;

            const style = window.getComputedStyle(current);
            const bgColor = style.backgroundColor;
            if (bgColor === 'rgb(255, 255, 0)' || bgColor === 'rgb(255, 255, 224)' || bgColor === 'yellow') {
                return true;
            }
            current = current.parentElement;
        }
        return false;
    }

    function findCoverImageInDivContainer(feedEl) {
        let current = feedEl.parentElement;
        let depth = 0;
        while (current && current !== document.body && depth < 5) {
            const img = current.querySelector('img');
            if (img) return img;
            current = current.parentElement;
            depth++;
        }
        return null;
    }

    function fetchImageAsDataUrl(url) {
        const gmx = typeof GM_xmlhttpRequest !== 'undefined' ? GM_xmlhttpRequest : GM.xmlHttpRequest;
        return new Promise((resolve, reject) => {
            gmx({
                method: "GET",
                url: url,
                responseType: "arraybuffer",
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) {
                        const contentType = res.responseHeaders
                            ?.split('\r\n')
                            ?.find(h => h.toLowerCase().startsWith('content-type:'))
                            ?.split(':')[1]?.trim() || 'image/jpeg';

                        const bytes = new Uint8Array(res.response);
                        let binary = '';
                        for (let i = 0; i < bytes.byteLength; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        const base64 = btoa(binary);
                        resolve(`data:${contentType};base64,${base64}`);
                    } else {
                        reject(new Error(`HTTP ${res.status}: ${res.statusText}`));
                    }
                },
                onerror: (err) => reject(new Error("Network transfer failed: " + JSON.stringify(err))),
                ontimeout: () => reject(new Error("Network request timed out."))
            });
        });
    }

    function processOCRInIframe(dataUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                const iframe = await getOCRSandboxIframe();
                const reqId = Math.random().toString(36).substring(2, 11);

                function handleMessage(event) {
                    if (event.data && event.data.id === reqId) {
                        window.removeEventListener('message', handleMessage);
                        if (event.data.status === 'SUCCESS') {
                            resolve(event.data.text);
                        } else {
                            reject(new Error(event.data.error));
                        }
                    }
                }

                window.addEventListener('message', handleMessage);
                iframe.contentWindow.postMessage({ action: 'RUN_OCR', imageDataBase64: dataUrl, id: reqId }, '*');
            } catch (err) {
                reject(err);
            }
        });
    }

    function updateStatusText(statusBox, text, textColor = '#ffffff') {
        statusBox.textContent = '';
        const span = document.createElement('span');
        span.style.color = textColor;
        span.textContent = text;
        statusBox.appendChild(span);
    }

    async function runOCR(imgElement, container) {
        const button = container.querySelector('.ocr-trigger-btn');
        const statusBox = container.querySelector('.ocr-status');

        if (container.dataset.isProcessing === "true") return;
        container.dataset.isProcessing = "true";

        if (button) {
            button.style.display = 'none';
        }

        statusBox.style.display = 'block';
        statusBox.title = 'Processing...';
        updateStatusText(statusBox, '⚙️ Fetching image binary...', '#ffff00');

        try {
            console.log("[Podcast Index OCR] Fetching cover image:", imgElement.src);
            const dataUrl = await fetchImageAsDataUrl(imgElement.src);

            updateStatusText(statusBox, '⚙️ Running OCR in sandbox...', '#ffff00');
            const rawText = await processOCRInIframe(dataUrl);

            // Strip non-ASCII characters entirely
            const asciiText = rawText.replace(/[^\x00-\x7F]/g, '');

            console.log("[Podcast Index OCR] Cleaned ASCII OCR text:", asciiText);

            const foundDomains = asciiText.match(DOMAIN_REGEX) || [];
            const foundSocials = asciiText.match(SOCIAL_REGEX) || [];
            const uniqueTargets = [...new Set([...foundDomains, ...foundSocials])];

            statusBox.textContent = '';
            statusBox.title = 'Double-click container margin to re-interpret OCR';

            const header = document.createElement('div');
            Object.assign(header.style, { fontWeight: 'bold', marginBottom: '4px' });

            const textarea = document.createElement('textarea');
            Object.assign(textarea.style, {
                width: '100%',
                height: '70px',
                background: '#000000',
                color: '#ffffff',
                border: '1px solid #555555',
                borderRadius: '3px',
                fontFamily: 'monospace',
                fontSize: '11px',
                padding: '4px',
                boxSizing: 'border-box',
                resize: 'vertical'
            });

            // Prevent double-clicking inside the textarea from unintentionally re-running OCR
            textarea.addEventListener('dblclick', (e) => e.stopPropagation());

            if (uniqueTargets.length > 0) {
                header.style.color = '#ff5555';
                header.textContent = '🚨 Extracted Spam Targets:';
                textarea.value = uniqueTargets.join('\n');
            } else {
                header.style.color = '#ffffff';
                header.textContent = 'ℹ️ Raw ASCII OCR Output:';
                textarea.value = asciiText.trim().replace(/\s+/g, ' ');
            }

            statusBox.appendChild(header);
            statusBox.appendChild(textarea);

            const hint = document.createElement('div');
            Object.assign(hint.style, {
                fontSize: '9px',
                color: '#a0a0a0',
                marginTop: '6px',
                fontStyle: 'italic',
                borderTop: '1px solid #333333',
                paddingTop: '3px'
            });
            hint.textContent = '💡 Double-click container to re-interpret';
            statusBox.appendChild(hint);

        } catch (err) {
            console.error("[Podcast Index OCR] Execution Error:", err);
            statusBox.title = 'Double-click to retry OCR';

            const errorMsg = err?.message || err?.toString() || 'Unknown error occurred';
            updateStatusText(statusBox, `⚠️ OCR Error: ${errorMsg}`, '#ff5555');

            const hint = document.createElement('div');
            Object.assign(hint.style, {
                fontSize: '9px',
                color: '#ff5555',
                marginTop: '4px',
                fontStyle: 'italic'
            });
            hint.textContent = '💡 Double-click container to retry';
            statusBox.appendChild(hint);
        } finally {
            container.dataset.isProcessing = "false";
        }
    }

    function attachOCRButton(imgElement) {
        if (imgElement.dataset.ocrButtonAttached === "true") return;
        imgElement.dataset.ocrButtonAttached = "true";

        const container = document.createElement('div');
        container.className = 'ocr-control-container';

        Object.assign(container.style, {
            marginTop: '6px',
            fontFamily: 'monospace',
            fontSize: '11px',
            maxWidth: '300px',
            zIndex: '9999'
        });

        const button = document.createElement('button');
        button.className = 'ocr-trigger-btn';
        button.textContent = '🔍 Run OCR';
        Object.assign(button.style, {
            background: '#ffffff',
            color: '#000000',
            border: '1px solid #ffffff',
            padding: '4px 10px',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s ease'
        });

        const statusBox = document.createElement('div');
        statusBox.className = 'ocr-status';
        Object.assign(statusBox.style, {
            display: 'none',
            background: '#000000',
            color: '#ffffff',
            padding: '8px',
            marginTop: '4px',
            borderRadius: '4px',
            border: '2px solid #ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.8)',
            cursor: 'pointer',
            userSelect: 'none'
        });

        container.appendChild(button);
        container.appendChild(statusBox);

        button.addEventListener('mouseover', () => {
            button.style.background = '#000000';
            button.style.color = '#ffffff';
        });
        button.addEventListener('mouseout', () => {
            button.style.background = '#ffffff';
            button.style.color = '#000000';
        });

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            runOCR(imgElement, container);
        });

        statusBox.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            runOCR(imgElement, container);
        });

        imgElement.parentNode.insertBefore(container, imgElement.nextSibling);
    }

    function scanPage() {
        const links = document.querySelectorAll('a[class*="feedurl"], a[class*="feedUrl"]');

        links.forEach((feedEl) => {
            const href = feedEl.getAttribute('href') || '';
            const isFirstoryUserFeed = href.toLowerCase().includes('feed.firstory.me/rss/user/');
            const isYellow = hasYellowStyle(feedEl);

            if (isFirstoryUserFeed || isYellow) {
                const img = findCoverImageInDivContainer(feedEl);
                if (img && img.dataset.ocrButtonAttached !== "true") {
                    attachOCRButton(img);
                }
            }
        });
    }

    setInterval(scanPage, 1000);
})();
