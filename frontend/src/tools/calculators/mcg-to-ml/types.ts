/** Medication concentration vs other-substance density. */
export type CalcMode = 'medication' | 'density';

/** Which dosage field the user last edited. */
export type DosageSource = 'mass' | 'volume';

export type MedicationPreset = 'vitaminB12Example' | 'custom';

export type ConcentrationUnit = 'mcgPerMl' | 'mgPerMl' | 'gPerL' | 'mcgPerL';

export type DensityUnit = 'gPerMl' | 'kgPerL' | 'kgPerM3' | 'gPerCm3';

export type MassUnit = 'mcg' | 'mg' | 'g';

export type VolumeUnit = 'mL' | 'uL' | 'L';

export interface McgToMlInput {
  mode: CalcMode;
  source: DosageSource;
  massMcg: number | null;
  volumeMl: number | null;
  massUnit: MassUnit;
  volumeUnit: VolumeUnit;
  medicationPreset: MedicationPreset;
  concentrationValue: number | null;
  concentrationUnit: ConcentrationUnit;
  densityValue: number | null;
  densityUnit: DensityUnit;
}

export interface McgToMlResult {
  mode: CalcMode;
  source: DosageSource;
  massMcg: number;
  volumeMl: number;
  /** Canonical medication factor in mcg/mL, or density as g/mL. */
  factorLabel: string;
  concentrationMcgPerMl: number | null;
  densityGPerMl: number | null;
  explanation: string;
}

export type McgToMlFieldErrors = {
  massMcg?: string;
  volumeMl?: string;
  concentrationValue?: string;
  densityValue?: string;
};

/** Normalize concentration units to mcg/mL. */
export const MCG_PER_ML_PER_CONC_UNIT: Record<ConcentrationUnit, number> = {
  mcgPerMl: 1,
  mgPerMl: 1_000,
  gPerL: 1_000,
  mcgPerL: 0.001,
};

/** Normalize density units to g/mL. */
export const G_PER_ML_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  gPerMl: 1,
  kgPerL: 1,
  kgPerM3: 0.001,
  gPerCm3: 1,
};

export const MCG_PER_MASS_UNIT: Record<MassUnit, number> = {
  mcg: 1,
  mg: 1_000,
  g: 1_000_000,
};

export const ML_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  mL: 1,
  uL: 0.001,
  L: 1_000,
};

/** Example-only Vitamin B12 label strength — not universal. */
export const VITAMIN_B12_EXAMPLE_MCG_PER_ML = 1_000;

/** Approximate water density reference (varies with temperature). */
export const WATER_DENSITY_G_PER_ML = 1;

export const CONCENTRATION_UNIT_OPTIONS: readonly {
  value: ConcentrationUnit;
  label: string;
}[] = [
  { value: 'mcgPerMl', label: 'mcg/mL' },
  { value: 'mgPerMl', label: 'mg/mL' },
  { value: 'gPerL', label: 'g/L' },
  { value: 'mcgPerL', label: 'mcg/L' },
] as const;

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'kgPerM3', label: 'kg/m³' },
] as const;

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] = [
  { value: 'mcg', label: 'mcg' },
  { value: 'mg', label: 'mg' },
  { value: 'g', label: 'g' },
] as const;

export const VOLUME_UNIT_OPTIONS: readonly { value: VolumeUnit; label: string }[] = [
  { value: 'mL', label: 'mL' },
  { value: 'uL', label: 'µL' },
  { value: 'L', label: 'L' },
] as const;

export const MAX_ABS_VALUE = 1e15;

/** Demo: 500 mcg at 1,000 mcg/mL example → 0.5 mL. */
export const DEFAULT_MCG_TO_ML_INPUT: McgToMlInput = {
  mode: 'medication',
  source: 'mass',
  massMcg: 500,
  volumeMl: null,
  massUnit: 'mcg',
  volumeUnit: 'mL',
  medicationPreset: 'vitaminB12Example',
  concentrationValue: VITAMIN_B12_EXAMPLE_MCG_PER_ML,
  concentrationUnit: 'mcgPerMl',
  densityValue: WATER_DENSITY_G_PER_ML,
  densityUnit: 'gPerMl',
};

export const EMPTY_MCG_TO_ML_INPUT: McgToMlInput = {
  mode: 'medication',
  source: 'mass',
  massMcg: null,
  volumeMl: null,
  massUnit: 'mcg',
  volumeUnit: 'mL',
  medicationPreset: 'vitaminB12Example',
  concentrationValue: VITAMIN_B12_EXAMPLE_MCG_PER_ML,
  concentrationUnit: 'mcgPerMl',
  densityValue: WATER_DENSITY_G_PER_ML,
  densityUnit: 'gPerMl',
};
