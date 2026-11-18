import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateEmi,
  calculateHomeLoanEmiTotals,
  formatHomeLoanEmiMoney,
  termToPaymentCount,
} from './calculation';
import type {
  HomeLoanEmiFieldErrors,
  HomeLoanEmiInput,
  HomeLoanEmiResult,
} from './types';

export interface HomeLoanEmiValidation {
  isValid: boolean;
  errors: HomeLoanEmiFieldErrors;
  result: HomeLoanEmiResult | null;
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

export function validateHomeLoanEmiInput(
  input: HomeLoanEmiInput,
  rates?: CurrencyRatesSnapshot | null
): HomeLoanEmiValidation {
  const errors: HomeLoanEmiFieldErrors = {};

  const principal = parseNumber(input.principal);
  const term = parseNumber(input.loanTerm);
  const rate = parseNumber(input.interestRatePercent);

  if (principal.blank) {
    // Keep empty until user enters values (no forced error on load).
  } else if (principal.invalid || principal.value === null) {
    errors.principal = 'Enter a valid principal loan amount.';
  } else if (!(principal.value > 0)) {
    errors.principal = 'Principal must be greater than zero.';
  }

  if (!term.blank && (term.invalid || term.value === null)) {
    errors.loanTerm = 'Enter a valid loan term.';
  } else if (!term.blank && term.value !== null && !(term.value > 0)) {
    errors.loanTerm = 'Loan term must be greater than zero.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (
    principal.blank ||
    term.blank ||
    rate.blank ||
    Object.keys(errors).length > 0 ||
    principal.value === null ||
    term.value === null ||
    rate.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const paymentCount = termToPaymentCount(term.value, input.termUnit);
  if (paymentCount === null) {
    errors.loanTerm = 'Loan term must produce a positive number of months.';
    return { isValid: false, errors, result: null };
  }

  const emiCanonical = calculateEmi({
    principal: principal.value,
    annualRatePercent: rate.value,
    paymentCount,
  });
  if (emiCanonical === null) {
    errors.form = 'Unable to calculate a finite EMI.';
    return { isValid: false, errors, result: null };
  }

  const totals = calculateHomeLoanEmiTotals({
    principal: principal.value,
    emi: emiCanonical,
    paymentCount,
  });
  if (!totals) {
    errors.form = 'Unable to calculate totals.';
    return { isValid: false, errors, result: null };
  }

  const emiDisplay = convertMoney(
    emiCanonical,
    input.currency,
    input.emiCurrency,
    rates
  );
  if (!emiDisplay.ok) {
    errors.form = emiDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const payableDisplay = convertMoney(
    totals.totalPayable,
    input.currency,
    input.totalPayableCurrency,
    rates
  );
  if (!payableDisplay.ok) {
    errors.form = payableDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const interestDisplay = convertMoney(
    totals.totalInterest,
    input.currency,
    input.totalInterestCurrency,
    rates
  );
  if (!interestDisplay.ok) {
    errors.form = interestDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: HomeLoanEmiResult = {
    principal: principal.value,
    paymentCount,
    emiInPrincipalCurrency: emiCanonical,
    emi: emiDisplay.amount,
    emiCurrency: input.emiCurrency,
    formattedEmi: formatHomeLoanEmiMoney(emiDisplay.amount, input.emiCurrency),
    totalPayableInPrincipalCurrency: totals.totalPayable,
    totalPayable: payableDisplay.amount,
    totalPayableCurrency: input.totalPayableCurrency,
    formattedTotalPayable: formatHomeLoanEmiMoney(
      payableDisplay.amount,
      input.totalPayableCurrency
    ),
    totalInterestInPrincipalCurrency: totals.totalInterest,
    totalInterest: interestDisplay.amount,
    totalInterestCurrency: input.totalInterestCurrency,
    formattedTotalInterest: formatHomeLoanEmiMoney(
      interestDisplay.amount,
      input.totalInterestCurrency
    ),
    principalSharePercent: totals.principalSharePercent,
    interestSharePercent: totals.interestSharePercent,
    currency: input.currency,
  };

  return { isValid: true, errors: {}, result };
}
