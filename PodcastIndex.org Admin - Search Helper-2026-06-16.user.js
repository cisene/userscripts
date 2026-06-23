// ==UserScript==
// @name         PodcastIndex.org Admin - Search Helper
// @namespace    http://tampermonkey.net/
// @version      2026-06-16
// @description  try to take over the world!
// @author       You
// @match        https://api.podcastindex.org/dashboard?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=podcastindex.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Core configuration
    const TARGET_TEXT = "by Inception Point AI";
    const SPAM_BUTTON_TEXT = "✗ Spam ▾";
    const SPAM_AISLOP_TEXT = "2 — AI Slop";

    const RUN_INTERVAL = 3000; // Checks every 3 seconds
    let intervalId = null;

    const list_domains = [
        "https://5zan.top",
        "https://6zan.top",
        "https://zan6.top",
        "https://8zan.cc",
        "https://77up.top",
        "https://zan5.top",
        "https://zanup.top",
        "https://zanup.cc",
        "https://skp77.top",
        "https://2fen.cc",
        "https://zan55.cc",
        "https://zansu.top",
        "https://98kk.top",
        "https://77up.top",
        "https://77xhs.top"
    ];

    // Create and inject the floating action button
    function createControlPanel() {
        const button = document.createElement('button');
        button.innerText = 'Start AI Slop Finder';

        // Style the button to float fixed at the top right
        Object.assign(button.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '99999',
            padding: '10px 15px',
            backgroundColor: '#ff4757',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        });

        // Toggle logic on click
        button.addEventListener('click', () => {
            if (intervalId) {
                // Stop the script
                clearInterval(intervalId);
                intervalId = null;
                button.innerText = 'Start AI Slop Finder';
                button.style.backgroundColor = '#ff4757';
            } else {
                // Start the script
                processArticles(); // Run once immediately
                intervalId = setInterval(processArticles, RUN_INTERVAL);
                button.innerText = 'Stop AI Slop Finder';
                button.style.backgroundColor = '#2ed573';
            }
        });

        document.body.appendChild(button);
    }

    // Helper function to check if the background color is white, transparent, or unassigned
    function isUntaggedBackground(element) {
        const style = window.getComputedStyle(element);
        const bgColor = style.backgroundColor;

        return bgColor === 'rgba(0, 0, 0, 0)' ||
            bgColor === 'transparent' ||
            bgColor === 'rgb(255, 255, 255)' ||
            bgColor === 'rgba(255, 255, 255, 1)' ||
            bgColor === '#ffffff' ||
            bgColor === '#fff';
    }

    function processArticles() {
        // Targets div elements matching both classes and having a data-pcid attribute
        const articles = document.querySelectorAll('div.result.podcast[data-pcid]');

        articles.forEach(article => {

            // Only target articles that have an untagged background (white/transparent)
            if (isUntaggedBackground(article)) {


                const articleInfo = article.querySelectorAll('div.result-info p');

                if (articleInfo[0].innerText == TARGET_TEXT) {

                    // Find the initial "Spam" link via its specific class name
                    const spamLink = article.querySelectorAll('a.feedSpamMenu');

                    if (spamLink[0].innerText == SPAM_BUTTON_TEXT) {
                        spamLink[0].click();

                        // Wait briefly for the modal dropdown to appear
                        setTimeout(() => {
                            const aiSlopOption = article.querySelectorAll('a[data-reason="2"]');
                            if (aiSlopOption[0].innerText == SPAM_AISLOP_TEXT) {
                                aiSlopOption[0].click();
                            }
                        }, 500);
                    }
                }
            }
        });
    }

    // Run the button creation script once the page elements exist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createControlPanel);
    } else {
        createControlPanel();
    }
})();