// ==UserScript==
// @name         PodcastIndex.org Curation Helper
// @namespace    http://tampermonkey.net/
// @version      2026-06-28-1917
// @description  Highlights known-bad actors and helps with curation of podcast feeds on PodcastIndex.org
// @author       Christopher Isene <christopher.isene@gmail.com>
// @match        https://api.podcastindex.org/dashboard?q=*
// @match        https://api.podcastindex.org/curatekilled*
// @match        https://api.podcastindex.org/curatenew*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=podcastindex.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- Configurations ---
    const targetTLDs = [
        "app",
        "cab",
        "cc",
        "info",
        "live",
        "menu",
        "mobi",
        "online",
        "tel",
        "top",
        "xxx"
    ];

    const titleTexts = [
        "escort service", "model escort", "call girl", "Old Time Radio", "Email Marketing",
        "Referral Entry", "Signup Discount", "Coupon Code", "Coupons Code", "Discount Code",
        "Rabattcode", "Rabatecode", "Referral Code", "Coupon code", "Promo Code"
    ];

    const descriptionTexts = [
        "escorts agency", "escort service", "model escort", "call girl", "injury law firm",
        "cabin rental", "home rental", "junk removal", "dumpster rental", "search engine optimisation",
        "referral code", "discount opportunity", "cleaning services", "Free Credit", "SEO service",
        "car leasing", "SEO training", "coupon code", "discount code", "offers referral-based",
        "BNBMAX", "Signup Discount", "casino games", "online gaming", "apk download", "apk game",
        "earning app", "game download", "gift card", "gaming platform", "betting platform"
    ];

    const ownersTexts = [
        "1800s Genre", "1900s genre",
        "Action&Adventure Fiction Genre", "Action and Adventure Genre", "Ancient Genre", "Animals and Nature Genre", "Anthologies Genre", "Autobiographies Genre",
        "Biographies  Genre", "Biographies Genre",
        "Christianity Genre", "Culture and Heritage classics",
        "Detective Fiction Genre",
        "Early Modern Genre",
        "Family Genre",
        "Fantasy Genre",
        "General Fiction Genre", "General Genre", "Gothic Genre", "Greek and Latin Classics Genre",
        "Historical Genre", "History Genre", "Horror Genre", "Humor Genre", "Humorous Fiction Genre",
        "Literary Collections Genre", "Literary Fiction Genre",
        "Memoirs Genre", "Modern Genre", "Myths Genre",
        "Nature Genre", "Non Fiction Genre",
        "Philosophy Genre", "Plays Genre", "Poetry Genre", "Politics Genre",
        "Religion Genre",

        "Appletfab LLC",
        "Audiobooks by Librivox",
        "Audiobooks On Line",

        "Audiobooks, Podcasts and More",
        "Popular Culture and Religion",
        "Public Domain Books",

        "Public Domain",
        "Heritage Radio Vault",

        "ciesse",
        "Michela Bertazzo",
        "Raghvendra Singh",
        "Lumen Audio Studio",
        "Quiet. Please",
        "podvertise", "Inception Point AI"
    ];


    const feedURLs = [
        "pinecast.com", "firstory.me", "spreaker.com"
    ];

    const feedURLprefixes = [
        "https://booksreader.space/", /* Booksreader - Audible */
        "https://s3.amazonaws.com/aplt1rss/", /* Appletfab LLC */
        "https://feeds.megaphone.fm/NPTNI" /* Inception Point AI */
    ];


    const descriptionPhonenumbers = [
        new RegExp("\\x2b91(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi") /* India */
    ];


    // --- Helper Functions ---
    function escapeRegExp(string) {
        // Automatically and safely escapes all regex special characters globally
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s');
    }

    // Helper to avoid duplicate style and title updating logic
    function flagElement(element, matchText, highlightWholeCard = false) {
        const target = highlightWholeCard ? element.closest('div.curate-card') : element;
        if (!target) return;

        target.style.border = "2px solid red";
        target.style.backgroundColor = "yellow";

        const existingTitle = target.getAttribute('title');
        target.setAttribute('title', existingTitle ? `${existingTitle} ${matchText}` : matchText);
    }

    // --- Pre-compile Regexes once to save computing power ---
    const titlePatterns = titleTexts.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));
    const feedPatterns = feedURLs.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));
    const feedPrefixPatterns = feedURLprefixes.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));
    const descPatterns = descriptionTexts.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));
    const ownerPatterns = ownersTexts.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));

    const nakedLinkPatterns = targetTLDs.map(tld => ({ tld, regex: new RegExp(`http(s)?\\x3a\\x2f\\x2f[a-z0-9]{1,}\\x2e${tld}\\s`, "gi") }));
    const nakedLinkDomainPatterns = targetTLDs.map(tld => ({ tld, regex: new RegExp(`([a-z0-9]{1,})\\x2e${tld}`, "gi") }));
    const nakedDomainPatterns = targetTLDs.map(tld => ({ tld, regex: new RegExp(`([a-z0-9]{1,})\\x2e${tld}`, "gi") }));

    // --- Main Curation Logic ---
    function curate() {
        const cards = document.querySelectorAll('div.curate-card');

        cards.forEach((podcast) => {
            /* 1. Extract & Test Title */
            const titleEl = podcast.querySelector('h3 a');
            if (titleEl && titleEl.innerText.trim().length > 0) {
                const text = titleEl.innerText;
                titlePatterns.forEach(item => {
                    if (text.match(item.regex)) flagElement(titleEl, item.text);
                });
            }

            /* 2. Extract & Test feedURL */
            const feedUrlEl = podcast.querySelector('a.feedurl');
            if (feedUrlEl && feedUrlEl.href.length > 0) {
                const url = feedUrlEl.href;

                /* Compare to known domains */
                feedPatterns.forEach(item => {
                    if (url.match(item.regex)) flagElement(feedUrlEl, item.text);
                });

                /* Compare to known prefixes */
                feedPrefixPatterns.forEach(item => {
                    if (url.match(item.regex)) flagElement(feedUrlEl, item.text);
                });
            }

            /* 3. Extract & Test Description */
            const descEl = podcast.querySelector('div.description');
            if (descEl && descEl.innerText.trim().length > 0) {
                const descText = descEl.innerText;

                // Highlight naked link formats
                nakedLinkPatterns.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(podcast, item.tld);
                    }
                });
                // console.log(nakedLinkPatterns);

                // Highlight naked domains (Runs correctly now if a domain hit occurred)
                nakedDomainPatterns.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(podcast, item.tld);
                    }
                });
                // console.log(nakedDomainPatterns);

                /* Different domain struct */
                nakedLinkDomainPatterns.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(podcast, item.tld);
                    }
                });
                // console.log(nakedLinkDomainPatterns);

                /* Look for feedPrefixes */
                feedPrefixPatterns.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(podcast, item.tld);
                    }
                });

                // Highlight bad keywords
                descPatterns.forEach(item => {
                    if (descText.match(item.regex)) flagElement(descEl, item.text);
                });
            }

            /* 4. Extract & Test Owner / Byline */
            const bylineEl = podcast.querySelector('div.by-line');
            if (bylineEl && bylineEl.innerText.trim().length > 0) {
                const bylineText = bylineEl.innerText;
                ownerPatterns.forEach(item => {
                    if (bylineText.match(item.regex)) flagElement(bylineEl, item.text);
                });
            }
        });
    }

    function searchPages() {
        const cards = document.querySelectorAll('div.result.podcast');

        cards.forEach((podcast) => {
            if (podcast.querySelector('div.data-curation-state')) {
                console.log('curation-state');
            }

            /* 1. Extract & Test Title */
            const titleEl = podcast.querySelector('div.result-title');
            if (titleEl && titleEl.innerText.trim().length > 0) {
                const text = titleEl.innerText;
                titlePatterns.forEach(item => {
                    if (text.match(item.regex)) flagElement(titleEl, item.text);
                });
            }

            /* 2. Extract & Test feedURL */
            const feedUrlEl = podcast.querySelector('a.feedurl');
            if (feedUrlEl && feedUrlEl.href.length > 0) {
                const url = feedUrlEl.href;

                /* Compare to known domains */
                feedPatterns.forEach(item => {
                    if (url.match(item.regex)) flagElement(feedUrlEl, item.text);
                });

                /* Compare to known prefixes */
                feedPrefixPatterns.forEach(item => {
                    if (url.match(item.regex)) flagElement(feedUrlEl, item.text);
                });

            }

            /* 3. Extract & Test Description */
            const descEl = podcast.querySelector('li.result-description');
            if (descEl && descEl.innerText.trim().length > 0) {
                const descText = descEl.innerText;
                let isFlaggedDomain = false;

                // Highlight naked link formats
                nakedLinkPatterns.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(podcast, item.tld);
                        isFlaggedDomain = true; // Fixed logic: registers that we found a TLD hit!
                    }
                });

                // Highlight naked domains (Runs correctly now if a domain hit occurred)
                nakedDomainPatterns.forEach(item => {
                    if (descText.match(item.regex) && isFlaggedDomain) {
                        flagElement(podcast, item.tld);
                    }
                });

                // Highlight bad keywords
                descPatterns.forEach(item => {
                    if (descText.match(item.regex)) flagElement(descEl, item.text);
                });
            }

            /* 4. Extract & Test Owner / Byline */
            const bylineEl = podcast.querySelector('div.result-title p');
            if (bylineEl && bylineEl.innerText.trim().length > 0) {
                const bylineText = bylineEl.innerText;
                ownerPatterns.forEach(item => {
                    if (bylineText.match(item.regex)) flagElement(bylineEl, item.text);
                });
            }


        });

    }

    // --- Execution Triggers ---
    if (/curatenew|curatekilled/gi.test(window.location.href)) {
        console.log('PodcastIndex Curation Helper Active.');
        window.addEventListener('load', curate);
    }

    if (/dashboard/gi.test(window.location.href)) {
        console.log('PodcastIndex Curation Helper Active.');
        window.addEventListener('load', searchPages);
    }


})();