import type { DensityUnit } from '../kg-to-ml/types';

export type { DensityUnit };
export {
  DENSITY_UNIT_OPTIONS,
  KG_PER_M3_PER_DENSITY_UNIT,
  MAX_ABS_VALUE,
  WATER_DENSITY_KG_PER_M3,
} from '../kg-to-ml/types';

export type MlKgSource = 'volume' | 'mass';

export type VolumeUnit = 'ml' | 'l' | 'cm3' | 'm3' | 'usFlOz';
export type MassUnit = 'kg' | 'g' | 'mg' | 'lb' | 'oz';

export interface MlToKgInput {
  source: MlKgSource;
  substanceId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  volumeValue: number | null;
  volumeUnit: VolumeUnit;
  massValue: number | null;
  massUnit: MassUnit;
}

export interface MlToKgResult {
  source: MlKgSource;
  substanceId: string;
  substanceName: string;
  densityKgPerM3: number;
  densityApproximate: boolean;
  densityValue: number;
  densityUnit: DensityUnit;
  volumeMl: number;
  volumeValue: number;
  volumeUnit: VolumeUnit;
  massKg: number;
  massValue: number;
  massUnit: MassUnit;
  explanation: string;
}

export type MlToKgFieldErrors = {
  densityValue?: string;
  volumeValue?: string;
  massValue?: string;
};

/** Multiply displayed volume by this to get milliliters. */
export const ML_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  ml: 1,
  l: 1000,
  cm3: 1,
  m3: 1_000_000,
  usFlOz: 29.5735295625,
};

/** Multiply displayed mass by this to get kilograms. */
export const KG_PER_MASS_UNIT: Record<MassUnit, number> = {
  kg: 1,
  g: 0.001,
  mg: 0.000_001,
  lb: 0.45359237,
  oz: 0.028349523125,
};

export const VOLUME_UNIT_OPTIONS: readonly { value: VolumeUnit; label: string }[] = [
  { value: 'ml', label: 'mL' },
  { value: 'l', label: 'L' },
  { value: 'cm3', label: 'cm³' },
  { value: 'm3', label: 'm³' },
  { value: 'usFlOz', label: 'US fl oz' },
];

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] = [
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'mg', label: 'mg' },
  { value: 'lb', label: 'lb' },
  { value: 'oz', label: 'oz' },
];
