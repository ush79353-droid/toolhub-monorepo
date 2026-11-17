/** Which field the user last edited. The other field is derived. */
export type DegreesRadiansSource = 'degrees' | 'radians';

export interface DegreesToRadiansInput {
  source: DegreesRadiansSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface DegreesToRadiansResult {
  source: DegreesRadiansSource;
  degrees: number;
  radians: number;
  /** Optional exact π-fraction label when the angle matches a common value. */
  piLabel: string | null;
}

export type DegreesToRadiansFieldErrors = {
  degrees?: string;
  radians?: string;
};

export const MAX_ABS_VALUE = 1e15;
