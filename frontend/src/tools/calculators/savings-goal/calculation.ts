import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  COMPOUNDING_OPTIONS,
  CONTRIBUTION_FREQUENCY_OPTIONS,
  type CompoundFrequency,
  type ContributionFrequency,
  type ContributionTiming,
} from './types';

export function compoundingPeriodsPerYear(
  compounding: CompoundFrequency
): number | null {
  const match = COMPOUNDING_OPTIONS.find((o) => o.value === compounding);
  return match ? match.periodsPerYear : null;
}

export function contributionPeriodsPerYear(
  frequency: ContributionFrequency
): number | null {
  const match = CONTRIBUTION_FREQUENCY_OPTIONS.find((o) => o.value === frequency);
  return match ? match.periodsPerYear : null;
}

export function contributionFrequencyLabel(
  frequency: ContributionFrequency
): string {
  const match = CONTRIBUTION_FREQUENCY_OPTIONS.find((o) => o.value === frequency);
  return match ? match.label.toLowerCase() : frequency;
}

/**
 * Effective interest rate per contribution period from a nominal annual rate
 * compounded `m` times per year, with `k` contributions per year:
 * i = (1 + r/m)^(m/k) − 1
 */
export function periodicRateFromCompounding(
  annualRate: number,
  compoundPeriodsPerYear: number,
  contribPeriodsPerYear: number
): number | null {
  if (
    ![annualRate, compoundPeriodsPerYear, contribPeriodsPerYear].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(compoundPeriodsPerYear > 0) || !(contribPeriodsPerYear > 0)) {
    return null;
  }
  if (annualRate === 0) return 0;
  const i =
    Math.pow(
      1 + annualRate / compoundPeriodsPerYear,
      compoundPeriodsPerYear / contribPeriodsPerYear
    ) - 1;
  return Number.isFinite(i) ? i : null;
}

/**
 * Convert an annual deposit growth rate into an equivalent per-period rate
 * for `k` contributions per year: (1 + g_a)^(1/k) − 1
 */
export function periodicGrowthFromAnnual(
  annualGrowth: number,
  contribPeriodsPerYear: number
): number | null {
  if (![annualGrowth, contribPeriodsPerYear].every(Number.isFinite)) {
    return null;
  }
  if (!(contribPeriodsPerYear > 0)) return null;
  if (annualGrowth === 0) return 0;
  const g = Math.pow(1 + annualGrowth, 1 / contribPeriodsPerYear) - 1;
  return Number.isFinite(g) ? g : null;
}

/**
 * Future-value factor for a unit growing annuity over `n` periods.
 * Ordinary (end): ((1+i)^n − (1+g)^n) / (i − g), or n·(1+i)^(n−1) when i = g.
 * Beginning: ordinary factor × (1+i).
 * When i = 0 and g = 0: factor = n (end) or n (beginning with i=0 still n).
 */
export function growingAnnuityFactor(input: {
  periods: number;
  periodicRate: number;
  periodicGrowth: number;
  timing: ContributionTiming;
}): number | null {
  const { periods: n, periodicRate: i, periodicGrowth: g, timing } = input;
  if (![n, i, g].every(Number.isFinite)) return null;
  if (!(n > 0) || !Number.isInteger(n)) return null;
  if (i <= -1 || g <= -1) return null;

  let ordinary: number;
  if (Math.abs(i - g) < 1e-15) {
    if (i === 0) {
      ordinary = n;
    } else {
      ordinary = n * Math.pow(1 + i, n - 1);
    }
  } else if (i === 0) {
    ordinary = (Math.pow(1 + g, n) - 1) / g;
  } else if (g === 0) {
    ordinary = (Math.pow(1 + i, n) - 1) / i;
  } else {
    ordinary = (Math.pow(1 + i, n) - Math.pow(1 + g, n)) / (i - g);
  }

  if (!Number.isFinite(ordinary) || ordinary <= 0) return null;

  const factor = timing === 'beginning' ? ordinary * (1 + i) : ordinary;
  return Number.isFinite(factor) && factor > 0 ? factor : null;
}

/** Sum of growing deposits for unit initial PMT: Σ (1+g)^t */
export function growingContributionSum(
  periods: number,
  periodicGrowth: number
): number | null {
  if (![periods, periodicGrowth].every(Number.isFinite)) return null;
  if (!(periods > 0) || !Number.isInteger(periods)) return null;
  if (periodicGrowth <= -1) return null;
  if (periodicGrowth === 0) return periods;
  const sum = (Math.pow(1 + periodicGrowth, periods) - 1) / periodicGrowth;
  return Number.isFinite(sum) && sum > 0 ? sum : null;
}

export function formatSavingsMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatMoneyWithCode(
  amount: number,
  currency: SupportedCurrency
): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${formatSavingsMoney(amount, currency)}`;
}

export interface SavingsGoalCalculationInput {
  goalAmount: number;
  startingSavings: number;
  years: number;
  annualRate: number;
  compoundPeriodsPerYear: number;
  contribPeriodsPerYear: number;
  inflationRate: number;
  /** Effective per-period deposit growth (already resolved; not both annual+periodic). */
  periodicGrowth: number;
  timing: ContributionTiming;
  currency: SupportedCurrency;
  contributionFrequency: ContributionFrequency;
}

export interface SavingsGoalCalculationOutput {
  requiredContribution: number;
  totalContributions: number;
  totalReturn: number;
  nominalTarget: number;
  startingFutureValue: number;
  years: number;
  periods: number;
  alreadyFunded: boolean;
  contributionFrequency: ContributionFrequency;
  contributionFrequencyLabel: string;
  currency: SupportedCurrency;
  formattedRequiredContribution: string;
  formattedTotalContributions: string;
  formattedTotalReturn: string;
  formattedNominalTarget: string;
  summary: string;
  breakdown: string;
}

/**
 * Solve for the initial periodic contribution needed to hit an inflation-adjusted
 * savings goal. Preserves full precision; round only via formatters.
 *
 * Assumptions:
 * - Goal is today’s purchasing power → Nominal Target = Goal × (1+f)^years
 * - Starting savings compounds at the contribution-period rate for `n` periods
 * - Deposits form a growing annuity (end or beginning)
 * - Total return = final balance − starting − total contributions
 */
export function calculateSavingsGoal(
  input: SavingsGoalCalculationInput
): SavingsGoalCalculationOutput | null {
  const {
    goalAmount,
    startingSavings,
    years,
    annualRate,
    compoundPeriodsPerYear: m,
    contribPeriodsPerYear: k,
    inflationRate,
    periodicGrowth: g,
    timing,
    currency,
    contributionFrequency,
  } = input;

  if (
    ![
      goalAmount,
      startingSavings,
      years,
      annualRate,
      m,
      k,
      inflationRate,
      g,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(goalAmount > 0) || startingSavings < 0) return null;
  if (!(years > 0) || annualRate < 0 || inflationRate < 0) return null;
  if (g < 0) return null;
  if (!(m > 0) || !(k > 0)) return null;

  const periods = Math.round(years * k);
  if (!(periods > 0)) return null;

  const i = periodicRateFromCompounding(annualRate, m, k);
  if (i === null || i <= -1) return null;

  const nominalTarget = goalAmount * Math.pow(1 + inflationRate, years);
  if (!Number.isFinite(nominalTarget) || !(nominalTarget > 0)) return null;

  const startingFutureValue = startingSavings * Math.pow(1 + i, periods);
  if (!Number.isFinite(startingFutureValue)) return null;

  const freqLabel = contributionFrequencyLabel(contributionFrequency);
  const money = (amount: number) => formatMoneyWithCode(amount, currency);

  if (startingFutureValue >= nominalTarget - 1e-9) {
    const finalBalance = startingFutureValue;
    const totalReturn = finalBalance - startingSavings;
    const summary =
      'Your starting savings already grow enough to reach (or exceed) your savings goal without additional contributions.';
    const breakdown = `Projected starting balance ${money(finalBalance)} covers the nominal target of ${money(nominalTarget)}, with a total return of ${money(totalReturn)}.`;
    return {
      requiredContribution: 0,
      totalContributions: 0,
      totalReturn,
      nominalTarget,
      startingFutureValue,
      years,
      periods,
      alreadyFunded: true,
      contributionFrequency,
      contributionFrequencyLabel: freqLabel,
      currency,
      formattedRequiredContribution: formatSavingsMoney(0, currency),
      formattedTotalContributions: formatSavingsMoney(0, currency),
      formattedTotalReturn: formatSavingsMoney(totalReturn, currency),
      formattedNominalTarget: formatSavingsMoney(nominalTarget, currency),
      summary,
      breakdown,
    };
  }

  const factor = growingAnnuityFactor({
    periods,
    periodicRate: i,
    periodicGrowth: g,
    timing,
  });
  if (factor === null) return null;

  const gap = nominalTarget - startingFutureValue;
  const requiredContribution = gap / factor;
  if (!Number.isFinite(requiredContribution) || requiredContribution < 0) {
    return null;
  }

  const unitSum = growingContributionSum(periods, g);
  if (unitSum === null) return null;
  const totalContributions = requiredContribution * unitSum;
  if (!Number.isFinite(totalContributions)) return null;

  const finalBalance = nominalTarget;
  const totalReturn = finalBalance - startingSavings - totalContributions;
  if (!Number.isFinite(totalReturn)) return null;

  const periodWord =
    contributionFrequency === 'annually'
      ? 'year'
      : contributionFrequency === 'semiannually'
        ? 'half-year'
        : contributionFrequency === 'quarterly'
          ? 'quarter'
          : contributionFrequency === 'monthly'
            ? 'month'
            : contributionFrequency === 'biweekly'
              ? 'biweekly period'
              : 'week';

  const adjective =
    contributionFrequency === 'annually'
      ? 'yearly'
      : contributionFrequency === 'semiannually'
        ? 'semiannual'
        : contributionFrequency === 'quarterly'
          ? 'quarterly'
          : contributionFrequency === 'monthly'
            ? 'monthly'
            : contributionFrequency === 'biweekly'
              ? 'biweekly'
              : 'weekly';

  const cleanSummary = `You need to put aside ${money(requiredContribution)} each ${periodWord} to reach your savings goal.`;
  const breakdown = `The sum of your ${adjective} savings will be ${money(totalContributions)}, with a total return of ${money(totalReturn)}.`;

  return {
    requiredContribution,
    totalContributions,
    totalReturn,
    nominalTarget,
    startingFutureValue,
    years,
    periods,
    alreadyFunded: false,
    contributionFrequency,
    contributionFrequencyLabel: freqLabel,
    currency,
    formattedRequiredContribution: formatSavingsMoney(
      requiredContribution,
      currency
    ),
    formattedTotalContributions: formatSavingsMoney(
      totalContributions,
      currency
    ),
    formattedTotalReturn: formatSavingsMoney(totalReturn, currency),
    formattedNominalTarget: formatSavingsMoney(nominalTarget, currency),
    summary: cleanSummary,
    breakdown,
  };
}
