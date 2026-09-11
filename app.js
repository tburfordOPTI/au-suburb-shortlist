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
    median: 384000,
    growth1y: 10.9,
    yield: 6.9,
    crime: "AVERAGE",
    daysToLease: 22,
    note: "Lowest entry + strongest dual yield; property crime modestly above VIC (campus/employment node)",
    tier: "unit",
  },
  {
    suburb: "Brooklyn Park",
    state: "SA",
    postcode: "5032",
    type: "unit",
    median: 455000,
    growth1y: 27.1,
    yield: 5.0,
    crime: "AVERAGE",
    daysToLease: 17,
    note: "Hot 100 renewal corridor; ≈ SA crime baseline",
    tier: "unit",
  },
  {
    suburb: "Wiley Park",
    state: "NSW",
    postcode: "2195",
    type: "unit",
    median: 466000,
    growth1y: 8.6,
    yield: 5.5,
    crime: "LOW",
    daysToLease: 19,
    note: "Below NSW on violent + property crime; Sydney yield play",
    tier: "unit",
  },
  {
    suburb: "Lakemba",
    state: "NSW",
    postcode: "2195",
    type: "unit",
    median: 480000,
    growth1y: 9.1,
    yield: 5.7,
    crime: "AVERAGE",
    daysToLease: 19,
    note: "Sydney ISW; liquid rental market; property crime well below NSW",
    tier: "unit",
  },
  {
    suburb: "Acton",
    displayName: "Acton (Burnie)",
    state: "TAS",
    postcode: "7320",
    type: "house",
    median: 444000,
    growth1y: 24,
    growth5y: 94.9,
    yield: null,
    crime: "LOW",
    note: "Burnie — strong multi-year growth; crime via Burnie division proxy; verify street-level",
    tier: "house",
  },
  {
    suburb: "Bakewell",
    state: "NT",
    postcode: "0832",
    type: "house",
    median: 373000,
    growth1y: 30,
    yield: null,
    crime: "AVERAGE",
    note: "Palmerston cluster; AVERAGE vs Darwin/Palmerston",
    tier: "house",
  },
  {
    suburb: "Merbein",
    state: "VIC",
    postcode: "3505",
    type: "house",
    median: 441000,
    growth1y: 26,
    yield: null,
    crime: "ELEVATED",
    note: "Mildura regional; violent ~1.6× VIC but property below — flagged",
    tier: "house",
  },
  {
    suburb: "Kalbarri",
    state: "WA",
    postcode: "6536",
    type: "house",
    median: 515000,
    growth1y: 40.2,
    yield: null,
    crime: "LOW",
    note: "Stretch just over $500k; growth rocket; crime below WA",
    tier: "stretch",
    maxPrice: 550000,
  },
];

const CRIME_RANK = { LOW: 0, AVERAGE: 1, ELEVATED: 2 };

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
        const ay = a.yield == null ? -1 : a.yield;
        const by = b.yield == null ? -1 : b.yield;
        return by - ay;
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
  const yld = item.yield != null ? `${item.yield.toFixed(1)}%` : null;
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
          <p class="card-meta">${escapeHtml(item.state)} · ${escapeHtml(item.postcode)}</p>
        </div>
        <div class="badges">
          <span class="${typeBadgeClass}">${escapeHtml(typeLabel(item))}</span>
          <span class="badge badge-crime-${escapeAttr(item.crime)}">${escapeHtml(item.crime)}</span>
        </div>
      </div>

      <div class="metrics">
        <div class="metric">
          <span class="metric-label">Median</span>
          <span class="metric-value">${formatPrice(item.median)}</span>
        </div>
        <div class="metric">
          <span class="metric-label">1yr growth</span>
          <span class="metric-value ${growthClass(item.growth1y)}">${growth != null ? escapeHtml(growth) : "—"}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Yield</span>
          <span class="metric-value ${yieldClass(item.yield)}">${yld != null ? escapeHtml(yld) : "n/a"}</span>
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
      const yld = item.yield != null ? `${item.yield.toFixed(1)}%` : "n/a";
      return `
        <div class="compare-item">
          <h3>${escapeHtml(displayName(item))}</h3>
          <dl>
            <dt>Type</dt><dd>${escapeHtml(typeLabel(item))}</dd>
            <dt>Median</dt><dd>${formatPrice(item.median)}</dd>
            <dt>Growth</dt><dd class="${growthClass(item.growth1y)}">${escapeHtml(growth)}</dd>
            <dt>Yield</dt><dd class="${yieldClass(item.yield)}">${escapeHtml(yld)}</dd>
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
