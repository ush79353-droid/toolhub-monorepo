import type { SubstanceCategory } from '../cubic-meter-to-ton/types';

export type { SubstanceCategory };

export type GalKgSource = 'gallons' | 'kg' | 'otherMass';

export type GallonUnit = 'usGal' | 'ukGal';

export type DensityUnit =
  | 'kgPerL'
  | 'kgPerM3'
  | 'gPerMl'
  | 'gPerCm3'
  | 'lbPerFt3'
  | 'lbPerUsGal';

export type OtherMassUnit =
  | 'g'
  | 'mg'
  | 'kg'
  | 'lb'
  | 'oz'
  | 'metricTon'
  | 'usTon'
  | 'ukTon';

export interface GalToKgInput {
  source: GalKgSource;
  category: SubstanceCategory;
  materialId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  gallons: number | null;
  gallonUnit: GallonUnit;
  kg: number | null;
  otherMass: number | null;
  otherMassUnit: OtherMassUnit;
}

export interface GalToKgResult {
  source: GalKgSource;
  materialId: string;
  materialName: string;
  densityKgPerL: number;
  densityApproximate: boolean;
  densityValue: number;
  densityUnit: DensityUnit;
  gallons: number;
  gallonUnit: GallonUnit;
  kg: number;
  otherMass: number;
  otherMassUnit: OtherMassUnit;
  explanation: string;
}

export type GalToKgFieldErrors = {
  densityValue?: string;
  gallons?: string;
  kg?: string;
  otherMass?: string;
};

/** Exact: 1 US liquid gallon = 3.785411784 L. */
export const LITERS_PER_US_GALLON = 3.785411784;
/** Exact: 1 UK imperial gallon = 4.54609 L. */
export const LITERS_PER_UK_GALLON = 4.54609;

export const LITERS_PER_GALLON: Record<GallonUnit, number> = {
  usGal: LITERS_PER_US_GALLON,
  ukGal: LITERS_PER_UK_GALLON,
};

/** Exact international avoirdupois pound. */
export const KG_PER_POUND = 0.45359237;
export const KG_PER_OUNCE = KG_PER_POUND / 16;
export const KG_PER_US_SHORT_TON = 2000 * KG_PER_POUND;
export const KG_PER_UK_LONG_TON = 2240 * KG_PER_POUND;
export const CUBIC_METERS_PER_CUBIC_FOOT = 0.028316846592;
export const CUBIC_METERS_PER_US_GALLON = 0.003785411784;

/** Multiply displayed density by this to get kg/L. */
export const KG_PER_L_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  kgPerL: 1,
  kgPerM3: 0.001,
  gPerMl: 1,
  gPerCm3: 1,
  lbPerFt3: KG_PER_POUND / (CUBIC_METERS_PER_CUBIC_FOOT * 1000),
  lbPerUsGal: KG_PER_POUND / LITERS_PER_US_GALLON,
};

/** Multiply displayed mass by this to get kilograms. */
export const KG_PER_OTHER_MASS_UNIT: Record<OtherMassUnit, number> = {
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  lb: KG_PER_POUND,
  oz: KG_PER_OUNCE,
  metricTon: 1000,
  usTon: KG_PER_US_SHORT_TON,
  ukTon: KG_PER_UK_LONG_TON,
};

export const GALLON_UNIT_OPTIONS: readonly { value: GallonUnit; label: string }[] = [
  { value: 'usGal', label: 'US gal' },
  { value: 'ukGal', label: 'UK gal' },
] as const;

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'lbPerFt3', label: 'lb/ft³' },
  { value: 'lbPerUsGal', label: 'lb/US gal' },
] as const;

export const OTHER_MASS_UNIT_OPTIONS: readonly { value: OtherMassUnit; label: string }[] = [
  { value: 'metricTon', label: 't' },
  { value: 'g', label: 'g' },
  { value: 'mg', label: 'mg' },
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
  { value: 'oz', label: 'oz' },
  { value: 'usTon', label: 'US ton' },
  { value: 'ukTon', label: 'UK ton' },
] as const;

export const GALLON_UNIT_LABEL: Record<GallonUnit, string> = {
  usGal: 'US gal',
  ukGal: 'UK gal',
};

export const OTHER_MASS_UNIT_LABEL: Record<OtherMassUnit, string> = {
  metricTon: 't',
  g: 'g',
  mg: 'mg',
  kg: 'kg',
  lb: 'lb',
  oz: 'oz',
  usTon: 'US ton',
  ukTon: 'UK ton',
};

export {
  CATEGORY_OPTIONS,
  WATER_DENSITY_KG_PER_M3,
} from '../cubic-meter-to-ton/types';

/** Water at 1 kg/L (= 1000 kg/m³). */
export const WATER_DENSITY_KG_PER_L = 1;

export const MAX_ABS_VALUE = 1e15;
