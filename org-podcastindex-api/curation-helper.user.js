// ==UserScript==
// @name         PodcastIndex.org Curation Helper
// @namespace    http://tampermonkey.net/
// @version      2026-07-14-1907
// @description  Highlights known-bad actors and helps with curation of podcast feeds on PodcastIndex.org
// @author       Christopher Isene <christopher.isene@gmail.com>
// @match        https://api.podcastindex.org/dashboard*
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
        "ai",
        "app",
        "bet",
        "black",
        "cab",
        "casino",
        "cc",
        "club",
        "info",
        "live",
        "ltd",
        "menu",
        "mobi",
        "online",
        "tel",
        "top",
        "win",
        "wiki",
        "win",
        "vip",
        "xyz",
        "xxx"
    ];

    const titleTexts = [
        "call girl",
        "call girls",
        "coupon code",
        "coupon code",
        "coupons code",
        "discount code",
        "email marketing",
        "escort service",
        "escorts service",
        "model escort",
        "old time radio",
        "online casino",
        "promo code",
        "rabatecode",
        "rabattcode",
        "referral code",
        "referral entry",
        "signup discount",
        "fast cash",

        "Nhật Code",


        "apk"
    ];

    const descriptionTexts = [
        "lorem ipsum dolor sit amet",

        "AI generated",
        "garage cleanout",
        "yard cleanout",
        "CALL US TODAY",

        "Nhật Code",
        "SEO strategy",
        "Generative Search optimization",
        "Search optimization",
        "keyword rankings",

        "100save",
        "accident lawyer",
        "ad network",
        "ad roll",
        "adtech marketing",
        "advertising campaign",
        "affiliate code",
        "affiliate link",
        "affiliate program",
        "agency",
        "agent",
        "apk download",
        "apk game",
        "apk",
        "aquarium filter",
        "arboriculture",
        "auto loan",
        "baccarat",
        "bad credit",
        "baked-in",
        "bankruptcy",
        "bathroom remodel",
        "betriver",
        "betting",
        "big winning",
        "blackjack",
        "bnbmax",
        "bonus code",
        "book guests",
        "booking agent",
        "bookmaker",
        "brand awareness",
        "business growth",
        "buy downloads",
        "buy reviews",
        "buyer-focused",
        "cabin rental",
        "call girl",
        "call girls",
        "campaign",
        "captivating",
        "car finance",
        "car leasing",
        "car loan",
        "car title",
        "car wash",
        "carpet cleaning",
        "cash back",
        "cash out",
        "casino games",
        "casino",
        "cleaning services",
        "club invite",
        "coaching program",
        "collab",
        "collaboration",
        "collateral",
        "commercial door",
        "commercial glass",
        "commercial painting",
        "commission",
        "computer shop",
        "conversion rate",
        "coupon code",
        "cpm",
        "credit rating",
        "credit repair",
        "credit score",
        "crypto casino",
        "crypto",
        "cryptocurrency",
        "curtain cleaning",
        "custom glass",
        "daily investor",
        "debt consolidation",
        "decking",
        "dental clinic",
        "dental service",
        "deposit bonus",
        "digital marketing",
        "discount code",
        "discount opportunity",
        "door installation",
        "door repair",
        "down payment",
        "drive traffic",
        "driveway",
        "dumpster rental",
        "dynamic ad",
        "dynamic insertion",
        "earning app",
        "echojeny40",
        "emergency roofing",
        "entertainment options",
        "epoxy floor",
        "equity line",
        "escort service",
        "escorts agency",
        "escorts service",
        "estimate quote",
        "expert guest",
        "fast cash",
        "fixed rate",
        "floor install",
        "floor tiling",
        "foreclosure",
        "forex",
        "free bet",
        "free credit",
        "free estimate",
        "free inspection",
        "free quote",
        "free spins",
        "free traffic",
        "gambling site",
        "gambling",
        "game download",
        "gaming experience",
        "gaming platform",
        "get10",
        "gift card",
        "glass repair",
        "glazier",
        "grout",
        "guaranteed downloads",
        "guaranteed listeners",
        "guaranteed reviews",
        "guest pitch",
        "gutters",
        "hardwood floor",
        "heating system",
        "high roller",
        "home equity",
        "home improvement",
        "home rental",
        "hookah",
        "host-read",
        "increase downloads",
        "increase listeners",
        "increase traffic",
        "industrial fan",
        "injury compensation",
        "injury law firm",
        "instagram growth",
        "interest rate",
        "invite code","opportunity to save",
        "jackpot",
        "junk removal",
        "laminate flooring",
        "lead generation",
        "leak repair",
        "leejeam",
        "lender",
        "lending",
        "link building",
        "linoleum",
        "live casino",
        "live dealer",
        "livescore",
        "loan approval",
        "local contractor",
        "lottery",
        "low apr",
        "low monthly",
        "luxury mattress",
        "luxury vinyl",
        "luxury watches",
        "mega moolah",
        "mid-roll",
        "mod APK",
        "model escort",
        "monetization",
        "monetize",
        "mortgage rate",
        "mortgage",
        "offers referral-based",
        "online bet",
        "online casino",
        "online gaming",
        "oral health care",
        "outreach",
        "painting service",
        "pari-mutuel",
        "paving contractor",
        "pitching",
        "plumbing solutions",
        "podcast network",
        "poker room",
        "poker",
        "post-roll",
        "powerball lottery",
        "pr agency",
        "pre-approval",
        "pre-approved",
        "pre-roll",
        "professionele glasdiensten",
        "promo code",
        "reach out",
        "real estate",
        "recovery service",
        "referans kodu",
        "referral code",
        "refinance",
        "repayment",
        "replica watches",
        "roof repair",
        "roofer",
        "roofing",
        "roulette",
        "scale your",
        "search engine optimisation",
        "seo expert",
        "seo optimization",
        "seo service",
        "seo training",
        "shein",
        "shingles",
        "shower door",
        "shuttle service",
        "siding",
        "signup discount",
        "slot machine",
        "slots",
        "smoke shop",
        "snapchat",
        "solicitation",
        "sponsor",
        "sponsorship",
        "sportsbook",
        "sports analytics",
        "subprime",
        "telegram",
        "tiktok",
        "tile installation",
        "tiling service",
        "timepiece",
        "title loan",
        "tow trucks",
        "tracking link",
        "trading day",
        "travel agency",
        "tree removal service",
        "unsolicited",
        "variable rate",
        "wager",
        "wagering requirement",
        "welcome bonus",
        "whatsapp me",
        "whatsapp",
        "win big",
        "window glass",
        "window replacement",

        "bit.ly",
        "tinyurl.com",
        "t.co",
        "cutt.ly",
        "rb.gy",
        "is.gd",
        "rebrand.ly",
        "ow.ly",

        /* Vietnamese betting and gambling */
        "bài bạc",
        "bắn cá",
        "cá cược",
        "cá độ",
        "casino trực tuyến",
        "cờ bạc",
        "đánh bài",
        "đánh bạc",
        "đánh đề",
        "đá gà",
        "ghi đề",
        "lô đề",
        "nhà cái",
        "nổ hũ",
        "quay hũ",
        "soi cầu",
        "sòng bạc",
        "sòng bài",
        "số đề",
        "tài xỉu",
        "trúng thưởng",
        "ty le keo",
        "tỷ lệ kèo",
        "xóc đĩa",
        "xsmn",
        "xsmb",
        "xsmt",

        "bao lô",
        "bắt kèo",
        "bệt",
        "chung tiền",
        "cược free",
        "đại lý game",
        "đổi thưởng",
        "đút túi",
        "gỡ gạc",
        "húp",
        "kèo thơm",
        "khuyến mãi khủng",
        "kiếm tiền online",
        "lên đời",
        "nạp rút",
        "nhận code",
        "ôm lô",
        "phán kèo",
        "soi kèo",
        "vào bờ",
        "vào tiền",
        "vip code",
        "win100",

        "8kbet",
        "789bet",
        "ae888",
        "bet88",
        "bk8",
        "fi88",
        "fun88",
        "f8bet",
        "hi88",
        "jun88",
        "m88",
        "shbet",
        "w88",

        /* Chinese languages betting and gambling */
        "博彩",
        "博彩",
        "赌场",
        "賭場",
        "娱乐城",
        "娛樂城",
        "线上博彩",
        "線上博彩",
        "体育投注",
        "體育投注",
        "真人视讯",
        "真人視訊",
        "棋牌",
        "百家乐",
        "百家樂",
        "老虎机",
        "老虎機",
        "捕鱼达人",
        "捕魚達人",
        "六合彩",
        "赛马",
        "賽馬",
        "滚球",
        "滾球",
        "盘口",
        "盤口",

        "充值",
        "充值",
        "提现",
        "提現",
        "秒到账",
        "秒到帳",
        "送彩金",
        "回血",
        "上岸",
        "狗庄",
        "狗莊",
        "洗码",
        "洗碼",
        "流水",
        "爆分",
        "红利",
        "紅利",
        "特邀",
        "下注",
        "倍投",
        "割韭菜",

        "ag真人",
        "bc网",
        "bc網",
        "bbin",
        "dubo",
        "da kuan",
        "hga",
        "mgs",
        "pinnacle",
        "pt电子",
        "pt電子",
        "shubo",
        "touzhu",
        "tzyz",
        "yabo",
        "亚博",
        "亞博",
        "开云",
        "開雲",
        "188bet",
        "365bet",
        "w88",
        "沙巴体育",
        "沙巴體育",



        "Your Podcast Name"
    ];

    const ownersTexts = [
        "1800s genre",
        "1900s genre",
        "19th and 20th century fiction",
        "action and adventure genre",
        "action&adventure fiction genre",
        "ancient genre",
        "animals and nature genre",
        "anthologies genre",
        "autobiographies genre",
        "biographies  genre",
        "biographies genre",
        "christianity genre",
        "culture and heritage classics",
        "detective fiction genre",
        "early modern genre",
        "family genre",
        "fantasy genre",
        "fiction classics",
        "general fiction genre",
        "general genre",
        "gothic genre",
        "greek and latin classics genre",
        "historical genre",
        "history genre",
        "horror genre",
        "humor genre",
        "humorous fiction genre",
        "isolatiebedrijf",
        "literary collections genre",
        "literary fiction genre",
        "memoirs genre",
        "modern genre",
        "myths genre",
        "nature genre",
        "non fiction genre",
        "philosophy genre",
        "plays genre",
        "poetry genre",
        "politics genre",
        "religion genre",
        "romance genre",
        "romance stories",
        "satire genre",
        "science fiction genre",
        "science genre",
        "short stories genre",
        "short works genre",

        "early modern",
        "single author genre",
        "war and military genre",
        "westerns genre",
        "assorted non fiction",
        "animals & nature",
        "family and culture",
        "popular audiobooks",
        "Legends and Fairy Tales",
        "Short Stories",


        "advertising campaign",
        "escorts service",
        "call girls",
        "spellbound audio",


        "AudioScholar",
        "solgoodmedia.com",
        "The Oldies Radio",
        "ANDREA MILANO AI",
        "Hidden Voices",

        "Let's Work This Sh*t Out",
        "Cloudcast",
        "SunnyVerse AI Labs",
        "Crime of the Truest Kind",
        "The Daily News Now!",
        "Launchpod Studios",
        "3 Peaks Studios",
        "Elite Personas LLC",
        "GMB Unlimited, LLC",
        "Dream Audio Books",
        "Pigeon Publishing House",
        "Appletfab LLC",
        "Audiobooks by Librivox",
        "Audiobooks On Line",
        "Audiobooks, Podcasts and More",
        "Heritage Radio Vault",
        "Popular Culture and Religion",
        "Public Domain Books",
        "Public Domain",

        "FIXME",
        "AI generated",
        "Neon Nights Studio",
        "Sol Good Media",
        "Sol Good Network",
        "TeeSnee AI",
        "The Podcast Network",
        "GSMC Podcast Network",
        "Audiobooks",

        "Rabbit Hole Brief",
        "Classic Stories on Audio!",
        "OBOMEDIA ENTERTAINMENT",
        "Neon Nights Network",
        "Tvweo",
        "ciesse",
        "Michela Bertazzo",
        "Raghvendra Singh",
        "Lumen Audio Studio",
        "Quiet. Please",
        "podvertise",
        "Inception Point AI"
    ];


    const feedURLs = [
        "pinecast.com",
        "firstory.me"
        // "spreaker.com"
    ];

    const feedURLprefixes = [
        "https://www.spreaker.com/show/",
        "https://([a-z0-9]{1,}).supabase.co/", /* Supabase.co */
        "https://feeds.fastcast.ai/", /* AI newsfeeds */
        "https://booksreader.space/", /* Booksreader - Audible */
        "https://s3.amazonaws.com/aplt1rss/", /* Appletfab LLC */
        "https://feeds.megaphone.fm/NPTNI" /* Inception Point AI */
    ];


    const feedURLlegit = [
        "https://librivox.org/rss/",
        "https://publicfeeds.net/",
        "http://feeds.prx.org/",
        "https://feeds.prx.org/",
        "https://f.prxu.org/",
        "http://feeds.pri.org/",
        "https://feeds.pri.org/",
        "https://www.wnycstudios.org/",
        "https://www.wpr.org/feeds/",
        "https://www.cpr.org/rss/",
        "https://pod.cpr.org/",
        "https://feeds.publicradio.org/",
        "https://www.iowapublicradio.org/podcast/",
        "https://www.wvxu.org/podcast/",
        "https://www.tpr.org/podcast/",
        "https://feeds.wgbh.org/",
        "https://www.mtpr.org/podcast/",
        "https://www.wdiy.org/podcast/",
        "https://thepublicsradio.org/",
        "https://www.northernpublicradio.org/",
        "https://www.gallifreypublicradio.com/feed/",
        "https://www.shadeauxpublicradio.com/",
        "https://podcasts.vpr.net/",
        "https://www.ijpr.org/podcast/",
        "https://www.southcarolinapublicradio.org/podcast/",
        "https://www.hpr2.org/podcasts/",

        "https://podcasts.files.bbci.co.uk/",
        "https://www.twr.org.uk/podcast_feed/",

        "https://radiofrance-podcast.net/",
        "https://podcast.college-de-france.fr/",
        "http://mauvaisgenre.org/",

        "https://www.voanews.com/podcast/",
        "https://www.voaindonesia.com/podcast/",
        "https://www.voakorea.com/podcast/",
        "https://www.dengiamerika.com/podcast/",
        "https://www.voandebele.com/podcast/",
        "https://www.voazimbabwe.com/podcast/",
        "https://www.dengeamerika.com/podcast/",
        "https://www.pashtovoa.com/podcast/",
        "https://burmese.voanews.com/rss/",
        "https://www.voadeewanews.com/podcast/",
        "https://www.voashona.com/podcast/",
        "https://www.voahausa.com/podcast/",
        "https://mk.voanews.com/podcast/",
        "https://www.amerikaovozi.com/podcast/",
        "https://learningenglish.voanews.com/rss/",

        "https://podcast.cism893.ca/radioshows/",

        "https://www.rte.ie/radio1/podcast/",
        "https://realsmartmedia.ie/podcasts/",
        "https://www.abartaheritage.ie/feed/",

        "https://www.radiomaria.ie/feed/",
        "https://www.manxradio.com/news/",
        "https://www.manxradio.com/podcasts/",
        "https://www.three.fm/on-air/podcasts/",
        "https://www.rfi.fr/",
        "https://apis.rfi.fr/",
        "https://www.france24.com/",
        "https://apis.france24.com/",
        "https://aod.nrjaudio.fm/xml/",
        "https://podcast.pulsradio.com/",
        "https://api.octopus.saooti.com/rss/emission/",
        "https://api.octopus.saooti.com/rss/",
        "https://info.ensemblefr.com/category/",
        "http://www.radioomega.fr/site/specific/rssEmission",
        "https://feeds.360.audion.fm/",

        "https://feeds.yle.fi/areena/v1/series/",

        "https://www.cbc.ca/podcasting/",
        "http://collectionscanada.gc.ca/obj/",
        "https://collectionscanada.gc.ca/obj/",
        "https://radio.nac-cna.ca/podcast/",
        "https://esp.radiomaria.ca/",
        "https://radiomaria.ca/",
        "https://ohdieux.ligature.ca/rss",
        "https://radiorfa.com/feed/podcast/",

        "https://feeds.megaphone.fm/CNE",
        "https://feeds.megaphone.fm/JXL",
        "https://feeds.megaphone.fm/RSU",
        "https://feeds.megaphone.fm/ESP",
        "https://feeds.megaphone.fm/POM",
        "https://feeds.megaphone.fm/COR",
        "https://feeds.megaphone.fm/FOX",
        "https://rss.podplaystudio.com/",
        "https://podcast.stream.schibsted.media/",
        "https://feed.pod.space/",
        "https://pod.mittmedia.se/",

        "https://podcast.radio.gov.pk/",
        "https://sbs-ondemand.streamguys1.com/",
        "https://radio.foxnews.com/category/podcast/",
        "http://www.foxradionetwork.com/",

        "http://podcast.faithcomesbyhearing.com/feeds/",
        "https://rss.beehiiv.com/podcasts/",

        "https://duelinggenre.com/category/podcasts/",
        "https://indiesats.com/api/feed",
        "https://podcast.gsmc.cloud/feed/",

        "https://feeds.soundcloud.com/users/soundcloud:users:",
        "https://feeds.libsyn.com/",
        "https://rss.libsyn.com/shows/",
        "https://rss.art19.com/",
        "https://media.rss.com/",
        "https://feeds.soundon.fm/podcasts/",
        "https://rss.alivepodcastnetwork.com/",
        "https://api.substack.com/feed/podcast/",
        "https://feeds.fountain.fm/",
        "https://feeds.godcaster.fm/",
        "https://feeds.audiomeans.fr/feed/",
        "https://latvijasradio.lsm.lv/",
        "https://www.vodio.fr/",
        "https://feed.pod.co/",
        "https://cdn.stationista.com/feeds/",
        "https://feeds.ktoo.org/",
        "https://musicsideproject.com/api/hosted/",
        "https://feed.justcast.com/shows/",
        "https://feeds.transistor.fm/",
        "https://feeds.captivate.fm/",
        "https://rss.com/podcasts/",
        "https://www.omnycontent.com/d/playlist/",
        "https://omnycontent.com/d/playlist/",
        "https://www.loyalbooks.com/book/",
        "http://www.loyalbooks.com/book/",
        "http://rss.acast.com/",
        "https://rss.acast.com/",
        "https://access.acast.com/rss/",
        "https://feeds.acast.com/public/shows/",
        "https://wavlake.com/feed/music/"
    ];

    const descriptionPhonenumbers = [
        { text: "USA/Canada", regex: new RegExp("\\x2b1(\\x2d)?([\\d\\x2d\\s]{8,10})", "gi")},

        { text: "Malaysia", regex: new RegExp("\\x2b60(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")},
        { text: "Philippines", regex: new RegExp("\\x2b63(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")},
        { text: "Thailand", regex: new RegExp("\\x2b66(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")},

        { text: "Japan", regex: new RegExp("\\x2b81(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")},
        { text: "South Korea", regex: new RegExp("\\x2b82(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")},

        { text: "Vietnam", regex: new RegExp("\\x2b84(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")},
        { text: "Hongkong", regex: new RegExp("\\x2b852(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")},
        { text: "Macao", regex: new RegExp("\\x2b853(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")},
        { text: "Cambodia", regex: new RegExp("\\x2b855(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")},
        { text: "Laos", regex: new RegExp("\\x2b856(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")},
        { text: "China", regex: new RegExp("\\x2b86(\\x2d)?([\\d\\x2d\\s]{8,13})", "gi")},
        { text: "Bangladesh", regex: new RegExp("\\x2b880(\\x2d)?([\\d\\x2d\\s]{8,13})", "gi")},

        { text: "India", regex: new RegExp("\\x2b91(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")},
        { text: "Pakistan", regex: new RegExp("\\x2b92(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")},
        { text: "Myanmar", regex: new RegExp("\\x2b95(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")}


    ];

    const authors = [
        "Aeschylus",
        "Aesop",
        "Anacreon",
        "Apuleius",
        "Aristophanes",
        "Aristotle",
        "Augustine of Hippo",
        "Marcus Aurelius",
        "Caesar, Julius",
        "Catullus",
        "Demosthenes",
        "Diodorus Siculus",
        "Diogenes Laërtius",
        "Epicurus",
        "Euripides",
        "Galen",
        "Herodotus",
        "Hesiod",
        "Hippocrates",
        "Homer",
        "Horace",
        "Josephus, Flavius",
        "Juvenal",
        "Livy",
        "Lucian of Samosata",
        "Lucretius",
        "Pindar",
        "Plato",
        "Plautus",
        "Pliny the Elder",
        "Pliny the Younger",
        "Plutarch",
        "Polybius",
        "Propertius",
        "Quintilian",
        "Sallust",
        "Sappho",
        "Seneca the Younger",
        "Sophocles",
        "Suetonius",
        "Tacitus",
        "Terence",
        "Theocritus",
        "Thucydides",
        "Virgil",
        "Xenophon",

        "Aesop",
        "Alcott, Louisa May",
        "Apuleius",
        "Augustine of Hippo",
        "Aurelius, Marcus",
        "Austen, Jane",
        "Balzac, Honoré de",
        "Baudelaire, Charles",
        "Blake, William",
        "Brontë, Charlotte and Emily",
        "Burns, Robert",
        "Caesar, Julius",
        "Carroll, Lewis",
        "Catullus",
        "Cervantes, Miguel de",
        "Chekhov, Anton",
        "Cicero, Marcus Tullius",
        "Coleridge, Samuel Taylor",
        "Cooper, James Fenimore",
        "Defoe, Daniel",
        "Descartes, René",
        "Dickens, Charles",
        "Dickinson, Emily",
        "Dostoevsky, Fyodor",
        "Douglass, Frederick",
        "Dumas, Alexandre",
        "Eliot, George",
        "Emerson, Ralph Waldo",
        "Fielding, Henry",
        "Flaubert, Gustave",
        "Galen",
        "Goethe, Johann Wolfgang von",
        "Gogol, Nikolai",
        "Grimm, Jacob and Wilhelm",
        "Hawthorne, Nathaniel",
        "Horace",
        "Hugo, Victor",
        "Ibsen, Henrik",
        "Irving, Washington",
        "Juvenal",
        "Kant, Immanuel",
        "Keats, John",
        "Livy",
        "Lucretius",
        "Melville, Herman",
        "Milton, John",
        "Molière",
        "Nietzsche, Friedrich",
        "Ovid",
        "Plautus",
        "Pliny the Elder and Pliny the Younger",
        "Poe, Edgar Allan",
        "Propertius",
        "Pushkin, Alexander",
        "Quintilian",
        "Rousseau, Jean-Jacques",
        "Sallust",
        "Schiller, Friedrich",
        "Scott, Sir Walter",
        "Seneca the Younger",
        "Shakespeare, William",
        "Shelley, Mary",
        "Shelley, Percy Bysshe",
        "Stevenson, Robert Louis",
        "Stoker, Bram",
        "Stowe, Harriet Beecher",
        "Suetonius",
        "Swift, Jonathan",
        "Tacitus",
        "Terence",
        "Thoreau, Henry David",
        "Tolstoy, Leo",
        "Twain, Mark",
        "Verne, Jules",
        "Virgil",
        "Voltaire",
        "Wells, H.G.",
        "Whitman, Walt",
        "Wilde, Oscar",
        "Wollstonecraft, Mary",
        "Wordsworth, William",

        "Agatha Christie",
        "Alexander Pushkin",
        "Alexandre Dumas",
        "Algernon Blackwood",
        "Ambrose Bierce",
        "Andrew Lang",
        "Anna Katharine Green",
        "Anthony Trollope",
        "Anton Chekhov",
        "Arthur Conan Doyle",
        "Arthur Machen",
        "Bram Stoker",
        "Charles Dickens",
        "Charlotte Brontë",
        "D. H. Lawrence",
        "E. F. Benson",
        "E. M. Forster",
        "E. Nesbit",
        "E. Phillips Oppenheim",
        "Edgar Allan Poe",
        "Edgar Rice Burroughs",
        "Edith Wharton",
        "Edward Everett Hale",
        "Elizabeth Gaskell",
        "Emily Brontë",
        "Emily Dickinson",
        "F. Scott Fitzgerald",
        "Frances Hodgson Burnett",
        "Franz Kafka",
        "Fyodor Dostoevsky",
        "G. K. Chesterton",
        "George Eliot",
        "George Gissing",
        "George MacDonald",
        "H. G. Wells",
        "H. P. Lovecraft",
        "H. Rider Haggard",
        "Henrik Ibsen",
        "Henry James",
        "Herman Melville",
        "Jack London",
        "James Joyce",
        "Jane Austen",
        "Joseph Conrad",
        "Jules Verne",
        "Kahlil Gibran",
        "Kate Chopin",
        "L. Frank Baum",
        "L. M. Montgomery",
        "Leo Tolstoy",
        "Lewis Carroll",
        "Lord Dunsany",
        "Louisa May Alcott",
        "Lucy Maud Montgomery",
        "M. R. James",
        "Marcel Proust",
        "Mark Twain",
        "Mary Shelley",
        "Maurice Leblanc",
        "Nathaniel Hawthorne",
        "Oscar Wilde",
        "Otis Adelbert Kline",
        "P. G. Wodehouse",
        "R. Austin Freeman",
        "Rabindranath Tagore  ",
        "Robert Frost",
        "Robert Louis Stevenson",
        "Rudyard Kipling",
        "Sinclair Lewis",
        "Stephen Crane",
        "Thomas Hardy",
        "Thomas Mann",
        "Thornton W. Burgess",
        "Victor Hugo",
        "Virginia Woolf",
        "W. B. Yeats",
        "Walt Whitman",
        "Washington Irving",
        "Wilkie Collins",
        "Willa Cather",
        "William Butler Yeats",
        "William Hope Hodgson",
        "William Shakespeare"
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
        target.setAttribute('title', existingTitle ? `${existingTitle}, ${matchText}` : matchText);
    }

    function flagElementLegit(element, matchText, highlightWholeCard = false) {
        const target = highlightWholeCard ? element.closest('div.curate-card') : element;
        if (!target) return;

        target.style.color = "white";
        target.style.border = "2px solid yellow";
        target.style.backgroundColor = "green";

        const existingTitle = target.getAttribute('title');
        target.setAttribute('title', existingTitle ? `${existingTitle}, ${matchText}` : matchText);
    }


    // --- Pre-compile Regexes once to save computing power ---
    const titlePatterns = titleTexts.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));
    const feedPatterns = feedURLs.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));
    const feedPrefixPatterns = feedURLprefixes.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));
    const descPatterns = descriptionTexts.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));
    const ownerPatterns = ownersTexts.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));

    const feedLegit = feedURLlegit.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));

    const nakedLinkPatterns = targetTLDs.map(tld => ({ tld, regex: new RegExp(`http(s)?\\x3a\\x2f\\x2f[a-z0-9\x2d\x2e]{1,}\\x2e${tld}\\s`, "gi") }));
    const nakedLinkDomainPatterns = targetTLDs.map(tld => ({ tld, regex: new RegExp(`([a-z0-9\x2d\x2e]{1,})\\x2e${tld}`, "gi") }));
    const nakedDomainPatterns = targetTLDs.map(tld => ({ tld, regex: new RegExp(`([a-z0-9\x2d\x2e]{1,})\\x2e${tld}`, "gi") }));


    // --- Main Curation Logic ---
    function curate() {
        const cards = document.querySelectorAll('div.curate-card');

        var markNumber = 30; /* mark number when hijcked */
        var podcast_byline = false;
        var podcast_desc = false;
        var podcast_url = false;

        cards.forEach((podcast) => {

            podcast_byline = false;
            podcast_desc = false;
            podcast_url = false;


            /* 1. Extract & Test Title */
            const titleEl = podcast.querySelector('h3 a');
            if (titleEl && titleEl.innerText.trim().length > 0) {
                const text = titleEl.innerText;
                titlePatterns.forEach(item => {
                    if (text.match(item.regex)) {
                        flagElement(titleEl, item.text);
                    }
                });
            }

            /* 2. Extract & Test feedURL */
            const feedUrlEl = podcast.querySelector('a.feedurl');
            if (feedUrlEl && feedUrlEl.href.length > 0) {
                const url = feedUrlEl.href;

                /* Compare to known domains */
                feedPatterns.forEach(item => {
                    if (url.match(item.regex)) {
                        flagElement(feedUrlEl, item.text);
                        podcast_url = true;
                    }
                });

                /* Compare to known prefixes */
                feedPrefixPatterns.forEach(item => {
                    if (url.match(item.regex)) {
                        flagElement(feedUrlEl, item.text);
                        podcast_url = true;
                    }
                });

                feedLegit.forEach(item => {
                    if (url.match(item.regex)) {
                        flagElementLegit(feedUrlEl, item.text);
                        podcast_url = true;
                    }
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
                        podcast_desc = true;
                    }
                });
                // console.log(nakedLinkPatterns);

                // Highlight naked domains (Runs correctly now if a domain hit occurred)
                nakedDomainPatterns.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(podcast, item.tld);
                        podcast_desc = true;
                    }
                });
                // console.log(nakedDomainPatterns);

                /* Different domain struct */
                nakedLinkDomainPatterns.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(podcast, item.tld);
                        podcast_desc = true;
                    }
                });
                // console.log(nakedLinkDomainPatterns);

                /* Look for feedPrefixes */
                feedPrefixPatterns.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(podcast, item.tld);
                        podcast_desc = true;
                    }
                });

                // Highlight bad keywords
                descPatterns.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(descEl, item.text);
                        podcast_desc = true;
                    }
                });

                descriptionPhonenumbers.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(descEl, 'Phonenumber ' + item.text);
                        podcast_desc = true;
                    }
                });

            }

            /* 4. Extract & Test Owner / Byline */
            const bylineEl = podcast.querySelector('div.by-line');
            if (bylineEl && bylineEl.innerText.trim().length > 0) {
                const bylineText = bylineEl.innerText;
                ownerPatterns.forEach(item => {
                    if (bylineText.match(item.regex)) {
                        flagElement(bylineEl, item.text);
                        podcast_byline = true;
                    }
                });
            }

            console.log(podcast_desc, podcast_byline, podcast_url);
            if (podcast_url == true && podcast_byline == true && markNumber > 0) {
                const podcastCheckbox = podcast.querySelector('div.col-image input.checkbox-overlay');
                console.log(podcastCheckbox);
                podcastCheckbox.checked = true;
                markNumber -= 1;
            }
        });
    }

    function searchpages() {
        console.log('searchPages - start');
        const cards = document.querySelectorAll('div.result.podcast');
        var title = "";
        var url = "";
        var descText = "";
        var bylineText = "";

        cards.forEach((podcast) => {
            if (podcast.querySelector('div.data-curation-state')) {
                console.log('curation-state');
            }

            /* 1. Extract & Test Title */
            const titleEl = podcast.querySelector('div.result-title');
            if (titleEl && titleEl.innerText.trim().length > 0) {
                let title = titleEl.innerText;
                titlePatterns.forEach(item => {
                    if (title.match(item.regex)) {
                        flagElement(titleEl, item.text);
                    }
                });
            }

            /* 2. Extract & Test feedURL */
            const feedUrlEl = podcast.querySelector('a.feedurl');
            if (feedUrlEl && feedUrlEl.href.length > 0) {
                url = feedUrlEl.href;

                /* Compare to known domains */
                feedPatterns.forEach(item => {
                    if (url.match(item.regex)) {
                        flagElement(feedUrlEl, item.text);
                    }
                });

                /* Compare to known prefixes */
                feedPrefixPatterns.forEach(item => {
                    if (url.match(item.regex)) {
                        flagElement(feedUrlEl, item.text);
                    }
                });

                feedLegit.forEach(item => {
                    if (url.match(item.regex)) {
                        flagElementLegit(feedUrlEl, item.text);
                        // podcast_url = true;
                    }
                });

            }

            /* 3. Extract & Test Description */
            const descEl = podcast.querySelector('li.result-description');
            if (descEl && descEl.innerText.trim().length > 0) {
                let descText = descEl.innerText;
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
                    if (descText.match(item.regex)) {
                        flagElement(podcast, item.tld);
                    }
                });

                // Highlight bad keywords
                descPatterns.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(descEl, item.text);
                    }
                });
            }

            /* 4. Extract & Test Owner / Byline */
            const bylineEl = podcast.querySelector('div.result-info p');
            if (bylineEl && bylineEl.innerText.trim().length > 0) {
                bylineText = bylineEl.innerText;
                ownerPatterns.forEach(item => {
                    if (bylineText.match(item.regex)) {
                        flagElement(bylineEl, item.text);
                    }
                });
            }


            if (url.match(/spreaker\x2ecom/gi)) {
                if (bylineText.match(/Audiobooks\sby\sLibrivox/gi)) {
                    const spamButton = podcast.querySelector('div.spam-dropdown a.feedSpamMenu');
                    spamButton.click();
                    const spamMenu = podcast.querySelector('div.spam-menu a[data-reason="6"]');
                    setTimeout(() => {
                        if (spamMenu) {
                            spamMenu.click();
                        }
                    }, 250);
                }
            }

            if (url.match(/http(s)?\x3a\x2f\x2fs3\x2eamazonaws\x2ecom\x2faplt1rss\x2f\d{1,}\x2erss/gi)) {
                const spamButton = podcast.querySelector('div.spam-dropdown a.feedSpamMenu');
                spamButton.click();
                const spamMenu = podcast.querySelector('div.spam-menu a[data-reason="6"]');
                setTimeout(() => {
                    if (spamMenu) {
                        spamMenu.click();
                    }
                }, 250);

            }

        });

    }

    function searchbuttonrandom() {
        console.log('SearchButtonRandom - start');
        const targetNav = document.querySelectorAll('form.form-inline')[0]; /* form.form-inline */
        console.log(targetNav);

        const randomBtn = document.createElement('button');
        randomBtn.style = "width:80px;height:25px";
        randomBtn.class = "btn btn-outline";
        randomBtn.textContent = 'Random Author';

        if (targetNav) {
            // targetNav.appendChild(randomBtn);
            // targetNav.prependChild(randomBtn);
        } else {
            console.warn("Element with id 'navbarSupportedContent' not found.");
        }


        // 3. Add the click event listener functionality
        randomBtn.addEventListener('click', () => {
            // Pick a random author
            const randomAuthor = authors[Math.floor(Math.random() * authors.length)];

            // Find the input element and populate it
            const searchInput = document.getElementById('searchText');
            if (searchInput) {
                searchInput.value = randomAuthor;
                searchInput.name = "q";

                // Dispatch an input event in case the site relies on framework listeners (like React/Vue)
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            }

            // Find the trigger button and click it
            const searchTrigger = document.getElementById('searchTrigger');
            if (searchTrigger) {
                if(searchInput.value.length > 0) {
                    searchInput.keyup();
                    searchTrigger.click();
                }
            }
        });
        targetNav.appendChild(randomBtn);
        console.log('SearchButtonRandom - end');
    }


    // --- Execution Triggers ---
    if (/curatenew|curatekilled/gi.test(window.location.href)) {
        console.log('PodcastIndex Curation Helper Active.');
        window.addEventListener('load', curate);
    }

    if (/dashboard/gi.test(window.location.href)) {
        console.log('PodcastIndex Curation Helper Active.');
        window.addEventListener('load', searchpages);
        window.addEventListener('ready', searchpages);
        window.addEventListener('load', searchbuttonrandom);
    }



})();