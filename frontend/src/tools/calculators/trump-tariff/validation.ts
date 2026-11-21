import { calculateTrumpTariff } from './calculation';
import {
  ORIGIN_COUNTRIES,
  type TrumpTariffFieldErrors,
  type TrumpTariffInput,
  type TrumpTariffResult,
} from './types';

function parseOptionalMoney(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return 0;
  const n = Number(t.replace(/,/g, ''));
  if (!Number.isFinite(n)) return null;
  return n;
}

function parseRequiredMoney(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = Number(t.replace(/,/g, ''));
  if (!Number.isFinite(n)) return null;
  return n;
}

function parseRate(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = Number(t.replace(/,/g, ''));
  if (!Number.isFinite(n)) return null;
  return n;
}

/** HTSUS-style digits with optional dots — syntax only, not legal classification. */
export function isValidHtsusFormat(code: string): boolean {
  const t = code.trim();
  if (t === '') return true;
  return /^\d{4}(\.\d{2}){0,3}$/.test(t) || /^\d{6,10}$/.test(t);
}

export function isExpiredTariffStatus(
  status: 'effective' | 'expired' | 'proposed' | 'suspended'
): boolean {
  return status === 'expired' || status === 'proposed' || status === 'suspended';
}

export function canPresentAsCurrentlyEffective(
  status: 'effective' | 'expired' | 'proposed' | 'suspended'
): boolean {
  return status === 'effective';
}

export interface ParsedTariffNumbers {
  unitCustomsValue: number;
  quantity: number;
  baseTariffRate: number;
  additionalTariffRate: number;
  shippingCost: number;
  insuranceCost: number;
  otherFees: number;
  htsusCode: string | null;
  retailPrice: number | null;
  passThroughPercent: number | null;
}

export interface TrumpTariffValidation {
  isValid: boolean;
  errors: TrumpTariffFieldErrors;
  result: TrumpTariffResult | null;
}

export function collectFieldErrors(
  input: TrumpTariffInput
): TrumpTariffFieldErrors {
  const errors: TrumpTariffFieldErrors = {};

  if (input.mode === 'country') {
    if (
      !input.countryCode ||
      !ORIGIN_COUNTRIES.some((c) => c.code === input.countryCode)
    ) {
      errors.countryCode = 'Select a country of origin.';
    }
  }

  const unit = parseRequiredMoney(input.unitCustomsValue);
  if (unit == null) {
    errors.unitCustomsValue = 'Enter the customs value per unit.';
  } else if (unit < 0) {
    errors.unitCustomsValue = 'Customs value cannot be negative.';
  }

  const qtyRaw = input.quantity.trim();
  const qty = Number(qtyRaw);
  if (qtyRaw === '' || !Number.isFinite(qty)) {
    errors.quantity = 'Enter quantity as a positive whole number.';
  } else if (!Number.isInteger(qty) || qty <= 0) {
    errors.quantity = 'Quantity must be a positive integer (at least 1).';
  }

  const base = parseRate(input.baseTariffRate);
  if (base == null) {
    errors.baseTariffRate = 'Enter a base import duty rate (%).';
  } else if (base < 0) {
    errors.baseTariffRate = 'Base tariff rate cannot be negative.';
  }

  const addRaw = input.additionalTariffRate.trim();
  const add = addRaw === '' ? 0 : parseRate(input.additionalTariffRate);
  if (addRaw !== '' && add == null) {
    errors.additionalTariffRate = 'Enter a valid additional tariff rate (%).';
  } else if (add != null && add < 0) {
    errors.additionalTariffRate = 'Additional tariff rate cannot be negative.';
  }

  if (add != null && add > 0 && !input.assumeAdditiveStacking) {
    errors.form =
      'Additional duties are entered but additive stacking is not assumed. Enable “assume additive ad valorem stacking” for this simplified scenario, or set the additional rate to 0.';
  }

  for (const [key, label] of [
    ['shippingCost', 'Shipping'] as const,
    ['insuranceCost', 'Insurance'] as const,
    ['otherFees', 'Other fees'] as const,
  ]) {
    const n = parseOptionalMoney(input[key]);
    if (n == null || n < 0) {
      errors[key] = `${label} must be zero or a positive amount.`;
    }
  }

  if (input.htsusCode.trim() && !isValidHtsusFormat(input.htsusCode)) {
    errors.htsusCode =
      'HTSUS format looks invalid (use digits, optionally with dots). Format checks do not confirm the correct classification.';
  }

  const retailTrim = input.retailPrice.trim();
  const passTrim = input.passThroughPercent.trim();
  if (retailTrim !== '' || passTrim !== '') {
    const retail = parseRequiredMoney(input.retailPrice);
    const pass = parseRate(input.passThroughPercent);
    if (retail == null || retail < 0) {
      errors.retailPrice = 'Enter a non-negative retail price for pass-through.';
    }
    if (pass == null || pass < 0) {
      errors.passThroughPercent =
        'Enter a non-negative pass-through percentage.';
    }
  }

  return errors;
}

export function hasFieldErrors(errors: TrumpTariffFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Normalize empty additional rate to 0; return null if validation fails. */
export function parseTariffNumbers(
  input: TrumpTariffInput
): ParsedTariffNumbers | null {
  if (hasFieldErrors(collectFieldErrors(input))) return null;

  const unitCustomsValue = parseRequiredMoney(input.unitCustomsValue);
  const quantity = Number(input.quantity.trim());
  const baseTariffRate = parseRate(input.baseTariffRate);
  const additionalRaw = input.additionalTariffRate.trim();
  const additionalTariffRate =
    additionalRaw === '' ? 0 : parseRate(input.additionalTariffRate);
  const shippingCost = parseOptionalMoney(input.shippingCost);
  const insuranceCost = parseOptionalMoney(input.insuranceCost);
  const otherFees = parseOptionalMoney(input.otherFees);

  if (
    unitCustomsValue == null ||
    baseTariffRate == null ||
    additionalTariffRate == null ||
    shippingCost == null ||
    insuranceCost == null ||
    otherFees == null
  ) {
    return null;
  }

  if (!input.assumeAdditiveStacking && additionalTariffRate > 0) {
    return null;
  }

  let retailPrice: number | null = null;
  let passThroughPercent: number | null = null;
  if (
    input.retailPrice.trim() !== '' &&
    input.passThroughPercent.trim() !== ''
  ) {
    retailPrice = parseRequiredMoney(input.retailPrice);
    passThroughPercent = parseRate(input.passThroughPercent);
    if (retailPrice == null || passThroughPercent == null) return null;
  }

  const hts = input.htsusCode.trim();
  return {
    unitCustomsValue,
    quantity,
    baseTariffRate,
    additionalTariffRate,
    shippingCost,
    insuranceCost,
    otherFees,
    htsusCode: hts || null,
    retailPrice,
    passThroughPercent,
  };
}

export function validateTrumpTariffInput(
  input: TrumpTariffInput
): TrumpTariffValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateTrumpTariff(input);
  return {
    isValid: result != null,
    errors: result ? {} : { form: 'Unable to calculate with these inputs.' },
    result,
  };
}

/** @deprecated Prefer collectFieldErrors — kept for tests that import the old name. */
export function validateTrumpTariffInputErrors(
  input: TrumpTariffInput
): TrumpTariffFieldErrors {
  return collectFieldErrors(input);
}
