/*
 * i18n.js
 * 静的UI文言の日英辞書と、言語切り替えの仕組み。
 * data.js側の大学名・注記の英訳(nameEn/noteEn/ibRouteNoteEn/toeflCautionEn)、
 * および app.js側の動的文言(カテゴリラベル・テンプレート文)はこのファイルの
 * STRINGS/CATEGORY_LABEL/SOURCE_LABEL/T を参照する。
 */

const STRINGS = {
  ja: {
    pageTitle: "進学可能性チェッカー",
    appTitle: "進学可能性チェッカー",
    tagline: "MAP・SAT・AP・IB・TOEFLのスコアから米国・英国・日本の大学進学可能性を統計的に試算",
    heroEyebrow: "世界の大学進学インサイト",
    heroTitle: "世界の大学進学を、<br />数字で見える化する。",
    heroSubtitle: "MAP・SAT・AP・IB・TOEFLのスコアから、米国・英国・日本の大学進学可能性を統計的に試算します。",
    disclaimerBody:
      "このツールはNWEA MAP Growthのスコアを統計的に換算した<strong>目安</strong>を示すものであり、実際の合否を保証・予測するものではありません。合否はGPA・エッセイ・課外活動・推薦状・実際のAP/IBスコアなど、MAPスコア以外の要素にも大きく左右されます。",
    inputHeading: "スコアを入力",
    mapInfoLabel: "MAP受験情報(MAPスコアを入力する場合)",
    gradeLabel: "学年",
    termLabel: "受験時期",
    termFall: "秋 (Fall)",
    termWinter: "冬 (Winter)",
    termSpring: "春 (Spring)",
    ritLabel: "RITスコア",
    optionalTag: "任意",
    readingLabel: "Reading",
    mathLabel: "Math",
    luLabel: "Language Usage",
    extraScoresSummary: "その他のスコアを追加(SAT・ACT・AP・IB・TOEFL)",
    extraScoresLead:
      "成長にあわせて受けた試験の実スコアがあれば入力してください。MAPは未入力でも構いません(入力された項目だけを使って判定します)。",
    satActLabel: "SAT・ACT実スコア",
    satLabel: "SAT合計",
    actLabel: "ACT合計",
    apLabel: "AP試験(科目数)",
    apFiveLabel: "5点だった科目数",
    apFourLabel: "4点だった科目数",
    apThreeLabel: "3点だった科目数",
    ibToeflLabel: "IB・TOEFL",
    ibLabel: "IB合計スコア(満点45)",
    toeflLabel: "TOEFL iBT合計",
    toeflScaleNote: "※ TOEFLは2026年1月にスコア尺度が新方式へ移行中のため、ここでは従来の0〜120点スケールで入力してください。",
    submitButton: "判定する",
    resultsHeading: "判定結果",
    usHeading: "米国",
    ukHeading: "英国",
    jpHeading: "日本",
    methodologySummary: "判定方法について(データ出典・前提条件・限界)",
    flowHeading: "計算の流れ",
    flow1: "入力されたRITスコアを、NWEA公表の学年・時期別 平均値/標準偏差(2025年版Norms)に基づきzスコアに変換します。",
    flow2: "Reading・Math(・任意でLanguage Usage)のzスコアを平均し、総合zスコアを算出します。",
    flow3:
      "米国のSAT/ACT推定値は「実際のSATスコア」→「実際のACTスコアから換算」→「MAPスコアからの推定」の優先順位で決定します(実スコアがあればそれを優先します)。",
    flow4:
      "日本の偏差値は「50 + 10×z」という統計的定義に基づき、MAPの総合zスコアから直接算出します(SAT/AP/IBを偏差値に変換する公式な根拠がないため、日本の判定はMAPスコアがある場合のみ行います)。",
    flow5: "米国・日本の大学は、推定スコアと各大学の合格者レンジ/偏差値を比較し、安全圏・実力圏・挑戦圏・圏外の4区分に分類します。",
    flow6:
      "英国は大学ごとに評価可能な基準(SAT/ACT・AP試験・IBスコア)をすべて確認し、入力されている中で最も有利な区分を採用します。AP試験は「5点=1.0点・4点=0.7点・3点=0.4点」で加重合成し、大学が公表する組み合わせのうち最も緩い基準と比較します。評価できる情報が一つもない大学は「判定に必要な情報が不足」として区別します。",
    flow7: "TOEFLは順位付けには使わず、各大学・階層の公式/目安の最低点を下回っている場合にのみ注記として表示します。",
    limitsHeading: "重要な限界",
    limit1:
      "NWEAはMAPスコアとSAT/ACTの完全な対応表を公表していません。ここではMAPのパーセンタイル(同学年集団内での相対位置)が、SAT/ACTの全米パーセンタイルとおおむね対応するという仮定を用いています。",
    limit2: "Kindergarten〜Grade 8のMAPスコアは、将来のSAT/ACT年齢時点まで同じ相対順位が続いた場合の推定であり、不確実性が大きくなります。特にKindergarten〜Grade 4は大学進学まで13年以上あり、推定の幅がきわめて大きい点にご注意ください。",
    limit3:
      "米国大学の合格者レンジは、test-optional化以降のスコア提出者バイアス(提出者は非提出者より高スコアな傾向)により、実態よりやや高めに出ている可能性があります。",
    limit4:
      "英国大学のAP/IB基準はコース(専攻)により細かく異なりますが、ここでは代表的な組み合わせに単純化しています。特にKing's College LondonとUniversity of EdinburghのIB基準は公式な幅が非常に広く、精度が粗い点にご注意ください。",
    limit5:
      "IBとSAT/ACTの間に公式な換算表は存在しないため、両者は変換せず独立したシグナルとして扱っています。同様にAP・IBスコアを米国大学や日本の偏差値判定には用いていません(公式な換算根拠がないため)。",
    limit6:
      "TOEFLは2026年1月にスコア尺度が新方式(1.0〜6.0)へ移行中で、Cambridgeなど一部大学は新形式TOEFLを受け付けない可能性があります。ここでの基準値は従来の0〜120点スケールに基づいています。",
    limit7: "日本の大学はIBの数値基準をほとんど公表していないため、日本の判定にはIBスコアを使わず、IB入試ルートの有無のみを参考情報として表示しています。",
    limit8: "日本の偏差値は模試提供元(河合塾・駿台・東進など)により数値が異なります。ここでの数値は複数の集計サイトを突き合わせた概算値です。",
    footerText:
      "データ出典: NWEA MAP Growth Norms (2025) / College Board SAT Percentile / ACT National Ranks / 各大学Common Data Set等(2026年7月時点調査)",
    emptyFormAlert: "MAP・SAT/ACT・AP・IB・TOEFLのうち、少なくとも1つはスコアを入力してください。",
  },
  en: {
    pageTitle: "College Admission Likelihood Checker",
    appTitle: "College Admission Likelihood Checker",
    tagline: "Statistically estimates US, UK, and Japan college admission likelihood from MAP, SAT, AP, IB, and TOEFL scores",
    heroEyebrow: "GLOBAL ADMISSIONS INSIGHT",
    heroTitle: "See your path to a<br />world-class university.",
    heroSubtitle: "A statistical estimate of your admission prospects at universities in the US, UK, and Japan — based on MAP, SAT, AP, IB, and TOEFL scores.",
    disclaimerBody:
      "This tool provides a statistically converted <strong>estimate</strong> based on NWEA MAP Growth and other scores — it does not guarantee or predict actual admission outcomes. Admission decisions depend heavily on factors beyond these scores, including GPA, essays, extracurricular activities, recommendation letters, and actual AP/IB exam results.",
    inputHeading: "Enter Your Scores",
    mapInfoLabel: "MAP Test Info (if entering a MAP score)",
    gradeLabel: "Grade",
    termLabel: "Test Term",
    termFall: "Fall",
    termWinter: "Winter",
    termSpring: "Spring",
    ritLabel: "RIT Scores",
    optionalTag: "Optional",
    readingLabel: "Reading",
    mathLabel: "Math",
    luLabel: "Language Usage",
    extraScoresSummary: "Add other scores (SAT, ACT, AP, IB, TOEFL)",
    extraScoresLead:
      "Enter actual scores from any tests taken as your child has progressed. MAP can be left blank — only the fields you fill in will be used for the assessment.",
    satActLabel: "Actual SAT / ACT Scores",
    satLabel: "SAT Total",
    actLabel: "ACT Composite",
    apLabel: "AP Exams (number of subjects)",
    apFiveLabel: "Subjects scored 5",
    apFourLabel: "Subjects scored 4",
    apThreeLabel: "Subjects scored 3",
    ibToeflLabel: "IB / TOEFL",
    ibLabel: "IB Total Score (out of 45)",
    toeflLabel: "TOEFL iBT Total",
    toeflScaleNote: "* TOEFL is transitioning to a new score scale starting January 2026 — please enter your score on the legacy 0-120 scale here.",
    submitButton: "Check Results",
    resultsHeading: "Results",
    usHeading: "United States",
    ukHeading: "United Kingdom",
    jpHeading: "Japan",
    methodologySummary: "About the methodology (data sources, assumptions, limitations)",
    flowHeading: "How the calculation works",
    flow1: "Converts the entered RIT scores into z-scores using NWEA's published grade/term-specific mean and standard deviation (2025 Norms).",
    flow2: "Averages the z-scores for Reading and Math (and Language Usage, if provided) to produce a composite z-score.",
    flow3:
      "The US SAT/ACT estimate is determined in this priority order: actual SAT score → converted from actual ACT score → estimated from MAP score (an actual score, if available, always takes priority).",
    flow4:
      'The Japanese hensachi (deviation score) is calculated directly from the MAP composite z-score using the standard statistical definition "50 + 10×z" (since there is no official basis for converting SAT/AP/IB into a hensachi, the Japan section is only evaluated when a MAP score is available).',
    flow5:
      "US and Japanese universities are classified into four tiers — Safety, Match, Reach, and Out of Reach — by comparing the estimated score against each university's admitted-student range or hensachi.",
    flow6:
      'For UK universities, every evaluable criterion (SAT/ACT, AP exams, IB score) is checked, and the most favorable tier among the inputs provided is used. AP exams are weighted and combined (5 = 1.0 point, 4 = 0.7 point, 3 = 0.4 point) and compared against the most lenient combination the university publishes. A university with no evaluable signal at all is shown separately as "Insufficient information."',
    flow7: "TOEFL is not used for ranking. A note is shown only when the entered score falls below the official or typical minimum for that university or tier.",
    limitsHeading: "Important limitations",
    limit1:
      "NWEA does not publish a complete conversion table between MAP scores and SAT/ACT. This tool assumes that a student's MAP percentile (relative standing within their grade cohort) roughly corresponds to the same percentile on the national SAT/ACT distribution.",
    limit2:
      "MAP scores from Kindergarten through Grade 8 are projections that assume the student's relative standing will remain the same by the time they reach SAT/ACT-taking age, so the uncertainty is considerably larger. This is especially true for Kindergarten through Grade 4, which projects 13+ years into the future.",
    limit3:
      "Since test-optional policies took hold, published admitted-student ranges reflect only the subset of students who chose to submit scores (who tend to score higher than non-submitters), so these ranges may run somewhat higher than the actual admitted class.",
    limit4:
      "UK universities' AP/IB requirements vary in detail by course, but this tool simplifies them to a single representative combination. In particular, the official IB ranges for King's College London and the University of Edinburgh are very wide, so those estimates are especially rough.",
    limit5:
      "No official concordance exists between IB and SAT/ACT, so this tool treats them as independent signals rather than converting one to the other. Likewise, AP and IB scores are not used for US or Japan hensachi classification, since there is no official basis for such a conversion.",
    limit6:
      "TOEFL is in the process of transitioning to a new 1.0-6.0 score scale starting January 2026, and some universities, including Cambridge, may not accept the new-format TOEFL. The benchmarks used here are based on the legacy 0-120 scale.",
    limit7:
      "Japanese universities publish almost no numeric IB thresholds, so the Japan classification does not use the IB score directly — it only shows, as reference information, whether an IB-based admission route exists.",
    limit8:
      "Japanese hensachi values differ depending on the mock-exam provider (Kawaijuku, Sundai, Toshin, etc.). The figures here are approximate values cross-checked across multiple aggregator sites.",
    footerText:
      "Data sources: NWEA MAP Growth Norms (2025) / College Board SAT Percentile / ACT National Ranks / individual university Common Data Sets, etc. (researched as of July 2026)",
    emptyFormAlert: "Please enter at least one score from MAP, SAT/ACT, AP, IB, or TOEFL.",
  },
};

// --- 動的レンダリングで使う辞書(app.js側から参照) --------------------------

const CATEGORY_LABEL = {
  ja: { safety: "安全圏", match: "実力圏", reach: "挑戦圏", outOfReach: "圏外" },
  en: { safety: "Safety", match: "Match", reach: "Reach", outOfReach: "Out of Reach" },
};

const SOURCE_LABEL = {
  ja: { actualSAT: "実際のSATスコア", actualACT: "実際のACTスコアから換算", map: "MAPスコアからの推定" },
  en: { actualSAT: "actual SAT score", actualACT: "converted from actual ACT score", map: "estimated from MAP score" },
};

const T = {
  ja: {
    schoolCount: (n) => `${n}校`,
    satMiddle50: (low, high) => `SAT中間50%: ${low}〜${high}`,
    hensachiGuide: (h) => `偏差値目安: ${h}`,
    toeflWarning: (min, toefl) => `⚠ TOEFL目安(${min}点以上)を下回っています(入力値: ${toefl}点)`,
    apDetail: (score, target) => `AP換算値 ${score.toFixed(1)}(基準${target.toFixed(1)})`,
    ibDetail: (ib, min) => `IB ${ib}点(基準${min}点)`,
    satDetail: (est, min) => `推定SAT ${est}(基準${min}+)`,
    pathArrow: (type, detail, label) => `[${type}] ${detail} → ${label}`,
    ukHintSat: "SAT/ACT実スコア(またはMAP)",
    ukHintAp: "AP試験の成績",
    ukHintIb: "IBスコア",
    insufficientHint: (hints) => `${hints.join("・")}のいずれかを入力すると判定できます。`,
    usInsufficient: "米国の判定には、MAPスコア・SAT実スコア・ACT実スコアのいずれかが必要です。",
    jpInsufficient: "日本の判定にはMAPスコアが必要です。",
    insufficientHeading: "判定に必要な情報が不足",
    noSchoolsMsg: "該当する大学がありませんでした。",
    mapPercentileLabel: "MAP総合パーセンタイル",
    topPercent: (p) => `上位 ${p}%`,
    estSATLabel: "推定SAT",
    estACTLabel: "推定ACT",
    estHensachiLabel: "推定偏差値",
    gradeNoteVeryYoung: "この学年でのMAPスコアから大学進学可能性を占うのは13年以上先の推定にあたり、不確実性が極めて大きい点にご注意ください。今後の学力の伸び方によって結果は大きく変わりえます。あくまで超長期的な参考値としてご覧ください。",
    gradeNoteYoung: "MAPスコアに基づく結果は「今の伸び方が続いた場合の将来推定」であり、不確実性が特に大きい点にご注意ください。",
    gradeNoteOld: "MAPスコアに基づく結果は「現時点でのおおよその換算」です。",
  },
  en: {
    schoolCount: (n) => `${n} school${n === 1 ? "" : "s"}`,
    satMiddle50: (low, high) => `SAT middle 50%: ${low}–${high}`,
    hensachiGuide: (h) => `Hensachi guide: ${h}`,
    toeflWarning: (min, toefl) => `⚠ Below the typical TOEFL benchmark (${min}+) — entered score: ${toefl}`,
    apDetail: (score, target) => `AP composite ${score.toFixed(1)} (benchmark ${target.toFixed(1)})`,
    ibDetail: (ib, min) => `IB ${ib} points (benchmark ${min} points)`,
    satDetail: (est, min) => `Estimated SAT ${est} (benchmark ${min}+)`,
    pathArrow: (type, detail, label) => `[${type}] ${detail} → ${label}`,
    ukHintSat: "an actual SAT/ACT score (or MAP)",
    ukHintAp: "AP exam results",
    ukHintIb: "an IB score",
    insufficientHint: (hints) => `Enter ${hints.join(", ")} to get a result for this school.`,
    usInsufficient: "A US assessment requires a MAP score, an actual SAT score, or an actual ACT score.",
    jpInsufficient: "A Japan assessment requires a MAP score.",
    insufficientHeading: "Insufficient information",
    noSchoolsMsg: "No matching universities.",
    mapPercentileLabel: "MAP composite percentile",
    topPercent: (p) => `Top ${p}%`,
    estSATLabel: "Estimated SAT",
    estACTLabel: "Estimated ACT",
    estHensachiLabel: "Estimated hensachi",
    gradeNoteVeryYoung: "Estimating college admission prospects from a MAP score at this grade projects 13+ years into the future, so the uncertainty is extremely large. The result could change substantially depending on how the student's academic growth unfolds — please treat it only as a very long-range reference point.",
    gradeNoteYoung: "This MAP-based result is a projection assuming the current growth trend continues, so its uncertainty is especially large.",
    gradeNoteOld: "This MAP-based result is a rough conversion of the student's current level.",
  },
};

// --- 言語切り替えの仕組み ---------------------------------------------------

let currentLang = localStorage.getItem("lang") === "en" ? "en" : "ja";

function getLang() {
  return currentLang;
}

function applyStaticI18n(lang) {
  const dict = STRINGS[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });
  document.documentElement.lang = lang;
  const toggle = document.getElementById("lang-toggle");
  if (toggle) toggle.textContent = lang === "ja" ? "EN" : "日本語";
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  applyStaticI18n(lang);
  if (typeof window.onLanguageChanged === "function") window.onLanguageChanged();
}

document.addEventListener("DOMContentLoaded", () => {
  applyStaticI18n(currentLang);
  const toggle = document.getElementById("lang-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      setLanguage(currentLang === "ja" ? "en" : "ja");
    });
  }
});
