import { lookupOhioSalesTax } from './calculation';
import type {
  OhioSalesTaxFieldErrors,
  OhioSalesTaxInput,
  OhioSalesTaxResult,
} from './types';

export interface OhioSalesTaxValidation {
  isValid: boolean;
  errors: OhioSalesTaxFieldErrors;
  result: OhioSalesTaxResult | null;
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

export function validateOhioSalesTaxInput(
  input: OhioSalesTaxInput
): OhioSalesTaxValidation {
  const errors: OhioSalesTaxFieldErrors = {};
  const purchase = parsePurchase(input.purchaseAmount);
  const zip = input.zipCode.trim();

  if (!purchase.blank && (purchase.invalid || purchase.value === null)) {
    errors.purchaseAmount = 'Enter a valid purchase amount in USD.';
  } else if (purchase.value !== null && purchase.value < 0) {
    errors.purchaseAmount = 'Purchase amount must be zero or greater.';
  }

  if (zip !== '' && !/^\d{5}$/.test(zip)) {
    errors.zipCode = 'Enter a five-digit ZIP code (leading zeros preserved).';
  } else if (zip !== '' && /^\d{5}$/.test(zip)) {
    const n = Number(zip);
    if (n < 43001 || n > 45999) {
      errors.zipCode = 'ZIP must be an Ohio ZIP code (43001–45999).';
    }
  }

  const incomplete =
    purchase.blank ||
    zip === '' ||
    Boolean(errors.purchaseAmount) ||
    Boolean(errors.zipCode);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const looked = lookupOhioSalesTax(purchase.value!, zip);
  if (!looked) {
    errors.form = 'Unable to evaluate these inputs.';
    return { isValid: false, errors, result: null };
  }

  const result: OhioSalesTaxResult = {
    purchaseAmount: looked.purchaseAmount,
    zipCode: looked.zipCode,
    rateUnavailable: true,
    unavailableMessage: looked.unavailableMessage,
    formattedPurchaseAmount: looked.formattedPurchaseAmount,
    summaryText: looked.summaryText,
  };

  return { isValid: true, errors, result };
}
