/** Which field the user last edited among volume/mass. */
export type CubicMeterTonSource = 'volume' | 'mass';

export type DensityUnit = 'kgPerM3' | 'gPerCm3' | 'gPerMl' | 'lbPerFt3';

export type TonUnit = 'metricTonne' | 'usShortTon' | 'ukLongTon';

export type SubstanceCategory =
  | 'liquids'
  | 'construction'
  | 'metals'
  | 'wood'
  | 'soil'
  | 'other'
  | 'custom';

export interface CubicMeterToTonInput {
  source: CubicMeterTonSource;
  category: SubstanceCategory;
  materialId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  volumeM3: number | null;
  massTons: number | null;
  tonUnit: TonUnit;
}

export interface CubicMeterToTonResult {
  source: CubicMeterTonSource;
  materialId: string;
  materialName: string;
  densityKgPerM3: number;
  densityApproximate: boolean;
  densityValue: number;
  densityUnit: DensityUnit;
  volumeM3: number;
  massTons: number;
  massKg: number;
  tonUnit: TonUnit;
  explanation: string;
}

export type CubicMeterToTonFieldErrors = {
  densityValue?: string;
  volumeM3?: string;
  massTons?: string;
};

/** Exact international avoirdupois pound. */
export const KG_PER_POUND = 0.45359237;

/** Exact: 1 ft = 0.3048 m → 1 ft³ = 0.028316846592 m³. */
export const CUBIC_METERS_PER_CUBIC_FOOT = 0.028316846592;

/** Exact: 1 metric tonne = 1000 kg. */
export const KG_PER_METRIC_TONNE = 1000;

/** Exact: 1 US short ton = 2000 lb. */
export const KG_PER_US_SHORT_TON = 2000 * KG_PER_POUND; // 907.18474

/** Exact: 1 UK long ton = 2240 lb. */
export const KG_PER_UK_LONG_TON = 2240 * KG_PER_POUND; // 1016.0469088

export const KG_PER_TON: Record<TonUnit, number> = {
  metricTonne: KG_PER_METRIC_TONNE,
  usShortTon: KG_PER_US_SHORT_TON,
  ukLongTon: KG_PER_UK_LONG_TON,
};

export const KG_PER_M3_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  kgPerM3: 1,
  gPerCm3: 1000,
  gPerMl: 1000,
  lbPerFt3: KG_PER_POUND / CUBIC_METERS_PER_CUBIC_FOOT,
};

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'lbPerFt3', label: 'lb/ft³' },
] as const;

export const TON_UNIT_OPTIONS: readonly { value: TonUnit; label: string }[] = [
  { value: 'metricTonne', label: 'metric t' },
  { value: 'usShortTon', label: 'US short ton' },
  { value: 'ukLongTon', label: 'UK long ton' },
] as const;

export const TON_UNIT_LABEL: Record<TonUnit, string> = {
  metricTonne: 'metric t',
  usShortTon: 'US short ton',
  ukLongTon: 'UK long ton',
};

export const CATEGORY_OPTIONS: readonly { value: SubstanceCategory; label: string }[] = [
  { value: 'liquids', label: 'Liquids' },
  { value: 'construction', label: 'Construction materials' },
  { value: 'metals', label: 'Metals' },
  { value: 'wood', label: 'Wood' },
  { value: 'soil', label: 'Soil and aggregates' },
  { value: 'other', label: 'Other substances' },
  { value: 'custom', label: 'Custom density' },
] as const;

/** Conventional fresh water near 4 °C. */
export const WATER_DENSITY_KG_PER_M3 = 1000;

export const MAX_ABS_VALUE = 1e15;

/** Default: Liquids / fresh water 4 °C / 1000 kg/m³ / metric tonne; volume and mass empty. */
export const DEFAULT_CUBIC_METER_TO_TON_INPUT: CubicMeterToTonInput = {
  source: 'volume',
  category: 'liquids',
  materialId: 'fresh-water-4c',
  densityValue: WATER_DENSITY_KG_PER_M3,
  densityUnit: 'kgPerM3',
  volumeM3: null,
  massTons: null,
  tonUnit: 'metricTonne',
};
