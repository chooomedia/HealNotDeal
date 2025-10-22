/* js/app.js */

/* ===== DOM ===== */
const els = {
  displayFontSel: document.getElementById("displayFont"),
  montNot: document.getElementById("montNot"),
  sizeHeal: document.getElementById("sizeHeal"),
  sizeNot: document.getElementById("sizeNot"),
  sizeDeal: document.getElementById("sizeDeal"),
  tile: document.getElementById("tile"),
  opacity: document.getElementById("opacity"),
  stroke: document.getElementById("stroke"),
  lead: document.getElementById("lead"),
  notBias: document.getElementById("notBias"),
  patternVariant: document.getElementById("patternVariant"),
  bgDark: document.getElementById("bgDark"),
  previewObj: document.getElementById("previewObj"),
  overlay: document.getElementById("overlay"),
  downloads: document.getElementById("downloads"),
  svgOut: document.getElementById("svgOut"),
  themeToggle: document.getElementById("themeToggle"),
};

/* ===== Theme Persistence ===== */
const THEME_KEY = "hnd_theme";
function applyTheme(mode) {
  document.body.classList.toggle("dark", mode === "dark");
  els.themeToggle.checked = mode === "dark";
}
(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const mode = saved || "light";
  applyTheme(mode);
})();
els.themeToggle.addEventListener("change", () => {
  const mode = els.themeToggle.checked ? "dark" : "light";
  localStorage.setItem(THEME_KEY, mode);
  applyTheme(mode);
  updatePreview();
});

/* ===== Werte lesen ===== */
const getVals = () => {
  const [cssName, urlName] = els.displayFontSel.value.split("|");
  return {
    cssName,
    urlName,
    healSize: parseInt(els.sizeHeal.value, 10),
    notSize: parseInt(els.sizeNot.value, 10),
    dealSize: parseInt(els.sizeDeal.value, 10),
    tileSize: parseInt(els.tile.value, 10),
    op: parseFloat(els.opacity.value),
    sw: parseInt(els.stroke.value, 10),
    leadV: parseInt(els.lead.value, 10),
    notBiasV: parseInt(els.notBias.value, 10),
    dark: els.bgDark.checked,
    notIsMont: els.montNot.checked,
    variant: els.patternVariant.value,
  };
};

/* ===== Pattern (SVG Vektor, 3 Varianten) ===== */
function rosetteSymbol(fg) {
  const leaf = "M0,-40 C12,-28 12,-12 0,0 C-12,-12 -12,-28 0,-40 z";
  return (
    "<g id='rosLeaf' fill='" +
    fg +
    "'><path d='" +
    leaf +
    "'/></g>" +
    "<g id='rosEmblem'>" +
    "<use href='#rosLeaf' transform='rotate(0)'/>" +
    "<use href='#rosLeaf' transform='rotate(20)'/>" +
    "<use href='#rosLeaf' transform='rotate(40)'/>" +
    "<use href='#rosLeaf' transform='rotate(60)'/>" +
    "<use href='#rosLeaf' transform='rotate(-20)'/>" +
    "<use href='#rosLeaf' transform='rotate(-40)'/>" +
    "<use href='#rosLeaf' transform='rotate(-60)'/>" +
    "<rect x='-2' y='0' width='4' height='34' fill='" +
    fg +
    "' rx='2'/>" +
    "</g>"
  );
}
function outlineLeafPath() {
  return "M0,-52 C18,-36 20,-18 0,0 C-20,-18 -18,-36 0,-52 z";
}
function monoLeafPath() {
  return "M0,-46 C16,-32 16,-14 0,0 C-16,-14 -16,-32 0,-46 z";
}

function buildPatternDefs(v, fg) {
  const t = v.tileSize,
    op = v.op;
  let content = "";

  if (v.variant === "tile-rosette") {
    content =
      "<g opacity='" +
      op +
      "'>" +
      "<g id='emblemSrc'>" +
      rosetteSymbol(fg) +
      "</g>" +
      "<use href='#emblemSrc' transform='translate(" +
      t / 2 +
      "," +
      t / 2 +
      ") scale(" +
      t / 140 +
      ")'/>" +
      "<use href='#emblemSrc' transform='translate(" +
      t * 0.18 +
      "," +
      t * 0.24 +
      ") scale(" +
      t / 200 +
      ") rotate(14)'/>" +
      "<use href='#emblemSrc' transform='translate(" +
      t * 0.78 +
      "," +
      t * 0.7 +
      ") scale(" +
      t / 200 +
      ") rotate(-12)'/>" +
      "</g>";
  } else if (v.variant === "tile-mono") {
    const p = monoLeafPath();
    content =
      "<g opacity='" +
      op +
      "' stroke='none' fill='" +
      fg +
      "'>" +
      "<path d='" +
      p +
      "' transform='translate(" +
      t * 0.25 +
      "," +
      t * 0.25 +
      ")'/>" +
      "<path d='" +
      p +
      "' transform='translate(" +
      t * 0.75 +
      "," +
      t * 0.25 +
      ") rotate(10)'/>" +
      "<path d='" +
      p +
      "' transform='translate(" +
      t * 0.25 +
      "," +
      t * 0.75 +
      ") rotate(-12)'/>" +
      "<path d='" +
      p +
      "' transform='translate(" +
      t * 0.75 +
      "," +
      t * 0.78 +
      ")'/>" +
      "</g>";
  } else {
    // tile-outline
    const p = outlineLeafPath();
    content =
      "<g opacity='" +
      op +
      "' fill='none' stroke='" +
      fg +
      "' stroke-width='2'>" +
      "<path d='" +
      p +
      "' transform='translate(" +
      t * 0.3 +
      "," +
      t * 0.3 +
      ")'/>" +
      "<path d='" +
      p +
      "' transform='translate(" +
      t * 0.7 +
      "," +
      t * 0.3 +
      ") rotate(8)'/>" +
      "<path d='" +
      p +
      "' transform='translate(" +
      t * 0.3 +
      "," +
      t * 0.7 +
      ") rotate(-10)'/>" +
      "<path d='" +
      p +
      "' transform='translate(" +
      t * 0.7 +
      "," +
      t * 0.72 +
      ")'/>" +
      "</g>";
  }

  return (
    "<pattern id='leafPattern' x='0' y='0' width='" +
    t +
    "' height='" +
    t +
    "' patternUnits='userSpaceOnUse' patternContentUnits='userSpaceOnUse'>" +
    content +
    "</pattern>"
  );
}

/* ===== SVG-Builder (Preview = Export 1:1) ===== */
function buildSVG(bgColor) {
  const v = getVals();
  const centerX = 1000;
  const fg = bgColor === "#111111" ? "#FFFFFF" : "#000000";

  // (1) Baseline Heal
  const baseY = 520;

  // (2) Engine-Abstand +50 zwischen Heal/Deal (Stack)
  const gapAdd = 40;

  // (3) Erst Positionen berechnen (not im Zentrum + Bias)
  const yNotNearHeal = baseY + Math.round(v.healSize * 0.26) + v.leadV;
  const yDealRaw =
    yNotNearHeal +
    Math.round(v.notSize * 0.22) +
    v.leadV +
    Math.round(v.dealSize * 0.05);
  let yDeal0 = yDealRaw + gapAdd;

  // not: Mitte (Heal vs. yDeal0) + opt. Bias
  let yNot = Math.round(baseY + v.healSize * 0.246 + v.leadV + v.notBiasV);

  // Sicherheitsabstände (nicht überschneiden)
  const minGapTop = Math.max(6, Math.round(v.healSize * 0.32));
  if (yNot < baseY + minGapTop) yNot = baseY + minGapTop;
  let yDeal = Math.round(yNot + 288);

  const minGapBot =
    Math.max(6, Math.round(v.dealSize * 0.06)) + Math.round(v.notSize * 0.22);
  if (yDeal < yNot + minGapBot) yDeal = yNot + minGapBot;

  const gfDisplay =
    "https://fonts.googleapis.com/css2?family=" +
    v.urlName +
    "&amp;display=swap";
  const gfMont =
    "https://fonts.googleapis.com/css2?family=Montserrat:wght@500&amp;display=swap";
  const notFont = v.notIsMont
    ? "font-family='Montserrat, Arial, sans-serif' font-weight='500'"
    : "font-family='" + v.cssName + ", serif'";

  const defs = buildPatternDefs(v, fg);

  return (
    "<svg xmlns='http://www.w3.org/2000/svg' width='2000' height='1600' viewBox='0 0 2000 1600'>" +
    "<defs>" +
    defs +
    "<style>@import url('" +
    gfDisplay +
    "'); @import url('" +
    gfMont +
    "');</style></defs>" +
    "<g text-anchor='middle'>" +
    "<text x='" +
    centerX +
    "' y='" +
    baseY +
    "' font-family='" +
    v.cssName +
    ", serif' font-size='" +
    v.healSize +
    "' fill='url(#leafPattern)' stroke='" +
    fg +
    "' stroke-width='" +
    v.sw +
    "' paint-order='stroke'>Heal</text>" +
    "<text x='" +
    centerX +
    "' y='" +
    yDeal +
    "' font-family='" +
    v.cssName +
    ", serif' font-size='" +
    v.dealSize +
    "' fill='url(#leafPattern)' stroke='" +
    fg +
    "' stroke-width='" +
    v.sw +
    "' paint-order='stroke'>Deal</text>" +
    "<text x='" +
    centerX +
    "' y='" +
    yNot +
    "' " +
    notFont +
    " font-size='" +
    v.notSize +
    "' fill='" +
    fg +
    "' stroke='none'>not</text>" +
    "</g>" +
    "</svg>"
  );
}

/* ===== Preview/Export ===== */
function updatePreview() {
  const v = getVals();
  const bg = v.dark ? "#111111" : "#FFFFFF"; // Dark-Preview = schwarzer BG, Logo-Konturen weiß
  const svg = buildSVG(bg);
  const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  els.previewObj.setAttribute("data", dataUrl);
  els.svgOut.textContent = svg;
}

function showOverlay() {
  els.overlay.style.display = "flex";
}
function hideOverlay() {
  els.overlay.style.display = "none";
}

function render(bg) {
  showOverlay();
  const start = Date.now();
  const svg = buildSVG(bg);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    bg === "#FFFFFF" ? "heal-no-deal-white.svg" : "heal-no-deal-black.svg";
  const minDelay = Math.max(0, 5000 - (Date.now() - start));
  setTimeout(() => {
    a.click();
    URL.revokeObjectURL(url);
    hideOverlay();
  }, minDelay);

  // UX: direkte, dauerhafte Download-Links (immer grün)
  els.downloads.innerHTML = "";
  const btnWhite = document.createElement("a");
  btnWhite.className = "btn btn-primary";
  btnWhite.textContent = "⬇︎ SVG Weiß";
  btnWhite.href =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(buildSVG("#FFFFFF"));
  btnWhite.download = "heal-no-deal-white.svg";

  const btnBlack = document.createElement("a");
  btnBlack.className = "btn btn-primary";
  btnBlack.textContent = "⬇︎ SVG Schwarz";
  btnBlack.href =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(buildSVG("#111111"));
  btnBlack.download = "heal-no-deal-black.svg";

  els.downloads.appendChild(btnWhite);
  els.downloads.appendChild(btnBlack);
}

/* ===== Events ===== */
[
  els.displayFontSel,
  els.montNot,
  els.sizeHeal,
  els.sizeNot,
  els.sizeDeal,
  els.tile,
  els.opacity,
  els.stroke,
  els.lead,
  els.notBias,
  els.patternVariant,
  els.bgDark,
].forEach((el) => el.addEventListener("input", updatePreview));

document.getElementById("renderWhite").addEventListener("click", (e) => {
  e.preventDefault();
  render("#FFFFFF");
});
document.getElementById("renderBlack").addEventListener("click", (e) => {
  e.preventDefault();
  render("#111111");
});

/* Footer: Jahr */
document.getElementById("year").textContent = new Date().getFullYear();

/* Init Preview */
updatePreview();
