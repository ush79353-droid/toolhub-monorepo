const POUND_KG = 0.45359237;
const FOOT_M = 0.3048;
const YARD_M = 0.9144;
const US_GALLON_M3 = 0.003785411784;

export const DENSITY_UNITS = [
  'kilogramPerCubicDecimeter',
  'kilogramPerCubicMeter',
  'poundPerCubicFoot',
  'poundPerCubicYard',
  'poundPerUSGallon',
] as const;

export type DensityUnit = (typeof DENSITY_UNITS)[number];

export type DensityFieldErrors = Partial<Record<DensityUnit, string>>;

/** Multiply unit value by this factor to obtain kg/m³. */
export const DENSITY_TO_BASE: Record<DensityUnit, number> = {
  kilogramPerCubicDecimeter: 1000,
  kilogramPerCubicMeter: 1,
  poundPerCubicFoot: POUND_KG / FOOT_M ** 3,
  poundPerCubicYard: POUND_KG / YARD_M ** 3,
  poundPerUSGallon: POUND_KG / US_GALLON_M3,
};

export const DENSITY_UNIT_SYMBOLS: Record<DensityUnit, string> = {
  kilogramPerCubicDecimeter: 'kg/dm³',
  kilogramPerCubicMeter: 'kg/m³',
  poundPerCubicFoot: 'lb/cu ft',
  poundPerCubicYard: 'lb/cu yd',
  poundPerUSGallon: 'lb/US gal',
};

export const DENSITY_FIELD_LABELS: Record<DensityUnit, string> = {
  kilogramPerCubicDecimeter: 'Density in kilograms per cubic decimeter',
  kilogramPerCubicMeter: 'Density in kilograms per cubic meter',
  poundPerCubicFoot: 'Density in pounds per cubic foot',
  poundPerCubicYard: 'Density in pounds per cubic yard',
  poundPerUSGallon: 'Density in pounds per US gallon',
};

export const METRIC_UNITS: readonly DensityUnit[] = [
  'kilogramPerCubicDecimeter',
  'kilogramPerCubicMeter',
];

export const IMPERIAL_UNITS: readonly DensityUnit[] = [
  'poundPerCubicFoot',
  'poundPerCubicYard',
  'poundPerUSGallon',
];

export const MAX_ABS_DENSITY = 1e30;
