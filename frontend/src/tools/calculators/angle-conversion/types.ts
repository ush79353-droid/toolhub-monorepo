export const MAIN_ANGLE_UNITS = [
  'degrees',
  'radians',
  'gradians',
  'turns',
  'piRadians',
] as const;

export const EXTRA_ANGLE_UNITS = [
  'arcminutes',
  'arcseconds',
  'microradians',
  'natoMils',
  'sovietMils',
  'swedishMils',
] as const;

export type MainAngleUnit = (typeof MAIN_ANGLE_UNITS)[number];
export type ExtraAngleUnit = (typeof EXTRA_ANGLE_UNITS)[number];
export type AngleUnit = MainAngleUnit | ExtraAngleUnit | 'dms';

export type AngleFieldErrors = Partial<
  Record<AngleUnit | 'dmsDegrees' | 'dmsMinutes' | 'dmsSeconds', string>
>;

export const MAX_ABS_RADIANS = 1e15;
export const DEFAULT_DEGREES = 90;

/** Mils per full turn. */
export const NATO_MILS_PER_TURN = 6400;
export const SOVIET_MILS_PER_TURN = 6000;
export const SWEDISH_MILS_PER_TURN = 6300;

export interface AngleUnitDef {
  id: AngleUnit;
  label: string;
  symbol: string;
}

export const ANGLE_UNIT_DEFS: Record<Exclude<AngleUnit, 'dms'>, AngleUnitDef> = {
  degrees: { id: 'degrees', label: 'Degrees', symbol: 'deg' },
  radians: { id: 'radians', label: 'Radians', symbol: 'rad' },
  gradians: { id: 'gradians', label: 'Gradians', symbol: 'gon' },
  turns: { id: 'turns', label: 'Turns', symbol: 'tr' },
  piRadians: { id: 'piRadians', label: 'π radians', symbol: 'π rad' },
  arcminutes: { id: 'arcminutes', label: 'Arcminutes', symbol: '′' },
  arcseconds: { id: 'arcseconds', label: 'Arcseconds', symbol: '″' },
  microradians: { id: 'microradians', label: 'Microradians', symbol: 'µrad' },
  natoMils: { id: 'natoMils', label: 'Angular mils (NATO)', symbol: 'mil' },
  sovietMils: { id: 'sovietMils', label: 'Angular mils (Soviet)', symbol: 'mil' },
  swedishMils: { id: 'swedishMils', label: 'Angular mils (Swedish)', symbol: 'mil' },
};

export interface DmsParts {
  sign: 1 | -1;
  degrees: number;
  minutes: number;
  seconds: number;
}
