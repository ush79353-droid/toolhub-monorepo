import {
  COMPOUNDING_OPTIONS,
  type CompoundFrequency,
  type ContributionTiming,
} from './types';

export function formatUsdAmount(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function periodsPerYear(compounding: CompoundFrequency): number {
  return COMPOUNDING_OPTIONS.find((o) => o.value === compounding)?.periodsPerYear ?? 1;
}

/**
 * Compound growth with separate annual + monthly contributions.
 * After-tax rate = nominal × (1 − tax/100).
 * Monthly step rate = (1 + afterTax/m)^(m/12) − 1 for compounding frequency m.
 * Tracks initial vs contribution buckets for interest attribution.
 * Inflation-adjusted balance = FV / (1 + inflation)^yearsExact.
 */
export function calculateInterest(input: {
  initialInvestment: number;
  annualContribution: number;
  monthlyContribution: number;
  contributionTiming: ContributionTiming;
  interestRatePercent: number;
  compounding: CompoundFrequency;
  termYears: number;
  termMonths: number;
  taxRatePercent: number;
  inflationRatePercent: number;
}): {
  endingBalance: number;
  totalPrincipal: number;
  totalContributions: number;
  totalInterest: number;
  interestOnInitial: number;
  interestOnContributions: number;
  inflationAdjustedBalance: number;
  initialSharePercent: number;
  contributionsSharePercent: number;
  interestSharePercent: number;
} | null {
  const {
    initialInvestment,
    annualContribution,
    monthlyContribution,
    contributionTiming,
    interestRatePercent,
    compounding,
    termYears,
    termMonths,
    taxRatePercent,
    inflationRatePercent,
  } = input;

  if (
    ![
      initialInvestment,
      annualContribution,
      monthlyContribution,
      interestRatePercent,
      termYears,
      termMonths,
      taxRatePercent,
      inflationRatePercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (initialInvestment < 0) return null;
  if (annualContribution < 0 || monthlyContribution < 0) return null;
  if (interestRatePercent < 0 || taxRatePercent < 0 || taxRatePercent > 100) {
    return null;
  }
  if (inflationRatePercent < -100) return null;
  if (termYears < 0 || termMonths < 0) return null;
  if (!Number.isInteger(termYears) || !Number.isInteger(termMonths)) return null;
  if (termMonths > 11) return null;

  const yearsExact = termYears + termMonths / 12;
  if (!(yearsExact > 0)) return null;

  const m = periodsPerYear(compounding);
  const afterTaxRate = (interestRatePercent / 100) * (1 - taxRatePercent / 100);
  const monthlyRate = Math.pow(1 + afterTaxRate / m, m / 12) - 1;
  if (!Number.isFinite(monthlyRate) || 1 + monthlyRate <= 0) return null;

  const totalMonths = termYears * 12 + termMonths;
  if (!(totalMonths > 0)) return null;

  let initialPart = initialInvestment;
  let contribPart = 0;
  let totalContributions = 0;

  const addAnnual = () => {
    if (annualContribution > 0) {
      contribPart += annualContribution;
      totalContributions += annualContribution;
    }
  };
  const addMonthly = () => {
    if (monthlyContribution > 0) {
      contribPart += monthlyContribution;
      totalContributions += monthlyContribution;
    }
  };

  for (let month = 0; month < totalMonths; month += 1) {
    const yearStart = month % 12 === 0;
    const yearEnd = (month + 1) % 12 === 0;

    if (contributionTiming === 'beginning') {
      if (yearStart) addAnnual();
      addMonthly();
    }

    initialPart *= 1 + monthlyRate;
    contribPart *= 1 + monthlyRate;
    if (![initialPart, contribPart].every(Number.isFinite)) return null;

    if (contributionTiming === 'end') {
      addMonthly();
      if (yearEnd) addAnnual();
    }
  }

  const endingBalance = initialPart + contribPart;
  const totalPrincipal = initialInvestment + totalContributions;
  const interestOnInitial = initialPart - initialInvestment;
  const interestOnContributions = contribPart - totalContributions;
  const totalInterest = endingBalance - totalPrincipal;

  const inflationFactor = Math.pow(1 + inflationRatePercent / 100, yearsExact);
  if (!(inflationFactor > 0) || !Number.isFinite(inflationFactor)) return null;
  const inflationAdjustedBalance = endingBalance / inflationFactor;

  if (
    ![
      endingBalance,
      totalPrincipal,
      totalContributions,
      totalInterest,
      interestOnInitial,
      interestOnContributions,
      inflationAdjustedBalance,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  const chartTotal = endingBalance > 0 ? endingBalance : 1;
  return {
    endingBalance,
    totalPrincipal,
    totalContributions,
    totalInterest,
    interestOnInitial,
    interestOnContributions,
    inflationAdjustedBalance,
    initialSharePercent: (initialInvestment / chartTotal) * 100,
    contributionsSharePercent: (totalContributions / chartTotal) * 100,
    interestSharePercent: (Math.max(0, totalInterest) / chartTotal) * 100,
  };
}
