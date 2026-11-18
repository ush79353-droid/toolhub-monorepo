import type { SubstanceCategory } from '../cubic-meter-to-ton/types';

export type { SubstanceCategory };

/** Which measure field the user last edited. */
export type GalTonsSource = 'volume' | 'mass';

export type DensityUnit =
  | 'kgPerM3'
  | 'gPerCm3'
  | 'gPerMl'
  | 'kgPerL'
  | 'lbPerFt3'
  | 'lbPerUsGal'
  | 'lbPerUkGal'
  | 'usTonPerUsGal'
  | 'ukTonPerUkGal'
  | 'metricTonPerUsGal';

export type VolumeUnit = 'usGal' | 'ukGal' | 'L' | 'mL' | 'm3' | 'ft3';

export type MassUnit = 'usTon' | 'ukTon' | 'metricTon' | 'kg' | 'lb';

export interface GalToTonsInput {
  source: GalTonsSource;
  category: SubstanceCategory;
  materialId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  volume: number | null;
  volumeUnit: VolumeUnit;
  mass: number | null;
  massUnit: MassUnit;
}

export interface GalToTonsResult {
  source: GalTonsSource;
  materialId: string;
  materialName: string;
  densityKgPerM3: number;
  densityApproximate: boolean;
  densityValue: number;
  densityUnit: DensityUnit;
  volume: number;
  volumeUnit: VolumeUnit;
  volumeM3: number;
  mass: number;
  massUnit: MassUnit;
  massKg: number;
  explanation: string;
}

export type GalToTonsFieldErrors = {
  densityValue?: string;
  volume?: string;
  mass?: string;
};

/** Exact: 1 US liquid gallon = 0.003785411784 m³. */
export const CUBIC_METERS_PER_US_GALLON = 0.003785411784;
/** Exact: 1 UK imperial gallon = 0.00454609 m³. */
export const CUBIC_METERS_PER_UK_GALLON = 0.00454609;
/** Exact: 1 ft = 0.3048 m → 1 ft³. */
export const CUBIC_METERS_PER_CUBIC_FOOT = 0.028316846592;

/** Exact international avoirdupois pound. */
export const KG_PER_POUND = 0.45359237;
/** Exact: 1 US short ton = 2000 lb. */
export const KG_PER_US_SHORT_TON = 2000 * KG_PER_POUND; // 907.18474
/** Exact: 1 UK long ton = 2240 lb. */
export const KG_PER_UK_LONG_TON = 2240 * KG_PER_POUND; // 1016.0469088
export const KG_PER_METRIC_TONNE = 1000;

export const CUBIC_METERS_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  usGal: CUBIC_METERS_PER_US_GALLON,
  ukGal: CUBIC_METERS_PER_UK_GALLON,
  L: 0.001,
  mL: 0.000001,
  m3: 1,
  ft3: CUBIC_METERS_PER_CUBIC_FOOT,
};

export const KG_PER_MASS_UNIT: Record<MassUnit, number> = {
  usTon: KG_PER_US_SHORT_TON,
  ukTon: KG_PER_UK_LONG_TON,
  metricTon: KG_PER_METRIC_TONNE,
  kg: 1,
  lb: KG_PER_POUND,
};

/**
 * Multiply displayed density by this to get kg/m³.
 * Ton/gallon and lb/gallon factors use exact SI definitions.
 */
export const KG_PER_M3_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  kgPerM3: 1,
  gPerCm3: 1000,
  gPerMl: 1000,
  kgPerL: 1000,
  lbPerFt3: KG_PER_POUND / CUBIC_METERS_PER_CUBIC_FOOT,
  lbPerUsGal: KG_PER_POUND / CUBIC_METERS_PER_US_GALLON,
  lbPerUkGal: KG_PER_POUND / CUBIC_METERS_PER_UK_GALLON,
  usTonPerUsGal: KG_PER_US_SHORT_TON / CUBIC_METERS_PER_US_GALLON,
  ukTonPerUkGal: KG_PER_UK_LONG_TON / CUBIC_METERS_PER_UK_GALLON,
  metricTonPerUsGal: KG_PER_METRIC_TONNE / CUBIC_METERS_PER_US_GALLON,
};

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'lbPerFt3', label: 'lb/ft³' },
  { value: 'lbPerUsGal', label: 'lb/US gal' },
  { value: 'lbPerUkGal', label: 'lb/UK gal' },
  { value: 'usTonPerUsGal', label: 'US ton/US gal' },
  { value: 'ukTonPerUkGal', label: 'UK ton/UK gal' },
  { value: 'metricTonPerUsGal', label: 't/US gal' },
] as const;

export const VOLUME_UNIT_OPTIONS: readonly { value: VolumeUnit; label: string }[] = [
  { value: 'usGal', label: 'US gal' },
  { value: 'ukGal', label: 'UK gal' },
  { value: 'L', label: 'L' },
  { value: 'mL', label: 'mL' },
  { value: 'm3', label: 'm³' },
  { value: 'ft3', label: 'ft³' },
] as const;

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] = [
  { value: 'usTon', label: 'US ton' },
  { value: 'ukTon', label: 'UK ton' },
  { value: 'metricTon', label: 't' },
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
] as const;

export const VOLUME_UNIT_LABEL: Record<VolumeUnit, string> = {
  usGal: 'US gal',
  ukGal: 'UK gal',
  L: 'L',
  mL: 'mL',
  m3: 'm³',
  ft3: 'ft³',
};

export const MASS_UNIT_LABEL: Record<MassUnit, string> = {
  usTon: 'US ton',
  ukTon: 'UK ton',
  metricTon: 't',
  kg: 'kg',
  lb: 'lb',
};

export {
  CATEGORY_OPTIONS,
  WATER_DENSITY_KG_PER_M3,
} from '../cubic-meter-to-ton/types';

export const MAX_ABS_VALUE = 1e15;
