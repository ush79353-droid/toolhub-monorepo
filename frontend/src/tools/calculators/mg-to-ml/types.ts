/** Density-based substance mass/volume vs labeled medication concentration. */
export type CalcMode = 'density' | 'medication';

/** Which quantity the user last edited for the bidirectional pair. */
export type MassVolumeSource = 'mass' | 'volume';

export type DensityUnit = 'gPerMl' | 'mgPerMl' | 'kgPerM3' | 'gPerCm3';

export type SubstanceId = 'water' | 'custom';

/** Direct mg/mL vs labeled mass over a stated liquid volume. */
export type ConcentrationFormat = 'mgPerMl' | 'mgPerVolume';

export interface MgToMlInput {
  mode: CalcMode;
  source: MassVolumeSource;
  massMg: number | null;
  volumeMl: number | null;
  /** Density mode */
  substance: SubstanceId;
  densityValue: number | null;
  densityUnit: DensityUnit;
  /** Medication mode */
  concentrationFormat: ConcentrationFormat;
  /** Used when format is mgPerMl. */
  concentrationMgPerMl: number | null;
  /** Used when format is mgPerVolume. */
  labelMassMg: number | null;
  labelVolumeMl: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface MgToMlResult {
  mode: CalcMode;
  source: MassVolumeSource;
  massMg: number;
  volumeMl: number;
  /** Canonical factor used: density or concentration in mg/mL. */
  factorMgPerMl: number;
  factorLabel: string;
  substanceLabel: string;
  otherMassUnits: readonly OtherUnitRow[];
  otherVolumeUnits: readonly OtherUnitRow[];
}

export type MgToMlFieldErrors = {
  massMg?: string;
  volumeMl?: string;
  densityValue?: string;
  concentrationMgPerMl?: string;
  labelMassMg?: string;
  labelVolumeMl?: string;
};

/** Exact: 1 g/mL = 1000 mg/mL; 1 g/cm³ = 1 g/mL; 1 kg/m³ = 1 mg/mL. */
export const MG_PER_ML_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  gPerMl: 1000,
  mgPerMl: 1,
  kgPerM3: 1,
  gPerCm3: 1000,
};

/** Conventional water approximation for educational density mode (≈ 1 g/mL). */
export const WATER_DENSITY_MG_PER_ML = 1000;

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'mgPerMl', label: 'mg/mL' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'kgPerM3', label: 'kg/m³' },
] as const;

export const SUBSTANCE_OPTIONS: readonly { value: SubstanceId; label: string }[] = [
  { value: 'water', label: 'Water (approx. 1 g/mL)' },
  { value: 'custom', label: 'Custom substance' },
] as const;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: medication 20 mg/mL, 100 mg → 5 mL. */
export const DEFAULT_MG_TO_ML_INPUT: MgToMlInput = {
  mode: 'medication',
  source: 'mass',
  massMg: 100,
  volumeMl: null,
  substance: 'water',
  densityValue: WATER_DENSITY_MG_PER_ML,
  densityUnit: 'mgPerMl',
  concentrationFormat: 'mgPerMl',
  concentrationMgPerMl: 20,
  labelMassMg: 100,
  labelVolumeMl: 5,
};

export const EMPTY_MG_TO_ML_INPUT: MgToMlInput = {
  mode: 'medication',
  source: 'mass',
  massMg: null,
  volumeMl: null,
  substance: 'water',
  densityValue: WATER_DENSITY_MG_PER_ML,
  densityUnit: 'mgPerMl',
  concentrationFormat: 'mgPerMl',
  concentrationMgPerMl: null,
  labelMassMg: null,
  labelVolumeMl: null,
};
