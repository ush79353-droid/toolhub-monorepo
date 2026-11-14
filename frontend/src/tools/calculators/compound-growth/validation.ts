import { calculateCompoundGrowth } from './calculation';
import type {
  CompoundGrowthFieldErrors,
  CompoundGrowthInput,
  CompoundGrowthResult,
} from './types';

function parseField(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed.replace(/,/g, ''));
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateCompoundGrowthInput(input: CompoundGrowthInput): {
  isValid: boolean;
  errors: CompoundGrowthFieldErrors;
  result: CompoundGrowthResult | null;
} {
  const errors: CompoundGrowthFieldErrors = {};

  const initialDeposit = parseField(input.initialDeposit);
  const interestRate = parseField(input.interestRate);
  const termYears = parseField(input.termYears);
  const termMonths = parseField(input.termMonths);
  const contributionAmount = parseField(input.contributionAmount);
  const annualGrowth = parseField(input.annualContributionGrowth);
  const periodicGrowth = parseField(input.periodicContributionGrowth);

  if (
    initialDeposit === null ||
    interestRate === null ||
    termYears === null ||
    termMonths === null ||
    contributionAmount === null ||
    annualGrowth === null ||
    periodicGrowth === null
  ) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(initialDeposit) || initialDeposit < 0) {
    errors.initialDeposit = 'Enter a valid nonnegative initial deposit';
  }
  if (Number.isNaN(interestRate) || interestRate < -100) {
    errors.interestRate = 'Enter a valid interest rate (not below -100%)';
  }
  if (Number.isNaN(termYears) || termYears < 0 || !Number.isInteger(termYears)) {
    errors.termYears = 'Enter whole years (0 or more)';
  }
  if (Number.isNaN(termMonths) || termMonths < 0 || termMonths >= 12 || !Number.isInteger(termMonths)) {
    errors.termMonths = 'Enter months from 0 to 11';
  }
  if (Number.isNaN(contributionAmount) || contributionAmount < 0) {
    errors.contributionAmount = 'Enter a valid nonnegative contribution';
  }
  if (Number.isNaN(annualGrowth) || annualGrowth < -100) {
    errors.annualContributionGrowth = 'Enter a valid annual growth rate';
  }
  if (Number.isNaN(periodicGrowth) || periodicGrowth < -100) {
    errors.periodicContributionGrowth = 'Enter a valid periodic growth rate';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (termYears === 0 && termMonths === 0 && initialDeposit === 0 && contributionAmount === 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateCompoundGrowth({
    initialDeposit,
    interestRatePercent: interestRate,
    termYears,
    termMonths,
    compoundFrequency: input.compoundFrequency,
    contributionFrequency: input.contributionFrequency,
    contributionAmount,
    contributionTiming: input.contributionTiming,
    annualContributionGrowthPercent: annualGrowth,
    periodicContributionGrowthPercent: periodicGrowth,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'Unable to calculate with these inputs';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
