/** Which field the user last edited. */
export type KgMlSource = 'mass' | 'volume';

export type DensityUnit = 'kgPerM3' | 'kgPerL' | 'gPerMl' | 'gPerCm3';

export interface KgToMlInput {
  source: KgMlSource;
  substanceId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  massKg: number | null;
  volumeMl: number | null;
}

export interface KgToMlResult {
  source: KgMlSource;
  substanceId: string;
  substanceName: string;
  densityKgPerM3: number;
  densityApproximate: boolean;
  densityValue: number;
  densityUnit: DensityUnit;
  massKg: number;
  volumeMl: number;
  explanation: string;
}

export type KgToMlFieldErrors = {
  densityValue?: string;
  massKg?: string;
  volumeMl?: string;
};

/**
 * Multiply displayed density by this to get kg/m³.
 * 1 kg/L = 1 g/mL = 1 g/cm³ = 1000 kg/m³.
 */
export const KG_PER_M3_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  kgPerM3: 1,
  kgPerL: 1000,
  gPerMl: 1000,
  gPerCm3: 1000,
};

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'gPerCm3', label: 'g/cm³' },
] as const;

/**
 * Conventional water simplifying assumption ≈ 1000 kg/m³.
 * Not exact at every temperature/pressure.
 */
export const WATER_DENSITY_KG_PER_M3 = 1000;

export const MAX_ABS_VALUE = 1e15;
