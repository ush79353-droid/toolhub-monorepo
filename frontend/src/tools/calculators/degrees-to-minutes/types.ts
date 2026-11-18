/** Which field the user last edited. The other field is derived. */
export type DegreesMinutesSource = 'degrees' | 'arcminutes';

export interface DegreesToMinutesInput {
  source: DegreesMinutesSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface DegreesToMinutesResult {
  source: DegreesMinutesSource;
  degrees: number;
  arcminutes: number;
}

export type DegreesToMinutesFieldErrors = {
  degrees?: string;
  arcminutes?: string;
};

export const MAX_ABS_VALUE = 1e15;
