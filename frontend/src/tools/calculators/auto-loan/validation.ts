import type {
  AutoLoanFieldErrors,
  AutoLoanInput,
  AutoLoanValidationResult,
  DownPaymentMode,
  TermUnit,
} from './types';

export const MAX_VEHICLE_PRICE = 10_000_000;
export const MAX_LOAN_MONTHS = 360;
export const MAX_INTEREST_RATE = 100;
export const MAX_SALES_TAX_RATE = 50;
export const MAX_ADDITIONAL_FEES = 1_000_000;

export function toCents(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100);
}

export function isValidIsoCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1900 || year > 2200 || month < 1 || month > 12 || day < 1) return false;
  const maxDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return day <= maxDay;
}

export function resolveTotalMonths(value: number, unit: TermUnit): number {
  if (!Number.isFinite(value)) return NaN;
  return unit === 'years' ? value * 12 : value;
}

export function resolveDownPaymentCents(
  autoPriceCents: number,
  downPaymentValue: number,
  mode: DownPaymentMode
): number {
  if (!Number.isFinite(downPaymentValue)) return NaN;
  if (mode === 'percent') {
    return Math.round(autoPriceCents * (downPaymentValue / 100));
  }
  return toCents(downPaymentValue);
}

function isFiniteNonNegative(value: number): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function validateAutoLoanInput(input: AutoLoanInput): AutoLoanValidationResult {
  const errors: AutoLoanFieldErrors = {};

  if (!Number.isFinite(input.autoPrice) || input.autoPrice <= 0) {
    errors.autoPrice = 'Enter a vehicle price greater than 0.';
  } else if (input.autoPrice > MAX_VEHICLE_PRICE) {
    errors.autoPrice = `Vehicle price cannot exceed ${MAX_VEHICLE_PRICE.toLocaleString()}.`;
  }

  if (!isFiniteNonNegative(input.downPaymentValue)) {
    errors.downPaymentValue = 'Down payment must be 0 or greater.';
  } else if (input.downPaymentMode === 'percent' && input.downPaymentValue > 100) {
    errors.downPaymentValue = 'Down payment percentage cannot exceed 100%.';
  } else if (input.downPaymentMode === 'amount' && input.downPaymentValue > MAX_VEHICLE_PRICE) {
    errors.downPaymentValue = `Down payment cannot exceed ${MAX_VEHICLE_PRICE.toLocaleString()}.`;
  }

  if (!Number.isFinite(input.loanTermValue) || input.loanTermValue <= 0) {
    errors.loanTermValue = 'Loan term must be greater than 0.';
  } else {
    const rawMonths = resolveTotalMonths(input.loanTermValue, input.loanTermUnit);
    if (Math.abs(rawMonths - Math.round(rawMonths)) > 1e-6) {
      errors.loanTermValue =
        input.loanTermUnit === 'months'
          ? 'Loan term in months must be a whole number.'
          : 'Enter years that convert to a whole number of months (e.g., 5 or 4.5).';
    } else {
      const months = Math.round(rawMonths);
      if (months < 1 || months > MAX_LOAN_MONTHS) {
        errors.loanTermValue = `Loan term must be between 1 and ${MAX_LOAN_MONTHS} months (30 years).`;
      }
    }
  }

  if (!isFiniteNonNegative(input.annualInterestRate) || input.annualInterestRate > MAX_INTEREST_RATE) {
    errors.annualInterestRate = `Interest rate must be between 0% and ${MAX_INTEREST_RATE}%.`;
  }

  if (!isFiniteNonNegative(input.tradeInValue) || input.tradeInValue > MAX_VEHICLE_PRICE) {
    errors.tradeInValue = `Trade-in value must be between 0 and ${MAX_VEHICLE_PRICE.toLocaleString()}.`;
  }

  if (!isFiniteNonNegative(input.tradeInOwed) || input.tradeInOwed > MAX_VEHICLE_PRICE) {
    errors.tradeInOwed = `Amount owed on trade-in must be between 0 and ${MAX_VEHICLE_PRICE.toLocaleString()}.`;
  }

  if (!isFiniteNonNegative(input.salesTaxRate) || input.salesTaxRate > MAX_SALES_TAX_RATE) {
    errors.salesTaxRate = `Sales tax rate must be between 0% and ${MAX_SALES_TAX_RATE}%.`;
  }

  if (!isFiniteNonNegative(input.additionalFees) || input.additionalFees > MAX_ADDITIONAL_FEES) {
    errors.additionalFees = `Additional fees must be between 0 and ${MAX_ADDITIONAL_FEES.toLocaleString()}.`;
  }

  if (!isValidIsoCalendarDate(input.startDate)) {
    errors.startDate = 'Enter a valid loan start date.';
  }

  if (Object.keys(errors).length === 0) {
    const autoPriceCents = toCents(input.autoPrice);
    const downPaymentCents = resolveDownPaymentCents(
      autoPriceCents,
      input.downPaymentValue,
      input.downPaymentMode
    );
    const tradeInCents = toCents(input.tradeInValue);
    const tradeInOwedCents = toCents(input.tradeInOwed);
    const netTradeInCents = tradeInCents - tradeInOwedCents;

    const taxableCents =
      input.taxPolicy === 'after-trade-in'
        ? Math.max(0, autoPriceCents - tradeInCents)
        : autoPriceCents;
    const salesTaxCents = Math.round(taxableCents * (input.salesTaxRate / 100));
    const feesCents = toCents(input.additionalFees);
    const financedTaxCents = input.salesTaxInclusion === 'finance' ? salesTaxCents : 0;
    const financedFeesCents = input.feesInclusion === 'finance' ? feesCents : 0;

    const amountFinancedCents =
      autoPriceCents - downPaymentCents - netTradeInCents + financedTaxCents + financedFeesCents;

    if (amountFinancedCents < 0) {
      errors.form =
        'Amount financed cannot be negative. Your down payment and net trade-in equity exceed the financed vehicle total.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

