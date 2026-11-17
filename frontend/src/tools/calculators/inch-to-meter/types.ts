/** Which measurement the user last edited. Other fields are derived. */
export type InchToMeterSource = 'inches' | 'meters' | 'feetInches';

export interface InchToMeterInput {
  source: InchToMeterSource;
  /** null while the active source field is blank or incomplete. */
  inches: number | null;
  meters: number | null;
  feetPart: number | null;
  inchesPart: number | null;
}

export interface InchToMeterResult {
  source: InchToMeterSource;
  inches: number;
  meters: number;
  feetPart: number;
  inchesPart: number;
  mixedLabel: string;
  explanation: string;
}

export type InchToMeterFieldErrors = {
  inches?: string;
  meters?: string;
  feetPart?: string;
  inchesPart?: string;
};

/** Exact international inch. Same as meter-converter METERS_PER_UNIT.in. */
export const METERS_PER_INCH = 0.0254;
export const INCHES_PER_FOOT = 12;
export const MAX_ABS_VALUE = 1e15;
