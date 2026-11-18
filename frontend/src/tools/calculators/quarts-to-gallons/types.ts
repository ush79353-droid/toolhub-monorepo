import type { VolumeUnitId } from '../volume-conversion/types';

export type GallonUnit = 'usGal' | 'ukGal';
export type QuartUnit = 'usQt' | 'ukQt' | 'usDryQt';
export type QtGalSource = 'quarts' | 'gallons' | ExtraVolumeUnit;

export type QuartGallonUnit = GallonUnit | QuartUnit;

/** Extra units under “Other relevant units”. */
export type ExtraVolumeUnit =
  | 'usCup'
  | 'usPt'
  | 'usFlOz'
  | 'mL'
  | 'L'
  | 'impPt'
  | 'impCup';

export const EXTRA_VOLUME_UNITS = [
  'usCup',
  'usPt',
  'usFlOz',
  'mL',
  'L',
  'impPt',
  'impCup',
] as const satisfies readonly ExtraVolumeUnit[];

export const EXTRA_VOLUME_LABELS: Record<ExtraVolumeUnit, string> = {
  usCup: 'US cups',
  usPt: 'US pints',
  usFlOz: 'US fluid ounces',
  mL: 'Milliliters',
  L: 'Liters',
  impPt: 'UK imperial pints',
  impCup: 'UK imperial cups',
};

export const EXTRA_VOLUME_SYMBOLS: Record<ExtraVolumeUnit, string> = {
  usCup: 'US cup',
  usPt: 'US pt',
  usFlOz: 'US fl oz',
  mL: 'mL',
  L: 'L',
  impPt: 'UK pt',
  impCup: 'UK cup',
};

export interface QuartsToGallonsInput {
  source: QtGalSource;
  value: number | null;
  gallonUnit: GallonUnit;
  quartUnit: QuartUnit;
}

export interface QuartsToGallonsResult {
  source: QtGalSource;
  quarts: number;
  gallons: number;
  liters: number;
  gallonUnit: GallonUnit;
  quartUnit: QuartUnit;
  extras: Record<ExtraVolumeUnit, number>;
  explanation: string;
}

export type QuartsToGallonsFieldErrors = Partial<Record<QtGalSource, string>>;

export const SOURCE_TO_VOLUME_ID: Record<QuartGallonUnit, VolumeUnitId> = {
  usGal: 'usLiquidGal',
  ukGal: 'imperialGal',
  usQt: 'usQt',
  ukQt: 'impQt',
  usDryQt: 'usDryQt',
};

export const EXTRA_TO_VOLUME_ID: Record<ExtraVolumeUnit, VolumeUnitId> = {
  usCup: 'usCup',
  usPt: 'usPt',
  usFlOz: 'usFlOz',
  mL: 'mL',
  L: 'L',
  impPt: 'impPt',
  impCup: 'imperialCup',
};

export const GALLON_UNIT_OPTIONS: readonly { value: GallonUnit; label: string }[] = [
  { value: 'usGal', label: 'US gal' },
  { value: 'ukGal', label: 'UK gal' },
] as const;

export const QUART_UNIT_OPTIONS: readonly { value: QuartUnit; label: string }[] = [
  { value: 'usQt', label: 'US qt' },
  { value: 'ukQt', label: 'UK qt' },
  { value: 'usDryQt', label: 'US dry qt' },
] as const;

export const GALLON_UNIT_LABEL: Record<GallonUnit, string> = {
  usGal: 'US gal',
  ukGal: 'UK gal',
};

export const QUART_UNIT_LABEL: Record<QuartUnit, string> = {
  usQt: 'US qt',
  ukQt: 'UK qt',
  usDryQt: 'US dry qt',
};

export const DEFAULT_GALLON_UNIT: GallonUnit = 'usGal';
export const DEFAULT_QUART_UNIT: QuartUnit = 'usQt';

/** Same-system US liquid: 1 gal = 4 qt. */
export const US_QUARTS_PER_GALLON = 4;

/** Exact mL constants (task / shared volume engine). */
export const VOLUME_UNITS_ML = {
  usLiquidQuart: 946.352946,
  usLiquidGallon: 3785.411784,
  imperialQuart: 1136.5225,
  imperialGallon: 4546.09,
  usDryQuart: 1101.220942715,
  usCup: 236.5882365,
} as const;

export const MAX_ABS_VALUE = 1e15;
