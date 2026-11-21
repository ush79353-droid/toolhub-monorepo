/**
 * Pregnancy Test Calculator — canonical timing engine wrapper (ADR-018).
 * Reuses Blood Pregnancy HCG educational calendar math for numerical identity.
 */

export {
  bloodDaysAfterOvulation,
  calculateBloodPregnancyHcg as calculatePregnancyTest,
  formatDisplayDate,
  isValidIsoDate,
  parseCycleLength,
  suggestOvulationIso,
  urineDaysAfterOvulation,
} from '../blood-pregnancy-hcg/calculation';

export function sharePregnancyTestText(pageUrl: string): string {
  return [
    'Pregnancy Test Calculator | Omega Calculators',
    '',
    'Educational timing for when to take a pregnancy test (natural or IVF).',
    pageUrl,
  ].join('\n');
}
