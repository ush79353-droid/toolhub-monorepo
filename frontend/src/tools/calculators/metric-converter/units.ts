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

const LB_KG = 0.45359237;
const OZ_KG = LB_KG / 16;
const ST_KG = LB_KG * 14;
const SHORT_TON_KG = LB_KG * 2000;
const LONG_TON_KG = LB_KG * 2240;

const INCH = 0.0254;
const FOOT = 0.3048;
const YARD = 0.9144;
const MILE = 1609.344;

/** Exact IAU AU (m). */
export const METERS_PER_AU = 149_597_870_700;
/** IAU light-year = c × Julian year (m). */
export const METERS_PER_LY = 9_460_730_472_580_800;
/** Brief conventional geometric parsec (m). */
export const METERS_PER_PC = 3.085677581491367e16;

/** Volume factors in liters. */
const US_FL_OZ_L = 0.0295735295625;
const UK_FL_OZ_L = 0.0284130625;
const US_GAL_L = 3.785411784;
const US_QT_L = US_GAL_L / 4;
const US_PT_L = US_GAL_L / 8;
const US_CUP_L = US_GAL_L / 16;
const IMP_GAL_L = 4.54609;

const ATM_PA = 101_325;
const TORR_PA = ATM_PA / 760;
const PSI_PA = 6894.757293168361;
const CAL_J = 4.184;
/** International Table BTU. */
export const BTU_IT_J = 1055.05585262;
const EV_J = 1.602176634e-19;
const HP_METRIC_W = 735.49875;
const HP_MECH_W = 745.69987158227022;
const C_MPS = 299_792_458;
const JULIAN_YEAR_S = 31_557_600;

export const LENGTH_TO_METERS = {
  angstrom: 1e-10,
  picometer: 1e-12,
  nanometer: 1e-9,
  micrometer: 1e-6,
  millimeter: 0.001,
  centimeter: 0.01,
  decimeter: 0.1,
  meter: 1,
  kilometer: 1000,
  inch: INCH,
  foot: FOOT,
  yard: YARD,
  mile: MILE,
  nauticalMile: 1852,
  astronomicalUnit: METERS_PER_AU,
  lightYear: METERS_PER_LY,
  parsec: METERS_PER_PC,
} as const;

export type LengthUnit = keyof typeof LENGTH_TO_METERS;

export const CATEGORIES: Record<ConversionCategory, CategoryDefinition> = {
  length: {
    id: 'length',
    label: 'Length',
    kind: 'linear',
    baseLabel: 'meter',
    allowNegative: false,
    summaryUnitIds: ['meter', 'kilometer', 'centimeter', 'inch', 'foot', 'mile'],
    groups: [
      {
        id: 'metric',
        title: 'Metric length',
        units: [
          U('angstrom', 'Length in ångströms', 'Å', 'metric', LENGTH_TO_METERS.angstrom),
          U('picometer', 'Length in picometers', 'pm', 'metric', LENGTH_TO_METERS.picometer),
          U('nanometer', 'Length in nanometers', 'nm', 'metric', LENGTH_TO_METERS.nanometer),
          U('micrometer', 'Length in micrometers', 'µm', 'metric', LENGTH_TO_METERS.micrometer),
          U('millimeter', 'Length in millimeters', 'mm', 'metric', LENGTH_TO_METERS.millimeter),
          U('centimeter', 'Length in centimeters', 'cm', 'metric', LENGTH_TO_METERS.centimeter),
          U('decimeter', 'Length in decimeters', 'dm', 'metric', LENGTH_TO_METERS.decimeter),
          U('meter', 'Length in meters', 'm', 'metric', LENGTH_TO_METERS.meter),
          U('kilometer', 'Length in kilometers', 'km', 'metric', LENGTH_TO_METERS.kilometer),
        ],
      },
      {
        id: 'imperial',
        title: 'Imperial/US length',
        units: [
          U('inch', 'Length in inches', 'in', 'imperial', LENGTH_TO_METERS.inch),
          U('foot', 'Length in feet', 'ft', 'imperial', LENGTH_TO_METERS.foot),
          U('yard', 'Length in yards', 'yd', 'imperial', LENGTH_TO_METERS.yard),
          U('mile', 'Length in miles', 'mi', 'imperial', LENGTH_TO_METERS.mile),
          U('nauticalMile', 'Length in nautical miles', 'nmi', 'imperial', LENGTH_TO_METERS.nauticalMile),
        ],
      },
      {
        id: 'other',
        title: 'Other length units',
        units: [
          U('astronomicalUnit', 'Length in astronomical units', 'au', 'other', LENGTH_TO_METERS.astronomicalUnit),
          U('lightYear', 'Length in light-years', 'ly', 'other', LENGTH_TO_METERS.lightYear),
          U('parsec', 'Length in parsecs', 'pc', 'other', LENGTH_TO_METERS.parsec),
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
    summaryUnitIds: ['kilogram', 'gram', 'pound', 'ounce'],
    groups: [
      {
        id: 'metric',
        title: 'Metric mass',
        units: [
          U('microgram', 'Mass in micrograms', 'µg', 'metric', 1e-9),
          U('milligram', 'Mass in milligrams', 'mg', 'metric', 1e-6),
          U('gram', 'Mass in grams', 'g', 'metric', 0.001),
          U('kilogram', 'Mass in kilograms', 'kg', 'metric', 1),
          U('tonne', 'Mass in metric tonnes', 't', 'metric', 1000),
        ],
      },
      {
        id: 'imperial',
        title: 'Imperial/US mass',
        units: [
          U('ounce', 'Mass in ounces', 'oz', 'imperial', OZ_KG),
          U('pound', 'Mass in pounds', 'lb', 'imperial', LB_KG),
          U('stone', 'Mass in stones', 'st', 'imperial', ST_KG),
          U('shortTon', 'Mass in US short tons', 'ton (US)', 'imperial', SHORT_TON_KG),
          U('longTon', 'Mass in imperial long tons', 'ton (UK)', 'imperial', LONG_TON_KG),
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
    summaryUnitIds: ['squareMeter', 'hectare', 'acre', 'squareFoot'],
    groups: [
      {
        id: 'metric',
        title: 'Metric area',
        units: [
          U('squareMillimeter', 'Area in square millimeters', 'mm²', 'metric', 1e-6),
          U('squareCentimeter', 'Area in square centimeters', 'cm²', 'metric', 1e-4),
          U('squareMeter', 'Area in square meters', 'm²', 'metric', 1),
          U('squareKilometer', 'Area in square kilometers', 'km²', 'metric', 1e6),
          U('hectare', 'Area in hectares', 'ha', 'metric', 10_000),
        ],
      },
      {
        id: 'imperial',
        title: 'Imperial/US area',
        units: [
          U('squareInch', 'Area in square inches', 'in²', 'imperial', INCH * INCH),
          U('squareFoot', 'Area in square feet', 'ft²', 'imperial', FOOT * FOOT),
          U('squareYard', 'Area in square yards', 'yd²', 'imperial', YARD * YARD),
          U('acre', 'Area in acres', 'ac', 'imperial', 4046.8564224),
          U('squareMile', 'Area in square miles', 'mi²', 'imperial', MILE * MILE),
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
    summaryUnitIds: ['liter', 'milliliter', 'cubicMeter', 'usGallon'],
    groups: [
      {
        id: 'metric',
        title: 'Metric volume',
        units: [
          U('milliliter', 'Volume in milliliters', 'mL', 'metric', 0.001),
          U('cubicCentimeter', 'Volume in cubic centimeters', 'cm³', 'metric', 0.001),
          U('liter', 'Volume in liters', 'L', 'metric', 1),
          U('cubicMeter', 'Volume in cubic meters', 'm³', 'metric', 1000),
        ],
      },
      {
        id: 'us',
        title: 'US customary volume',
        units: [
          U('usFluidOunce', 'Volume in US fluid ounces', 'US fl oz', 'us', US_FL_OZ_L),
          U('usCup', 'Volume in US cups', 'US cup', 'us', US_CUP_L),
          U('usPint', 'Volume in US pints', 'US pt', 'us', US_PT_L),
          U('usQuart', 'Volume in US quarts', 'US qt', 'us', US_QT_L),
          U('usGallon', 'Volume in US gallons', 'US gal', 'us', US_GAL_L),
        ],
      },
      {
        id: 'imperial',
        title: 'Imperial volume',
        units: [
          U('ukFluidOunce', 'Volume in UK fluid ounces', 'UK fl oz', 'imperial', UK_FL_OZ_L),
          U('imperialGallon', 'Volume in imperial gallons', 'UK gal', 'imperial', IMP_GAL_L),
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
    summaryUnitIds: ['celsius', 'fahrenheit', 'kelvin', 'rankine'],
    groups: [
      {
        id: 'scales',
        title: 'Temperature scales',
        units: [
          Temp('celsius', 'Temperature in Celsius', '°C', 'scales'),
          Temp('fahrenheit', 'Temperature in Fahrenheit', '°F', 'scales'),
          Temp('kelvin', 'Temperature in kelvin', 'K', 'scales'),
          Temp('rankine', 'Temperature in Rankine', '°R', 'scales'),
        ],
      },
    ],
  },
  speed: {
    id: 'speed',
    label: 'Speed',
    kind: 'linear',
    baseLabel: 'meter per second',
    allowNegative: false,
    summaryUnitIds: ['meterPerSecond', 'kilometerPerHour', 'milePerHour', 'knot'],
    groups: [
      {
        id: 'common',
        title: 'Speed units',
        units: [
          U('meterPerSecond', 'Speed in meters per second', 'm/s', 'common', 1),
          U('kilometerPerHour', 'Speed in kilometers per hour', 'km/h', 'common', 1000 / 3600),
          U('milePerHour', 'Speed in miles per hour', 'mph', 'common', MILE / 3600),
          U('knot', 'Speed in knots', 'kn', 'common', 1852 / 3600),
          U('footPerSecond', 'Speed in feet per second', 'ft/s', 'common', FOOT),
          U('speedOfLight', 'Speed as a fraction of c', 'c', 'common', C_MPS),
        ],
      },
    ],
  },
  time: {
    id: 'time',
    label: 'Time',
    kind: 'linear',
    baseLabel: 'second',
    allowNegative: false,
    summaryUnitIds: ['second', 'minute', 'hour', 'day'],
    groups: [
      {
        id: 'common',
        title: 'Time units',
        units: [
          U('nanosecond', 'Time in nanoseconds', 'ns', 'common', 1e-9),
          U('microsecond', 'Time in microseconds', 'µs', 'common', 1e-6),
          U('millisecond', 'Time in milliseconds', 'ms', 'common', 0.001),
          U('second', 'Time in seconds', 's', 'common', 1),
          U('minute', 'Time in minutes', 'min', 'common', 60),
          U('hour', 'Time in hours', 'h', 'common', 3600),
          U('day', 'Time in days', 'd', 'common', 86_400),
          U('week', 'Time in weeks', 'wk', 'common', 604_800),
          U('julianYear', 'Time in Julian years', 'yr', 'common', JULIAN_YEAR_S),
        ],
      },
    ],
  },
  energy: {
    id: 'energy',
    label: 'Energy',
    kind: 'linear',
    baseLabel: 'joule',
    allowNegative: false,
    summaryUnitIds: ['joule', 'kilojoule', 'kilocalorie', 'kilowattHour'],
    groups: [
      {
        id: 'common',
        title: 'Energy units',
        units: [
          U('joule', 'Energy in joules', 'J', 'common', 1),
          U('kilojoule', 'Energy in kilojoules', 'kJ', 'common', 1000),
          U('calorie', 'Energy in thermochemical calories', 'cal', 'common', CAL_J),
          U('kilocalorie', 'Energy in kilocalories', 'kcal', 'common', CAL_J * 1000),
          U('wattHour', 'Energy in watt-hours', 'Wh', 'common', 3600),
          U('kilowattHour', 'Energy in kilowatt-hours', 'kWh', 'common', 3_600_000),
          U('electronvolt', 'Energy in electronvolts', 'eV', 'common', EV_J),
          U('btu', 'Energy in BTU (IT)', 'BTU', 'common', BTU_IT_J),
        ],
      },
    ],
  },
  power: {
    id: 'power',
    label: 'Power',
    kind: 'linear',
    baseLabel: 'watt',
    allowNegative: false,
    summaryUnitIds: ['watt', 'kilowatt', 'metricHorsepower', 'mechanicalHorsepower'],
    groups: [
      {
        id: 'common',
        title: 'Power units',
        units: [
          U('milliwatt', 'Power in milliwatts', 'mW', 'common', 0.001),
          U('watt', 'Power in watts', 'W', 'common', 1),
          U('kilowatt', 'Power in kilowatts', 'kW', 'common', 1000),
          U('megawatt', 'Power in megawatts', 'MW', 'common', 1e6),
          U('gigawatt', 'Power in gigawatts', 'GW', 'common', 1e9),
          U('metricHorsepower', 'Power in metric horsepower', 'PS', 'common', HP_METRIC_W),
          U('mechanicalHorsepower', 'Power in mechanical horsepower', 'hp', 'common', HP_MECH_W),
        ],
      },
    ],
  },
  pressure: {
    id: 'pressure',
    label: 'Pressure',
    kind: 'linear',
    baseLabel: 'pascal',
    allowNegative: false,
    summaryUnitIds: ['pascal', 'bar', 'atmosphere', 'psi'],
    groups: [
      {
        id: 'common',
        title: 'Pressure units',
        units: [
          U('pascal', 'Pressure in pascals', 'Pa', 'common', 1),
          U('kilopascal', 'Pressure in kilopascals', 'kPa', 'common', 1000),
          U('megapascal', 'Pressure in megapascals', 'MPa', 'common', 1e6),
          U('bar', 'Pressure in bars', 'bar', 'common', 100_000),
          U('atmosphere', 'Pressure in atmospheres', 'atm', 'common', ATM_PA),
          U('psi', 'Pressure in pounds per square inch', 'psi', 'common', PSI_PA),
          U('torr', 'Pressure in torr', 'Torr', 'common', TORR_PA),
          U('mmHg', 'Pressure in mmHg (conventional = Torr)', 'mmHg', 'common', TORR_PA),
        ],
      },
    ],
  },
  dataStorage: {
    id: 'dataStorage',
    label: 'Data Storage',
    kind: 'linear',
    baseLabel: 'byte',
    allowNegative: false,
    summaryUnitIds: ['byte', 'kilobyte', 'kibibyte', 'megabyte', 'mebibyte'],
    groups: [
      {
        id: 'decimal',
        title: 'Decimal (SI) data units',
        units: [
          U('bit', 'Data in bits', 'bit', 'decimal', 0.125),
          U('byte', 'Data in bytes', 'B', 'decimal', 1),
          U('kilobyte', 'Data in kilobytes', 'kB', 'decimal', 1000),
          U('megabyte', 'Data in megabytes', 'MB', 'decimal', 1_000_000),
          U('gigabyte', 'Data in gigabytes', 'GB', 'decimal', 1e9),
          U('terabyte', 'Data in terabytes', 'TB', 'decimal', 1e12),
        ],
      },
      {
        id: 'binary',
        title: 'Binary (IEC) data units',
        units: [
          U('kibibyte', 'Data in kibibytes', 'KiB', 'binary', 1024),
          U('mebibyte', 'Data in mebibytes', 'MiB', 'binary', 1024 ** 2),
          U('gibibyte', 'Data in gibibytes', 'GiB', 'binary', 1024 ** 3),
          U('tebibyte', 'Data in tebibytes', 'TiB', 'binary', 1024 ** 4),
        ],
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
  const meters = value * LENGTH_TO_METERS[from];
  return meters / LENGTH_TO_METERS[to];
}
