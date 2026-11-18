import type {
  ConversionCategory,
  ConversionCategoryConfig,
  ConversionUnit,
} from './types';

function M(
  id: string,
  label: string,
  symbol: string,
  factorToBase: number,
): ConversionUnit {
  return { id, label, symbol, system: 'metric', factorToBase };
}

function I(
  id: string,
  label: string,
  symbol: string,
  factorToBase: number,
): ConversionUnit {
  return { id, label, symbol, system: 'imperial', factorToBase };
}

function T(
  id: string,
  label: string,
  symbol: string,
  system: 'metric' | 'imperial',
): ConversionUnit {
  return { id, label, symbol, system };
}

export const LENGTH_TO_METERS = {
  mm: 0.001,
  cm: 0.01,
  dm: 0.1,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
} as const;

export const AREA_TO_SQUARE_METERS = {
  mm2: 0.000001,
  cm2: 0.0001,
  m2: 1,
  ha: 10000,
  km2: 1_000_000,
  in2: 0.00064516,
  ft2: 0.09290304,
  yd2: 0.83612736,
  acre: 4046.8564224,
  mi2: 2_589_988.110336,
} as const;

export const MASS_TO_KILOGRAMS = {
  mg: 0.000001,
  g: 0.001,
  kg: 1,
  tonne: 1000,
  oz: 0.028349523125,
  lb: 0.45359237,
  st: 6.35029318,
  shortTon: 907.18474,
  longTon: 1016.0469088,
} as const;

export const SPEED_TO_METERS_PER_SECOND = {
  mps: 1,
  kmh: 1 / 3.6,
  cmps: 0.01,
  fps: 0.3048,
  mph: 0.44704,
  ftmin: 0.00508,
} as const;

/** Volume factors in liters. */
const US_GAL_L = 3.785411784;
const IMP_GAL_L = 4.54609;
const US_FL_OZ_L = 0.0295735295625;
const IMP_FL_OZ_L = 0.0284130625;
const US_PT_L = 0.473176473;
const IMP_PT_L = 0.56826125;
const US_CUP_L = 0.2365882365;
const US_QT_L = US_GAL_L / 4;

export const CATEGORIES: Record<ConversionCategory, ConversionCategoryConfig> = {
  length: {
    id: 'length',
    label: 'Length',
    kind: 'linear',
    baseLabel: 'meter',
    allowNegative: false,
    defaultMetricUnit: 'm',
    defaultImperialUnit: 'ft',
    metricFieldLabel: 'Length in metric units',
    imperialFieldLabel: 'Length in imperial units',
    metricUnits: [
      M('mm', 'Millimeter', 'mm', LENGTH_TO_METERS.mm),
      M('cm', 'Centimeter', 'cm', LENGTH_TO_METERS.cm),
      M('dm', 'Decimeter', 'dm', LENGTH_TO_METERS.dm),
      M('m', 'Meter', 'm', LENGTH_TO_METERS.m),
      M('km', 'Kilometer', 'km', LENGTH_TO_METERS.km),
    ],
    imperialUnits: [
      I('in', 'Inch', 'in', LENGTH_TO_METERS.in),
      I('ft', 'Foot', 'ft', LENGTH_TO_METERS.ft),
      I('yd', 'Yard', 'yd', LENGTH_TO_METERS.yd),
      I('mi', 'Mile', 'mi', LENGTH_TO_METERS.mi),
    ],
  },
  area: {
    id: 'area',
    label: 'Area',
    kind: 'linear',
    baseLabel: 'square meter',
    allowNegative: false,
    defaultMetricUnit: 'm2',
    defaultImperialUnit: 'ft2',
    metricFieldLabel: 'Area in metric units',
    imperialFieldLabel: 'Area in imperial units',
    metricUnits: [
      M('mm2', 'Square millimeter', 'mm²', AREA_TO_SQUARE_METERS.mm2),
      M('cm2', 'Square centimeter', 'cm²', AREA_TO_SQUARE_METERS.cm2),
      M('m2', 'Square meter', 'm²', AREA_TO_SQUARE_METERS.m2),
      M('ha', 'Hectare', 'ha', AREA_TO_SQUARE_METERS.ha),
      M('km2', 'Square kilometer', 'km²', AREA_TO_SQUARE_METERS.km2),
    ],
    imperialUnits: [
      I('in2', 'Square inch', 'in²', AREA_TO_SQUARE_METERS.in2),
      I('ft2', 'Square foot', 'ft²', AREA_TO_SQUARE_METERS.ft2),
      I('yd2', 'Square yard', 'yd²', AREA_TO_SQUARE_METERS.yd2),
      I('acre', 'Acre', 'ac', AREA_TO_SQUARE_METERS.acre),
      I('mi2', 'Square mile', 'mi²', AREA_TO_SQUARE_METERS.mi2),
    ],
  },
  volume: {
    id: 'volume',
    label: 'Volume',
    kind: 'linear',
    baseLabel: 'liter',
    allowNegative: false,
    defaultMetricUnit: 'L',
    defaultImperialUnit: 'usGal',
    metricFieldLabel: 'Volume in metric units',
    imperialFieldLabel: 'Volume in imperial / US units',
    metricUnits: [
      M('mL', 'Milliliter', 'mL', 0.001),
      M('cm3', 'Cubic centimeter', 'cm³', 0.001),
      M('L', 'Liter', 'L', 1),
      M('m3', 'Cubic meter', 'm³', 1000),
    ],
    imperialUnits: [
      I('usFlOz', 'US fluid ounce', 'US fl oz', US_FL_OZ_L),
      I('usCup', 'US cup', 'US cup', US_CUP_L),
      I('usPt', 'US pint', 'US pt', US_PT_L),
      I('usQt', 'US quart', 'US qt', US_QT_L),
      I('usGal', 'US gallon', 'US gal', US_GAL_L),
      I('impFlOz', 'Imperial fluid ounce', 'UK fl oz', IMP_FL_OZ_L),
      I('impPt', 'Imperial pint', 'UK pt', IMP_PT_L),
      I('impGal', 'Imperial gallon', 'UK gal', IMP_GAL_L),
    ],
  },
  mass: {
    id: 'mass',
    label: 'Mass / Weight',
    kind: 'linear',
    baseLabel: 'kilogram',
    allowNegative: false,
    defaultMetricUnit: 'kg',
    defaultImperialUnit: 'lb',
    metricFieldLabel: 'Mass in metric units',
    imperialFieldLabel: 'Mass in imperial / US units',
    metricUnits: [
      M('mg', 'Milligram', 'mg', MASS_TO_KILOGRAMS.mg),
      M('g', 'Gram', 'g', MASS_TO_KILOGRAMS.g),
      M('kg', 'Kilogram', 'kg', MASS_TO_KILOGRAMS.kg),
      M('tonne', 'Metric tonne', 't', MASS_TO_KILOGRAMS.tonne),
    ],
    imperialUnits: [
      I('oz', 'Ounce', 'oz', MASS_TO_KILOGRAMS.oz),
      I('lb', 'Pound', 'lb', MASS_TO_KILOGRAMS.lb),
      I('st', 'Stone', 'st', MASS_TO_KILOGRAMS.st),
      I('shortTon', 'US short ton', 'ton (US)', MASS_TO_KILOGRAMS.shortTon),
      I('longTon', 'Imperial long ton', 'ton (UK)', MASS_TO_KILOGRAMS.longTon),
    ],
  },
  temperature: {
    id: 'temperature',
    label: 'Temperature',
    kind: 'temperature',
    baseLabel: 'kelvin',
    allowNegative: true,
    defaultMetricUnit: 'C',
    defaultImperialUnit: 'F',
    metricFieldLabel: 'Temperature in metric units',
    imperialFieldLabel: 'Temperature in imperial units',
    metricUnits: [
      T('C', 'Celsius', '°C', 'metric'),
      T('K', 'Kelvin', 'K', 'metric'),
    ],
    imperialUnits: [
      T('F', 'Fahrenheit', '°F', 'imperial'),
      T('R', 'Rankine', '°R', 'imperial'),
    ],
  },
  speed: {
    id: 'speed',
    label: 'Speed',
    kind: 'linear',
    baseLabel: 'meter per second',
    allowNegative: false,
    defaultMetricUnit: 'kmh',
    defaultImperialUnit: 'mph',
    metricFieldLabel: 'Speed in metric units',
    imperialFieldLabel: 'Speed in imperial units',
    metricUnits: [
      M('mps', 'Meters per second', 'm/s', SPEED_TO_METERS_PER_SECOND.mps),
      M('kmh', 'Kilometers per hour', 'km/h', SPEED_TO_METERS_PER_SECOND.kmh),
      M('cmps', 'Centimeters per second', 'cm/s', SPEED_TO_METERS_PER_SECOND.cmps),
    ],
    imperialUnits: [
      I('fps', 'Feet per second', 'ft/s', SPEED_TO_METERS_PER_SECOND.fps),
      I('mph', 'Miles per hour', 'mph', SPEED_TO_METERS_PER_SECOND.mph),
      I('ftmin', 'Feet per minute', 'ft/min', SPEED_TO_METERS_PER_SECOND.ftmin),
    ],
  },
};

export function getCategory(id: ConversionCategory): ConversionCategoryConfig {
  return CATEGORIES[id];
}

export function getUnit(
  category: ConversionCategory,
  unitId: string,
): ConversionUnit | undefined {
  const cat = CATEGORIES[category];
  return (
    cat.metricUnits.find((u) => u.id === unitId) ??
    cat.imperialUnits.find((u) => u.id === unitId)
  );
}
