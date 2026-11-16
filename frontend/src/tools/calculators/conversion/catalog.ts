import {
  CATEGORY_IDS,
  type CategoryId,
  type ConversionCategory,
  type UnitDefinition,
} from './types';

function L(
  id: string,
  label: string,
  symbol: string,
  toBase: number,
): UnitDefinition {
  return { id, label, symbol, kind: 'linear', toBase };
}

const INCH = 0.0254;
const FOOT = 0.3048;
const YARD = 0.9144;
const MILE = 1609.344;
const LB = 0.45359237;
const OZ = LB / 16;
const US_GALLON = 0.003785411784;
const IMP_GALLON = 0.00454609;
const US_CUP = US_GALLON / 16;
const US_TBSP = US_CUP / 16;
const US_TSP = US_TBSP / 3;
const ATM = 101_325;
const TORR = ATM / 760;
const PSI = 6894.757293168;
const CAL = 4.184;
const BTU_IT = 1055.05585262;
const HP = 745.69987158227022;
const LBF = 4.4482216152605;
const LBF_FT = 1.3558179483314004;
const STANDARD_G = 9.80665;
const YEAR_S = 31_557_600; // Julian year: 365.25 × 86,400
const MONTH_S = 2_629_800; // 1/12 Julian year

export const CATEGORIES: Record<CategoryId, ConversionCategory> = {
  length: {
    id: 'length',
    label: 'Length',
    kind: 'linear',
    baseLabel: 'meter',
    defaultSourceUnit: 'm',
    defaultDestUnit: 'cm',
    units: [
      L('mm', 'Millimeter', 'mm', 0.001),
      L('cm', 'Centimeter', 'cm', 0.01),
      L('m', 'Meter', 'm', 1),
      L('km', 'Kilometer', 'km', 1000),
      L('in', 'Inch', 'in', INCH),
      L('ft', 'Foot', 'ft', FOOT),
      L('yd', 'Yard', 'yd', YARD),
      L('mi', 'Mile', 'mi', MILE),
    ],
  },
  area: {
    id: 'area',
    label: 'Area',
    kind: 'linear',
    baseLabel: 'square meter',
    defaultSourceUnit: 'm2',
    defaultDestUnit: 'ft2',
    units: [
      L('mm2', 'Square millimeter', 'mm²', 1e-6),
      L('cm2', 'Square centimeter', 'cm²', 1e-4),
      L('m2', 'Square meter', 'm²', 1),
      L('km2', 'Square kilometer', 'km²', 1e6),
      L('in2', 'Square inch', 'in²', INCH * INCH),
      L('ft2', 'Square foot', 'ft²', FOOT * FOOT),
      L('acre', 'Acre', 'ac', 4046.8564224),
      L('ha', 'Hectare', 'ha', 10_000),
    ],
  },
  volume: {
    id: 'volume',
    label: 'Volume',
    kind: 'linear',
    baseLabel: 'cubic meter',
    defaultSourceUnit: 'L',
    defaultDestUnit: 'gal_us',
    note: 'Cup, tablespoon, teaspoon, and gallon use U.S. liquid definitions unless marked imperial.',
    units: [
      L('mL', 'Milliliter', 'mL', 1e-6),
      L('L', 'Liter', 'L', 0.001),
      L('m3', 'Cubic meter', 'm³', 1),
      L('tsp', 'Teaspoon (US)', 'tsp', US_TSP),
      L('tbsp', 'Tablespoon (US)', 'tbsp', US_TBSP),
      L('cup', 'Cup (US)', 'cup', US_CUP),
      L('gal_us', 'Gallon (US liquid)', 'gal (US)', US_GALLON),
      L('gal_imp', 'Gallon (imperial)', 'gal (UK)', IMP_GALLON),
    ],
  },
  mass: {
    id: 'mass',
    label: 'Mass',
    kind: 'linear',
    baseLabel: 'kilogram',
    defaultSourceUnit: 'kg',
    defaultDestUnit: 'lb',
    note: 'Everyday “weight” conversions here are mass (not force).',
    units: [
      L('mg', 'Milligram', 'mg', 1e-6),
      L('g', 'Gram', 'g', 0.001),
      L('kg', 'Kilogram', 'kg', 1),
      L('t', 'Metric tonne', 't', 1000),
      L('oz', 'Ounce (avoirdupois)', 'oz', OZ),
      L('lb', 'Pound (avoirdupois)', 'lb', LB),
    ],
  },
  temperature: {
    id: 'temperature',
    label: 'Temperature',
    kind: 'temperature',
    baseLabel: 'kelvin',
    defaultSourceUnit: 'C',
    defaultDestUnit: 'F',
    note: 'Temperature uses affine formulas (not a simple scale factor).',
    units: [
      { id: 'C', label: 'Celsius', symbol: '°C', kind: 'temperature' },
      { id: 'F', label: 'Fahrenheit', symbol: '°F', kind: 'temperature' },
      { id: 'K', label: 'Kelvin', symbol: 'K', kind: 'temperature' },
    ],
  },
  time: {
    id: 'time',
    label: 'Time',
    kind: 'linear',
    baseLabel: 'second',
    defaultSourceUnit: 'h',
    defaultDestUnit: 'min',
    note: 'Year = Julian year (365.25 days). Month = 1/12 of that average year.',
    units: [
      L('ms', 'Millisecond', 'ms', 0.001),
      L('s', 'Second', 's', 1),
      L('min', 'Minute', 'min', 60),
      L('h', 'Hour', 'h', 3600),
      L('d', 'Day', 'd', 86_400),
      L('wk', 'Week', 'wk', 604_800),
      L('mo', 'Month (avg)', 'mo', MONTH_S),
      L('yr', 'Year (Julian)', 'yr', YEAR_S),
    ],
  },
  speed: {
    id: 'speed',
    label: 'Speed',
    kind: 'linear',
    baseLabel: 'meter per second',
    defaultSourceUnit: 'mps',
    defaultDestUnit: 'kmh',
    units: [
      L('mps', 'Meter per second', 'm/s', 1),
      L('kmh', 'Kilometer per hour', 'km/h', 1 / 3.6),
      L('mph', 'Mile per hour', 'mph', MILE / 3600),
      L('kn', 'Knot', 'kn', 1852 / 3600),
      L('fps', 'Foot per second', 'ft/s', FOOT),
    ],
  },
  pressure: {
    id: 'pressure',
    label: 'Pressure',
    kind: 'linear',
    baseLabel: 'pascal',
    defaultSourceUnit: 'atm',
    defaultDestUnit: 'Pa',
    units: [
      L('Pa', 'Pascal', 'Pa', 1),
      L('kPa', 'Kilopascal', 'kPa', 1000),
      L('bar', 'Bar', 'bar', 100_000),
      L('atm', 'Atmosphere', 'atm', ATM),
      L('psi', 'Pound per square inch', 'psi', PSI),
      L('torr', 'Torr', 'torr', TORR),
    ],
  },
  energy: {
    id: 'energy',
    label: 'Energy',
    kind: 'linear',
    baseLabel: 'joule',
    defaultSourceUnit: 'kWh',
    defaultDestUnit: 'J',
    units: [
      L('J', 'Joule', 'J', 1),
      L('kJ', 'Kilojoule', 'kJ', 1000),
      L('cal', 'Calorie (thermochemical)', 'cal', CAL),
      L('kcal', 'Kilocalorie', 'kcal', CAL * 1000),
      L('Wh', 'Watt-hour', 'Wh', 3600),
      L('kWh', 'Kilowatt-hour', 'kWh', 3_600_000),
      L('BTU', 'BTU (IT)', 'BTU', BTU_IT),
    ],
  },
  power: {
    id: 'power',
    label: 'Power',
    kind: 'linear',
    baseLabel: 'watt',
    defaultSourceUnit: 'kW',
    defaultDestUnit: 'hp',
    units: [
      L('W', 'Watt', 'W', 1),
      L('kW', 'Kilowatt', 'kW', 1000),
      L('hp', 'Horsepower (mechanical)', 'hp', HP),
    ],
  },
  force: {
    id: 'force',
    label: 'Force',
    kind: 'linear',
    baseLabel: 'newton',
    defaultSourceUnit: 'N',
    defaultDestUnit: 'lbf',
    units: [
      L('N', 'Newton', 'N', 1),
      L('kN', 'Kilonewton', 'kN', 1000),
      L('lbf', 'Pound-force', 'lbf', LBF),
    ],
  },
  torque: {
    id: 'torque',
    label: 'Torque',
    kind: 'linear',
    baseLabel: 'newton-meter',
    defaultSourceUnit: 'Nm',
    defaultDestUnit: 'lbf_ft',
    units: [
      L('Nm', 'Newton-meter', 'N·m', 1),
      L('lbf_ft', 'Pound-force foot', 'lbf·ft', LBF_FT),
    ],
  },
  angle: {
    id: 'angle',
    label: 'Angle',
    kind: 'linear',
    baseLabel: 'radian',
    defaultSourceUnit: 'deg',
    defaultDestUnit: 'rad',
    units: [
      L('deg', 'Degree', '°', Math.PI / 180),
      L('rad', 'Radian', 'rad', 1),
      L('grad', 'Gradian', 'gon', Math.PI / 200),
      L('turn', 'Turn', 'tr', 2 * Math.PI),
    ],
  },
  frequency: {
    id: 'frequency',
    label: 'Frequency',
    kind: 'linear',
    baseLabel: 'hertz',
    defaultSourceUnit: 'Hz',
    defaultDestUnit: 'kHz',
    units: [
      L('Hz', 'Hertz', 'Hz', 1),
      L('kHz', 'Kilohertz', 'kHz', 1000),
      L('MHz', 'Megahertz', 'MHz', 1_000_000),
      L('GHz', 'Gigahertz', 'GHz', 1_000_000_000),
    ],
  },
  dataStorage: {
    id: 'dataStorage',
    label: 'Data storage',
    kind: 'linear',
    baseLabel: 'bit',
    defaultSourceUnit: 'MB',
    defaultDestUnit: 'B',
    note: 'kB/MB/GB/TB use decimal SI prefixes. KiB/MiB/GiB/TiB use binary IEC prefixes.',
    units: [
      L('bit', 'Bit', 'bit', 1),
      L('B', 'Byte', 'B', 8),
      L('kB', 'Kilobyte (decimal)', 'kB', 8 * 1000),
      L('MB', 'Megabyte (decimal)', 'MB', 8 * 1_000_000),
      L('GB', 'Gigabyte (decimal)', 'GB', 8 * 1_000_000_000),
      L('TB', 'Terabyte (decimal)', 'TB', 8 * 1_000_000_000_000),
      L('KiB', 'Kibibyte', 'KiB', 8 * 1024),
      L('MiB', 'Mebibyte', 'MiB', 8 * 1024 ** 2),
      L('GiB', 'Gibibyte', 'GiB', 8 * 1024 ** 3),
      L('TiB', 'Tebibyte', 'TiB', 8 * 1024 ** 4),
    ],
  },
  dataTransfer: {
    id: 'dataTransfer',
    label: 'Data transfer rate',
    kind: 'linear',
    baseLabel: 'bit per second',
    defaultSourceUnit: 'Mbps',
    defaultDestUnit: 'bps',
    note: 'Decimal SI prefixes for bit and byte rates (kbps = 1,000 bps).',
    units: [
      L('bps', 'Bit per second', 'bps', 1),
      L('kbps', 'Kilobit per second', 'kbps', 1000),
      L('Mbps', 'Megabit per second', 'Mbps', 1_000_000),
      L('Gbps', 'Gigabit per second', 'Gbps', 1_000_000_000),
      L('Bps', 'Byte per second', 'B/s', 8),
      L('MBps', 'Megabyte per second', 'MB/s', 8 * 1_000_000),
    ],
  },
  density: {
    id: 'density',
    label: 'Density',
    kind: 'linear',
    baseLabel: 'kilogram per cubic meter',
    defaultSourceUnit: 'kg_m3',
    defaultDestUnit: 'g_cm3',
    units: [
      L('kg_m3', 'Kilogram per cubic meter', 'kg/m³', 1),
      L('g_cm3', 'Gram per cubic centimeter', 'g/cm³', 1000),
      L('lb_ft3', 'Pound per cubic foot', 'lb/ft³', LB / (FOOT * FOOT * FOOT)),
    ],
  },
  acceleration: {
    id: 'acceleration',
    label: 'Acceleration',
    kind: 'linear',
    baseLabel: 'meter per second squared',
    defaultSourceUnit: 'mps2',
    defaultDestUnit: 'g0',
    units: [
      L('mps2', 'Meter per second squared', 'm/s²', 1),
      L('fps2', 'Foot per second squared', 'ft/s²', FOOT),
      L('g0', 'Standard gravity (g₀)', 'g₀', STANDARD_G),
    ],
  },
  fuelEconomy: {
    id: 'fuelEconomy',
    label: 'Fuel economy',
    kind: 'fuel',
    baseLabel: 'kilometer per liter',
    defaultSourceUnit: 'km_L',
    defaultDestUnit: 'L_100km',
    note: 'L/100 km is reciprocal. mpg (US) and mpg (UK) use different gallon definitions.',
    units: [
      { id: 'km_L', label: 'Kilometer per liter', symbol: 'km/L', kind: 'fuel' },
      { id: 'L_100km', label: 'Liter per 100 kilometers', symbol: 'L/100 km', kind: 'fuel' },
      { id: 'mpg_us', label: 'Mile per gallon (US)', symbol: 'mpg (US)', kind: 'fuel' },
      { id: 'mpg_uk', label: 'Mile per gallon (UK)', symbol: 'mpg (UK)', kind: 'fuel' },
    ],
  },
};

export const CATEGORY_LIST: readonly ConversionCategory[] = CATEGORY_IDS.map(
  (id) => CATEGORIES[id],
);

export function getCategory(id: CategoryId): ConversionCategory {
  return CATEGORIES[id];
}

export function getUnit(categoryId: CategoryId, unitId: string): UnitDefinition | undefined {
  return CATEGORIES[categoryId].units.find((u) => u.id === unitId);
}
