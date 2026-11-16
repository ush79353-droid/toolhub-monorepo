export const POWER_UNITS = [
  'milliwatt',
  'watt',
  'kilowatt',
  'mechanicalHorsepower',
  'metricHorsepower',
  'footPoundPerHour',
  'footPoundPerMinute',
  'footPoundPerSecond',
  'btuPerHour',
] as const;

export type PowerUnit = (typeof POWER_UNITS)[number];

export type PowerFieldErrors = Partial<Record<PowerUnit, string>>;

/** Multiply unit value by this factor to obtain watts. */
export const POWER_TO_WATTS: Record<PowerUnit, number> = {
  milliwatt: 0.001,
  watt: 1,
  kilowatt: 1000,
  mechanicalHorsepower: 745.6998715822702,
  metricHorsepower: 735.49875,
  footPoundPerHour: 1.3558179483314004 / 3600,
  footPoundPerMinute: 1.3558179483314004 / 60,
  footPoundPerSecond: 1.3558179483314004,
  btuPerHour: 1055.05585262 / 3600,
};

export const POWER_UNIT_SYMBOLS: Record<PowerUnit, string> = {
  milliwatt: 'mW',
  watt: 'W',
  kilowatt: 'kW',
  mechanicalHorsepower: 'hp(I)',
  metricHorsepower: 'PS',
  footPoundPerHour: 'ft·lbf/h',
  footPoundPerMinute: 'ft·lbf/min',
  footPoundPerSecond: 'ft·lbf/s',
  btuPerHour: 'BTU/h',
};

export const POWER_FIELD_LABELS: Record<PowerUnit, string> = {
  milliwatt: 'Power in milliwatts',
  watt: 'Power in watts',
  kilowatt: 'Power in kilowatts',
  mechanicalHorsepower: 'Power in mechanical horsepower',
  metricHorsepower: 'Power in metric horsepower',
  footPoundPerHour: 'Power in foot-pound force per hour',
  footPoundPerMinute: 'Power in foot-pound force per minute',
  footPoundPerSecond: 'Power in foot-pound force per second',
  btuPerHour: 'Power in BTU (IT) per hour',
};

export const SI_UNITS: readonly PowerUnit[] = ['milliwatt', 'watt', 'kilowatt'];
export const HORSEPOWER_UNITS: readonly PowerUnit[] = [
  'mechanicalHorsepower',
  'metricHorsepower',
];
export const OTHER_UNITS: readonly PowerUnit[] = [
  'footPoundPerHour',
  'footPoundPerMinute',
  'footPoundPerSecond',
  'btuPerHour',
];

export const MAX_ABS_WATTS = 1e30;
