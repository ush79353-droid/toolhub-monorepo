import { calculateTwinBirthRate } from './calculation';
import type {
  TwinsFieldErrors,
  TwinsInput,
  TwinsRaceEthnicity,
  TwinsResult,
} from './types';
import { RACE_ETHNICITY_OPTIONS } from './types';

export interface TwinsValidation {
  isValid: boolean;
  errors: TwinsFieldErrors;
  result: TwinsResult | null;
}

function parseIntegerAge(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (!/^\d+$/.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isSafeInteger(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

const VALID_RACES = new Set<TwinsRaceEthnicity>(
  RACE_ETHNICITY_OPTIONS.map((o) => o.value)
);

export function validateTwinsInput(input: TwinsInput): TwinsValidation {
  const errors: TwinsFieldErrors = {};

  if (input.stratumMode === 'by_age') {
    const ageParsed = parseIntegerAge(input.motherAgeYears);
    if (ageParsed.blank) {
      return { isValid: false, errors, result: null };
    }
    if (ageParsed.invalid || ageParsed.value == null) {
      errors.motherAgeYears = 'Enter mother’s age in whole years.';
      return { isValid: false, errors, result: null };
    }
    if (ageParsed.value < 12 || ageParsed.value > 55) {
      errors.motherAgeYears = 'Age must be between 12 and 55 years.';
      return { isValid: false, errors, result: null };
    }

    const result = calculateTwinBirthRate({
      stratumMode: 'by_age',
      motherAgeYears: ageParsed.value,
    });
    if (!result) {
      errors.form = 'Unable to look up rate for this age.';
      return { isValid: false, errors, result: null };
    }
    return { isValid: true, errors, result };
  }

  if (!input.raceEthnicity) {
    return { isValid: false, errors, result: null };
  }
  if (!VALID_RACES.has(input.raceEthnicity)) {
    errors.raceEthnicity = 'Select a race and Hispanic origin group.';
    return { isValid: false, errors, result: null };
  }

  const result = calculateTwinBirthRate({
    stratumMode: 'by_race',
    raceEthnicity: input.raceEthnicity,
  });
  if (!result) {
    errors.form = 'Unable to look up rate for this group.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}