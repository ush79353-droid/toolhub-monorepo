import type { InformationRatioResult } from './types';

function formatPercent(value: number): string {
  const rounded = Number(value.toFixed(4));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

function formatRatio(value: number): string {
  const rounded = Number(value.toFixed(4));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/**
 * Portfolio Return (%) = ((Ending − Beginning) / Beginning) × 100
 * Information Ratio = (Portfolio Return − Benchmark Return) / Tracking Error
 * (all return/error terms in percent units; they cancel in the ratio)
 */
export function calculateInformationRatio(input: {
  beginningValue: number;
  endingValue: number;
  benchmarkReturnPercent: number;
  trackingErrorPercent: number;
}): InformationRatioResult | null {
  const {
    beginningValue,
    endingValue,
    benchmarkReturnPercent,
    trackingErrorPercent,
  } = input;

  if (
    ![beginningValue, endingValue, benchmarkReturnPercent, trackingErrorPercent].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (beginningValue <= 0) return null;
  if (trackingErrorPercent <= 0) return null;

  const portfolioReturnPercent =
    ((endingValue - beginningValue) / beginningValue) * 100;
  if (!Number.isFinite(portfolioReturnPercent)) return null;

  const informationRatio =
    (portfolioReturnPercent - benchmarkReturnPercent) / trackingErrorPercent;
  if (!Number.isFinite(informationRatio)) return null;

  return {
    portfolioReturnPercent,
    informationRatio,
    formattedPortfolioReturn: formatPercent(portfolioReturnPercent),
    formattedInformationRatio: formatRatio(informationRatio),
  };
}
