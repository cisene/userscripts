// ==UserScript==
// @name         Remove LinkedIn Promoted Posts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Finds and removes elements containing the text "Promoted" along with their feed container.
// @author       Christopher Isene <christopher.isene@gmail.com>
// @match        https://*.linkedin.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function removePromotedPosts() {
        // Query elements likely to hold the text label
        const elements = document.querySelectorAll('p, span, div');

        elements.forEach(el => {
            if (el.textContent) {
                const text = el.textContent.trim().toLowerCase();

                // Matches "promoted", "promoted by...", or "sponsored"
                if (text.startsWith('promoted') || text.startsWith('sponsored')) {

                    // Climb up to find the root post card container
                    const postCard = el.closest('div._53485671, [data-testid="expandable-text-box"]')?.parentElement?.parentElement;

                    if (postCard) {
                        console.log(`[Tampermonkey] Removed sponsored post containing: "${el.textContent.trim()}"`);
                        postCard.remove();
                    } else {
                        // Fallback: If LinkedIn updates its feed structure, safely delete the local block
                        el.parentNode.remove();
                    }
                }
            }
        });
    }

    // Run on initial load
    removePromotedPosts();

    // Watch the DOM for lazy-loaded posts while scrolling
    const observer = new MutationObserver(() => {
        removePromotedPosts();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
