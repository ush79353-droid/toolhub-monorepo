import type { CategoryDefinition, ConversionCategory, UnitDefinition } from './types';

function U(
  id: string,
  label: string,
  symbol: string,
  group: string,
  factorToBase: number,
): UnitDefinition {
  return { id, label, symbol, group, factorToBase };
}

function Temp(id: string, label: string, symbol: string, group: string): UnitDefinition {
  return { id, label, symbol, group };
}

export const LENGTH_TO_METERS = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
  dm: 0.1,
  nmi: 1852,
} as const;

export type LengthUnit = keyof typeof LENGTH_TO_METERS;

export const AREA_TO_SQUARE_METERS = {
  mm2: 0.000001,
  cm2: 0.0001,
  m2: 1,
  km2: 1_000_000,
  ha: 10_000,
  in2: 0.00064516,
  ft2: 0.09290304,
  yd2: 0.83612736,
  acre: 4046.8564224,
  mi2: 2_589_988.110336,
} as const;

export type AreaUnit = keyof typeof AREA_TO_SQUARE_METERS;

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

export type MassUnit = keyof typeof MASS_TO_KILOGRAMS;

export const VOLUME_TO_LITERS = {
  mL: 0.001,
  L: 1,
  cm3: 0.001,
  m3: 1000,
  usTsp: 0.00492892159375,
  usTbsp: 0.01478676478125,
  usFlOz: 0.0295735295625,
  usCup: 0.2365882365,
  usPint: 0.473176473,
  usQuart: 0.946352946,
  usGallon: 3.785411784,
  impFlOz: 0.0284130625,
  impPint: 0.56826125,
  impQuart: 1.1365225,
  impGallon: 4.54609,
} as const;

export type VolumeUnit = keyof typeof VOLUME_TO_LITERS;

export const CATEGORIES: Record<ConversionCategory, CategoryDefinition> = {
  length: {
    id: 'length',
    label: 'Length',
    kind: 'linear',
    baseLabel: 'meter',
    allowNegative: false,
    summaryUnitIds: ['m', 'ft', 'in', 'yd', 'km', 'mi'],
    groups: [
      {
        id: 'metric',
        title: 'Metric Length',
        units: [
          U('mm', 'Length in millimeters', 'mm', 'metric', LENGTH_TO_METERS.mm),
          U('cm', 'Length in centimeters', 'cm', 'metric', LENGTH_TO_METERS.cm),
          U('m', 'Length in meters', 'm', 'metric', LENGTH_TO_METERS.m),
          U('km', 'Length in kilometers', 'km', 'metric', LENGTH_TO_METERS.km),
        ],
      },
      {
        id: 'standard',
        title: 'Imperial / US Length',
        units: [
          U('in', 'Length in inches', 'in', 'standard', LENGTH_TO_METERS.in),
          U('ft', 'Length in feet', 'ft', 'standard', LENGTH_TO_METERS.ft),
          U('yd', 'Length in yards', 'yd', 'standard', LENGTH_TO_METERS.yd),
          U('mi', 'Length in miles', 'mi', 'standard', LENGTH_TO_METERS.mi),
        ],
      },
      {
        id: 'other',
        title: 'Other units',
        units: [
          U('dm', 'Length in decimeters', 'dm', 'other', LENGTH_TO_METERS.dm),
          U('nmi', 'Length in nautical miles', 'nmi', 'other', LENGTH_TO_METERS.nmi),
        ],
      },
    ],
  },
  area: {
    id: 'area',
    label: 'Area',
    kind: 'linear',
    baseLabel: 'square meter',
    allowNegative: false,
    summaryUnitIds: ['m2', 'ft2', 'ha', 'acre'],
    groups: [
      {
        id: 'metric',
        title: 'Metric Area',
        units: [
          U('mm2', 'Area in square millimeters', 'mm²', 'metric', AREA_TO_SQUARE_METERS.mm2),
          U('cm2', 'Area in square centimeters', 'cm²', 'metric', AREA_TO_SQUARE_METERS.cm2),
          U('m2', 'Area in square meters', 'm²', 'metric', AREA_TO_SQUARE_METERS.m2),
          U('km2', 'Area in square kilometers', 'km²', 'metric', AREA_TO_SQUARE_METERS.km2),
          U('ha', 'Area in hectares', 'ha', 'metric', AREA_TO_SQUARE_METERS.ha),
        ],
      },
      {
        id: 'standard',
        title: 'Imperial / US Area',
        units: [
          U('in2', 'Area in square inches', 'in²', 'standard', AREA_TO_SQUARE_METERS.in2),
          U('ft2', 'Area in square feet', 'ft²', 'standard', AREA_TO_SQUARE_METERS.ft2),
          U('yd2', 'Area in square yards', 'yd²', 'standard', AREA_TO_SQUARE_METERS.yd2),
          U('acre', 'Area in acres', 'ac', 'standard', AREA_TO_SQUARE_METERS.acre),
          U('mi2', 'Area in square miles', 'mi²', 'standard', AREA_TO_SQUARE_METERS.mi2),
        ],
      },
    ],
  },
  mass: {
    id: 'mass',
    label: 'Mass / Weight',
    kind: 'linear',
    baseLabel: 'kilogram',
    allowNegative: false,
    summaryUnitIds: ['kg', 'lb', 'g', 'oz'],
    groups: [
      {
        id: 'metric',
        title: 'Metric Mass',
        units: [
          U('mg', 'Mass in milligrams', 'mg', 'metric', MASS_TO_KILOGRAMS.mg),
          U('g', 'Mass in grams', 'g', 'metric', MASS_TO_KILOGRAMS.g),
          U('kg', 'Mass in kilograms', 'kg', 'metric', MASS_TO_KILOGRAMS.kg),
          U('tonne', 'Mass in metric tonnes', 't', 'metric', MASS_TO_KILOGRAMS.tonne),
        ],
      },
      {
        id: 'standard',
        title: 'Imperial / US Mass',
        units: [
          U('oz', 'Mass in ounces', 'oz', 'standard', MASS_TO_KILOGRAMS.oz),
          U('lb', 'Mass in pounds', 'lb', 'standard', MASS_TO_KILOGRAMS.lb),
          U('st', 'Mass in stones', 'st', 'standard', MASS_TO_KILOGRAMS.st),
          U('shortTon', 'Mass in US short tons', 'ton (US)', 'standard', MASS_TO_KILOGRAMS.shortTon),
          U('longTon', 'Mass in imperial long tons', 'ton (UK)', 'standard', MASS_TO_KILOGRAMS.longTon),
        ],
      },
    ],
  },
  volume: {
    id: 'volume',
    label: 'Volume',
    kind: 'linear',
    baseLabel: 'liter',
    allowNegative: false,
    summaryUnitIds: ['L', 'usGallon', 'impGallon', 'mL'],
    groups: [
      {
        id: 'metric',
        title: 'Metric Volume',
        units: [
          U('mL', 'Volume in milliliters', 'mL', 'metric', VOLUME_TO_LITERS.mL),
          U('L', 'Volume in liters', 'L', 'metric', VOLUME_TO_LITERS.L),
          U('cm3', 'Volume in cubic centimeters', 'cm³', 'metric', VOLUME_TO_LITERS.cm3),
          U('m3', 'Volume in cubic meters', 'm³', 'metric', VOLUME_TO_LITERS.m3),
        ],
      },
      {
        id: 'us',
        title: 'US Customary Volume',
        units: [
          U('usTsp', 'Volume in US teaspoons', 'US tsp', 'us', VOLUME_TO_LITERS.usTsp),
          U('usTbsp', 'Volume in US tablespoons', 'US tbsp', 'us', VOLUME_TO_LITERS.usTbsp),
          U('usFlOz', 'Volume in US fluid ounces', 'US fl oz', 'us', VOLUME_TO_LITERS.usFlOz),
          U('usCup', 'Volume in US cups', 'US cup', 'us', VOLUME_TO_LITERS.usCup),
          U('usPint', 'Volume in US pints', 'US pt', 'us', VOLUME_TO_LITERS.usPint),
          U('usQuart', 'Volume in US quarts', 'US qt', 'us', VOLUME_TO_LITERS.usQuart),
          U('usGallon', 'Volume in US gallons', 'US gal', 'us', VOLUME_TO_LITERS.usGallon),
        ],
      },
      {
        id: 'imperial',
        title: 'British Imperial Volume',
        units: [
          U('impFlOz', 'Volume in imperial fluid ounces', 'UK fl oz', 'imperial', VOLUME_TO_LITERS.impFlOz),
          U('impPint', 'Volume in imperial pints', 'UK pt', 'imperial', VOLUME_TO_LITERS.impPint),
          U('impQuart', 'Volume in imperial quarts', 'UK qt', 'imperial', VOLUME_TO_LITERS.impQuart),
          U('impGallon', 'Volume in imperial gallons', 'UK gal', 'imperial', VOLUME_TO_LITERS.impGallon),
        ],
      },
    ],
  },
  temperature: {
    id: 'temperature',
    label: 'Temperature',
    kind: 'temperature',
    baseLabel: 'kelvin',
    allowNegative: true,
    summaryUnitIds: ['C', 'F', 'K'],
    groups: [
      {
        id: 'metric',
        title: 'Metric Temperature',
        units: [
          Temp('C', 'Temperature in Celsius', '°C', 'metric'),
          Temp('K', 'Temperature in kelvin', 'K', 'metric'),
        ],
      },
      {
        id: 'other',
        title: 'Other Temperature Units',
        units: [Temp('F', 'Temperature in Fahrenheit', '°F', 'other')],
      },
    ],
  },
};

export function getCategory(id: ConversionCategory): CategoryDefinition {
  return CATEGORIES[id];
}

export function allUnits(category: ConversionCategory): readonly UnitDefinition[] {
  return CATEGORIES[category].groups.flatMap((g) => g.units);
}

export function getUnit(category: ConversionCategory, unitId: string): UnitDefinition | undefined {
  return allUnits(category).find((u) => u.id === unitId);
}

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  return (value * LENGTH_TO_METERS[from]) / LENGTH_TO_METERS[to];
}

export function convertArea(value: number, from: AreaUnit, to: AreaUnit): number {
  return (value * AREA_TO_SQUARE_METERS[from]) / AREA_TO_SQUARE_METERS[to];
}

export function convertMass(value: number, from: MassUnit, to: MassUnit): number {
  return (value * MASS_TO_KILOGRAMS[from]) / MASS_TO_KILOGRAMS[to];
}

export function convertVolume(value: number, from: VolumeUnit, to: VolumeUnit): number {
  return (value * VOLUME_TO_LITERS[from]) / VOLUME_TO_LITERS[to];
}
