import { ANNUAL_SALARY_CALCULATOR_HREF } from './types';

/**
 * Pure helper for the shareable historical notice.
 * No benefit math — HEALS / HEROES unemployment proposals were never enacted as claimable programs.
 */
export function buildHealsHeroesUnemploymentNoticeSummary(title: string): string {
  const toolTitle =
    title.trim() || 'Unemployment Benefit Calculator - HEALS Act vs. HEROES Act';
  return [
    `${toolTitle} — Omega Calculators`,
    'Historical notice only — HEALS and HEROES were 2020 legislative proposals, not active claim programs.',
    'The HEALS Act package (Senate Republican, July 2020) included the American Workers, Families, and Employers Assistance Act; the HEROES Act (H.R. 6800) was the House Democratic proposal.',
    'The proposals differed in their approaches to pandemic unemployment assistance. Neither should be treated as a current benefit you can claim (2026).',
    'Historical calculations associated with these proposals are no longer applicable to current claims.',
    `For yearly salary / hourly wage conversion, use the Annual Salary Calculator: ${ANNUAL_SALARY_CALCULATOR_HREF}`,
  ].join('\n');
}

export function getAnnualSalaryCalculatorHref(): typeof ANNUAL_SALARY_CALCULATOR_HREF {
  return ANNUAL_SALARY_CALCULATOR_HREF;
}
