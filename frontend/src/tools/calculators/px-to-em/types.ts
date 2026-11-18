export const SIZE_UNITS = ['px', 'em', 'pt', 'percent'] as const;

export type SizeUnit = (typeof SIZE_UNITS)[number];

export type ActiveField = SizeUnit | 'base';

export type PxToEmFieldErrors = Partial<Record<ActiveField, string>>;

export const DEFAULT_BASE_PX = 16;

/** CSS reference: 1px = 0.75pt = 3/4 pt. */
export const PT_PER_PX = 0.75;

export const MAX_ABS_VALUE = 1e15;

export const SIZE_UNIT_SYMBOLS: Record<SizeUnit, string> = {
  px: 'px',
  em: 'em',
  pt: 'pt',
  percent: '%',
};

export const SIZE_FIELD_LABELS: Record<SizeUnit, string> = {
  px: "Object's size",
  em: 'Size in em',
  pt: 'Size in points',
  percent: 'Size in percentage',
};
