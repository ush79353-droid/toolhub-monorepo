import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateRealEstateCommission,
  formatRealEstateCommissionMoney,
} from './calculation';
import type {
  RealEstateCommissionFieldErrors,
  RealEstateCommissionInput,
  RealEstateCommissionResult,
} from './types';

export interface RealEstateCommissionValidation {
  isValid: boolean;
  errors: RealEstateCommissionFieldErrors;
  result: RealEstateCommissionResult | null;
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
 * Validates house price (≥ 0) and commission rate (0–100), computes commission
 * and owner proceeds in the house-price currency at full precision, then FX-
 * converts each result into its independent display currency. The commission
 * percent is never converted.
 */
export function validateRealEstateCommissionInput(
  input: RealEstateCommissionInput,
  rates?: CurrencyRatesSnapshot | null
): RealEstateCommissionValidation {
  const errors: RealEstateCommissionFieldErrors = {};

  const price = parseNumber(input.housePrice);
  const rate = parseNumber(input.commissionPercent);

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.housePrice = 'Enter a valid house price.';
  } else if (price.value !== null && price.value < 0) {
    errors.housePrice = 'House price must be zero or greater.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.commissionPercent = 'Enter a valid commission rate.';
  } else if (rate.value !== null && (rate.value < 0 || rate.value > 100)) {
    errors.commissionPercent = 'Commission rate must be between 0% and 100%.';
  }

  const incomplete =
    price.blank ||
    rate.blank ||
    Boolean(errors.housePrice) ||
    Boolean(errors.commissionPercent);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateRealEstateCommission({
    housePrice: price.value!,
    commissionPercent: rate.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const houseCurrency = input.housePriceCurrency;

  const commissionFx = convertMoney(
    computed.commissionAmount,
    houseCurrency,
    input.commissionAmountCurrency,
    rates
  );
  if (!commissionFx.ok) {
    errors.form = commissionFx.message;
    return { isValid: false, errors, result: null };
  }

  const ownerFx = convertMoney(
    computed.ownerReceives,
    houseCurrency,
    input.ownerReceivesCurrency,
    rates
  );
  if (!ownerFx.ok) {
    errors.form = ownerFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: RealEstateCommissionResult = {
    commissionAmountCanonical: computed.commissionAmount,
    ownerReceivesCanonical: computed.ownerReceives,
    commissionAmount: commissionFx.amount,
    ownerReceives: ownerFx.amount,
    housePriceCurrency: houseCurrency,
    commissionAmountCurrency: input.commissionAmountCurrency,
    ownerReceivesCurrency: input.ownerReceivesCurrency,
    formattedCommissionAmount: formatRealEstateCommissionMoney(
      commissionFx.amount,
      input.commissionAmountCurrency
    ),
    formattedOwnerReceives: formatRealEstateCommissionMoney(
      ownerFx.amount,
      input.ownerReceivesCurrency
    ),
  };

  return { isValid: true, errors, result };
}
