import { calculateInterest, formatUsdAmount } from './calculation';
import type {
  InterestFieldErrors,
  InterestInput,
  InterestResult,
} from './types';

export interface InterestValidation {
  isValid: boolean;
  errors: InterestFieldErrors;
  result: InterestResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateInterestInput(input: InterestInput): InterestValidation {
  const errors: InterestFieldErrors = {};

  const initial = parseNumber(input.initialInvestment);
  const annual = parseNumber(input.annualContribution);
  const monthly = parseNumber(input.monthlyContribution);
  const rate = parseNumber(input.interestRatePercent);
  const years = parseNumber(input.termYears);
  const months = parseNumber(input.termMonths);
  const tax = parseNumber(input.taxRatePercent);
  const inflation = parseNumber(input.inflationRatePercent);

  if (initial.blank) {
    errors.initialInvestment = 'Enter an initial investment.';
  } else if (initial.invalid || initial.value === null) {
    errors.initialInvestment = 'Enter a valid initial investment.';
  } else if (initial.value < 0) {
    errors.initialInvestment = 'Initial investment cannot be negative.';
  }

  if (annual.blank) {
    errors.annualContribution = 'Enter an annual contribution (0 allowed).';
  } else if (annual.invalid || annual.value === null) {
    errors.annualContribution = 'Enter a valid annual contribution.';
  } else if (annual.value < 0) {
    errors.annualContribution = 'Annual contribution cannot be negative.';
  }

  if (monthly.blank) {
    errors.monthlyContribution = 'Enter a monthly contribution (0 allowed).';
  } else if (monthly.invalid || monthly.value === null) {
    errors.monthlyContribution = 'Enter a valid monthly contribution.';
  } else if (monthly.value < 0) {
    errors.monthlyContribution = 'Monthly contribution cannot be negative.';
  }

  if (rate.blank) {
    errors.interestRatePercent = 'Enter an interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (!years.blank && (years.invalid || years.value === null)) {
    errors.termYears = 'Enter a valid number of years.';
  } else if (!years.blank && years.value !== null && years.value < 0) {
    errors.termYears = 'Years cannot be negative.';
  } else if (
    !years.blank &&
    years.value !== null &&
    !Number.isInteger(years.value)
  ) {
    errors.termYears = 'Years must be a whole number.';
  }

  if (!months.blank && (months.invalid || months.value === null)) {
    errors.termMonths = 'Enter a valid number of months.';
  } else if (
    !months.blank &&
    months.value !== null &&
    (!Number.isInteger(months.value) || months.value < 0 || months.value > 11)
  ) {
    errors.termMonths = 'Months must be a whole number from 0 to 11.';
  }

  const y = years.blank ? 0 : years.value!;
  const mo = months.blank ? 0 : months.value!;
  if (years.blank && (months.blank || mo === 0)) {
    errors.termYears = errors.termYears ?? 'Enter an investment length.';
  }

  if (tax.blank) {
    errors.taxRatePercent = 'Enter a tax rate (0 allowed).';
  } else if (tax.invalid || tax.value === null) {
    errors.taxRatePercent = 'Enter a valid tax rate.';
  } else if (tax.value < 0 || tax.value > 100) {
    errors.taxRatePercent = 'Tax rate must be between 0 and 100.';
  }

  if (inflation.blank) {
    errors.inflationRatePercent = 'Enter an inflation rate (0 allowed).';
  } else if (inflation.invalid || inflation.value === null) {
    errors.inflationRatePercent = 'Enter a valid inflation rate.';
  } else if (inflation.value < -100) {
    errors.inflationRatePercent = 'Inflation rate cannot be below -100%.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const canonical = calculateInterest({
    initialInvestment: initial.value!,
    annualContribution: annual.value!,
    monthlyContribution: monthly.value!,
    contributionTiming: input.contributionTiming,
    interestRatePercent: rate.value!,
    compounding: input.compounding,
    termYears: y,
    termMonths: mo,
    taxRatePercent: tax.value!,
    inflationRatePercent: inflation.value!,
  });

  if (!canonical) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: InterestResult = {
    ...canonical,
    formattedEndingBalance: formatUsdAmount(canonical.endingBalance),
    formattedTotalPrincipal: formatUsdAmount(canonical.totalPrincipal),
    formattedTotalContributions: formatUsdAmount(canonical.totalContributions),
    formattedTotalInterest: formatUsdAmount(canonical.totalInterest),
    formattedInterestOnInitial: formatUsdAmount(canonical.interestOnInitial),
    formattedInterestOnContributions: formatUsdAmount(
      canonical.interestOnContributions
    ),
    formattedInflationAdjustedBalance: formatUsdAmount(
      canonical.inflationAdjustedBalance
    ),
  };

  return { isValid: true, errors: {}, result };
}
