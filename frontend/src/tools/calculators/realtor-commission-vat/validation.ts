import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateRealtorCommissionVat,
  formatRealtorMoney,
} from './calculation';
import type {
  RealtorCommissionVatFieldErrors,
  RealtorCommissionVatInput,
  RealtorCommissionVatResult,
} from './types';

export interface RealtorCommissionVatValidation {
  isValid: boolean;
  errors: RealtorCommissionVatFieldErrors;
  result: RealtorCommissionVatResult | null;
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
 * Validates inputs, computes VAT-exclusive commission in house-price currency
 * at full precision, then converts gross and owner proceeds into independent
 * display currencies. Commission % and VAT % are never FX-converted.
 */
export function validateRealtorCommissionVatInput(
  input: RealtorCommissionVatInput,
  rates?: CurrencyRatesSnapshot | null
): RealtorCommissionVatValidation {
  const errors: RealtorCommissionVatFieldErrors = {};

  const house = parseNumber(input.housePrice);
  const commission = parseNumber(input.commissionPercent);
  const vat = parseNumber(input.vatRatePercent);

  if (!house.blank && (house.invalid || house.value === null)) {
    errors.housePrice = 'Enter a valid house price.';
  } else if (!house.blank && house.value !== null && house.value < 0) {
    errors.housePrice = 'House price cannot be negative.';
  }

  if (!commission.blank && (commission.invalid || commission.value === null)) {
    errors.commissionPercent = 'Enter a valid commission rate.';
  } else if (!commission.blank && commission.value !== null && commission.value < 0) {
    errors.commissionPercent = 'Commission rate cannot be negative.';
  }

  if (!vat.blank && (vat.invalid || vat.value === null)) {
    errors.vatRatePercent = 'Enter a valid VAT rate.';
  } else if (!vat.blank && vat.value !== null && vat.value < 0) {
    errors.vatRatePercent = 'VAT rate cannot be negative.';
  }

  const incomplete =
    house.blank ||
    commission.blank ||
    vat.blank ||
    Boolean(errors.housePrice) ||
    Boolean(errors.commissionPercent) ||
    Boolean(errors.vatRatePercent);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateRealtorCommissionVat({
    housePrice: house.value!,
    commissionPercent: commission.value!,
    vatRatePercent: vat.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const grossOut = convertMoney(
    computed.commissionGross,
    input.housePriceCurrency,
    input.commissionGrossCurrency,
    rates
  );
  if (!grossOut.ok) {
    errors.form = grossOut.message;
    return { isValid: false, errors, result: null };
  }

  const ownerOut = convertMoney(
    computed.ownerReceives,
    input.housePriceCurrency,
    input.ownerReceivesCurrency,
    rates
  );
  if (!ownerOut.ok) {
    errors.form = ownerOut.message;
    return { isValid: false, errors, result: null };
  }

  const result: RealtorCommissionVatResult = {
    netCommissionInHouseCurrency: computed.netCommission,
    vatAmountInHouseCurrency: computed.vatAmount,
    commissionGrossInHouseCurrency: computed.commissionGross,
    ownerReceivesInHouseCurrency: computed.ownerReceives,
    commissionGross: grossOut.amount,
    ownerReceives: ownerOut.amount,
    housePriceCurrency: input.housePriceCurrency,
    commissionGrossCurrency: input.commissionGrossCurrency,
    ownerReceivesCurrency: input.ownerReceivesCurrency,
    formattedNetCommission: formatRealtorMoney(
      computed.netCommission,
      input.housePriceCurrency
    ),
    formattedVatAmount: formatRealtorMoney(
      computed.vatAmount,
      input.housePriceCurrency
    ),
    formattedCommissionGross: formatRealtorMoney(
      grossOut.amount,
      input.commissionGrossCurrency
    ),
    formattedOwnerReceives: formatRealtorMoney(
      ownerOut.amount,
      input.ownerReceivesCurrency
    ),
  };

  return { isValid: true, errors, result };
}
