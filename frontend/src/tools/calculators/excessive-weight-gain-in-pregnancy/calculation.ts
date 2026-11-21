/**
 * Excessive Weight Gain in Pregnancy — thin engine wrapper (ADR-018).
 *
 * Numerical path is identical to Pregnancy Weight Gain Calculator via shared
 * `computeGestationalGainBounds` / `calculatePregnancyWeightGain`.
 * No current-weight input and no excess classification — guideline bands only.
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

/** Privacy-safe share: public page URL only (no measurements). */
export function shareExcessiveWeightGainText(pageUrl: string): string {
  return [
    'Excessive Weight Gain in Pregnancy | Omega Calculators',
    '',
    'IOM / CDC recommended pregnancy weight-gain ranges.',
    pageUrl,
  ].join('\n');
}
