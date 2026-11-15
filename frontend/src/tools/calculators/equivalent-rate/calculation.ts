import type { EquivalentRateResult } from './types';

function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
}

/**
 * r = Nominal / 100
 * m = original compounding frequency
 * n = new compounding frequency
 * AER = (1 + r/m)^m − 1
 * Equivalent Rate = n × [(1 + AER)^(1/n) − 1]
 */
export function calculateEquivalentRate(input: {
  nominalInterestRatePercent: number;
  compoundingFrequency: number;
  newCompoundingFrequency: number;
}): EquivalentRateResult | null {
  const {
    nominalInterestRatePercent,
    compoundingFrequency: m,
    newCompoundingFrequency: n,
  } = input;

  if (![nominalInterestRatePercent, m, n].every(Number.isFinite)) return null;
  if (!(m > 0) || !(n > 0)) return null;

  const r = nominalInterestRatePercent / 100;
  const periodicFactor = 1 + r / m;
  if (!(periodicFactor > 0) || !Number.isFinite(periodicFactor)) return null;

  const aer = Math.expm1(m * Math.log1p(r / m));
  if (!Number.isFinite(aer) || aer <= -1) return null;

  const eqFactor = (1 + aer) ** (1 / n);
  if (!Number.isFinite(eqFactor) || !(eqFactor > 0)) return null;

  const equivalentRate = n * (eqFactor - 1);
  if (!Number.isFinite(equivalentRate)) return null;

  const equivalentRatePercent = equivalentRate * 100;
  const aerPercent = aer * 100;
  if (![equivalentRatePercent, aerPercent].every(Number.isFinite)) return null;

  return {
    equivalentRatePercent,
    aerPercent,
    formattedEquivalentRate: formatPercent(equivalentRatePercent),
    formattedAer: formatPercent(aerPercent),
  };
}
