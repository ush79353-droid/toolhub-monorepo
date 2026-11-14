import { calculateInvestment } from './calculation';
import type {
  InvestmentFieldErrors,
  InvestmentInput,
  InvestmentResult,
} from './types';

export interface InvestmentValidation {
  isValid: boolean;
  errors: InvestmentFieldErrors;
  result: InvestmentResult | null;
}

function parseNumber(raw: string): { value: number | null; blank: boolean; invalid: boolean } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateInvestmentInput(input: InvestmentInput): InvestmentValidation {
  const errors: InvestmentFieldErrors = {};

  const initial = parseNumber(input.initialInvestment);
  const rate = parseNumber(input.rateOfReturn);
  const years = parseNumber(input.termYears);
  const inflation = parseNumber(input.inflationRate);
  const contrib = parseNumber(input.contributionAmount);
  const needsContrib = input.contributionFrequency !== 'never';

  if (!initial.blank && (initial.invalid || initial.value === null)) {
    errors.initialInvestment = 'Enter a valid initial investment.';
  } else if (!initial.blank && initial.value !== null && initial.value < 0) {
    errors.initialInvestment = 'Initial investment cannot be negative.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.rateOfReturn = 'Enter a valid rate of return.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.rateOfReturn = 'Rate of return cannot be negative.';
  }

  if (!years.blank && (years.invalid || years.value === null)) {
    errors.termYears = 'Enter a valid term in years.';
  } else if (!years.blank && years.value !== null && !(years.value > 0)) {
    errors.termYears = 'Term must be greater than zero.';
  }

  if (!inflation.blank && (inflation.invalid || inflation.value === null)) {
    errors.inflationRate = 'Enter a valid inflation rate.';
  } else if (!inflation.blank && inflation.value !== null && inflation.value < 0) {
    errors.inflationRate = 'Inflation rate cannot be negative.';
  }

  if (needsContrib) {
    if (contrib.blank) {
      errors.contributionAmount = 'Enter a contribution amount.';
    } else if (contrib.invalid || contrib.value === null) {
      errors.contributionAmount = 'Enter a valid contribution amount.';
    } else if (contrib.value < 0) {
      errors.contributionAmount = 'Contribution amount cannot be negative.';
    }
  }

  const incomplete =
    initial.blank ||
    rate.blank ||
    years.blank ||
    inflation.blank ||
    (needsContrib && contrib.blank) ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateInvestment({
    initialInvestment: initial.value!,
    rateOfReturnPercent: rate.value!,
    termYears: years.value!,
    compounding: input.compounding,
    inflationRatePercent: inflation.value!,
    contributionFrequency: input.contributionFrequency,
    contributionAmount: needsContrib ? contrib.value! : 0,
    contributionTiming: input.contributionTiming,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
