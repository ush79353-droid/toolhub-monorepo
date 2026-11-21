import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateCashFlowToDebtPercent,
  calculateDebtToCashFlowRatio,
  formatDebtMultiple,
  formatRatioPercent,
  sumDebtComponents,
} from './calculation';
import type {
  CashFlowToDebtRatioFieldErrors,
  CashFlowToDebtRatioInput,
  CashFlowToDebtRatioResult,
} from './types';

export interface CashFlowToDebtRatioValidation {
  isValid: boolean;
  errors: CashFlowToDebtRatioFieldErrors;
  result: CashFlowToDebtRatioResult | null;
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
 * Normalize OCF into total-debt currency (or component sum currency), then compute ratios.
 * Percentages and dimensionless multiples are never FX-converted.
 */
export function validateCashFlowToDebtRatioInput(
  input: CashFlowToDebtRatioInput,
  rates?: CurrencyRatesSnapshot | null
): CashFlowToDebtRatioValidation {
  const errors: CashFlowToDebtRatioFieldErrors = {};
  const ocf = parseNumber(input.operatingCashFlow);
  const totalDebt = parseNumber(input.totalDebt);
  const shortTerm = parseNumber(input.shortTermDebt);
  const longTerm = parseNumber(input.longTermDebt);

  if (!ocf.blank && (ocf.invalid || ocf.value === null)) {
    errors.operatingCashFlow = 'Enter a valid operating cash flow amount.';
  }

  if (input.debtComponentsOpen) {
    if (!shortTerm.blank && (shortTerm.invalid || shortTerm.value === null)) {
      errors.shortTermDebt = 'Enter a valid short-term debt amount.';
    } else if (!shortTerm.blank && shortTerm.value !== null && shortTerm.value < 0) {
      errors.shortTermDebt = 'Short-term debt cannot be negative.';
    }
    if (!longTerm.blank && (longTerm.invalid || longTerm.value === null)) {
      errors.longTermDebt = 'Enter a valid long-term debt amount.';
    } else if (!longTerm.blank && longTerm.value !== null && longTerm.value < 0) {
      errors.longTermDebt = 'Long-term debt cannot be negative.';
    }
  } else if (!totalDebt.blank && (totalDebt.invalid || totalDebt.value === null)) {
    errors.totalDebt = 'Enter a valid total debt amount.';
  } else if (!totalDebt.blank && totalDebt.value !== null && totalDebt.value < 0) {
    errors.totalDebt = 'Total debt cannot be negative.';
  }

  const needsComponents =
    input.debtComponentsOpen && (shortTerm.blank || longTerm.blank);
  const needsTotal = !input.debtComponentsOpen && totalDebt.blank;
  const incomplete =
    ocf.blank ||
    needsComponents ||
    needsTotal ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.totalDebtCurrency;

  const ocfInCalc = convertMoney(
    ocf.value!,
    input.ocfCurrency,
    calcCurrency,
    rates
  );
  if (!ocfInCalc.ok) {
    errors.form = ocfInCalc.message;
    return { isValid: false, errors, result: null };
  }

  let totalDebtNormalized: number;
  if (input.debtComponentsOpen) {
    const stInCalc = convertMoney(
      shortTerm.value!,
      input.shortTermDebtCurrency,
      calcCurrency,
      rates
    );
    if (!stInCalc.ok) {
      errors.form = stInCalc.message;
      return { isValid: false, errors, result: null };
    }
    const ltInCalc = convertMoney(
      longTerm.value!,
      input.longTermDebtCurrency,
      calcCurrency,
      rates
    );
    if (!ltInCalc.ok) {
      errors.form = ltInCalc.message;
      return { isValid: false, errors, result: null };
    }
    const summed = sumDebtComponents(stInCalc.amount, ltInCalc.amount);
    if (summed === null) {
      errors.form = 'Unable to sum short-term and long-term debt.';
      return { isValid: false, errors, result: null };
    }
    totalDebtNormalized = summed;
  } else {
    totalDebtNormalized = totalDebt.value!;
  }

  const cashFlowToDebtPercent = calculateCashFlowToDebtPercent(
    ocfInCalc.amount,
    totalDebtNormalized
  );
  const debtToCashFlowRatio = calculateDebtToCashFlowRatio(
    totalDebtNormalized,
    ocfInCalc.amount
  );

  if (totalDebtNormalized === 0 && cashFlowToDebtPercent !== null) {
    errors.form = 'Cash flow to debt is undefined when total debt is zero.';
    return { isValid: false, errors, result: null };
  }

  const formattedCashFlowToDebtPercent =
    cashFlowToDebtPercent === null
      ? 'undefined'
      : formatRatioPercent(cashFlowToDebtPercent);
  const formattedDebtToCashFlowRatio =
    debtToCashFlowRatio === null
      ? 'undefined'
      : formatDebtMultiple(debtToCashFlowRatio);

  let summaryText: string;
  if (cashFlowToDebtPercent === null) {
    summaryText =
      'Cash flow to debt ratio is undefined when total debt is zero (division by zero avoided).';
  } else if (cashFlowToDebtPercent < 0) {
    summaryText = `Cash flow to debt ratio = ${formattedCashFlowToDebtPercent}% (negative operating cash flow).`;
  } else {
    summaryText = `Cash flow to debt ratio = ${formattedCashFlowToDebtPercent}%.`;
  }
  if (debtToCashFlowRatio === null) {
    summaryText +=
      ' Debt to cash flow ratio is undefined when operating cash flow is zero.';
  } else {
    summaryText += ` Debt to cash flow = ${formattedDebtToCashFlowRatio}x.`;
  }

  const result: CashFlowToDebtRatioResult = {
    ocfNormalized: ocfInCalc.amount,
    totalDebtNormalized,
    cashFlowToDebtPercent,
    debtToCashFlowRatio,
    calcCurrency,
    formattedCashFlowToDebtPercent,
    formattedDebtToCashFlowRatio,
    summaryText,
  };

  return { isValid: true, errors: {}, result };
}
