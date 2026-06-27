// ==UserScript==
// @name         PodcastIndex.org Curation Helper
// @namespace    http://tampermonkey.net/
// @version      2026-06-27-2356
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

    const targetTLDs = [
        "info",
        "live",
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

        "escorts agency",
        "escort service",
        "model escort",
        "call girl",
        "injury law firm",
        "cabin rental",
        "home rental",
        "junk removal",
        "dumpster rental",
        "search engine optimisation",
        "referral code",
        "discount opportunity",
        "cleaning services",
        "Free Credit",
        "SEO service",
        "car leasing",
        "SEO training",
        "coupon code",
        "discount code",
        "offers referral-based",
        "BNBMAX",
        "Signup Discount",
        "casino games",
        "online gaming",
        "apk download",
        "apk game",
        "earning app",
        "game download",
        "gift card",
        "gaming platform",
        "betting platform"
    ];

    const ownersTexts = [
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
        "Autobiographies Genre",

        "Appletfab LLC",
        "Audiobooks by Librivox",
        "Audiobooks On Line",
        "Audiobooks, Podcasts and More",
        "Popular Culture and Religion",
        "Public Domain Books",
        "Public Domain",

        "Michela Bertazzo",
        "Raghvendra Singh",
        "Lumen Audio Studio",
        "Heritage Radio Vault",
        "Quiet. Please",
        "podvertise",

        "Inception Point AI"
    ];

    const titleTexts = [

        "escort service",
        "model escort",
        "call girl",
        "Old Time Radio",
        "Email Marketing",
        "Referral Entry",
        "Signup Discount",
        "Coupon Code",
        "Coupons Code",
        "Discount Code",
        "Rabattcode",
        "Rabatecode",
        "Referral Code",
        "Coupon code",
        "Promo Code"
    ];


    const targetTexts = [


        "Appletfab LLC",
        "Audiobooks by Librivox",
        "Audiobooks On Line",
        "Audiobooks, Podcasts and More",
        "Popular Culture and Religion",
        "Public Domain Books",
        "Public Domain",

        "podvertise"
    ];

    function regexify(data) {
        data = data.replace(" ", "\\s");
        data = data.replace(",", "\\x2c");
        data = data.replace("-", "\\x2d");
        data = data.replace(".", "\\x2e");
        data = data.replace("/", "\\x2f");
        data = data.replace(":", "\\x3a");

        return data;
    }

    function curatenew() {
        /* find all feeds */
        const cards = document.querySelectorAll('div.curate-card');

        // Loop through the collection
        cards.forEach((podcast, index) => {
            let podcastTitle = null;
            let podcastDescription = null;
            let podcastFeedURL = null;

            /* Extract Title */
            const title = podcast.querySelectorAll('h3 a');
            if (title[0].innerText.length > 0) {
                podcastTitle = title[0].innerText;

                for(let i = (titleTexts.length - 1); i >= 0; i--) {
                    const pattern = new RegExp(regexify(titleTexts[i]), "gi");
                    if (title[0].innerText.match(pattern)) {
                        title[0].style.border = "2px solid red";
                        title[0].style.backgroundColor = "yellow";
                        //title[0].title = title[0].title ? "" + titleTexts[i] + " " : "*";
                        title[0].hasAttribute('title')
                            ? title[0].setAttribute('title', title[0].getAttribute('title') + " " + titleTexts[i])
                            : title[0].setAttribute('title', titleTexts[i]);

                    }
                }
            }

            /* Extract feedURL */
            const feedurl = podcast.querySelectorAll('a.feedurl');
            if (feedurl[0].href.length > 0) {
                podcastFeedURL = feedurl[0].href;

                for(let i = (feedURLs.length - 1); i >= 0; i--) {
                    const pattern = new RegExp(regexify(feedURLs[i]), "gi");
                    if (feedurl[0].href.match(pattern)) {
                        feedurl[0].style.border = "2px solid red";
                        feedurl[0].style.backgroundColor = "yellow";
                        // feedurl[0].title = feedurl[0].title ? "" + feedURLs[i] + " " : "*";
                        feedurl[0].hasAttribute('title')
                            ? feedurl[0].setAttribute('title', feedurl[0].getAttribute('title') + " " + feedURLs[i])
                            : feedurl[0].setAttribute('title', feedURLs[i]);
                    }
                }
            }

            /* Extract Description */
            const description = podcast.querySelectorAll('div.description');
            if (description[0].innerText.length > 0) {
                podcastDescription = description[0].innerText;

                var domainHit = false;

                /* Highlight anything with casino-typical domain names in description as naked link */
                for(let i = (targetTLDs.length - 1); i >= 0; i--) {
                    const pattern = new RegExp("http(s)?\\x3a\\x2f\\x2f([a-z0-9]{1,})\\x2e" + targetTLDs[i] + "\\s", "gi");
                    if (description[0].innerText.match(pattern)) {
                        podcast.style.border = "2px solid red";
                        podcast.style.backgroundColor = "yellow";
                        //podcast.title = podcast.title ? "" + targetTLDs[i] + " " : "*";
                        podcast.hasAttribute('title')
                            ? podcast.setAttribute('title', podcast.getAttribute('title') + " " + targetTLDs[i])
                            : podcast.setAttribute('title', targetTLDs[i]);

                    }
                }

                /* Highlight anything with casino-typical domain names in description as naked domain */
                for(let i = (targetTLDs.length - 1); i >= 0; i--) {
                    const pattern = new RegExp("([a-z0-9]{1,})\\x2e" + targetTLDs[i], "gi");
                    if (description[0].innerText.match(pattern) && domainHit) {
                        podcast.style.border = "2px solid red";
                        podcast.style.backgroundColor = "yellow";
                        //podcast.title = podcast.title ? "" + targetTLDs[i] + " " : "*";
                        podcast.hasAttribute('title')
                            ? podcast.setAttribute('title', podcast.getAttribute('title') + " " + targetTLDs[i])
                            : podcast.setAttribute('title', targetTLDs[i]);

                    }
                }

                /* Highlight when words hit something */
                for(let i = (descriptionTexts.length - 1); i >= 0; i--) {
                    const pattern = new RegExp(regexify(descriptionTexts[i]), "gi");
                    if (description[0].innerText.match(pattern)) {
                        description[0].style.border = "2px solid red";
                        description[0].style.backgroundColor = "yellow";
                        //description[0].title = description[0].title ? "" + descriptionTexts[i] + " " : "*";
                        description[0].hasAttribute('title')
                            ? description[0].setAttribute('title', description[0].getAttribute('title') + " " + descriptionTexts[i])
                            : description[0].setAttribute('title', descriptionTexts[i]);

                    }
                }
            }


            /* Extract Owner */
            const byline = podcast.querySelectorAll('div.by-line');
            if (byline[0].innerText.length > 0) {
                // console.log(byline[0].innerText);
                for(let i = (ownersTexts.length - 1); i >= 0; i--) {
                    // console.log(ownersTexts[i]);
                    const pattern = new RegExp(regexify(ownersTexts[i]), "gi");
                    if (byline[0].innerText.match(pattern)) {
                        // console.log(pattern);
                        byline[0].style.border = "2px solid red";
                        byline[0].style.backgroundColor = "yellow";
                        // byline[0].title = byline[0].title ? "" + ownersTexts[i] + " " : "*";
                        byline[0].hasAttribute('title')
                            ? byline[0].setAttribute('title', byline[0].getAttribute('title') + " " + ownersTexts[i])
                            : byline[0].setAttribute('title', ownersTexts[i]);

                    }
                }
            }



        });



    }



    // Execute the function
    if (window.location.href.match(/curatenew/gi)) {
        console.log('we are in curate');
        window.addEventListener('load', curatenew);

    }

    if (window.location.href.match(/curatekilled/gi)) {
        console.log('we are in curatekilled');
        window.addEventListener('load', curatenew);
    }


})();