import type {
  CaliforniaSalesTaxFieldErrors,
  CaliforniaSalesTaxInput,
} from './types';

/** Inclusive California ZIP numeric bounds (ZIP kept as string elsewhere). */
export const CA_ZIP_MIN = 90001;
export const CA_ZIP_MAX = 96162;

export interface CaliforniaParsedFields {
  purchaseAmount: number;
  streetAddress: string;
  city: string;
  zipCode: string;
}

export interface CaliforniaSalesTaxFieldValidation {
  isValid: boolean;
  errors: CaliforniaSalesTaxFieldErrors;
  parsed: CaliforniaParsedFields | null;
}

export function isValidCaliforniaZip(zipCode: string): boolean {
  if (!/^\d{5}$/.test(zipCode)) return false;
  const n = Number(zipCode);
  if (!Number.isInteger(n)) return false;
  return n >= CA_ZIP_MIN && n <= CA_ZIP_MAX;
}

function parsePurchase(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

/** Field-level validation only — rate lookup happens server-side. */
export function validateCaliforniaSalesTaxFields(
  input: CaliforniaSalesTaxInput
): CaliforniaSalesTaxFieldValidation {
  const errors: CaliforniaSalesTaxFieldErrors = {};
  const purchase = parsePurchase(input.purchaseAmount);
  const street = input.streetAddress.trim();
  const city = input.city.trim();
  const zip = input.zipCode.trim();

  if (!purchase.blank && (purchase.invalid || purchase.value === null)) {
    errors.purchaseAmount = 'Enter a valid purchase amount in USD.';
  } else if (purchase.value !== null && purchase.value < 0) {
    errors.purchaseAmount = 'Purchase amount must be zero or greater.';
  }

  if (input.streetAddress.length > 0 && street === '') {
    errors.streetAddress = 'Enter a street address.';
  }

  if (input.city.length > 0 && city === '') {
    errors.city = 'Enter a city.';
  }

  if (zip !== '' && !/^\d{5}$/.test(zip)) {
    errors.zipCode = 'Enter a five-digit ZIP code (leading zeros preserved).';
  } else if (zip !== '' && /^\d{5}$/.test(zip) && !isValidCaliforniaZip(zip)) {
    errors.zipCode = 'ZIP must be a California ZIP code (90001–96162).';
  }

  const incomplete =
    purchase.blank ||
    street === '' ||
    city === '' ||
    zip === '' ||
    Boolean(errors.purchaseAmount) ||
    Boolean(errors.streetAddress) ||
    Boolean(errors.city) ||
    Boolean(errors.zipCode);

  if (incomplete) {
    return { isValid: false, errors, parsed: null };
  }

  return {
    isValid: true,
    errors,
    parsed: {
      purchaseAmount: purchase.value!,
      streetAddress: street,
      city,
      zipCode: zip,
    },
  };
}
