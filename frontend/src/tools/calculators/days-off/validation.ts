import {
  CONTRACT_OPTIONS,
  COUNTRY_OPTIONS,
  type DaysOffContract,
  type DaysOffCountry,
  type DaysOffInput,
} from './types';

export type DaysOffFieldErrors = {
  country?: string;
  contract?: string;
  form?: string;
};

export function validateDaysOffInput(input: DaysOffInput): {
  isValid: boolean;
  errors: DaysOffFieldErrors;
} {
  const errors: DaysOffFieldErrors = {};
  const countries = new Set(COUNTRY_OPTIONS.map((o) => o.value));
  const contracts = new Set(CONTRACT_OPTIONS.map((o) => o.value));

  if (!countries.has(input.country as DaysOffCountry)) {
    errors.country = 'Select a supported country';
  }
  if (!contracts.has(input.contract as DaysOffContract)) {
    errors.contract = 'Select a supported contract type';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
