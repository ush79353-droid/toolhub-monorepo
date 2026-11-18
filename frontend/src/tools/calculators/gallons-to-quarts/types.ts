import type { VolumeUnitId } from '../volume-conversion/types';

export type GallonUnit = 'usGal' | 'ukGal';
export type QuartUnit = 'usQt' | 'ukQt';
export type GalQtSource = 'gallons' | 'quarts';

export type GallonQuartUnit = GallonUnit | QuartUnit;

export interface GalToQuartsInput {
  source: GalQtSource;
  value: number | null;
  gallonUnit: GallonUnit;
  quartUnit: QuartUnit;
}

export interface GalToQuartsResult {
  source: GalQtSource;
  gallons: number;
  quarts: number;
  liters: number;
  gallonUnit: GallonUnit;
  quartUnit: QuartUnit;
  explanation: string;
}

export type GalToQuartsFieldErrors = Partial<Record<GalQtSource, string>>;

export const SOURCE_TO_VOLUME_ID: Record<GallonQuartUnit, VolumeUnitId> = {
  usGal: 'usLiquidGal',
  ukGal: 'imperialGal',
  usQt: 'usQt',
  ukQt: 'impQt',
};

export const GALLON_UNIT_OPTIONS: readonly { value: GallonUnit; label: string }[] = [
  { value: 'usGal', label: 'US gal' },
  { value: 'ukGal', label: 'UK gal' },
] as const;

export const QUART_UNIT_OPTIONS: readonly { value: QuartUnit; label: string }[] = [
  { value: 'usQt', label: 'US qt' },
  { value: 'ukQt', label: 'UK qt' },
] as const;

export const GALLON_UNIT_LABEL: Record<GallonUnit, string> = {
  usGal: 'US gal',
  ukGal: 'UK gal',
};

export const QUART_UNIT_LABEL: Record<QuartUnit, string> = {
  usQt: 'US qt',
  ukQt: 'UK qt',
};

export const DEFAULT_GALLON_UNIT: GallonUnit = 'usGal';
export const DEFAULT_QUART_UNIT: QuartUnit = 'usQt';

export const MAX_ABS_VALUE = 1e15;
