import { calculateAddedSugarIntake, parseQuantity } from './calculation';
import type {
  AddedSugarIntakeFieldErrors,
  AddedSugarIntakeInput,
  AddedSugarIntakeResult,
} from './types';

export interface AddedSugarIntakeValidation {
  errors: AddedSugarIntakeFieldErrors;
  result: AddedSugarIntakeResult | null;
}

const QTY_FIELDS: (keyof AddedSugarIntakeInput)[] = [
  'drinkQtyText',
  'dairyQtyText',
  'cerealQtyText',
  'obviousBakedQtyText',
  'candyQtyText',
  'teaCoffeeTspText',
  'otherObviousGramsText',
  'hiddenSnackQtyText',
  'hiddenBreadQtyText',
  'dressingQtyText',
  'otherHiddenGramsText',
];

export function validateAddedSugarIntakeInput(
  input: AddedSugarIntakeInput,
): AddedSugarIntakeValidation {
  const errors: AddedSugarIntakeFieldErrors = {};

  for (const key of QTY_FIELDS) {
    const raw = input[key];
    if (typeof raw !== 'string') continue;
    if (raw.trim() === '') continue;
    const q = parseQuantity(raw);
    if (q === null) {
      errors[key as keyof AddedSugarIntakeFieldErrors] =
        'Enter a valid non-negative number.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateAddedSugarIntake(input),
  };
}