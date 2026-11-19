import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculatePriceToCashFlow,
  formatPriceCashFlowMoney,
  formatPriceToCashFlowRatio,
} from './calculation';
import type {
  PriceToCashFlowFieldErrors,
  PriceToCashFlowInput,
  PriceToCashFlowResult,
} from './types';

export interface PriceToCashFlowValidation {
  isValid: boolean;
  errors: PriceToCashFlowFieldErrors;
  result: PriceToCashFlowResult | null;
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
 * Validates inputs, normalizes price into the cash-flow currency, computes
 * CFPS and P/CF at full precision, then converts CFPS into its independent
 * display currency. Share counts and the dimensionless ratio are never
 * FX-converted. Zero CFPS → ratio undefined (not Infinity).
 */
export function validatePriceToCashFlowInput(
  input: PriceToCashFlowInput,
  rates?: CurrencyRatesSnapshot | null
): PriceToCashFlowValidation {
  const errors: PriceToCashFlowFieldErrors = {};

  const cashFlow = parseNumber(input.cashFlow);
  const shares = parseNumber(input.sharesOutstanding);
  const price = parseNumber(input.pricePerShare);

  if (!cashFlow.blank && (cashFlow.invalid || cashFlow.value === null)) {
    errors.cashFlow = 'Enter a valid cash flow amount.';
  }

  if (!shares.blank && (shares.invalid || shares.value === null)) {
    errors.sharesOutstanding = 'Enter a valid number of shares.';
  } else if (!shares.blank && shares.value !== null && !(shares.value > 0)) {
    errors.sharesOutstanding = 'Shares outstanding must be greater than zero.';
  }

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.pricePerShare = 'Enter a valid price per share.';
  } else if (!price.blank && price.value !== null && price.value < 0) {
    errors.pricePerShare = 'Price per share cannot be negative.';
  }

  const incomplete =
    cashFlow.blank ||
    shares.blank ||
    Boolean(errors.cashFlow) ||
    Boolean(errors.sharesOutstanding);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  let priceInCashFlow: number | null = null;
  if (!price.blank && !errors.pricePerShare && price.value !== null) {
    const converted = convertMoney(
      price.value,
      input.pricePerShareCurrency,
      input.cashFlowCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    priceInCashFlow = converted.amount;
  }

  const computed = calculatePriceToCashFlow({
    cashFlow: cashFlow.value!,
    sharesOutstanding: shares.value!,
    // Invalid/blank price → CFPS only (no misleading ratio).
    pricePerShare: priceInCashFlow,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const cfpsOut = convertMoney(
    computed.cashFlowPerShare,
    input.cashFlowCurrency,
    input.cashFlowPerShareCurrency,
    rates
  );
  if (!cfpsOut.ok) {
    errors.form = cfpsOut.message;
    return { isValid: false, errors, result: null };
  }

  const negativeRatioNote =
    computed.priceToCashFlowRatio !== null && computed.priceToCashFlowRatio < 0
      ? 'Negative P/CF ratios are generally unsuitable for conventional valuation comparison.'
      : null;

  const result: PriceToCashFlowResult = {
    cashFlowPerShareInCashFlowCurrency: computed.cashFlowPerShare,
    cashFlowPerShare: cfpsOut.amount,
    priceToCashFlowRatio: computed.priceToCashFlowRatio,
    ratioUndefined: computed.ratioUndefined,
    cashFlowCurrency: input.cashFlowCurrency,
    cashFlowPerShareCurrency: input.cashFlowPerShareCurrency,
    pricePerShareCurrency: input.pricePerShareCurrency,
    formattedCashFlowPerShare: formatPriceCashFlowMoney(
      cfpsOut.amount,
      input.cashFlowPerShareCurrency
    ),
    formattedPriceToCashFlowRatio:
      computed.priceToCashFlowRatio !== null
        ? formatPriceToCashFlowRatio(computed.priceToCashFlowRatio)
        : null,
    negativeRatioNote,
  };

  return { isValid: true, errors, result };
}
