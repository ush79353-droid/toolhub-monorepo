/** Screenshot age bands (unselected by default). */
export type FishOilAgeBandId =
  | '6_24_months'
  | '2_4_years'
  | '4_6_years'
  | '6_10_years'
  | '10_plus_years';

/**
 * Special-requirement ids with primary-source framing only.
 * No invented OTC “condition dose” tables.
 */
export type FishOilSpecialRequirementId =
  | 'adult_seafood_pattern'
  | 'chd_secondary_epa_dha'
  | 'very_high_triglycerides_rx'
  | 'pregnancy_lactation_ala_only'
  | 'fda_supplement_upper_limit';

export type FishOilDosageUnit = 'mg';

export interface FishOilAgeBandOption {
  id: FishOilAgeBandId;
  label: string;
}

export interface FishOilSpecialRequirementOption {
  id: FishOilSpecialRequirementId;
  label: string;
}

export interface FishOilInput {
  ageBand: FishOilAgeBandId | '';
  specialRequirement: FishOilSpecialRequirementId | '';
  dosageUnit: FishOilDosageUnit;
}

export interface FishOilAgeGuidance {
  ageBand: FishOilAgeBandId;
  /** Always null — NIH ODS: no EPA/DHA AI by age. */
  epaDhaAiMg: number | null;
  recommendedFishOilDosageLabel: string;
  detail: string;
  alaContext: string | null;
  boundaryNote: string | null;
}

export interface FishOilSpecialGuidance {
  specialRequirement: FishOilSpecialRequirementId;
  /** Numeric mg when a primary source states EPA+DHA (or UL) in mg; else null. */
  fishOilDosageMg: number | null;
  dosageKind:
    | 'food_pattern_average'
    | 'physician_directed_target'
    | 'prescription_only'
    | 'ala_ai_not_epa_dha'
    | 'supplement_upper_limit'
    | 'not_validated';
  detail: string;
  productNote: string | null;
}

export interface FishOilResult {
  ageGuidance: FishOilAgeGuidance | null;
  specialGuidance: FishOilSpecialGuidance | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type FishOilFieldErrors = {
  ageBand?: string;
  specialRequirement?: string;
};

export const AGE_BAND_OPTIONS: readonly FishOilAgeBandOption[] = [
  { id: '6_24_months', label: '6 - 24 months' },
  { id: '2_4_years', label: '2 - 4 years' },
  { id: '4_6_years', label: '4 - 6 years' },
  { id: '6_10_years', label: '6 - 10 years' },
  { id: '10_plus_years', label: '10+ years' },
] as const;

export const SPECIAL_REQUIREMENT_OPTIONS: readonly FishOilSpecialRequirementOption[] =
  [
    {
      id: 'adult_seafood_pattern',
      label: 'Adult seafood pattern (~EPA+DHA from food)',
    },
    {
      id: 'chd_secondary_epa_dha',
      label: 'Coronary heart disease (physician-directed EPA+DHA)',
    },
    {
      id: 'very_high_triglycerides_rx',
      label: 'Very high triglycerides (prescription omega-3)',
    },
    {
      id: 'pregnancy_lactation_ala_only',
      label: 'Pregnancy / lactation (ALA AI only)',
    },
    {
      id: 'fda_supplement_upper_limit',
      label: 'FDA supplement upper limit (EPA+DHA)',
    },
  ] as const;

/** Screenshot defaults: no age selected; special requirement Select; blank mg. */
export function createDefaultInput(): FishOilInput {
  return {
    ageBand: '',
    specialRequirement: '',
    dosageUnit: 'mg',
  };
}

export function createEmptyInput(): FishOilInput {
  return createDefaultInput();
}

export function inputsEqual(a: FishOilInput, b: FishOilInput): boolean {
  return (
    a.ageBand === b.ageBand &&
    a.specialRequirement === b.specialRequirement &&
    a.dosageUnit === b.dosageUnit
  );
}
