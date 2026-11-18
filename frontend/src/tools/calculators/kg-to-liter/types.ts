/** Which field the user last edited. */
export type KgLiterSource = 'mass' | 'volume';

export type DensityUnit = 'kgPerL' | 'kgPerM3' | 'gPerMl' | 'gPerCm3';

export interface KgToLiterInput {
  source: KgLiterSource;
  substanceId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  massKg: number | null;
  volumeL: number | null;
}

export interface KgToLiterResult {
  source: KgLiterSource;
  substanceId: string;
  substanceName: string;
  densityKgPerL: number;
  densityApproximate: boolean;
  densityValue: number;
  densityUnit: DensityUnit;
  massKg: number;
  volumeL: number;
  explanation: string;
}

export type KgToLiterFieldErrors = {
  densityValue?: string;
  massKg?: string;
  volumeL?: string;
};

/**
 * Multiply displayed density by this to get kg/L.
 * 1 kg/L = 1 g/mL = 1 g/cm³ = 1000 kg/m³.
 */
export const KG_PER_L_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  kgPerL: 1,
  gPerMl: 1,
  gPerCm3: 1,
  kgPerM3: 0.001,
};

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'kgPerM3', label: 'kg/m³' },
] as const;

/**
 * Conventional fresh-water simplifying assumption ≈ 1 kg/L.
 * Not exact at every temperature/pressure.
 */
export const WATER_DENSITY_KG_PER_L = 1;

export const MAX_ABS_VALUE = 1e15;
