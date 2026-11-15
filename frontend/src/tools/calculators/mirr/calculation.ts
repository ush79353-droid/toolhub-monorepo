import type { MirrResult } from './types';

function formatMirrPercent(mirrPercent: number): string {
  const rounded = Number(mirrPercent.toFixed(4));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/**
 * MIRR = (FV_positive / |PV_negative|)^(1/n) − 1
 * CF0 = −initialInvestment; positives compound at reinvestment; negatives discount at financing.
 */
export function calculateMirr(input: {
  financingRatePercent: number;
  reinvestmentRatePercent: number;
  initialInvestment: number;
  cashFlows: number[];
}): MirrResult | null {
  const {
    financingRatePercent,
    reinvestmentRatePercent,
    initialInvestment,
    cashFlows,
  } = input;

  if (
    ![financingRatePercent, reinvestmentRatePercent, initialInvestment].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(initialInvestment > 0)) return null;
  if (!cashFlows.length || !cashFlows.every(Number.isFinite)) return null;

  const finance = financingRatePercent / 100;
  const reinvest = reinvestmentRatePercent / 100;
  if (!(1 + finance > 0) || !(1 + reinvest > 0)) return null;

  const n = cashFlows.length;
  const series = [-initialInvestment, ...cashFlows];

  let fvPositive = 0;
  let pvNegative = 0;

  for (let t = 0; t < series.length; t += 1) {
    const cf = series[t]!;
    if (cf > 0) {
      const grown = cf * (1 + reinvest) ** (n - t);
      if (!Number.isFinite(grown)) return null;
      fvPositive += grown;
    } else if (cf < 0) {
      const discounted = cf / (1 + finance) ** t;
      if (!Number.isFinite(discounted)) return null;
      pvNegative += discounted;
    }
  }

  if (!(fvPositive >= 0) || !Number.isFinite(fvPositive)) return null;
  if (!(pvNegative < 0) || !Number.isFinite(pvNegative)) return null;

  const ratio = fvPositive / Math.abs(pvNegative);
  if (!(ratio >= 0) || !Number.isFinite(ratio)) return null;

  const root = ratio ** (1 / n);
  if (!Number.isFinite(root) || !(root >= 0)) return null;

  const mirr = root - 1;
  if (!Number.isFinite(mirr)) return null;

  const mirrPercent = mirr * 100;
  if (!Number.isFinite(mirrPercent)) return null;

  return {
    mirrPercent,
    formattedMirr: formatMirrPercent(mirrPercent),
    yearsUsed: n,
  };
}
