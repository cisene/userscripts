// ==UserScript==
// @name         OPML-helper
// @namespace    http://tampermonkey.net/
// @version      2026-08-31
// @description  Automated polling & auto-clipboard YAML generator for Podcast Index
// @author       Christopher Isene
// @match        https://podcastindex.org/podcast/*
// @match        https://podcastindex.org/podcast/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=podcastindex.org
// @grant        GM_setClipboard
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    let lastProcessedUrl = '';
    let pollInterval = null;

    function setupUI() {
        if (document.getElementById('opml-helper-container')) return;

        const container = document.createElement("div");
        container.id = 'opml-helper-container';
        container.style.cssText = 'width: 100%; padding: 10px; background: #f8f9fa; border-bottom: 2px solid #007bff; box-sizing: border-box; font-family: sans-serif; position: relative; z-index: 99999;';

        const textBox = document.createElement("textarea");
        textBox.id = 'opmltext';
        textBox.placeholder = 'Waiting for podcast data to load...';
        textBox.style.cssText = 'width: 100%; height: 90px; display: block; margin-bottom: 8px; font-family: monospace; padding: 6px; box-sizing: border-box;';

        const buttonGroup = document.createElement("div");
        buttonGroup.style.cssText = 'display: flex; gap: 10px; align-items: center;';

        const copyButton = document.createElement("button");
        copyButton.id = 'opml-copy-btn';
        copyButton.innerText = 'Copy to Clipboard';
        copyButton.style.cssText = 'padding: 6px 14px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px; font-weight: bold;';
        copyButton.addEventListener("click", () => {
            extractAndCopy(true);
        });

        const statusLabel = document.createElement("span");
        statusLabel.id = 'opml-status';
        statusLabel.style.cssText = 'font-size: 13px; font-weight: bold; color: #555;';
        statusLabel.innerText = 'Initializing...';

        buttonGroup.appendChild(copyButton);
        buttonGroup.appendChild(statusLabel);

        container.appendChild(textBox);
        container.appendChild(buttonGroup);

        document.body.insertBefore(container, document.body.firstChild);
    }

    function setStatus(text, color = '#555') {
        const statusLabel = document.getElementById('opml-status');
        if (statusLabel) {
            statusLabel.innerText = text;
            statusLabel.style.color = color;
        }
    }

    function copyToClipboard(text, isManual = false) {
        if (!text || text.trim().length === 0) return;

        GM_setClipboard(text, 'text');

        const msg = isManual ? 'Copied manually!' : 'Auto-copied to clipboard!';
        setStatus(msg, '#28a745');

        const copyButton = document.getElementById('opml-copy-btn');
        if (copyButton) {
            const originalBg = copyButton.style.background;
            copyButton.style.background = '#28a745';
            setTimeout(() => {
                copyButton.style.background = originalBg;
            }, 1000);
        }
    }

    function extractData() {
        // 1. Title (Target specific Podcast Index headers, exclude generic [title] attribute query)
        let podcast_title = '';
        const titleEl = document.querySelector('h1.podcast-title') ||
                        document.querySelector('h1') ||
                        document.querySelector('.podcast-header-title');

        if (titleEl) {
            podcast_title = titleEl.innerText.trim();
        }

        // 2. Feed URL (xmlUrl) - Required
        let podcast_xmlUrl = '';
        const rssfeedEl = document.querySelector('div.podcast-header-external-links a[title="RSS Feed"]');
        if (rssfeedEl) {
            podcast_xmlUrl = rssfeedEl.href;
            podcast_xmlUrl = stripWeirdness(podcast_xmlUrl);
        }

        // 3. Homepage (htmlUrl) - Optional
        let podcast_htmlUrl = '';
        const webpageEl = document.querySelector('div.podcast-header-external-links a[title="Podcast Website"]');
        if (webpageEl) {
            podcast_htmlUrl = webpageEl.href;
            podcast_htmlUrl = stripWeirdness(podcast_htmlUrl);
        }

        // Clean & Normalize URLs
        podcast_htmlUrl = podcast_htmlUrl.replace(/^http:\/\//i, "https://");
        podcast_xmlUrl = podcast_xmlUrl.replace(/^http:\/\//i, "https://");

        // Swap if PodcasterWallet misclassification occurs
        if (/podcasterwallet\.com/i.test(podcast_xmlUrl)) {
            podcast_xmlUrl = podcast_htmlUrl;
            podcast_htmlUrl = '';
        }

        return {
            title: podcast_title,
            xmlUrl: podcast_xmlUrl,
            htmlUrl: podcast_htmlUrl
        };
    }

    function stripWeirdness(data) {
        return data ? data.trim() : '';
    }

    function extractAndCopy(isManual = false) {
        const data = extractData();

        let podcast_title = data.title;
        if (podcast_title) {
            podcast_title = podcast_title.replace(/'/g, "''");
            if (/['#:]/g.test(podcast_title) || /^\d+$/.test(podcast_title)) {
                podcast_title = `'${podcast_title}'`;
            }
        }

        const payload = `  - title: ${podcast_title}\n    htmlUrl: ${data.htmlUrl}\n    xmlUrl: ${data.xmlUrl}\n`;

        const textBox = document.getElementById('opmltext');
        if (textBox && textBox.value !== payload) {
            textBox.value = payload;
            if (isManual) {
                textBox.focus();
                textBox.select();
            }
        }

        copyToClipboard(payload, isManual);
    }

    function startPollingForData() {
        if (pollInterval) clearInterval(pollInterval);

        let attempts = 0;
        const maxAttempts = 20;

        setStatus('Polling page for data...', '#e67e22');

        pollInterval = setInterval(() => {
            attempts++;
            const data = extractData();

            const hasRequiredData = data.title.length > 0 && data.xmlUrl.length > 0;

            if (hasRequiredData) {
                clearInterval(pollInterval);
                pollInterval = null;
                extractAndCopy(false);
            } else if (attempts >= maxAttempts) {
                clearInterval(pollInterval);
                pollInterval = null;
                extractAndCopy(false);
                setStatus('Extraction complete (some fields missing)', '#d9534f');
            }
        }, 300);
    }

    // Monitor SPA navigation reliably
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;

        setupUI();

        if (currentUrl !== lastProcessedUrl) {
            lastProcessedUrl = currentUrl;
            if (/https:\/\/podcastindex\.org\/podcast\//i.test(currentUrl)) {
                startPollingForData();
            } else {
                if (pollInterval) clearInterval(pollInterval);
                setStatus('Navigate to a podcast page to auto-extract', '#777');
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();