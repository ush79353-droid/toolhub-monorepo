export type GramLiterSource = 'mass' | 'volume';

export type DensityUnit =
  | 'kgPerM3'
  | 'gPerMl'
  | 'gPerCm3'
  | 'gPerL'
  | 'kgPerL'
  | 'lbPerFt3'
  | 'lbPerUsGal';

export type MassUnit = 'mg' | 'g' | 'kg' | 'oz' | 'lb' | 'metricTon';

export type VolumeUnit =
  | 'mL'
  | 'L'
  | 'cm3'
  | 'm3'
  | 'usFlOz'
  | 'ukFlOz'
  | 'usCup'
  | 'usPt'
  | 'usQt'
  | 'usGal'
  | 'ukGal';

export interface GramToLiterInput {
  source: GramLiterSource;
  substanceId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  mass: number | null;
  massUnit: MassUnit;
  volume: number | null;
  volumeUnit: VolumeUnit;
}

export interface GramToLiterResult {
  source: GramLiterSource;
  substanceId: string;
  substanceName: string;
  densityKgPerM3: number;
  densityApproximate: boolean;
  densityValue: number;
  densityUnit: DensityUnit;
  mass: number;
  massUnit: MassUnit;
  massG: number;
  volume: number;
  volumeUnit: VolumeUnit;
  volumeL: number;
  explanation: string;
}

export type GramToLiterFieldErrors = {
  densityValue?: string;
  mass?: string;
  volume?: string;
};

/** Exact: 1 US fl oz = 29.5735295625 mL. */
export const US_FL_OZ_IN_ML = 29.5735295625;
/** Exact: 1 UK fl oz = 28.4130625 mL. */
export const UK_FL_OZ_IN_ML = 28.4130625;
export const ML_PER_US_GALLON = US_FL_OZ_IN_ML * 128;
export const ML_PER_UK_GALLON = UK_FL_OZ_IN_ML * 160;
export const CUBIC_METERS_PER_CUBIC_FOOT = 0.028316846592;
export const KG_PER_POUND = 0.45359237;

/** Liters per volume unit. */
export const L_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  mL: 0.001,
  L: 1,
  cm3: 0.001,
  m3: 1000,
  usFlOz: US_FL_OZ_IN_ML / 1000,
  ukFlOz: UK_FL_OZ_IN_ML / 1000,
  usCup: 0.2365882365,
  usPt: ML_PER_US_GALLON / 8000,
  usQt: ML_PER_US_GALLON / 4000,
  usGal: ML_PER_US_GALLON / 1000,
  ukGal: ML_PER_UK_GALLON / 1000,
};

export const G_PER_MASS_UNIT: Record<MassUnit, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  oz: (KG_PER_POUND * 1000) / 16,
  lb: KG_PER_POUND * 1000,
  metricTon: 1_000_000,
};

/** Multiply displayed density by this to get kg/m³. */
export const KG_PER_M3_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  kgPerM3: 1,
  gPerL: 1,
  gPerMl: 1000,
  gPerCm3: 1000,
  kgPerL: 1000,
  lbPerFt3: KG_PER_POUND / CUBIC_METERS_PER_CUBIC_FOOT,
  lbPerUsGal: KG_PER_POUND / (ML_PER_US_GALLON / 1_000_000),
};

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'gPerL', label: 'g/L' },
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'lbPerFt3', label: 'lb/ft³' },
  { value: 'lbPerUsGal', label: 'lb/US gal' },
] as const;

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] = [
  { value: 'g', label: 'g' },
  { value: 'mg', label: 'mg' },
  { value: 'kg', label: 'kg' },
  { value: 'oz', label: 'oz' },
  { value: 'lb', label: 'lb' },
  { value: 'metricTon', label: 't' },
] as const;

export const VOLUME_UNIT_OPTIONS: readonly { value: VolumeUnit; label: string }[] = [
  { value: 'L', label: 'L' },
  { value: 'mL', label: 'mL' },
  { value: 'cm3', label: 'cm³' },
  { value: 'm3', label: 'm³' },
  { value: 'usFlOz', label: 'US fl oz' },
  { value: 'ukFlOz', label: 'UK fl oz' },
  { value: 'usCup', label: 'US cup' },
  { value: 'usPt', label: 'US pt' },
  { value: 'usQt', label: 'US qt' },
  { value: 'usGal', label: 'US gal' },
  { value: 'ukGal', label: 'UK gal' },
] as const;

export const MASS_UNIT_LABEL: Record<MassUnit, string> = {
  mg: 'mg',
  g: 'g',
  kg: 'kg',
  oz: 'oz',
  lb: 'lb',
  metricTon: 't',
};

export const VOLUME_UNIT_LABEL: Record<VolumeUnit, string> = {
  mL: 'mL',
  L: 'L',
  cm3: 'cm³',
  m3: 'm³',
  usFlOz: 'US fl oz',
  ukFlOz: 'UK fl oz',
  usCup: 'US cup',
  usPt: 'US pt',
  usQt: 'US qt',
  usGal: 'US gal',
  ukGal: 'UK gal',
};

/** Conventional water ≈ 1000 kg/m³ (= 1 g/mL = 1000 g/L). */
export const WATER_DENSITY_KG_PER_M3 = 1000;

export const MAX_ABS_VALUE = 1e15;
