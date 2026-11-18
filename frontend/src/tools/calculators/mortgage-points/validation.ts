import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateMortgagePoints,
  formatBreakEvenMonths,
  formatMortgagePointsMoney,
  formatRatePercent,
  isValidIsoDate,
  termToMonths,
} from './calculation';
import type {
  MortgagePointsFieldErrors,
  MortgagePointsInput,
  MortgagePointsResult,
  OptionSummary,
} from './types';

export interface MortgagePointsValidation {
  isValid: boolean;
  errors: MortgagePointsFieldErrors;
  result: MortgagePointsResult | null;
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

function toOptionSummary(
  label: 'Option I' | 'Option II',
  option: {
    principal: number;
    monthlyPayment: number;
    monthlySavings: number;
    mortgageRatePercent: number;
    breakEvenMonths: number | null;
    totalInterest: number;
    totalPayments: number;
    pointsCost: number;
    points: number;
  },
  currency: SupportedCurrency
): OptionSummary {
  return {
    label,
    principal: option.principal,
    monthlyPayment: option.monthlyPayment,
    monthlySavings: option.monthlySavings,
    mortgageRatePercent: option.mortgageRatePercent,
    breakEvenMonths: option.breakEvenMonths,
    totalInterest: option.totalInterest,
    totalPayments: option.totalPayments,
    pointsCost: option.pointsCost,
    points: option.points,
    formattedPrincipal: formatMortgagePointsMoney(option.principal, currency),
    formattedMonthlyPayment: formatMortgagePointsMoney(
      option.monthlyPayment,
      currency
    ),
    formattedMonthlySavings: formatMortgagePointsMoney(
      option.monthlySavings,
      currency
    ),
    formattedRate: formatRatePercent(option.mortgageRatePercent),
    formattedBreakEven: formatBreakEvenMonths(option.breakEvenMonths),
    formattedTotalInterest: formatMortgagePointsMoney(
      option.totalInterest,
      currency
    ),
    formattedTotalPayments: formatMortgagePointsMoney(
      option.totalPayments,
      currency
    ),
  };
}

/**
 * Validates inputs, normalizes independent money fields into loan currency,
 * then compares Option I vs Option II schedules at full precision.
 */
export function validateMortgagePointsInput(
  input: MortgagePointsInput,
  rates?: CurrencyRatesSnapshot | null
): MortgagePointsValidation {
  const errors: MortgagePointsFieldErrors = {};

  const loan = parseNumber(input.loanAmount);
  const term = parseNumber(input.mortgageTerm);
  const initialRate = parseNumber(input.initialRatePercent);
  const discount = parseNumber(input.discountPercentPerPoint);
  const iPoints = parseNumber(input.optionIPoints);
  const iCost = parseNumber(input.optionICost);
  const iRate = parseNumber(input.optionIRatePercent);
  const iiPoints = parseNumber(input.optionIIPoints);
  const iiCost = parseNumber(input.optionIICost);
  const iiRate = parseNumber(input.optionIIRatePercent);

  if (loan.blank) {
    errors.loanAmount = 'Enter an original loan amount.';
  } else if (loan.invalid || loan.value === null) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (!(loan.value > 0)) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  if (term.blank) {
    errors.mortgageTerm = 'Enter a mortgage term.';
  } else if (term.invalid || term.value === null) {
    errors.mortgageTerm = 'Enter a valid mortgage term.';
  } else if (!(term.value > 0)) {
    errors.mortgageTerm = 'Mortgage term must be greater than zero.';
  }

  if (initialRate.blank) {
    errors.initialRatePercent = 'Enter an initial interest rate.';
  } else if (initialRate.invalid || initialRate.value === null) {
    errors.initialRatePercent = 'Enter a valid interest rate.';
  } else if (initialRate.value < 0) {
    errors.initialRatePercent = 'Interest rate cannot be negative.';
  }

  if (!isValidIsoDate(input.dueDate)) {
    errors.dueDate = 'Enter a valid due date.';
  }

  if (input.manualAdjust) {
    if (discount.blank) {
      errors.discountPercentPerPoint = 'Enter a discount percentage.';
    } else if (discount.invalid || discount.value === null) {
      errors.discountPercentPerPoint = 'Enter a valid discount percentage.';
    } else if (discount.value < 0) {
      errors.discountPercentPerPoint = 'Discount percentage cannot be negative.';
    }
  }

  if (iPoints.blank) {
    errors.optionIPoints = 'Enter Option I mortgage points.';
  } else if (iPoints.invalid || iPoints.value === null) {
    errors.optionIPoints = 'Enter valid Option I mortgage points.';
  } else if (iPoints.value < 0) {
    errors.optionIPoints = 'Mortgage points cannot be negative.';
  }

  if (iCost.blank) {
    errors.optionICost = 'Enter Option I points cost.';
  } else if (iCost.invalid || iCost.value === null) {
    errors.optionICost = 'Enter a valid Option I points cost.';
  } else if (iCost.value < 0) {
    errors.optionICost = 'Points cost cannot be negative.';
  }

  if (iRate.blank) {
    errors.optionIRatePercent = 'Enter Option I interest rate.';
  } else if (iRate.invalid || iRate.value === null) {
    errors.optionIRatePercent = 'Enter a valid Option I interest rate.';
  } else if (iRate.value < 0) {
    errors.optionIRatePercent = 'Interest rate cannot be negative.';
  }

  if (iiPoints.blank) {
    errors.optionIIPoints = 'Enter Option II mortgage points.';
  } else if (iiPoints.invalid || iiPoints.value === null) {
    errors.optionIIPoints = 'Enter valid Option II mortgage points.';
  } else if (iiPoints.value < 0) {
    errors.optionIIPoints = 'Mortgage points cannot be negative.';
  }

  if (iiCost.blank) {
    errors.optionIICost = 'Enter Option II points cost.';
  } else if (iiCost.invalid || iiCost.value === null) {
    errors.optionIICost = 'Enter a valid Option II points cost.';
  } else if (iiCost.value < 0) {
    errors.optionIICost = 'Points cost cannot be negative.';
  }

  if (iiRate.blank) {
    errors.optionIIRatePercent = 'Enter Option II interest rate.';
  } else if (iiRate.invalid || iiRate.value === null) {
    errors.optionIIRatePercent = 'Enter a valid Option II interest rate.';
  } else if (iiRate.value < 0) {
    errors.optionIIRatePercent = 'Interest rate cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const termMonths = termToMonths(term.value!, input.termUnit);
  if (termMonths === null) {
    errors.mortgageTerm =
      'Mortgage term must produce a positive number of months.';
    return { isValid: false, errors, result: null };
  }

  const costI = convertMoney(
    iCost.value!,
    input.optionICostCurrency,
    input.loanCurrency,
    rates
  );
  if (!costI.ok) {
    errors.form = costI.message;
    return { isValid: false, errors, result: null };
  }

  const costII = convertMoney(
    iiCost.value!,
    input.optionIICostCurrency,
    input.loanCurrency,
    rates
  );
  if (!costII.ok) {
    errors.form = costII.message;
    return { isValid: false, errors, result: null };
  }

  const paymentType = input.manualAdjust ? input.paymentType : 'upfront';

  const computed = calculateMortgagePoints({
    loanAmount: loan.value!,
    termMonths,
    initialRatePercent: initialRate.value!,
    compounding: input.compounding,
    dueDate: input.dueDate,
    paymentType,
    optionIPoints: iPoints.value!,
    optionICost: costI.amount,
    optionIRatePercent: iRate.value!,
    optionIIPoints: iiPoints.value!,
    optionIICost: costII.amount,
    optionIIRatePercent: iiRate.value!,
  });

  if (!computed) {
    errors.form =
      'This combination does not produce a finite amortization. Check rates, term, and amounts.';
    return { isValid: false, errors, result: null };
  }

  const currency = input.loanCurrency;
  const result: MortgagePointsResult = {
    currency,
    optionI: toOptionSummary('Option I', computed.optionI, currency),
    optionII: toOptionSummary('Option II', computed.optionII, currency),
    baselineMonthlyPayment: computed.baselineMonthlyPayment,
    formattedBaselineMonthlyPayment: formatMortgagePointsMoney(
      computed.baselineMonthlyPayment,
      currency
    ),
    chart: computed.chart,
  };

  return { isValid: true, errors, result };
}
