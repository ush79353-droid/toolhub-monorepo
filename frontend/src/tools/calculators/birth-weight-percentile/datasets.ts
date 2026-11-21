/**
 * FMF birth-weight (BW) centiles from Nicolaides et al., Ultrasound Obstet Gynecol 2018.
 * Table 1 mid-week knots (gestational day = weeks×7+3, i.e. 20+3 … 41+3).
 * Uses BW columns only (not EFW). Unisex population reference.
 */
export interface FmfBwKnot {
  /** Absolute gestational day (weeks×7 + days), knot at +3 days. */
  readonly gestationalDay: number;
  readonly p5: number;
  readonly p10: number;
  readonly p25: number;
  readonly p50: number;
  readonly p75: number;
  readonly p95: number;
}

/** Chart legend percentiles (screenshot). */
export const CHART_PERCENTILES = [5, 10, 50, 75, 95] as const;
export type ChartPercentile = (typeof CHART_PERCENTILES)[number];

/** Band edges used for “between Xth and Yth” copy (includes 25th). */
export const BAND_PERCENTILES = [5, 10, 25, 50, 75, 95] as const;
export type BandPercentile = (typeof BAND_PERCENTILES)[number];

export const FMF_SOURCE =
  'Nicolaides KH, Wright D, Syngelaki A, Wright A, Akolekar R. Fetal Medicine Foundation fetal and neonatal population weight charts. Ultrasound Obstet Gynecol. 2018. doi:10.1002/uog.19073 (Table 1 birth-weight columns).';

export const FMF_MIN_DAY = 20 * 7; // 20+0
export const FMF_MAX_DAY = 41 * 7 + 6; // 41+6
export const FMF_FIRST_KNOT_DAY = 20 * 7 + 3;
export const FMF_LAST_KNOT_DAY = 41 * 7 + 3;

/**
 * Published BW grams at mid-week knots. Parsed from the continuous Table 1 row text
 * in the publisher PDF (95th column; HTML scrapes of the same table often OCR-corrupt 95th).
 */
export const FMF_BW_KNOTS: readonly FmfBwKnot[] = [
  { gestationalDay: 143, p5: 290, p10: 301, p25: 322, p50: 346, p75: 372, p95: 414 },
  { gestationalDay: 150, p5: 345, p10: 359, p25: 384, p50: 413, p75: 445, p95: 494 },
  { gestationalDay: 157, p5: 410, p10: 427, p25: 456, p50: 491, p75: 528, p95: 587 },
  { gestationalDay: 164, p5: 484, p10: 504, p25: 538, p50: 580, p75: 624, p95: 695 },
  { gestationalDay: 171, p5: 568, p10: 592, p25: 633, p50: 682, p75: 734, p95: 818 },
  { gestationalDay: 178, p5: 664, p10: 691, p25: 739, p50: 797, p75: 859, p95: 957 },
  { gestationalDay: 185, p5: 771, p10: 803, p25: 859, p50: 926, p75: 999, p95: 1113 },
  { gestationalDay: 192, p5: 889, p10: 926, p25: 992, p50: 1070, p75: 1154, p95: 1288 },
  { gestationalDay: 199, p5: 1020, p10: 1062, p25: 1138, p50: 1228, p75: 1326, p95: 1480 },
  { gestationalDay: 206, p5: 1161, p10: 1210, p25: 1297, p50: 1400, p75: 1512, p95: 1689 },
  { gestationalDay: 213, p5: 1313, p10: 1369, p25: 1468, p50: 1586, p75: 1713, p95: 1914 },
  { gestationalDay: 220, p5: 1475, p10: 1538, p25: 1649, p50: 1782, p75: 1926, p95: 2154 },
  { gestationalDay: 227, p5: 1643, p10: 1714, p25: 1839, p50: 1988, p75: 2150, p95: 2406 },
  { gestationalDay: 234, p5: 1817, p10: 1895, p25: 2034, p50: 2201, p75: 2381, p95: 2666 },
  { gestationalDay: 241, p5: 1993, p10: 2079, p25: 2233, p50: 2416, p75: 2615, p95: 2930 },
  { gestationalDay: 248, p5: 2167, p10: 2262, p25: 2430, p50: 2631, p75: 2849, p95: 3194 },
  { gestationalDay: 255, p5: 2336, p10: 2439, p25: 2621, p50: 2839, p75: 3076, p95: 3451 },
  { gestationalDay: 262, p5: 2496, p10: 2607, p25: 2802, p50: 3037, p75: 3292, p95: 3696 },
  { gestationalDay: 269, p5: 2642, p10: 2760, p25: 2968, p50: 3219, p75: 3490, p95: 3921 },
  { gestationalDay: 276, p5: 2770, p10: 2894, p25: 3114, p50: 3379, p75: 3665, p95: 4120 },
  { gestationalDay: 283, p5: 2876, p10: 3006, p25: 3236, p50: 3512, p75: 3811, p95: 4288 },
  { gestationalDay: 290, p5: 2956, p10: 3090, p25: 3328, p50: 3613, p75: 3923, p95: 4417 },
];
