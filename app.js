/*
 * app.js
 * 進学可能性チェッカーのロジック一式(MAP / SAT・ACT実スコア / AP / IB / TOEFL)。
 * 判定ロジックの詳細は同ディレクトリのdata.js冒頭コメント、および画面下部の
 * 「判定方法について」を参照。表示文言の日英切り替えはi18n.jsのSTRINGS/CATEGORY_LABEL/
 * SOURCE_LABEL/T、getLang()を参照する。
 */

// --- 統計関数 -----------------------------------------------------------

// 標準正規分布の累積分布関数(Abramowitz-Stegun近似)
function normalCDF(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p; // 0〜1
}

// 表(xKeyの昇順)から、指定xValueに対応するyKeyの値を線形補間で求める汎用関数
function interpolateTable(table, xKey, yKey, xValue) {
  const lo = table[0][xKey];
  const hi = table[table.length - 1][xKey];
  const x = Math.max(lo, Math.min(hi, xValue));
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i];
    const b = table[i + 1];
    if (x >= a[xKey] && x <= b[xKey]) {
      if (b[xKey] === a[xKey]) return a[yKey];
      const ratio = (x - a[xKey]) / (b[xKey] - a[xKey]);
      return a[yKey] + ratio * (b[yKey] - a[yKey]);
    }
  }
  return table[table.length - 1][yKey];
}

function scoreFromPercentile(table, percentile) {
  return interpolateTable(table, "percentile", "score", percentile);
}

// --- MAPスコアパイプライン -------------------------------------------------

function computeCompositeZ(grade, term, reading, math, languageUsage) {
  const zScores = [];
  const subjects = [
    { key: "reading", value: reading },
    { key: "math", value: math },
    { key: "languageUsage", value: languageUsage },
  ];
  for (const s of subjects) {
    if (s.value === null || s.value === undefined || s.value === "") continue;
    const norm = MAP_NORMS[s.key][grade] && MAP_NORMS[s.key][grade][term];
    if (!norm) continue;
    const z = (Number(s.value) - norm.mean) / norm.sd;
    zScores.push(z);
  }
  if (zScores.length === 0) return null;
  return zScores.reduce((a, b) => a + b, 0) / zScores.length;
}

// --- 米国SAT/ACT推定値の決定(実スコア優先) -------------------------------
// 優先順位: 実際のSAT > 実際のACT(換算) > MAPスコアからの推定

function computeUSSignal({ satActual, actActual, compositeZ }) {
  if (satActual !== null && satActual !== undefined) {
    const estSAT = Number(satActual);
    const pct = interpolateTable(SAT_PERCENTILE_TABLE, "score", "percentile", estSAT);
    const estACT = Math.round(scoreFromPercentile(ACT_PERCENTILE_TABLE, pct));
    return { estSAT, estACT, source: "actualSAT" };
  }
  if (actActual !== null && actActual !== undefined) {
    const estACT = Number(actActual);
    const pct = interpolateTable(ACT_PERCENTILE_TABLE, "score", "percentile", estACT);
    const estSAT = Math.round(scoreFromPercentile(SAT_PERCENTILE_TABLE, pct) / 10) * 10;
    return { estSAT, estACT, source: "actualACT" };
  }
  if (compositeZ !== null && compositeZ !== undefined) {
    const pct = normalCDF(compositeZ) * 100;
    const estSAT = Math.round(scoreFromPercentile(SAT_PERCENTILE_TABLE, pct) / 10) * 10;
    const estACT = Math.round(scoreFromPercentile(ACT_PERCENTILE_TABLE, pct));
    return { estSAT, estACT, source: "map" };
  }
  return null;
}

// --- AP換算スコア ---------------------------------------------------------
// 5点=1.0 / 4点=0.7 / 3点=0.4 の加重で合成し、大学側の要求パス(複数可)のうち
// 最も緩いパスを実質的な基準値として比較する(いずれか1パスを満たせば出願可能なため)。

function apCompositeScore(ap) {
  if (!ap) return 0;
  return (ap.five || 0) * 1.0 + (ap.four || 0) * 0.7 + (ap.three || 0) * 0.4;
}

function apPathTarget(apPaths) {
  return Math.min(...apPaths.map((c) => (c.five || 0) * 1.0 + (c.four || 0) * 0.7 + (c.three || 0) * 0.4));
}

// --- 分類ロジック ---------------------------------------------------------
// 4区分: safety(安全圏) / match(実力圏) / reach(挑戦圏) / outOfReach(圏外)

function classifyByRange(estScore, low, high) {
  if (estScore >= high) return "safety";
  if (estScore >= low) return "match";
  const span = Math.max(high - low, 1);
  if (estScore >= low - span) return "reach";
  return "outOfReach";
}

// value(推定値)とtarget(大学側の基準)の差から4区分を判定する汎用関数
function classifyByTarget(value, target, thresholds) {
  const diff = value - target;
  if (diff >= thresholds.safety) return "safety";
  if (diff >= thresholds.match) return "match";
  if (diff >= thresholds.reach) return "reach";
  return "outOfReach";
}

const HENSACHI_THRESHOLDS = { safety: 2, match: -2, reach: -7 };
const IB_THRESHOLDS = { safety: 2, match: -2, reach: -6 };
const AP_THRESHOLDS = { safety: 1, match: 0, reach: -2 };

const CATEGORY_ORDER = ["safety", "match", "reach", "outOfReach"];

// --- TOEFL要件オーバーレイ ---------------------------------------------------

function toeflWarningNote(toefl, min, lang) {
  if (toefl === null || toefl === undefined || min === undefined) return null;
  if (Number(toefl) < min) return T[lang].toeflWarning(min, toefl);
  return null;
}

// --- 英国大学のマルチパス評価 -----------------------------------------------
// SAT/ACT・AP・IBのうち、入力されているものをすべて評価し、最も有利な区分を採用する。
// 評価できるパスが1つもない場合は「情報不足」として別枠で扱う。

function evaluateUKUniversity(u, signals, lang) {
  const t = T[lang];
  const paths = [];

  if (u.satMin !== undefined && signals.us) {
    const cat = classifyByRange(signals.us.estSAT, u.satMin, u.satMin + 60);
    paths.push({ type: "SAT/ACT", category: cat, detail: t.satDetail(Math.round(signals.us.estSAT), u.satMin) });
  }
  if (u.apPaths && signals.ap) {
    const score = apCompositeScore(signals.ap);
    const target = apPathTarget(u.apPaths);
    const cat = classifyByTarget(score, target, AP_THRESHOLDS);
    paths.push({ type: "AP", category: cat, detail: t.apDetail(score, target) });
  }
  if (u.ibMin !== undefined && signals.ib !== null && signals.ib !== undefined) {
    const cat = classifyByTarget(signals.ib, u.ibMin, IB_THRESHOLDS);
    paths.push({ type: "IB", category: cat, detail: t.ibDetail(signals.ib, u.ibMin) });
  }

  const note = lang === "en" ? u.noteEn || u.note : u.note;
  const toeflCaution = lang === "en" ? u.toeflCautionEn || u.toeflCaution : u.toeflCaution;

  const extraNotes = [];
  if (note) extraNotes.push(note);
  if (signals.toefl !== null && signals.toefl !== undefined) {
    if (toeflCaution) extraNotes.push(toeflCaution);
    const toeflNote = toeflWarningNote(signals.toefl, u.toeflMin, lang);
    if (toeflNote) extraNotes.push(toeflNote);
  }

  if (paths.length === 0) {
    const hints = [];
    if (u.satMin !== undefined) hints.push(t.ukHintSat);
    if (u.apPaths) hints.push(t.ukHintAp);
    if (u.ibMin !== undefined) hints.push(t.ukHintIb);
    return {
      insufficient: true,
      hint: hints.length ? t.insufficientHint(hints) : "",
      note: extraNotes.join(" "),
    };
  }

  const rank = { safety: 0, match: 1, reach: 2, outOfReach: 3 };
  paths.sort((a, b) => rank[a.category] - rank[b.category]);
  const pathNote = paths.map((p) => t.pathArrow(p.type, p.detail, CATEGORY_LABEL[lang][p.category])).join(" / ");

  return { category: paths[0].category, note: [...extraNotes, pathNote].filter(Boolean).join(" ") };
}

// --- 大学名バッジ(実ロゴの代わりに頭文字モノグラムを表示) -----------------------

function schoolInitials(name) {
  if (/[぀-ヿ一-鿿]/.test(name)) return name.charAt(0);
  const clean = name.replace(/\(.*?\)/g, "").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 1 && /^[A-Z]{2,5}$/.test(words[0])) return words[0];
  const stop = new Set(["of", "the", "and", "at", "in", "for"]);
  const letters = words
    .filter((w) => !stop.has(w.toLowerCase()))
    .map((w) => w.replace(/[^A-Za-z]/g, "").charAt(0))
    .filter(Boolean);
  const result = letters.slice(0, 3).join("").toUpperCase();
  return result || clean.charAt(0).toUpperCase();
}

// --- レンダリング -----------------------------------------------------------

function groupByCategory(items) {
  const groups = { safety: [], match: [], reach: [], outOfReach: [] };
  for (const item of items) groups[item.category].push(item);
  return groups;
}

function renderCategoryGroups(container, groups, formatDetail, lang) {
  container.innerHTML = "";
  let hasAny = false;
  for (const cat of CATEGORY_ORDER) {
    const items = groups[cat];
    if (items.length === 0) continue;
    hasAny = true;
    const section = document.createElement("div");
    section.className = "category-group";

    const heading = document.createElement("div");
    heading.className = `category-heading cat-${cat}`;
    heading.innerHTML = `<span class="cat-dot"></span><span class="cat-label">${CATEGORY_LABEL[lang][cat]}</span><span class="cat-count">${T[lang].schoolCount(items.length)}</span>`;
    section.appendChild(heading);

    const ul = document.createElement("ul");
    ul.className = "school-list";
    for (const item of items) {
      const li = document.createElement("li");
      li.className = `school-row cat-${cat}`;
      const detail = formatDetail(item);
      li.innerHTML = `<div class="school-row-main"><div class="school-name-wrap"><span class="school-badge">${schoolInitials(item.name)}</span><span class="school-name">${item.name}</span></div>${detail ? `<span class="school-detail">${detail}</span>` : ""}</div>`;
      if (item.note) {
        const noteEl = document.createElement("div");
        noteEl.className = "school-note";
        noteEl.textContent = item.note;
        li.appendChild(noteEl);
      }
      ul.appendChild(li);
    }
    section.appendChild(ul);
    container.appendChild(section);
  }
  if (!hasAny) {
    container.innerHTML = `<p>${T[lang].noSchoolsMsg}</p>`;
  }
}

function renderInsufficientList(container, schools, headingLabel) {
  const heading = document.createElement("div");
  heading.className = "category-heading cat-excluded";
  heading.innerHTML = `<span class="cat-dot"></span><span class="cat-label">${headingLabel}</span><span class="cat-count">${schools.length}</span>`;
  container.appendChild(heading);

  const ul = document.createElement("ul");
  ul.className = "school-list";
  for (const s of schools) {
    const li = document.createElement("li");
    li.className = "school-row cat-excluded";
    li.innerHTML = `<div class="school-row-main"><div class="school-name-wrap"><span class="school-badge">${schoolInitials(s.name)}</span><span class="school-name">${s.name}</span></div></div>`;
    const noteText = [s.hint, s.note].filter(Boolean).join(" ");
    if (noteText) {
      const noteEl = document.createElement("div");
      noteEl.className = "school-note";
      noteEl.textContent = noteText;
      li.appendChild(noteEl);
    }
    ul.appendChild(li);
  }
  container.appendChild(ul);
}

function renderUSResults(results, signals, lang) {
  const container = document.getElementById("us-results");
  if (!results.us) {
    container.innerHTML = `<p class="insufficient-note">${T[lang].usInsufficient}</p>`;
    return;
  }
  const items = US_UNIVERSITIES.map((u) => {
    const toeflNote = toeflWarningNote(signals.toefl, TOEFL_US_TIER_MIN[u.tier], lang);
    return {
      name: u.name,
      category: classifyByRange(results.us.estSAT, u.satLow, u.satHigh),
      detail: T[lang].satMiddle50(u.satLow, u.satHigh),
      note: toeflNote || undefined,
    };
  });
  renderCategoryGroups(container, groupByCategory(items), (item) => item.detail, lang);
}

function renderJPResults(results, signals, lang) {
  const container = document.getElementById("jp-results");
  if (results.hensachi === null) {
    container.innerHTML = `<p class="insufficient-note">${T[lang].jpInsufficient}</p>`;
    return;
  }
  const items = JP_UNIVERSITIES.map((u) => {
    const notes = [];
    const ibNote = lang === "en" ? u.ibRouteNoteEn || u.ibRouteNote : u.ibRouteNote;
    if (ibNote && signals.ib !== null && signals.ib !== undefined) notes.push(`[IB] ${ibNote}`);
    const toeflNote = toeflWarningNote(signals.toefl, u.toeflMin, lang);
    if (toeflNote) notes.push(toeflNote);
    return {
      name: lang === "en" ? u.nameEn || u.name : u.name,
      category: classifyByTarget(results.hensachi, u.hensachi, HENSACHI_THRESHOLDS),
      detail: T[lang].hensachiGuide(u.hensachi),
      note: notes.join(" ") || undefined,
    };
  });
  renderCategoryGroups(container, groupByCategory(items), (item) => item.detail, lang);
}

function renderUKResults(signals, lang) {
  const container = document.getElementById("uk-results");
  container.innerHTML = "";

  const evaluated = [];
  const insufficient = [];
  for (const u of UK_UNIVERSITIES) {
    const result = evaluateUKUniversity(u, signals, lang);
    if (result.insufficient) {
      insufficient.push({ name: u.name, hint: result.hint, note: result.note });
    } else {
      evaluated.push({ name: u.name, category: result.category, note: result.note });
    }
  }

  const evalWrap = document.createElement("div");
  renderCategoryGroups(evalWrap, groupByCategory(evaluated), () => "", lang);
  container.appendChild(evalWrap);

  if (insufficient.length > 0) {
    renderInsufficientList(container, insufficient, T[lang].insufficientHeading);
  }
}

function renderSummary(grade, results, lang) {
  const summary = document.getElementById("summary");
  const t = T[lang];
  const tiles = [];

  if (results.percentile !== null) {
    tiles.push(
      `<div class="summary-item"><span class="summary-label">${t.mapPercentileLabel}</span><span class="summary-value">${t.topPercent((100 - results.percentile).toFixed(1))}</span></div>`
    );
  }
  if (results.us) {
    tiles.push(
      `<div class="summary-item"><span class="summary-label">${t.estSATLabel}<br>(${SOURCE_LABEL[lang][results.us.source]})</span><span class="summary-value">${results.us.estSAT}</span></div>`
    );
    tiles.push(`<div class="summary-item"><span class="summary-label">${t.estACTLabel}</span><span class="summary-value">${results.us.estACT}</span></div>`);
  }
  if (results.hensachi !== null) {
    tiles.push(`<div class="summary-item"><span class="summary-label">${t.estHensachiLabel}</span><span class="summary-value">${results.hensachi}</span></div>`);
  }

  const gradeNote =
    results.percentile !== null
      ? grade <= 4
        ? t.gradeNoteVeryYoung
        : grade <= 8
          ? t.gradeNoteYoung
          : t.gradeNoteOld
      : "";

  summary.innerHTML = `
    <div class="summary-grid">${tiles.join("")}</div>
    ${gradeNote ? `<p class="grade-note">${gradeNote}</p>` : ""}
  `;
}

// --- 直近の判定結果(言語切り替え時の再描画用) -------------------------------

let lastGrade = null;
let lastResults = null;
let lastSignals = null;

function rerenderResults() {
  if (lastResults === null) return;
  const lang = getLang();
  renderSummary(lastGrade, lastResults, lang);
  renderUSResults(lastResults, lastSignals, lang);
  renderJPResults(lastResults, lastSignals, lang);
  renderUKResults(lastSignals, lang);
}
window.onLanguageChanged = rerenderResults;

// --- フォーム処理 -----------------------------------------------------------

function fieldValue(id) {
  return document.getElementById(id).value;
}

document.getElementById("map-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const lang = getLang();

  const grade = Number(fieldValue("grade"));
  const term = fieldValue("term");
  const readingRaw = fieldValue("reading");
  const mathRaw = fieldValue("math");
  const luRaw = fieldValue("languageUsage");

  const satRaw = fieldValue("satActual");
  const actRaw = fieldValue("actActual");
  const apFiveRaw = fieldValue("apFive");
  const apFourRaw = fieldValue("apFour");
  const apThreeRaw = fieldValue("apThree");
  const ibRaw = fieldValue("ibScore");
  const toeflRaw = fieldValue("toefl");

  const anyProvided =
    readingRaw !== "" ||
    mathRaw !== "" ||
    luRaw !== "" ||
    satRaw !== "" ||
    actRaw !== "" ||
    apFiveRaw !== "" ||
    apFourRaw !== "" ||
    apThreeRaw !== "" ||
    ibRaw !== "" ||
    toeflRaw !== "";

  if (!anyProvided) {
    alert(STRINGS[lang].emptyFormAlert);
    return;
  }

  const compositeZ = computeCompositeZ(grade, term, readingRaw, mathRaw, luRaw);
  const us = computeUSSignal({
    satActual: satRaw === "" ? null : Number(satRaw),
    actActual: actRaw === "" ? null : Number(actRaw),
    compositeZ,
  });

  const results = {
    compositeZ,
    percentile: compositeZ === null ? null : normalCDF(compositeZ) * 100,
    hensachi: compositeZ === null ? null : Math.round((50 + 10 * compositeZ) * 10) / 10,
    us,
  };

  const apProvided = apFiveRaw !== "" || apFourRaw !== "" || apThreeRaw !== "";
  const signals = {
    us,
    ap: apProvided
      ? { five: Number(apFiveRaw || 0), four: Number(apFourRaw || 0), three: Number(apThreeRaw || 0) }
      : null,
    ib: ibRaw === "" ? null : Number(ibRaw),
    toefl: toeflRaw === "" ? null : Number(toeflRaw),
  };

  lastGrade = grade;
  lastResults = results;
  lastSignals = signals;

  renderSummary(grade, results, lang);
  renderUSResults(results, signals, lang);
  renderJPResults(results, signals, lang);
  renderUKResults(signals, lang);

  document.getElementById("results").classList.remove("hidden");
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
});
