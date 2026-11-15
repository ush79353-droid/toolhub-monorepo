import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import {
  COMPOUNDING_OPTIONS,
  CONTRIBUTION_FREQUENCY_OPTIONS,
  type AnnualBalancePoint,
  type CompoundFrequency,
  type ContributionFrequency,
  type ContributionTiming,
  type InvestmentResult,
} from './types';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function periodsPerYear(compounding: CompoundFrequency): number {
  return COMPOUNDING_OPTIONS.find((o) => o.value === compounding)?.periodsPerYear ?? 12;
}

export function contributionPeriodsPerYear(freq: ContributionFrequency): number {
  return CONTRIBUTION_FREQUENCY_OPTIONS.find((o) => o.value === freq)?.periodsPerYear ?? 0;
}

/**
 * Period-by-period compound growth with optional recurring contributions.
 * Tracks contributed principal separately from balance for the annual chart.
 */
export function simulateInvestment(params: {
  principal: number;
  rateDecimal: number;
  years: number;
  compoundN: number;
  contributionAmount: number;
  contributionN: number;
  timing: ContributionTiming;
}): {
  finalBalance: number;
  totalContributions: number;
  annualPoints: AnnualBalancePoint[];
} | null {
  const {
    principal,
    rateDecimal,
    years,
    compoundN,
    contributionAmount,
    contributionN,
    timing,
  } = params;

  if (
    ![principal, rateDecimal, years, compoundN, contributionAmount, contributionN].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (principal < 0 || years <= 0 || compoundN <= 0 || rateDecimal < 0) return null;
  if (contributionAmount < 0 || contributionN < 0) return null;

  const totalPeriods = Math.round(compoundN * years);
  if (!Number.isFinite(totalPeriods) || totalPeriods <= 0) return null;

  const ratePer = rateDecimal / compoundN;
  if (!Number.isFinite(ratePer) || 1 + ratePer <= 0) return null;

  const contribPerCompound =
    contributionN > 0 ? contributionAmount * (contributionN / compoundN) : 0;
  if (!Number.isFinite(contribPerCompound)) return null;

  let balance = principal;
  let contributed = principal;
  const annualPoints: AnnualBalancePoint[] = [
    {
      year: 0,
      principal: roundMoney(principal),
      interest: 0,
      totalBalance: roundMoney(principal),
    },
  ];

  for (let i = 1; i <= totalPeriods; i++) {
    if (timing === 'beginning' && contribPerCompound > 0) {
      balance += contribPerCompound;
      contributed += contribPerCompound;
    }
    balance *= 1 + ratePer;
    if (!Number.isFinite(balance)) return null;

    if (timing === 'end' && contribPerCompound > 0) {
      balance += contribPerCompound;
      contributed += contribPerCompound;
    }

    if (i % compoundN === 0 || i === totalPeriods) {
      const total = roundMoney(balance);
      const prin = roundMoney(contributed);
      const interest = roundMoney(total - prin);
      if (![total, prin, interest].every(Number.isFinite)) return null;
      const year = i === totalPeriods ? years : i / compoundN;
      // Avoid duplicate year markers when term ends exactly on a year boundary
      const last = annualPoints[annualPoints.length - 1];
      if (last && Math.abs(last.year - year) < 1e-9) {
        annualPoints[annualPoints.length - 1] = {
          year: roundMoney(year) === year ? year : Number(year.toFixed(4)),
          principal: prin,
          interest,
          totalBalance: total,
        };
      } else {
        annualPoints.push({
          year: Number.isInteger(year) ? year : Number(year.toFixed(4)),
          principal: prin,
          interest,
          totalBalance: total,
        });
      }
    }
  }

  return {
    finalBalance: roundMoney(balance),
    totalContributions: roundMoney(contributed),
    annualPoints,
  };
}

export function inflationAdjustedValue(
  finalBalance: number,
  inflationRateDecimal: number,
  years: number
): number | null {
  if (![finalBalance, inflationRateDecimal, years].every(Number.isFinite)) return null;
  if (years <= 0 || inflationRateDecimal < 0) return null;
  if (inflationRateDecimal === 0) return roundMoney(finalBalance);
  const denom = (1 + inflationRateDecimal) ** years;
  if (!Number.isFinite(denom) || denom === 0) return null;
  const value = finalBalance / denom;
  return Number.isFinite(value) ? roundMoney(value) : null;
}

export function calculateInvestment(input: {
  initialInvestment: number;
  rateOfReturnPercent: number;
  termYears: number;
  compounding: CompoundFrequency;
  inflationRatePercent: number;
  contributionFrequency: ContributionFrequency;
  contributionAmount: number;
  contributionTiming: ContributionTiming;
  currency: SupportedCurrency;
}): InvestmentResult | null {
  const {
    initialInvestment,
    rateOfReturnPercent,
    termYears,
    compounding,
    inflationRatePercent,
    contributionFrequency,
    contributionAmount,
    contributionTiming,
    currency,
  } = input;

  if (
    ![
      initialInvestment,
      rateOfReturnPercent,
      termYears,
      inflationRatePercent,
      contributionAmount,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (initialInvestment < 0 || rateOfReturnPercent < 0 || inflationRatePercent < 0) {
    return null;
  }
  if (termYears <= 0) return null;
  if (contributionAmount < 0) return null;

  const compoundN = periodsPerYear(compounding);
  const contributionN =
    contributionFrequency === 'never'
      ? 0
      : contributionPeriodsPerYear(contributionFrequency);
  const pmt = contributionFrequency === 'never' ? 0 : contributionAmount;

  const sim = simulateInvestment({
    principal: initialInvestment,
    rateDecimal: rateOfReturnPercent / 100,
    years: termYears,
    compoundN,
    contributionAmount: pmt,
    contributionN,
    timing: contributionTiming,
  });
  if (!sim) return null;

  const investmentReturn = roundMoney(sim.finalBalance - sim.totalContributions);
  if (!Number.isFinite(investmentReturn)) return null;

  const inflationAdjusted =
    inflationRatePercent > 0
      ? inflationAdjustedValue(sim.finalBalance, inflationRatePercent / 100, termYears)
      : null;

  return {
    finalBalance: sim.finalBalance,
    totalContributions: sim.totalContributions,
    investmentReturn,
    inflationAdjustedBalance: inflationAdjusted,
    inflationRatePercent,
    years: termYears,
    annualPoints: sim.annualPoints,
    currency,
    formattedFinalBalance: formatCurrencyValue(sim.finalBalance, currency),
    formattedReturn: formatCurrencyValue(investmentReturn, currency),
    formattedInflationAdjusted:
      inflationAdjusted === null
        ? null
        : formatCurrencyValue(inflationAdjusted, currency),
  };
}
