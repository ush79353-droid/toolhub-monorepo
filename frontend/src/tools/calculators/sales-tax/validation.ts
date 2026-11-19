import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateFromGross,
  calculateFromNet,
  formatSalesTaxMoney,
  formatSalesTaxPercent,
} from './calculation';
import type {
  SalesTaxFieldErrors,
  SalesTaxInput,
  SalesTaxResult,
} from './types';

export interface SalesTaxValidation {
  isValid: boolean;
  errors: SalesTaxFieldErrors;
  result: SalesTaxResult | null;
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

export function validateSalesTaxInput(
  input: SalesTaxInput,
  rates?: CurrencyRatesSnapshot | null
): SalesTaxValidation {
  const errors: SalesTaxFieldErrors = {};
  const rate = parseNumber(input.salesTaxPercent);
  const net = parseNumber(input.netPrice);
  const gross = parseNumber(input.grossPrice);

  if (rate.blank) {
    errors.salesTaxPercent = 'Enter a sales tax rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.salesTaxPercent = 'Enter a valid sales tax rate.';
  } else if (!(rate.value > -100)) {
    errors.salesTaxPercent = 'Sales tax rate must be greater than −100%.';
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

  let computed;
  if (input.driver === 'net') {
    computed = calculateFromNet(net.value!, rate.value);
  } else {
    computed = calculateFromGross(gross.value!, rate.value);
  }

  if (!computed) {
    errors.form = 'Unable to calculate sales tax with the current inputs.';
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

  const result: SalesTaxResult = {
    salesTaxPercent: rate.value,
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
    formattedNetPrice: formatSalesTaxMoney(netDisplay.amount, input.netCurrency),
    formattedGrossPrice: formatSalesTaxMoney(grossDisplay.amount, input.grossCurrency),
    formattedTaxAmount: formatSalesTaxMoney(taxDisplay.amount, input.taxAmountCurrency),
    formattedSalesTaxPercent: formatSalesTaxPercent(rate.value),
  };

  return { isValid: true, errors: {}, result };
}
