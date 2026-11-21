import { calculateEstateTax } from './calculation';
import type {
  EstateTaxFieldErrors,
  EstateTaxInput,
  EstateTaxResult,
} from './types';

export interface EstateTaxValidation {
  isValid: boolean;
  errors: EstateTaxFieldErrors;
  result: EstateTaxResult | null;
}

const FIELD_LABELS: Record<keyof EstateTaxInput, string> = {
  residence: 'Residence & other real estate',
  investments: 'Stocks, bonds, and other investments',
  savings: 'Savings, CDs, and checking',
  vehicles: 'Vehicles, boats, and other properties',
  retirement: 'Retirement plans',
  lifeInsurance: 'Life insurance benefit',
  otherAssets: 'Other assets',
  debts: 'Debts',
  funeralAdmin: 'Funeral, administration, and claims',
  charitable: 'Charitable contributions',
  stateDeathTaxes: 'State inheritance or estate taxes',
  taxFreeLifetimeGifts: 'Tax-free lifetime gifts',
};

function parseMoney(raw: string): {
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

export function validateEstateTaxInput(input: EstateTaxInput): EstateTaxValidation {
  const errors: EstateTaxFieldErrors = {};
  const numeric: Record<keyof EstateTaxInput, number> = {
    residence: 0,
    investments: 0,
    savings: 0,
    vehicles: 0,
    retirement: 0,
    lifeInsurance: 0,
    otherAssets: 0,
    debts: 0,
    funeralAdmin: 0,
    charitable: 0,
    stateDeathTaxes: 0,
    taxFreeLifetimeGifts: 0,
  };

  (Object.keys(FIELD_LABELS) as (keyof EstateTaxInput)[]).forEach((key) => {
    const parsed = parseMoney(input[key]);
    if (parsed.blank) {
      numeric[key] = 0;
      return;
    }
    if (parsed.invalid || parsed.value === null) {
      errors[key] = `Enter a valid amount for ${FIELD_LABELS[key]}.`;
      return;
    }
    if (parsed.value < 0) {
      errors[key] = `${FIELD_LABELS[key]} cannot be negative.`;
      return;
    }
    numeric[key] = parsed.value;
  });

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateEstateTax(numeric);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'This combination does not produce a finite result.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
