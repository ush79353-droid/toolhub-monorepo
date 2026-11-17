/** Medication concentration vs substance density. */
export type ConversionMode = 'medication' | 'substance';

/** Which quantity the user last edited. */
export type MassVolumeSource = 'mass' | 'volume';

export type ConcentrationUnit = 'mgPerMl' | 'mgPerCc' | 'mgPer5Ml';

export type DensityUnit = 'mgPerMl' | 'gPerMl' | 'kgPerL' | 'kgPerM3';

export type SubstanceId = 'custom' | 'water';

export interface MgToCcInput {
  mode: ConversionMode;
  source: MassVolumeSource;
  massMg: number | null;
  volumeCc: number | null;
  substance: SubstanceId;
  densityValue: number | null;
  densityUnit: DensityUnit;
  concentrationValue: number | null;
  concentrationUnit: ConcentrationUnit;
}

export interface MgToCcResult {
  mode: ConversionMode;
  source: MassVolumeSource;
  massMg: number;
  volumeCc: number;
  /** Exactly equal to volumeCc (1 cc = 1 mL). */
  volumeMl: number;
  factorMgPerMl: number;
  factorLabel: string;
  substanceLabel: string;
  explanation: string;
}

export type MgToCcFieldErrors = {
  massMg?: string;
  volumeCc?: string;
  densityValue?: string;
  concentrationValue?: string;
};

/** Normalize density display units to mg/mL (= mg/cc). */
export const MG_PER_ML_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  mgPerMl: 1,
  gPerMl: 1000,
  kgPerL: 1000,
  kgPerM3: 1,
};

/** Conventional water approximation ≈ 1 g/mL. */
export const WATER_DENSITY_MG_PER_ML = 1000;

export const CONCENTRATION_UNIT_OPTIONS: readonly {
  value: ConcentrationUnit;
  label: string;
}[] = [
  { value: 'mgPerMl', label: 'mg/mL' },
  { value: 'mgPerCc', label: 'mg/cc' },
  { value: 'mgPer5Ml', label: 'mg per 5 mL' },
] as const;

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'mgPerMl', label: 'mg/mL' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'kgPerM3', label: 'kg/m³' },
] as const;

export const SUBSTANCE_OPTIONS: readonly { value: SubstanceId; label: string }[] = [
  { value: 'custom', label: 'Custom substance' },
  { value: 'water', label: 'Water (approx. 1 g/mL)' },
] as const;

export const MAX_ABS_VALUE = 1e15;

/** Empty defaults per brief: medication mode, custom, blank fields. */
export const EMPTY_MG_TO_CC_INPUT: MgToCcInput = {
  mode: 'medication',
  source: 'mass',
  massMg: null,
  volumeCc: null,
  substance: 'custom',
  densityValue: null,
  densityUnit: 'gPerMl',
  concentrationValue: null,
  concentrationUnit: 'mgPerMl',
};
