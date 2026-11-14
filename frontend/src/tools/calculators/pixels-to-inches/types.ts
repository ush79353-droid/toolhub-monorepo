/** Which measurement the user last edited. PPI is configuration, not a source. */
export type PixelsInchesSource = 'inches' | 'pixels';

export interface PixelsToInchesInput {
  source: PixelsInchesSource;
  /** null while the active source field is blank. */
  inches: number | null;
  pixels: number | null;
  /** PPI must be a finite number greater than zero when calculating. */
  ppi: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface PixelsToInchesResult {
  source: PixelsInchesSource;
  inches: number;
  pixels: number;
  ppi: number;
  otherUnits: readonly OtherUnitRow[];
}

export type PixelsToInchesFieldErrors = {
  inches?: string;
  pixels?: string;
  ppi?: string;
};

/** Exact inch–metric factors. */
export const MM_PER_INCH = 25.4;
export const CM_PER_INCH = 2.54;
export const INCHES_PER_FOOT = 12;

export const DEFAULT_PPI = 96;
export const MAX_ABS_VALUE = 1e15;

/** Common workflow PPI examples — not universal physical screen densities. */
export const PPI_PRESETS = [72, 96, 150, 200, 300, 600] as const;

/** Demo default: 192 px at 96 PPI = 2 in. */
export const DEFAULT_PIXELS_TO_INCHES_INPUT: PixelsToInchesInput = {
  source: 'pixels',
  inches: 2,
  pixels: 192,
  ppi: DEFAULT_PPI,
};

/** Reset target: clear measurements, keep default PPI. */
export const EMPTY_PIXELS_TO_INCHES_INPUT: PixelsToInchesInput = {
  source: 'pixels',
  inches: null,
  pixels: null,
  ppi: DEFAULT_PPI,
};
