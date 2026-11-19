import { calculateCarAffordability } from './calculation';
import type {
  CarAffordabilityFieldErrors,
  CarAffordabilityInput,
  CarAffordabilityResult,
} from './types';

function parseRequiredNonNeg(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

function parseOptionalNonNeg(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

function parseNonNegInt(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || !Number.isInteger(num)) return Number.NaN;
  return num;
}

export function validateCarAffordabilityInput(input: CarAffordabilityInput): {
  isValid: boolean;
  errors: CarAffordabilityFieldErrors;
  result: CarAffordabilityResult | null;
} {
  const errors: CarAffordabilityFieldErrors = {};

  const monthly = parseRequiredNonNeg(input.monthlyPayment);
  if (monthly === null) {
    errors.monthlyPayment = 'Enter the monthly payment you can afford';
  } else if (Number.isNaN(monthly) || (monthly as number) < 0) {
    errors.monthlyPayment = 'Enter a valid nonnegative monthly payment';
  }

  const available = parseRequiredNonNeg(input.availableMoney);
  if (available === null) {
    errors.availableMoney = 'Enter money available (use 0 if none)';
  } else if (Number.isNaN(available) || (available as number) < 0) {
    errors.availableMoney = 'Enter a valid nonnegative amount';
  }

  const tradeIn = parseRequiredNonNeg(input.tradeInValue);
  if (tradeIn === null) {
    errors.tradeInValue = 'Enter trade-in value (use 0 if none)';
  } else if (Number.isNaN(tradeIn) || (tradeIn as number) < 0) {
    errors.tradeInValue = 'Enter a valid nonnegative trade-in value';
  }

  const rate = parseRequiredNonNeg(input.annualInterestRate);
  if (rate === null) {
    errors.annualInterestRate = 'Enter the annual interest rate (0 allowed)';
  } else if (Number.isNaN(rate) || (rate as number) < 0) {
    errors.annualInterestRate = 'Enter a valid nonnegative interest rate';
  } else if ((rate as number) > 100) {
    errors.annualInterestRate = 'Interest rate must be 100% or less';
  }

  if (!input.loanTermEnabled) {
    errors.loanTermEnabled =
      'Select Yes for loan term and enter a duration — a loan term is required for this affordability calculation.';
  }

  const years = parseNonNegInt(input.loanTermYears);
  const months = parseNonNegInt(input.loanTermMonths);
  let loanTermMonths = 0;

  if (input.loanTermEnabled) {
    if (years === null && months === null) {
      errors.loanTermYears = 'Enter loan term in years and/or months';
    } else {
      if (years !== null && Number.isNaN(years)) {
        errors.loanTermYears = 'Enter whole years (0 or more)';
      } else if (years !== null && (years as number) < 0) {
        errors.loanTermYears = 'Years cannot be negative';
      } else if (years !== null && (years as number) > 40) {
        errors.loanTermYears = 'Loan term years must be 40 or less';
      }

      if (months !== null && Number.isNaN(months)) {
        errors.loanTermMonths = 'Enter whole months (0–11)';
      } else if (months !== null && ((months as number) < 0 || (months as number) > 11)) {
        errors.loanTermMonths = 'Months must be between 0 and 11';
      }

      const y = years === null || Number.isNaN(years) ? 0 : (years as number);
      const m = months === null || Number.isNaN(months) ? 0 : (months as number);
      loanTermMonths = y * 12 + m;
      if (
        !errors.loanTermYears &&
        !errors.loanTermMonths &&
        loanTermMonths <= 0
      ) {
        errors.loanTermYears = 'Loan term must be greater than zero';
      }
    }
  }

  let salesTax = 0;
  let dealerFees = 0;
  let registrationFees = 0;
  let otherFees = 0;
  let downPayment: number | null = null;

  if (input.additionalOpen) {
    const taxParsed = parseOptionalNonNeg(input.salesTaxRate);
    if (taxParsed === null) {
      salesTax = 0;
    } else if (Number.isNaN(taxParsed) || (taxParsed as number) < 0) {
      errors.salesTaxRate = 'Enter a valid nonnegative sales tax percentage';
    } else if ((taxParsed as number) > 100) {
      errors.salesTaxRate = 'Sales tax must be 100% or less';
    } else {
      salesTax = taxParsed as number;
    }

    for (const field of [
      { key: 'dealerFees' as const, value: input.dealerFees, label: 'dealer fees' },
      {
        key: 'registrationFees' as const,
        value: input.registrationFees,
        label: 'registration and title fees',
      },
      {
        key: 'otherUpfrontCosts' as const,
        value: input.otherUpfrontCosts,
        label: 'additional upfront costs',
      },
    ]) {
      const parsed = parseOptionalNonNeg(field.value);
      if (parsed === null) continue;
      if (Number.isNaN(parsed) || (parsed as number) < 0) {
        errors[field.key] = `Enter a valid nonnegative amount for ${field.label}`;
      } else if (field.key === 'dealerFees') dealerFees = parsed as number;
      else if (field.key === 'registrationFees') registrationFees = parsed as number;
      else otherFees = parsed as number;
    }

    const dp = parseOptionalNonNeg(input.downPayment);
    if (dp !== null) {
      if (Number.isNaN(dp) || (dp as number) < 0) {
        errors.downPayment = 'Enter a valid nonnegative down payment';
      } else if (
        available !== null &&
        !Number.isNaN(available) &&
        (dp as number) > (available as number)
      ) {
        errors.downPayment =
          'Down payment cannot exceed money you have (it allocates available cash, not extra cash)';
      } else {
        downPayment = dp as number;
      }
    }
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateCarAffordability({
    monthlyPayment: monthly as number,
    availableMoney: available as number,
    tradeInValue: tradeIn as number,
    annualInterestRate: rate as number,
    loanTermMonths,
    includeAdditionalCosts: input.additionalOpen,
    salesTaxRatePercent: salesTax,
    dealerFees,
    registrationFees,
    otherUpfrontCosts: otherFees,
    downPayment,
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate car affordability with the current inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors, result };
}
