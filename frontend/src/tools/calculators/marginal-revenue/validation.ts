import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateMarginalRevenue,
  formatMarginalRevenueMoney,
  formatQuantityChange,
} from './calculation';
import type {
  MarginalRevenueFieldErrors,
  MarginalRevenueInput,
  MarginalRevenueResult,
} from './types';

export interface MarginalRevenueValidation {
  isValid: boolean;
  errors: MarginalRevenueFieldErrors;
  result: MarginalRevenueResult | null;
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
 * Normalize initial revenue into the final-revenue currency, compute ΔTR/ΔQ at
 * full precision, then FX-convert ΔTR and MR into their display currencies.
 * Quantities never convert. MR is undefined (not an error) when ΔQ === 0.
 */
export function validateMarginalRevenueInput(
  input: MarginalRevenueInput,
  rates?: CurrencyRatesSnapshot | null
): MarginalRevenueValidation {
  const errors: MarginalRevenueFieldErrors = {};

  const initialRev = parseNumber(input.initialRevenue);
  const finalRev = parseNumber(input.finalRevenue);
  const initialQty = parseNumber(input.initialQuantity);
  const finalQty = parseNumber(input.finalQuantity);

  if (!initialRev.blank && (initialRev.invalid || initialRev.value === null)) {
    errors.initialRevenue = 'Enter a valid initial revenue.';
  }
  if (!finalRev.blank && (finalRev.invalid || finalRev.value === null)) {
    errors.finalRevenue = 'Enter a valid final revenue.';
  }
  if (!initialQty.blank && (initialQty.invalid || initialQty.value === null)) {
    errors.initialQuantity = 'Enter a valid initial quantity.';
  }
  if (!finalQty.blank && (finalQty.invalid || finalQty.value === null)) {
    errors.finalQuantity = 'Enter a valid final quantity.';
  }

  const incomplete =
    initialRev.blank ||
    finalRev.blank ||
    initialQty.blank ||
    finalQty.blank ||
    Boolean(errors.initialRevenue) ||
    Boolean(errors.finalRevenue) ||
    Boolean(errors.initialQuantity) ||
    Boolean(errors.finalQuantity);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.finalRevenueCurrency;
  const initialNormalized = convertMoney(
    initialRev.value!,
    input.initialRevenueCurrency,
    calcCurrency,
    rates
  );
  if (!initialNormalized.ok) {
    errors.form = initialNormalized.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateMarginalRevenue({
    initialRevenue: initialNormalized.amount,
    finalRevenue: finalRev.value!,
    initialQuantity: initialQty.value!,
    finalQuantity: finalQty.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const changeFx = convertMoney(
    computed.changeRevenue,
    calcCurrency,
    input.changeRevenueCurrency,
    rates
  );
  if (!changeFx.ok) {
    errors.form = changeFx.message;
    return { isValid: false, errors, result: null };
  }

  let marginalDisplay: number | null = null;
  if (!computed.undefinedMarginalRevenue && computed.marginalRevenue !== null) {
    const mrFx = convertMoney(
      computed.marginalRevenue,
      calcCurrency,
      input.marginalRevenueCurrency,
      rates
    );
    if (!mrFx.ok) {
      errors.form = mrFx.message;
      return { isValid: false, errors, result: null };
    }
    marginalDisplay = mrFx.amount;
  }

  const result: MarginalRevenueResult = {
    changeRevenueCanonical: computed.changeRevenue,
    changeQuantity: computed.changeQuantity,
    marginalRevenueCanonical: computed.marginalRevenue,
    changeRevenue: changeFx.amount,
    marginalRevenue: marginalDisplay,
    changeRevenueCurrency: input.changeRevenueCurrency,
    marginalRevenueCurrency: input.marginalRevenueCurrency,
    formattedChangeRevenue: formatMarginalRevenueMoney(
      changeFx.amount,
      input.changeRevenueCurrency
    ),
    formattedChangeQuantity: formatQuantityChange(computed.changeQuantity),
    formattedMarginalRevenue:
      marginalDisplay === null
        ? ''
        : formatMarginalRevenueMoney(
            marginalDisplay,
            input.marginalRevenueCurrency
          ),
    undefinedMarginalRevenue: computed.undefinedMarginalRevenue,
  };

  return { isValid: true, errors, result };
}
