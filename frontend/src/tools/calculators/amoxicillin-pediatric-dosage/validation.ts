import {
  MAX_AGE_MONTHS,
  MIN_AGE_MONTHS,
  ageToMonths,
  calculateAmoxicillinPediatricDosage,
  doseMgFromVolumeMl,
  weightToKg,
} from './calculation';
import type {
  AmoxicillinPediatricDosageFieldErrors,
  AmoxicillinPediatricDosageInput,
  AmoxicillinPediatricDosageResult,
} from './types';

function parseOptionalNumber(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return NaN;
  return n;
}

export function validateAmoxicillinPediatricDosageInput(
  input: AmoxicillinPediatricDosageInput
): {
  errors: AmoxicillinPediatricDosageFieldErrors;
  result: AmoxicillinPediatricDosageResult | null;
} {
  const errors: AmoxicillinPediatricDosageFieldErrors = {};

  const ageRaw = parseOptionalNumber(input.age);
  const weightRaw = parseOptionalNumber(input.weight);
  const reqRaw = parseOptionalNumber(input.requirementMgPerKg);
  const doseRaw = parseOptionalNumber(input.doseValue);

  if (ageRaw === null) {
    errors.age = 'Enter age (1 month to 18 years).';
  } else if (Number.isNaN(ageRaw) || ageRaw < 0) {
    errors.age = 'Age must be a non-negative number.';
  } else {
    const months = ageToMonths(ageRaw, input.ageUnit);
    if (months < MIN_AGE_MONTHS || months > MAX_AGE_MONTHS) {
      errors.age = 'This tool supports ages from 1 month through 18 years.';
    }
  }

  if (weightRaw === null) {
    errors.weight = 'Enter weight.';
  } else if (Number.isNaN(weightRaw) || weightRaw <= 0) {
    errors.weight = 'Weight must be a positive number.';
  }

  if (reqRaw !== null && (Number.isNaN(reqRaw) || reqRaw < 0)) {
    errors.requirementMgPerKg = 'Dosage requirement must be a non-negative number.';
  }
  if (doseRaw !== null && (Number.isNaN(doseRaw) || doseRaw < 0)) {
    errors.doseValue = 'Dose must be a non-negative number.';
  }

  if (input.doseUnit === 'mL' && input.route === 'iv') {
    errors.doseValue = 'mL applies to oral suspension only. Use mg for IV.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const ageMonths = ageToMonths(ageRaw as number, input.ageUnit);
  const weightKg = weightToKg(weightRaw as number, input.weightUnit);

  let mode: 'suggest' | 'from_requirement' | 'from_dose' = 'suggest';
  let clinicianRequirement: number | null = null;
  let clinicianDoseMg: number | null = null;

  if (input.lastEdited === 'requirement' && reqRaw !== null) {
    mode = 'from_requirement';
    clinicianRequirement = reqRaw;
  } else if (input.lastEdited === 'dose' && doseRaw !== null) {
    mode = 'from_dose';
    clinicianDoseMg =
      input.doseUnit === 'mL'
        ? doseMgFromVolumeMl(doseRaw, input.strength)
        : doseRaw;
  }

  const result = calculateAmoxicillinPediatricDosage({
    ageMonths,
    weightKg,
    strength: input.strength,
    indication: input.indication,
    route: input.route,
    clinicianRequirement,
    clinicianDoseMg,
    mode,
    doseUnit: input.doseUnit,
  });

  if (!result.regimenAvailable && result.unavailableReason) {
    errors.route = result.unavailableReason;
  }

  return { errors, result };
}
