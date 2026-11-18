/** Exact international length factors → meters. */
export const LENGTH_TO_METERS = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
} as const;

export type LengthUnit = keyof typeof LENGTH_TO_METERS;

export const METRIC_UNITS = ['mm', 'cm', 'm', 'km'] as const satisfies readonly LengthUnit[];
export const SAE_UNITS = ['in', 'ft', 'yd', 'mi'] as const satisfies readonly LengthUnit[];
export const ALL_UNITS = [...METRIC_UNITS, ...SAE_UNITS] as const;

export const UNIT_LABELS: Record<LengthUnit, string> = {
  mm: 'Length in millimeters',
  cm: 'Length in centimeters',
  m: 'Length in meters',
  km: 'Length in kilometers',
  in: 'Length in inches',
  ft: 'Length in feet',
  yd: 'Length in yards',
  mi: 'Length in miles',
};

export const UNIT_SYMBOLS: Record<LengthUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  m: 'm',
  km: 'km',
  in: 'in',
  ft: 'ft',
  yd: 'yd',
  mi: 'mi',
};

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  const meters = value * LENGTH_TO_METERS[from];
  return meters / LENGTH_TO_METERS[to];
}

export function toMeters(value: number, unit: LengthUnit): number {
  return value * LENGTH_TO_METERS[unit];
}

export function fromMeters(meters: number, unit: LengthUnit): number {
  return meters / LENGTH_TO_METERS[unit];
}
