import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateDeferredPaymentLoan,
  formatCurrencyLabel,
  formatDeferredMoney,
  parseIsoDate,
  paymentsBeforeDeferment,
} from './calculation';
import type {
  DeferredPaymentLoanFieldErrors,
  DeferredPaymentLoanInput,
  DeferredPaymentLoanResult,
} from './types';

export interface DeferredPaymentLoanValidation {
  isValid: boolean;
  errors: DeferredPaymentLoanFieldErrors;
  result: DeferredPaymentLoanResult | null;
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
 * Validate inputs, normalize payment into loan currency, run deferment engine,
 * then convert original payment into payment display currency.
 */
export function validateDeferredPaymentLoanInput(
  input: DeferredPaymentLoanInput,
  rates?: CurrencyRatesSnapshot | null
): DeferredPaymentLoanValidation {
  const errors: DeferredPaymentLoanFieldErrors = {};

  const amount = parseNumber(input.loanAmount);
  const years = parseNumber(input.termYears);
  const months = parseNumber(input.termMonths);
  const rate = parseNumber(input.interestRatePercent);
  const deferred = parseNumber(input.deferredMonths);
  const paymentRaw = parseNumber(input.originalMonthlyPayment);

  if (amount.blank) {
    errors.loanAmount = 'Enter a loan amount.';
  } else if (amount.invalid || amount.value === null) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (amount.value <= 0) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  const balanceDate = parseIsoDate(input.balanceDate);
  if (!balanceDate) {
    errors.balanceDate = 'Enter a valid balance date.';
  }

  const defermentFrom = parseIsoDate(input.defermentFrom);
  if (!defermentFrom) {
    errors.defermentFrom = 'Enter a valid deferment start date.';
  }

  if (input.estimationMode === 'loan_term') {
    const y = years.blank ? 0 : years.value;
    const m = months.blank ? 0 : months.value;
    if ((years.blank && months.blank) || years.invalid || months.invalid) {
      errors.termYears = 'Enter a valid loan term.';
    } else if (y === null || m === null || y < 0 || m < 0 || m > 11) {
      errors.termYears = 'Term months must be 0–11; years cannot be negative.';
    } else if (y * 12 + m <= 0) {
      errors.termYears = 'Loan term must be greater than zero.';
    }
  } else {
    if (paymentRaw.blank) {
      errors.originalMonthlyPayment = 'Enter the original monthly payment.';
    } else if (paymentRaw.invalid || paymentRaw.value === null) {
      errors.originalMonthlyPayment = 'Enter a valid monthly payment.';
    } else if (paymentRaw.value <= 0) {
      errors.originalMonthlyPayment = 'Monthly payment must be greater than zero.';
    }
  }

  if (rate.blank) {
    errors.interestRatePercent = 'Enter an interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (deferred.blank) {
    errors.deferredMonths = 'Enter how many months are deferred.';
  } else if (deferred.invalid || deferred.value === null) {
    errors.deferredMonths = 'Enter a valid deferment length.';
  } else if (!Number.isInteger(deferred.value) || deferred.value < 0) {
    errors.deferredMonths = 'Deferment must be a whole number of months (≥ 0).';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const termMonthsTotal =
    input.estimationMode === 'loan_term'
      ? Math.round((years.value ?? 0) * 12 + (months.value ?? 0))
      : 0;

  let paymentInLoan = 0;
  if (input.estimationMode === 'monthly_payment') {
    const converted = convertMoney(
      paymentRaw.value!,
      input.paymentCurrency,
      input.loanCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    paymentInLoan = converted.amount;
  }

  const before = paymentsBeforeDeferment(balanceDate!, defermentFrom!);

  const engine = calculateDeferredPaymentLoan({
    principal: amount.value!,
    annualRatePercent: rate.value!,
    compounding: input.compoundingFrequency,
    termMonths: termMonthsTotal,
    originalPayment: paymentInLoan,
    estimationUsesPayment: input.estimationMode === 'monthly_payment',
    interestTreatment: input.interestTreatment,
    repaymentType: input.repaymentType,
    deferredMonths: deferred.value!,
    paymentsBefore: before,
    balanceDate: balanceDate!,
  });

  if (!engine) {
    errors.form =
      'This combination cannot be amortized (check deferment length, payment size, or repayment type).';
    return { isValid: false, errors, result: null };
  }

  const paymentDisplay = convertMoney(
    engine.originalMonthlyPayment,
    input.loanCurrency,
    input.paymentCurrency,
    rates
  );
  if (!paymentDisplay.ok) {
    errors.form = paymentDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const cur = input.loanCurrency;
  const narrative = `The loan balance is ${formatCurrencyLabel(
    engine.balanceAtDefermentStart,
    cur
  )} at the beginning, which will become ${formatCurrencyLabel(
    engine.balanceAfterDeferment,
    cur
  )} at the end of the deferment. The accumulated interest during the deferment is ${formatCurrencyLabel(
    engine.deferredInterest,
    cur
  )}.`;

  const result: DeferredPaymentLoanResult = {
    loanCurrency: input.loanCurrency,
    paymentCurrency: input.paymentCurrency,
    originalMonthlyPaymentLoan: engine.originalMonthlyPayment,
    originalMonthlyPaymentDisplay: paymentDisplay.amount,
    formattedOriginalMonthlyPayment: formatDeferredMoney(
      paymentDisplay.amount,
      input.paymentCurrency
    ),
    balanceAtDefermentStart: engine.balanceAtDefermentStart,
    balanceAfterDeferment: engine.balanceAfterDeferment,
    deferredInterest: engine.deferredInterest,
    formattedBalanceStart: formatDeferredMoney(
      engine.balanceAtDefermentStart,
      cur
    ),
    formattedBalanceAfter: formatDeferredMoney(engine.balanceAfterDeferment, cur),
    formattedDeferredInterest: formatDeferredMoney(engine.deferredInterest, cur),
    without: engine.without,
    withDefer: engine.withDefer,
    diffMonthly: engine.withDefer.monthlyPayment - engine.without.monthlyPayment,
    diffInterest: engine.withDefer.interest - engine.without.interest,
    diffTotalPaid: engine.withDefer.totalPaid - engine.without.totalPaid,
    diffTermMonths: engine.without.termMonths - engine.withDefer.termMonths,
    diffPaymentCount: engine.without.paymentCount - engine.withDefer.paymentCount,
    narrative,
  };

  return { isValid: true, errors: {}, result };
}
