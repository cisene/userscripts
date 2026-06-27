// ==UserScript==
// @name         PodcastIndex.org Curation Helper
// @namespace    http://tampermonkey.net/
// @version      2026-06-07
// @description  Highlights known-bad actors and helps with curation of podcast feeds on PodcastIndex.org
// @author       Christopher Isene <christopher.isene@gmail.com>
// @match        https://api.podcastindex.org/dashboard?q=*
// @match        https://api.podcastindex.org/curatenew?sort=*
// @match        https://api.podcastindex.org/curatekilled*
// @match        https://api.podcastindex.org/curatenew*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=podcastindex.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const TEXT_IPAI = "by Inception Point AI";

    const TEXT_SPAMBUTTON = "✗ Spam ▾";

    const TEXT_SPAMMENU_1 = "1 — Spam";
    const TEXT_SPAMMENU_2 = "2 — AI Slop";
    const TEXT_SPAMMENU_6 = "6 — Hijack";

    const targetTLDs = [
        "cc",
        "top",
        "online",
        "app"
    ];

    const feedURLs = [
        "firstory.me",
        "spreaker.com"
    ];

    const descriptionTexts = [

    ];

    const ownersTexts = [
        "Heritage Radio Vault",

        "Inception Point AI"
    ];

    const titleTexts = [

        "Rabattcode",
        "Rabatecode",
        "Referral Code",

        "Promo Code"
    ];


    const targetTexts = [

        "Action&Adventure Fiction Genre",
        "Ancient Genre",
        "Animals and Nature Genre",
        "Anthologies Genre",
        "Biographies  Genre",
        "Biographies Genre",
        "Christianity Genre",

        "Detective Fiction Genre",
        "Early Modern Genre",
        "Family Genre",
        "Fantasy Genre",
        "General Fiction Genre",
        "General Genre",
        "Gothic Genre",
        "Greek and Latin Classics Genre",
        "History Genre",
        "Historical Genre",
        "Horror Genre",
        "Humor Genre",
        "Humorous Fiction Genre",
        "Literary Collections Genre",
        "Literary Fiction Genre",
        "Memoirs Genre",
        "Modern Genre",
        "Myths Genre",
        "Nature Genre",
        "Non Fiction Genre",
        "Philosophy Genre",
        "Plays Genre",
        "Poetry Genre",
        "Politics Genre",

        "1800s Genre",
        "1900s genre",
        "Heritage Radio Vault",

        "apk download",
        "apk game",
        "Appletfab LLC",
        "Audiobooks by Librivox",
        "Audiobooks On Line",
        "Audiobooks, Podcasts and More",
        "betting platform",
        "Coupon Code",
        "Coupons Code",
        "Discount Code",
        "earning app",
        "game download",
        "gaming platform",
        "gift card",
        "Inception Point AI",
        "Lumen Audio Studio",
        "online gaming",
        "Popular Culture and Religion",
        "Public Domain Books",
        "Public Domain",
        "Quiet. Please",

        //"Michela Bertazzo",
        //"Raghvendra Singh",
        "podvertise"
    ];

    function regexify(data) {
        data = data.replace(" ", "\s");
        data = data.replace(".", "\x2e");
        data = data.replace(":", "\x3a");

        return data;
    }

    function findTextElements() {
        targetTexts.forEach(text => {
            const lowerText = text.toLowerCase();
            const xpath = `//descendant-or-self::*[text()[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${lowerText}')]]` +
                  `[not(self::script)][not(self::style)][not(self::noscript)]`;

            const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            for (let i = 0; i < result.snapshotLength; i++) {
                const element = result.snapshotItem(i);
                element.style.border = "2px solid red";
                element.style.backgroundColor = "yellow";
                element.title = text;
            }
        });
    }


    function walkPodcasts() {
        // Find all matching div elements
        const podcastResults = document.querySelectorAll('div.result.podcast');

        // Loop through the collection
        podcastResults.forEach((podcast, index) => {

            /* Uncheck all checkboxes - non memory */
            const checkbox = podcast.querySelectorAll('input.markedForAction');
            if (checkbox[0].getAttribute('type') == 'checkbox') {
                if(checkbox[0].checked == true) {
                    checkbox[0].checked = false;
                }
            }

            /* This handles cases where byline is "Inception Point AI" */
            const byLine = podcast.querySelectorAll('div.result-row p');
            if (byLine[0].innerText == TEXT_IPAI) {

                const spamButton = podcast.querySelectorAll('div.spam-dropdown a.feedSpamMenu');
                if(spamButton[0].innerText == TEXT_SPAMBUTTON) {
                    spamButton[0].click();

                    const spam2Button = podcast.querySelectorAll('div.spam-menu a[data-reason="2"]');
                    setTimeout(function() {
                        spam2Button[0].click();
                    }, 300); // 0.3 seconds
                }
            }




        });
    }

    function curatenew() {
        /* find all feeds */
        const cards = document.querySelectorAll('div.curate-card');

        // Loop through the collection
        cards.forEach((podcast, index) => {
            let podcastTitle       = null;
            let podcastDescription = null;
            let podcastFeedURL     = null;

            /* Extract feedURL */
            const feedurl = podcast.querySelectorAll('a.feedurl');
            if (feedurl[0].href.length > 0) {
                podcastFeedURL = feedurl[0].href;

                for(let i = (feedURLs.length - 1); i >= 0; i--) {
                    const pattern = new RegExp(regexify(feedURLs[i]), "gi");
                    if (feedurl[0].href.match(pattern)) {
                        feedurl[0].style.border = "2px solid red";
                        feedurl[0].style.backgroundColor = "yellow";
                        feedurl[0].title = feedurl[0].title ? "" + feedURLs[i] + " " : "*";

                    }
                }
            }

            /* find casino domains */
            const description = podcast.querySelectorAll('div.description');
            if (description[0].innerText.length > 0) {
                podcastDescription = description[0].innerText;

                /* Highlight anything with casino-typical domain names in description */
                for(let i = (targetTLDs.length - 1); i >= 0; i--) {
                    const pattern = new RegExp("http(s)?\\x3a\\x2f\\x2f([a-z0-9]{1,})\\x2e" + targetTLDs[i] + "\\s", "gi");
                    if (description[0].innerText.match(pattern)) {
                        podcast.style.border = "2px solid red";
                        podcast.style.backgroundColor = "yellow";
                        podcast.title = podcast.title ? "" + targetTLDs[i] + " " : "*";
                    }
                }
            }



        });



    }



    // Execute the function
    // window.addEventListener('load', findTextElements);

    // window.addEventListener('load', walkPodcasts);

    if (window.location.href.match(/curatenew/gi)) {
        console.log('we are in curate');
        window.addEventListener('load', curatenew);

    }

    if (window.location.href.match(/curatekilled/gi)) {
        console.log('we are in curatekilled');
        window.addEventListener('load', curatenew);
    }


})();