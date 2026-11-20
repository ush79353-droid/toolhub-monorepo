import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateGrossToNet,
  calculateNetToGross,
  formatGrossToNetMoney,
  formatGrossToNetPercent,
} from './calculation';
import type {
  GrossToNetFieldErrors,
  GrossToNetInput,
  GrossToNetResult,
} from './types';

export interface GrossToNetValidation {
  isValid: boolean;
  errors: GrossToNetFieldErrors;
  result: GrossToNetResult | null;
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

export function validateGrossToNetInput(
  input: GrossToNetInput,
  rates?: CurrencyRatesSnapshot | null
): GrossToNetValidation {
  const errors: GrossToNetFieldErrors = {};
  const rate = parseNumber(input.taxRatePercent);
  const gross = parseNumber(input.grossAmount);
  const net = parseNumber(input.netAmount);

  if (rate.blank) {
    errors.taxRatePercent = 'Enter a tax rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.taxRatePercent = 'Enter a valid tax rate.';
  } else if (input.mode === 'gross-to-net') {
    if (!(rate.value >= 0 && rate.value <= 100)) {
      errors.taxRatePercent = 'Tax rate must be between 0% and 100%.';
    }
  } else if (!(rate.value >= 0 && rate.value < 100)) {
    errors.taxRatePercent =
      rate.value === 100
        ? 'At 100% tax, net-to-gross is undefined (cannot reverse).'
        : 'Tax rate must be between 0% and under 100% for net-to-gross.';
  }

  const calcCurrency: SupportedCurrency =
    input.mode === 'gross-to-net' ? input.grossCurrency : input.netCurrency;

  if (input.mode === 'gross-to-net') {
    if (gross.blank) errors.grossAmount = 'Enter a gross amount.';
    else if (gross.invalid || gross.value === null) {
      errors.grossAmount = 'Enter a valid gross amount.';
    } else if (gross.value < 0) {
      errors.grossAmount = 'Gross amount cannot be negative.';
    }
  } else {
    if (net.blank) errors.netAmount = 'Enter a net amount.';
    else if (net.invalid || net.value === null) {
      errors.netAmount = 'Enter a valid net amount.';
    } else if (net.value < 0) {
      errors.netAmount = 'Net amount cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0 || rate.value === null) {
    return { isValid: false, errors, result: null };
  }

  const computed =
    input.mode === 'gross-to-net'
      ? calculateGrossToNet(gross.value!, rate.value)
      : calculateNetToGross(net.value!, rate.value);

  if (!computed) {
    errors.form = 'Unable to calculate with the current inputs.';
    return { isValid: false, errors, result: null };
  }

  const grossDisplay = convertMoney(
    computed.grossAmount,
    calcCurrency,
    input.grossCurrency,
    rates
  );
  if (!grossDisplay.ok) {
    errors.form = grossDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const netDisplay = convertMoney(
    computed.netAmount,
    calcCurrency,
    input.netCurrency,
    rates
  );
  if (!netDisplay.ok) {
    errors.form = netDisplay.message;
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

  const result: GrossToNetResult = {
    mode: input.mode,
    taxRatePercent: rate.value,
    grossCanonical: computed.grossAmount,
    netCanonical: computed.netAmount,
    taxCanonical: computed.taxAmount,
    grossAmount: grossDisplay.amount,
    netAmount: netDisplay.amount,
    taxAmount: taxDisplay.amount,
    grossCurrency: input.grossCurrency,
    netCurrency: input.netCurrency,
    taxAmountCurrency: input.taxAmountCurrency,
    calcCurrency,
    formattedGrossAmount: formatGrossToNetMoney(
      grossDisplay.amount,
      input.grossCurrency
    ),
    formattedNetAmount: formatGrossToNetMoney(
      netDisplay.amount,
      input.netCurrency
    ),
    formattedTaxAmount: formatGrossToNetMoney(
      taxDisplay.amount,
      input.taxAmountCurrency
    ),
    formattedTaxRatePercent: formatGrossToNetPercent(rate.value),
  };

  return { isValid: true, errors: {}, result };
}
