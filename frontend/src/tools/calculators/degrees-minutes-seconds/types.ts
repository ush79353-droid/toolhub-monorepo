export type AngleSign = 1 | -1;

export type ActiveInput = 'DMS' | 'DD';

export interface DmsAngleParts {
  sign: AngleSign;
  degrees: number;
  minutes: number;
  seconds: number;
}

export interface DegreesMinutesSecondsInput {
  activeInput: ActiveInput;
  /** Canonical signed decimal degrees. */
  decimalDegrees: number | null;
}

export interface DegreesMinutesSecondsResult {
  decimalDegrees: number;
  dms: DmsAngleParts;
  /** Formatted lines for copy/share. */
  dmsLine: string;
  ddLine: string;
}

export type DegreesMinutesSecondsFieldErrors = Partial<
  Record<'degrees' | 'minutes' | 'seconds' | 'decimalDegrees', string>
>;

export const DEFAULT_DEGREES_MINUTES_SECONDS_INPUT: DegreesMinutesSecondsInput = {
  activeInput: 'DMS',
  decimalDegrees: null,
};

export const EMPTY_DEGREES_MINUTES_SECONDS_INPUT = DEFAULT_DEGREES_MINUTES_SECONDS_INPUT;

/** Clickable examples (canonical values). */
export const EXAMPLE_DMS_TO_DD = {
  label: '47° 23′ 12″',
  sign: 1 as AngleSign,
  degrees: 47,
  minutes: 23,
  seconds: 12,
  decimalDegrees: 47.38666666666667,
} as const;

export const EXAMPLE_DD_TO_DMS = {
  label: '10.5797222222°',
  decimalDegrees: 10.5797222222,
} as const;

export const MAX_ABS_ANGLE = 1e12;
