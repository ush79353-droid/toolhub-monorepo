/** Which quantity the user last edited. The other field is derived. */
export type McgIuSource = 'mass' | 'iu';

export type MassUnit = 'mcg' | 'mg' | 'g';

/**
 * Labeled vitamin forms with published IU ↔ mass factors (NIH ODS / FDA).
 * Do not invent additional substances without a primary labeled source.
 */
export type McgIuSubstance =
  | 'vitaminD'
  | 'vitaminARetinol'
  | 'vitaminASuppBetaCarotene'
  | 'vitaminADietaryBetaCarotene'
  | 'vitaminADietaryOtherCarotenoids'
  | 'vitaminENatural'
  | 'vitaminESynthetic';

export interface McgToIuInput {
  substance: McgIuSubstance;
  source: McgIuSource;
  /** Mass in micrograms (or mcg RAE for vitamin A presets). null while blank/incomplete. */
  massMcg: number | null;
  iu: number | null;
  massUnit: MassUnit;
}

export interface McgToIuResult {
  substance: McgIuSubstance;
  source: McgIuSource;
  massMcg: number;
  iu: number;
  /** Micrograms (or mcg RAE) corresponding to 1 IU for the selected form. */
  mcgPerIu: number;
  substanceLabel: string;
  factorNote: string;
  explanation: string;
}

export type McgToIuFieldErrors = {
  massMcg?: string;
  iu?: string;
  substance?: string;
};

export const MCG_PER_MASS_UNIT: Record<MassUnit, number> = {
  mcg: 1,
  mg: 1_000,
  g: 1_000_000,
};

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] = [
  { value: 'mcg', label: 'mcg' },
  { value: 'mg', label: 'mg' },
  { value: 'g', label: 'g' },
] as const;

export interface SubstanceOption {
  value: McgIuSubstance;
  label: string;
  /** mcg (or mcg RAE for vitamin A) per 1 IU — NIH ODS / FDA labeled factors only. */
  mcgPerIu: number;
  /** Short citation for UI tip / factor note. */
  sourceNote: string;
}

/**
 * Conversion table — primary sources only:
 * - Vitamin D: NIH ODS (1 mcg = 40 IU) / FDA IU×0.025 = mcg
 * - Vitamin A IU→mcg RAE: NIH ODS Vitamin A fact sheet / FDA labeling guidance
 * - Vitamin E IU→mg α-tocopherol: NIH ODS (natural 0.67 mg; synthetic 0.45 mg)
 */
export const SUBSTANCE_OPTIONS: readonly SubstanceOption[] = [
  {
    value: 'vitaminD',
    label: 'Vitamin D (D₂ or D₃)',
    mcgPerIu: 0.025,
    sourceNote: 'NIH ODS / FDA: 1 mcg vitamin D = 40 IU (1 IU = 0.025 mcg).',
  },
  {
    value: 'vitaminARetinol',
    label: 'Vitamin A: retinol',
    mcgPerIu: 0.3,
    sourceNote: 'NIH ODS: 1 IU retinol = 0.3 mcg RAE.',
  },
  {
    value: 'vitaminASuppBetaCarotene',
    label: 'Vitamin A: supplemental β-carotene',
    mcgPerIu: 0.3,
    sourceNote: 'NIH ODS: 1 IU supplemental β-carotene = 0.3 mcg RAE.',
  },
  {
    value: 'vitaminADietaryBetaCarotene',
    label: 'Vitamin A: dietary β-carotene',
    mcgPerIu: 0.05,
    sourceNote: 'NIH ODS: 1 IU dietary β-carotene = 0.05 mcg RAE.',
  },
  {
    value: 'vitaminADietaryOtherCarotenoids',
    label: 'Vitamin A: dietary α-carotene or β-cryptoxanthin',
    mcgPerIu: 0.025,
    sourceNote: 'NIH ODS: 1 IU dietary α-carotene or β-cryptoxanthin = 0.025 mcg RAE.',
  },
  {
    value: 'vitaminENatural',
    label: 'Vitamin E: natural (d-α-tocopherol)',
    mcgPerIu: 670,
    sourceNote: 'NIH ODS: 1 IU natural vitamin E = 0.67 mg α-tocopherol (670 mcg).',
  },
  {
    value: 'vitaminESynthetic',
    label: 'Vitamin E: synthetic (dl-α-tocopherol)',
    mcgPerIu: 450,
    sourceNote: 'NIH ODS: 1 IU synthetic vitamin E = 0.45 mg α-tocopherol (450 mcg).',
  },
] as const;

export const DEFAULT_SUBSTANCE: McgIuSubstance = 'vitaminD';

export const MAX_ABS_VALUE = 1e15;

/** Screenshot default: Vitamin D selected; mass and IU blank (no seeded dose). */
export const EMPTY_MCG_TO_IU_INPUT: McgToIuInput = {
  substance: DEFAULT_SUBSTANCE,
  source: 'mass',
  massMcg: null,
  iu: null,
  massUnit: 'mcg',
};

/** Reload target mirrors the empty educational starting state. */
export const DEFAULT_MCG_TO_IU_INPUT: McgToIuInput = EMPTY_MCG_TO_IU_INPUT;
