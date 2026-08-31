// ==UserScript==
// @name         OPML-helper
// @namespace    http://tampermonkey.net/
// @version      2026-08-30
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
        container.style.cssText = 'width: 100%; padding: 10px; background: #f8f9fa; border-bottom: 2px solid #007bff; box-sizing: border-box; font-family: sans-serif;';

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
        // 1. Title (Required)
        const titleEl = document.querySelector('h1') ||
                        document.querySelector('.podcast-header-title') ||
                        document.querySelector('[title]');
        let podcast_title = titleEl ? titleEl.innerText.trim() : '';

        // 2. Feed URL (xmlUrl) - Required
        let podcast_xmlUrl = '';
        const allLinks = Array.from(document.querySelectorAll('a[href]'));

        const rssLink = allLinks.find(a =>
            a.href.includes('/feed/') ||
            a.href.includes('rss') ||
            a.href.includes('.xml') ||
            a.getAttribute('aria-label')?.toLowerCase().includes('feed') ||
            a.innerText.toLowerCase().includes('feed') ||
            a.innerText.toLowerCase().includes('rss')
        );
        if (rssLink) podcast_xmlUrl = rssLink.href;

        // 3. Homepage (htmlUrl) - Optional
        let podcast_htmlUrl = '';
        const webLink = allLinks.find(a =>
            a.target === '_blank' &&
            !a.href.includes('podcastindex.org') &&
            !a.href.includes('/feed/') &&
            !a.href.includes('twitter.com') &&
            !a.href.includes('x.com')
        );
        if (webLink) podcast_htmlUrl = webLink.href;

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
        if (textBox) {
            textBox.value = payload;
            textBox.focus();
            textBox.select();
        }

        copyToClipboard(payload, isManual);
    }

    function startPollingForData() {
        if (pollInterval) clearInterval(pollInterval);

        let attempts = 0;
        const maxAttempts = 40; // 40 attempts * 250ms = 10 seconds timeout

        setStatus('Polling page for data...', '#e67e22');

        pollInterval = setInterval(() => {
            attempts++;
            const data = extractData();

            // Condition: Require Title AND Feed URL (Homepage is optional)
            const hasRequiredData = data.title.length > 0 && data.xmlUrl.length > 0;

            if (hasRequiredData) {
                clearInterval(pollInterval);
                pollInterval = null;
                extractAndCopy(false);
            } else if (attempts >= maxAttempts) {
                // Timeout fallback: extract whatever is available anyway
                clearInterval(pollInterval);
                pollInterval = null;
                extractAndCopy(false);
                setStatus('Extraction complete (some fields missing)', '#d9534f');
            }
        }, 250); // Check every 250 milliseconds
    }

    // Monitor SPA navigation
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;

        setupUI();

        if (/https:\/\/podcastindex\.org\/podcast\/\d+/i.test(currentUrl)) {
            if (currentUrl !== lastProcessedUrl) {
                lastProcessedUrl = currentUrl;
                startPollingForData();
            }
        } else {
            if (pollInterval) clearInterval(pollInterval);
            setStatus('Navigate to a podcast page to auto-extract', '#777');
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();