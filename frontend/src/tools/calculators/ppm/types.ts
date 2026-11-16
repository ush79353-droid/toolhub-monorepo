export const PPM_UNITS = [
  'number',
  'percent',
  'permille',
  'ppm',
  'ppb',
  'ppt',
] as const;

export type PpmUnit = (typeof PPM_UNITS)[number];

export type PpmFieldErrors = Partial<Record<PpmUnit, string>>;

/** Multiply unit value by this factor to obtain the dimensionless base ratio. */
export const PPM_TO_RATIO: Record<PpmUnit, number> = {
  number: 1,
  percent: 1e-2,
  permille: 1e-3,
  ppm: 1e-6,
  ppb: 1e-9,
  ppt: 1e-12,
};

export const PPM_UNIT_SYMBOLS: Record<PpmUnit, string> = {
  number: '',
  percent: '%',
  permille: '‰',
  ppm: 'ppm',
  ppb: 'ppb',
  ppt: 'ppt',
};

export const PPM_FIELD_LABELS: Record<PpmUnit, string> = {
  number: 'Number',
  percent: 'Per cent',
  permille: 'Per mille',
  ppm: 'Parts per million',
  ppb: 'Parts per billion',
  ppt: 'Parts per trillion',
};

export const MAX_ABS_RATIO = 1e24;
