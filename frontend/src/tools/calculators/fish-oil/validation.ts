import { calculateFishOil } from './calculation';
import {
  AGE_BAND_OPTIONS,
  SPECIAL_REQUIREMENT_OPTIONS,
  type FishOilAgeBandId,
  type FishOilFieldErrors,
  type FishOilInput,
  type FishOilResult,
  type FishOilSpecialRequirementId,
} from './types';

export interface FishOilValidation {
  errors: FishOilFieldErrors;
  result: FishOilResult | null;
}

const AGE_IDS = new Set(AGE_BAND_OPTIONS.map((o) => o.id));
const SPECIAL_IDS = new Set(SPECIAL_REQUIREMENT_OPTIONS.map((o) => o.id));

export function validateFishOilInput(input: FishOilInput): FishOilValidation {
  const errors: FishOilFieldErrors = {};

  if (input.ageBand !== '' && !AGE_IDS.has(input.ageBand as FishOilAgeBandId)) {
    errors.ageBand = 'Choose a listed age band.';
  }

  if (
    input.specialRequirement !== '' &&
    !SPECIAL_IDS.has(input.specialRequirement as FishOilSpecialRequirementId)
  ) {
    errors.specialRequirement = 'Choose a listed special requirement.';
  }

  if (input.dosageUnit !== 'mg') {
    // Screenshot only exposes mg; reject any other unit without inventing FX/conversions.
    errors.specialRequirement =
      errors.specialRequirement ?? 'Dosage unit must be mg.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateFishOil(input),
  };
}
