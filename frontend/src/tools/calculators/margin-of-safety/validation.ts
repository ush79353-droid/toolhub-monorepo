import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateMarginOfSafety,
  deriveCurrentSalesFromPerUnit,
  formatMoneyDisplay,
  formatPercentDisplay,
  formatRatioDisplay,
  formatUnitsDisplay,
} from './calculation';
import type {
  MarginOfSafetyFieldErrors,
  MarginOfSafetyInput,
  MarginOfSafetyResult,
} from './types';

export interface MarginOfSafetyValidation {
  isValid: boolean;
  errors: MarginOfSafetyFieldErrors;
  result: MarginOfSafetyResult | null;
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
 * Normalizes money into the current-sales currency, computes MoS metrics at full
 * precision, then converts the monetary MoS into the result currency for display.
 * Cost price is accepted for screenshot parity but is not used in MoS formulas
 * (breakeven is not derived from unit cost alone).
 */
export function validateMarginOfSafetyInput(
  input: MarginOfSafetyInput,
  rates?: CurrencyRatesSnapshot | null
): MarginOfSafetyValidation {
  const errors: MarginOfSafetyFieldErrors = {};

  const current = parseNumber(input.currentSales);
  const breakeven = parseNumber(input.breakevenSales);
  const volume = parseNumber(input.salesVolume);
  const selling = parseNumber(input.sellingPricePerUnit);
  const cost = parseNumber(input.costPricePerUnit);

  if (!current.blank && (current.invalid || current.value === null)) {
    errors.currentSales = 'Enter a valid current sales amount.';
  }
  if (!breakeven.blank && (breakeven.invalid || breakeven.value === null)) {
    errors.breakevenSales = 'Enter a valid breakeven sales amount.';
  }
  if (!volume.blank && (volume.invalid || volume.value === null)) {
    errors.salesVolume = 'Enter a valid sales volume.';
  }
  if (!selling.blank && (selling.invalid || selling.value === null)) {
    errors.sellingPricePerUnit = 'Enter a valid selling price per unit.';
  }
  if (!cost.blank && (cost.invalid || cost.value === null)) {
    errors.costPricePerUnit = 'Enter a valid cost price per unit.';
  }

  const hasFieldErrors = Object.keys(errors).length > 0;

  // Effective current sales: prefer volume × selling price when both present.
  let effectiveCurrent: number | null = null;
  let usedPerUnit = false;

  if (
    !volume.blank &&
    !selling.blank &&
    volume.value !== null &&
    selling.value !== null &&
    !volume.invalid &&
    !selling.invalid
  ) {
    const sellingInCurrent = convertMoney(
      selling.value,
      input.sellingPriceCurrency,
      input.currentSalesCurrency,
      rates
    );
    if (!sellingInCurrent.ok) {
      errors.form = sellingInCurrent.message;
      return { isValid: false, errors, result: null };
    }
    const derived = deriveCurrentSalesFromPerUnit(volume.value, sellingInCurrent.amount);
    if (derived === null) {
      errors.form = 'Sales volume × selling price does not produce a finite sales amount.';
      return { isValid: false, errors, result: null };
    }
    effectiveCurrent = derived;
    usedPerUnit = true;
  } else if (!current.blank && current.value !== null && !current.invalid) {
    effectiveCurrent = current.value;
  }

  if (breakeven.blank || effectiveCurrent === null || hasFieldErrors) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.currentSalesCurrency;

  const breakevenNormalized = convertMoney(
    breakeven.value!,
    input.breakevenSalesCurrency,
    calcCurrency,
    rates
  );
  if (!breakevenNormalized.ok) {
    errors.form = breakevenNormalized.message;
    return { isValid: false, errors, result: null };
  }

  let sellingNormalized: number | null = null;
  if (!selling.blank && selling.value !== null && !selling.invalid) {
    const converted = convertMoney(
      selling.value,
      input.sellingPriceCurrency,
      calcCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    sellingNormalized = converted.amount;
  }

  // Cost price: convert check only (not used in formulas).
  if (!cost.blank && cost.value !== null && !cost.invalid) {
    const costCheck = convertMoney(
      cost.value,
      input.costPriceCurrency,
      calcCurrency,
      rates
    );
    if (!costCheck.ok) {
      errors.form = costCheck.message;
      return { isValid: false, errors, result: null };
    }
  }

  const calc = calculateMarginOfSafety({
    currentSales: effectiveCurrent,
    breakevenSales: breakevenNormalized.amount,
    sellingPricePerUnit: sellingNormalized,
  });

  if (calc === null) {
    errors.form = 'This combination does not produce a finite margin of safety.';
    return { isValid: false, errors, result: null };
  }

  const mosInResult = convertMoney(
    calc.marginOfSafety,
    calcCurrency,
    input.resultCurrency,
    rates
  );
  if (!mosInResult.ok) {
    errors.form = mosInResult.message;
    return { isValid: false, errors, result: null };
  }

  void usedPerUnit;

  const result: MarginOfSafetyResult = {
    marginOfSafety: mosInResult.amount,
    marginOfSafetyRatio: calc.marginOfSafetyRatio,
    marginOfSafetyPercent: calc.marginOfSafetyPercent,
    marginOfSafetyUnits: calc.marginOfSafetyUnits,
    currentSalesNormalized: effectiveCurrent,
    breakevenSalesNormalized: breakevenNormalized.amount,
    calcCurrency,
    resultCurrency: input.resultCurrency,
    formattedMarginOfSafety: formatMoneyDisplay(mosInResult.amount),
    formattedRatio:
      calc.marginOfSafetyRatio === null
        ? ''
        : formatRatioDisplay(calc.marginOfSafetyRatio),
    formattedPercent:
      calc.marginOfSafetyPercent === null
        ? ''
        : formatPercentDisplay(calc.marginOfSafetyPercent),
    formattedUnits:
      calc.marginOfSafetyUnits === null
        ? ''
        : formatUnitsDisplay(calc.marginOfSafetyUnits),
  };

  return { isValid: true, errors: {}, result };
}
