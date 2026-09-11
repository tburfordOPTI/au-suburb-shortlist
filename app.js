/**
 * AU Suburb Screen — data, filters, URL builders
 */

const DEFAULT_MAX_PRICE = 500000;
/** RBA average rate on new investment P&I housing loans (May 2026). */
const DEFAULT_INVESTOR_RATE = 6.31;
const DEFAULT_RATE_SOURCE = "RBA avg new investor P&I · May 2026";
const LOAN_YEARS = 30;

const finance = {
  budget: DEFAULT_MAX_PRICE,
  deposit: 100000,
  rate: DEFAULT_INVESTOR_RATE,
  rateSource: DEFAULT_RATE_SOURCE,
};

const SUBURBS = [

  {
    suburb: "Notting Hill",
    state: "VIC",
    postcode: "3168",
    type: "unit",
    beds: 2,
    median: 384000,
    rentWeekly: 565,
    growth1y: 10.9,
    crime: "AVERAGE",
    daysToLease: 22,
    note: "Unit median rent (suburb). Yield = rent×52÷median. Crime AVERAGE; campus/employment node.",
    rentSource: "Andrea Monti / unit market Aug 2026",
    tier: "unit",
  },
  {
    suburb: "Brooklyn Park",
    state: "SA",
    postcode: "5032",
    type: "unit",
    beds: 2,
    median: 455000,
    rentWeekly: 491,
    growth1y: 27.1,
    crime: "AVERAGE",
    daysToLease: 17,
    note: "Unit median rent (suburb). Hot 100 renewal corridor.",
    rentSource: "Andrea Monti unit rent Aug 2026",
    tier: "unit",
  },
  {
    suburb: "Wiley Park",
    state: "NSW",
    postcode: "2195",
    type: "unit",
    beds: 2,
    median: 466000,
    rentWeekly: 545,
    growth1y: 8.6,
    crime: "LOW",
    daysToLease: 19,
    note: "Unit median rent (suburb). Below NSW crime baselines.",
    rentSource: "Andrea Monti unit rent Jul 2026",
    tier: "unit",
  },
  {
    suburb: "Lakemba",
    state: "NSW",
    postcode: "2195",
    type: "unit",
    beds: 2,
    median: 480000,
    rentWeekly: 540,
    growth1y: 9.1,
    crime: "AVERAGE",
    daysToLease: 19,
    note: "Unit median rent Q2 2026 (Heatmaps). Liquid rental market.",
    rentSource: "Heatmaps unit rent Q2 2026",
    tier: "unit",
  },
  {
    suburb: "Acton",
    displayName: "Acton (Burnie)",
    state: "TAS",
    postcode: "7320",
    type: "house",
    beds: 3,
    median: 444000,
    rentWeekly: 442,
    growth1y: 24,
    growth5y: 94.9,
    crime: "LOW",
    note: "House median rent (suburb, typ. 3-bed). Verify street-level.",
    rentSource: "Andrea Monti house rent ~2026",
    tier: "house",
  },
  {
    suburb: "Bakewell",
    state: "NT",
    postcode: "0832",
    type: "house",
    beds: 3,
    median: 598000,
    rentWeekly: 670,
    growth1y: 30,
    crime: "AVERAGE",
    note: "House medians refreshed to 2026 market (~$598k) — above $500k budget; keep as stretch. Typ. 3–4 bed house rent.",
    rentSource: "YIP / OnTheHouse house rent mid-2026",
    tier: "stretch",
    maxPrice: 650000,
  },
  {
    suburb: "Merbein",
    state: "VIC",
    postcode: "3505",
    type: "house",
    beds: 3,
    median: 441000,
    rentWeekly: 450,
    growth1y: 26,
    crime: "ELEVATED",
    note: "House median rent for typ. 3-bed. Crime elevated flag.",
    rentSource: "StMate / PropRadar house rent ~2025–26",
    tier: "house",
  },
  {
    suburb: "Kalbarri",
    state: "WA",
    postcode: "6536",
    type: "house",
    beds: 3,
    median: 515000,
    rentWeekly: 450,
    growth1y: 40.2,
    crime: "LOW",
    note: "House market rent (REIWA-style suburb median); typ. 3-bed. Stretch ticket.",
    rentSource: "QuickProperty / REIWA market rent Feb 2026",
    tier: "stretch",
    maxPrice: 550000,
  },
  {
    suburb: "Sunshine",
    state: "VIC",
    postcode: "3020",
    type: "unit",
    beds: 2,
    median: 516000,
    rentWeekly: 595,
    growth1y: 12.2,
    crime: "AVERAGE",
    daysToLease: 23,
    note: "PropTrack dual-score unit. Melb west employment node. Rent derived from PropTrack 6.0% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "unit",
    maxPrice: 550000,
  },
  {
    suburb: "Bankstown",
    state: "NSW",
    postcode: "2200",
    type: "unit",
    beds: 2,
    median: 579000,
    rentWeekly: 612,
    growth1y: 9.2,
    crime: "AVERAGE",
    daysToLease: 19,
    note: "PropTrack dual-score unit. Sydney ISW yield play \u2014 verify street-level. Rent derived from PropTrack 5.5% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 625000,
  },
  {
    suburb: "West Gosford",
    state: "NSW",
    postcode: "2250",
    type: "unit",
    beds: 2,
    median: 610000,
    rentWeekly: 633,
    growth1y: 8.0,
    crime: "AVERAGE",
    daysToLease: 15,
    note: "PropTrack dual-score unit. Central Coast; fast lease. Rent derived from PropTrack 5.4% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 650000,
  },
  {
    suburb: "Cloverdale",
    state: "WA",
    postcode: "6105",
    type: "unit",
    beds: 2,
    median: 525000,
    rentWeekly: 666,
    growth1y: 26.5,
    crime: "AVERAGE",
    daysToLease: 17,
    note: "PropTrack dual-score unit. Perth SE. Rent derived from PropTrack 6.6% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 550000,
  },
  {
    suburb: "East Cannington",
    state: "WA",
    postcode: "6107",
    type: "unit",
    beds: 2,
    median: 560000,
    rentWeekly: 700,
    growth1y: 40.0,
    crime: "AVERAGE",
    daysToLease: 19,
    note: "PropTrack dual-score unit. Strong 1yr growth + yield. Rent derived from PropTrack 6.5% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 600000,
  },
  {
    suburb: "Hamilton Hill",
    state: "WA",
    postcode: "6163",
    type: "unit",
    beds: 2,
    median: 570000,
    rentWeekly: 636,
    growth1y: 41.8,
    crime: "AVERAGE",
    daysToLease: 15,
    note: "PropTrack dual-score unit. Perth SW. Rent derived from PropTrack 5.8% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 600000,
  },
  {
    suburb: "Belmont",
    state: "WA",
    postcode: "6104",
    type: "unit",
    beds: 2,
    median: 566000,
    rentWeekly: 675,
    growth1y: 27.3,
    crime: "AVERAGE",
    daysToLease: 17,
    note: "PropTrack dual-score unit. Perth SE airport corridor. Rent derived from PropTrack 6.2% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 600000,
  },
  {
    suburb: "Ascot",
    state: "WA",
    postcode: "6104",
    type: "unit",
    beds: 2,
    median: 558000,
    rentWeekly: 687,
    growth1y: 26.7,
    crime: "AVERAGE",
    daysToLease: 17,
    note: "PropTrack dual-score unit. Perth SE. Rent derived from PropTrack 6.4% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 600000,
  },
  {
    suburb: "Morphett Vale",
    state: "SA",
    postcode: "5162",
    type: "unit",
    beds: 2,
    median: 578000,
    rentWeekly: 500,
    growth1y: 22.7,
    crime: "AVERAGE",
    daysToLease: 14,
    note: "PropTrack dual-score unit. Adelaide south; fast lease. Rent derived from PropTrack 4.5% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 625000,
  },
  {
    suburb: "Camden Park",
    state: "SA",
    postcode: "5038",
    type: "unit",
    beds: 2,
    median: 618000,
    rentWeekly: 535,
    growth1y: 39.8,
    crime: "AVERAGE",
    daysToLease: 16,
    note: "PropTrack dual-score unit. Hot growth Adelaide west. Rent derived from PropTrack 4.5% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 650000,
  },
  {
    suburb: "Kippa-Ring",
    state: "QLD",
    postcode: "4021",
    type: "unit",
    beds: 2,
    median: 552000,
    rentWeekly: 531,
    growth1y: 22.7,
    crime: "AVERAGE",
    daysToLease: 22,
    note: "PropTrack dual-score unit. Moreton Bay North. Rent derived from PropTrack 5.0% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 600000,
  },
  {
    suburb: "City",
    displayName: "Canberra City",
    state: "ACT",
    postcode: "2601",
    type: "unit",
    beds: 2,
    median: 547000,
    rentWeekly: 621,
    growth1y: 11.7,
    crime: "AVERAGE",
    daysToLease: 25,
    note: "PropTrack dual-score unit. CBD/apartment market. Rent derived from PropTrack 5.9% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 575000,
  },
  {
    suburb: "Harrison",
    state: "ACT",
    postcode: "2914",
    type: "unit",
    beds: 2,
    median: 585000,
    rentWeekly: 641,
    growth1y: 3.8,
    crime: "LOW",
    daysToLease: 19,
    note: "PropTrack dual-score unit. Gungahlin; softer growth, solid yield. Rent derived from PropTrack 5.7% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 625000,
  },
  {
    suburb: "Melton West",
    state: "VIC",
    postcode: "3337",
    type: "house",
    beds: 3,
    median: 571000,
    rentWeekly: 461,
    growth1y: 8.8,
    crime: "AVERAGE",
    daysToLease: 27,
    note: "PropTrack dual-score house. Melb west growth corridor. Rent derived from PropTrack 4.2% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 600000,
  },
  {
    suburb: "Frankston North",
    state: "VIC",
    postcode: "3200",
    type: "house",
    beds: 3,
    median: 646000,
    rentWeekly: 509,
    growth1y: 9.5,
    crime: "AVERAGE",
    daysToLease: 28,
    note: "PropTrack dual-score house. Mornington Peninsula entry. Rent derived from PropTrack 4.1% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 675000,
  },
  {
    suburb: "Meadow Heights",
    state: "VIC",
    postcode: "3048",
    type: "house",
    beds: 3,
    median: 638000,
    rentWeekly: 552,
    growth1y: 10.0,
    crime: "ELEVATED",
    daysToLease: 26,
    note: "PropTrack dual-score house. Crime elevated flag (NW corridor near Broadmeadows). Rent derived from PropTrack 4.5% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 675000,
  },
  {
    suburb: "Laidley",
    state: "QLD",
    postcode: "4341",
    type: "house",
    beds: 3,
    median: 585000,
    rentWeekly: 562,
    growth1y: 19.4,
    crime: "AVERAGE",
    daysToLease: 25,
    note: "PropTrack dual-score house. Ipswich hinterland. Rent derived from PropTrack 5.0% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 625000,
  },
  {
    suburb: "Kilcoy",
    state: "QLD",
    postcode: "4515",
    type: "house",
    beds: 3,
    median: 630000,
    rentWeekly: 606,
    growth1y: 18.9,
    crime: "AVERAGE",
    daysToLease: 22,
    note: "PropTrack dual-score house. Moreton Bay North. Rent derived from PropTrack 5.0% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 675000,
  },
  {
    suburb: "North Booval",
    state: "QLD",
    postcode: "4304",
    type: "house",
    beds: 3,
    median: 650000,
    rentWeekly: 550,
    growth1y: 28.7,
    crime: "AVERAGE",
    daysToLease: 20,
    note: "PropTrack dual-score house. Ipswich / SEQ. Rent derived from PropTrack 4.4% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 675000,
  },
  {
    suburb: "East Ipswich",
    state: "QLD",
    postcode: "4305",
    type: "house",
    beds: 3,
    median: 649500,
    rentWeekly: 537,
    growth1y: 25.9,
    crime: "AVERAGE",
    daysToLease: 19,
    note: "PropTrack dual-score house. Ipswich cluster. Rent derived from PropTrack 4.3% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 675000,
  },
  {
    suburb: "Lowood",
    state: "QLD",
    postcode: "4311",
    type: "house",
    beds: 3,
    median: 655000,
    rentWeekly: 567,
    growth1y: 20.2,
    crime: "AVERAGE",
    daysToLease: 24,
    note: "PropTrack dual-score house. Hot 100 / SEQ regional. Rent derived from PropTrack 4.5% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 700000,
  },
  {
    suburb: "One Mile",
    state: "QLD",
    postcode: "4305",
    type: "house",
    beds: 3,
    median: 632000,
    rentWeekly: 510,
    growth1y: 21.6,
    crime: "AVERAGE",
    daysToLease: 20,
    note: "PropTrack dual-score house. Ipswich. Rent derived from PropTrack 4.2% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 675000,
  },
  {
    suburb: "Evanston Gardens",
    state: "SA",
    postcode: "5116",
    type: "house",
    beds: 3,
    median: 640000,
    rentWeekly: 566,
    growth1y: 23.4,
    crime: "AVERAGE",
    daysToLease: 22,
    note: "PropTrack dual-score house. Adelaide North. Rent derived from PropTrack 4.6% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 675000,
  },
  {
    suburb: "Evanston",
    state: "SA",
    postcode: "5116",
    type: "house",
    beds: 3,
    median: 614000,
    rentWeekly: 543,
    growth1y: 21.5,
    crime: "AVERAGE",
    daysToLease: 23,
    note: "PropTrack dual-score house. Adelaide North. Rent derived from PropTrack 4.6% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 650000,
  },
  {
    suburb: "Midvale",
    state: "WA",
    postcode: "6056",
    type: "house",
    beds: 3,
    median: 655000,
    rentWeekly: 693,
    growth1y: 23.6,
    crime: "AVERAGE",
    daysToLease: 17,
    note: "PropTrack dual-score house. Midland Metronet catchment. Rent derived from PropTrack 5.5% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 700000,
  },
  {
    suburb: "Stratton",
    state: "WA",
    postcode: "6056",
    type: "house",
    beds: 3,
    median: 608000,
    rentWeekly: 620,
    growth1y: 21.1,
    crime: "AVERAGE",
    daysToLease: 16,
    note: "PropTrack dual-score house. Perth NE. Rent derived from PropTrack 5.3% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 650000,
  },
  {
    suburb: "Pinjarra",
    state: "WA",
    postcode: "6208",
    type: "house",
    beds: 3,
    median: 603000,
    rentWeekly: 615,
    growth1y: 21.7,
    crime: "AVERAGE",
    daysToLease: 22,
    note: "PropTrack dual-score house. Mandurah corridor. Rent derived from PropTrack 5.3% gross yield.",
    rentSource: "Derived from PropTrack gross yield 2025",
    tier: "stretch",
    maxPrice: 650000,
  },
];

const CRIME_RANK = { LOW: 0, AVERAGE: 1, ELEVATED: 2 };

function rentLabel(item) {
  const bed = item.beds != null ? `${item.beds}-bed ` : "";
  const kind = item.type === "house" ? "house" : "unit";
  return `${bed}${kind}`.trim();
}

/** Gross yield % from weekly rent and median price (1 decimal). */
function computedYield(item) {
  if (typeof item.rentWeekly !== "number" || typeof item.median !== "number" || item.median <= 0) {
    return null;
  }
  return Math.round((item.rentWeekly * 52 / item.median) * 1000) / 10;
}


/* ---------- URL builders ---------- */

function suburbSlugPlus(name) {
  return name.trim().replace(/\s+/g, "+");
}

function suburbKebab(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function maxPriceFor(item) {
  if (typeof finance.budget === "number" && finance.budget > 0) return Math.round(finance.budget);
  return item.maxPrice != null ? item.maxPrice : DEFAULT_MAX_PRICE;
}

function reaPropertyType(type) {
  return type === "house" ? "house" : "unit+apartment";
}

function domainPropertyType(type) {
  return type === "house" ? "house" : "apartment";
}

function buildReaUrl(item) {
  const max = maxPriceFor(item);
  const prop = reaPropertyType(item.type);
  const suburb = suburbSlugPlus(item.suburb);
  const state = item.state.toLowerCase();
  return `https://www.realestate.com.au/buy/property-${prop}-between-0-${max}-in-${suburb},+${state}+${item.postcode}/list-1`;
}

function buildDomainUrl(item) {
  const max = maxPriceFor(item);
  const kebab = suburbKebab(item.suburb);
  const state = item.state.toLowerCase();
  const prop = domainPropertyType(item.type);
  return `https://www.domain.com.au/sale/${kebab}-${state}-${item.postcode}/?price=0-${max}&propertytypes=${prop}&excludesurroundingsuburbs=1`;
}

function buildReaNeighbourhoodUrl(item) {
  const kebab = suburbKebab(item.suburb);
  const state = item.state.toLowerCase();
  return `https://www.realestate.com.au/neighbourhoods/${kebab}-${item.postcode}-${state}`;
}


/* ---------- Finance ---------- */

function clampDeposit(purchase, deposit) {
  if (typeof deposit !== "number" || deposit < 0) return 0;
  if (typeof purchase !== "number") return deposit;
  return Math.min(deposit, purchase);
}

function monthlyRepayment(principal, annualRatePct, years) {
  if (!principal || principal <= 0) return 0;
  const r = (annualRatePct / 100) / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  const pow = Math.pow(1 + r, n);
  return (principal * r * pow) / (pow - 1);
}

function dealForSuburb(item) {
  const purchase = item.median;
  const deposit = clampDeposit(purchase, finance.deposit);
  const loan = Math.max(0, purchase - deposit);
  const rate = finance.rate;
  const monthly = monthlyRepayment(loan, rate, LOAN_YEARS);
  const mortgageWeekly = (monthly * 12) / 52;
  const rentWeekly = typeof item.rentWeekly === "number" ? item.rentWeekly : 0;
  const netWeekly = rentWeekly - mortgageWeekly;
  const lvr = purchase > 0 ? (loan / purchase) * 100 : 0;
  return {
    purchase,
    deposit,
    loan,
    rate,
    monthly,
    mortgageWeekly,
    rentWeekly,
    netWeekly,
    lvr,
    years: LOAN_YEARS,
  };
}

function cashflowClass(netWeekly) {
  if (netWeekly == null || Number.isNaN(netWeekly)) return "na";
  if (netWeekly >= 50) return "pos";
  if (netWeekly >= 0) return "mid";
  return "neg";
}

function formatMoney(n, digits = 0) {
  if (n == null || Number.isNaN(n)) return "—";
  const abs = Math.abs(n);
  const core = abs.toLocaleString("en-AU", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return (n < 0 ? "-" : "") + "$" + core;
}

/* ---------- Formatting ---------- */

function formatPrice(n) {
  if (n == null) return "—";
  return "$" + Math.round(n).toLocaleString("en-AU");
}

function formatRent(n) {
  if (typeof n !== "number") return "—";
  return "$" + Math.round(n).toLocaleString("en-AU") + "/wk";
}

function formatPct(n, digits = 1) {
  if (n == null || Number.isNaN(n)) return null;
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

function growthClass(n) {
  if (n == null) return "na";
  if (n >= 15) return "pos";
  if (n >= 8) return "mid";
  return "neg";
}

function yieldClass(n) {
  if (n == null) return "na";
  if (n >= 5.5) return "pos";
  if (n >= 4.5) return "mid";
  return "neg";
}

function displayName(item) {
  return item.displayName || item.suburb;
}

function typeLabel(item) {
  if (item.tier === "stretch") return "Stretch";
  return item.type === "house" ? "House" : "Unit";
}

/* ---------- State ---------- */

const state = {
  type: "all",
  sort: "cashflow",
  query: "",
  compare: new Set(),
  expanded: new Set(),
};

function suburbKey(item) {
  return `${item.suburb}|${item.state}|${item.postcode}|${item.type}`;
}

/* ---------- Filter / sort ---------- */

function filteredList() {
  const q = state.query.trim().toLowerCase();
  let list = SUBURBS.filter((s) => {
    if (state.type === "house" && s.type !== "house") return false;
    if (state.type === "unit" && s.type !== "unit") return false;
    if (typeof finance.budget === "number" && s.median > finance.budget + 0.5) return false;
    if (s.crime === "HIGH") return false;
    if (!q) return true;
    const hay = `${displayName(s)} ${s.suburb} ${s.state} ${s.postcode} ${s.note || ""}`.toLowerCase();
    return hay.includes(q);
  });

  list = list.slice().sort((a, b) => {
    switch (state.sort) {
      case "yield": {
        const ay = computedYield(a);
        const by = computedYield(b);
        return (by == null ? -1 : by) - (ay == null ? -1 : ay);
      }
      case "cashflow":
        return dealForSuburb(b).netWeekly - dealForSuburb(a).netWeekly;
      case "price":
        return a.median - b.median;
      case "crime":
        return (CRIME_RANK[a.crime] ?? 9) - (CRIME_RANK[b.crime] ?? 9);
      case "growth":
        return (b.growth1y ?? -999) - (a.growth1y ?? -999);
      default:
        return dealForSuburb(b).netWeekly - dealForSuburb(a).netWeekly;
    }
  });

  return list;
}

/* ---------- Render ---------- */

function renderCard(item) {
  const key = suburbKey(item);
  const expanded = state.expanded.has(key);
  const compared = state.compare.has(key);
  const growth = formatPct(item.growth1y);
  const gy = computedYield(item);
  const deal = dealForSuburb(item);
  const domainUrl = buildDomainUrl(item);
  const reaUrl = buildReaUrl(item);
  const neighUrl = buildReaNeighbourhoodUrl(item);

  const typeBadgeClass =
    item.tier === "stretch" ? "badge badge-stretch" : "badge badge-type";

  return `
    <article class="card${expanded ? " expanded" : ""}" data-key="${escapeAttr(key)}">
      <div class="card-top">
        <div class="card-title-block">
          <h2 class="card-name">${escapeHtml(displayName(item))}</h2>
          <p class="card-meta">${escapeHtml(item.state)} · ${escapeHtml(item.postcode)} · ${escapeHtml(rentLabel(item))}</p>
        </div>
        <div class="badges">
          <span class="${typeBadgeClass}">${escapeHtml(typeLabel(item))}</span>
          <span class="badge badge-crime-${escapeAttr(item.crime)}">${escapeHtml(item.crime)}</span>
        </div>
      </div>

      <div class="metrics metrics-4">
        <div class="metric">
          <span class="metric-label">Median</span>
          <span class="metric-value">${formatPrice(item.median)}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Rent</span>
          <span class="metric-value">${formatRent(item.rentWeekly)}</span>
        </div>
        <div class="metric">
          <span class="metric-label">1yr growth</span>
          <span class="metric-value ${growthClass(item.growth1y)}">${growth != null ? escapeHtml(growth) : "—"}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Yield</span>
          <span class="metric-value ${yieldClass(gy)}">${gy != null ? escapeHtml(gy.toFixed(1) + "%") : "—"}</span>
        </div>
      </div>


      <div class="cashflow">
        <div class="cashflow-head">After mortgage (your deal)</div>
        <div class="cashflow-grid">
          <div><span class="cf-label">Purchase</span><span class="cf-val">${formatPrice(deal.purchase)}</span></div>
          <div><span class="cf-label">Deposit</span><span class="cf-val">${formatPrice(deal.deposit)}</span></div>
          <div><span class="cf-label">Loan</span><span class="cf-val">${formatPrice(deal.loan)} <em>${deal.lvr.toFixed(0)}% LVR</em></span></div>
          <div><span class="cf-label">Mortgage</span><span class="cf-val">${formatMoney(deal.mortgageWeekly, 0)}/wk</span></div>
          <div><span class="cf-label">Rent in</span><span class="cf-val">${formatRent(deal.rentWeekly)}</span></div>
          <div><span class="cf-label">Net</span><span class="cf-val metric-value ${cashflowClass(deal.netWeekly)}">${formatMoney(deal.netWeekly, 0)}/wk</span></div>
        </div>
        <p class="cashflow-note">${deal.loan > 0 ? `${LOAN_YEARS}yr P&amp;I @ ${deal.rate.toFixed(2)}% · ${formatMoney(deal.monthly, 0)}/mo` : "No loan (deposit covers purchase)"}</p>
      </div>

      <div class="card-actions">
        <a class="btn-link btn-domain" href="${escapeAttr(domainUrl)}" target="_blank" rel="noopener noreferrer">Domain</a>
        <a class="btn-link btn-rea" href="${escapeAttr(reaUrl)}" target="_blank" rel="noopener noreferrer">realestate</a>
      </div>

      <div class="card-footer-row">
        <button type="button" class="expand-btn" data-action="expand" aria-expanded="${expanded}">
          <span class="chevron"></span>${expanded ? "Hide notes" : "Show notes"}
        </button>
        <label class="compare-check">
          <input type="checkbox" data-action="compare" ${compared ? "checked" : ""} ${!compared && state.compare.size >= 3 ? "disabled" : ""} />
          Compare
        </label>
      </div>

      <div class="card-details">
        <p class="note">${escapeHtml(item.note || "")}</p>
        <div class="extra-meta">
          <span>Yield = ${formatRent(item.rentWeekly)} × 52 ÷ ${formatPrice(item.median)}</span>
          ${item.rentSource ? `<span>Rent: ${escapeHtml(item.rentSource)}</span>` : ""}
          ${item.daysToLease != null ? `<span>Days to lease: ${item.daysToLease}</span>` : ""}
          ${item.growth5y != null ? `<span>5yr growth: ${escapeHtml(formatPct(item.growth5y))}</span>` : ""}
          ${item.maxPrice != null ? `<span>Link max: ${formatPrice(item.maxPrice)}</span>` : ""}
        </div>
        <a class="neigh-link" href="${escapeAttr(neighUrl)}" target="_blank" rel="noopener noreferrer">REA neighbourhood profile →</a>
      </div>
    </article>
  `;
}

function renderCompare() {
  const panel = document.getElementById("compare");
  const grid = document.getElementById("compare-grid");
  const countEl = document.getElementById("compare-count");
  const keys = [...state.compare];

  countEl.textContent = String(keys.length);

  if (keys.length === 0) {
    panel.hidden = true;
    grid.innerHTML = "";
    return;
  }

  panel.hidden = false;
  const items = keys
    .map((k) => SUBURBS.find((s) => suburbKey(s) === k))
    .filter(Boolean);

  grid.innerHTML = items
    .map((item) => {
      const growth = formatPct(item.growth1y) || "—";
      const gy = computedYield(item);
      const yld = gy != null ? `${gy.toFixed(1)}%` : "—";
      return `
        <div class="compare-item">
          <h3>${escapeHtml(displayName(item))}</h3>
          <dl>
            <dt>Type</dt><dd>${escapeHtml(rentLabel(item))}</dd>
            <dt>Median</dt><dd>${formatPrice(item.median)}</dd>
            <dt>Rent</dt><dd>${formatRent(item.rentWeekly)}</dd>
            <dt>Growth</dt><dd class="${growthClass(item.growth1y)}">${escapeHtml(growth)}</dd>
            <dt>Yield</dt><dd class="${yieldClass(gy)}">${escapeHtml(yld)}</dd>
            <dt>Crime</dt><dd>${escapeHtml(item.crime)}</dd>
          </dl>
        </div>
      `;
    })
    .join("");
}

function render() {
  const list = filteredList();
  const cards = document.getElementById("cards");
  const count = document.getElementById("count");

  count.textContent =
    list.length === 0
      ? `No suburbs at or under ${formatPrice(finance.budget)} — raise budget or clear filters`
      : `${list.length} suburb${list.length === 1 ? "" : "s"} ≤ ${formatPrice(finance.budget)}`;

  if (list.length === 0) {
    cards.innerHTML = `<p class="empty">No matches. Try another filter or clear search.</p>`;
  } else {
    cards.innerHTML = list.map(renderCard).join("");
  }

  renderCompare();
}

/* ---------- Escape helpers ---------- */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}

/* ---------- Events ---------- */

function init() {
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.type = btn.dataset.type;
      document.querySelectorAll(".tab").forEach((t) => {
        const on = t === btn;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      render();
    });
  });

  document.getElementById("sort").addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
  });

  document.getElementById("search").addEventListener("input", (e) => {
    state.query = e.target.value;
    render();
  });

  document.getElementById("cards").addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const key = card.dataset.key;

    if (e.target.closest("[data-action='expand']")) {
      if (state.expanded.has(key)) state.expanded.delete(key);
      else state.expanded.add(key);
      render();
      return;
    }
  });

  document.getElementById("cards").addEventListener("change", (e) => {
    if (e.target.dataset.action !== "compare") return;
    const card = e.target.closest(".card");
    if (!card) return;
    const key = card.dataset.key;

    if (e.target.checked) {
      if (state.compare.size >= 3) {
        e.target.checked = false;
        return;
      }
      state.compare.add(key);
    } else {
      state.compare.delete(key);
    }
    render();
  });

  document.getElementById("clear-compare").addEventListener("click", () => {
    state.compare.clear();
    render();
  });


  const budgetEl = document.getElementById("budget");
  const depositEl = document.getElementById("deposit");
  const rateEl = document.getElementById("rate");
  const rateReset = document.getElementById("rate-reset");
  const financeSummary = document.getElementById("finance-summary");

  function syncFinanceUI() {
    if (budgetEl) budgetEl.value = String(finance.budget);
    if (depositEl) depositEl.value = String(Math.min(finance.deposit, finance.budget));
    if (rateEl) rateEl.value = String(finance.rate);
    const depPct = finance.budget > 0 ? ((Math.min(finance.deposit, finance.budget) / finance.budget) * 100).toFixed(0) : "0";
    if (financeSummary) {
      financeSummary.textContent =
        `Budget ${formatPrice(finance.budget)} · deposit ${formatPrice(Math.min(finance.deposit, finance.budget))} (${depPct}%) · ${finance.rate.toFixed(2)}%` +
        (Math.abs(finance.rate - DEFAULT_INVESTOR_RATE) < 0.001 ? " · market default" : " · custom rate");
    }
    if (rateReset) rateReset.hidden = Math.abs(finance.rate - DEFAULT_INVESTOR_RATE) < 0.001;
  }

  function readFinance() {
    const b = Number(budgetEl && budgetEl.value);
    const d = Number(depositEl && depositEl.value);
    const r = Number(rateEl && rateEl.value);
    if (!Number.isNaN(b) && b >= 50000) finance.budget = Math.round(b);
    if (!Number.isNaN(d) && d >= 0) finance.deposit = Math.round(d);
    if (!Number.isNaN(r) && r >= 0 && r <= 20) finance.rate = Math.round(r * 100) / 100;
    syncFinanceUI();
    render();
  }

  ["budget", "deposit", "rate"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("change", readFinance);
    el.addEventListener("blur", readFinance);
  });
  if (rateReset) {
    rateReset.addEventListener("click", () => {
      finance.rate = DEFAULT_INVESTOR_RATE;
      syncFinanceUI();
      render();
    });
  }
  // Preset budget chips
  document.querySelectorAll("[data-budget]").forEach((btn) => {
    btn.addEventListener("click", () => {
      finance.budget = Number(btn.dataset.budget);
      syncFinanceUI();
      render();
    });
  });
  syncFinanceUI();

  render();

  // Expose builders for debugging / README verification
  window.__suburbScreen = {
    SUBURBS,
    finance,
    dealForSuburb,
    computedYield,
    buildReaUrl,
    buildDomainUrl,
    buildReaNeighbourhoodUrl,
  };
}

document.addEventListener("DOMContentLoaded", init);
