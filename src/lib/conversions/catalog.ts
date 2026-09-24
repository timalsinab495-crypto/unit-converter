// The list of conversions shown on the site.
// This file only describes each conversion (names, examples, fun facts).
// The actual maths lives in ./formulas and only ever runs on the server.

import type { CategoryId, ConversionMeta, IconName } from "./types";

export interface Category {
  id: CategoryId;
  name: string;
  nepali: string;
  blurb: string;
  icon: IconName;
}

export const CATEGORIES: Category[] = [
  {
    id: "land",
    name: "Land",
    nepali: "जग्गा",
    blurb: "Hill units like ropani and aana, Terai units like bigha and kattha.",
    icon: "land-plot",
  },
  {
    id: "weight",
    name: "Weight",
    nepali: "तौल",
    blurb: "Market weights from the tarkari bazaar and the gold shop.",
    icon: "scale",
  },
  {
    id: "money",
    name: "Money",
    nepali: "पैसा",
    blurb: "Rates that change over time. They're read from environment variables.",
    icon: "coins",
  },
  {
    id: "temperature",
    name: "Temperature",
    nepali: "तापक्रम",
    blurb: "For the thermometer at home that still reads Fahrenheit.",
    icon: "thermometer",
  },
  {
    id: "everyday",
    name: "Everyday",
    nepali: "दैनिक",
    blurb: "Height, walking distance and the kitchen mana.",
    icon: "ruler",
  },
];

const HILL_LADDER = {
  title: "Hill land units",
  steps: ["1 ropani", "16 aana", "64 paisa", "256 daam"],
  visual: "hill-grid" as const,
};

const TERAI_LADDER = {
  title: "Terai land units",
  steps: ["1 bigha", "20 kattha", "400 dhur"],
  visual: "terai-grid" as const,
};

const MARKET_WEIGHT_LADDER = {
  title: "Market weights",
  steps: ["1 dharni", "3 ser", "12 pau", "48 chhatak"],
};

export const CONVERSIONS: ConversionMeta[] = [
  // ─── Land ───────────────────────────────────────────────────────────────
  {
    slug: "sq-meter-to-aana",
    title: "Square metres to aana",
    category: "land",
    icon: "grid",
    from: { symbol: "sq m", name: "Square metres", nepali: "वर्ग मिटर" },
    to: { symbol: "aana", name: "Aana", nepali: "आना" },
    summary: "Turn the square metres on a site plan into aana, the unit used in Kathmandu and the hills.",
    example: "1 aana = 31.8 sq m",
    funFact: "One aana is exactly 342.25 square feet. As a perfect square, that's 18.5 feet on each side.",
    ladder: HILL_LADDER,
    quickValues: [100, 250, 500, 1000],
  },
  {
    slug: "ropani-to-sq-feet",
    title: "Ropani to square feet",
    category: "land",
    icon: "land-plot",
    from: { symbol: "ropani", name: "Ropani", nepali: "रोपनी" },
    to: { symbol: "sq ft", name: "Square feet", nepali: "वर्ग फिट" },
    summary: "Find out how many square feet a plot measured in ropani covers.",
    example: "1 ropani = 5,476 sq ft",
    funFact: "If one ropani were a perfect square, each side would be 74 feet long, because 74 × 74 = 5,476.",
    ladder: HILL_LADDER,
    quickValues: [0.5, 1, 2.5, 4],
  },
  {
    slug: "bigha-to-kattha",
    title: "Bigha to kattha",
    category: "land",
    icon: "sprout",
    from: { symbol: "bigha", name: "Bigha", nepali: "बिघा" },
    to: { symbol: "kattha", name: "Kattha", nepali: "कट्ठा" },
    summary: "Split Terai farmland measured in bigha into kattha.",
    example: "1 bigha = 20 kattha",
    funFact: "Bigha, kattha and dhur are used across the Terai. One bigha is a little over 13 ropani.",
    ladder: TERAI_LADDER,
    quickValues: [0.5, 1, 2, 5],
  },
  {
    slug: "bigha-to-ropani",
    title: "Bigha to ropani",
    category: "land",
    icon: "mountain",
    from: { symbol: "bigha", name: "Bigha", nepali: "बिघा" },
    to: { symbol: "ropani", name: "Ropani", nepali: "रोपनी" },
    summary: "Compare Terai land in bigha with hill land in ropani.",
    example: "1 bigha ≈ 13.31 ropani",
    funFact: "One bigha is 72,900 sq ft and one ropani is 5,476 sq ft. Dividing the two gives about 13.31.",
    ladder: TERAI_LADDER,
    quickValues: [0.25, 1, 2, 10],
  },

  // ─── Weight ─────────────────────────────────────────────────────────────
  {
    slug: "kg-to-dharni",
    title: "Kilograms to dharni",
    category: "weight",
    icon: "scale",
    from: { symbol: "kg", name: "Kilograms", nepali: "किलोग्राम" },
    to: { symbol: "dharni", name: "Dharni", nepali: "धार्नी" },
    summary: "Convert kilos into dharni, still used for meat, vegetables and ghee in local markets.",
    example: "1 dharni ≈ 2.39 kg",
    funFact: "A dharni is 3 ser, and a ser is 4 pau. So when a butcher says a quarter dharni, that's 3 pau.",
    ladder: MARKET_WEIGHT_LADDER,
    quickValues: [1, 5, 10, 25],
  },
  {
    slug: "gram-to-pau",
    title: "Grams to pau",
    category: "weight",
    icon: "weight",
    from: { symbol: "g", name: "Grams", nepali: "ग्राम" },
    to: { symbol: "pau", name: "Pau", nepali: "पाउ" },
    summary: "Convert grams into pau for tea, spices and small market buys.",
    example: "1 pau ≈ 199.5 g",
    funFact: "Pau means a quarter. Four pau make one ser, and twelve pau make one dharni.",
    ladder: MARKET_WEIGHT_LADDER,
    quickValues: [100, 250, 500, 1000],
  },
  {
    slug: "tola-to-gram",
    title: "Tola to grams",
    category: "weight",
    icon: "gem",
    from: { symbol: "tola", name: "Tola", nepali: "तोला" },
    to: { symbol: "g", name: "Grams", nepali: "ग्राम" },
    summary: "Convert the tola used by jewellers into grams.",
    example: "1 tola = 11.664 g",
    funFact: "Jewellers split a tola into 100 lal, so one lal of gold weighs about 0.117 grams.",
    ladder: { title: "Jeweller's weights", steps: ["1 tola", "100 lal"] },
    quickValues: [0.5, 1, 2, 5],
    rateEnv: "GOLD_PRICE_PER_TOLA_NPR",
  },

  // ─── Temperature ────────────────────────────────────────────────────────
  {
    slug: "fahrenheit-to-celsius",
    title: "Fahrenheit to Celsius",
    category: "temperature",
    icon: "thermometer",
    from: { symbol: "°F", name: "Fahrenheit", nepali: "फरेनहाइट" },
    to: { symbol: "°C", name: "Celsius", nepali: "सेल्सियस" },
    summary: "Read a Fahrenheit fever thermometer in Celsius, or the other way round.",
    example: "98.6 °F = 37 °C",
    funFact: "Normal body temperature is about 98.6 °F (37 °C). From 100.4 °F (38 °C) and up counts as a fever.",
    quickValues: [98.6, 100.4, 102, 104],
    allowNegative: true,
  },

  // ─── Everyday ───────────────────────────────────────────────────────────
  {
    slug: "feet-to-cm",
    title: "Feet to centimetres",
    category: "everyday",
    icon: "ruler",
    from: { symbol: "ft", name: "Feet", nepali: "फिट" },
    to: { symbol: "cm", name: "Centimetres", nepali: "सेन्टिमिटर" },
    summary: "Convert height in feet to centimetres for forms and visa applications.",
    example: "5.5 ft = 167.64 cm",
    funFact: "When someone says they're \"5.6\", they usually mean 5 ft 6 in, which is 5.5 ft, not 5.6 ft.",
    quickValues: [5, 5.25, 5.5, 6],
  },
  {
    slug: "km-to-kos",
    title: "Kilometres to kos",
    category: "everyday",
    icon: "footprints",
    from: { symbol: "km", name: "Kilometres", nepali: "किलोमिटर" },
    to: { symbol: "kos", name: "Kos", nepali: "कोस" },
    summary: "Translate kilometres into kos, the walking distance your grandparents still use.",
    example: "1 kos ≈ 3.2 km",
    funFact: "A kos is roughly two miles. On a hill trail, that's close to an hour of walking.",
    quickValues: [1, 5, 10, 42.2],
  },
  {
    slug: "litre-to-mana",
    title: "Litres to mana",
    category: "everyday",
    icon: "wheat",
    from: { symbol: "L", name: "Litres", nepali: "लिटर" },
    to: { symbol: "mana", name: "Mana", nepali: "माना" },
    summary: "Convert litres into mana, the wooden measure for rice and grain.",
    example: "1 mana ≈ 0.57 L",
    funFact: "Grain was measured by volume, not weight. 8 mana make a pathi, and 20 pathi make a muri.",
    ladder: { title: "Grain measures", steps: ["1 muri", "20 pathi", "160 mana"] },
    quickValues: [1, 2, 5, 10],
  },

  // ─── Money (rates come from environment variables) ──────────────────────
  {
    slug: "usd-to-npr",
    title: "US dollars to Nepali rupees",
    category: "money",
    icon: "dollar",
    from: { symbol: "USD", name: "US dollars", nepali: "अमेरिकी डलर" },
    to: { symbol: "NPR", name: "Nepali rupees", nepali: "नेपाली रुपैयाँ" },
    summary: "Convert US dollars to Nepali rupees at the rate set in USD_TO_NPR.",
    example: "Rate from USD_TO_NPR",
    funFact: "Nepal Rastra Bank publishes buying and selling rates every day. Banks and money changers add their own margin on top.",
    quickValues: [1, 10, 100, 1000],
    rateEnv: "USD_TO_NPR",
  },
  {
    slug: "inr-to-npr",
    title: "Indian rupees to Nepali rupees",
    category: "money",
    icon: "rupee",
    from: { symbol: "INR", name: "Indian rupees", nepali: "भारतीय रुपैयाँ" },
    to: { symbol: "NPR", name: "Nepali rupees", nepali: "नेपाली रुपैयाँ" },
    summary: "Convert Indian rupees to Nepali rupees at the rate set in INR_TO_NPR.",
    example: "Rate from INR_TO_NPR",
    funFact: "The Nepali rupee has been pegged to the Indian rupee at 1.60 since 1993.",
    quickValues: [100, 500, 1000, 5000],
    rateEnv: "INR_TO_NPR",
  },
  {
    slug: "npr-to-gold-tola",
    title: "Rupees to tola of gold",
    category: "money",
    icon: "gem",
    from: { symbol: "NPR", name: "Nepali rupees", nepali: "नेपाली रुपैयाँ" },
    to: { symbol: "tola gold", name: "Tola of gold", nepali: "तोला सुन" },
    summary: "See how much gold your budget buys, using the price per tola in GOLD_PRICE_PER_TOLA_NPR.",
    example: "Price from GOLD_PRICE_PER_TOLA_NPR",
    funFact: "Gold prices in Nepal are quoted per tola and change daily. The shop's making charge is added on top.",
    quickValues: [25000, 100000, 500000, 1000000],
    rateEnv: "GOLD_PRICE_PER_TOLA_NPR",
  },
  {
    slug: "npr-to-silver-tola",
    title: "Rupees to tola of silver",
    category: "money",
    icon: "coins",
    from: { symbol: "NPR", name: "Nepali rupees", nepali: "नेपाली रुपैयाँ" },
    to: { symbol: "tola silver", name: "Tola of silver", nepali: "तोला चाँदी" },
    summary: "See how much silver your budget buys, using SILVER_PRICE_PER_TOLA_NPR.",
    example: "Price from SILVER_PRICE_PER_TOLA_NPR",
    funFact: "Silver coins and anklets are popular Tihar and wedding gifts, and are priced per tola just like gold.",
    quickValues: [1000, 5000, 10000, 50000],
    rateEnv: "SILVER_PRICE_PER_TOLA_NPR",
  },
  {
    slug: "npr-to-petrol-litre",
    title: "Rupees to litres of petrol",
    category: "money",
    icon: "fuel",
    from: { symbol: "NPR", name: "Nepali rupees", nepali: "नेपाली रुपैयाँ" },
    to: { symbol: "L petrol", name: "Litres of petrol", nepali: "लिटर पेट्रोल" },
    summary: "See how many litres of petrol a budget buys, using PETROL_PRICE_PER_LITRE_NPR.",
    example: "Price from PETROL_PRICE_PER_LITRE_NPR",
    funFact: "Nepal Oil Corporation sets fuel prices, and they change a few times a year.",
    quickValues: [200, 500, 1000, 2000],
    rateEnv: "PETROL_PRICE_PER_LITRE_NPR",
  },
];

export function getConversion(slug: string): ConversionMeta | undefined {
  return CONVERSIONS.find((c) => c.slug === slug);
}

export function getCategory(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id)!;
}
