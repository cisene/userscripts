// ==UserScript==
// @name         Last.fm Now Playing Extractor (Light Box Contrast + Hashtags)
// @namespace    http://tampermonkey.net/
// @version      2026-09-14-1352
// @description  Full-width top banner with high-contrast light textbox for Mastodon formatting including #nowplaying and #lastfm.
// @author       Christopher Isene <christopher.isene@gmail.com>
// @match        https://www.last.fm/user/kakbit*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 1. Create Non-Blocking Full-Width Modal
    const modal = document.createElement('div');
    modal.id = 'tm-nowplaying-modal';
    modal.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        z-index: 2147483647 !important;
        background: #111111;
        color: #ffffff;
        padding: 12px 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        border-bottom: 3px solid #ba0000;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        transition: transform 0.25s ease, opacity 0.25s ease;
    `;

    modal.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 8px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-right: 30px;">
                <span style="font-weight: bold; font-size: 12px; color: #ba0000; text-transform: uppercase; letter-spacing: 1px;">
                    Mastodon Now Playing
                </span>
                <span id="tm-status-indicator" style="font-size: 11px; color: #888;">Live Sync Active</span>
            </div>

            <!-- Minimise Button -->
            <button id="tm-toggle-btn" style="
                position: absolute;
                top: -2px;
                right: 0;
                background: #222;
                color: #aaa;
                border: 1px solid #444;
                border-radius: 4px;
                padding: 2px 8px;
                font-size: 12px;
                cursor: pointer;
            ">_ Minimise</button>

            <!-- INVERTED COLOR TEXTBOX: Black text on light-grey background -->
            <textarea id="tm-np-text" style="
                width: 100%;
                height: 120px;
                background: #e0e0e0;
                color: #000000;
                border: 2px solid #ffffff;
                border-radius: 6px;
                padding: 10px;
                font-size: 14px;
                font-weight: 500;
                line-height: 1.4;
                resize: vertical;
                box-sizing: border-box;
                outline: none;
            " readonly></textarea>

            <button id="tm-copy-btn" style="
                width: 100%;
                background: #d51007;
                color: #ffffff;
                border: none;
                padding: 10px;
                border-radius: 6px;
                font-weight: bold;
                font-size: 13px;
                cursor: pointer;
                transition: background 0.2s ease;
            ">Copy to Clipboard</button>
        </div>
    `;

    // Floating Pill to Restore Modal when Minimized
    const restorePill = document.createElement('button');
    restorePill.id = 'tm-restore-pill';
    restorePill.innerText = '🎵 Now Playing';
    restorePill.style.cssText = `
        position: fixed !important;
        top: 10px !important;
        right: 20px !important;
        z-index: 2147483647 !important;
        background: #ba0000;
        color: #fff;
        border: none;
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 12px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        display: none;
    `;

    document.body.appendChild(modal);
    document.body.appendChild(restorePill);

    const textarea = document.getElementById('tm-np-text');
    const copyBtn = document.getElementById('tm-copy-btn');
    const toggleBtn = document.getElementById('tm-toggle-btn');

    // 2. Dynamic Page Offset
    function adjustPageOffset() {
        if (modal.style.display !== 'none') {
            const modalHeight = modal.offsetHeight;
            document.body.style.paddingTop = `${modalHeight}px`;
        } else {
            document.body.style.paddingTop = '0px';
        }
    }

    // 3. Minimise / Restore Handlers
    toggleBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        restorePill.style.display = 'block';
        adjustPageOffset();
    });

    restorePill.addEventListener('click', () => {
        modal.style.display = 'block';
        restorePill.style.display = 'none';
        adjustPageOffset();
    });

    // 4. Track Extraction Logic
    function updateNowPlaying() {
        const row = document.querySelector('.chartlist-row');
        if (!row) return;

        const artistEl = row.querySelector('.chartlist-artist a');
        const trackEl = row.querySelector('.chartlist-name a');

        if (artistEl && trackEl) {
            const artist = artistEl.innerText.trim();
            const track = trackEl.innerText.trim();

            // Format output string with dual hashtags
            const formatted = `${artist} - ${track}\n\n#nowplaying #lastfm`;

            if (textarea.value !== formatted) {
                textarea.value = formatted;
            }
        }
    }

    // 5. Clipboard Action
    copyBtn.addEventListener('click', () => {
        textarea.select();
        navigator.clipboard.writeText(textarea.value).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'Copied to Clipboard!';
            copyBtn.style.background = '#28a745';

            setTimeout(() => {
                copyBtn.innerText = originalText;
                copyBtn.style.background = '#d51007';
            }, 1500);
        });
    });

    // Initial setup
    updateNowPlaying();
    adjustPageOffset();
    window.addEventListener('resize', adjustPageOffset);
    setInterval(updateNowPlaying, 8000);
})();
