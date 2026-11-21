import {
  calculateBmiWeightLoss,
  deriveTargetFields,
  heightToMeters,
  parseNumber,
  weightToKg,
  AGE_MAX,
} from './calculation';
import type {
  BmiWeightLossFieldErrors,
  BmiWeightLossInput,
  BmiWeightLossResult,
  HeightUnit,
  WeightUnit,
} from './types';

const HEIGHT_UNITS: readonly HeightUnit[] = ['cm', 'm', 'in', 'ft'];
const WEIGHT_UNITS: readonly WeightUnit[] = ['kg', 'lb', 'st'];

export interface BmiWeightLossValidation {
  isValid: boolean;
  errors: BmiWeightLossFieldErrors;
  result: BmiWeightLossResult | null;
}

export function collectFieldErrors(
  input: BmiWeightLossInput,
): BmiWeightLossFieldErrors {
  const errors: BmiWeightLossFieldErrors = {};

  if (!HEIGHT_UNITS.includes(input.heightUnit)) {
    errors.height = 'Select a height unit.';
  }
  if (!WEIGHT_UNITS.includes(input.weightUnit)) {
    errors.weight = 'Select a weight unit.';
  }
  if (!WEIGHT_UNITS.includes(input.targetWeightUnit)) {
    errors.targetWeight = 'Select a target weight unit.';
  }

  const heightVal = parseNumber(input.height);
  const weightVal = parseNumber(input.weight);

  if (input.height.trim() === '') {
    // blank ok until companion filled
  } else if (heightVal == null) {
    errors.height = 'Enter a valid height.';
  } else if (heightVal <= 0) {
    errors.height = 'Height must be greater than zero.';
  } else {
    const meters = heightToMeters(heightVal, input.heightUnit);
    if (!(meters > 0) || meters > 3.5) {
      errors.height = 'Height is out of a realistic adult range.';
    }
  }

  if (input.weight.trim() === '') {
    // blank ok
  } else if (weightVal == null) {
    errors.weight = 'Enter a valid weight.';
  } else if (weightVal <= 0) {
    errors.weight = 'Weight must be greater than zero.';
  } else {
    const kg = weightToKg(weightVal, input.weightUnit);
    if (!(kg > 0) || kg > 500) {
      errors.weight = 'Weight is out of a realistic range.';
    }
  }

  const heightBlank = input.height.trim() === '';
  const weightBlank = input.weight.trim() === '';
  if (!heightBlank && weightBlank) {
    errors.weight = 'Enter weight.';
  } else if (heightBlank && !weightBlank) {
    errors.height = 'Enter height.';
  }

  // Target fields: validate only when non-blank
  if (input.targetBmi.trim() !== '') {
    const t = parseNumber(input.targetBmi);
    if (t == null) errors.targetBmi = 'Enter a valid target BMI.';
    else if (!(t > 0)) errors.targetBmi = 'Target BMI must be greater than zero.';
    else if (t >= 100) errors.targetBmi = 'Target BMI is unrealistically high.';
  }
  if (input.targetPrime.trim() !== '') {
    const t = parseNumber(input.targetPrime);
    if (t == null) errors.targetPrime = 'Enter a valid target BMI Prime.';
    else if (!(t > 0))
      errors.targetPrime = 'Target BMI Prime must be greater than zero.';
    else if (t >= 4) errors.targetPrime = 'Target BMI Prime is unrealistically high.';
  }
  if (input.targetWeight.trim() !== '') {
    const t = parseNumber(input.targetWeight);
    if (t == null) errors.targetWeight = 'Enter a valid target weight.';
    else if (!(t > 0))
      errors.targetWeight = 'Target weight must be greater than zero.';
    else {
      const kg = weightToKg(t, input.targetWeightUnit);
      if (!(kg > 0) || kg > 500) {
        errors.targetWeight = 'Target weight is out of a realistic range.';
      }
    }
  }

  // Reject unsafe severe-thinness targets when height is known
  if (!errors.targetBmi && !errors.targetPrime && !errors.targetWeight) {
    const meters =
      heightVal != null && heightVal > 0
        ? heightToMeters(heightVal, input.heightUnit)
        : null;
    if (meters != null && meters > 0) {
      const derived = deriveTargetFields(meters, input);
      if (derived.rejected) {
        errors.targetBmi =
          derived.rejectReason ??
          'Target BMI below 16 is not supported.';
      }
    }
  }

  if (input.age.trim() !== '') {
    const age = parseNumber(input.age);
    if (age == null) errors.age = 'Enter a valid age in years.';
    else if (age < 0) errors.age = 'Age cannot be negative.';
    else if (age > AGE_MAX) errors.age = `Age must be at most ${AGE_MAX} years.`;
  }

  if (input.sex !== '' && input.sex !== 'female' && input.sex !== 'male') {
    errors.sex = 'Select female or male.';
  }

  return errors;
}

export function hasFieldErrors(errors: BmiWeightLossFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateBmiWeightLossInput(
  input: BmiWeightLossInput,
): BmiWeightLossValidation {
  const heightBlank = input.height.trim() === '';
  const weightBlank = input.weight.trim() === '';
  const targetsBlank =
    input.targetBmi.trim() === '' &&
    input.targetPrime.trim() === '' &&
    input.targetWeight.trim() === '';
  const panelBlank = input.age.trim() === '' && input.sex === '';

  if (heightBlank && weightBlank && targetsBlank && panelBlank) {
    return { isValid: true, errors: {}, result: null };
  }

  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    // Still compute current BMI if H+W valid for display of current panel
    const soft = { ...errors };
    const heightOk = !soft.height && !heightBlank;
    const weightOk = !soft.weight && !weightBlank;
    if (heightOk && weightOk) {
      const partial = {
        ...input,
        targetBmi: errors.targetBmi ? '' : input.targetBmi,
        targetPrime: errors.targetPrime ? '' : input.targetPrime,
        targetWeight: errors.targetWeight ? '' : input.targetWeight,
        lastTargetEdit: errors.targetBmi || errors.targetPrime || errors.targetWeight
          ? null
          : input.lastTargetEdit,
      };
      const result = calculateBmiWeightLoss(partial);
      return { isValid: false, errors, result };
    }
    return { isValid: false, errors, result: null };
  }

  if (heightBlank || weightBlank) {
    return { isValid: true, errors: {}, result: null };
  }

  const result = calculateBmiWeightLoss(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
