import type { ConversionRateInput, ConversionRateResult } from './types';

function formatPercent(rate: number): string {
  if (!Number.isFinite(rate)) return '';
  const rounded = Math.round(rate * 10000) / 10000;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

/** Conversion rate (%) = (conversions / clicks-or-visits) × 100 */
export function calculateConversionRate(
  input: ConversionRateInput
): ConversionRateResult | null {
  const { mode, totalConversions, totalClicksOrVisits } = input;
  if (!Number.isFinite(totalConversions) || !Number.isFinite(totalClicksOrVisits)) return null;
  if (totalConversions < 0 || totalClicksOrVisits <= 0) return null;
  if (totalConversions > totalClicksOrVisits) return null;

  const conversionRatePercent = (totalConversions / totalClicksOrVisits) * 100;
  if (!Number.isFinite(conversionRatePercent)) return null;

  return {
    mode,
    totalConversions,
    totalClicksOrVisits,
    conversionRatePercent,
    rateDisplay: formatPercent(conversionRatePercent),
  };
}
