// ==========================
// 🌌 WHY LUNARA POPUP TOGGLE
// ==========================
window.toggleWhyLunara = function(e) {
  e.stopPropagation();
  const popup = document.getElementById("why-lunara-popup");
  if (!popup) return;
  popup.classList.toggle("hidden");
};

// Close Why Lunara popup when clicking anywhere else
document.addEventListener("click", function(e) {
  const popup = document.getElementById("why-lunara-popup");
  const dropdown = e.target.closest(".why-lunara-dropdown");
  if (!dropdown && popup && !popup.classList.contains("hidden")) {
    popup.classList.add("hidden");
  }
});

// ==========================
// 🌍 GEO DETECTION & REGION SELECTOR
// ==========================
let userCountry = "ZA";

async function detectCountry() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    // Check if the user has a manually saved preference first; otherwise use IP
    const savedRegion = localStorage.getItem("selectedRegion");
    userCountry = savedRegion || (data.country_code === "ZA" ? "ZA" : "INTL");
  } catch {
    userCountry = localStorage.getItem("selectedRegion") || "ZA";
  }
}

function initRegionSelector() {
  updateRegionUI(userCountry);

  // Close dropdown on outside click
  document.addEventListener("click", () => {
    const dd = document.getElementById("regionDropdown");
    if (dd) dd.classList.add("hidden");
  });
}

window.toggleRegionDropdown = function(e) {
  e.stopPropagation();
  const dd = document.getElementById("regionDropdown");
  if (dd) dd.classList.toggle("hidden");
};

window.setRegion = function(region) {
  localStorage.setItem("selectedRegion", region);
  userCountry = region;
  const dd = document.getElementById("regionDropdown");
  if (dd) dd.classList.add("hidden");
  updateRegionUI(region);
  if (storeProducts.length > 0) displayProducts(storeProducts);
  updateCart();
};

function getFlagEmoji(region) {
  if (region === "ZA") return "🇿🇦";
  return "🌍";
}

function updateRegionUI(region) {
  // Update flag button display
  const flagDisplay = document.getElementById("regionFlagDisplay");
  const currDisplay = document.getElementById("regionCurrencyDisplay");
  if (flagDisplay) flagDisplay.textContent = getFlagEmoji(region);
  if (currDisplay) currDisplay.textContent = region === "ZA" ? "ZAR" : "USD";

  // International fulfillment message under Nova Collection heading
  const intlMsg = document.getElementById("intl-fulfillment-msg");
  if (intlMsg) intlMsg.style.display = region === "ZA" ? "none" : "block";

  // Why Lunara — swap SA card vs international card
  document.querySelectorAll(".why-sa-only").forEach(el => el.style.display = region === "ZA" ? "" : "none");
  document.querySelectorAll(".why-intl-only").forEach(el => el.style.display = region === "ZA" ? "none" : "");
}

// ==========================
// 🧠 STATE
// ==========================
let cart = JSON.parse(localStorage.getItem("lunaraCart")) || [];
let favorites = JSON.parse(localStorage.getItem("lunaraFavorites")) || [];
let storeProducts = [];

// ==========================
// 🏪 PRODUCTS — loaded from collections.js
// To add or change products, edit collections.js only. Never edit this section.
// ==========================
const localProducts = (typeof LUNARA_COLLECTIONS !== "undefined")
  ? LUNARA_COLLECTIONS.flatMap(c => c.products)
  : [];

// ==========================
// ⚙️ HELPERS & CURRENCY
// ==========================
function saveCart() {
  localStorage.setItem("lunaraCart", JSON.stringify(cart));
}

function saveFavorites() {
  localStorage.setItem("lunaraFavorites", JSON.stringify(favorites));
}

// ==========================
// 💰 YOUR PRICING TABLES
// Edit these to set the prices customers see.
//
// SA_PRICING  → ZAR prices shown to South African customers.
//               Applies to ALL product types (hoodies, tees, sweatpants etc.).
//               Sweatpants use SA_PRICING.sweatpants — fulfilled by Printful.
//               Hoodies / sweatshirts / tees — fulfilled by OTC Printing.
//
// International customers → prices come from your Printify published prices
//               via /api/products. Set your USD prices in your Printify dashboard.
//               Your repo images (mockups downloaded from Printify) show for everyone.
// ==========================
// Pricing tables — loaded from collections.js (merged across all active collections)
// To change prices, edit the zarPrices block in your collection in collections.js
function _mergePricing(key) {
  if (typeof LUNARA_COLLECTIONS === "undefined") return {};
  return Object.assign({}, ...LUNARA_COLLECTIONS.map(c => (c.zarPrices?.[key]) || {}));
}

const SA_PRICING = {
  hoodie:     (typeof LUNARA_COLLECTIONS !== "undefined") ? LUNARA_COLLECTIONS[0]?.zarPrices?.hoodie     || {} : {},
  sweatshirt: (typeof LUNARA_COLLECTIONS !== "undefined") ? LUNARA_COLLECTIONS[0]?.zarPrices?.sweatshirt || {} : {},
  tshirt:     (typeof LUNARA_COLLECTIONS !== "undefined") ? LUNARA_COLLECTIONS[0]?.zarPrices?.tshirt     || {} : {},
  longsleeve: (typeof LUNARA_COLLECTIONS !== "undefined") ? LUNARA_COLLECTIONS[0]?.zarPrices?.longsleeve || {} : {},
  sweatpants: (typeof LUNARA_COLLECTIONS !== "undefined") ? LUNARA_COLLECTIONS[0]?.zarPrices?.sweatpants || {} : {}
};

const ZAR_REAL_PRICES = {
  hoodie:     SA_PRICING.hoodie,
  sweatshirt: SA_PRICING.sweatshirt,
  tshirt:     SA_PRICING.tshirt,
  longsleeve: SA_PRICING.longsleeve
};

// Sweatpants anchor = exactly 20% above each sale price
const ZAR_SWEATPANTS_ANCHOR = Object.fromEntries(
  Object.entries(SA_PRICING.sweatpants || {}).map(([size, price]) => [
    size, Math.round((price * 1.20 + Number.EPSILON) * 100) / 100
  ])
);
function getCalculatedRegionalPrice(product, size, color) {
  const type = String(product?.type || "").toLowerCase();

  if (userCountry === "ZA") {
    if (type === "sweatpants") {
      const saPrice = SA_PRICING.sweatpants?.[size];
      if (saPrice !== undefined) return saPrice;
    } else {
      const c = String(color || "black").toLowerCase();
      const colorTable = SA_PRICING[type]?.[c] || SA_PRICING[type]?.black;
      const saPrice = colorTable?.[size];
      if (saPrice !== undefined) return saPrice;
    }
    // Fallback if size/color not in table
    return product.pricing?.[size] || product.price || 0;
  }

  // International: use Printify's published price
  return product.pricing?.[size] || product.price || 0;
}

function formatCurrency(amount) {
  if (userCountry === "ZA") return "R" + Number(amount || 0).toFixed(2);
  return "$" + Number(amount || 0).toFixed(2);
}

// Returns the correct display price for a product + size.
// SA  → your ZAR price from SA_PRICING (ZAR).
// INT → Printify's published USD price from product.pricing (set in your Printify dashboard).

function formatZAR(amount) {
  return "R" + Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d)\.)/g, " ");
}

function getAnchorPrice(type, color, size) {
  const t = String(type || "").toLowerCase();

  // ── International USD anchor pricing (20% above sale price)
  if (userCountry !== "ZA") {
    const product = storeProducts.find(p => String(p.type||"").toLowerCase() === t);
    if (!product) return null;
    const salePrice = product.pricing?.[size];
    if (!salePrice) return null;
    const anchor = Math.round(salePrice * 1.20 * 100) / 100;
    return "$" + anchor.toFixed(2);
  }

  // ── ZAR anchor pricing
  if (t === "sweatpants") {
    const anchor = ZAR_SWEATPANTS_ANCHOR[size];
    return anchor !== undefined ? formatZAR(anchor) : null;
  }

  const c = String(color || "black").toLowerCase();
  const map = ZAR_REAL_PRICES[t];
  if (!map) return null;
  const colorMap = map[c] || map["black"];
  if (!colorMap) return null;
  // colorMap may be a size object {S:x, M:x} or a flat number
  const real = typeof colorMap === "object"
    ? (colorMap[size] || Object.values(colorMap)[0])
    : colorMap;
  if (!real) return null;
  const anchor = real * 1.20;
  return formatZAR(anchor);
}

// ==========================
// 🖼️ PRODUCT IMAGES
// All customers see images from your GitHub repo.
// Images live at: /images/{typeFolder}/{slug}/{color}.png
// Upload your mockup photos from Printify directly into those folders.
// ==========================

// ── IMAGE PATH RESOLVER ──────────────────────────────────────────────────────
// Repo structure (from GitHub):
//   T-shirts:       images/shirts/{design}-tee/front-{color}.png
//   Long sleeves:   images/long-sleeve-shirts/{design}-long-sleeve-shirts/front-{color}.png
//   Sweatshirts:    images/sweatshirts/{design}-sweatshirt/front-{color}.png
//   Hoodies:        images/nova-collection/{design}-hoodie/front-{color}.png
//   Sweatpants:     images/sweatpants/{design}-sweatpants/front-white.png (white only)
// Each folder has: front-black.png, front-white.png (and front-stone-blue.png for hoodies)
// ─────────────────────────────────────────────────────────────────────────────

// Maps product id → exact repo folder name — loaded from collections.js
// To add new products, add imageFolders and noBackIds to your collection in collections.js
const NO_BACK_IDS = (typeof LUNARA_COLLECTIONS !== "undefined")
  ? LUNARA_COLLECTIONS.flatMap(c => c.noBackIds || [])
  : ["nova-plain-hoodie"];

const IMAGE_FOLDER_MAP = (typeof LUNARA_COLLECTIONS !== "undefined")
  ? Object.assign({}, ...LUNARA_COLLECTIONS.map(c => c.imageFolders || {}))
  : {};

function getImagePath(product, color = "black") {
  const folder = IMAGE_FOLDER_MAP[product?.id];
  const type = String(product?.type || "").toLowerCase();
  // Sweatpants are white only
  const safeColor = type === "sweatpants" ? "white" : color;
  if (folder) {
    return `images/${folder}/front-${safeColor}.png`;
  }
  // Fallback for API products not in the map
  const slug = product?.slug || String(product?.name || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return `images/${slug}/front-${safeColor}.png`;
}

// Keep getSlug and getTypeFolder for normalizeApiProduct
function getSlug(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function getTypeFolder(product) {
  const type = String(product?.type || "").toLowerCase();
  if (type === "tshirt") return "shirts";
  if (type === "longsleeve") return "long-sleeve-shirts";
  if (type === "hoodie") return "nova-collection";
  if (type === "sweatshirt") return "sweatshirts";
  if (type === "sweatpants") return "sweatpants";
  return "shirts";
}

function normalizeApiProduct(product = {}) {
  const rawType = String(product.type || product.category || "").toLowerCase();
  const rawName = String(product.name || "").toLowerCase();

  let normalizedType = "tshirt";
  if (rawType.includes("hoodie") || rawName.includes("hoodie")) normalizedType = "hoodie";
  else if (rawType.includes("sweatpants") || rawName.includes("sweatpants")) normalizedType = "sweatpants";
  else if (rawType.includes("long") && (rawName.includes("sleeve") || rawType.includes("sleeve"))) normalizedType = "longsleeve";
  else if (rawType.includes("sweatshirt") || rawName.includes("sweatshirt")) normalizedType = "sweatshirt";
  else if (rawType.includes("pant") || rawName.includes("pant")) normalizedType = "pants";
  else if (rawType.includes("shirt") || rawType.includes("tee") || rawName.includes("shirt") || rawName.includes("tee")) normalizedType = "tshirt";

  const fallbackPrice = product.pricing?.S || product.variants?.[0]?.price || 25.48;

  return {
    ...product,
    id: product.id || product.slug || getSlug(product.name || "product"),
    slug: product.slug || getSlug(product.name || "product"),
    type: normalizedType,
    price: Number(product.price || fallbackPrice),
    printify: product.printify ?? true,
    prodigi: product.prodigi ?? false
  };
}

// ==========================
// 🛍️ DISPLAY PRODUCTS — sorted into correct sections by type
// ==========================

// Section ID map: product type → HTML section id
const TYPE_SECTION_MAP = {
  "tshirt":     "tshirts",
  "longsleeve": "longsleeve",
  "sweatshirt": "sweatshirts",
  "hoodie":     "hoodies",
  "sweatpants": "sweatpants"
};

function displayProducts(products) {
  // Clear all product sections
  Object.values(TYPE_SECTION_MAP).forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      const grid = section.querySelector(".products");
      if (grid) grid.innerHTML = "";
    }
  });

  if (!products.length) return;

  // Sort so plain items appear first within each type
  const sorted = [...products].sort((a, b) => {
    const aPlain = /plain/i.test(a.name) ? 0 : 1;
    const bPlain = /plain/i.test(b.name) ? 0 : 1;
    return aPlain - bPlain;
  });
  // Keep storeProducts in sync with sort order so index lookups (addToCart, etc.) still work
  storeProducts = sorted;

  let globalIndex = 0;
  sorted.forEach((product) => {
    const index = globalIndex++;
    const reviews = Math.floor(Math.random() * 1500) + 300;
    const isFav = favorites.includes(product.id);
    const isSweatpants = String(product.type || "").toLowerCase() === "sweatpants";

    // Sweatpants are white only; everything else defaults to black
    const defaultColor = isSweatpants ? "white" : "black";
    const imageSrc = getImagePath(product, defaultColor);

    const defaultSize = product.pricing?.["M"] !== undefined ? "M" : Object.keys(product.pricing || {})[0] || "M";
    const activeDisplayPrice = getCalculatedRegionalPrice(product, defaultSize, defaultColor);

    const sizes = Object.keys(product.pricing || { "S": 0, "M": 0, "L": 0, "XL": 0 });

    // Colors: sweatpants are white only; other products derive colors from variant keys
    if (isSweatpants) {
      finalColors = ["white"];
    } else if (product.colors && product.colors.length) {
      // Stone blue is a Printify-only color — hide it from SA customers
      finalColors = product.colors.filter(c => {
        if (c === "stone-blue" && userCountry === "ZA") return false;
        return true;
      });
    } else {
      const dynamicColors = [...new Set(Object.keys(product.variants || {}).map(k => k.split("-").slice(1).join("-")))]
        .filter(c => !(c === "stone-blue" && userCountry === "ZA"));
      finalColors = dynamicColors.length ? dynamicColors : ["black", "white"];
    }

    const card = document.createElement("div");
    card.className = "product-card";

    const type = String(product.type || "").toLowerCase();
    const hasBack = (type === "hoodie" || type === "sweatshirt" || type === "longsleeve" || type === "sweatpants") && !NO_BACK_IDS.includes(product.id);
    const backColor = type === "sweatpants" ? "white" : defaultColor;
    const backSrc = hasBack ? `images/${IMAGE_FOLDER_MAP[product.id]}/back-${backColor}.png` : null;
    const frontSrc = imageSrc;
    // Sweatpants: front first, swipe → back
    // All others (hoodie, sweatshirt, longsleeve): back first, swipe → front
    const showBackFirst = hasBack && type !== "sweatpants" && type !== "longsleeve";
    const displaySrc = showBackFirst ? backSrc : frontSrc;
    const initialShowing = showBackFirst ? "back" : "front";

    card.innerHTML = `
      <div class="product-image-wrap${hasBack ? " swipeable" : ""}"
           ${hasBack ? `data-front="${frontSrc}" data-back="${backSrc}" data-showing="${initialShowing}"` : ""}>
        <img
          id="img-${index}"
          src="${displaySrc}"
          class="product-image"
          alt="${product.name}"
          onerror="(function(img){
            var src=img.src;
            // Try back.png (no color suffix) as fallback
            if(src.indexOf('/back-')!==-1 && src.indexOf('lunara-website-logo')===-1){
              var alt=src.replace(/\/back-[^/]+\.png$/,'/back.png');
              if(alt!==src){ img.src=alt; return; }
            }
            img.onerror=null; img.src='images/lunara-website-logo.png';
          })(this)"
        >
        ${hasBack ? `<div class="swipe-hint">${showBackFirst ? "swipe →" : "swipe ←"}</div>` : ""}
      </div>

      <div class="product-info">
        <div class="product-top">
          <h4>${product.name}</h4>
          <button class="fav-btn ${isFav ? "active" : ""}" onclick="toggleFavorite('${product.id}', this)">
            🦋
          </button>
        </div>

        ${(() => {
          const ap = getAnchorPrice(product.type, defaultColor, defaultSize);
          return ap ? `<p class="anchor-price" id="anchor-display-${index}">${ap}</p>` : "";
        })()}
        <p class="product-price" id="price-display-${index}">${formatCurrency(activeDisplayPrice)}</p>

        <p class="product-reviews">★★★★★ (${reviews})</p>

        <select id="size-${index}" onchange="updatePremiumPricing(${index})">
          ${sizes.map(size => `<option value="${size}" ${size === defaultSize ? "selected" : ""}>${size}</option>`).join("")}
        </select>
        <span class="size-guide-link" onclick="openSizeGuide('${product.type}')">Size guide</span>

        ${finalColors.length > 1
          ? `<select id="color-${index}" onchange="changeColor(${index})">
              ${finalColors.map(color => `<option value="${color}" ${color === defaultColor ? "selected" : ""}>${color.charAt(0).toUpperCase() + color.slice(1)}</option>`).join("")}
            </select>`
          : `<input type="hidden" id="color-${index}" value="${finalColors[0] || defaultColor}">`
        }

        <button onclick="addToCart(${index}, event)">
          Add to Cart →
        </button>
      </div>
    `;

    // Find the correct section for this product type
    const sectionId = TYPE_SECTION_MAP[String(product.type || "").toLowerCase()];
    const section = sectionId ? document.getElementById(sectionId) : null;
    const grid = section ? section.querySelector(".products") : null;
    if (grid) {
      grid.appendChild(card);
    }
    // If no matching section, skip — API products with unknown types don't show
  });

  renderFavorites();
}

window.updatePremiumPricing = function(index) {
  const product = storeProducts[index];
  if (!product) return;
  const size = document.getElementById(`size-${index}`)?.value || "M";
  const color = document.getElementById(`color-${index}`)?.value || "black";
  const price = getCalculatedRegionalPrice(product, size, color);
  const priceDisplay = document.getElementById(`price-display-${index}`);
  const anchorDisplay = document.getElementById(`anchor-display-${index}`);
  if (priceDisplay) priceDisplay.innerText = formatCurrency(price);
  if (anchorDisplay) {
    const ap = getAnchorPrice(product.type, color, size);
    if (ap) anchorDisplay.innerText = ap;
  }
};

// ==========================
// 📏 SIZE GUIDE
// ==========================
const SIZE_GUIDE_DATA = {
  hoodie: {
    headers: ["Size", "Chest (cm)", "Length (cm)", "Sleeve (cm)"],
    rows: [
      ["S",   "96",  "67", "84"],
      ["M",   "101", "70", "86"],
      ["L",   "106", "72", "88"],
      ["XL",  "111", "74", "90"],
      ["2XL", "116", "76", "92"],
      ["3XL", "121", "78", "94"],
    ]
  },
  sweatshirt: {
    headers: ["Size", "Chest (cm)", "Length (cm)", "Sleeve (cm)"],
    rows: [
      ["S",   "96",  "66", "83"],
      ["M",   "101", "69", "85"],
      ["L",   "106", "71", "87"],
      ["XL",  "111", "73", "89"],
      ["2XL", "116", "75", "91"],
    ]
  },
  tshirt: {
    headers: ["Size", "Chest (cm)", "Length (cm)", "Shoulder (cm)"],
    rows: [
      ["S",   "91",  "69", "43"],
      ["M",   "96",  "72", "46"],
      ["L",   "101", "74", "48"],
      ["XL",  "106", "77", "51"],
      ["2XL", "111", "79", "53"],
    ]
  },
  longsleeve: {
    headers: ["Size", "Chest (cm)", "Length (cm)", "Sleeve (cm)"],
    rows: [
      ["S",   "91",  "69", "84"],
      ["M",   "96",  "72", "86"],
      ["L",   "101", "74", "88"],
      ["XL",  "106", "77", "90"],
      ["2XL", "111", "79", "92"],
    ]
  },
  sweatpants: {
    headers: ["Size", "Waist (cm)", "Hip (cm)", "Inseam (cm)"],
    rows: [
      ["XS",  "64–74",  "88",  "76"],
      ["S",   "70–80",  "94",  "77"],
      ["M",   "76–86",  "100", "78"],
      ["L",   "82–92",  "106", "79"],
      ["XL",  "88–98",  "112", "80"],
      ["2XL", "94–104", "118", "81"],
      ["3XL", "100–110","124", "82"],
    ]
  }
};

window.openSizeGuide = function(type) {
  const t = String(type || "").toLowerCase();
  const data = SIZE_GUIDE_DATA[t] || SIZE_GUIDE_DATA.tshirt;
  const label = { hoodie: "Hoodie", sweatshirt: "Sweatshirt", tshirt: "T-Shirt", longsleeve: "Long Sleeve T-Shirt", sweatpants: "Sweatpants" }[t] || "Item";

  const headerRow = data.headers.map(h => `<th>${h}</th>`).join("");
  const bodyRows = data.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("");

  const modal = document.getElementById("size-guide-modal");
  const content = document.getElementById("size-guide-content");
  if (!modal || !content) return;
  content.innerHTML = `
    <h3 style="margin-bottom:14px;">📏 ${label} Size Guide</h3>
    <p style="font-size:12px;color:var(--muted);margin-bottom:12px;">Measurements are of the garment, not the body. When in doubt, size up.</p>
    <table class="size-guide-table">
      <thead><tr>${headerRow}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
    <button onclick="document.getElementById('size-guide-modal').classList.remove('active')" style="margin-top:16px;width:100%;">Close</button>
  `;
  modal.classList.add("active");
};

// ==========================
// 📧 EMAIL CAPTURE
// ==========================
window.submitEmailCapture = async function() {
  const email = document.getElementById("email-capture-input")?.value?.trim();
  const btn = document.getElementById("email-capture-btn");
  const msg = document.getElementById("email-capture-msg");
  if (!email || !email.includes("@")) {
    if (msg) { msg.textContent = "Please enter a valid email."; msg.style.color = "tomato"; }
    return;
  }
  if (btn) btn.disabled = true;
  // Store locally + send to your email list (replace URL with Formspree or Mailchimp endpoint)
  const stored = JSON.parse(localStorage.getItem("lunaraEmails") || "[]");
  if (!stored.includes(email)) { stored.push(email); localStorage.setItem("lunaraEmails", JSON.stringify(stored)); }
  if (msg) { msg.textContent = "✦ Welcome to the universe! 🦋"; msg.style.color = "var(--accent)"; }
  setTimeout(() => {
    document.getElementById("email-capture-modal")?.classList.remove("active");
    localStorage.setItem("lunaraEmailCaptured", "1");
  }, 1800);
};

function initEmailCapture() {
  if (localStorage.getItem("lunaraEmailCaptured")) return;
  setTimeout(() => {
    const modal = document.getElementById("email-capture-modal");
    if (modal) modal.classList.add("active");
  }, 4000);
}

// ==========================
// 🔢 LIVE ORDER COUNTER
// ==========================
function initOrderCounter() {
  const updateCounter = () => {
    const orders = JSON.parse(localStorage.getItem("lunaraOrderCount") || "0");
    const el = document.getElementById("live-order-count");
    if (el) el.textContent = orders;
  };
  updateCounter();
  setInterval(updateCounter, 5000);
}

function incrementOrderCounter() {
  const current = parseInt(localStorage.getItem("lunaraOrderCount") || "0");
  localStorage.setItem("lunaraOrderCount", current + 1);
}

// ==========================
// 🎟️ DISCOUNT CODES
// ==========================
const DISCOUNT_CODES = JSON.parse(localStorage.getItem("lunaraDiscountCodes") || "{}");

window.applyDiscountCode = function() {
  const input = document.getElementById("discount-input");
  const msg = document.getElementById("discount-msg");
  if (!input || !msg) return;
  const code = input.value.trim().toUpperCase();
  const discount = DISCOUNT_CODES[code];
  if (!discount) {
    msg.textContent = "Invalid code."; msg.style.color = "tomato"; return;
  }
  if (discount.used && discount.oneTime) {
    msg.textContent = "This code has already been used."; msg.style.color = "tomato"; return;
  }
  activeDiscount = { code, percent: discount.percent };
  msg.textContent = `✅ ${discount.percent}% off applied!`; msg.style.color = "var(--accent)";
  updateCart();
};

let activeDiscount = null;
function changeColor(index) {
  const product = storeProducts[index];
  const color = document.getElementById(`color-${index}`)?.value || "black";
  const img = document.getElementById(`img-${index}`);
  if (!img || !product) return;

  const type = String(product.type || "").toLowerCase();
  const wrap = img.closest("[data-front]");
  const newFront = getImagePath(product, color);
  const backColor = type === "sweatpants" ? "white" : color;
  const folder = (typeof IMAGE_FOLDER_MAP !== "undefined") ? IMAGE_FOLDER_MAP[product.id] : null;
  const newBack = folder ? `images/${folder}/back-${backColor}.png` : null;

  if (wrap) {
    // Update data attributes so swipe still works after color change
    wrap.dataset.front = newFront;
    if (newBack) wrap.dataset.back = newBack;
    // Show whichever side is currently showing
    const showing = wrap.dataset.showing || "front";
    img.src = (showing === "back" && newBack) ? newBack : newFront;
  } else {
    img.src = newFront;
  }

  // Update main price for the newly selected color
  const size = document.getElementById(`size-${index}`)?.value || "M";
  const price = getCalculatedRegionalPrice(product, size, color);
  const priceDisplay = document.getElementById(`price-display-${index}`);
  if (priceDisplay) priceDisplay.innerText = formatCurrency(price);

  // Update anchor price
  const anchorDisplay = document.getElementById(`anchor-display-${index}`);
  if (anchorDisplay) {
    const ap = getAnchorPrice(product.type, color, size);
    if (ap) anchorDisplay.innerText = ap;
  }
}

// ==========================
// ❤️ FAVORITES
// ==========================
function toggleFavorite(id, el) {
  if (!id) return;
  if (favorites.includes(id)) {
    favorites = favorites.filter((f) => f !== id);
    if (el) el.classList.remove("active");
  } else {
    favorites.push(id);
    if (el) el.classList.add("active");
  }
  saveFavorites();
  renderFavorites();
}

// ==========================
// ❤️ RENDER FAVOURITES SECTION
// ==========================
function renderFavorites() {
  const section = document.getElementById("favorites");
  const grid = section ? section.querySelector(".products") : null;
  if (!grid) return;

  grid.innerHTML = "";

  if (!favorites.length) {
    grid.innerHTML = `<p style="color:var(--muted);grid-column:1/-1;text-align:center;">No favourites yet — tap the 🦋 on any product to save it here.</p>`;
    return;
  }

  favorites.forEach((favId) => {
    const index = storeProducts.findIndex(p => p.id === favId);
    if (index === -1) return; // product no longer exists
    const product = storeProducts[index];

    const isSweatpants = String(product.type || "").toLowerCase() === "sweatpants";
    const defaultColor = isSweatpants ? "white" : "black";
    const imageSrc = getImagePath(product, defaultColor);
    const defaultSize = product.pricing?.["M"] !== undefined ? "M" : Object.keys(product.pricing || {})[0] || "M";
    const activeDisplayPrice = getCalculatedRegionalPrice(product, defaultSize, defaultColor);
    const sizes = Object.keys(product.pricing || { "S": 0, "M": 0, "L": 0, "XL": 0 });

    let finalColors;
    if (isSweatpants) {
      finalColors = ["white"];
    } else if (product.colors && product.colors.length) {
      finalColors = product.colors.filter(c => {
        if (c === "stone-blue" && userCountry === "ZA") return false;
        return true;
      });
    } else {
      const dynamicColors = [...new Set(Object.keys(product.variants || {}).map(k => k.split("-").slice(1).join("-")))]
        .filter(c => !(c === "stone-blue" && userCountry === "ZA"));
      finalColors = dynamicColors.length ? dynamicColors : ["black", "white"];
    }

    const type = String(product.type || "").toLowerCase();
    const hasBack = (type === "hoodie" || type === "sweatshirt" || type === "longsleeve" || type === "sweatpants") && !NO_BACK_IDS.includes(product.id);
    const backColor = type === "sweatpants" ? "white" : defaultColor;
    const backSrc = hasBack ? `images/${IMAGE_FOLDER_MAP[product.id]}/back-${backColor}.png` : null;
    const showBackFirst = hasBack && type !== "sweatpants" && type !== "longsleeve";
    const displaySrc = showBackFirst ? backSrc : imageSrc;
    const initialShowing = showBackFirst ? "back" : "front";

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image-wrap${hasBack ? " swipeable" : ""}"
           ${hasBack ? `data-front="${imageSrc}" data-back="${backSrc}" data-showing="${initialShowing}"` : ""}>
        <img
          id="img-${index}"
          src="${displaySrc}"
          class="product-image"
          alt="${product.name}"
          onerror="(function(img){
            var src=img.src;
            // Try back.png (no color suffix) as fallback
            if(src.indexOf('/back-')!==-1 && src.indexOf('lunara-website-logo')===-1){
              var alt=src.replace(/\/back-[^/]+\.png$/,'/back.png');
              if(alt!==src){ img.src=alt; return; }
            }
            img.onerror=null; img.src='images/lunara-website-logo.png';
          })(this)"
        >
        ${hasBack ? `<div class="swipe-hint">${showBackFirst ? "swipe →" : "swipe ←"}</div>` : ""}
      </div>

      <div class="product-info">
        <div class="product-top">
          <h4>${product.name}</h4>
          <button class="fav-btn active" onclick="toggleFavorite('${product.id}', this)">
            🦋
          </button>
        </div>

        ${(() => {
          const ap = getAnchorPrice(product.type, defaultColor, defaultSize);
          return ap ? `<p class="anchor-price" id="anchor-display-${index}">${ap}</p>` : "";
        })()}
        <p class="product-price" id="price-display-${index}">${formatCurrency(activeDisplayPrice)}</p>

        <select id="size-${index}" onchange="updatePremiumPricing(${index})">
          ${sizes.map(size => `<option value="${size}" ${size === defaultSize ? "selected" : ""}>${size}</option>`).join("")}
        </select>

        ${finalColors.length > 1
          ? `<select id="color-${index}" onchange="changeColor(${index})">
              ${finalColors.map(color => `<option value="${color}" ${color === defaultColor ? "selected" : ""}>${color.charAt(0).toUpperCase() + color.slice(1)}</option>`).join("")}
            </select>`
          : `<input type="hidden" id="color-${index}" value="${finalColors[0] || defaultColor}">`
        }

        <button onclick="addToCart(${index}, event)">
          Add to Cart →
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ==========================
// 🛒 ADD TO CART
// ==========================
function addToCart(index, event) {
  const product = storeProducts[index];
  if (!product) return;

  const size = document.getElementById(`size-${index}`)?.value || "M";
  const color = document.getElementById(`color-${index}`)?.value || "white";
  const image = getImagePath(product, color);
  const type = String(product.type || "").toLowerCase();

  if (!product.printify && !product.printful && !product.prodigi && !product.yoycol) {
    alert("This product is currently unavailable.");
    return;
  }

  const variantKey = `${size}-${color}`;
  const regionalPrice = getCalculatedRegionalPrice(product, size, color);
  const variantSku = product.variants?.[variantKey]?.sku || product.variants?.[`S-${color}`]?.sku || "LOCAL-PROD";

  // Fulfillment routing:
  // SA  + hoodie/sweatshirt/tshirt/longsleeve → OTC Printing (email triggered at checkout)
  // SA  + sweatpants                          → Printful
  // INT + anything                            → Printify
  const otcTypes = ["hoodie", "sweatshirt", "tshirt", "longsleeve"]; // all go to OTC for SA customers
  const fulfilledByOTC = userCountry === "ZA" && otcTypes.includes(type);
  const fulfilledByPrintful = userCountry === "ZA" && type === "sweatpants";
  const fulfilledByPrintify = userCountry !== "ZA";

  const existing = cart.find(
    (item) => item.id === product.id && item.size === size && item.color === color
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(regionalPrice),
      size,
      color,
      quantity: 1,
      type: product.type,
      slug: product.slug,
      sku: variantSku,
      printify: product.printify,
      printful: product.printful || false,
      printfulId: product.printfulId || null,
      prodigi: product.prodigi,
      fulfilledByOTC,
      fulfilledByPrintful,
      fulfilledByPrintify,
      designUrl: image
    });
  }

  saveCart();
  updateCart();
  openCart();

  if (event?.target) {
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "Added ✓";
    btn.style.background = "var(--success)";
    setTimeout(() => {
      btn.innerText = originalText || "Add to Cart →";
      btn.style.background = "";
    }, 1200);
  }
}

// ==========================
// 🧾 CART UI MANAGEMENT
// ==========================
// ==========================
// 🎟️ PROMO CODES
// ==========================
// LUNA5      = 5% off cart total, reusable, type: "general" — shareable as a link
// AMBASSADOR codes = 5% off cart total, reusable, type: "ambassador" — unique per ambassador, trackable
// WELCOME10  = 10% off cart total, ONE-TIME USE per customer, type: "welcome" — currently DISABLED (set live: false)
//
// STACKING RULE: one "general" code (LUNA5) + one "ambassador" code can combine for 10% off together.
// Two ambassador codes cannot stack with each other. Only you control this list — customers cannot
// add, edit, or create their own codes; they can only type in ones you've published.
const PROMO_CODES = {
  "LUNA5":      { percent: 0.05, oneTimeUse: false, type: "general",    live: true  },
  "WELCOME10":  { percent: 0.10, oneTimeUse: true,  type: "welcome",    live: false }, // flip live:true to launch later

  // ⭐ AMBASSADOR CODE POOL — 15 pre-made star-themed codes, ready to hand out.
  // Give each new ambassador the next unused code below (just flip "assigned" to their name as a note).
  // No code changes needed when someone new joins — just hand out the next one and share their link:
  // https://lunara-universe-tau.vercel.app/?promo=CODE
  "NOVA5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
  "STAR5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
  "ORBI5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
  "GLOW5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
  "BEAM5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
  "FLAR5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
  "VEGA5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
  "RISE5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
  "AURA5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
  "DUST5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
  "MOON5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
  "HALO5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
  "WISP5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
  "DAWN5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
  "GAZE5": { percent: 0.05, oneTimeUse: false, type: "ambassador", live: true }, // unassigned
};

let activePromos = []; // array of { code, percent, type } — supports stacking

function hasUsedOneTimeCode(code) {
  const used = JSON.parse(localStorage.getItem("lunaraUsedPromoCodes") || "[]");
  return used.includes(code);
}

function markOneTimeCodeUsed(code) {
  const used = JSON.parse(localStorage.getItem("lunaraUsedPromoCodes") || "[]");
  if (!used.includes(code)) {
    used.push(code);
    localStorage.setItem("lunaraUsedPromoCodes", JSON.stringify(used));
  }
}

function getActivePromoMessage() {
  if (!activePromos.length) return "";
  const totalPercent = Math.round(activePromos.reduce((sum, p) => sum + p.percent, 0) * 100);
  const codes = activePromos.map(p => p.code).join(" + ");
  return `✓ ${codes} applied — ${totalPercent}% off!`;
}

// Core apply logic, usable both from the input box and from URL auto-apply
function tryApplyPromoCode(code, msg) {
  code = code.trim().toUpperCase();
  if (!code) return false;

  const promo = PROMO_CODES[code];

  if (!promo || !promo.live) {
    if (msg) { msg.innerText = "Invalid promo code."; msg.style.color = "#f87171"; }
    return false;
  }

  if (promo.oneTimeUse && hasUsedOneTimeCode(code)) {
    if (msg) { msg.innerText = "This code has already been used."; msg.style.color = "#f87171"; }
    return false;
  }

  // Already applied?
  if (activePromos.some(p => p.code === code)) {
    if (msg) { msg.innerText = "This code is already applied."; msg.style.color = "var(--muted)"; }
    return false;
  }

  // Stacking rules:
  // - "general" (LUNA5) can stack with ONE "ambassador" code
  // - two "ambassador" codes cannot stack together
  // - "welcome" codes don't stack with anything (used alone)
  if (promo.type === "welcome" && activePromos.length > 0) {
    if (msg) { msg.innerText = "This code can't be combined with other codes."; msg.style.color = "#f87171"; }
    return false;
  }
  if (activePromos.some(p => p.type === "welcome")) {
    if (msg) { msg.innerText = "Remove your current code first to add another."; msg.style.color = "#f87171"; }
    return false;
  }
  if (promo.type === "ambassador" && activePromos.some(p => p.type === "ambassador")) {
    if (msg) { msg.innerText = "Only one ambassador code can be used per order."; msg.style.color = "#f87171"; }
    return false;
  }
  if (promo.type === "general" && activePromos.some(p => p.type === "general")) {
    if (msg) { msg.innerText = "This code is already applied."; msg.style.color = "var(--muted)"; }
    return false;
  }

  activePromos.push({ code, percent: promo.percent, type: promo.type });
  if (msg) {
    msg.innerText = getActivePromoMessage();
    msg.style.color = "var(--success, #4ade80)";
  }
  return true;
}

window.applyPromo = function() {
  const input = document.getElementById("promo-input");
  const msg = document.getElementById("promo-msg");
  if (!input) return;
  const code = input.value;

  if (!code.trim()) {
    if (msg) { msg.innerText = "Please enter a code."; msg.style.color = "var(--muted)"; }
    return;
  }

  tryApplyPromoCode(code, msg);
  updateCart();
};

// Auto-apply promo codes from a shareable link, e.g. ?promo=LUNA5 or ?promo=AMBKARLA5
function autoApplyPromoFromURL() {
  const params = new URLSearchParams(window.location.search);
  const promoParam = params.get("promo");
  if (!promoParam) return;
  const msg = document.getElementById("promo-msg");
  const input = document.getElementById("promo-input");
  const applied = tryApplyPromoCode(promoParam, msg);
  if (applied && input) input.value = promoParam.toUpperCase();
  updateCart();
}

function updateCart() {
  const items = document.getElementById("cart-items");
  if (!items) return;
  items.innerHTML = "";

  if (!cart.length) {
    items.innerHTML = `<p>Your cart is empty.</p>`;
    if (document.getElementById("cart-total")) document.getElementById("cart-total").innerText = formatCurrency(0);
    if (document.getElementById("cart-count")) document.getElementById("cart-count").innerText = "0";
    return;
  }

  cart.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <h5>${item.name}</h5>
        <p>Size: ${item.size} | Color: ${item.color}</p>
        <p>Qty: ${item.quantity}</p>
      </div>
      <div>
        <strong>${formatCurrency(item.price * item.quantity)}</strong>
        <br>
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>
    `;
    items.appendChild(row);
  });

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // 🎁 BUNDLE DEAL: Tiered discounts when buying 3+ items.
  // 3 items = 10% off | 4+ items = 12% off
  // Bundle discount takes priority over ALL promo codes — they don't stack.
  let bundleActive = false;
  let bundlePercent = 0;
  if (itemCount >= 4) {
    bundleActive = true;
    bundlePercent = 0.12;
  } else if (itemCount === 3) {
    bundleActive = true;
    bundlePercent = 0.10;
  }
  const totalPercentOff = bundleActive ? bundlePercent : (activeDiscount ? activeDiscount.percent / 100 : activePromos.reduce((sum, p) => sum + p.percent, 0));
  const total = subtotal * (1 - totalPercentOff);

  // Show bundle messaging in the promo area
  const msg = document.getElementById("promo-msg");
  const promoRow = document.querySelector(".promo-row");
  const promoHint = document.querySelector(".promo-hint");
  if (bundleActive) {
    const discountPercent = Math.round(bundlePercent * 100);
    if (msg) { msg.innerText = `🎁 Bundle deal active — ${discountPercent}% off your order!`; msg.style.color = "var(--success, #4ade80)"; }
    if (promoRow) promoRow.style.display = "none";
    if (promoHint) promoHint.style.display = "none";
  } else {
    if (promoRow) promoRow.style.display = "";
    if (promoHint) promoHint.style.display = "";
    if (msg && !activePromos.length) msg.innerText = "";
    else if (msg && activePromos.length) msg.innerText = getActivePromoMessage();
  }

  if (document.getElementById("cart-total")) document.getElementById("cart-total").innerText = formatCurrency(total);
  if (document.getElementById("cart-count")) document.getElementById("cart-count").innerText = cart.reduce((sum, i) => sum + i.quantity, 0);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function openCart() {
  document.getElementById("cart-panel")?.classList.add("open");
  document.body.classList.add("cart-open");
}

function closeCart() {
  document.getElementById("cart-panel")?.classList.remove("open");
  document.body.classList.remove("cart-open");
}

// ==========================
// 👤 CUSTOMER PROFILE AUTO-FILL
// ==========================
function autoFillUserProfile() {
  // Pull existing session variables from localStorage or global object contexts if available
  const savedProfile = JSON.parse(localStorage.getItem("lunaraCustomerProfile"));
  if (!savedProfile) return;

  const emailField = document.getElementById("customer-email");
  const addressField = document.getElementById("customer-address1");
  const countryField = document.getElementById("customer-country");
  const phoneField = document.getElementById("customer-phone");
  const cityField = document.getElementById("customer-city");
  const regionField = document.getElementById("customer-region");
  const zipField = document.getElementById("customer-zip");
  const firstField = document.getElementById("customer-first-name");
  const lastField = document.getElementById("customer-last-name");

  if (emailField && savedProfile.email) emailField.value = savedProfile.email;
  if (addressField && savedProfile.address1) addressField.value = savedProfile.address1;
  if (countryField && savedProfile.country) countryField.value = savedProfile.country;
  if (phoneField && savedProfile.phone) phoneField.value = savedProfile.phone;
  if (cityField && savedProfile.city) cityField.value = savedProfile.city;
  if (regionField && savedProfile.region) regionField.value = savedProfile.region;
  if (zipField && savedProfile.zip) zipField.value = savedProfile.zip;
  if (firstField && savedProfile.firstName) firstField.value = savedProfile.firstName;
  if (lastField && savedProfile.lastName) lastField.value = savedProfile.lastName;
}

// ==========================
// 📦 OTC PRINTING — PLACEMENT RULES
// Each product type has defined print placement zones.
// These are included in the automated OTC order email so the printer
// knows exactly where each design goes on each garment.
//
// ⚠️  Update these placements once you send your placement guide.
//     The structure is: productId → array of placement instructions.
//     If a product isn't listed here, it falls back to type-level defaults.
// ==========================
// ==========================
// 🗂️ OTC PLACEMENT FILE NAMES
// These are the EXACT print file names OTC Printing receives per garment type.
// Each placement has:
//   zone       → where on the garment it gets printed
//   file(color)→ the exact filename they need, based on the customer's chosen color
//
// T-SHIRTS:
//   Front  → "{Design} {Color} t-shirt front.png"         (design-specific)
//   Left sleeve  → "Universe All {Color} T-shirts Left Sleeve.png"
//   Right sleeve → "Lunara All {Color} T-shirts Right Sleeve.png"
//
// LONG SLEEVE T-SHIRTS:
//   Front        → "{Design} {Color} long sleeve t-shirt front.png" (design-specific)
//   Right sleeve → "Universe All {Color} Long Sleeve T-shirts Right Sleeve.png"
//   Back         → "Lunara All {Color} Long sleeve T-shirts Back.png"
//
// HOODIES:
//   Back         → "{Design} {Color} Hoodie Back.png"      (design-specific)
//   Front        → "Lunara All {Color} Hoodies & Sweatshirts Front.png"
//   Left sleeve  → "Universe All {Color} Hoodies & Sweatshirts Left Sleeve.png"
//
// SWEATSHIRTS:
//   Back         → "{Design} {Color} Sweatshirt Back.png"  (design-specific)
//   Front        → "Lunara All {Color} Hoodies & Sweatshirts Front.png"
//   Left sleeve  → "Universe All {Color} Hoodies & Sweatshirts Left Sleeve.png"
// ==========================

// Design name map: product id → the exact design name used in the file names
const DESIGN_NAMES = {
  "lunara-butterfly-tshirt":       "Butterfly",
  "lunara-compass-tshirt":         "Compass",
  "lunara-cosmic-eye-tshirt":      "Cosmic Eye",
  "lunara-drip-smile-tshirt":      "Drip Smile",
  "lunara-energy-bloom-tshirt":    "Energy Bloom",
  "lunara-jellyfish-tshirt":       "Jellyfish",
  "lunara-mushroom-tshirt":        "Mushroom",
  "nova-butterfly-hoodie":         "Butterfly",
  "nova-compass-hoodie":           "Compass",
  "nova-cosmic-eye-hoodie":        "Cosmic Eye",
  "nova-drip-smile-hoodie":        "Drip Smile",
  "nova-energy-bloom-hoodie":      "Energy Bloom",
  "nova-jellyfish-hoodie":         "Jellyfish",
  "nova-mushroom-hoodie":          "Mushroom",
  "lunara-butterfly-sweatshirt":   "Butterfly",
  "lunara-compass-sweatshirt":     "Compass",
  "lunara-cosmic-eye-sweatshirt":  "Cosmic Eye",
  "lunara-drip-smile-sweatshirt":  "Drip Smile",
  "lunara-energy-bloom-sweatshirt":"Energy Bloom",
  "lunara-jellyfish-sweatshirt":   "Jellyfish",
  "lunara-mushroom-sweatshirt":    "Mushroom",
  "lunara-butterfly-longsleeve":   "Butterfly",
  "lunara-compass-longsleeve":     "Compass",
  "lunara-cosmic-eye-longsleeve":  "Cosmic Eye",
  "lunara-drip-smile-longsleeve":  "Drip Smile",
  "lunara-energy-bloom-longsleeve":"Energy Bloom",
  "lunara-jellyfish-longsleeve":   "Jellyfish",
  "lunara-mushroom-longsleeve":    "Mushroom"
};

function getOTCPlacements(product, color) {
  const type   = String(product?.type || "").toLowerCase();
  const design = DESIGN_NAMES[product?.id] || product?.name?.replace(/ (T-shirt|Hoodie|Sweatshirt|Long Sleeve.*)/i, "").trim() || "Design";
  // Both design files and Lunara/Universe branding files use the same garment color
  // Black garment → all Black files, White garment → all White files
  const garment = color ? color.charAt(0).toUpperCase() + color.slice(1) : "Black";
  const ink = garment; // same color throughout

  if (type === "tshirt") {
    return [
      { zone: "Front",        file: `${design} ${garment} t-shirt front.png` },
      { zone: "Left sleeve",  file: `Universe All ${ink} T-shirts Left Sleeve.png` },
      { zone: "Right sleeve", file: `Lunara All ${ink} T-shirts Right Sleeve.png` }
    ];
  }
  if (type === "longsleeve") {
    return [
      { zone: "Front",        file: `${design} ${garment} long sleeve t-shirt front.png` },
      { zone: "Right sleeve", file: `Universe All ${ink} Long Sleeve T-shirts Right Sleeve.png` },
      { zone: "Back",         file: `Lunara All ${ink} Long sleeve T-shirts Back.png` }
    ];
  }
  if (type === "hoodie") {
    return [
      { zone: "Back",        file: `${design} ${garment} Hoodie Back.png` },
      { zone: "Front",       file: `Lunara All ${ink} Hoodies & Sweatshirts Front.png` },
      { zone: "Left sleeve", file: `Universe All ${ink} Hoodies & Sweatshirts Left Sleeve.png` }
    ];
  }
  if (type === "sweatshirt") {
    return [
      { zone: "Back",        file: `${design} ${garment} Sweatshirt Back.png` },
      { zone: "Front",       file: `Lunara All ${ink} Hoodies & Sweatshirts Front.png` },
      { zone: "Left sleeve", file: `Universe All ${ink} Hoodies & Sweatshirts Left Sleeve.png` }
    ];
  }
  // Fallback
  return [{ zone: "Front", file: `${design} ${garment} front.png` }];
}

// Builds the structured data payload for the OTC order.
// This gets sent to /api/otc-order which will trigger your Wix automation.
// Each item includes: name, size, color, quantity, and placement instructions.
function buildOTCPayload(customer, items) {
  return {
    orderId: localStorage.getItem("lunara_order_id") || "LUNARA-" + Date.now(),
    customer: {
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone || "",
      address: [
        customer.address1,
        customer.city,
        customer.region,
        customer.zip,
        "South Africa"
      ].filter(Boolean).join(", ")
    },
    items: items.map(item => {
      const product = storeProducts.find(p => p.id === item.id) || {};
      const placements = getOTCPlacements(product, item.color);
      return {
        productName: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        placements
      };
    })
  };
}

// ==========================
// 💳 CHECKOUT
// ==========================
async function checkout() {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  const firstName = document.getElementById("customer-first-name")?.value;
  const lastName = document.getElementById("customer-last-name")?.value;
  const email = document.getElementById("customer-email")?.value;
  const country = document.getElementById("customer-country")?.value || userCountry;

  // If key details are missing, open the details modal instead of alerting
  if (!firstName || !lastName || !email) {
    openDetailsModal();
    return;
  }

  const phone = document.getElementById("customer-phone")?.value;
  const address1 = document.getElementById("customer-address1")?.value;
  const city = document.getElementById("customer-city")?.value;
  const region = document.getElementById("customer-region")?.value;
  const zip = document.getElementById("customer-zip")?.value;

  // Cache shipping info for next visit
  const customerProfile = { firstName, lastName, email, country, phone, address1, city, region, zip };
  localStorage.setItem("lunaraCustomerProfile", JSON.stringify(customerProfile));

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  let bundleActive = false;
  let bundlePercent = 0;
  if (itemCount >= 4) {
    bundleActive = true;
    bundlePercent = 0.12;
  } else if (itemCount === 3) {
    bundleActive = true;
    bundlePercent = 0.10;
  }
  const totalPercentOff = bundleActive ? bundlePercent : (activeDiscount ? activeDiscount.percent / 100 : activePromos.reduce((sum, p) => sum + p.percent, 0));
  const total = subtotal * (1 - totalPercentOff);
  const orderId = "LUNARA-" + Date.now();
  localStorage.setItem("lunara_order_id", orderId);

  // Lock one-time-use promo codes (e.g. WELCOME10) so they can't be reused
  // (skipped automatically if the bundle deal applied instead of a promo code)
  if (!bundleActive) {
    activePromos.forEach(p => {
      if (PROMO_CODES[p.code]?.oneTimeUse) markOneTimeCodeUsed(p.code);
    });
  }

  // Promo codes are tied to THIS order only — clear them now so they never
  // carry over into the customer's next visit or next purchase.
  activePromos = [];
  const promoInputEl = document.getElementById("promo-input");
  const promoMsgEl = document.getElementById("promo-msg");
  if (promoInputEl) promoInputEl.value = "";
  if (promoMsgEl) promoMsgEl.innerText = "";

  // Split cart: OTC items (SA local fulfillment) vs Printful items (sweatpants, all regions)
  const otcItems = cart.filter(i => i.fulfilledByOTC);
  const printfulItems = cart.filter(i => i.printful && !i.fulfilledByOTC);

  // SA customers with hoodies/sweatshirts/tees:
  // Fire OTC Printing email trigger via /api/otc-order.
  // This is a non-blocking background call — PayFast payment still proceeds.
  // Your Wix automation picks up from there once you wire it in.
  if (otcItems.length > 0) {
    try {
      const otcPayload = buildOTCPayload(
        { firstName, lastName, email, phone, address1, city, region, zip },
        otcItems
      );
      await fetch("/api/otc-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(otcPayload)
      });
    } catch (err) {
      console.error("OTC order email failed:", err);
      // Non-blocking — PayFast payment still proceeds
    }
  }

  // Proceed to PayFast payment (covers the full cart total)
  const res = await fetch("/api/payfast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      amount: total,
      cart,
      address1,
      city,
      region,
      zip,
      country,
      phone,
      orderId
    })
  });

  const data = await res.json();
  if (!res.ok || !data.url) {
    console.error("Checkout failed:", data);
    alert("Checkout failed. Please try again.");
    return;
  }

  // Save order to admin records before redirecting
  const orderRecord = {
    id: orderId,
    date: new Date().toISOString(),
    name: `${firstName} ${lastName}`,
    email,
    phone,
    address: `${address1}, ${city}, ${region}, ${zip}`,
    country,
    region: userCountry,
    items: cart.map(i => ({
      name: i.name,
      type: i.type || "",
      size: i.size,
      color: i.color,
      quantity: i.quantity,
      price: i.price,
      region: userCountry
    })),
    subtotal,
    discount: totalPercentOff > 0 ? `${Math.round(totalPercentOff * 100)}%` : null,
    total,
    status: "paid",
    fulfillment: otcItems.length > 0 ? "OTC + Printful" : "Printful"
  };
  const existingOrders = JSON.parse(localStorage.getItem("lunaraOrders") || "[]");
  existingOrders.push(orderRecord);
  localStorage.setItem("lunaraOrders", JSON.stringify(existingOrders));

  incrementOrderCounter();
  window.location.href = data.url;
}

// ==========================
// 📦 LOAD PRODUCTS
// ==========================
async function loadProducts() {
  // Use localProducts only — correct names, images, SKUs.
  // International SKUs go to Printify at checkout via localProducts.variants.
  storeProducts = [...localProducts];
  displayProducts(storeProducts);
  updateCart();
}

// ==========================
// 🌙 SMART HEADER SCROLL
// ==========================
function initSmartHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const nearTop = currentScrollY < 140;

    if (currentScrollY > 25) header.classList.add("shrink");
    else header.classList.remove("shrink");

    if (nearTop) header.classList.remove("header-hidden");
    else if (scrollingDown) header.classList.add("header-hidden");
    else header.classList.remove("header-hidden");

    lastScrollY = Math.max(currentScrollY, 0);
  });
}

// ==========================
// 📋 FOOTER DETAILS FORM
// Pre-fills from saved profile and saves back when updated
// ==========================
function initFooterDetailsForm() {
  const saved = JSON.parse(localStorage.getItem("lunaraCustomerProfile") || "null");
  if (!saved) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
  set("footer-first-name", saved.firstName);
  set("footer-last-name",  saved.lastName);
  set("footer-email",      saved.email);
  set("footer-phone",      saved.phone);
  set("footer-address",    saved.address1);
  set("footer-city",       saved.city);
  set("footer-region",     saved.region);
  set("footer-zip",        saved.zip);
  set("footer-country",    saved.country);
}

window.saveFooterDetails = function() {
  const get = id => document.getElementById(id)?.value.trim() || "";
  const firstName = get("footer-first-name");
  const email     = get("footer-email");
  const errorEl   = document.getElementById("footer-details-error");
  const successEl = document.getElementById("footer-details-success");
  if (!firstName || !email) {
    if (errorEl) errorEl.classList.remove("hidden");
    return;
  }
  if (errorEl) errorEl.classList.add("hidden");
  const profile = {
    firstName, email,
    lastName:  get("footer-last-name"),
    phone:     get("footer-phone"),
    address1:  get("footer-address"),
    city:      get("footer-city"),
    region:    get("footer-region"),
    zip:       get("footer-zip"),
    country:   get("footer-country")
  };
  localStorage.setItem("lunaraCustomerProfile", JSON.stringify(profile));
  autoFillUserProfile();
  if (successEl) {
    successEl.classList.remove("hidden");
    setTimeout(() => successEl.classList.add("hidden"), 3000);
  }
};

// ==========================
// 🚀 INIT
// ==========================
async function init() {
  initSmartHeader();
  await detectCountry();
  initRegionSelector();
  autoFillUserProfile();
  initFooterDetailsForm();
  checkWelcomeGate();
  initEmailCapture();
  initOrderCounter();
}

init();

// ==========================
// 🌟 WELCOME GATE & DETAILS MODAL
// First-time visitors must fill in details before browsing.
// Returning visitors can update details via "Details" in the footer.
// Both use the same #details-modal-overlay in index.html.
// ==========================

function checkWelcomeGate() {
  const saved = localStorage.getItem("lunaraCustomerProfile");
  if (saved) {
    // Returning visitor — load store straight away
    loadProducts().then(() => { updateCart(); autoApplyPromoFromURL(); });
  } else {
    // First visit — show the details modal as a gentle prompt (can be closed)
    openDetailsModal();
    loadProducts().then(() => { updateCart(); autoApplyPromoFromURL(); });
  }
}

// Opens the details modal.
// Always shows the X close button — details are optional but encouraged.
// Also called before checkout if details are incomplete.
function openDetailsModal() {
  const overlay = document.getElementById("details-modal-overlay");
  if (!overlay) return;

  // Pre-fill with saved profile if returning visitor
  const saved = JSON.parse(localStorage.getItem("lunaraCustomerProfile") || "null");
  if (saved) {
    setModalField("modal-first-name", saved.firstName);
    setModalField("modal-last-name",  saved.lastName);
    setModalField("modal-email",      saved.email);
    setModalField("modal-phone",      saved.phone);
    setModalField("modal-address",    saved.address1);
    setModalField("modal-city",       saved.city);
    setModalField("modal-region",     saved.region);
    setModalField("modal-zip",        saved.zip);
    setModalField("modal-country",    saved.country);
  } else if (userCountry === "ZA") {
    setModalField("modal-country", "South Africa");
  }

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function setModalField(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.value = value;
}

function closeDetailsModal(event) {
  // If called from overlay click, only close if clicking the backdrop itself
  if (event && event.target !== document.getElementById("details-modal-overlay")) return;
  const overlay = document.getElementById("details-modal-overlay");
  if (!overlay) return;
  overlay.classList.remove("active");
  document.body.style.overflow = "";
  // If store hasn't loaded yet (first visit, skipped details), load it now
  const products = document.querySelector(".products");
  if (!products || products.children.length === 0) {
    loadProducts().then(() => updateCart());
  }
}

window.openDetailsModal = openDetailsModal;
window.closeDetailsModal = closeDetailsModal;

window.saveDetailsModal = function() {
  const firstName = document.getElementById("modal-first-name")?.value.trim();
  const lastName  = document.getElementById("modal-last-name")?.value.trim();
  const email     = document.getElementById("modal-email")?.value.trim();
  const phone     = document.getElementById("modal-phone")?.value.trim();
  const address1  = document.getElementById("modal-address")?.value.trim();
  const city      = document.getElementById("modal-city")?.value.trim();
  const region    = document.getElementById("modal-region")?.value.trim();
  const zip       = document.getElementById("modal-zip")?.value.trim();
  const country   = document.getElementById("modal-country")?.value.trim();
  const errorEl   = document.getElementById("modal-error");

  if (!firstName || !email) {
    if (errorEl) errorEl.classList.remove("hidden");
    return;
  }
  if (errorEl) errorEl.classList.add("hidden");

  const profile = { firstName, lastName, email, phone, address1, city, region, zip, country };
  localStorage.setItem("lunaraCustomerProfile", JSON.stringify(profile));

  // Sync to checkout form fields
  autoFillUserProfile();

  // Close modal
  const overlay = document.getElementById("details-modal-overlay");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";

  // If this was the first-visit gate, now load the store
  const products = document.querySelector(".products");
  if (!products || products.children.length === 0) {
    loadProducts().then(() => updateCart());
  }
};
window.setRegion = function(region) {
  localStorage.setItem("selectedRegion", region);
  userCountry = region;
  updateRegionUI(region);
  if (storeProducts.length > 0) displayProducts(storeProducts);
  updateCart();
  const dd = document.getElementById("regionDropdown");
  if (dd) dd.classList.add("hidden");
};

// ==========================
// 👆 IMAGE SWIPE (back/front toggle)
// ==========================
let _lastSwipeTime = 0;

document.addEventListener("touchstart", function(e) {
  const wrap = e.target.closest(".swipeable");
  if (!wrap) return;
  wrap._touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener("touchend", function(e) {
  const wrap = e.target.closest(".swipeable");
  if (!wrap || wrap._touchStartX === undefined) return;
  const dx = e.changedTouches[0].clientX - wrap._touchStartX;
  if (Math.abs(dx) > 30) {
    _lastSwipeTime = Date.now();
    swapImage(wrap);
  }
}, { passive: true });

// Desktop click — skip if a touch swipe just fired (prevents double-fire on mobile)
document.addEventListener("click", function(e) {
  if (Date.now() - _lastSwipeTime < 500) return;
  const wrap = e.target.closest(".swipeable");
  if (!wrap) return;
  // Don't trigger swap if they clicked a button/select inside the card
  if (e.target.closest("button, select, a")) return;
  swapImage(wrap);
});

function swapImage(wrap) {
  const img = wrap.querySelector("img");
  if (!img) return;
  const showing = wrap.dataset.showing;
  const hint = wrap.querySelector(".swipe-hint");
  if (showing === "back") {
    img.src = wrap.dataset.front;
    wrap.dataset.showing = "front";
    if (hint) hint.textContent = "← swipe";
  } else {
    img.src = wrap.dataset.back;
    wrap.dataset.showing = "back";
    if (hint) hint.textContent = "swipe →";
  }
}

// ==========================
// 🌍 CUSTOMS MODAL
// ==========================
window.openCustomsModal = function() {
  const overlay = document.getElementById("customs-modal-overlay");
  if (overlay) overlay.classList.add("active");
};

window.closeCustomsModal = function(e) {
  if (e && e.target !== document.getElementById("customs-modal-overlay")) return;
  const overlay = document.getElementById("customs-modal-overlay");
  if (overlay) overlay.classList.remove("active");
};
// Allow the button to close it directly
document.addEventListener("click", function(e) {
  if (e.target && e.target.closest("#customs-modal-overlay .checkout-btn")) {
    const overlay = document.getElementById("customs-modal-overlay");
    if (overlay) overlay.classList.remove("active");
  }
});
