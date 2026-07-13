/*
 * data.js
 * MAPスコア判定アプリのデータテーブル一式。
 *
 * 出典・調査日: 2026-07-11 時点でのWeb調査に基づく(詳細は各セクションのコメント参照)。
 * 大学の合格ラインやRIT基準は年度により変動するため、あくまで目安として扱うこと。
 */

// ---------------------------------------------------------------------------
// 1. MAP Growth 学年・時期別 平均値(mean)と標準偏差(sd)
// 出典: NWEA "2025 MAP Growth norms quick reference"
//   https://www.nwea.org/resource-center/fact-sheet/87992/MAP-Growth-2025-norms-quick-reference_NWEA_onesheet.pdf/
// サンプル: 116M scores / 13.8M students / 30,000校 (Fall 2022–Spring 2024)
// 学年が上がるにつれ平均値の伸びが鈍化・頭打ちになる点はNWEAの実データ通り。
// Language Usageは同資料でGrade11までしか公表されていないため、Grade12は未収録(nullで扱う)。
// Kindergarten・Grade1はLanguage Usageのノルム自体がNWEAに存在しない(未実施科目、欠測ではない)ため
// 同様にnullで扱う。K・Grade1のReading/Mathは2-12年生と同一のRITスケール上で連続しており、
// 換算方法(zスコア)をそのまま適用できる(NWEA Norms Technical Manual Table 1.1で確認)。
// 出典(K-4追加分): 2025 MAP Growth norms quick reference PDF(上記と同一資料)+ Technical Manual Appendix A で照合。
// ---------------------------------------------------------------------------
const MAP_NORMS = {
  reading: {
    0: { fall: { mean: 138, sd: 9 }, winter: { mean: 146, sd: 11 }, spring: { mean: 152, sd: 13 } },
    1: { fall: { mean: 155, sd: 13 }, winter: { mean: 163, sd: 14 }, spring: { mean: 168, sd: 16 } },
    2: { fall: { mean: 170, sd: 17 }, winter: { mean: 177, sd: 17 }, spring: { mean: 182, sd: 17 } },
    3: { fall: { mean: 185, sd: 18 }, winter: { mean: 190, sd: 18 }, spring: { mean: 194, sd: 18 } },
    4: { fall: { mean: 196, sd: 18 }, winter: { mean: 199, sd: 18 }, spring: { mean: 202, sd: 18 } },
    5: { fall: { mean: 204, sd: 17 }, winter: { mean: 206, sd: 17 }, spring: { mean: 208, sd: 17 } },
    6: { fall: { mean: 209, sd: 17 }, winter: { mean: 211, sd: 17 }, spring: { mean: 212, sd: 17 } },
    7: { fall: { mean: 212, sd: 17 }, winter: { mean: 214, sd: 17 }, spring: { mean: 215, sd: 17 } },
    8: { fall: { mean: 216, sd: 17 }, winter: { mean: 217, sd: 17 }, spring: { mean: 218, sd: 17 } },
    9: { fall: { mean: 216, sd: 18 }, winter: { mean: 217, sd: 18 }, spring: { mean: 217, sd: 18 } },
    10: { fall: { mean: 218, sd: 18 }, winter: { mean: 218, sd: 18 }, spring: { mean: 218, sd: 18 } },
    11: { fall: { mean: 218, sd: 18 }, winter: { mean: 218, sd: 18 }, spring: { mean: 218, sd: 19 } },
    12: { fall: { mean: 218, sd: 19 }, winter: { mean: 217, sd: 19 }, spring: { mean: 216, sd: 19 } },
  },
  math: {
    0: { fall: { mean: 141, sd: 12 }, winter: { mean: 151, sd: 13 }, spring: { mean: 158, sd: 13 } },
    1: { fall: { mean: 159, sd: 13 }, winter: { mean: 168, sd: 14 }, spring: { mean: 175, sd: 14 } },
    2: { fall: { mean: 173, sd: 15 }, winter: { mean: 181, sd: 16 }, spring: { mean: 187, sd: 16 } },
    3: { fall: { mean: 184, sd: 16 }, winter: { mean: 193, sd: 16 }, spring: { mean: 199, sd: 17 } },
    4: { fall: { mean: 197, sd: 16 }, winter: { mean: 204, sd: 17 }, spring: { mean: 210, sd: 18 } },
    5: { fall: { mean: 206, sd: 16 }, winter: { mean: 212, sd: 17 }, spring: { mean: 216, sd: 18 } },
    6: { fall: { mean: 210, sd: 16 }, winter: { mean: 216, sd: 17 }, spring: { mean: 220, sd: 18 } },
    7: { fall: { mean: 217, sd: 17 }, winter: { mean: 221, sd: 18 }, spring: { mean: 224, sd: 19 } },
    8: { fall: { mean: 222, sd: 18 }, winter: { mean: 226, sd: 19 }, spring: { mean: 229, sd: 20 } },
    9: { fall: { mean: 225, sd: 18 }, winter: { mean: 227, sd: 19 }, spring: { mean: 229, sd: 21 } },
    10: { fall: { mean: 227, sd: 19 }, winter: { mean: 229, sd: 20 }, spring: { mean: 231, sd: 22 } },
    11: { fall: { mean: 229, sd: 20 }, winter: { mean: 231, sd: 22 }, spring: { mean: 233, sd: 23 } },
    12: { fall: { mean: 228, sd: 21 }, winter: { mean: 230, sd: 22 }, spring: { mean: 231, sd: 23 } },
  },
  languageUsage: {
    0: null, // NWEA未実施(Kindergarten向けLanguage Usageテストは存在しない)
    1: null, // NWEA未実施(Grade1向けLanguage Usageテストは存在しない)
    2: { fall: { mean: 170, sd: 17 }, winter: { mean: 178, sd: 16 }, spring: { mean: 183, sd: 17 } },
    3: { fall: { mean: 184, sd: 17 }, winter: { mean: 190, sd: 17 }, spring: { mean: 193, sd: 17 } },
    4: { fall: { mean: 195, sd: 17 }, winter: { mean: 198, sd: 16 }, spring: { mean: 201, sd: 16 } },
    5: { fall: { mean: 202, sd: 16 }, winter: { mean: 205, sd: 16 }, spring: { mean: 207, sd: 16 } },
    6: { fall: { mean: 206, sd: 16 }, winter: { mean: 209, sd: 16 }, spring: { mean: 210, sd: 16 } },
    7: { fall: { mean: 210, sd: 16 }, winter: { mean: 212, sd: 16 }, spring: { mean: 213, sd: 16 } },
    8: { fall: { mean: 214, sd: 16 }, winter: { mean: 215, sd: 16 }, spring: { mean: 217, sd: 16 } },
    9: { fall: { mean: 214, sd: 17 }, winter: { mean: 215, sd: 17 }, spring: { mean: 216, sd: 17 } },
    10: { fall: { mean: 216, sd: 17 }, winter: { mean: 217, sd: 17 }, spring: { mean: 217, sd: 17 } },
    11: { fall: { mean: 218, sd: 17 }, winter: { mean: 218, sd: 17 }, spring: { mean: 218, sd: 18 } },
    12: null, // NWEA未公表
  },
};

// ---------------------------------------------------------------------------
// 2. SAT / ACT パーセンタイル対応表(スコア→全米代表サンプルでのパーセンタイル)
// 出典:
//   SAT: College Board "Understanding SAT Scores" (Nationally Representative percentile)
//        https://research.collegeboard.org/reports/sat-suite/understanding-scores/sat
//   ACT: ACT "National Ranks" (卒業クラス2023-2025基準)
//        https://www.act.org/content/act/en/products-and-services/the-act/scores/national-ranks.html
// 400点・1点は表の外挿用に設けた床(floor)であり公式値ではない。
// ---------------------------------------------------------------------------
const SAT_PERCENTILE_TABLE = [
  { score: 400, percentile: 1 },
  { score: 800, percentile: 14 },
  { score: 1000, percentile: 48 },
  { score: 1100, percentile: 67 },
  { score: 1200, percentile: 81 },
  { score: 1300, percentile: 91 },
  { score: 1400, percentile: 97 },
  { score: 1500, percentile: 99 },
  { score: 1600, percentile: 99.9 },
];

const ACT_PERCENTILE_TABLE = [
  { score: 1, percentile: 0.5 },
  { score: 10, percentile: 2 },
  { score: 11, percentile: 5 },
  { score: 12, percentile: 12 },
  { score: 13, percentile: 20 },
  { score: 14, percentile: 27 },
  { score: 15, percentile: 34 },
  { score: 16, percentile: 40 },
  { score: 17, percentile: 46 },
  { score: 18, percentile: 52 },
  { score: 19, percentile: 57 },
  { score: 20, percentile: 63 },
  { score: 21, percentile: 68 },
  { score: 22, percentile: 72 },
  { score: 23, percentile: 76 },
  { score: 24, percentile: 80 },
  { score: 25, percentile: 83 },
  { score: 26, percentile: 86 },
  { score: 27, percentile: 88 },
  { score: 28, percentile: 91 },
  { score: 29, percentile: 92 },
  { score: 30, percentile: 94 },
  { score: 31, percentile: 96 },
  { score: 32, percentile: 97 },
  { score: 33, percentile: 98 },
  { score: 34, percentile: 99 },
  { score: 35, percentile: 99 },
  { score: 36, percentile: 100 },
];

// ---------------------------------------------------------------------------
// 2b. TOEFL iBT 目安点(米国、選抜階層tier別)
// 出典: Harvard College(学部出願にTOEFL必須要件なし、非公式には100+が目安)
//   https://college.harvard.edu/resources/faq/do-i-have-take-toefl
//   UC Berkeley 90点 / Ohio State University 79点(公式最低点) / Arizona State University 61点(一般学部の公式最低点)
// TOEFLは2026年1月にスコア尺度が変更され新方式(1.0-6.0)に移行中。ここでは従来の0-120点尺度(スコアレポートに
// 引き続き併記される)を基準として扱う。あくまで「合格者の目安」であり、必須要件ではない大学も多い。
// ---------------------------------------------------------------------------
const TOEFL_US_TIER_MIN = {
  1: 100, // 最難関: 公式必須要件がない大学が多いが、非公式な目安として100+
  2: 90, // 難関: UC Berkeley公式90点
  3: 79, // 準難関: Ohio State University公式79点
  4: 61, // 中堅: Arizona State University公式61点(一般学部)
};

// ---------------------------------------------------------------------------
// 3. 米国大学(約55校、SAT中間50%レンジ)
// 出典: 各大学Common Data Set及びCollegeSimply / PrepScholar / OpusCollegePrep等の集計
// (2023–2025年度、test-optional化により提出者バイアスで実際よりやや高めに出ている可能性あり)
// tier: 1=最難関 2=難関 3=準難関 4=中堅
// ---------------------------------------------------------------------------
const US_UNIVERSITIES = [
  // Tier 1: 最難関(Ivy+/Stanford/MIT等)
  { name: "Harvard University", tier: 1, satLow: 1470, satHigh: 1570 },
  { name: "Yale University", tier: 1, satLow: 1460, satHigh: 1600 },
  { name: "Princeton University", tier: 1, satLow: 1380, satHigh: 1540 },
  { name: "Columbia University", tier: 1, satLow: 1490, satHigh: 1580 },
  { name: "MIT", tier: 1, satLow: 1500, satHigh: 1570 },
  { name: "California Institute of Technology", tier: 1, satLow: 1540, satHigh: 1580 },
  { name: "Stanford University", tier: 1, satLow: 1390, satHigh: 1540 },
  { name: "University of Pennsylvania", tier: 1, satLow: 1370, satHigh: 1520 },
  { name: "Brown University", tier: 1, satLow: 1450, satHigh: 1570 },
  { name: "Dartmouth College", tier: 1, satLow: 1430, satHigh: 1560 },
  { name: "Cornell University", tier: 1, satLow: 1390, satHigh: 1530 },
  { name: "University of Chicago", tier: 1, satLow: 1460, satHigh: 1560 },
  { name: "Johns Hopkins University", tier: 1, satLow: 1480, satHigh: 1560 },
  { name: "Duke University", tier: 1, satLow: 1315, satHigh: 1570 },
  { name: "Northwestern University", tier: 1, satLow: 1440, satHigh: 1540 },
  { name: "Washington University in St. Louis", tier: 1, satLow: 1500, satHigh: 1560 },
  // Tier 2: 難関(主要州立フラッグシップ/準アイビー私大)
  { name: "Georgetown University", tier: 2, satLow: 1320, satHigh: 1520 },
  { name: "Rice University", tier: 2, satLow: 1440, satHigh: 1560 },
  { name: "Vanderbilt University", tier: 2, satLow: 1400, satHigh: 1550 },
  { name: "University of Notre Dame", tier: 2, satLow: 1390, satHigh: 1530 },
  { name: "Carnegie Mellon University", tier: 2, satLow: 1410, satHigh: 1540 },
  { name: "Emory University", tier: 2, satLow: 1360, satHigh: 1490 },
  { name: "Tufts University", tier: 2, satLow: 1410, satHigh: 1540 },
  { name: "University of Virginia", tier: 2, satLow: 1320, satHigh: 1500 },
  { name: "UC Berkeley", tier: 2, satLow: 1280, satHigh: 1490 },
  { name: "UCLA", tier: 2, satLow: 1280, satHigh: 1500 },
  { name: "University of Michigan (Ann Arbor)", tier: 2, satLow: 1380, satHigh: 1540 },
  { name: "UNC Chapel Hill", tier: 2, satLow: 1270, satHigh: 1470 },
  { name: "William & Mary", tier: 2, satLow: 1310, satHigh: 1490 },
  { name: "University of Wisconsin–Madison", tier: 2, satLow: 1370, satHigh: 1490 },
  { name: "Boston College", tier: 2, satLow: 1320, satHigh: 1490 },
  { name: "University of Southern California", tier: 2, satLow: 1320, satHigh: 1480 },
  // Tier 3: 準難関(州立大学・強い私大)
  { name: "UC San Diego", tier: 3, satLow: 1250, satHigh: 1470 },
  { name: "UC Santa Barbara", tier: 3, satLow: 1230, satHigh: 1480 },
  { name: "UC Irvine", tier: 3, satLow: 1180, satHigh: 1440 },
  { name: "UC Davis", tier: 3, satLow: 1150, satHigh: 1410 },
  { name: "University of Florida", tier: 3, satLow: 1280, satHigh: 1440 },
  { name: "University of Texas at Austin", tier: 3, satLow: 1230, satHigh: 1480 },
  { name: "University of Illinois Urbana-Champaign", tier: 3, satLow: 1220, satHigh: 1480 },
  { name: "Ohio State University", tier: 3, satLow: 1280, satHigh: 1450 },
  { name: "Rutgers University", tier: 3, satLow: 1270, satHigh: 1480 },
  { name: "Penn State University", tier: 3, satLow: 1250, satHigh: 1410 },
  { name: "Northeastern University", tier: 3, satLow: 1360, satHigh: 1540 },
  { name: "New York University", tier: 3, satLow: 1360, satHigh: 1500 },
  { name: "Boston University", tier: 3, satLow: 1300, satHigh: 1500 },
  { name: "Case Western Reserve University", tier: 3, satLow: 1350, satHigh: 1520 },
  { name: "Villanova University", tier: 3, satLow: 1300, satHigh: 1470 },
  { name: "Lehigh University", tier: 3, satLow: 1270, satHigh: 1450 },
  { name: "Tulane University", tier: 3, satLow: 1350, satHigh: 1490 },
  { name: "Brandeis University", tier: 3, satLow: 1280, satHigh: 1500 },
  { name: "University of Rochester", tier: 3, satLow: 1320, satHigh: 1500 },
  // Tier 4: 中堅(広く門戸を開く州立大学)
  { name: "Arizona State University", tier: 4, satLow: 1100, satHigh: 1320 },
  { name: "University of Alabama", tier: 4, satLow: 1070, satHigh: 1370 },
  { name: "University of Toledo", tier: 4, satLow: 1050, satHigh: 1300 },
  { name: "Texas State University", tier: 4, satLow: 980, satHigh: 1180 },
  { name: "Pepperdine University", tier: 4, satLow: 1220, satHigh: 1420 },
];

// ---------------------------------------------------------------------------
// 4. 英国大学
// 出典: 各大学公式サイトの国際生(米国カリキュラム)向け出願要件
//   IB合計点: recognition.ibo.org / 各大学undergraduate admissionsページ(2026年7月時点)
//   AP要件: 各大学の米国カリキュラム出願ページ。UCL/KCLも代表的な組み合わせ例が公式に確認できた。
//   TOEFL: 各大学の英語要件ページ(0-120旧尺度。2026年1月の新尺度移行で今後変動の可能性あり)
//
// apPaths: 満たすべきAP試験の組み合わせ候補の配列(例: LSEは「5科目5点」または「3科目5点+2科目4点」の
//   いずれかで出願可能)。実際にはコース(専攻)により細かく異なるため、代表的な組み合わせに単純化している。
// ibMin: 公式に幅がある場合は範囲の目安値(コメントに範囲を明記)。
// satMin/actMin: 存在する大学のみSAT/ACTを評価パスとして使用する(Imperial/LSE/UCL/KCLはSAT/ACTを
//   合否基準として使用しないため、この2フィールドを持たない)。
// ---------------------------------------------------------------------------
const UK_UNIVERSITIES = [
  {
    name: "University of Oxford",
    satMin: 1460,
    actMin: 31,
    apPaths: [{ five: 3, four: 2 }], // 公式にはコースにより4-5科目grade4-5相当。代表的な組み合わせとして簡略化
    ibMin: 39, // 公式表記「38, 39 or 40点(コースによる)、core点込み、HLは6-7」の中央値
    toeflMin: 100, // Standard level 100点(Higher levelは110点)
    note: "コースにより基準が異なる。SAT/AP/IBのいずれかで評価。2026年1月以前受験のTOEFLのみ受付方針(新形式は審査中)。",
    noteEn:
      "Requirements vary by course. Evaluated via SAT, AP, or IB. Currently only accepts TOEFL taken before January 2026 (the new format is under review).",
  },
  {
    name: "University of Cambridge",
    satMin: 1460,
    actMin: 32,
    apPaths: [{ five: 5 }], // 公式: 5科目grade5が必須
    ibMin: 41, // 公式表記「40-42点」の中央値、HLは776以上が目安
    toeflCaution:
      "2026年1月以降の新形式TOEFLは受け付けない方針(IELTS等の代替が必要)。旧形式(0-120点)のスコアのみ有効な可能性があります。",
    toeflCautionEn:
      "Does not plan to accept the new-format TOEFL taken after January 2026 (an alternative such as IELTS is required). Only legacy-format (0-120) scores may be valid.",
    note: "AP試験5科目(grade5)とSAT/ACTの両方が必須(AND条件)。IBは40-42点が目安。",
    noteEn: "Requires both 5 AP exams (grade 5) AND an SAT/ACT score (AND condition). IB guideline is 40-42 points.",
  },
  {
    name: "University of Edinburgh",
    satMin: 1290,
    actMin: 25,
    ibMin: 38, // 公式に単一値なし。コース別の目安が37-43点とレンジが広いため中央値、精度は粗い
    note: "AP試験(3科目)も考慮されるが grade基準は非公表。IB基準はコースにより37〜43点と幅が広く目安精度は粗め。",
    noteEn:
      "AP exams (3 subjects) are also considered, but the required grade is not published. The IB requirement varies widely by course (37-43 points), so this estimate is rough.",
  },
  {
    name: "Imperial College London",
    apPaths: [{ five: 3, four: 1 }], // 公式: 3-4科目grade5が中心。代表的な組み合わせとして簡略化
    ibMin: 40, // 公式に「38-42点」とコース別の幅。中央値
    toeflMin: 92, // Standard level(Higher levelは100点)
    note: "SAT/ACTを合否基準として使用していません。AP試験またはIBスコアで評価します。",
    noteEn: "Does not use SAT/ACT as an admissions criterion. Evaluated via AP exam results or IB score.",
  },
  {
    name: "London School of Economics (LSE)",
    apPaths: [{ five: 5 }, { five: 3, four: 2 }], // 公式: 5科目grade5、または3科目grade5+2科目grade4
    ibMin: 38, // 公式に「37-39点」とコース別の幅。中央値
    toeflMin: 100, // プログラムにより107点を要求する場合あり
    note: "SAT/ACTを合否基準として使用していません。AP試験またはIBスコアで評価します。",
    noteEn: "Does not use SAT/ACT as an admissions criterion. Evaluated via AP exam results or IB score.",
  },
  {
    name: "University College London (UCL)",
    apPaths: [{ five: 4 }], // 公式equivalencyテーブルのAAA相当(4科目grade5)を代表値として使用
    ibMin: 39, // 公式標準オファー「39点、HL19点以上」
    toeflMin: 100, // 公式5段階レベルのLevel3相当。コースによりLevel4/5(109-110点)の場合あり
    note: "AP換算表(A*A*A=5科目grade5、AAA=4科目grade5等)より簡略化。コースにより要求レベルが上下します。",
    noteEn:
      "Simplified from UCL's official AP equivalency table (A*A*A = 5 AP subjects at grade 5, AAA = 4 AP subjects at grade 5, etc.). Requirements vary depending on course.",
  },
  {
    name: "King's College London",
    apPaths: [{ four: 3 }, { five: 5 }], // 公式コース例(Biology): ACT26+AP4,4,4 または AP5科目5点
    ibMin: 34, // 公式レンジ「29-40点」とコースにより非常に幅が広い。中央値、精度は粗め
    note: "コースにより基準が大きく異なり(IB29〜40点等)、ここでの数値は目安に過ぎません。志望コースごとに公式サイトで要確認。",
    noteEn:
      "Requirements vary greatly by course (IB 29-40 points, etc.); the figures here are only a rough guide. Please verify the official site for your specific course.",
  },
];

// ---------------------------------------------------------------------------
// 5. 日本の大学(学部単位、偏差値)
// 出典: 各種予備校系サイト(東進・河合塾系集計サイト)を横断した概算値(2025-2026年度目安)
// 偏差値は模試提供元により数値が異なるため、ここでは複数出典を突き合わせた概算値として扱う。
// 国際生・帰国生入試/英語トラック(ICU, AIU等)は一般入試とは別枠のことが多い点に注意。
//
// ibRouteNote: IB入試ルートが存在する場合の注記(日本の大学はIBの点数基準を公表しないケースが
//   ほとんどのため、判定には使わず「ルートの有無」のみを情報として表示する)。
// toeflMin: 英語トラック学部などで公式にTOEFL iBT最低点が公表されている場合のみ設定。
//   出典: ICU公式FAQ / AIU公式募集要項 / 上智大学FLA公式ページ(2026年7月時点)
// ---------------------------------------------------------------------------
const JP_UNIVERSITIES = [
  {
    name: "東京大学(文科一類)",
    nameEn: "University of Tokyo (Humanities I)",
    hensachi: 72,
    ibRouteNote: "学校推薦型選抜の出願資格の一部としてIBを考慮(点数基準は非公表)",
    ibRouteNoteEn:
      "Considers IB as part of the eligibility for the School-Recommended Admission route (no published score threshold).",
  },
  {
    name: "東京大学(文科二類・三類)",
    nameEn: "University of Tokyo (Humanities II/III)",
    hensachi: 71,
    ibRouteNote: "学校推薦型選抜の出願資格の一部としてIBを考慮(点数基準は非公表)",
    ibRouteNoteEn:
      "Considers IB as part of the eligibility for the School-Recommended Admission route (no published score threshold).",
  },
  {
    name: "京都大学(文系)",
    nameEn: "Kyoto University (Humanities)",
    hensachi: 68,
    ibRouteNote: "特色入試でIBを「顕著な活動実績」の一つとして考慮(点数基準は非公表、学部により異なる)",
    ibRouteNoteEn:
      'Considers IB as one form of "notable achievement" evidence for the Tokusei (Distinctive) Admission (no published score threshold; varies by faculty).',
  },
  { name: "一橋大学(社会学部)", nameEn: "Hitotsubashi University (Faculty of Social Sciences)", hensachi: 69 },
  { name: "一橋大学(商学部)", nameEn: "Hitotsubashi University (Faculty of Commerce and Management)", hensachi: 68 },
  {
    name: "早稲田大学(国際教養学部)",
    nameEn: "Waseda University (School of International Liberal Studies)",
    hensachi: 70,
    ibRouteNote: "AO入試でIB(予測/最終)を検定試験の一つとして受付(点数基準は非公表)",
    ibRouteNoteEn:
      "Accepts IB (predicted or final) as one of several standardized tests for AO admission (no official minimum score).",
  },
  { name: "早稲田大学(政治経済学部)", nameEn: "Waseda University (School of Political Science and Economics)", hensachi: 69 },
  { name: "早稲田大学(文学部)", nameEn: "Waseda University (School of Letters, Arts and Sciences)", hensachi: 69 },
  {
    name: "慶應義塾大学(総合政策・環境情報学部)",
    nameEn: "Keio University (Faculty of Policy Management / Environment and Information Studies, SFC)",
    hensachi: 70,
    ibRouteNote: "AO入試は原則書類・面接中心でIBスコアの必須提出はなし",
    ibRouteNoteEn: "AO admission is primarily based on documents and interview; no IB score is required.",
  },
  {
    name: "慶應義塾大学(法学部・商学部)",
    nameEn: "Keio University (Faculty of Law / Faculty of Business and Commerce)",
    hensachi: 66,
    ibRouteNote:
      "法学部のみ「IB入試」制度あり(2023年以降取得の最終スコアが必要、点数基準は非公表、募集約20名)。商学部には同制度なし。",
    ibRouteNoteEn:
      'Only the Faculty of Law has a dedicated "IB Admission" program (requires a final score obtained in 2023 or later; no published minimum; about 20 seats). The Faculty of Business and Commerce has no such program.',
  },
  { name: "上智大学(経済学部)", nameEn: "Sophia University (Faculty of Economics)", hensachi: 65 },
  { name: "上智大学(文学部)", nameEn: "Sophia University (Faculty of Letters)", hensachi: 63 },
  {
    name: "上智大学(国際教養学部)",
    nameEn: "Sophia University (Faculty of Liberal Arts, FLA)",
    hensachi: 64, // FLA単独の偏差値集計が乏しいため、系列学部との比較から概算(精度は粗め)
    toeflMin: 83, // 公募制推薦の公式最低点(IELTS6.5/TEAP340等でも可)
    ibRouteNote: "SAT/ACT/IB/GCE等いずれかとTOEFL/IELTS等の組み合わせで出願可(IB自体の点数基準は非公表)",
    ibRouteNoteEn:
      "Can apply using SAT/ACT/IB/GCE etc. combined with TOEFL/IELTS etc. (no published minimum score for IB itself).",
  },
  {
    name: "国際基督教大学(ICU)",
    nameEn: "International Christian University (ICU)",
    hensachi: 68,
    toeflMin: 79, // 公式FAQ記載の英語運用能力入学試験(ELBA)の最低点
    ibRouteNote: "複数の入試方式でIB取得者を受入(IB自体の点数基準は非公表、英語要件がゲートとなる)",
    ibRouteNoteEn:
      "Accepts IB holders through several admission routes (no published minimum score for IB itself; the English-proficiency requirement is the actual gate).",
  },
  {
    name: "国際教養大学(AIU)",
    nameEn: "Akita International University (AIU)",
    hensachi: 67,
    toeflMin: 61, // 総合選抜型入試(AO)の公式最低点(学校推薦型はより高いEiken等の基準)
    ibRouteNote: "総合選抜型入試でIB保持者を考慮(IB自体の点数基準は非公表)",
    ibRouteNoteEn: "Considers IB holders under the General Selection (AO) admission (no published minimum score for IB itself).",
  },
  { name: "明治大学(文系)", nameEn: "Meiji University (Humanities)", hensachi: 62 },
  { name: "立教大学(文系)", nameEn: "Rikkyo University (Humanities)", hensachi: 61 },
  { name: "青山学院大学(文系)", nameEn: "Aoyama Gakuin University (Humanities)", hensachi: 61 },
  { name: "中央大学(文系)", nameEn: "Chuo University (Humanities)", hensachi: 59 },
  { name: "法政大学(文系)", nameEn: "Hosei University (Humanities)", hensachi: 61 },
  { name: "同志社大学", nameEn: "Doshisha University", hensachi: 63 },
  { name: "関西学院大学", nameEn: "Kwansei Gakuin University", hensachi: 66 },
  { name: "立命館大学", nameEn: "Ritsumeikan University", hensachi: 63 },
  { name: "関西大学", nameEn: "Kansai University", hensachi: 63 },
];
