import type { VolumeUnitId } from '../volume-conversion/types';

/** Which synchronized field the user last edited. */
export type PintGallonSource = 'usPt' | 'ukPt' | 'usGal' | 'ukGal';

export type PintGallonUnit = PintGallonSource;

export interface PintsToGallonsInput {
  source: PintGallonSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface PintsToGallonsResult {
  source: PintGallonSource;
  usPt: number;
  ukPt: number;
  usGal: number;
  ukGal: number;
  explanation: string;
}

export type PintsToGallonsFieldErrors = Partial<Record<PintGallonSource, string>>;

/** Map UI source keys to volume-conversion registry IDs. */
export const SOURCE_TO_VOLUME_ID: Record<PintGallonSource, VolumeUnitId> = {
  usPt: 'usPt',
  ukPt: 'impPt',
  usGal: 'usLiquidGal',
  ukGal: 'imperialGal',
};

export const PRIMARY_SOURCES = ['usPt', 'ukPt', 'usGal', 'ukGal'] as const;

/** Exact mL definitions (task constants). */
export const VOLUME_UNITS_ML = {
  usPt: 473.176473,
  ukPt: 568.26125,
  usGal: 3785.411784,
  ukGal: 4546.09,
} as const;

export const PINTS_PER_GALLON = 8;

export const MAX_ABS_VALUE = 1e15;
