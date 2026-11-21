import { LOAN_CALCULATOR_HREF } from './types';

/**
 * Pure helper for the shareable historical notice.
 * No benefit math — LWA FEMA supplemental payments are retired.
 *
 * Verified framing (FEMA / DOL UIPL guidance):
 * - Authorized by Aug 8, 2020 Presidential Memorandum (Stafford Act ONA), FEMA-administered
 * - Not an enacted “LWA Act”
 * - Bridge after CARES Act FPUC; payments ended by Dec 27, 2020 (earlier in some states)
 */
export function buildLwaUnemploymentNoticeSummary(title: string): string {
  const toolTitle =
    title.trim() ||
    'Unemployment Benefit Calculator - Lost Wages Assistance (LWA)';
  return [
    `${toolTitle} — Omega Calculators`,
    'Historical notice only — Lost Wages Assistance (LWA) is not available for current claims (2026).',
    'LWA was a temporary 2020 FEMA Other Needs Assistance program authorized by presidential memorandum under the Stafford Act — not an enacted “LWA Act.”',
    'It followed CARES Act Federal Pandemic Unemployment Compensation as a short-term supplemental bridge. FEMA guidance: lost-wages supplemental payments ended December 27, 2020.',
    'This page does not estimate weekly benefits, eligibility, or application deadlines.',
    `For monthly loan installment and total-interest estimates, use the Loan Calculator: ${LOAN_CALCULATOR_HREF}`,
  ].join('\n');
}

export function getLoanCalculatorHref(): typeof LOAN_CALCULATOR_HREF {
  return LOAN_CALCULATOR_HREF;
}
