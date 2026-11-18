/** Which field the user last edited. Other fields are derived. */
export type DegreesSecondsSource =
  | 'degrees'
  | 'arcseconds'
  | 'arcminutes'
  | 'radians'
  | 'gradians'
  | 'revolutions';

export const PRIMARY_UNITS = ['degrees', 'arcseconds'] as const;
export const OTHER_UNITS = ['arcminutes', 'radians', 'gradians', 'revolutions'] as const;
export const ALL_UNITS = [...PRIMARY_UNITS, ...OTHER_UNITS] as const;

export type OtherAngleUnit = (typeof OTHER_UNITS)[number];
export type AngleFieldUnit = (typeof ALL_UNITS)[number];

export interface DegreesToSecondsInput {
  source: DegreesSecondsSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface DegreesToSecondsResult {
  source: DegreesSecondsSource;
  degrees: number;
  arcseconds: number;
  arcminutes: number;
  radians: number;
  gradians: number;
  revolutions: number;
}

export type DegreesToSecondsFieldErrors = Partial<Record<DegreesSecondsSource, string>>;

export const MAX_ABS_VALUE = 1e15;

export const UNIT_TITLE: Record<AngleFieldUnit, string> = {
  degrees: 'Angle in degrees',
  arcseconds: 'Angle in seconds of arc',
  arcminutes: 'Arcminutes',
  radians: 'Radians',
  gradians: 'Gradians',
  revolutions: 'Revolutions',
};

export const UNIT_LABEL: Record<AngleFieldUnit, string> = {
  degrees: '°',
  arcseconds: '″',
  arcminutes: '′',
  radians: 'rad',
  gradians: 'gon',
  revolutions: 'rev',
};
