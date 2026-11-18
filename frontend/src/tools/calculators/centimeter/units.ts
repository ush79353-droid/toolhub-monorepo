/** Exact international length factors → meters. */
export const LENGTH_TO_METERS = {
  nm: 1e-9,
  um: 1e-6,
  mm: 0.001,
  cm: 0.01,
  dm: 0.1,
  m: 1,
  dam: 10,
  hm: 100,
  km: 1000,
  thou: 0.0000254,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  fathom: 1.8288,
  chain: 20.1168,
  furlong: 201.168,
  mi: 1609.344,
  nmi: 1852,
} as const;

export type LengthUnit = keyof typeof LENGTH_TO_METERS;

export const CORE_IMPERIAL = ['in', 'ft', 'yd', 'mi'] as const satisfies readonly LengthUnit[];
export const CORE_METRIC = ['mm', 'm', 'km'] as const satisfies readonly LengthUnit[];

export const OTHER_IMPERIAL = [
  'thou',
  'fathom',
  'chain',
  'furlong',
  'nmi',
] as const satisfies readonly LengthUnit[];

export const OTHER_METRIC = ['um', 'nm', 'dm', 'dam', 'hm'] as const satisfies readonly LengthUnit[];

export type OtherImperialUnit = (typeof OTHER_IMPERIAL)[number];
export type OtherMetricUnit = (typeof OTHER_METRIC)[number];

export const DEFAULT_OTHER_IMPERIAL: OtherImperialUnit = 'thou';
export const DEFAULT_OTHER_METRIC: OtherMetricUnit = 'um';

export const UNIT_LABELS: Record<LengthUnit, string> = {
  nm: 'Nanometers',
  um: 'Micrometers',
  mm: 'Millimeters',
  cm: 'Centimeters',
  dm: 'Decimeters',
  m: 'Meters',
  dam: 'Decameters',
  hm: 'Hectometers',
  km: 'Kilometers',
  thou: 'Thou / mil',
  in: 'Inches',
  ft: 'Feet',
  yd: 'Yards',
  fathom: 'Fathoms',
  chain: 'Chains',
  furlong: 'Furlongs',
  mi: 'Miles',
  nmi: 'Nautical miles',
};

export const UNIT_SYMBOLS: Record<LengthUnit, string> = {
  nm: 'nm',
  um: 'µm',
  mm: 'mm',
  cm: 'cm',
  dm: 'dm',
  m: 'm',
  dam: 'dam',
  hm: 'hm',
  km: 'km',
  thou: 'thou',
  in: 'in',
  ft: 'ft',
  yd: 'yd',
  fathom: 'ftm',
  chain: 'ch',
  furlong: 'fur',
  mi: 'mi',
  nmi: 'nmi',
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
