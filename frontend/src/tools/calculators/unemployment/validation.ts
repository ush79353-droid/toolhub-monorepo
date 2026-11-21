import {
  formatPopulationInput,
  peopleToPopulationUnit,
  populationToPeople,
  toUnemploymentResult,
} from './calculation';
import type {
  UnemploymentFieldErrors,
  UnemploymentInput,
  UnemploymentResult,
} from './types';

const PEOPLE_EPS = 1e-6;

function parseOptionalAmount(
  raw: string
): { ok: true; value: number | null } | { ok: false; error: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { ok: true, value: null };
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) {
    return { ok: false, error: 'Enter a nonnegative population count.' };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a valid population count.' };
  }
  if (value < 0) {
    return { ok: false, error: 'Population counts cannot be negative.' };
  }
  return { ok: true, value };
}

function nearlyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) <= PEOPLE_EPS * Math.max(1, Math.abs(a), Math.abs(b));
}

export function validateUnemploymentInput(input: UnemploymentInput): {
  isValid: boolean;
  errors: UnemploymentFieldErrors;
  result: UnemploymentResult | null;
  /** Display fields after deriving the missing of employed / unemployed / labor force. */
  syncedInput: UnemploymentInput;
} {
  const errors: UnemploymentFieldErrors = {};
  const syncedInput: UnemploymentInput = { ...input };

  const employedParsed = parseOptionalAmount(input.employed);
  const unemployedParsed = parseOptionalAmount(input.unemployed);
  const laborParsed = parseOptionalAmount(input.laborForce);
  const workingAgeParsed = parseOptionalAmount(input.workingAge);

  if (!employedParsed.ok) errors.employed = employedParsed.error;
  if (!unemployedParsed.ok) errors.unemployed = unemployedParsed.error;
  if (!laborParsed.ok) errors.laborForce = laborParsed.error;
  if (!workingAgeParsed.ok) errors.workingAge = workingAgeParsed.error;

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null, syncedInput };
  }

  if (
    !employedParsed.ok ||
    !unemployedParsed.ok ||
    !laborParsed.ok ||
    !workingAgeParsed.ok
  ) {
    return { isValid: false, errors, result: null, syncedInput };
  }

  const employedAmount = employedParsed.value;
  const unemployedAmount = unemployedParsed.value;
  const laborAmount = laborParsed.value;
  const workingAgeAmount = workingAgeParsed.value;

  const hasE = employedAmount !== null;
  const hasU = unemployedAmount !== null;
  const hasL = laborAmount !== null;

  if (!hasE && !hasU && !hasL) {
    return { isValid: false, errors: {}, result: null, syncedInput };
  }

  let employedPeople = hasE
    ? populationToPeople(employedAmount!, input.employedUnit)
    : null;
  let unemployedPeople = hasU
    ? populationToPeople(unemployedAmount!, input.unemployedUnit)
    : null;
  let laborForcePeople = hasL
    ? populationToPeople(laborAmount!, input.laborForceUnit)
    : null;

  // Derive the third population count from any two (driver prefers overwrite path).
  if (hasE && hasU) {
    const derived = employedPeople! + unemployedPeople!;
    if (hasL && !nearlyEqual(laborForcePeople!, derived)) {
      if (input.driver === 'laborForce') {
        // Labor force is authoritative: prefer deriving the missing partner is impossible — inconsistency.
        errors.form =
          'Employed + unemployed must equal the labor force. Adjust one of the three population fields.';
        return { isValid: false, errors, result: null, syncedInput };
      }
      // Prefer E+U when those were edited.
    }
    laborForcePeople = derived;
    syncedInput.laborForce = formatPopulationInput(
      peopleToPopulationUnit(derived, input.laborForceUnit)
    );
  } else if (hasE && hasL) {
    const derivedU = laborForcePeople! - employedPeople!;
    if (derivedU < -PEOPLE_EPS) {
      errors.laborForce =
        'Labor force must be at least as large as employed people.';
      return { isValid: false, errors, result: null, syncedInput };
    }
    unemployedPeople = Math.max(0, derivedU);
    syncedInput.unemployed = formatPopulationInput(
      peopleToPopulationUnit(unemployedPeople, input.unemployedUnit)
    );
  } else if (hasU && hasL) {
    const derivedE = laborForcePeople! - unemployedPeople!;
    if (derivedE < -PEOPLE_EPS) {
      errors.laborForce =
        'Labor force must be at least as large as unemployed people.';
      return { isValid: false, errors, result: null, syncedInput };
    }
    employedPeople = Math.max(0, derivedE);
    syncedInput.employed = formatPopulationInput(
      peopleToPopulationUnit(employedPeople, input.employedUnit)
    );
  } else {
    // Only one population field filled — cannot resolve the triad yet.
    return {
      isValid: false,
      errors: {
        form: 'Enter any two of employed, unemployed, and labor force to calculate.',
      },
      result: null,
      syncedInput,
    };
  }

  if (
    employedPeople === null ||
    unemployedPeople === null ||
    laborForcePeople === null ||
    ![employedPeople, unemployedPeople, laborForcePeople].every(Number.isFinite)
  ) {
    return {
      isValid: false,
      errors: { form: 'Unable to resolve population counts.' },
      result: null,
      syncedInput,
    };
  }

  if (unemployedPeople > laborForcePeople + PEOPLE_EPS) {
    errors.unemployed = 'Unemployed people cannot exceed the labor force.';
    return { isValid: false, errors, result: null, syncedInput };
  }

  let workingAgePeople: number | null = null;
  if (workingAgeAmount !== null) {
    workingAgePeople = populationToPeople(workingAgeAmount, input.workingAgeUnit);
    if (workingAgePeople <= 0) {
      errors.workingAge = 'Working-age population must be greater than zero.';
      return { isValid: false, errors, result: null, syncedInput };
    }
    if (laborForcePeople > workingAgePeople + PEOPLE_EPS) {
      errors.workingAge =
        'Working-age population must be at least as large as the labor force.';
      return { isValid: false, errors, result: null, syncedInput };
    }
  }

  // Zero labor force → valid triad resolution, but unemployment rate is undefined.
  const result = toUnemploymentResult({
    employedPeople,
    unemployedPeople,
    laborForcePeople,
    workingAgePeople,
  });

  if (
    result.unemploymentRatePercent !== null &&
    !Number.isFinite(result.unemploymentRatePercent)
  ) {
    return {
      isValid: false,
      errors: { form: 'Unemployment rate is not a finite number for these inputs.' },
      result: null,
      syncedInput,
    };
  }

  return {
    isValid: true,
    errors: {},
    result,
    syncedInput,
  };
}
