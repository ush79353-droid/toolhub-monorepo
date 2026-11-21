/**
 * Educational timing only — reuses urine-home pregnancy test calendar helpers.
 * Does not answer whether a positive test at “3 weeks pregnant” is possible as a yes/no clinical verdict.
 */

export {
  calculateUrineHomePregnancyTest as calculatePositivePregnancyTestAt3Weeks,
  formatDisplayDate,
  isValidIsoDate,
  parseCycleLength,
  suggestOvulationIso,
} from '../urine-home-pregnancy-test/calculation';

export { ARTICLE_THESIS } from './content';

export function sharePositivePregnancyTestAt3WeeksText(pageUrl: string): string {
  return [
    'Positive Pregnancy Test at 3 Weeks Pregnant: Possible or Not? | Omega Calculators',
    '',
    'Educational pregnancy-test timing (natural or IVF). Not a diagnosis.',
    pageUrl,
  ].join('\n');
}
