import {
  calculateRentSplit,
  formatRentSplitMoney,
} from './calculation';
import type {
  BedroomCount,
  RentSplitFieldErrors,
  RentSplitInput,
  RentSplitResult,
} from './types';

export interface RentSplitValidation {
  isValid: boolean;
  errors: RentSplitFieldErrors;
  result: RentSplitResult | null;
}

function parseMoney(raw: string): {
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

function parsePeople(raw: string): {
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
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

const PEOPLE_ERROR_KEYS = ['people1', 'people2', 'people3'] as const;

/**
 * Validates rent-split inputs. No FX here — currency conversion happens on
 * selector change before amounts reach this function.
 */
export function validateRentSplitInput(input: RentSplitInput): RentSplitValidation {
  const errors: RentSplitFieldErrors = {};
  const bedroomCount: BedroomCount = input.bedroomCount;

  const rent = parseMoney(input.totalRent);
  if (!rent.blank && (rent.invalid || rent.value === null)) {
    errors.totalRent = 'Enter a valid total rent.';
  } else if (!rent.blank && rent.value !== null && rent.value < 0) {
    errors.totalRent = 'Total rent cannot be negative.';
  }

  const peopleValues: number[] = [];
  for (let i = 0; i < bedroomCount; i += 1) {
    const key = PEOPLE_ERROR_KEYS[i]!;
    const parsed = parsePeople(input.people[i] ?? '');
    if (parsed.blank) {
      errors[key] = 'Enter the number of people.';
    } else if (parsed.invalid || parsed.value === null) {
      errors[key] = 'Enter a whole number of people.';
    } else if (parsed.value < 0) {
      errors[key] = 'People cannot be negative.';
    } else {
      peopleValues.push(parsed.value);
    }
  }

  if (rent.blank || Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const calc = calculateRentSplit({
    totalRent: rent.value!,
    peoplePerBedroom: peopleValues,
  });

  if (!calc) {
    errors.form =
      peopleValues.every((n) => n === 0)
        ? 'Add at least one person to calculate the rent split.'
        : 'This combination does not produce a finite rent split.';
    return { isValid: false, errors, result: null };
  }

  const result: RentSplitResult = {
    totalPeople: calc.totalPeople,
    perPersonRent: calc.perPersonRent,
    formattedPerPersonRent: formatRentSplitMoney(
      calc.perPersonRent,
      input.currency
    ),
    bedrooms: calc.bedroomShares.map((share, index) => ({
      bedroom: index + 1,
      people: peopleValues[index]!,
      share,
      formattedShare: formatRentSplitMoney(share, input.currency),
    })),
    currency: input.currency,
  };

  return { isValid: true, errors: {}, result };
}
