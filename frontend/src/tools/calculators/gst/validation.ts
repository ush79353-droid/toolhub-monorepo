import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  GST_PERCENT_MAX,
  calculateFromGross,
  calculateFromNet,
  formatGstMoney,
  formatGstPercent,
} from './calculation';
import type { GstFieldErrors, GstInput, GstResult } from './types';

export interface GstValidation {
  isValid: boolean;
  errors: GstFieldErrors;
  result: GstResult | null;
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

export function validateGstInput(
  input: GstInput,
  rates?: CurrencyRatesSnapshot | null
): GstValidation {
  const errors: GstFieldErrors = {};
  const rate = parseNumber(input.gstPercent);
  const net = parseNumber(input.netPrice);
  const gross = parseNumber(input.grossPrice);

  if (rate.blank) {
    errors.gstPercent = 'Enter a GST rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.gstPercent = 'Enter a valid GST rate.';
  } else if (rate.value < 0) {
    errors.gstPercent = 'GST rate must be zero or greater.';
  } else if (rate.value > GST_PERCENT_MAX) {
    errors.gstPercent = `GST rate cannot exceed ${GST_PERCENT_MAX}%.`;
  }

  const calcCurrency: SupportedCurrency =
    input.driver === 'gross' ? input.grossCurrency : input.netCurrency;

  if (input.driver === 'net') {
    if (net.blank) errors.netPrice = 'Enter a net price.';
    else if (net.invalid || net.value === null) errors.netPrice = 'Enter a valid net price.';
    else if (net.value < 0) errors.netPrice = 'Net price cannot be negative.';
  } else {
    if (gross.blank) errors.grossPrice = 'Enter a gross price.';
    else if (gross.invalid || gross.value === null) {
      errors.grossPrice = 'Enter a valid gross price.';
    } else if (gross.value < 0) {
      errors.grossPrice = 'Gross price cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0 || rate.value === null) {
    return { isValid: false, errors, result: null };
  }

  const computed =
    input.driver === 'net'
      ? calculateFromNet(net.value!, rate.value)
      : calculateFromGross(gross.value!, rate.value);

  if (!computed) {
    errors.form = 'Unable to calculate GST with the current inputs.';
    return { isValid: false, errors, result: null };
  }

  const netDisplay = convertMoney(
    computed.netPrice,
    calcCurrency,
    input.netCurrency,
    rates
  );
  if (!netDisplay.ok) {
    errors.form = netDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const grossDisplay = convertMoney(
    computed.grossPrice,
    calcCurrency,
    input.grossCurrency,
    rates
  );
  if (!grossDisplay.ok) {
    errors.form = grossDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const taxDisplay = convertMoney(
    computed.taxAmount,
    calcCurrency,
    input.taxAmountCurrency,
    rates
  );
  if (!taxDisplay.ok) {
    errors.form = taxDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: GstResult = {
    gstPercent: rate.value,
    netPriceCanonical: computed.netPrice,
    grossPriceCanonical: computed.grossPrice,
    taxAmountCanonical: computed.taxAmount,
    netPrice: netDisplay.amount,
    grossPrice: grossDisplay.amount,
    taxAmount: taxDisplay.amount,
    netCurrency: input.netCurrency,
    grossCurrency: input.grossCurrency,
    taxAmountCurrency: input.taxAmountCurrency,
    calcCurrency,
    formattedNetPrice: formatGstMoney(netDisplay.amount, input.netCurrency),
    formattedGrossPrice: formatGstMoney(grossDisplay.amount, input.grossCurrency),
    formattedTaxAmount: formatGstMoney(taxDisplay.amount, input.taxAmountCurrency),
    formattedGstPercent: formatGstPercent(rate.value),
  };

  return { isValid: true, errors: {}, result };
}
