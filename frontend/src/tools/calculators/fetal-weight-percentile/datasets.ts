/**
 * FMF estimated fetal weight (EFW) centiles — Nicolaides et al., UOG 2018 Table 1.
 * Used for percentile bands/charts (not birth-weight columns). Unisex.
 */
export interface FmfEfwKnot {
  readonly gestationalDay: number;
  readonly p3: number;
  readonly p10: number;
  readonly p25: number;
  readonly p50: number;
  readonly p75: number;
  readonly p90: number;
  readonly p97: number;
}

/** Chart legend order (screenshot uses 2.5/97.5; published table has 3rd/97th). */
export const CHART_PERCENTILES = [3, 10, 25, 50, 75, 90, 97] as const;
export type ChartPercentile = (typeof CHART_PERCENTILES)[number];

export const BAND_PERCENTILES = CHART_PERCENTILES;
export type BandPercentile = ChartPercentile;

export const FMF_SOURCE =
  'Nicolaides KH et al. Fetal Medicine Foundation fetal and neonatal population weight charts. Ultrasound Obstet Gynecol. 2018. doi:10.1002/uog.19073 (Table 1 EFW columns). Chart labels 3rd/97th correspond to screenshot 2.5th/97.5th bands.';

export const HADLOCK_SOURCE =
  'Hadlock FP, Harrist RB, Sharman RS, Deter RL, Park SK. Estimation of fetal weight with the use of head, body, and femur measurements — a prospective study. Am J Obstet Gynecol. 1985;151:333-337. Four-parameter model (HC, AC, FL, BPD) in centimeters.';

export const FMF_MIN_DAY = 20 * 7;
export const FMF_MAX_DAY = 41 * 7 + 6;

/** Mid-week knots (day = weeks×7+3). */
export const FMF_EFW_KNOTS: readonly FmfEfwKnot[] = [
  { gestationalDay: 143, p3: 300, p10: 314, p25: 329, p50: 346, p75: 364, p90: 381, p97: 399 },
  { gestationalDay: 150, p3: 358, p10: 375, p25: 392, p50: 413, p75: 435, p90: 455, p97: 477 },
  { gestationalDay: 157, p3: 424, p10: 444, p25: 466, p50: 491, p75: 517, p90: 542, p97: 567 },
  { gestationalDay: 164, p3: 501, p10: 525, p25: 550, p50: 580, p75: 611, p90: 641, p97: 671 },
  { gestationalDay: 171, p3: 588, p10: 616, p25: 646, p50: 682, p75: 719, p90: 754, p97: 791 },
  { gestationalDay: 178, p3: 686, p10: 719, p25: 755, p50: 797, p75: 841, p90: 883, p97: 926 },
  { gestationalDay: 185, p3: 796, p10: 835, p25: 877, p50: 926, p75: 978, p90: 1027, p97: 1078 },
  { gestationalDay: 192, p3: 918, p10: 964, p25: 1013, p50: 1070, p75: 1131, p90: 1188, p97: 1248 },
  { gestationalDay: 199, p3: 1052, p10: 1105, p25: 1162, p50: 1228, p75: 1299, p90: 1365, p97: 1435 },
  { gestationalDay: 206, p3: 1197, p10: 1258, p25: 1324, p50: 1400, p75: 1481, p90: 1558, p97: 1638 },
  { gestationalDay: 213, p3: 1353, p10: 1423, p25: 1498, p50: 1586, p75: 1678, p90: 1767, p97: 1858 },
  { gestationalDay: 220, p3: 1518, p10: 1598, p25: 1683, p50: 1782, p75: 1888, p90: 1988, p97: 2092 },
  { gestationalDay: 227, p3: 1691, p10: 1780, p25: 1876, p50: 1988, p75: 2107, p90: 2221, p97: 2338 },
  { gestationalDay: 234, p3: 1868, p10: 1968, p25: 2075, p50: 2201, p75: 2334, p90: 2461, p97: 2593 },
  { gestationalDay: 241, p3: 2048, p10: 2159, p25: 2277, p50: 2416, p75: 2564, p90: 2705, p97: 2851 },
  { gestationalDay: 248, p3: 2226, p10: 2347, p25: 2478, p50: 2631, p75: 2793, p90: 2948, p97: 3110 },
  { gestationalDay: 255, p3: 2398, p10: 2531, p25: 2672, p50: 2839, p75: 3017, p90: 3186, p97: 3362 },
  { gestationalDay: 262, p3: 2561, p10: 2704, p25: 2857, p50: 3037, p75: 3229, p90: 3412, p97: 3602 },
  { gestationalDay: 269, p3: 2709, p10: 2862, p25: 3026, p50: 3219, p75: 3424, p90: 3620, p97: 3824 },
  { gestationalDay: 276, p3: 2839, p10: 3001, p25: 3174, p50: 3379, p75: 3596, p90: 3804, p97: 4021 },
  { gestationalDay: 283, p3: 2945, p10: 3115, p25: 3297, p50: 3512, p75: 3740, p90: 3959, p97: 4187 },
  { gestationalDay: 290, p3: 3025, p10: 3201, p25: 3390, p50: 3613, p75: 3851, p90: 4078, p97: 4315 },
];
