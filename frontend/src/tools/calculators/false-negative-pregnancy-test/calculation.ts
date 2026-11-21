/**
 * What is a False Negative Pregnancy Test? — article embed of canonical timing.
 * Identical educational calendar math to Pregnancy Test / blood-pregnancy-hcg.
 */

export {
  calculateBloodPregnancyHcg as calculateFalseNegativePregnancyTest,
  formatDisplayDate,
  isValidIsoDate,
  parseCycleLength,
  suggestOvulationIso,
} from '../blood-pregnancy-hcg/calculation';

export const ARTICLE_THESIS =
  'A false-negative pregnancy test usually means testing too early or below the assay threshold—not proof you are not pregnant. Timing and sensitivity matter; this widget does not output a false-negative probability or a diagnosis.';

export function shareFalseNegativePregnancyTestText(pageUrl: string): string {
  return [
    'What is a False Negative Pregnancy Test? | Omega Calculators',
    '',
    ARTICLE_THESIS,
    pageUrl,
  ].join('\n');
}
