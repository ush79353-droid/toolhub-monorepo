/**
 * Is BMI a Weight Gain Indicator in Pregnancy? — thin engine wrapper (ADR-018).
 *
 * Numerical path is identical to Pregnancy Weight Gain Calculator via shared
 * `computeGestationalGainBounds` / `calculatePregnancyWeightGain`.
 * Pre-pregnancy BMI selects the IOM guideline band; it does not measure
 * gestational weight gain itself (CDC maternal weight-gain overview).
 */

export {
  calculateBmi,
  calculatePregnancyWeightGain,
  classifyPrepregnancyBmi,
  computeGestationalGainBounds,
  DISCLAIMER,
  formatBmi,
  formatWeightDisplay,
  heightToMeters,
  kgToWeight,
  metersToHeight,
  parseNumber,
  singletonGainAtWeek,
  SOURCE_LABEL,
  TERM_WEEK,
  twinGainAtWeek,
  weightToKg,
} from '../pregnancy-weight-gain/calculation';

export const ARTICLE_THESIS =
  'Pre-pregnancy BMI is used to choose IOM gestational weight-gain guideline bands. BMI itself does not measure how much weight you gain during pregnancy.';

/** Privacy-safe share: public page URL only. */
export function shareIsBmiPregnancyWeightIndicatorText(pageUrl: string): string {
  return [
    'Is BMI a Weight Gain Indicator in Pregnancy? | Omega Calculators',
    '',
    ARTICLE_THESIS,
    pageUrl,
  ].join('\n');
}
