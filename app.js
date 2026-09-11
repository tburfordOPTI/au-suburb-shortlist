/**
 * AU Suburb Screen — data, filters, URL builders
 */

const DEFAULT_MAX_PRICE = 500000;

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
  sort: "growth",
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
      case "price":
        return a.median - b.median;
      case "crime":
        return (CRIME_RANK[a.crime] ?? 9) - (CRIME_RANK[b.crime] ?? 9);
      case "growth":
      default:
        return (b.growth1y ?? -999) - (a.growth1y ?? -999);
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
      ? "No suburbs match"
      : `${list.length} suburb${list.length === 1 ? "" : "s"}`;

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

  render();

  // Expose builders for debugging / README verification
  window.__suburbScreen = {
    SUBURBS,
    buildReaUrl,
    buildDomainUrl,
    buildReaNeighbourhoodUrl,
  };
}

document.addEventListener("DOMContentLoaded", init);
