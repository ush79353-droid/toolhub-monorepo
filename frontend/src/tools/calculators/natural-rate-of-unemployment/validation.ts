import {
  calculateNaturalUnemploymentRate,
  formatNaturalRatePercent,
  populationToPeople,
} from './calculation';
import type {
  NaturalUnemploymentFieldErrors,
  NaturalUnemploymentInput,
  NaturalUnemploymentResult,
} from './types';

export interface NaturalUnemploymentValidation {
  isValid: boolean;
  errors: NaturalUnemploymentFieldErrors;
  result: NaturalUnemploymentResult | null;
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

export function validateNaturalUnemploymentInput(
  input: NaturalUnemploymentInput
): NaturalUnemploymentValidation {
  const errors: NaturalUnemploymentFieldErrors = {};

  const frictional = parseNumber(input.frictional);
  const structural = parseNumber(input.structural);
  const laborForce = parseNumber(input.laborForce);

  if (frictional.blank) {
    errors.frictional = 'Enter frictional unemployment.';
  } else if (frictional.invalid || frictional.value === null) {
    errors.frictional = 'Enter a valid frictional unemployment count.';
  } else if (frictional.value < 0) {
    errors.frictional = 'Frictional unemployment cannot be negative.';
  }

  if (structural.blank) {
    errors.structural = 'Enter structural unemployment.';
  } else if (structural.invalid || structural.value === null) {
    errors.structural = 'Enter a valid structural unemployment count.';
  } else if (structural.value < 0) {
    errors.structural = 'Structural unemployment cannot be negative.';
  }

  if (laborForce.blank) {
    errors.laborForce = 'Enter the total labor force.';
  } else if (laborForce.invalid || laborForce.value === null) {
    errors.laborForce = 'Enter a valid labor force count.';
  } else if (laborForce.value <= 0) {
    errors.laborForce = 'Labor force must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const frictionalPeople = populationToPeople(frictional.value!, input.frictionalUnit);
  const structuralPeople = populationToPeople(structural.value!, input.structuralUnit);
  const laborForcePeople = populationToPeople(laborForce.value!, input.laborForceUnit);

  if (frictionalPeople + structuralPeople > laborForcePeople) {
    errors.form =
      'Frictional plus structural unemployment cannot exceed the total labor force.';
    return { isValid: false, errors, result: null };
  }

  const rate = calculateNaturalUnemploymentRate({
    frictionalPeople,
    structuralPeople,
    laborForcePeople,
  });
  if (rate === null) {
    errors.form = 'This combination does not produce a finite natural rate.';
    return { isValid: false, errors, result: null };
  }

  const result: NaturalUnemploymentResult = {
    frictionalPeople,
    structuralPeople,
    naturalUnemployedPeople: frictionalPeople + structuralPeople,
    laborForcePeople,
    naturalRatePercent: rate,
    formattedNaturalRate: formatNaturalRatePercent(rate),
  };

  return { isValid: true, errors: {}, result };
}
