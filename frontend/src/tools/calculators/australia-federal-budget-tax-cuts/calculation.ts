import { GST_CALCULATOR_HREF } from './types';

/**
 * Pure helper for the shareable unavailable notice.
 * No income-tax math — Budget 2020/21 cuts are not modeled here.
 */
export function buildAustraliaTaxCutsNoticeSummary(title: string): string {
  const toolTitle =
    title.trim() ||
    'Income Tax Cuts Calculator - Australia Federal Budget 2020/21';
  return [
    `${toolTitle} | Omega Calculators`,
    'This calculator is unavailable at this time.',
    'Historical notice only; does not calculate current Australian income tax and does not invent 2020/21 brackets, refunds, or eligibility rules.',
    'Australia Federal Budget 2020/21 announced personal income tax measures; Budget proposals are distinct from enacted legislation administered by the ATO.',
    `Alternatively, see the GST Calculator: ${GST_CALCULATOR_HREF}`,
  ].join('\n');
}

export function getGstCalculatorHref(): typeof GST_CALCULATOR_HREF {
  return GST_CALCULATOR_HREF;
}
