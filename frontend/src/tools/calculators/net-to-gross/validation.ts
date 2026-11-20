import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  formatNetToGrossMoney,
  formatNetToGrossPercent,
  fromGrossAndRateFromGross,
  fromGrossAndRateFromNet,
  fromGrossAndTax,
  fromNetAndGross,
  fromNetAndRateFromGross,
  fromNetAndRateFromNet,
  fromNetAndTax,
} from './calculation';
import type {
  NetToGrossFieldErrors,
  NetToGrossInput,
  NetToGrossResult,
} from './types';

export interface NetToGrossValidation {
  isValid: boolean;
  errors: NetToGrossFieldErrors;
  result: NetToGrossResult | null;
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
  const converted = convertCurrency({ amount, from, to, rates: rates.rates });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

export function validateNetToGrossInput(
  input: NetToGrossInput,
  rates?: CurrencyRatesSnapshot | null
): NetToGrossValidation {
  const errors: NetToGrossFieldErrors = {};
  const net = parseNumber(input.netAmount);
  const gross = parseNumber(input.grossAmount);
  const tax = parseNumber(input.taxAmount);
  const rN = parseNumber(input.rateFromNet);
  const rG = parseNumber(input.rateFromGross);

  const calcCurrency: SupportedCurrency =
    input.driver === 'gross' || input.driver === 'rateFromGross'
      ? input.grossCurrency
      : input.driver === 'tax'
        ? input.taxCurrency
        : input.netCurrency;

  let computed = null as ReturnType<typeof fromNetAndRateFromNet>;

  switch (input.driver) {
    case 'net':
    case 'rateFromNet': {
      if (net.blank) errors.netAmount = 'Enter a net amount.';
      else if (net.invalid || net.value === null || net.value < 0) {
        errors.netAmount = 'Enter a valid nonnegative net amount.';
      }
      if (rN.blank && !rG.blank && rG.value != null) {
        if (rG.invalid || rG.value < 0 || rG.value >= 100) {
          errors.rateFromGross = 'Gross-based tax rate must be ≥ 0 and < 100%.';
        } else if (!errors.netAmount) {
          computed = fromNetAndRateFromGross(net.value!, rG.value);
        }
      } else {
        if (rN.blank) errors.rateFromNet = 'Enter percentage tax (from net).';
        else if (rN.invalid || rN.value === null || rN.value < 0) {
          errors.rateFromNet = 'Enter a valid nonnegative net-based tax rate.';
        } else if (!errors.netAmount) {
          computed = fromNetAndRateFromNet(net.value!, rN.value);
        }
      }
      break;
    }
    case 'gross':
    case 'rateFromGross': {
      if (gross.blank) errors.grossAmount = 'Enter a gross amount.';
      else if (gross.invalid || gross.value === null || gross.value < 0) {
        errors.grossAmount = 'Enter a valid nonnegative gross amount.';
      }
      if (rG.blank && !rN.blank && rN.value != null) {
        if (rN.invalid || rN.value < 0) {
          errors.rateFromNet = 'Enter a valid nonnegative net-based tax rate.';
        } else if (!errors.grossAmount) {
          computed = fromGrossAndRateFromNet(gross.value!, rN.value);
        }
      } else {
        if (rG.blank) errors.rateFromGross = 'Enter percentage tax (from gross).';
        else if (rG.invalid || rG.value === null || rG.value < 0 || rG.value >= 100) {
          errors.rateFromGross = 'Gross-based tax rate must be ≥ 0 and < 100%.';
        } else if (!errors.grossAmount) {
          computed = fromGrossAndRateFromGross(gross.value!, rG.value);
        }
      }
      break;
    }
    case 'tax': {
      if (tax.blank) errors.taxAmount = 'Enter a tax amount.';
      else if (tax.invalid || tax.value === null || tax.value < 0) {
        errors.taxAmount = 'Enter a valid nonnegative tax amount.';
      }
      if (!net.blank && net.value != null && !errors.taxAmount) {
        if (net.invalid || net.value < 0) {
          errors.netAmount = 'Enter a valid nonnegative net amount.';
        } else {
          computed = fromNetAndTax(net.value, tax.value!);
        }
      } else if (!gross.blank && gross.value != null && !errors.taxAmount) {
        if (gross.invalid || gross.value < 0) {
          errors.grossAmount = 'Enter a valid nonnegative gross amount.';
        } else {
          computed = fromGrossAndTax(gross.value, tax.value!);
        }
      } else if (!errors.taxAmount) {
        errors.form = 'Also enter net or gross with the tax amount.';
      }
      break;
    }
  }

  // Prefer net+gross when both money sides filled and driver is money
  if (
    !computed &&
    !net.blank &&
    !gross.blank &&
    net.value != null &&
    gross.value != null &&
    (input.driver === 'net' || input.driver === 'gross')
  ) {
    computed = fromNetAndGross(net.value, gross.value);
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (!computed) {
    errors.form = 'Unable to calculate with the current inputs.';
    return { isValid: false, errors, result: null };
  }

  const netDisplay = convertMoney(computed.net, calcCurrency, input.netCurrency, rates);
  if (!netDisplay.ok) return { isValid: false, errors: { form: netDisplay.message }, result: null };
  const grossDisplay = convertMoney(
    computed.gross,
    calcCurrency,
    input.grossCurrency,
    rates
  );
  if (!grossDisplay.ok) {
    return { isValid: false, errors: { form: grossDisplay.message }, result: null };
  }
  const taxDisplay = convertMoney(computed.tax, calcCurrency, input.taxCurrency, rates);
  if (!taxDisplay.ok) {
    return { isValid: false, errors: { form: taxDisplay.message }, result: null };
  }

  const result: NetToGrossResult = {
    netCanonical: computed.net,
    grossCanonical: computed.gross,
    taxCanonical: computed.tax,
    rateFromNet: computed.rateFromNet,
    rateFromGross: computed.rateFromGross,
    netAmount: netDisplay.amount,
    grossAmount: grossDisplay.amount,
    taxAmount: taxDisplay.amount,
    netCurrency: input.netCurrency,
    grossCurrency: input.grossCurrency,
    taxCurrency: input.taxCurrency,
    calcCurrency,
    formattedNetAmount: formatNetToGrossMoney(netDisplay.amount, input.netCurrency),
    formattedGrossAmount: formatNetToGrossMoney(
      grossDisplay.amount,
      input.grossCurrency
    ),
    formattedTaxAmount: formatNetToGrossMoney(taxDisplay.amount, input.taxCurrency),
    formattedRateFromNet: formatNetToGrossPercent(computed.rateFromNet),
    formattedRateFromGross: formatNetToGrossPercent(computed.rateFromGross),
  };

  return { isValid: true, errors: {}, result };
}
