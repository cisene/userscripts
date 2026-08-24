// ==UserScript==
// @name         PodcastIndex.org Curation Helper
// @namespace    http://tampermonkey.net/
// @version      2026-08-25-0015
// @description  Highlights known-bad actors and helps with curation of podcast feeds on PodcastIndex.org
// @author       Christopher Isene <christopher.isene@gmail.com>
// @match        https://api.podcastindex.org/dashboard*
// @match        https://api.podcastindex.org/dashboard?q=.*
// @match        https://api.podcastindex.org/curatekilled*
// @match        https://api.podcastindex.org/curatenew*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=podcastindex.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- Configurations ---
    const targetTLDs = [
        "ae\\x2eorg",
        "ai",
        "app",
        "army",
        "art",
        "baby",
        "bet",
        "bet\\x2eph",
        "biz",
        "black",
        "cab",
        "casino",
        "cc",
        "cheap",
        "com",
        "com\\x2epk",
        "contact",
        "club",
        "click",
        "cn\\x2ecom",
        "design",
        "expert",
        "fund",
        "gb\\x2enet",
        "green",
        "info",
        "investments",
        "io",
        "im",
        "lat",
        "life",
        "live",
        "llc",
        "ltd",
        "menu",
        "mobi",
        "moda",
        "my",
        "name",
        "online",
        "org\\x2epk",
        "plus",
        "run",
        "shopping",
        "store",
        "tel",
        "tech",
        "tips",
        "top",
        "us\\x2ecom",
        "vegas",
        "wales",
        "watch",
        "wiki",
        "win",
        "win\\x2epk",
        "world",
        "works",
        "video",
        "vip",
        "xyz",
        "zone",
        "xxx"
    ];

    const titleTexts = [

        "El podcast de ",
        "'s Podcast",
        "s Podcast",
        "podcast de ",
        "Il podcast di ",
        "El show de",
        "Prueba",
        "Tripplo",


        "Código",
        "Casino",
        "Betting",
        "AI ",
        "LLM",
        "Reddit",
        "Giveaway",
        "Benefits",
        "Código de Referência",
        "Binance",
        "Referans Kodu",
        "PayPal Account",
        "slot games",
        "2 Minutes with Joey",
        "partner code",
        "call girl",
        "call girls",
        "coupon code",
        "coupons code",
        "discount code",
        "referral id",
        "Invite Code",
        "Partner Code",
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
        "HappyMod",
        "Roblox",
        "Nhật Code",
        "apk"
    ];

    const descriptionTexts = [
        "lorem ipsum dolor sit amet",

        "Trimix",
        "GO88",

        "font-claude-response-body",

        "100save",
        "2 minutes with joey",
        "3d kitchen",
        "a gemini generated podcast",
        "a. lange & söhne",
        "acabamentos para projetos",
        "academic content development",
        "academic journey",
        "academic performance",
        "academic progress",
        "accident lawyer",
        "account access",
        "accounting fraud",
        "accounting system",
        "accounting",
        "accurate addressing",
        "accurate financial data",
        "ad network",
        "ad roll",
        "adidas",
        "adobe after effects",
        "adobe audition",
        "adobe illustrator",
        "adobe lightroom",
        "adtech marketing",
        "advertising campaign",
        "aesthetic-management services",
        "affiliate code",
        "affiliate link",
        "affiliate program",
        "agricultural construction",
        "ai flagged",
        "ai generated",
        "ai narration",
        "ai news",
        "ai presenter",
        "ai tools",
        "ai-powered seo",
        "ai-powered",
        "air conditioners",
        "airport limo",
        "airport transfers",
        "all-in-one platform",
        "alloy wheel refurbishment",
        "animal hospital",
        "annual financial statements",
        "answer engine optimization",
        "apartment moving",
        "apk download",
        "apk game",
        "apk",
        "app launch strategies",
        "applying for loans",
        "aquarium filter",
        "arboriculture",
        "architectural details",
        "arranging repairs",
        "artificial intelligence",
        "assisted living",
        "attendance information",
        "audemars piguet",
        "audi\b",
        "audience interaction",
        "auto body repairs",
        "auto loan",
        "automated interactions",
        "autonomous education",
        "b2b seo",
        "baccarat",
        "bad credit",
        "baked-in",
        "balance sheets",
        "balenciaga",
        "balmain",
        "bank account balance",
        "banking coach",
        "bankruptcy",
        "bathroom remodel",
        "beginner vapers",
        "berluti",
        "betriver",
        "betting show",
        "betting",
        "bidding",
        "big winning",
        "biggest bets",
        "bike rental",
        "billing operations",
        "billion-dollar companies",
        "billionaire mindset",
        "binance",
        "biotech companies",
        "birth injury",
        "blackjack",
        "blockchain",
        "blocked drain",
        "bmw\b",
        "bnbmax",
        "bodybuilding",
        "bonus code",
        "bonuspromo",
        "book accommodations",
        "book guests",
        "booking agent",
        "bookkeeping",
        "bookmaker",
        "boost seo",
        "bottega veneta",
        "brand awareness",
        "branding techniques",
        "brunello cucinelli",
        "build or remodel",
        "bumper repair services",
        "bumper repair",
        "burberry",
        "bus accidents",
        "bus rentals",
        "business car",
        "business coach",
        "business consultancy",
        "business growth",
        "business insights",
        "business investing",
        "business models",
        "business ownership",
        "business succession",
        "business vehicle",
        "buy downloads",
        "buy reviews",
        "buy verified",
        "buyer-focused",
        "buying a verified",
        "cabin rental",
        "cabinet brands",
        "call girl service",
        "call girl",
        "call girls",
        "call us today",
        "campaign",
        "capital allocation",
        "capital management",
        "car accidents",
        "car body repair services",
        "car finance",
        "car insurance",
        "car leasing",
        "car loan",
        "car removal",
        "car rental",
        "car title",
        "car valeting",
        "car wash",
        "card games",
        "caregiving",
        "carpet cleaning",
        "cartier",
        "cash back",
        "cash card",
        "cash for cars",
        "cash out",
        "cash payment",
        "cash quotes",
        "casino games",
        "casino",
        "casino-style gaming",
        "casual outfits",
        "catering firm",
        "ceramic coating",
        "certified manufacturers",
        "chanel",
        "change orders",
        "charter bus rental",
        "charter bus",
        "chatgpt",
        "chauffeured",
        "child-led education",
        "chiropractor",
        "christian louboutin",
        "classical refinement",
        "claude",
        "cleaning services",
        "clever marketing tricks",
        "clinical integrity",
        "clinically appropriate",
        "cloro",
        "closing costs",
        "clothing store",
        "club invite",
        "coach hire",
        "coaching program",
        "code de parrainage",
        "code promo",
        "codice sconto",
        "collab",
        "collaboration",
        "collateral",
        "colorful balloons",
        "commercial construction",
        "commercial door",
        "commercial environments",
        "commercial glass",
        "commercial interiors",
        "commercial moving",
        "commercial painting",
        "commercial properties",
        "commercial real estate",
        "commercial roofing solutions",
        "commercial spaces",
        "commercial trucks",
        "commercial vehicle",
        "commission",
        "common roofing issues",
        "complicated moving",
        "complimentary consultation",
        "compounded medications",
        "computer shop",
        "concept development",
        "confident homeowner",
        "construction costs",
        "consultation",
        "consumer psychology",
        "contemporary flair",
        "content creation tips",
        "contracts",
        "conventional parenting",
        "conversion rate",
        "coordinating building access",
        "copilot",
        "copper recycling",
        "corporate executive",
        "corporate ladder",
        "corporate relocation",
        "corporate strategies",
        "corporate travel",
        "cosmetic dentistry",
        "coupon code",
        "coupon de réduction",
        "cpm",
        "crafted with the help of ai",
        "craftsmanship",
        "creatine",
        "credit card",
        "credit improvement",
        "credit management",
        "credit profile",
        "credit rating",
        "credit repair process",
        "credit repair",
        "credit score",
        "credit union",
        "credit-related challenges",
        "credit-report concerns",
        "cricket betting",
        "cricket id",
        "cricket news",
        "criminal defense",
        "crockett & jones",
        "cross-country relocations",
        "crypto casino",
        "crypto collapse",
        "crypto",
        "cryptocurrency",
        "curb rash",
        "curtain cleaning",
        "custom glass",
        "custom jewellery",
        "custom prescriptions",
        "código de indicação",
        "código de referido",
        "daily investor",
        "dakbedekking",
        "dakbehoeften",
        "dakdekker",
        "dakdekkersdiensten",
        "dakinstallaties",
        "dakkapellen",
        "dakonderhoud",
        "dakreparaties",
        "dark toto",
        "data destruction",
        "data security",
        "de podcast van",
        "debit card",
        "debt consolidation",
        "debt relief",
        "decentralized education",
        "decking",
        "dementia",
        "dent removal",
        "dental care center",
        "dental care",
        "dental clinic",
        "dental crowns",
        "dental entrepreneurs",
        "dental implants",
        "dental office",
        "dental operation",
        "dental practice",
        "dental products",
        "dental professionals",
        "dental prosthesis",
        "dental service",
        "dental tools",
        "dental-management services",
        "deposit bonus",
        "dermatology",
        "deschooling",
        "designer boutique",
        "designer clothing",
        "digital agencies",
        "digital entertainment",
        "digital marketing",
        "digital staffing",
        "digital trading platform",
        "dior",
        "direct mail marketing",
        "discount code",
        "discount opportunity",
        "dispensing prescriptions",
        "dolce & gabbana",
        "door installation",
        "door repair",
        "down payment",
        "download our app",
        "drain blockage",
        "drain cleaning",
        "drain maintenance",
        "drainage system",
        "dream home",
        "drive traffic",
        "driveway",
        "drywall repair",
        "due diligence",
        "dumpster rental",
        "dynamic ad",
        "dynamic insertion",
        "e-waste management",
        "e-waste pickup",
        "earn from bonuses",
        "earning app",
        "earning chances",
        "earning methods",
        "easy withdrawals",
        "echojeny40",
        "eco-friendly vehicle disposal",
        "ecommerce seo",
        "economic conditions",
        "edward green",
        "electrical estimating",
        "electronics recycling",
        "electronique cigarette",
        "eligible purchases",
        "eliminate infestations",
        "emergency dentistry",
        "emergency plumbing",
        "emergency repair",
        "emergency roofing",
        "emergency treatment",
        "emerging investment",
        "emotional support animal",
        "empfehlungscode",
        "entertainment options",
        "entertainment platform",
        "entrepreneurial journey",
        "entrepreneurship",
        "epoxy floor",
        "equipment production",
        "equipos",
        "equity line",
        "escort girl",
        "escort service",
        "escorts agency",
        "escorts service",
        "estate planning",
        "estimate quote",
        "eucode",
        "evaluate opportunities",
        "evidence based investing",
        "evidencia",
        "examination results",
        "excavating",
        "excavation advice",
        "exceptional packaging",
        "experienced linguists",
        "experienced vapers",
        "experienced veterinary",
        "experimental ai",
        "expert guest",
        "expert seo consultancy services",
        "expert seo",
        "extreme wealth",
        "facebook accounts",
        "failed investments",
        "faith-based",
        "fall accidents",
        "family law",
        "famous startup deals",
        "fashion industry",
        "fashionable products",
        "fast cash",
        "fendi",
        "filtración",
        "finance broker team",
        "financial decisions",
        "financial goals",
        "financial objectives",
        "financial performance",
        "financial reports",
        "financial secrets",
        "financial strategy",
        "financial wellbeing",
        "financing a vehicle",
        "first-time buyers",
        "fixed rate",
        "fleet manager",
        "fleet services",
        "floor install",
        "floor tiling",
        "flooring installation",
        "flooring solution",
        "folding glass",
        "foreclosure",
        "forex",
        "formal dresses",
        "fragrance notes",
        "frameless shower",
        "free bet",
        "free car removal",
        "free credit",
        "free estimate",
        "free inspection",
        "free on audible",
        "free quote",
        "free spins",
        "free traffic",
        "free-ranged kids",
        "freedom-based learning",
        "freelance seo",
        "freeschooling",
        "fund structures",
        "furnace installs",
        "furniture moving",
        "furniture specification",
        "gambling site",
        "gambling",
        "game download",
        "gaming experience",
        "gaming platform",
        "garage cleanout",
        "garden clean-up services",
        "garden clean-up",
        "gemini notebook",
        "gemini",
        "general contracting services",
        "general dentistry",
        "general ledger",
        "general partners",
        "generative search optimization",
        "generic peptides",
        "get10",
        "gift card",
        "givenchy",
        "glass repair",
        "glazier",
        "glazing company",
        "glazing industry",
        "glp-1",
        "goyard",
        "grooming products",
        "gross salary",
        "grout",
        "growth acceleration",
        "growth potential",
        "guaranteed downloads",
        "guaranteed listeners",
        "guaranteed reviews",
        "gucci",
        "guest pitch",
        "guinness",
        "gutscheine",
        "gutters",
        "haircare",
        "hard drive destruction",
        "hardwood floor",
        "haute horology",
        "healthcare companies",
        "healthcare reimbursement",
        "healthcare solution",
        "healthier-looking hair",
        "heating system",
        "heavy vehicle use tax",
        "hermès",
        "hidden economics",
        "hidden money",
        "high roller",
        "high-growth companies",
        "hipaa-compliant",
        "home cleanout",
        "home equity",
        "home health supplies",
        "home improvement",
        "home rental",
        "home-buying",
        "homeschooling",
        "hookah",
        "hormone therapy",
        "host-read",
        "hotel booking",
        "hourly accommodation",
        "household plumbing",
        "housing market",
        "hvac services",
        "hvac",
        "hydrolyzed collagen",
        "id verification",
        "identify potentially questionable entries",
        "identity verification",
        "iguana extermination",
        "immediate medical attention",
        "implant dentistry",
        "improve bidding",
        "inaccurate information",
        "income statements",
        "increase downloads",
        "increase listeners",
        "increase traffic",
        "independent retailers",
        "indoor air quality",
        "industrial construction",
        "industrial fan",
        "infinite banking",
        "informational purposes only and does not constitute legal advice",
        "informational resource",
        "informed purchasing decisions",
        "injections",
        "injury compensation",
        "injury law firm",
        "instagram growth",
        "instagram",
        "instant cash quotes",
        "insurance claims",
        "insurance",
        "inteligencia artificial",
        "intelligenza artificiale",
        "interest rate",
        "interest-based education",
        "interior design",
        "interior repairs",
        "internationale investoren",
        "inventors",
        "investing frameworks",
        "investment products",
        "investment theses",
        "invisalign",
        "invitation code",
        "invite code",
        "invite code","opportunity to save",
        "iptv paketleri",
        "iptv services",
        "iptv technology",
        "it asset disposition",
        "jackpot stories",
        "jackpot",
        "jaeger-lecoultre",
        "jewellery shop",
        "jimmy choo",
        "john lobb",
        "junk hauling",
        "junk removal",
        "kasyno online",
        "keeping track of assets",
        "keeping track of expenses",
        "keeping track of liabilities",
        "keeping track of revenues",
        "keyword rankings",
        "khussas",
        "kitchen appliances",
        "kitchen cabinets",
        "kitchen design",
        "kitchen renovation",
        "knife specifications",
        "kortingscode",
        "kozijnen",
        "kurtas",
        "l-glutathione",
        "labor productivity",
        "lamborghini\b",
        "laminate flooring",
        "later-stage funding",
        "law firm",
        "lead generation",
        "leak repair",
        "leak repairs",
        "leejeam",
        "legendary investors",
        "lender",
        "lenders",
        "lending",
        "licensed games",
        "licensed provider",
        "limited partners",
        "limited-time discounts",
        "limo service",
        "limousine",
        "link building",
        "linkedin",
        "linoleum",
        "lipotropic injections",
        "live casino",
        "live dealer",
        "livescore",
        "loan approval",
        "local contractor",
        "localization solutions",
        "loewe",
        "logistics professionals",
        "lokale dakdekker",
        "long-distance relocation",
        "long-distance transportation",
        "long-term investment",
        "loro piana",
        "lotteries",
        "lottery",
        "louis vuitton",
        "low apr",
        "low monthly",
        "luxurious landscape",
        "luxury chauffeur",
        "luxury market",
        "luxury mattress",
        "luxury perfumes",
        "luxury travel",
        "luxury vinyl",
        "luxury watch",
        "luxury watches",
        "luxury-inspired watches",
        "machine operation",
        "mailing services",
        "maintenance strategies",
        "managing business finance",
        "managing school records",
        "manolo blahnik",
        "market analysis",
        "market bubbles",
        "market signal",
        "marketers",
        "marketing professional",
        "marketing system",
        "material quantities",
        "material selection",
        "mechanical workshop",
        "medical billing",
        "medical care center",
        "medication adherence",
        "medication compounding",
        "medication mailing",
        "medication management",
        "medyum",
        "mega moolah",
        "melt-value calculations",
        "memory care",
        "mental health professional",
        "mercedes-benz\b",
        "mid-roll",
        "milk thistle extract",
        "minecraft",
        "mobile app developer",
        "mobile application designed",
        "mobile games",
        "mod apk",
        "model escort",
        "modern fashion",
        "mold detection",
        "mold remediation",
        "monetization",
        "monetize",
        "money game",
        "montessori",
        "mortgage approval",
        "mortgage industry",
        "mortgage options",
        "mortgage rate",
        "mortgage",
        "moving day",
        "moving professionals",
        "moving services",
        "mybookie",
        "national lottery",
        "natural learning",
        "neglect cases",
        "neglect claims",
        "nhật code",
        "nike",
        "no-schooling",
        "non-chauffeured",
        "not legal advice",
        "not medical advice",
        "not medical or legal advice",
        "notebooklm",
        "nursing home lawyer",
        "nursing home neglect claims",
        "offering treatments",
        "offers referral-based",
        "omega",
        "online bet",
        "online casino",
        "online gaming experience",
        "online gaming",
        "online retail",
        "online toto",
        "online tuition",
        "opioids",
        "optimized social profiles",
        "oral delivery",
        "oral health care",
        "orofacial surgery",
        "orthodontic treatment",
        "orthopaedic-management services",
        "osha compliance",
        "outdated accounts",
        "outreach",
        "owner-operator",
        "packaging product",
        "packaging solution",
        "paediatric care",
        "paid subscriber",
        "pain management",
        "pain-management services",
        "paint correction",
        "paint touch-ups",
        "painting service",
        "paintwork dent removal",
        "paintwork repair",
        "pari-mutuel",
        "partner code",
        "party store",
        "party-related",
        "patek philippe",
        "paving contractor",
        "paylentra",
        "payoneer",
        "paypal accounts",
        "pedestrian accidents",
        "pediatric dentistry",
        "peptide administration",
        "peptide",
        "peptides",
        "perplexity",
        "pest control",
        "pharmaceutical companies",
        "pharmacy consultations",
        "pharmacy offering",
        "pharmacy services",
        "piano moving",
        "pitching",
        "plumbing needs",
        "plumbing repairs",
        "plumbing solutions",
        "plumbing",
        "podcast network",
        "point-of-sale platforms",
        "poker room",
        "poker",
        "polymarket",
        "ponzi scheme",
        "pool service",
        "porcelain veneers",
        "porsche\b",
        "portfolio construction",
        "post-roll",
        "power-law outcomes",
        "powerball lottery",
        "pr agency",
        "practical social media strategies",
        "practical solutions",
        "prada",
        "pre-approval",
        "pre-approved",
        "pre-roll",
        "premium blinds",
        "premium brand",
        "premium jewellery",
        "premium quality",
        "prescription delivery",
        "prescription refill organization",
        "preventive dentistry",
        "printers",
        "private banking",
        "private chef",
        "private wealth",
        "professional cleaning services",
        "professional cleaning",
        "professional credit repair",
        "professional flooring",
        "professional plumber",
        "professional translation",
        "professionele glasdiensten",
        "project management",
        "promo code",
        "promo kodu",
        "promotional offers",
        "promotional policies",
        "property investor",
        "proven vc strategies",
        "purchasing knives",
        "purchasing properties",
        "quality care",
        "quarterly financial statements",
        "quick rewards",
        "química del agua",
        "raamkozijnen",
        "rabattcode",
        "rajaslot",
        "ralph lauren purple label",
        "reach out",
        "real estate financing",
        "real estate investing",
        "real estate investor",
        "real estate",
        "rebaixamento de teto",
        "recovery service",
        "recreational construction",
        "recruiter-approved template",
        "recruiting tips",
        "recycling drop-off options",
        "recycling solution",
        "referans kodu",
        "referral code",
        "referral id",
        "referral programs",
        "refinance",
        "refrigerators",
        "registration code",
        "rekommendationskod",
        "reliable workmanship",
        "relocation guide",
        "relocation requirements",
        "remodeling journey",
        "remodeling",
        "rental company",
        "rental manager",
        "rental properties",
        "repair services",
        "repayment",
        "replica watches",
        "required identity verification",
        "research peptides",
        "residential interiors",
        "residential moving services",
        "residential moving",
        "respectful parenting",
        "responsible it equipment retirement",
        "responsible technology management",
        "restorative dentistry",
        "resume builder",
        "retail clothing",
        "retail industry",
        "retirement conversations",
        "retirement decisions",
        "retirement offers",
        "retirement planning",
        "revenue cycle management",
        "reviewing attendance",
        "rewards code",
        "richard mille",
        "riding accessories",
        "roblox",
        "rolex",
        "roller blinds",
        "roof repair",
        "roofer",
        "roofing business",
        "roofing company",
        "roofing professional",
        "roofing pros",
        "roofing service",
        "roofing",
        "root to end",
        "roulette",
        "saint laurent",
        "salvage car",
        "salvatore ferragamo",
        "save up to",
        "scale your",
        "scams",
        "scent chemistry",
        "school notifications",
        "scrap silver valuation",
        "scuffs",
        "search engine optimisation",
        "search optimization",
        "seasonal sales",
        "seed rounds",
        "self-directed learning",
        "selling unwanted vehicles",
        "senior corporate",
        "senior moving",
        "seo consultancy services",
        "seo expert",
        "seo optimization",
        "seo service",
        "seo strategy",
        "seo to ai",
        "seo training",
        "seo",
        "septic system",
        "service apartment",
        "sewer services",
        "sheetrock",
        "shein",
        "shelf company",
        "sherwanis",
        "shingles",
        "shower door",
        "shuttle service",
        "siding",
        "signup discount",
        "silver purity",
        "simplify estimates",
        "simplify invoicing",
        "simplify purchase orders",
        "simplify receipts",
        "sistemas de sal",
        "slevového kódu",
        "slevový kód",
        "slip accidents",
        "slot game",
        "slot machine",
        "slots",
        "smoke shop",
        "snapchat",
        "soap2day",
        "sobre gesso",
        "social media marketing",
        "social media needs",
        "social media optimization",
        "solicitation",
        "soul-led education",
        "spatial flow",
        "speciality retailers",
        "specialized marketplace",
        "sponsor",
        "sponsorship",
        "sports analytics",
        "sports betting",
        "sportsbook",
        "startup funding decisions",
        "startup funding",
        "startup investing",
        "state-licensed",
        "store promotions",
        "structural repair",
        "structured curriculum",
        "student academic records",
        "suboxone",
        "subprime",
        "successful business",
        "successful founders",
        "super clone",
        "surgical error",
        "taxi service",
        "technology disposal",
        "technology shifts",
        "teeth braces",
        "teeth whitening",
        "telegram",
        "telehealth platform",
        "term sheets",
        "the row",
        "tiger exchange id",
        "tiktok",
        "tile installation",
        "tile setter",
        "tiling service",
        "timely service",
        "timepiece",
        "title loan",
        "tom ford",
        "top cash fast",
        "top games",
        "tow trucks",
        "towing equipment",
        "tracking link",
        "trading account",
        "trading day",
        "trading fees",
        "traditional parenting",
        "transformative landscaping",
        "transformed home",
        "translation agency",
        "transportation businesses",
        "transportation professional",
        "trauma-management services",
        "travel agency",
        "travel esim",
        "travel for groups",
        "tree removal service",
        "tripplo",
        "truck operators",
        "truck owner",
        "trucking accidents",
        "trusted provider",
        "trustworthy brand identities",
        "unschooling",
        "unsolicited",
        "upvc doors",
        "upvc windows",
        "vaccination awareness",
        "vacheron constantin",
        "vaping products",
        "variable rate",
        "vc strategies",
        "vegan formulas",
        "vehicle devaluation",
        "vehicle disposal",
        "vehicle finance",
        "vehicle transportation",
        "venture capital firms",
        "venture capital",
        "venture capitalists",
        "verified seller accounts",
        "versatile style",
        "veterinary care",
        "vitamin c",
        "wager",
        "wagering requirement",
        "waldorf educators",
        "waldorf pedagogy",
        "waldorf school",
        "waldorf teachers",
        "washing machines",
        "waste management",
        "water heater solutions",
        "wealth advisors",
        "wealth-building",
        "web marketing",
        "wedding celebration",
        "wedding package",
        "wedding venue",
        "weekly seo",
        "weight loss medication",
        "weight loss",
        "weight-management services",
        "welcome bonus",
        "welcome rewards",
        "welkom bij de officiële podcast van",
        "welkom bij de podcast van",
        "welkom bij het podcastkanaal van",
        "western union",
        "whatsapp me",
        "whatsapp",
        "wheel loaders",
        "wheel repair services",
        "wheel repair",
        "wheel scratches",
        "wide range of games",
        "will preparation",
        "win big",
        "window furnishing",
        "window glass",
        "window replacement",
        "window solution",
        "windows & door",
        "winning potential",
        "woningontruiming",
        "wood construction",
        "work boots",
        "worldschooling",
        "yacht rental",
        "yard cleanout",
        "youtube",
        "zegna",
        "промокод",
        "реферальный код",
        "𝐌𝐞𝐝𝐲𝐮𝐦",

        "bit.ly",
        "tinyurl.com",
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
        " bbin ",
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

        "libranovo.com",
        "audiobookzap.com",
        "litupbook.com",


        "Your Podcast Name"
    ];

    const ownersTextsLegit = [

        "MindBodySpirit.fm",


        "Rádio Escola",
        "RadioPlus Shows",
        "Radio Nacional",
        "RTVE",
        "Ona 92 FM",
        "GDS Radio TV Internacional",
        "RCN RADIO",
        "Delfi Meedia",
        "Klubrádió",
        "Polskie Radio S.A.",
        "Sud Radio",
        "Radio Catskill",
        "Radio OTM",
        "RSU Radio Sorbonne Université",
        "Catalunya Ràdio",
        "Townsquare Media, Inc.",
        "WSIU Public Radio",
        "Hawaii Public Radio",
        "Minnesota Public Radio",
        "Iowa Public Radio",
        "Cincinnati Public Radio",
        "Texas Public Radio",
        "Wisconsin Public Radio",
        "Montana Public Radio",
        "WDIY 88.1 FM",
        "New Hampshire Public Radio",
        "Northern Public Radio",
        "North Carolina Public Radio",
        "Shadeaux Public Radio",
        "Vermont Public Radio",
        "Southern California Public Radio",
        "Northern California Public Media",
        "KACU",
        "Nevada Public Radio",
        "KUNR Public Radio",
        "Boise State Public Radio",
        "Tri States Public Radio",
        "North State Public Radio",
        "Utah Public Radio",


        "Colorado Public Radio",
        "St. Louis Public Radio",
        "Wyoming Public Media",
        "Nashville Public Radio",
        "Radio ARA",
        "Raiplay Sound",
        "Radio Maria",
        "Radio Mont Blanc",
        "RSU Radio Sorbonne Université",
        "WLRH Radio",
        "WBHM",
        "WLRH Public Radio",
        "WLRH",
        "KNBA",
        "KNAU Arizona Public Radio",
        "KUAF 91.3 Public Radio",

        "JewishPodcasts.fm",
        "Radio Taiwan International",
        "Deutsches Städte-Network",

        "Rebel Without a Clue Media",
        "Condé Nast",
        "Le Monde",
        "LTL TV",
        "Radio Grenouille",
        "CFRC Podcast Network",
        "Belarus FM",
        "Radio Dynamo",
        "Roma Tre Radio Podcast",
        "Next Nation",
        "Kofifi FM 97.2",
        "Southend City Radio",
        "Maxiradio 103.3 FM",
        "KRCB News Team",
        "WBCL Radio Network",
        "New Books Network",
        "YO1 Radio",
        "ABC Australia",
        "Deutsche Welle",
        "Schweizer Radio und Fernsehen",
        "Radio Prague International",

        "BBC World Service",
        "BBC Gahuza Radio",
        "CBeebies Radio",
        "BBC Radio Ulster",
        "BBC Radio Scotland",
        "BBC Radio Leicester",
        "BBC Burmese Radio",
        "BBC Arabic Radio",
        "BBC Arabic",
        "BBC Hindi Radio",
        "BBC Hindi",
        "BBC Radio 5",
        "BBC Radio 4",
        "BBC Radio 3",
        "BBC Radio 2",
        "BBC Radio 1",
        "BBC Radio",
        "BBC News",
        "BBC Sounds",
        "BBC Local Radio",


        "Digi FM - Newsic Radio",
        "Banquise FM",
        "Tilos Rádió",

        "Weather Alert Radio Network",
        "Wavlake",
        "Loyal Books",
        "LibriVox",
        "Podcast WABCRadio",
        "WBEZ Chicago"
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
        "travel genre",
        "Multi Poetry Genre",

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
        "Politics, Philosophy, Religion",
        "Science Stories",
        "Nature and Animals",
        "Tragedy Genre",

        "2 Minutes with Joey",
        "Fexingo",
        "Worlds Before Us",
        "Abby Histories",
        "AI Roller",
        "Momentum Media Advertising",
        "Mythic Frame Studios",


        "AI narration",

        "advertising campaign",
        "escorts service",
        "call girls",
        "spellbound audio",
        "storyflo",
        "dinlex.org",
        "3Peaks",
        "Referans Kodu",
        "partner code",
        "Rewards Code",
        "Rekommendationskod",
        "Rabattcode",

        "TheSoul Publishing",

        "Novecho",
        "AudioScholar",
        "solgoodmedia.com",
        "The Oldies Radio",
        "ANDREA MILANO AI",
        "Hidden Voices",
        "Skyrim Bedtime Stories",

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
        "Pigeon Casa Editorial",
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
        "Sundays from Aware",
        "Neon Nights Studio",
        "Sol Good Media",
        "Sol Good Network",
        "TeeSnee AI",
        "The Podcast Network",
        "gsmc podcast network",
        "gsmc scifi network",
        "GSMC Classics",
        "GSMC Sports Podcasts",
        "GSMC News Podcasts",
        "GSMC Music & Theater Network",
        "GSMC Action Podcasts",
        "GSMC Comedy & Family Network",
        "GSMC Sports Network",
        "GSMC Drama Network",
        "GSMC Religion Network",
        "Audiobooks",
        "HustleStudios Podcast Network",
        "Launchpod Studio",
        "ISMG Content Intelligence & AI Innovation",
        "The Oldies Radio",
        "Free Audiobook Library",


        "AudioVerse Archives",
        "Rabbit Hole Brief",
        "Classic Stories on Audio!",
        "OBOMEDIA ENTERTAINMENT",
        "Neon Nights Network",
        "Tvweo",
        "ciesse",
        "Maria Tiffany",
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
        /* The usual suspects ... */
        "https://feeds.megaphone.fm/LPS", /* Launchpod Studio */
        "https://podcast.gsmc.cloud/feed/", /* GSMC Cloud */
        "https://([a-z0-9]{1,}).supabase.co/", /* Supabase.co */
        "https://feeds.fastcast.ai/", /* AI newsfeeds */
        "https://booksreader.space/", /* Booksreader - Audible */
        "https://s3.amazonaws.com/aplt1rss/", /* Appletfab LLC */
        "https://feeds.megaphone.fm/NPTNI" /* Inception Point AI */
    ];


    const feedURLsecurity = [
        { text: "Auth Token", regex: new RegExp("auth\x5ftoken\x3d", "gi")}
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
        "https://www.wbal.com/podcast/",
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
        "https://rss.amperwave.net/v2/feed/",
        "https://www.radiomaria.be/feed/podcast/",
        "https://www.nativeamericacalling.com/",
        "https://yvr876.com/feed/podcast/",
        "https://feeds.sbs.com.au/",
        "https://www.abc.net.au/feeds/",
        "https://podcast.radiodarmstadt.de/feed/podcast/",
        "https://www.bamradionetwork.com/feeds/",
        "https://podcast.fred.fm/podcast/",
        "http://www.sott.net/xml/",
        "https://www.kacu.org/podcast/",
        "https://knpr.org/podcast/",
        "https://www.knpr.org/podcast/",
        "https://www.kunr.org/podcast/",
        "https://www.mynspr.org/podcast/",
        "https://www.upr.org/podcast/",
        "https://wpln.org/programs/",
        "https://www.knau.org/podcast/",
        "https://www.kuaf.com/podcast/",
        "https://norcalpublicmedia.org/",

        "https://podcasts.cityradioplayer.uk/",
        "https://www.southeastradio.ie/podcasts/",
        "http://www.rtve.es/api/programas/",
        "https://www.klubradio.hu/rss/podcast/",
        "https://www.sudradio.fr/programme/",
        "https://radiotuungane.info/feed/podcast/",
        "https://www.radioara.org/feed/podcast/",

        "https://radiodynamo.org/feed/podcast/",
        "https://shows.radioplus.co.il/feed/podcast/",
        "https://www.rtp.pt/play/itunes/",
        "https://podcasts.files.bbci.co.uk/",
        "https://www.twr.org.uk/podcast_feed/",
        "https://tiftonmediaworks.com/shows/",
        "https://www.yo1radio.co.uk/podcasts1/",
        "https://www.yo1radio.co.uk/podcasts2/",
        "https://www.wsiu.org/podcast/",
        "https://wlrh.org/podcast-feed/",
        "https://podcast.uniroma3.it/podcast/",
        "https://nextnation.mx/feed/podcast/",

        "http://www.radio.rai.it/rss/podcast/",
        "http://www.radio.rai.it/wr6/podcast/",

        "https://rss.dw.com/xml/",
        "https://rss.dw.com/xmlhd/",
        "https://www.srf.ch/feed/podcast/",
        "http://www.srf.ch/feed/podcast/",

        "https://deutsch.radio.cz/rcz-rss/",

        "https://www.freie-radios.net/portal/",
        "https://media.rtv.rs/",
        "http://media.radio21.de/podcast/",
        "https://www.radiosaw.de/interaktiv/",

        "https://rss.jewishpodcasts.fm/rss/",
        "https://www.raiplaysound.it/programmi/",
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
        "https://promodj.com/",
        "https://www.rti.org.tw/",
        "https://en.rti.org.tw/",
        "https://de.rti.org.tw/",
        "https://th.rti.org.tw/",
        "https://ru.rti.org.tw/",
        "https://jp.rti.org.tw/",
        "https://vn.rti.org.tw/",
        "https://id.rti.org.tw/",
        "https://fr.rti.org.tw/",

        "https://www.polskieradio.pl/rss/",
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
        "https://www.retetoscanaclassica.it/feed/podcast/",

        "https://feed.symbol.fm/",
        "https://feeds.yle.fi/areena/v1/series/",

        "https://www.cbc.ca/podcasting/",
        "http://collectionscanada.gc.ca/obj/",
        "https://collectionscanada.gc.ca/obj/",
        "https://radio.nac-cna.ca/podcast/",
        "https://esp.radiomaria.ca/",
        "https://radiomaria.ca/",
        "https://ohdieux.ligature.ca/rss",
        "https://radiorfa.com/feed/podcast/",

        "https://feeds.megaphone.fm/NSR",
        "https://feeds.megaphone.fm/NBN",
        "https://feeds.megaphone.fm/CNE",
        "https://feeds.megaphone.fm/JXL",
        "https://feeds.megaphone.fm/RSU",
        "https://feeds.megaphone.fm/ESP",
        "https://feeds.megaphone.fm/POM",
        "https://feeds.megaphone.fm/COR",
        "https://feeds.megaphone.fm/FOX",
        "https://feeds.megaphone.fm/ACECREATORSPTYLTD",
        "https://feeds.megaphone.fm/YOSHIMOTOKOGYOCOLTD",
        "https://feeds.megaphone.fm/MP9",
        "https://feeds.megaphone.fm/NBN",
        "https://feeds.megaphone.fm/CTT",
        "https://feeds.megaphone.fm/NNN",
        "https://feeds.megaphone.fm/VMP",
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

        "https://feeds.godcaster.fm/",
        "https://feeds.audiomeans.fr/feed/",
        "https://latvijasradio.lsm.lv/",
        "https://www.vodio.fr/",
        "https://feed.pod.co/",
        "https://feeds.ktoo.org/",
        "https://musicsideproject.com/api/hosted/",
        "https://www.omnycontent.com/d/playlist/",
        "https://omnycontent.com/d/playlist/",
        "https://www.loyalbooks.com/book/",
        "http://www.loyalbooks.com/book/",
        "http://rss.acast.com/",
        "https://rss.acast.com/",
        "https://access.acast.com/rss/",
        "https://feeds.acast.com/public/shows/",
        "https://indiesats.com/api/feed?npub=",
        "https://wavlake.com/feed/music/"
    ];

    const descriptionPhonenumbers = [

        { text: "UK", regex: new RegExp("\\x2b44(\\x2d)?([\\d\\x2d\\s]{8,10})", "gi")},
        { text: "USA/Canada", regex: new RegExp("\\x2b1(\\x2d)?([\\d\\x2d\\s]{8,10})", "gi")},

        { text: "Spain", regex: new RegExp("\\x2b34(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")},

        { text: "Finland/Åland", regex: new RegExp("\\x2b358(\\x2d)?([\\d\\x2d\\s]{8,12})", "gi")},


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

    const extraGenerators = [

        { text: "SiteServer", regex: new RegExp("^Site\\x2dServer\\sv\\x40build\\x2eversion\\x40", "gi")},
        { text: "WordPress", regex: new RegExp("^https\\x3a\\x2f\\x2fwordpress\\x2eorg\\x2f\\x3fv\\x3d(\\d{1,})\\x2e(\\d{1,})", "gi")},
        { text: "Podeo", regex: new RegExp("^https\\x3a\\x2f\\x2fpodeo\\x2eco", "gi")},
        { text: "AudioBoom", regex: new RegExp("^audioboom\\x2ecom", "gi")},
        { text: "Southend City Radio", regex: new RegExp("^Southend\\sCity\\sRadio\\scatalogue", "gi")},
        { text: "Alitu", regex: new RegExp("^Alitu", "gi")},
        { text: "Music Side Project", regex: new RegExp("^Music\\sSide\\sProject\\sStudio", "gi")},
        { text: "Music Side Project", regex: new RegExp("^MSP\\s2\\x2e0\\s\\x2d\\sMusic\\sSide\\sProject\\sStudio", "gi")},
        { text: "Fourble", regex: new RegExp("^Fourble", "gi")},
        { text: "Podhome", regex: new RegExp("^Podhome", "gi")},
        { text: "iono.fm", regex: new RegExp("^iono\\x2efm", "gi")},
        { text: "ART19", regex: new RegExp("^ART19", "gi")},
        { text: "Fountain", regex: new RegExp("^Fountain", "gi")},
        { text: "GodCaster", regex: new RegExp("^Godcaster\\x2efm\\x2f\\d{1,}\\x2e\\d{1,}", "gi")},
        { text: "Podomatic RSS Generator", regex: new RegExp("^Podomatic\\sRSS\\sGenerator", "gi")},
        { text: "Blubrry Account Management", regex: new RegExp("^Blubrry\\sAccount\\sManagement\\x3a", "gi")},
        { text: "Blubrry PowerPress", regex: new RegExp("^Blubrry\\sPowerPress", "gi")},
        { text: "Patreon", regex: new RegExp("^Patreon", "gi")},
        { text: "Audiomeans", regex: new RegExp("^Audiomeans", "gi")},
        { text: "Symbol.fm", regex: new RegExp("^Symbol\\x2efm", "gi")},
        { text: "PrestoCast", regex: new RegExp("^PrestoCast", "gi")},
        { text: "Podlove", regex: new RegExp("^Podlove\\sPodcast\\sPublisher\\sv\\d{1,}\\x2e\\d{1,}\\x2e\\d{1,}", "gi")},
        { text: "Castopod", regex: new RegExp("^Castopod\\s\\x2d\\shttps\\x3a\\x2f\\x2fcastopod\\x2eorg\\x2f", "gi")},
        { text: "Shenoto", regex: new RegExp("^Shenoto", "gi")},
        { text: "stand.fm", regex: new RegExp("^stand\\x2efm", "gi")},
        { text: "beehiiv", regex: new RegExp("^beehiiv", "gi")},
        { text: "Vodio", regex: new RegExp("^Vodio\\s\\x28https\\x3a\\x2f\\x2fwww\\x2evodio\\x2efr\\x29", "gi")},
        { text: "Fireside", regex: new RegExp("^Fireside\\s\\x28https\\x3a\\x2f\\x2ffireside\\x2efm\\x29", "gi")},
        { text: "Wavlake", regex: new RegExp("^Wavlake", "gi")},
        { text: "Radiotalk", regex: new RegExp("^Radiotalk", "gi")},
        { text: "Fusebox", regex: new RegExp("^Fusebox", "gi")},
        { text: "Springcast Pro Generator", regex: new RegExp("^Springcast\\sPro\\sGenerator", "gi")},
        { text: "Pinecast", regex: new RegExp("^Pinecast\\s", "gi")},
        { text: "Podspace.com", regex: new RegExp("^Podspace\\x2ecom", "gi")},
        { text: "ShowPlatform", regex: new RegExp("^ShowPlatform\\s", "gi")},
        { text: "NASDAQ", regex: new RegExp("^podcastnasdaq\\sstatic\\spublisher", "gi")},
        { text: "FlightCast", regex: new RegExp("^Flightcast\\sRSS\\sFeed\\sGenerator", "gi")},
        { text: "Podcastics", regex: new RegExp("^Podcastics", "gi")},
        { text: "LetsCast.fm", regex: new RegExp("^LetsCast\\x2efm", "gi")},
        { text: "PRX Feeder", regex: new RegExp("^PRX\\sFeeder", "gi")},
        { text: "HubHopper", regex: new RegExp("^Hubhopper\\x28https\\x3a\\x2f\\x2fhubhopper\\x2ecom\\x29", "gi")},
        { text: "Podster", regex: new RegExp("^Podster", "gi")},
        { text: "podcaster.de", regex: new RegExp("^podcaster\\x2ede\\sFeedarator\\s", "gi")},
        { text: "JellyPod", regex: new RegExp("^Powered\\sby\\sJellypod", "gi")},
        { text: "Podcast for Node", regex: new RegExp("^Podcast\\sfor\\sNode", "gi")},
        { text: "smarttalk-podcast (Cloudflare)", regex: new RegExp("^smarttalk\\x2dpodcast", "gi")},
        { text: "Fexingo", regex: new RegExp("^fexingo\\x2dgenerate\\x2dfeeds\\s", "gi")},

        { text: "PodcastMachine", regex: new RegExp("^podcastmachine\\x2ecom", "gi")},
        { text: "Beamly", regex: new RegExp("^Beamly\\x2ecom", "gi")},
        { text: "Acast", regex: new RegExp("^acast\\x2ecom", "gi")},
        { text: "Ausha", regex: new RegExp("^Ausha", "gi")},
        { text: "iVoox", regex: new RegExp("^iVoox", "gi")},
        { text: "Podigee", regex: new RegExp("^Podigee", "gi")},
        { text: "SimpleCast", regex: new RegExp("^https\\x3a\\x2f\\x2fsimplecast\\x2ecom", "gi")},
        { text: "Substack", regex: new RegExp("^Substack", "gi")},
        { text: "SoundOn", regex: new RegExp("^SoundOn", "gi")},
        { text: "Castos/SSP", regex: new RegExp("^Castos\\x2fSSP", "gi")},
        { text: "Castos", regex: new RegExp("^Castos$", "gi")},
        { text: "Transistor", regex: new RegExp("^Transistor\\s", "gi")},
        { text: "PodBean", regex: new RegExp("^https\\x3a\\x2f\\x2fpodbean\\x2ecom\\x2f\\x3fv\\x3d", "gi")},
        { text: "Captivate.fm", regex: new RegExp("^Captivate\\x2efm", "gi")},
        { text: "Riverside.fm", regex: new RegExp("^Riverside\\x2efm\\s", "gi")},
        { text: "Podigee", regex: new RegExp("^Podig\\s", "gi")},
        { text: "Libsyn", regex: new RegExp("^Libsyn\\sRSSgen\\s", "gi")},
        { text: "RSS.com", regex: new RegExp("^RSS\\x2ecom\\s", "gi")},
        { text: "Firstory v2", regex: new RegExp("^Firstory\\sv2", "gi")},
        { text: "RedCircle", regex: new RegExp("^RedCircle\\sVERIFY\\x5fTOKEN\\x5f", "gi")},
        { text: "Anchor Podcasts", regex: new RegExp("^Anchor\\sPodcasts", "gi")},
        { text: "Buzzsprout", regex: new RegExp("^Buzzsprout", "gi")}
    ];

    const extraLanguages = [

        { text: "Ewe", regex: new RegExp("^ee((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Manx", regex: new RegExp("^gv((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "South Ndebele", regex: new RegExp("^nr((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Dzongkha", regex: new RegExp("^dz((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Mongolian", regex: new RegExp("^mn((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Esperanto", regex: new RegExp("^eo((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Nepali", regex: new RegExp("^ne((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Malayalam", regex: new RegExp("^ml((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Kazakh", regex: new RegExp("^kk((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Uzbek", regex: new RegExp("^uz((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Somali", regex: new RegExp("^so((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Panjabi", regex: new RegExp("^pa((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Afrikaans", regex: new RegExp("^af((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Albanian", regex: new RegExp("^sq((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Amharic", regex: new RegExp("^am((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Arabic", regex: new RegExp("^ar((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Armenian", regex: new RegExp("^hy((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Azerbaijani", regex: new RegExp("^az((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Basque", regex: new RegExp("^eu((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Belarusian", regex: new RegExp("^be((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Bengali", regex: new RegExp("^bn((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Bosnian", regex: new RegExp("^bs((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Bulgarian", regex: new RegExp("^bg((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Burmese", regex: new RegExp("^my((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Catalan", regex: new RegExp("^ca((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Chichewa", regex: new RegExp("^ny((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Chinese", regex: new RegExp("^zh((\\x2d|\\x5f)([a-z]{2,4}))?$", "gi")},
        { text: "Cornish", regex: new RegExp("^kw((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Croatian", regex: new RegExp("^hr((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Czech", regex: new RegExp("^cs((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Danish", regex: new RegExp("^da((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Dutch", regex: new RegExp("^nl((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "English", regex: new RegExp("^en((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Estonian", regex: new RegExp("^et((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Farsi", regex: new RegExp("^fa((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Filipino", regex: new RegExp("^fil((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Finnish", regex: new RegExp("^fi((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "French", regex: new RegExp("^fr((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "German", regex: new RegExp("^de((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Greek", regex: new RegExp("^el((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Greek", regex: new RegExp("^ell$", "gi")},
        { text: "Gujarati", regex: new RegExp("^gu((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Haitian", regex: new RegExp("^ht((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Hebrew", regex: new RegExp("^he((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Hindi", regex: new RegExp("^hi((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Hindi", regex: new RegExp("^hin$", "gi")},
        { text: "Hungarian", regex: new RegExp("^hu((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Icelandic", regex: new RegExp("^is((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Indonesian", regex: new RegExp("^id((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Italian", regex: new RegExp("^it((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Japanese", regex: new RegExp("^ja((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Kannada", regex: new RegExp("^kn((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Kinyarwanda", regex: new RegExp("^rw((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Kirghiz", regex: new RegExp("^ky((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Korean", regex: new RegExp("^ko((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Kurdish", regex: new RegExp("^ku((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Lao", regex: new RegExp("^lo((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Latvian", regex: new RegExp("^lv((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Lingala", regex: new RegExp("^ln((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Lithuanian", regex: new RegExp("^lt((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Luba-Katanga", regex: new RegExp("^lu((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Luxembourgish", regex: new RegExp("^lb((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Macedonian", regex: new RegExp("^mk((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Malagasy", regex: new RegExp("^mg((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Malay", regex: new RegExp("^ms((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Marathi", regex: new RegExp("^mr((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Norwegian Bokmål", regex: new RegExp("^nb((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Norwegian Nynorsk", regex: new RegExp("^nn((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Norwegian", regex: new RegExp("^no((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Polish", regex: new RegExp("^pl((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Portugese", regex: new RegExp("^pt((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Quechua", regex: new RegExp("^qu((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Romanian", regex: new RegExp("^ro((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Russian", regex: new RegExp("^ru((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Sanskrit", regex: new RegExp("^sa((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Serbian", regex: new RegExp("^sr((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Sinhala", regex: new RegExp("^si((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Slovak", regex: new RegExp("^sk((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Slovenian", regex: new RegExp("^sl((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Spanish", regex: new RegExp("^es((\\x2d|\\x5f)([a-z0-9]{2,3}))?$", "gi")},
        { text: "Swahili", regex: new RegExp("^sw((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Swedish", regex: new RegExp("^sv((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Tagalog", regex: new RegExp("^tl((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Tamil", regex: new RegExp("^ta((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Tatar", regex: new RegExp("^tt((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Telugu", regex: new RegExp("^te((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Thai", regex: new RegExp("^th((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Tigrinya", regex: new RegExp("^ti((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Tonga", regex: new RegExp("^to((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Turkish", regex: new RegExp("^tr((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Ukrainian", regex: new RegExp("^uk((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Urdu", regex: new RegExp("^ur((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Vietnamese", regex: new RegExp("^vi((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Welsh", regex: new RegExp("^cy((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Wolof", regex: new RegExp("^wo((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Xhosa", regex: new RegExp("^xh((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Yiddish", regex: new RegExp("^yi((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Zulu", regex: new RegExp("^zu((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")},
        { text: "Yoruba", regex: new RegExp("^yo((\\x2d|\\x5f)([a-z]{2,3}))?$", "gi")}
    ];

    const inlineFragments = [

        { text: "UTM chatgpt", regex: new RegExp("\\x3futm\\x5fsource\\x3dchatgpt\\x2ecom", "gi")},

        { text: "Free Redeem", regex: new RegExp("free\\sredeem", "gi")},
        { text: "Google Play", regex: new RegExp("Google\\sPlay", "gi")},

        { text: "Google Play Gift Card", regex: new RegExp("Google\\sPlay\\Gift\\sCard", "gi")},

        { text: "@usaChang", regex: new RegExp("\\x40usachang", "gi")},
        { text: "mifen{number}@gmail.com", regex: new RegExp("mifen\\d{4,8}\\x40gmail\\x2ecom", "gi")},

        { text: "09384726{number}", regex: new RegExp("09384726(\\d{2})", "gi")},
        { text: "tip-club.app@gmail.com", regex: new RegExp("tip\\x2dclub\\x2eapp\\x40gmail\\x2ecom", "gi")},

        { text: "@giugno{number}", regex: new RegExp("\\x40giugno\\d{1,5}", "gi")},
        { text: "kolkocXXX@gmail.com", regex: new RegExp("kolkoc\\d{1,5}\\x40gmail\\x2ecom", "gi")},

        { text: "@twl{number}tech", regex: new RegExp("\\x40twl\\d{1,5}tech", "gi")},
        { text: "aotelaisichn@gmail.com", regex: new RegExp("aotelaisichn\\x40gmail\\x2ecom", "gi")},

        { text: "OFFTAKE{number}", regex: new RegExp("offtake\\d{1,5}", "gi")},
        { text: "PLAYHARD{number}", regex: new RegExp("playhard\\d{1,5}", "gi")},
        { text: "BONUS{number}", regex: new RegExp("\\bbonus\\d{1,5}\\b", "gi")},

        { text: "GET{number}", regex: new RegExp("\\bget\\d{1,5}\\b", "gi")},
        { text: "VIP{number}", regex: new RegExp("\\bVIP\d{1,5}\\b", "gi")},
        { text: "USA{number}", regex: new RegExp("\\bUSA\d{1,5}\\b", "gi")},

        { text: "JEAM", regex: new RegExp("\\bjeam\\b", "gi")},
        { text: "JENY", regex: new RegExp("\\bjeny\\b", "gi")},
        { text: "kickback{number}", regex: new RegExp("kickback(\\d{2})", "gi")},

        { text: "Course Code", regex: new RegExp("GA\\d{1}\\x2d(\\d{9})\\x2d([a-z]{2})\\d{1}\\x2d([a-z]{2})(\\d{2})", "gi")},


        { text: "Get xx%", regex: new RegExp("Get\s(\\d{1,2})\x25", "gi")},
        { text: "Up to xx%", regex: new RegExp("Up\\sto\\s(\\d{1,2})\\x25", "gi")},
        { text: "fino al xx%", regex: new RegExp("fino\\sal\\s(\\d{1,2})\\x25", "gi")},

        { text: "123{number}", regex: new RegExp("\\b123([a-z\\x2d]{1,})\\b", "gi")},

        { text: "{number}JILI", regex: new RegExp("\\b\\d{1,}jili\\b", "gi")},
        { text: "JILI{number}", regex: new RegExp("\\bjili\\d{2,}\\b", "gi")},
        { text: "{number}CASHBACK", regex: new RegExp("\\\\d{2,}cashback\\b", "gi")},

        { text: "currency symbol $ (Dollar)", regex: new RegExp("\\x24", "gi")},

        { text: "currency symbol £ (Pound)", regex: new RegExp("\\xa3", "gi")},

        { text: "currency symbol € (Euro)", regex: new RegExp("\\u20ac", "gi")},

        { text: "currency symbol ₹ (Rupiee)", regex: new RegExp("\\u20b9", "gi")},

        { text: "Referral Code", regex: new RegExp("\\xab([A-Z0-9]{2,})\\xbb", "g")},
        { text: "Referral Code", regex: new RegExp("\\u201c([A-Z0-9]{2,})\\u201d", "g")},
        { text: "Referral Code", regex: new RegExp("\\u201e([A-Z0-9]{2,})\\u201c", "g")}

    ];

    const casinoFrags = [
        { text: "hb{number}s{number}.com", regex: new RegExp("hb(\\d{2,5})s(\\d{1,})\x2ecom", "gi")},
        { text: "{number}clbrank.com", regex: new RegExp("(\\d{1,})clbrank\\x2ecom", "gi")},
        { text: "{number}betv{number}.com", regex: new RegExp("(\\d{1,})betv(\\d{1,})\\x2ecom", "gi")},
        { text: "sc{number}seo{number}.com", regex: new RegExp("sc(\\d{1,})seo(\\d{1,})\\x2ecom", "gi")},
        { text: "tg{number}one.com", regex: new RegExp("tg(\\d{1,})one\\x2ecom", "gi")},
        { text: "alo{number}so{number}.com", regex: new RegExp("alo(\\d{1,})so(\\d{1,})\\x2ecom", "gi")},
        { text: "hello{number}a{number}.com", regex: new RegExp("hello(\\d{1,})a(\\d{1,})\\x2ecom", "gi")},

        { text: "{number}clbplus.co", regex: new RegExp("(\\d{1,})clbplus\\x2eco", "gi")},
        { text: "sc{number}rank.com", regex: new RegExp("sc(\\d{1,})rank\\x2ecom", "gi")},
        { text: "f{number}betss.com", regex: new RegExp("f(\\d{1,})betss\\x2ecom", "gi")},
        { text: "cm{number}ss.com", regex: new RegExp("cm(\\d{1,})ss\\x2ecom", "gi")},
        { text: "cm{number}top{number}.com", regex: new RegExp("cm(\\d{1,})top(\\d{1,})\\x2ecom", "gi")},
        { text: "tg{number}top{number}.com", regex: new RegExp("tg(\\d{1,})top(\\d{1,})\\x2ecom", "gi")},
        { text: "bj{number}v{number}.com", regex: new RegExp("bj(\\d{1,})v(\\d{1,})\\x2ecom", "gi")},
        { text: "shbet{number}.com", regex: new RegExp("shbet(\\d{1,})\\x2ecom", "gi")},
        { text: "{number}win{number}.com", regex: new RegExp("(\\d{1,})win(\\d{1,})\\x2ecom", "gi")},
        { text: "alo{number}one.com", regex: new RegExp("alo(\\d{1,})one\\x2ecom", "gi")},
        { text: "alo{number}rank.com", regex: new RegExp("alo(\\d{1,})rank\\x2ecom", "gi")},
        { text: "alo{number}top{number}.com", regex: new RegExp("alo(\\d{1,})top(\\d{1,})\\x2ecom", "gi")},


        { text: "{alphanumeric}.llc", regex: new RegExp("([a-z0-9]{4})\\x2ellc", "gi")},

        { text: "XIN{number}.express", regex: new RegExp("xin(\\d{1,})\\x2eexpress", "gi")},
        { text: "DN{number}TIPS.com", regex: new RegExp("dn(\\d{1,})tips\\x2ecom", "gi")},
        { text: "{alphanumeric}BETA{number}.ink", regex: new RegExp("([a-z0-9]{1,})beta(\\d{1,})\\x2eink", "gi")},

        { text: "{number}WIN{number}.com", regex: new RegExp("(\\d{2})win(\\d{3})\\x2ecom", "gi")},

        { text: "{alpha}ZAN.cc", regex: new RegExp("([a-z]{2,5})zan\\x2ecc", "gi")},
        { text: "{number}ZAN.cc", regex: new RegExp("(\\d{1,})zan\\x2ecc", "gi")},

        { text: "{number}FEN.cc", regex: new RegExp("(\\d{1,})fen\\x2ecc", "gi")},
        { text: "ZAN{number}.cc", regex: new RegExp("zan(\\d{1,})\\x2ecc", "gi")},


        { text: "TAYA{number}bet.net", regex: new RegExp("taya(\\d{1,})bet\\x2enet", "gi")},


        { text: "fenba.top", regex: new RegExp("fenba\\x2etop", "gi")},
        { text: "zanup.top", regex: new RegExp("zanup\\x2etop", "gi")},
        { text: "zanup.cc", regex: new RegExp("zanup\\x2ecc", "gi")},
        { text: "zansu.top", regex: new RegExp("zansu\\x2etop", "gi")},
        { text: "upzan.top", regex: new RegExp("upzan\\x2etop", "gi")},

        { text: "FENSI{number}", regex: new RegExp("fensi(\\d{1,})\\x2etop", "gi")},
        { text: "GA{number}.top", regex: new RegExp("ga(\\d{1,})\\x2etop", "gi")},

        { text: "{alpha}FEN.top", regex: new RegExp("([a-z]{2,5})fen\\x2etop", "gi")},
        { text: "{alpha}UP.top", regex: new RegExp("([a-z]{2,})up\\x2etop", "gi")},


        { text: "{number}UP.top", regex: new RegExp("(\\d{1,})up\\x2etop", "gi")},
        { text: "{number}DY.top", regex: new RegExp("(\\d{1,})dy\\x2etop", "gi")},
        { text: "{number}KK.top", regex: new RegExp("(\\d{1,})kk\\x2etop", "gi")},
        { text: "{number}KS.top", regex: new RegExp("(\\d{1,})ks\\x2etop", "gi")},
        { text: "{number}SP.top", regex: new RegExp("(\\d{1,})sp\\x2etop", "gi")},



        { text: "{number}FEN{number}.top", regex: new RegExp("(\\d{1,})fen(\\d{1,})\\x2etop", "gi")},
        { text: "{number}KOL.top", regex: new RegExp("(\\d{1,})kol\\x2etop", "gi")},
        { text: "{number}XHS.top", regex: new RegExp("(\\d{1,})xhs\\x2etop", "gi")},
        { text: "{number}ZAN.top", regex: new RegExp("(\\d{1,})zan\\x2etop", "gi")},
        { text: "{number}FEN.top", regex: new RegExp("(\\d{1,})fen\\x2etop", "gi")},

        { text: "DK{number}.top", regex: new RegExp("dk(\\d{1,})\\x2etop", "gi")},
        { text: "MK{number}.top", regex: new RegExp("mk(\\d{1,})\\x2etop", "gi")},
        { text: "PK{number}.top", regex: new RegExp("pk(\\d{1,})\\x2etop", "gi")},
        { text: "SKP{number}.top", regex: new RegExp("skp(\\d{1,})\\x2etop", "gi")},
        { text: "SPH{number}.top", regex: new RegExp("sph(\\d{1,})\\x2etop", "gi")},
        { text: "VA{number}.top", regex: new RegExp("va(\\d{1,})\\x2etop", "gi")},
        { text: "XHS{number}.top", regex: new RegExp("xhs(\\d{1,})\\x2etop", "gi")},
        { text: "ZAN{number}.top", regex: new RegExp("zan(\\d{1,})\\x2etop", "gi")},
        { text: "MM{number}.top", regex: new RegExp("mm(\\d{1,})\\x2etop", "gi")},

        { text: "KY{number}.xyz", regex: new RegExp("ky(\\d{1,})\\x2exyz", "gi")},

        { text: "#taya{number}", regex: new RegExp("\\x23taya(\\d{2,})\\b", "gi")},
        { text: "#taya{number}ph", regex: new RegExp("\\x23taya(\\d{2,})ph\\b", "gi")},
        { text: "#taya{number}comph", regex: new RegExp("\\x23taya(\\d{2,})comph\\b", "gi")},

        { text: "#onlinecasino", regex: new RegExp("\\x23onlinecasino\\b", "gi")},
        { text: "#casino", regex: new RegExp("\\x23casino\\b", "gi")},


        { text: "#tipclub", regex: new RegExp("\\x23tipclub", "gi")},
        { text: "#tipclub_bet", regex: new RegExp("\\x23tipclub\\x5fbet", "gi")},
        { text: "#tipclub_casino", regex: new RegExp("\\x23tipclub\\x5fcasino", "gi")},



        { text: "tipclub{number}.org", regex: new RegExp("tipclub(\\d{1,3})\\x2eorg", "gi")}

    ];

    const owners = [

        "3 peaks studios",
        "3peaks",
        "advertising campaign",
        "ai generated",
        "andrea milano ai",
        "appletfab llc",
        "audiobooks by librivox",
        "audiobooks on line",
        "audiobooks",
        "audiobooks, podcasts and more",
        "audioscholar",
        "ciesse",
        "classic stories on audio!",
        "crime of the truest kind",
        "dinlex.org",
        "dream audio books",
        "elite personas llc",
        "escorts service",

        "SLEEPY HISTORY",
        "Bouncing Stories",
        "Worlds Before Us",
        "fexingo",
        "fixme",
        "gmb unlimited, llc",
        "gsmc podcast network",
        "gsmc scifi network",
        "GSMC Classics",
        "GSMC Sports Podcasts",
        "GSMC News Podcasts",
        "heritage radio vault",
        "hidden voices",
        "hustlestudios podcast network",
        "inception point ai",
        "launchpod studios",
        "let's work this sh*t out",
        "lumen audio studio",
        "michela bertazzo",
        "neon nights network",
        "neon nights studio",
        "obomedia entertainment",
        "pigeon publishing house",
        "podvertise",
        "popular culture and religion",
        "public domain books",
        "public domain",
        "quiet. please",
        "rabbit hole brief",
        "raghvendra singh",
        "referans kodu",
        "sol good media",
        "sol good network",
        "solgoodmedia.com",
        "spellbound audio",
        "storyflo",
        "sunnyverse ai labs",
        "teesnee ai",
        "the daily news now!",
        "the oldies radio",
        "the podcast network",
        "tvweo",
        "Launchpod Studio",

        "xyz"
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

    const genres = [
        "1800s genre",
        "1900s genre",
        "19th and 20th century fiction",
        "action and adventure genre",
        "action&adventure fiction genre",
        "ancient genre",
        "animals & nature",
        "animals and nature genre",
        "anthologies genre",
        "assorted non fiction",
        "audiobooks by librivox",
        "audiobooks on line",
        "audiobooks",
        "audiobooks, podcasts and more",
        "autobiographies genre",
        "biographies  genre",
        "biographies genre",
        "christianity genre",
        "culture and heritage classics",
        "detective fiction genre",
        "early modern genre",
        "early modern",
        "family and culture",
        "family genre",
        "fantasy genre",
        "fiction classics",
        "general fiction genre",
        "general genre",
        "gothic genre",
        "greek and latin classics genre",
        "heritage radio vault",
        "historical genre",
        "history genre",
        "horror genre",
        "humor genre",
        "humorous fiction genre",
        "legends and fairy tales",
        "literary collections genre",
        "literary fiction genre",
        "memoirs genre",
        "modern genre",
        "myths genre",
        "nature and animals",
        "nature genre",
        "non fiction genre",
        "philosophy genre",
        "plays genre",
        "poetry genre",
        "politics genre",
        "politics, philosophy, religion",
        "popular audiobooks",
        "popular culture and religion",
        "public domain books",
        "public domain",
        "religion genre",
        "romance genre",
        "romance stories",
        "satire genre",
        "science fiction genre",
        "science genre",
        "science stories",
        "short stories genre",
        "short stories",
        "short works genre",
        "single author genre",
        "tragedy genre",
        "travel genre",
        "war and military genre",
        "westerns genre",
        "Multi Poetry Genre",



        "easy listening"
    ];

    const titles = [

        { text: "Aankoopmakelaar", regex: new RegExp("Aankoopmakelaar", "gi")},
        { text: "Advocaat Familierecht", regex: new RegExp("Advocaat\\sFamilierecht", "gi")},
        { text: "Airco", regex: new RegExp("Airco", "gi")},
        { text: "Arbeidsrecht Advocaat", regex: new RegExp("Arbeidsrecht\\sAdvocaat", "gi")},
        { text: "Architect", regex: new RegExp("Architect", "gi")},
        { text: "Asbest Verwijderen", regex: new RegExp("Asbest\\sVerwijderen", "gi")},
        { text: "Auto Verkopen", regex: new RegExp("Auto\\sVerkopen", "gi")},
        { text: "Badkamer Renovatie", regex: new RegExp("Badkamer Renovatie", "gi")},
        { text: "Boomverzorging", regex: new RegExp("Boomverzorging", "gi")},
        { text: "Dakdekker", regex: new RegExp("Dakdekker", "gi")},
        { text: "Dakkapel", regex: new RegExp("Dakkapel", "gi")},
        { text: "Elektricien", regex: new RegExp("Elektricien", "gi")},
        { text: "Familierecht Advocaat", regex: new RegExp("Familierecht\ssAdvocaat", "gi")},
        { text: "Gemeente", regex: new RegExp("Gemeente", "gi")},
        { text: "Gevelreiniging", regex: new RegExp("Gevelreiniging", "gi")},
        { text: "Gietvloer", regex: new RegExp("Gietvloer", "gi")},
        { text: "Glaszetter", regex: new RegExp("Glaszetter", "gi")},
        { text: "Hekwerk", regex: new RegExp("Hekwerk", "gi")},
        { text: "Hovenier", regex: new RegExp("Hovenier", "gi")},
        { text: "Huurrecht Advocaat", regex: new RegExp("Huurrecht\\sAdvocaat", "gi")},
        { text: "Inbraakbeveiliging", regex: new RegExp("Inbraakbeveiliging", "gi")},
        { text: "Isolatiebedrijf", regex: new RegExp("Isolatiebedrijf", "gi")},
        { text: "Letselschade Advocaat", regex: new RegExp("Letselschade\\sAdvocaat", "gi")},
        { text: "Ontstoppingsbedrijf", regex: new RegExp("Ontstoppingsbedrijf", "gi")},
        { text: "Operatie Klimaa", regex: new RegExp("Operatie\\sKlimaa", "gi")},
        { text: "Operatie Klimaat", regex: new RegExp("Operatie\\sKlimaat", "gi")},
        { text: "Pro Deo Advocaat", regex: new RegExp("Pro\\sDeo\\sAdvocaat", "gi")},
        { text: "Rolluiken", regex: new RegExp("Rolluiken", "gi")},
        { text: "Schilder", regex: new RegExp("Schilder", "gi")},
        { text: "Schoonmaakbedrijf", regex: new RegExp("Schoonmaakbedrijf", "gi")},
        { text: "Slotenmaker", regex: new RegExp("Slotenmaker", "gi")},
        { text: "Strafrecht Advocaat", regex: new RegExp("Strafrecht\\sAdvocaat", "gi")},
        { text: "Stukadoor", regex: new RegExp("Stukadoor", "gi")},
        { text: "Traplift", regex: new RegExp("Traplift", "gi")},
        { text: "Traprenovatie", regex: new RegExp("Traprenovatie", "gi")},
        { text: "Verhuisbedrijf", regex: new RegExp("Verhuisbedrijf", "gi")},
        { text: "Vloerisolatie", regex: new RegExp("Vloerisolatie", "gi")},
        { text: "Vochtbestrijding", regex: new RegExp("Vochtbestrijding", "gi")},
        { text: "Warmtepomp", regex: new RegExp("Warmtepomp", "gi")},
        { text: "Waterontharder", regex: new RegExp("Waterontharder", "gi")},
        { text: "Webdesign", regex: new RegExp("Webdesign", "gi")},
        { text: "Zonnepanelen", regex: new RegExp("Zonnepanelen", "gi")}
    ];

    const nlCities = [
        'Soest',
        'Alkmaar',
        'Almelo',
        'Almere',
        'Amersfoort',
        'Amstelveen',
        'Amsterdam',
        'Apeldoorn',
        'Arnhem',
        'Assen',
        'Barendrecht',
        'Breda',
        'Delft',
        'Den Bosch',
        'Den Haag',
        'Den Helder',
        'Deventer',
        'Doetinchem',
        'Dordrecht',
        'Eindhoven',
        'Emmen',
        'Enschede',
        'Geleen',
        'Gouda',
        'Groningen',
        'Haarlem',
        'Hardenberg',
        'Heerhugowaard',
        'Heemstede',
        'Heerlen',
        'Helmond',
        'Hengelo',
        'Hilversum',
        'Hoofddorp',
        'Hoorn',
        'IJmuiden',
        'Kerkrade',
        'Krimpen aan den IJssel',
        'Leeuwarden',
        'Leiden',
        'Lelystad',
        'Maastricht',
        'Nieuwegein',
        'Nijmegen',
        'Nieuw-Vennep',
        'Nootdorp',
        'Oosterhout',
        'Oss',
        'Purmerend',
        'Ridderkerk',
        'Roosendaal',
        'Rotterdam',
        'Schiedam',
        'Sittard',
        'Sneek',
        'Spijkenisse',
        'Tilburg',
        'Uden',
        'Utrecht',
        'Veenendaal',
        'Venlo',
        'Vlaardingen',
        'Wijchen',
        'Zaandam',
        'Zoetermeer',
        'Zwolle'
    ];

    const deepLinks = [

        { text: "Google Drive Link", regex: new RegExp("https\\x3a\\x2f\\x2fdrive\\x2egoogle\\x2ecom\\x2fdrive\\x2ffolders\\x2f([a-z0-9\\x2\\x5f])", "gi")},
        { text: "Google Share Link", regex: new RegExp("https\\x3a\\x2f\\x2fshare\\x2egoogle\\x2f([a-z0-9]{1,})", "gi")},

        /* Social Media */
        { text: "Instagram.com Username", regex: new RegExp("https\\x3a\\x2f\\x2finstagram\\x2ecom\\x2f([a-z0-9\\x2d\\x5f]{1,})", "gi")},
        { text: "LinkedIn Username", regex: new RegExp("https\\x3a\\x2f\\x2fwww\\x2elinkedin\\x2ecom\\x2fin\\x2f([a-z0-9\\x2d\\x5f]{1,})\\x2f", "gi")},
        { text: "Youtube Username", regex: new RegExp("https\\x3a\\x2f\\x2fwww\\x2eyoutube\\x2ecom\\x2f\\x40([a-z0-9\\x2d\\x5f]{1,})(\\x2f)?", "gi")},
        { text: "BlueSky Username", regex: new RegExp("https\\x3a\\x2f\\x2fbsky\\x2eapp\\x2fprofile\\x2f([a-z0-9\\x2d\\x2e\\x5f]{1,})", "gi")},



        /* Telegram */
        { text: "Telegram Phonenumber", regex: new RegExp("https\\x3a\\x2f\\x2ft\\x2eme\\x2f\\x2b(\\d{1,})", "gi")},
        { text: "Telegram Username", regex: new RegExp("https\\x3a\\x2f\\x2ft\\x2eme\\x2f([a-z0-9\\x2d\\x5f]{1,})", "gi")},

        /* WhatsApp */
        { text: "WhatsApp Phonenumber", regex: new RegExp("https\\x3a\\x2f\\x2fwa\\x2eme\\x2f(\\d{1,})", "gi")},
        { text: "WhatsApp Chat", regex: new RegExp("https\\x3a\\x2f\\x2fchat\\x2ewhatsapp\\x2ecom\\x2f([a-z0-9\\x2d\\x5f]{1,})", "gi")},

        { text: "LinkTr.ee Username", regex: new RegExp("https\\x3a\\x2f\\x2flinktr\\x2eee\\x2f([a-z0-9\\x2d\\x5f]{1,})", "gi")},

        /* Blogs */
        { text: "Blogspot", regex: new RegExp("https\\x3a\\x2f\\x2f([a-z0-9]{1,})\\x2eblogspot\\x2ecom", "gi")},
        { text: "Substack", regex: new RegExp("https\\x3a\\x2f\\x2f([a-z0-9]{1,})\\x2esubstack\\x2ecom", "gi")},

        /* Twitter */
        { text: "Twitter Username", regex: new RegExp("https\\x3a\\x2f\\x2ftwitter\\x2ecom\\x2f([a-z0-9\\x2d\\x5f]{1,})", "gi")},

        /* Payments */
        { text: "CashApp", regex: new RegExp("https\\x3a\\x2f\\x2fcash\\x2eapp\\x2f\\x24([a-z0-9\\x2d]{1,})", "gi")},
        { text: "PayPalMe", regex: new RegExp("https\\x3a\\x2f\\x2fwww\\x2epaypal\\x2ecom\\x2fpaypalme\\x2f([a-z0-9\\x2d]{1,})", "gi")},
        { text: "Venmo", regex: new RegExp("https\\x3a\\x2f\\x2fvenmo\\x2ecom\\x2fu\\x2f([a-z0-9\\x2d]{1,})", "gi")},


        /* Shopping */
        { text: "Audible", regex: new RegExp("https\\x3a\\x2f\\x2fwww\\x2eaudible\\x2ecom\\x2fpd\\x2f([a-z0-9\\x2d]{1,})\\x2f([a-z0-9\\x2d]{1,})", "gi")},
        { text: "Amazon", regex: new RegExp("https\\x3a\\x2f\\x2fwww\\x2eamazon\\x2ecom\\x2f([a-z0-9\\x2d]{1,})\\x2fdp\\x2f(\\d{1,})\\x2f", "gi")}
    ];

    const whackyPhoneNumbers = [

        { text: "TR", regex: new RegExp("0532\\s(\\d{3})\\s(\\d{2})\\s(\\d{2})", "gi")},


        { text: "AU", regex: new RegExp("\\x2b61(\\x2d|\\x3a|\\x28)([0-9O]{3})(\\x2d|\\x3a|\\x29)([0-9O]{3})(\\x2d|\\x3a)([0-9O]{3})", "gi")},

        { text: "UK", regex: new RegExp("\\x2b44\\x3a(\\d{3})\\x3a(\\d{3})\\x3a(\\d{3,4})", "gi")},
        { text: "UK", regex: new RegExp("\\x2b44\\x28(\\d{3})\\x2d(\\d{3})\\x2d(\\d{4})\\x29", "gi")},
        { text: "UK", regex: new RegExp("\\x2b44\\x28(\\d{3})\\x29(\\d{3})\\s(\\d{3})", "gi")},
        { text: "UK", regex: new RegExp("\\x2b44\\s(\\d{3})\\x2d(\\d{3})\\x2d(\\d{3})", "gi")},


        { text: "US", regex: new RegExp("\\x2b1\\x3a([0-9O]{3})\x7b([0-9O]{3})\x7d([0-9O]{4})", "gi")},
        { text: "US", regex: new RegExp("\\b(\\d{3}|\\d{1,}OO)\\x3a(\\d{3}|\\d{1,}OO)\\x3a(\\d{4}|\\d{1,}OOO)\\b", "gi")},
        { text: "US", regex: new RegExp("\\x2b([\\d]{1,})\\x3a([\\dO]{3})(\\x3a|\\x28)([\\dO]{3})(\\x3a|\\x29)([\\dO]{4})", "gi")},
        { text: "US", regex: new RegExp("\\x2b(\\d{1,})\\x3a(\\d{3})\\x3a(\\d{3})\\x3a([\\dO]{4})", "gi")},
        { text: "US", regex: new RegExp("\\x2b(\\d{1,})\\x3a(\\d{3})\\x3a\\x28(\\d{3})\\x29\\x3a(\\d{4})", "gi")},
        { text: "US", regex: new RegExp("\\b\\x28(\\d{1}OO|\\d{3})\\x3a\\x2d(\\d{3})\\x3a(\\d{4})\\x29", "gi")},
        { text: "US", regex: new RegExp("\\d{1}\\x28(\\d{1}OO|\\d{3})\\x3a\\x2d(\\d{3})\\x3a(\\d{4})\\x29", "gi")},
        { text: "US", regex: new RegExp("\\d{1}\\x2d\\\d{3}\\x2d\\d{3}\\x2d\\d{4}", "gi")},
        { text: "US", regex: new RegExp("(\\d{3})\\u2012(\\d{3})\\u2012(\\d{4})", "gi")},
        { text: "US", regex: new RegExp("1\\s\\x28(\\d{3})\\u2012(\\d{3})\\u2012(\\d{4})\\x29", "gi")},
        { text: "US", regex: new RegExp("\\x28(\\d{3})\\x29\\s(\\d{3})\\x2d(\\d{4})", "gi")},

        { text: "US", regex: new RegExp("\\x2b1\\x3a(\\d{3})\\x3a(\\d{3})\\x3a(\\d{4})", "gi")},
        { text: "US", regex: new RegExp("\\x2b1\\x28(\\d{3})\\x29(\\d{3})\\s(\\d{4})", "gi")},
        { text: "US", regex: new RegExp("\\x2b1\\x28(\\d{3})\\x29(\\d{3})\\x2d(\\d{4})", "gi")},
        { text: "US", regex: new RegExp("\\x2b1\\s(\\d{3})\\x2d(\\d{3})\\x2d(\\d{4})", "gi")},
        { text: "US", regex: new RegExp("\\x2b0\\x3a(\\d{3})\\x3a(\\d{3})\\x3a(\\d{4})", "gi")},
        { text: "US", regex: new RegExp("\\x2b0\\s(\\d{3})\\x2d(\\d{3})\\x2d(\\d{4})", "gi")},
        { text: "US", regex: new RegExp("\\x28(\\d{3})\\x29\\x2d(\\d{3}|\\d{1}OO)\\x2d(\\d{4})", "gi")}
    ];


    // --- Helper Functions ---
    function extractiTunesId(string) {
        string = string.replace(/^itunes\x3a\s/gi,'');
        string = string.replace(/[^\d]/gi, '');
        if(string.match(/^\d{1,}$/gi)) {
            string = parseInt(string, 10);
        } else {
            string = 0;
        }
        return string;
    }

    function escapeRegExp(string) {
        // Automatically and safely escapes all regex special characters globally
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s');
    }

    /* Helper to avoid duplicate style and title updating logic */
    function flagElement(element, matchText, highlightWholeCard = false) {
        const target = highlightWholeCard ? element.closest('div.curate-card') : element;
        if (!target) return;

        target.style.border = "2px solid red";
        target.style.backgroundColor = "yellow";
        target.style.padding = "2px";

        const existingTitle = target.getAttribute('title');
        target.setAttribute('title', existingTitle ? `${existingTitle}, ${matchText}` : matchText);
    }

    function flagElementLegit(element, matchText, highlightWholeCard = false) {
        const target = highlightWholeCard ? element.closest('div.curate-card') : element;
        if (!target) return;

        target.style.color = "white";
        target.style.border = "2px solid yellow";
        target.style.backgroundColor = "green";
        target.style.padding = "2px";

        const existingTitle = target.getAttribute('title');
        target.setAttribute('title', existingTitle ? `${existingTitle}, ${matchText}` : matchText);
    }

    function flagElementSecurity(element, matchText, highlightWholeCard = false) {
        const target = highlightWholeCard ? element.closest('div.curate-card') : element;
        if (!target) return;

        target.style.color = "white";
        target.style.border = "2px solid red";
        target.style.backgroundColor = "orange";
        target.style.padding = "2px";

        const existingTitle = target.getAttribute('title');
        target.setAttribute('title', existingTitle ? `${existingTitle}, ${matchText}` : matchText);
    }

    function flagElementInvalid(element, matchText, highlightWholeCard = false) {
        const target = highlightWholeCard ? element.closest('div.curate-card') : element;
        if (!target) return;

        target.style.color = "white";
        target.style.border = "2px solid black";
        target.style.backgroundColor = "red";
        target.style.padding = "2px";

        const existingTitle = target.getAttribute('title');
        target.setAttribute('title', existingTitle ? `${existingTitle}, ${matchText}` : matchText);
    }

    function ascii_to_hexadecimal(str) {
        var arr1 = [];
        for (var n = 0, l = str.length; n < l; n++) {
            var hex = str.charCodeAt(n).toString(16).padStart(2, '0');
            arr1.push(hex + ' ');
        }
        return arr1.join('').trim();
    }


    // --- Pre-compile Regexes once to save computing power ---
    const titlePatterns = titleTexts.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));
    const feedPatterns = feedURLs.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));
    const feedPrefixPatterns = feedURLprefixes.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));
    const descPatterns = descriptionTexts.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));
    const ownerPatterns = ownersTexts.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));
    const ownerLegitPatterns = ownersTextsLegit.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));

    const feedLegit = feedURLlegit.map(text => ({ text, regex: new RegExp(escapeRegExp(text), "gi") }));

    const nakedLinkPatterns = targetTLDs.map(tld => ({ tld, regex: new RegExp(`http(s)?\\x3a\\x2f\\x2f[a-z0-9\x2d\x2e]{1,}\\x2e${tld}\\s`, "gi") }));
    const nakedLinkDomainPatterns = targetTLDs.map(tld => ({ tld, regex: new RegExp(`([a-z0-9\x2d\x2e]{1,})\\x2e${tld}`, "gi") }));
    const nakedDomainPatterns = targetTLDs.map(tld => ({ tld, regex: new RegExp(`([a-z0-9\x2d\x2e]{1,})\\x2e${tld}`, "gi") }));


    // --- Main Curation Logic ---
    function curate() {
        const cards = document.querySelectorAll('div.curate-card');

        var markNumber = 30; /* mark number when hijcked */
        var podcast_id = null;
        var podcast_byline = false;
        var podcast_desc = false;
        var podcast_url = false;
        var podcast_itunes = false;
        var podcast_language = false;
        var podcast_generator = false;

        cards.forEach((podcast) => {

            podcast_id = null;
            podcast_byline = false;
            podcast_desc = false;
            podcast_url = false;
            podcast_itunes = false;
            podcast_language = false;
            podcast_generator = false;

            const podcastIdEl = podcast.querySelector('span.pcid');
            if (podcastIdEl && podcastIdEl.innerText.trim().length > 0) {
                podcast_id = podcastIdEl.innerText;
                podcast_id = podcast_id.replace(/^id\s/gi, '');

                const linkPodcastId = document.createElement('a');
                linkPodcastId.target = '_blank'
                linkPodcastId.href = 'https://api.podcastindex.org/dashboard?q=' + podcast_id;
                linkPodcastId.innerText = 'id ' + podcast_id;
                podcastIdEl.parentElement.replaceChild(linkPodcastId, podcastIdEl);
            }


            /* 1. Extract & Test Title */
            const titleEl = podcast.querySelector('h3 a');
            if (titleEl && titleEl.innerText.trim().length > 0) {
                const title = titleEl.innerText;
                titlePatterns.forEach(item => {
                    if (title.match(item.regex)) {
                        flagElement(titleEl, item.text);
                    }
                });

                titles.forEach(item => {
                    if (title.match(item.regex)) {
                        flagElement(titleEl, 'TitleFrags ' + item.text);
                        podcast_desc = true;
                    }
                });

                casinoFrags.forEach(item => {
                    if (title.match(item.regex)) {
                        flagElement(titleEl, 'CasinoFrags ' + item.text);
                        podcast_desc = true;
                    }
                });

                inlineFragments.forEach(item => {
                    if (title.match(item.regex)) {
                        flagElement(titleEl, 'Fragment ' + item.text);
                        podcast_desc = true;
                    }
                });

                descriptionPhonenumbers.forEach(item => {
                    if (title.match(item.regex)) {
                        flagElement(titleEl, 'Phonenumber ' + item.text);
                        podcast_desc = true;
                    }
                });

                whackyPhoneNumbers.forEach(item => {
                    if (title.match(item.regex)) {
                        flagElement(titleEl, 'WhackyPhoneNumber ' + item.text);
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

                feedURLsecurity.forEach(item => {
                    if (url.match(item.regex)) {
                        flagElementSecurity(feedUrlEl, item.text);
                    }
                });



            }

            /* 3. Extract & Test Description */
            const descEl = podcast.querySelector('div.description');
            if (descEl && descEl.innerText.trim().length > 0) {
                const descText = descEl.innerText;

                /* Add fancy expand functionality to description block */
                descEl.addEventListener('click', () => {
                    descEl.style = "-webkit-line-clamp: none;";
                });

                // Highlight naked link formats
                /*
                nakedLinkPatterns.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(descEl, 'NakedLinkPatterns ' + item.tld);
                        podcast_desc = true;
                    }
                });
                */

                // Highlight naked domains (Runs correctly now if a domain hit occurred)
                /*
                nakedDomainPatterns.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(descEl, 'NakedDomainPatterns ' + item.tld);
                        podcast_desc = true;
                    }
                });
                */


                /* Different domain struct */
                /*
                nakedLinkDomainPatterns.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(descEl, 'NakedLinkDomainPatterns ' + item.tld);
                        podcast_desc = true;
                    }
                });
                */

                /* Look for feedPrefixes */
                feedPrefixPatterns.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(descEl, item.tld);
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

                deepLinks.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(descEl, 'DeepLink ' + item.text);
                        podcast_desc = true;
                    }
                });

                descriptionPhonenumbers.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(descEl, 'Phonenumber ' + item.text);
                        podcast_desc = true;
                    }
                });

                whackyPhoneNumbers.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(descEl, 'WhackyPhoneNumber ' + item.text);
                        podcast_desc = true;
                    }
                });

                casinoFrags.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(descEl, 'CasinoFrags ' + item.text);
                        podcast_desc = true;
                    }
                });

                inlineFragments.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(descEl, 'Fragment ' + item.text);
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

                ownerLegitPatterns.forEach(item => {
                    if (bylineText.match(item.regex)) {
                        flagElementLegit(bylineEl, item.text);
                        podcast_byline = true;
                    }
                });

                // Highlight bad keywords
                descPatterns.forEach(item => {
                    if (bylineText.match(item.regex)) {
                        flagElement(bylineEl, item.text);
                        podcast_byline = true;
                    }
                });

                casinoFrags.forEach(item => {
                    if (bylineText.match(item.regex)) {
                        flagElement(bylineEl, 'CasinoFrags ' + item.text);
                        podcast_desc = true;
                    }
                });

                inlineFragments.forEach(item => {
                    if (bylineText.match(item.regex)) {
                        flagElement(bylineEl, 'Fragment ' + item.text);
                        podcast_byline = true;
                    }
                });

            }


            /* 5. Check for iTunes */
            const extrasEl = podcast.querySelectorAll('div.extras span');
            extrasEl.forEach((extra) => {

                // console.log(extra);
                if (extra.innerText.match(/^iTunes\x3a/gi)) {
                    if (extractiTunesId(extra.innerText) > 0) {
                        flagElementLegit(extra, 'iTunes');
                        podcast_itunes = true;
                    }
                }

                if (extra.innerText.match(/Lang\x3a/gi)) {
                    const language = extra.innerText.replace('lang: ', '');
                    extraLanguages.forEach(item => {
                        if (language.match(item.regex)) {
                            flagElementLegit(extra, item.text);
                            podcast_language = true;
                        }
                    });
                    if (podcast_language === false) {
                        console.log('language', language, ascii_to_hexadecimal(language));
                        flagElementInvalid(extra, 'invalid language code');
                    }
                }

                if (extra.innerText.match(/gen\x3a/gi)) {
                    const generator = extra.innerText.replace('gen: ', '');
                    extraGenerators.forEach(item => {
                        if (generator.match(item.regex)) {
                            flagElementLegit(extra, item.text);
                            podcast_generator = true;
                        }
                    });

                    if (podcast_generator === false) {
                        console.log('generator', generator, ascii_to_hexadecimal(generator));
                        flagElementInvalid(extra, 'Not recognized');
                    }

                }

            });

            /*
            if (podcast_url == true && podcast_byline == true && markNumber > 0) {
                const podcastCheckbox = podcast.querySelector('div.col-image input.checkbox-overlay');
                podcastCheckbox.checked = true;
                markNumber -= 1;
            }
            */

            const episodebox = podcast.querySelector('div.episode-block div.episode-empty');
            if (episodebox) {
                var episodebox_p = episodebox.parentElement;
                if (episodebox.innerText.match(/no\sepisodes\syet/gi)) {

                    /* <a class="btn btn-success feedScan" title="Scanning a feed just fetches the latest RSS content.">Scan</a> */
                    const scanBtn = document.createElement('a');
                    scanBtn.classList.add("btn", "btn-success", "feedScan");
                    scanBtn.innerText = 'Scan';

                    scanBtn.addEventListener('click', () => {
                        // var podcastId = podcast.querySelector('span.pcid').innerText;
                        // podcastId = podcastId.replace(/^id\s/gi, '');
                        // podcastId = parseInt(podcastId, 10);
                        console.log(podcast_id);

                        // var podcastTitle = podcast.parentElement.parentElement.find('.result-title a').text();

                        if (parseInt(podcast_id, 10) > 0) {
                            requestFeedScan(parseInt(podcast_id, 10));
                        }
                        return false;

                    });

                    episodebox_p.replaceChild(scanBtn, episodebox);


                    /* <a class="btn btn-danger feedDelete" title="Deleting a feed marks it as dead in the database">Delete</a> */
                    const deleteBtn = document.createElement('a');
                    deleteBtn.classList.add("btn", "btn-danger", "feedDelete");
                    deleteBtn.innerText = 'Delete';

                    deleteBtn.addEventListener('click', () => {
                        // var podcastId = podcast.querySelector('span.pcid').innerText;
                        // podcastId = podcastId.replace(/^id\s/gi, '');
                        // podcastId = parseInt(podcastId, 10);
                        console.log(podcast_id);

                        // var podcastTitle = podcast.parentElement.parentElement.find('.result-title a').text();

                        if (parseInt(podcast_id, 10) > 0) {
                            requestFeedDelete(parseInt(podcast_id, 10));
                        }
                        return false;

                    });

                    episodebox_p.appendChild(deleteBtn);
                }
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

                whackyPhoneNumbers.forEach(item => {
                    if (title.match(item.regex)) {
                        flagElement(titleEl, 'WhackyPhoneNumber ' + item.text);
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
                whackyPhoneNumbers.forEach(item => {
                    if (descText.match(item.regex)) {
                        flagElement(descEl, 'WhackyPhoneNumber ' + item.text);
                    }
                });

            }

            /* 4. Extract & Test Owner / Byline */
            const bylineEl = podcast.querySelector('div.result-info p');
            if (bylineEl && bylineEl.innerText.trim().length > 0) {
                bylineText = bylineEl.innerText;

                /* Mark questionable owners */
                ownerPatterns.forEach(item => {
                    if (bylineText.match(item.regex)) {
                        flagElement(bylineEl, item.text);
                    }
                });

                /* Mark legit owners */
                ownerLegitPatterns.forEach(item => {
                    if (bylineText.match(item.regex)) {
                        flagElementLegit(bylineEl, item.text);
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

            if (url.match(/spreaker\x2ecom/gi)) {
                if (bylineText.match(/Maria\sTiffany/gi)) {
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

            if (url.match(/spreaker\x2ecom/gi)) {
                if (bylineText.match(/solgoodmedia\x2ecom/gi) || bylineText.match(/Sol\sGood\sMedia/gi)) {
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


            if(
                bylineText.match(/GSMC\sSports\sNetwork/gi)
                ||
                bylineText.match(/GSMC\sSports\sPodcasts/gi)
                ||
                bylineText.match(/GSMC\sComedy\s\x26\sFamily\sNetwork/gi)
                ||
                bylineText.match(/GSMC\sMusic\s\x26\sTheater\sNetwork/gi)
                ||
                bylineText.match(/GSMC\sDrama\sNetwork/gi)
                ||
                bylineText.match(/GSMC\sReligion\sNetwork/gi)
                ||
                bylineText.match(/GSMC\sAudiobooks\sNetwork/gi)
                ||
                bylineText.match(/GSMC\sEntertainment\sNetwork/gi)
                ||
                bylineText.match(/GSMC\sNews\sPodcasts/gi)
                ||
                bylineText.match(/GSMC\sAction\sPodcasts/gi)
            ) {
                const spamButton = podcast.querySelector('div.spam-dropdown a.feedSpamMenu');
                spamButton.click();
                const spamMenu = podcast.querySelector('div.spam-menu a[data-reason="6"]');
                setTimeout(() => {
                    if (spamMenu) {
                        spamMenu.click();
                    }
                }, 250);

            }

            if (url.match(/https\x3a\x2f\x2ffeeds\x2emegaphone\x2efm\x2fUPIAO/gi)) {
                const spamButton = podcast.querySelector('div.spam-dropdown a.feedSpamMenu');
                spamButton.click();
                const spamMenu = podcast.querySelector('div.spam-menu a[data-reason="2"]');
                setTimeout(() => {
                    if (spamMenu) {
                        spamMenu.click();
                    }
                }, 250);
            }


            if (
                title.match(/2\sMinutes\swith\sJoey\s\x2d\s/gi)
                ||
                bylineText.match(/2\sMinutes\swith\sJoey/gi)
            ) {
                const spamButton = podcast.querySelector('div.spam-dropdown a.feedSpamMenu');
                spamButton.click();
                const spamMenu = podcast.querySelector('div.spam-menu a[data-reason="2"]');
                setTimeout(() => {
                    if (spamMenu) {
                        spamMenu.click();
                    }
                }, 250);
            }

            if (bylineText.match(/Launchpod\sStudio(s)?/gi)) {
                const spamButton = podcast.querySelector('div.spam-dropdown a.feedSpamMenu');
                spamButton.click();
                const spamMenu = podcast.querySelector('div.spam-menu a[data-reason="2"]');
                setTimeout(() => {
                    if (spamMenu) {
                        spamMenu.click();
                    }
                }, 250);
            }



        });

    }

    function searchbuttonrandom() {
        const targetNav = document.querySelectorAll('form.form-inline')[0]; /* form.form-inline */

        /* Create button and set up */
        const authorBtn = document.createElement('button');
        authorBtn.id = "randomAuthor";
        authorBtn.classList.add("btn", "btn-outline-success", "my-2", "my-sm-0");
        authorBtn.innerText = 'Author';

        /* Create button and set up */
        const genreBtn = document.createElement('button');
        genreBtn.id = "randomGenre";
        genreBtn.classList.add("btn", "btn-outline-success", "my-2", "my-sm-0");
        genreBtn.innerText = 'Genre';

        /* Create button and set up */
        const ownerBtn = document.createElement('button');
        ownerBtn.id = "randomOwner";
        ownerBtn.classList.add("btn", "btn-outline-success", "my-2", "my-sm-0");
        ownerBtn.innerText = 'Owner';

        /* Create button and set up */
        const titleBtn = document.createElement('button');
        titleBtn.id = "randomOwner";
        titleBtn.classList.add("btn", "btn-outline-success", "my-2", "my-sm-0");
        titleBtn.innerText = 'Title';


        if (!targetNav) {
            console.warn("Element with id 'navbarSupportedContent' not found.");
        }


        // 3. Add the click event listener functionality
        authorBtn.addEventListener('click', () => {
            // Pick a random author
            const randomAuthor = authors[Math.floor(Math.random() * authors.length)];

            // Find the input element and populate it
            const searchInput = document.getElementById('searchText');
            if (searchInput) {
                searchInput.value = randomAuthor;
                searchInput.name = "q";
            }

            // Find the trigger button and click it
            const searchTrigger = document.getElementById('searchTrigger');
            if (searchTrigger) {
                if(searchInput.value.length > 0) {
                    searchInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                    searchTrigger.click();
                }
            }
        });

        genreBtn.addEventListener('click', () => {
            // Pick a random author
            const randomGenre = genres[Math.floor(Math.random() * genres.length)];

            // Find the input element and populate it
            const searchInput = document.getElementById('searchText');
            if (searchInput) {
                searchInput.value = randomGenre;
                searchInput.name = "q";
            }

            // Find the trigger button and click it
            const searchTrigger = document.getElementById('searchTrigger');
            if (searchTrigger) {
                if(searchInput.value.length > 0) {
                    searchInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                    searchTrigger.click();
                }
            }
        });

        ownerBtn.addEventListener('click', () => {
            // Pick a random author
            const randomOwner = owners[Math.floor(Math.random() * owners.length)];

            // Find the input element and populate it
            const searchInput = document.getElementById('searchText');
            if (searchInput) {
                searchInput.value = randomOwner;
                searchInput.name = "q";
            }

            // Find the trigger button and click it
            const searchTrigger = document.getElementById('searchTrigger');
            if (searchTrigger) {
                if(searchInput.value.length > 0) {
                    searchInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                    searchTrigger.click();
                }
            }
        });

        titleBtn.addEventListener('click', () => {
            // Pick a random author
            const randomTitle = titles[Math.floor(Math.random() * titles.length)];

            // Find the input element and populate it
            const searchInput = document.getElementById('searchText');
            if (searchInput) {
                searchInput.value = randomTitle;
                searchInput.name = "q";
            }

            // Find the trigger button and click it
            const searchTrigger = document.getElementById('searchTrigger');
            if (searchTrigger) {
                if(searchInput.value.length > 0) {
                    searchInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                    searchTrigger.click();
                }
            }
        });


        targetNav.appendChild(authorBtn);
        targetNav.appendChild(genreBtn);
        targetNav.appendChild(ownerBtn);
        targetNav.appendChild(titleBtn);
    }


    // --- Execution Triggers ---
    if (/curatenew|curatekilled/gi.test(window.location.href)) {
        console.log('PodcastIndex Curation Helper Active.');
        window.addEventListener('load', curate);
    }

    if (/dashboard/gi.test(window.location.href)) {
        console.log('PodcastIndex Curation Helper Active.');
        window.addEventListener('load', searchpages);
        window.addEventListener('load', searchbuttonrandom);
        console.log('PodcastIndex Curation Helper Buttons loaded.');
    }

    function requestFeedScan(pcid) {
        // var url = "https://" + location.hostname + "/cgi/fc/feed.scan";
        var url = "https://api.podcastindex.org/cgi/fc/feed.scan";
        console.log(url);

        const request = new Request(
            url, {
                method: "POST",
                body: JSON.stringify({ id: pcid.toString() }),
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
            });

        const response = fetch(request);
        console.log(response);
    }

    function requestFeedDelete(pcid) {
        var url = "https://api.podcastindex.org/cgi/fc/feed.delete";
        console.log(url);

        const request = new Request(
            url, {
                method: "POST",
                body: JSON.stringify({ id: pcid.toString() }),
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
            });

        const response = fetch(request);
        console.log(response);
    }



})();