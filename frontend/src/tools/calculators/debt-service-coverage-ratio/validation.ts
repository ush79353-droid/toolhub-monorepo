import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateDscr,
  formatDscr,
  formatDscrMoney,
  toMonthlyAmount,
} from './calculation';
import type {
  DebtServiceCoverageRatioFieldErrors,
  DebtServiceCoverageRatioInput,
  DebtServiceCoverageRatioResult,
} from './types';

export interface DebtServiceCoverageRatioValidation {
  isValid: boolean;
  errors: DebtServiceCoverageRatioFieldErrors;
  result: DebtServiceCoverageRatioResult | null;
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

/**
 * Validates inputs, normalizes payment + NOI into the total-loan currency at
 * full precision, converts both to monthly, then DSCR = NOI / debt service.
 */
export function validateDebtServiceCoverageRatioInput(
  input: DebtServiceCoverageRatioInput,
  rates?: CurrencyRatesSnapshot | null
): DebtServiceCoverageRatioValidation {
  const errors: DebtServiceCoverageRatioFieldErrors = {};

  const rate = parseNumber(input.interestRatePercent);
  const term = parseNumber(input.term);
  const loan = parseNumber(input.totalLoan);
  const payment = parseNumber(input.loanPayment);
  const noi = parseNumber(input.noi);
  const gi = parseNumber(input.grossIncome);
  const expenses = parseNumber(input.expensesPercent);
  const vacancy = parseNumber(input.vacancyPercent);

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (!term.blank && (term.invalid || term.value === null)) {
    errors.term = 'Enter a valid term.';
  } else if (!term.blank && term.value !== null && !(term.value > 0)) {
    errors.term = 'Term must be greater than zero.';
  }

  if (!loan.blank && (loan.invalid || loan.value === null)) {
    errors.totalLoan = 'Enter a valid total loan.';
  } else if (!loan.blank && loan.value !== null && !(loan.value > 0)) {
    errors.totalLoan = 'Total loan must be greater than zero.';
  }

  if (!payment.blank && (payment.invalid || payment.value === null)) {
    errors.loanPayment = 'Enter a valid loan payment.';
  } else if (!payment.blank && payment.value !== null && !(payment.value > 0)) {
    errors.loanPayment = 'Loan payment must be greater than zero.';
  }

  if (!noi.blank && (noi.invalid || noi.value === null)) {
    errors.noi = 'Enter a valid NOI.';
  }

  if (input.noiSectionOpen) {
    if (!gi.blank && (gi.invalid || gi.value === null)) {
      errors.grossIncome = 'Enter a valid gross income.';
    } else if (!gi.blank && gi.value !== null && gi.value < 0) {
      errors.grossIncome = 'Gross income cannot be negative.';
    }
    if (!expenses.blank && (expenses.invalid || expenses.value === null)) {
      errors.expensesPercent = 'Enter a valid expenses percent.';
    } else if (!expenses.blank && expenses.value !== null && expenses.value < 0) {
      errors.expensesPercent = 'Expenses percent cannot be negative.';
    }
    if (!vacancy.blank && (vacancy.invalid || vacancy.value === null)) {
      errors.vacancyPercent = 'Enter a valid vacancy percent.';
    } else if (!vacancy.blank && vacancy.value !== null && vacancy.value < 0) {
      errors.vacancyPercent = 'Vacancy percent cannot be negative.';
    }
  }

  const incomplete =
    payment.blank ||
    noi.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.totalLoanCurrency;

  const paymentInCalc = convertMoney(
    payment.value!,
    input.loanPaymentCurrency,
    calcCurrency,
    rates
  );
  if (!paymentInCalc.ok) {
    errors.form = paymentInCalc.message;
    return { isValid: false, errors, result: null };
  }

  const noiInCalc = convertMoney(
    noi.value!,
    input.noiCurrency,
    calcCurrency,
    rates
  );
  if (!noiInCalc.ok) {
    errors.form = noiInCalc.message;
    return { isValid: false, errors, result: null };
  }

  const monthlyPayment = toMonthlyAmount(
    paymentInCalc.amount,
    input.loanPaymentFrequency
  );
  const monthlyNoi = toMonthlyAmount(noiInCalc.amount, input.noiFrequency);

  if (monthlyPayment === null || monthlyNoi === null) {
    errors.form = 'This combination does not produce a finite DSCR.';
    return { isValid: false, errors, result: null };
  }

  const dscr = calculateDscr({
    monthlyNoi,
    monthlyDebtService: monthlyPayment,
  });

  if (dscr === null) {
    errors.loanPayment = 'Loan payment (debt service) must be greater than zero.';
    return { isValid: false, errors, result: null };
  }

  const result: DebtServiceCoverageRatioResult = {
    monthlyPaymentInCalc: monthlyPayment,
    monthlyNoiInCalc: monthlyNoi,
    dscr,
    formattedDscr: formatDscr(dscr),
    formattedLoanPayment: formatDscrMoney(
      payment.value!,
      input.loanPaymentCurrency
    ),
    formattedNoi: formatDscrMoney(noi.value!, input.noiCurrency),
    calcCurrency,
  };

  return { isValid: true, errors: {}, result };
}
