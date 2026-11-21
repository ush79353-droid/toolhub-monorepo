import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  addCalendarMonths,
  calculateMortgageRefinance,
  elapsedWholeMonths,
  formatMortgageRefinanceMoney,
  termToWholeMonths,
} from './calculation';
import type {
  MortgageRefinanceFieldErrors,
  MortgageRefinanceInput,
  MortgageRefinanceResult,
} from './types';

export interface MortgageRefinanceValidation {
  isValid: boolean;
  errors: MortgageRefinanceFieldErrors;
  result: MortgageRefinanceResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.' || cleaned === '-.') {
    return { value: null, blank: true, invalid: false };
  }
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

export function validateMortgageRefinanceInput(
  input: MortgageRefinanceInput,
  rates: CurrencyRatesSnapshot | null | undefined
): MortgageRefinanceValidation {
  const errors: MortgageRefinanceFieldErrors = {};
  const currency = input.originalAmountCurrency;

  const original = parseNumber(input.originalAmount);
  if (original.blank) errors.originalAmount = 'Enter the original mortgage amount.';
  else if (original.invalid || original.value === null || original.value < 0) {
    errors.originalAmount = 'Enter an original mortgage amount of zero or more.';
  }

  const currentTerm = parseNumber(input.currentTerm);
  if (currentTerm.blank) errors.currentTerm = 'Enter the current mortgage term.';
  else if (currentTerm.invalid || currentTerm.value === null || currentTerm.value <= 0) {
    errors.currentTerm = 'Enter a mortgage term greater than zero.';
  }

  const currentRate = parseNumber(input.currentInterestRatePercent);
  if (currentRate.blank) errors.currentInterestRatePercent = 'Enter the current interest rate.';
  else if (currentRate.invalid || currentRate.value === null || currentRate.value < 0) {
    errors.currentInterestRatePercent = 'Enter an interest rate of zero or more.';
  }

  const newTerm = parseNumber(input.newTerm);
  if (newTerm.blank) errors.newTerm = "Enter the new loan's term.";
  else if (newTerm.invalid || newTerm.value === null || newTerm.value <= 0) {
    errors.newTerm = 'Enter a new term greater than zero.';
  }

  const newRate = parseNumber(input.newInterestRatePercent);
  if (newRate.blank) errors.newInterestRatePercent = 'Enter the new interest rate.';
  else if (newRate.invalid || newRate.value === null || newRate.value < 0) {
    errors.newInterestRatePercent = 'Enter an interest rate of zero or more.';
  }

  const points = parseNumber(input.mortgagePoints);
  if (points.blank) errors.mortgagePoints = 'Enter mortgage points (use 0 if none).';
  else if (points.invalid || points.value === null || points.value < 0) {
    errors.mortgagePoints = 'Enter mortgage points of zero or more.';
  }

  const costs = parseNumber(input.closingCosts);
  if (costs.blank) errors.closingCosts = 'Enter refinancing costs (use 0 if none).';
  else if (costs.invalid || costs.value === null || costs.value < 0) {
    errors.closingCosts = 'Enter refinancing costs of zero or more.';
  }

  const cash = parseNumber(input.cashInOut);
  if (cash.blank) errors.cashInOut = 'Enter cash in/out (use 0 if none).';
  else if (cash.invalid || cash.value === null) {
    errors.cashInOut = 'Enter a cash in/out amount. Positive is cash out; negative is cash in.';
  }

  const elapsed = elapsedWholeMonths(input.currentDueDate, input.newDueDate);
  if (!input.currentDueDate.trim() || elapsed === null) {
    errors.currentDueDate = 'Enter a valid current due date.';
  }
  if (!input.newDueDate.trim()) {
    errors.newDueDate = "Enter the new mortgage's due date.";
  } else if (elapsed === null && !errors.currentDueDate) {
    errors.newDueDate = 'Enter a valid new due date.';
  } else if (elapsed !== null && elapsed < 0) {
    errors.newDueDate = 'New due date must be on or after the current due date.';
  }

  let closingCanonical: number | null = costs.value;
  if (costs.value !== null && !errors.closingCosts && input.closingCostsCurrency !== currency) {
    const converted = convertMoney(costs.value, input.closingCostsCurrency, currency, rates);
    if (!converted.ok) errors.closingCosts = converted.message;
    else closingCanonical = converted.amount;
  }

  let cashCanonical: number | null = cash.value;
  if (cash.value !== null && !errors.cashInOut && input.cashInOutCurrency !== currency) {
    const converted = convertMoney(cash.value, input.cashInOutCurrency, currency, rates);
    if (!converted.ok) errors.cashInOut = converted.message;
    else cashCanonical = converted.amount;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const originalTermMonths = termToWholeMonths(currentTerm.value as number, input.currentTermUnit);
  const newTermMonths = termToWholeMonths(newTerm.value as number, input.newTermUnit);
  if (originalTermMonths === null || originalTermMonths > 1200) {
    return {
      isValid: false,
      errors: { currentTerm: 'Enter a term up to 100 years.' },
      result: null,
    };
  }
  if (newTermMonths === null || newTermMonths > 1200) {
    return {
      isValid: false,
      errors: { newTerm: 'Enter a term up to 100 years.' },
      result: null,
    };
  }
  if ((elapsed as number) >= originalTermMonths) {
    return {
      isValid: false,
      errors: {
        newDueDate: 'The current mortgage has no remaining payments on the new due date.',
      },
      result: null,
    };
  }

  const computed = calculateMortgageRefinance({
    originalPrincipal: original.value as number,
    originalTermMonths,
    elapsedMonths: elapsed as number,
    currentAnnualRatePercent: currentRate.value as number,
    currentCompounding: input.currentCompounding,
    newTermMonths,
    newAnnualRatePercent: newRate.value as number,
    newCompounding: input.newCompounding,
    pointsPercent: points.value as number,
    closingCosts: closingCanonical as number,
    cashInOut: cashCanonical as number,
  });

  if (!computed) {
    return {
      isValid: false,
      errors: {
        form: 'Those values do not produce a positive refinance balance. Check cash in/out and the dates.',
      },
      result: null,
    };
  }

  const breakEvenDateIso =
    computed.breakEvenMonths === null
      ? null
      : addCalendarMonths(input.newDueDate, computed.breakEvenMonths);

  const result: MortgageRefinanceResult = {
    currency,
    current: computed.current,
    neu: computed.neu,
    elapsedMonths: computed.elapsedMonths,
    pointsCost: computed.pointsCost,
    closingCosts: computed.closingCosts,
    refinancingCost: computed.refinancingCost,
    monthlySavings: computed.monthlySavings,
    breakEvenMonths: computed.breakEvenMonths,
    breakEvenDateIso,
    formattedCurrentPrincipal: formatMortgageRefinanceMoney(computed.current.principal, currency),
    formattedNewPrincipal: formatMortgageRefinanceMoney(computed.neu.principal, currency),
    formattedCurrentPayment: formatMortgageRefinanceMoney(
      computed.current.monthlyPayment,
      currency
    ),
    formattedNewPayment: formatMortgageRefinanceMoney(computed.neu.monthlyPayment, currency),
    formattedCurrentInterest: formatMortgageRefinanceMoney(
      computed.current.totalInterest,
      currency
    ),
    formattedNewInterest: formatMortgageRefinanceMoney(computed.neu.totalInterest, currency),
    formattedCurrentTotalPayments: formatMortgageRefinanceMoney(
      computed.current.totalPayments,
      currency
    ),
    formattedNewTotalPayments: formatMortgageRefinanceMoney(
      computed.neu.totalPayments,
      currency
    ),
    formattedRefinancingCost: formatMortgageRefinanceMoney(computed.refinancingCost, currency),
    formattedMonthlySavings: formatMortgageRefinanceMoney(
      Math.abs(computed.monthlySavings),
      currency
    ),
    formattedPointsCost: formatMortgageRefinanceMoney(computed.pointsCost, currency),
    formattedClosingCosts: formatMortgageRefinanceMoney(computed.closingCosts, currency),
  };

  return { isValid: true, errors: {}, result };
}
