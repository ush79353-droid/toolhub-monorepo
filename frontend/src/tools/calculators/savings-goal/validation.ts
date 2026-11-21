import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateSavingsGoal,
  compoundingPeriodsPerYear,
  contributionPeriodsPerYear,
  periodicGrowthFromAnnual,
} from './calculation';
import {
  COMPOUNDING_OPTIONS,
  CONTRIBUTION_FREQUENCY_OPTIONS,
  CONTRIBUTION_TIMING_OPTIONS,
  GOAL_HORIZON_OPTIONS,
  type CompoundFrequency,
  type ContributionFrequency,
  type ContributionTiming,
  type GoalHorizonMode,
  type SavingsGoalFieldErrors,
  type SavingsGoalInput,
  type SavingsGoalResult,
} from './types';

export interface SavingsGoalValidation {
  isValid: boolean;
  errors: SavingsGoalFieldErrors;
  result: SavingsGoalResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function isHorizonMode(value: string): value is GoalHorizonMode {
  return GOAL_HORIZON_OPTIONS.some((o) => o.value === value);
}

function isCompounding(value: string): value is CompoundFrequency {
  return COMPOUNDING_OPTIONS.some((o) => o.value === value);
}

function isContributionFrequency(
  value: string
): value is ContributionFrequency {
  return CONTRIBUTION_FREQUENCY_OPTIONS.some((o) => o.value === value);
}

function isTiming(value: string): value is ContributionTiming {
  return CONTRIBUTION_TIMING_OPTIONS.some((o) => o.value === value);
}

function convertMoney(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

/**
 * Validates inputs, normalizes starting savings into the goal currency, resolves
 * a single deposit-growth rate (annual XOR periodic), and solves for the required
 * contribution. Ages, years, and percentages are never FX-converted.
 */
export function validateSavingsGoalInput(
  input: SavingsGoalInput,
  rates?: CurrencyRatesSnapshot | null
): SavingsGoalValidation {
  const errors: SavingsGoalFieldErrors = {};

  const goal = parseNumber(input.goalAmount);
  const starting = parseNumber(input.startingSavings);
  const currentAge = parseNumber(input.currentAge);
  const targetAge = parseNumber(input.targetAge);
  const yearsUntil = parseNumber(input.yearsUntilGoal);
  const rate = parseNumber(input.interestRatePercent);
  const inflation = parseNumber(input.inflationRatePercent);
  const annualGrowth = parseNumber(input.annualGrowthPercent);
  const periodicGrowth = parseNumber(input.periodicGrowthPercent);

  if (!goal.blank && (goal.invalid || goal.value === null)) {
    errors.goalAmount = 'Enter a valid savings goal.';
  } else if (!goal.blank && goal.value !== null && !(goal.value > 0)) {
    errors.goalAmount = 'Savings goal must be greater than zero.';
  }

  if (!starting.blank && (starting.invalid || starting.value === null)) {
    errors.startingSavings = 'Enter a valid starting savings amount.';
  } else if (!starting.blank && starting.value !== null && starting.value < 0) {
    errors.startingSavings = 'Starting savings cannot be negative.';
  }

  if (!isHorizonMode(input.horizonMode)) {
    errors.form = 'Select how you want to reach the goal.';
  }

  let years: number | null = null;
  if (input.horizonMode === 'at_age') {
    if (!currentAge.blank && (currentAge.invalid || currentAge.value === null)) {
      errors.currentAge = 'Enter a valid current age.';
    } else if (
      !currentAge.blank &&
      currentAge.value !== null &&
      !(currentAge.value >= 0 && currentAge.value <= 120)
    ) {
      errors.currentAge = 'Current age must be between 0 and 120.';
    }

    if (!targetAge.blank && (targetAge.invalid || targetAge.value === null)) {
      errors.targetAge = 'Enter a valid target age.';
    } else if (
      !targetAge.blank &&
      targetAge.value !== null &&
      !(targetAge.value >= 0 && targetAge.value <= 120)
    ) {
      errors.targetAge = 'Target age must be between 0 and 120.';
    }

    if (
      !currentAge.blank &&
      !targetAge.blank &&
      currentAge.value !== null &&
      targetAge.value !== null &&
      !errors.currentAge &&
      !errors.targetAge
    ) {
      if (!(targetAge.value > currentAge.value)) {
        errors.targetAge = 'Target age must be greater than your current age.';
      } else {
        years = targetAge.value - currentAge.value;
      }
    }
  } else {
    if (!yearsUntil.blank && (yearsUntil.invalid || yearsUntil.value === null)) {
      errors.yearsUntilGoal = 'Enter a valid number of years.';
    } else if (
      !yearsUntil.blank &&
      yearsUntil.value !== null &&
      !(yearsUntil.value > 0 && yearsUntil.value <= 100)
    ) {
      errors.yearsUntilGoal = 'Years until goal must be greater than 0 and at most 100.';
    } else if (!yearsUntil.blank && yearsUntil.value !== null) {
      years = yearsUntil.value;
    }
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  } else if (!rate.blank && rate.value !== null && rate.value > 100) {
    errors.interestRatePercent = 'Interest rate looks unrealistically high.';
  }

  if (!isCompounding(input.compounding)) {
    errors.compounding = 'Select a valid compounding method.';
  }

  if (!inflation.blank && (inflation.invalid || inflation.value === null)) {
    errors.inflationRatePercent = 'Enter a valid inflation rate.';
  } else if (!inflation.blank && inflation.value !== null && inflation.value < 0) {
    errors.inflationRatePercent = 'Inflation rate cannot be negative.';
  } else if (
    !inflation.blank &&
    inflation.value !== null &&
    inflation.value > 100
  ) {
    errors.inflationRatePercent = 'Inflation rate looks unrealistically high.';
  }

  if (!isContributionFrequency(input.contributionFrequency)) {
    errors.contributionFrequency = 'Select how often you will contribute.';
  }

  if (!isTiming(input.contributionTiming)) {
    errors.contributionTiming = 'Select when contributions are made.';
  }

  if (!annualGrowth.blank && (annualGrowth.invalid || annualGrowth.value === null)) {
    errors.annualGrowthPercent = 'Enter a valid annual growth rate.';
  } else if (
    !annualGrowth.blank &&
    annualGrowth.value !== null &&
    annualGrowth.value < 0
  ) {
    errors.annualGrowthPercent = 'Annual growth rate cannot be negative.';
  }

  if (
    !periodicGrowth.blank &&
    (periodicGrowth.invalid || periodicGrowth.value === null)
  ) {
    errors.periodicGrowthPercent = 'Enter a valid periodic growth rate.';
  } else if (
    !periodicGrowth.blank &&
    periodicGrowth.value !== null &&
    periodicGrowth.value < 0
  ) {
    errors.periodicGrowthPercent = 'Periodic growth rate cannot be negative.';
  }

  const annualG = annualGrowth.blank ? 0 : annualGrowth.value ?? 0;
  const periodicG = periodicGrowth.blank ? 0 : periodicGrowth.value ?? 0;
  if (
    !annualGrowth.blank &&
    !periodicGrowth.blank &&
    annualG > 0 &&
    periodicG > 0 &&
    !errors.annualGrowthPercent &&
    !errors.periodicGrowthPercent
  ) {
    errors.periodicGrowthPercent =
      'Use either annual or periodic growth, not both (avoids double-counting).';
  }

  const incomplete =
    goal.blank ||
    starting.blank ||
    rate.blank ||
    inflation.blank ||
    annualGrowth.blank ||
    periodicGrowth.blank ||
    years === null ||
    (input.horizonMode === 'at_age' &&
      (currentAge.blank || targetAge.blank)) ||
    (input.horizonMode === 'in_years' && yearsUntil.blank) ||
    Boolean(errors.goalAmount) ||
    Boolean(errors.startingSavings) ||
    Boolean(errors.currentAge) ||
    Boolean(errors.targetAge) ||
    Boolean(errors.yearsUntilGoal) ||
    Boolean(errors.interestRatePercent) ||
    Boolean(errors.compounding) ||
    Boolean(errors.inflationRatePercent) ||
    Boolean(errors.contributionFrequency) ||
    Boolean(errors.contributionTiming) ||
    Boolean(errors.annualGrowthPercent) ||
    Boolean(errors.periodicGrowthPercent) ||
    Boolean(errors.form);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const m = compoundingPeriodsPerYear(input.compounding);
  const k = contributionPeriodsPerYear(input.contributionFrequency);
  if (m === null) {
    errors.compounding = 'Select a valid compounding method.';
    return { isValid: false, errors, result: null };
  }
  if (k === null) {
    errors.contributionFrequency = 'Select how often you will contribute.';
    return { isValid: false, errors, result: null };
  }

  const startingInGoal = convertMoney(
    starting.value!,
    input.startingCurrency,
    input.goalCurrency,
    rates
  );
  if (!startingInGoal.ok) {
    errors.form = startingInGoal.message;
    return { isValid: false, errors, result: null };
  }

  let resolvedGrowth = 0;
  if (periodicG > 0) {
    resolvedGrowth = periodicG / 100;
  } else if (annualG > 0) {
    const converted = periodicGrowthFromAnnual(annualG / 100, k);
    if (converted === null) {
      errors.annualGrowthPercent = 'Could not convert annual growth to a periodic rate.';
      return { isValid: false, errors, result: null };
    }
    resolvedGrowth = converted;
  }

  const computed = calculateSavingsGoal({
    goalAmount: goal.value!,
    startingSavings: startingInGoal.amount,
    years: years!,
    annualRate: rate.value! / 100,
    compoundPeriodsPerYear: m,
    contribPeriodsPerYear: k,
    inflationRate: inflation.value! / 100,
    periodicGrowth: resolvedGrowth,
    timing: input.contributionTiming,
    currency: input.goalCurrency,
    contributionFrequency: input.contributionFrequency,
  });

  if (computed === null) {
    errors.form =
      'This combination does not produce a reachable savings plan. Check rates, growth, and the time horizon.';
    return { isValid: false, errors, result: null };
  }

  const result: SavingsGoalResult = {
    requiredContribution: computed.requiredContribution,
    totalContributions: computed.totalContributions,
    totalReturn: computed.totalReturn,
    nominalTarget: computed.nominalTarget,
    startingFutureValue: computed.startingFutureValue,
    years: computed.years,
    periods: computed.periods,
    contributionFrequency: computed.contributionFrequency,
    contributionFrequencyLabel: computed.contributionFrequencyLabel,
    currency: computed.currency,
    formattedRequiredContribution: computed.formattedRequiredContribution,
    formattedTotalContributions: computed.formattedTotalContributions,
    formattedTotalReturn: computed.formattedTotalReturn,
    formattedNominalTarget: computed.formattedNominalTarget,
    alreadyFunded: computed.alreadyFunded,
    summary: computed.summary,
    breakdown: computed.breakdown,
  };

  return { isValid: true, errors, result };
}
