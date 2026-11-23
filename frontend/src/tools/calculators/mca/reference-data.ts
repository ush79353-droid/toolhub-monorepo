/**
 * Published MCA-PSV median references (cm/s) for MoM arithmetic.
 *
 * Singleton: Mari G et al. N Engl J Med 2000;342:9-14 medians (weeks 14–40),
 * as tabulated in Mari G. Ultrasound Obstet Gynecol 2005;25:323-330.
 *
 * Twin (MCDA): O'Gorman N et al. Ultrasound Obstet Gynecol 2009 — 50th centile
 * MCA-PSV for uncomplicated monochorionic diamniotic twins (weeks 15–37).
 * No twin-specific median is wired for week 14 or ≥38 in that cohort table.
 */

export type PregnancyPlurality = 'single' | 'twin';

/** Mari singleton median MCA-PSV (cm/s) by completed gestational week. */
export const MARI_SINGLETON_MEDIAN_CMS: Readonly<Record<number, number>> = {
  14: 19.3,
  15: 20.2,
  16: 21.1,
  17: 22.1,
  18: 23.2,
  19: 24.3,
  20: 25.5,
  21: 26.7,
  22: 27.9,
  23: 29.3,
  24: 30.7,
  25: 32.1,
  26: 33.6,
  27: 35.2,
  28: 36.9,
  29: 38.7,
  30: 40.5,
  31: 42.4,
  32: 44.4,
  33: 46.5,
  34: 48.7,
  35: 51.1,
  36: 53.5,
  37: 56.0,
  38: 58.7,
  39: 61.5,
  40: 64.4,
};

/** MCDA twin median (50th centile) MCA-PSV (cm/s), weeks 15–37. */
export const MCDA_TWIN_MEDIAN_CMS: Readonly<Record<number, number>> = {
  15: 25.4,
  16: 24.5,
  17: 24.01,
  18: 23.9,
  19: 24.14,
  20: 24.68,
  21: 25.52,
  22: 26.61,
  23: 27.94,
  24: 29.48,
  25: 31.21,
  26: 33.1,
  27: 35.11,
  28: 37.22,
  29: 39.39,
  30: 41.58,
  31: 43.74,
  32: 45.83,
  33: 47.8,
  34: 49.61,
  35: 51.2,
  36: 52.52,
  37: 53.52,
};

export const SINGLETON_GA_WEEKS = Object.keys(MARI_SINGLETON_MEDIAN_CMS)
  .map(Number)
  .sort((a, b) => a - b);

export const TWIN_GA_WEEKS = Object.keys(MCDA_TWIN_MEDIAN_CMS)
  .map(Number)
  .sort((a, b) => a - b);

export const GA_WEEK_OPTIONS = SINGLETON_GA_WEEKS;

export function medianPsvCmForWeek(
  plurality: PregnancyPlurality,
  gaWeeks: number,
): number | null {
  if (plurality === 'single') {
    return MARI_SINGLETON_MEDIAN_CMS[gaWeeks] ?? null;
  }
  return MCDA_TWIN_MEDIAN_CMS[gaWeeks] ?? null;
}

export const SOURCE_SINGLETON =
  'Mari G et al. N Engl J Med 2000;342:9-14 MCA-PSV medians (weeks 14–40), as tabulated in Mari G. Ultrasound Obstet Gynecol 2005;25:323-330.';

export const SOURCE_TWIN =
  "O'Gorman N et al. Ultrasound Obstet Gynecol 2009 — MCDA twin MCA-PSV 50th-centile references (weeks 15–37). Not discordance or chorionicity-specific rules.";