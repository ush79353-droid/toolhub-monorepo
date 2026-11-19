import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateCarRefinance,
  formatCarRefinanceMoney,
  monthsToWholePaymentCount,
  solvePaymentCountFromPayment,
  termToMonths,
} from './calculation';
import type {
  CarRefinanceFieldErrors,
  CarRefinanceInput,
  CarRefinanceResult,
  LoanSideSummary,
} from './types';

export interface CarRefinanceValidation {
  isValid: boolean;
  errors: CarRefinanceFieldErrors;
  result: CarRefinanceResult | null;
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

function toSide(
  snap: {
    principal: number;
    monthlyPayment: number;
    interestRatePercent: number;
    paymentCount: number;
    totalInterest: number;
    totalPayments: number;
    termLabel: string;
  },
  currency: SupportedCurrency
): LoanSideSummary {
  return {
    loanAmount: snap.principal,
    monthlyPayment: snap.monthlyPayment,
    interestRatePercent: snap.interestRatePercent,
    termMonths: snap.paymentCount,
    termLabel: snap.termLabel,
    totalInterest: snap.totalInterest,
    totalPayments: snap.totalPayments,
    formattedLoanAmount: formatCarRefinanceMoney(snap.principal, currency),
    formattedMonthlyPayment: formatCarRefinanceMoney(
      snap.monthlyPayment,
      currency
    ),
    formattedTotalInterest: formatCarRefinanceMoney(
      snap.totalInterest,
      currency
    ),
    formattedTotalPayments: formatCarRefinanceMoney(
      snap.totalPayments,
      currency
    ),
  };
}

/**
 * Validates inputs, normalizes money into the balance currency with Phase 2 FX,
 * amortizes both loans at full precision, and builds the comparison result.
 * Rates, terms, and dates are never FX-converted.
 */
export function validateCarRefinanceInput(
  input: CarRefinanceInput,
  rates?: CurrencyRatesSnapshot | null
): CarRefinanceValidation {
  const errors: CarRefinanceFieldErrors = {};
  const baseCurrency = input.balanceCurrency;

  const balance = parseNumber(input.balance);
  const currentRate = parseNumber(input.currentInterestRatePercent);
  const newRate = parseNumber(input.newInterestRatePercent);
  const newTerm = parseNumber(input.newLoanTerm);
  const cash = parseNumber(input.cashInOut);
  const feesRaw = input.setFeesAndCosts
    ? parseNumber(input.feesAndCosts)
    : { value: 0, blank: false, invalid: false };

  if (balance.blank) {
    errors.balance = 'Enter the balance left on the loan.';
  } else if (balance.invalid || balance.value === null) {
    errors.balance = 'Enter a valid loan balance.';
  } else if (balance.value < 0) {
    errors.balance = 'Loan balance cannot be negative.';
  }

  if (currentRate.blank) {
    errors.currentInterestRatePercent = 'Enter the current interest rate.';
  } else if (currentRate.invalid || currentRate.value === null) {
    errors.currentInterestRatePercent = 'Enter a valid interest rate.';
  } else if (currentRate.value < 0) {
    errors.currentInterestRatePercent = 'Interest rate cannot be negative.';
  }

  if (newRate.blank) {
    errors.newInterestRatePercent = 'Enter the new interest rate.';
  } else if (newRate.invalid || newRate.value === null) {
    errors.newInterestRatePercent = 'Enter a valid interest rate.';
  } else if (newRate.value < 0) {
    errors.newInterestRatePercent = 'Interest rate cannot be negative.';
  }

  if (newTerm.blank) {
    errors.newLoanTerm = 'Enter the new loan term.';
  } else if (newTerm.invalid || newTerm.value === null) {
    errors.newLoanTerm = 'Enter a valid loan term.';
  } else if (newTerm.value <= 0) {
    errors.newLoanTerm = 'New loan term must be greater than zero.';
  }

  if (cash.blank) {
    errors.cashInOut = 'Enter cash in / out (use 0 for none).';
  } else if (cash.invalid || cash.value === null) {
    errors.cashInOut = 'Enter a valid cash in / out amount.';
  }

  if (input.setFeesAndCosts) {
    if (feesRaw.blank) {
      errors.feesAndCosts = 'Enter refinancing fees (use 0 for none).';
    } else if (feesRaw.invalid || feesRaw.value === null) {
      errors.feesAndCosts = 'Enter a valid fees amount.';
    } else if (feesRaw.value < 0) {
      errors.feesAndCosts = 'Fees cannot be negative.';
    }
  }

  let currentPaymentCount: number | null = null;
  let currentPaymentOverride: number | null = null;

  if (input.estimationMode === 'remaining_term') {
    const term = parseNumber(input.remainingTerm);
    if (term.blank) {
      errors.remainingTerm = 'Enter the remaining loan term.';
    } else if (term.invalid || term.value === null) {
      errors.remainingTerm = 'Enter a valid remaining loan term.';
    } else if (term.value <= 0) {
      errors.remainingTerm = 'Remaining loan term must be greater than zero.';
    } else {
      const months = termToMonths(term.value, input.remainingTermUnit);
      currentPaymentCount = months === null ? null : monthsToWholePaymentCount(months);
      if (currentPaymentCount === null) {
        errors.remainingTerm =
          'Remaining term must produce a positive number of months.';
      }
    }
  } else {
    const payment = parseNumber(input.currentMonthlyPayment);
    if (payment.blank) {
      errors.currentMonthlyPayment = 'Enter the current monthly payment.';
    } else if (payment.invalid || payment.value === null) {
      errors.currentMonthlyPayment = 'Enter a valid monthly payment.';
    } else if (payment.value <= 0) {
      errors.currentMonthlyPayment = 'Monthly payment must be greater than zero.';
    } else if (
      balance.value !== null &&
      !balance.invalid &&
      balance.value >= 0 &&
      currentRate.value !== null &&
      !currentRate.invalid &&
      currentRate.value >= 0
    ) {
      const paymentFx = convertMoney(
        payment.value,
        input.currentMonthlyPaymentCurrency,
        baseCurrency,
        rates
      );
      if (!paymentFx.ok) {
        errors.form = paymentFx.message;
      } else {
        currentPaymentOverride = paymentFx.amount;
        const solved = solvePaymentCountFromPayment({
          principal: balance.value,
          annualRatePercent: currentRate.value,
          monthlyPayment: paymentFx.amount,
        });
        if (solved === null) {
          errors.currentMonthlyPayment =
            'Payment does not amortize this balance at the given rate (payment must exceed monthly interest).';
        } else {
          currentPaymentCount = monthsToWholePaymentCount(solved);
          if (currentPaymentCount === null) {
            errors.currentMonthlyPayment =
              'Could not solve a positive remaining term from this payment.';
          }
        }
      }
    }
  }

  const newMonths = newTerm.value === null || newTerm.invalid
    ? null
    : termToMonths(newTerm.value, input.newLoanTermUnit);
  const newPaymentCount =
    newMonths === null ? null : monthsToWholePaymentCount(newMonths);
  if (
    newTerm.value !== null &&
    !newTerm.invalid &&
    newTerm.value > 0 &&
    newPaymentCount === null
  ) {
    errors.newLoanTerm = 'New loan term must produce a positive number of months.';
  }

  if (input.setDueDateAndCompounding && input.dueDate.trim() !== '') {
    const parsed = Date.parse(input.dueDate);
    if (!Number.isFinite(parsed)) {
      errors.dueDate = 'Enter a valid due date.';
    }
  }

  if (
    Object.keys(errors).length > 0 ||
    balance.value === null ||
    currentRate.value === null ||
    newRate.value === null ||
    cash.value === null ||
    feesRaw.value === null ||
    currentPaymentCount === null ||
    newPaymentCount === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const cashFx = convertMoney(
    cash.value,
    input.cashInOutCurrency,
    baseCurrency,
    rates
  );
  if (!cashFx.ok) {
    errors.form = cashFx.message;
    return { isValid: false, errors, result: null };
  }

  const feesAmount = input.setFeesAndCosts ? feesRaw.value : 0;
  const feesFx = convertMoney(
    feesAmount,
    input.feesAndCostsCurrency,
    baseCurrency,
    rates
  );
  if (!feesFx.ok) {
    errors.form = feesFx.message;
    return { isValid: false, errors, result: null };
  }

  const financeFees =
    input.setFeesAndCosts && input.feeTreatment === 'financed';

  const computed = calculateCarRefinance({
    balance: balance.value,
    currentRatePercent: currentRate.value,
    currentPaymentCount,
    currentMonthlyPaymentOverride:
      input.estimationMode === 'monthly_payment'
        ? currentPaymentOverride
        : null,
    newRatePercent: newRate.value,
    newPaymentCount,
    cashInOut: cashFx.amount,
    fees: feesFx.amount,
    financeFees,
  });

  if (!computed) {
    errors.form =
      'This combination does not produce a finite refinance comparison. Check cash in / out and fees so the new principal is not negative.';
    return { isValid: false, errors, result: null };
  }

  if (computed.neu.principal < 0) {
    errors.cashInOut =
      'Cash in / fees combination makes the new loan principal negative.';
    return { isValid: false, errors, result: null };
  }

  const result: CarRefinanceResult = {
    currency: baseCurrency,
    current: toSide(computed.current, baseCurrency),
    neu: toSide(computed.neu, baseCurrency),
    monthlyPaymentDiffAmount: computed.monthlyPaymentDiff,
    totalInterestDiffAmount: computed.totalInterestDiff,
    totalPaymentsDiffAmount: computed.totalPaymentsDiff,
    formattedMonthlyPaymentDiff: formatCarRefinanceMoney(
      Math.abs(computed.monthlyPaymentDiff),
      baseCurrency
    ),
    formattedTotalInterestDiff: formatCarRefinanceMoney(
      Math.abs(computed.totalInterestDiff),
      baseCurrency
    ),
    formattedTotalPaymentsDiff: formatCarRefinanceMoney(
      Math.abs(computed.totalPaymentsDiff),
      baseCurrency
    ),
    explanation: computed.explanation,
    cashInOutCanonical: computed.cashInOut,
    feesCanonical: computed.fees,
    feesFinanced: computed.feesFinanced,
    upfrontFees: computed.upfrontFees,
  };

  return { isValid: true, errors: {}, result };
}
