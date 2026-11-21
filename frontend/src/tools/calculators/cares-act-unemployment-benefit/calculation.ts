import { UNEMPLOYMENT_CALCULATOR_HREF } from './types';

/**
 * Pure helper for the shareable historical notice.
 * No benefit math — CARES Act FPUC / pandemic unemployment supplements are retired.
 */
export function buildCaresActUnemploymentNoticeSummary(title: string): string {
  const toolTitle = title.trim() || 'Unemployment Benefit Calculator - CARES Act';
  return [
    `${toolTitle} | Omega Calculators`,
    'Historical notice only; CARES Act pandemic unemployment supplements are not available for current claims (2026).',
    'The Coronavirus Aid, Relief, and Economic Security (CARES) Act (Pub. L. 116-136) provided temporary pandemic unemployment relief, including Federal Pandemic Unemployment Compensation.',
    'Those historical benefit calculators are no longer valid for new claims.',
    `For unemployment-rate calculations, use the Unemployment Calculator: ${UNEMPLOYMENT_CALCULATOR_HREF}`,
  ].join('\n');
}

export function getUnemploymentCalculatorHref(): typeof UNEMPLOYMENT_CALCULATOR_HREF {
  return UNEMPLOYMENT_CALCULATOR_HREF;
}
