/** Which primary field the user last edited. */
export type RadiansDegreesSource = 'radians' | 'degrees' | ExtraAngleField;

/** Extra units under “Other angle units”. */
export type ExtraAngleField =
  | 'gradians'
  | 'turns'
  | 'arcminutes'
  | 'arcseconds'
  | 'milliradians';

export const EXTRA_ANGLE_FIELDS = [
  'gradians',
  'turns',
  'arcminutes',
  'arcseconds',
  'milliradians',
] as const satisfies readonly ExtraAngleField[];

export const EXTRA_ANGLE_LABELS: Record<ExtraAngleField, string> = {
  gradians: 'Gradians',
  turns: 'Turns',
  arcminutes: 'Arcminutes',
  arcseconds: 'Arcseconds',
  milliradians: 'Milliradians',
};

export const EXTRA_ANGLE_SYMBOLS: Record<ExtraAngleField, string> = {
  gradians: 'gon',
  turns: 'tr',
  arcminutes: '′',
  arcseconds: '″',
  milliradians: 'mrad',
};

export interface RadiansToDegreesInput {
  source: RadiansDegreesSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface RadiansToDegreesResult {
  source: RadiansDegreesSource;
  degrees: number;
  radians: number;
  extras: Record<ExtraAngleField, number>;
  /** Optional exact π-fraction label when the angle matches a common value. */
  piLabel: string | null;
}

export type RadiansToDegreesFieldErrors = Partial<
  Record<'radians' | 'degrees' | ExtraAngleField, string>
>;

export const MAX_ABS_VALUE = 1e15;
