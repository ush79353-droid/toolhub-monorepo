import type { VolumeUnitId } from '../volume-conversion/types';

/** Which synchronized field the user last edited. */
export type VolumeSource =
  | 'usGal'
  | 'ukGal'
  | 'usPt'
  | 'ukPt'
  | 'mL'
  | 'L'
  | 'usFlOz'
  | 'ukFlOz'
  | 'usQt'
  | 'ukQt'
  | 'm3';

export type VolumeUnit = VolumeSource;

export interface GalToPintsInput {
  source: VolumeSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface MoreVolumeRow {
  unit: VolumeSource;
  label: string;
  symbol: string;
  value: number;
}

export interface GalToPintsResult {
  source: VolumeSource;
  usGal: number;
  ukGal: number;
  usPt: number;
  ukPt: number;
  more: readonly MoreVolumeRow[];
  explanation: string;
}

export type GalToPintsFieldErrors = Partial<Record<VolumeSource, string>>;

/** Map UI source keys to volume-conversion registry IDs. */
export const SOURCE_TO_VOLUME_ID: Record<VolumeSource, VolumeUnitId> = {
  usGal: 'usLiquidGal',
  ukGal: 'imperialGal',
  usPt: 'usPt',
  ukPt: 'impPt',
  mL: 'mL',
  L: 'L',
  usFlOz: 'usFlOz',
  ukFlOz: 'impFlOz',
  usQt: 'usQt',
  ukQt: 'impQt',
  m3: 'm3',
};

export const PRIMARY_SOURCES = ['usGal', 'ukGal', 'usPt', 'ukPt'] as const;

export const MORE_SOURCES: readonly {
  unit: VolumeSource;
  label: string;
  symbol: string;
}[] = [
  { unit: 'mL', label: 'Milliliters', symbol: 'mL' },
  { unit: 'L', label: 'Liters', symbol: 'L' },
  { unit: 'usFlOz', label: 'US fluid ounces', symbol: 'US fl oz' },
  { unit: 'ukFlOz', label: 'UK fluid ounces', symbol: 'UK fl oz' },
  { unit: 'usQt', label: 'US quarts', symbol: 'US qt' },
  { unit: 'ukQt', label: 'UK quarts', symbol: 'UK qt' },
  { unit: 'm3', label: 'Cubic meters', symbol: 'm³' },
] as const;

export const MAX_ABS_VALUE = 1e15;
