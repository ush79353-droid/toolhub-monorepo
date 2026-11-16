import type { Dimension, DimensionCategory, UnitDefinition } from './types';

function L(
  id: string,
  name: string,
  symbol: string,
  dimension: Dimension,
  factorToBase: number,
): UnitDefinition {
  return { id, name, symbol, dimension, kind: 'linear', factorToBase };
}

function T(id: string, name: string, symbol: string): UnitDefinition {
  return { id, name, symbol, dimension: 'temperature', kind: 'temperature' };
}

const INCH = 0.0254;
const FOOT = 0.3048;
const YARD = 0.9144;
const MILE = 1609.344;
const NMI = 1852;
const LB = 0.45359237;
const OZ = LB / 16;
const SHORT_TON = LB * 2000;
const LONG_TON = LB * 2240;
const US_GAL = 0.003785411784;
const IMP_GAL = 0.00454609;
const US_QT = US_GAL / 4;
const US_PT = US_GAL / 8;
const ATM = 101_325;
const TORR = ATM / 760;
const PSI = 6894.757293168361;
const CAL = 4.184;
const BTU_IT = 1055.05585262;
const HP = 745.69987158227022;
const LBF = 4.4482216152605;
const DYNE = 1e-5;
const STANDARD_G = 9.80665;
const EV = 1.602176634e-19;
const JULIAN_YEAR = 31_557_600;

export const CATEGORIES: Record<Dimension, DimensionCategory> = {
  length: {
    id: 'length',
    label: 'Length',
    symbol: '[L]',
    kind: 'linear',
    baseLabel: 'meter',
    defaultFrom: 'm',
    defaultTo: 'km',
    units: [
      L('nm', 'Nanometer', 'nm', 'length', 1e-9),
      L('um', 'Micrometer', 'µm', 'length', 1e-6),
      L('mm', 'Millimeter', 'mm', 'length', 0.001),
      L('cm', 'Centimeter', 'cm', 'length', 0.01),
      L('dm', 'Decimeter', 'dm', 'length', 0.1),
      L('m', 'Meter', 'm', 'length', 1),
      L('km', 'Kilometer', 'km', 'length', 1000),
      L('in', 'Inch', 'in', 'length', INCH),
      L('ft', 'Foot', 'ft', 'length', FOOT),
      L('yd', 'Yard', 'yd', 'length', YARD),
      L('mi', 'Mile', 'mi', 'length', MILE),
      L('nmi', 'Nautical mile', 'nmi', 'length', NMI),
    ],
  },
  mass: {
    id: 'mass',
    label: 'Mass',
    symbol: '[M]',
    kind: 'linear',
    baseLabel: 'kilogram',
    defaultFrom: 'kg',
    defaultTo: 'lb',
    units: [
      L('ug', 'Microgram', 'µg', 'mass', 1e-9),
      L('mg', 'Milligram', 'mg', 'mass', 1e-6),
      L('g', 'Gram', 'g', 'mass', 0.001),
      L('kg', 'Kilogram', 'kg', 'mass', 1),
      L('t', 'Metric tonne', 't', 'mass', 1000),
      L('oz', 'Ounce', 'oz', 'mass', OZ),
      L('lb', 'Pound', 'lb', 'mass', LB),
      L('ton_us', 'US short ton', 'ton (US)', 'mass', SHORT_TON),
      L('ton_uk', 'Imperial long ton', 'ton (UK)', 'mass', LONG_TON),
    ],
  },
  time: {
    id: 'time',
    label: 'Time',
    symbol: '[T]',
    kind: 'linear',
    baseLabel: 'second',
    defaultFrom: 'h',
    defaultTo: 's',
    note: 'Julian year = 365.25 days. Calendar months are not fixed-duration units here.',
    units: [
      L('ns', 'Nanosecond', 'ns', 'time', 1e-9),
      L('us', 'Microsecond', 'µs', 'time', 1e-6),
      L('ms', 'Millisecond', 'ms', 'time', 0.001),
      L('s', 'Second', 's', 'time', 1),
      L('min', 'Minute', 'min', 'time', 60),
      L('h', 'Hour', 'h', 'time', 3600),
      L('d', 'Day', 'd', 'time', 86_400),
      L('wk', 'Week', 'wk', 'time', 604_800),
      L('yr', 'Julian year', 'yr', 'time', JULIAN_YEAR),
    ],
  },
  area: {
    id: 'area',
    label: 'Area',
    symbol: '[L]²',
    kind: 'linear',
    baseLabel: 'square meter',
    defaultFrom: 'm2',
    defaultTo: 'ha',
    units: [
      L('mm2', 'Square millimeter', 'mm²', 'area', 1e-6),
      L('cm2', 'Square centimeter', 'cm²', 'area', 1e-4),
      L('m2', 'Square meter', 'm²', 'area', 1),
      L('km2', 'Square kilometer', 'km²', 'area', 1e6),
      L('in2', 'Square inch', 'in²', 'area', INCH * INCH),
      L('ft2', 'Square foot', 'ft²', 'area', FOOT * FOOT),
      L('yd2', 'Square yard', 'yd²', 'area', YARD * YARD),
      L('acre', 'Acre', 'ac', 'area', 4046.8564224),
      L('ha', 'Hectare', 'ha', 'area', 10_000),
      L('mi2', 'Square mile', 'mi²', 'area', MILE * MILE),
    ],
  },
  volume: {
    id: 'volume',
    label: 'Volume',
    symbol: '[L]³',
    kind: 'linear',
    baseLabel: 'cubic meter',
    defaultFrom: 'L',
    defaultTo: 'mL',
    note: 'US liquid and Imperial gallons are distinct.',
    units: [
      L('mL', 'Milliliter', 'mL', 'volume', 1e-6),
      L('L', 'Liter', 'L', 'volume', 0.001),
      L('cm3', 'Cubic centimeter', 'cm³', 'volume', 1e-6),
      L('m3', 'Cubic meter', 'm³', 'volume', 1),
      L('in3', 'Cubic inch', 'in³', 'volume', INCH ** 3),
      L('ft3', 'Cubic foot', 'ft³', 'volume', FOOT ** 3),
      L('gal_us', 'US liquid gallon', 'gal (US)', 'volume', US_GAL),
      L('qt_us', 'US liquid quart', 'qt (US)', 'volume', US_QT),
      L('pt_us', 'US liquid pint', 'pt (US)', 'volume', US_PT),
      L('gal_imp', 'Imperial gallon', 'gal (UK)', 'volume', IMP_GAL),
    ],
  },
  speed: {
    id: 'speed',
    label: 'Speed',
    symbol: '[L][T]⁻¹',
    kind: 'linear',
    baseLabel: 'meter per second',
    defaultFrom: 'kmh',
    defaultTo: 'mps',
    units: [
      L('mps', 'Meter per second', 'm/s', 'speed', 1),
      L('kmh', 'Kilometer per hour', 'km/h', 'speed', 1000 / 3600),
      L('fps', 'Foot per second', 'ft/s', 'speed', FOOT),
      L('mph', 'Mile per hour', 'mph', 'speed', MILE / 3600),
      L('kn', 'Knot', 'kn', 'speed', NMI / 3600),
    ],
  },
  acceleration: {
    id: 'acceleration',
    label: 'Acceleration',
    symbol: '[L][T]⁻²',
    kind: 'linear',
    baseLabel: 'meter per second squared',
    defaultFrom: 'mps2',
    defaultTo: 'g0',
    units: [
      L('mps2', 'Meter per second squared', 'm/s²', 'acceleration', 1),
      L('fps2', 'Foot per second squared', 'ft/s²', 'acceleration', FOOT),
      L('g0', 'Standard gravity', 'g₀', 'acceleration', STANDARD_G),
    ],
  },
  force: {
    id: 'force',
    label: 'Force',
    symbol: '[M][L][T]⁻²',
    kind: 'linear',
    baseLabel: 'newton',
    defaultFrom: 'N',
    defaultTo: 'lbf',
    units: [
      L('N', 'Newton', 'N', 'force', 1),
      L('kN', 'Kilonewton', 'kN', 'force', 1000),
      L('dyn', 'Dyne', 'dyn', 'force', DYNE),
      L('lbf', 'Pound-force', 'lbf', 'force', LBF),
    ],
  },
  pressure: {
    id: 'pressure',
    label: 'Pressure',
    symbol: '[M][L]⁻¹[T]⁻²',
    kind: 'linear',
    baseLabel: 'pascal',
    defaultFrom: 'bar',
    defaultTo: 'Pa',
    note: 'Values are pressure magnitudes (absolute or differences), not gauge/absolute mixes.',
    units: [
      L('Pa', 'Pascal', 'Pa', 'pressure', 1),
      L('kPa', 'Kilopascal', 'kPa', 'pressure', 1000),
      L('MPa', 'Megapascal', 'MPa', 'pressure', 1e6),
      L('bar', 'Bar', 'bar', 'pressure', 100_000),
      L('atm', 'Standard atmosphere', 'atm', 'pressure', ATM),
      L('Torr', 'Torr', 'Torr', 'pressure', TORR),
      L('psi', 'PSI', 'psi', 'pressure', PSI),
    ],
  },
  energy: {
    id: 'energy',
    label: 'Energy',
    symbol: '[M][L]²[T]⁻²',
    kind: 'linear',
    baseLabel: 'joule',
    defaultFrom: 'kWh',
    defaultTo: 'J',
    note: 'BTU uses the International Table (IT) definition.',
    units: [
      L('J', 'Joule', 'J', 'energy', 1),
      L('kJ', 'Kilojoule', 'kJ', 'energy', 1000),
      L('cal', 'Calorie (thermochemical)', 'cal', 'energy', CAL),
      L('kcal', 'Kilocalorie', 'kcal', 'energy', CAL * 1000),
      L('Wh', 'Watt-hour', 'Wh', 'energy', 3600),
      L('kWh', 'Kilowatt-hour', 'kWh', 'energy', 3_600_000),
      L('eV', 'Electronvolt', 'eV', 'energy', EV),
      L('BTU', 'BTU (IT)', 'BTU', 'energy', BTU_IT),
    ],
  },
  power: {
    id: 'power',
    label: 'Power',
    symbol: '[M][L]²[T]⁻³',
    kind: 'linear',
    baseLabel: 'watt',
    defaultFrom: 'kW',
    defaultTo: 'hp',
    units: [
      L('W', 'Watt', 'W', 'power', 1),
      L('kW', 'Kilowatt', 'kW', 'power', 1000),
      L('MW', 'Megawatt', 'MW', 'power', 1e6),
      L('hp', 'Horsepower (mechanical)', 'hp', 'power', HP),
      L('BTUh', 'BTU per hour (IT)', 'BTU/h', 'power', BTU_IT / 3600),
    ],
  },
  temperature: {
    id: 'temperature',
    label: 'Temperature',
    symbol: '[Θ]',
    kind: 'temperature',
    baseLabel: 'kelvin',
    defaultFrom: 'C',
    defaultTo: 'F',
    note: 'Temperature uses affine formulas (offset + scale), not a single factor.',
    units: [
      T('C', 'Celsius', '°C'),
      T('F', 'Fahrenheit', '°F'),
      T('K', 'Kelvin', 'K'),
      T('R', 'Rankine', '°R'),
    ],
  },
  density: {
    id: 'density',
    label: 'Density',
    symbol: '[M][L]⁻³',
    kind: 'linear',
    baseLabel: 'kilogram per cubic meter',
    defaultFrom: 'kg_m3',
    defaultTo: 'g_cm3',
    units: [
      L('kg_m3', 'Kilogram per cubic meter', 'kg/m³', 'density', 1),
      L('g_cm3', 'Gram per cubic centimeter', 'g/cm³', 'density', 1000),
      L('g_mL', 'Gram per milliliter', 'g/mL', 'density', 1000),
      L('lb_ft3', 'Pound per cubic foot', 'lb/ft³', 'density', LB / FOOT ** 3),
      L('lb_gal', 'Pound per US gallon', 'lb/gal (US)', 'density', LB / US_GAL),
    ],
  },
  frequency: {
    id: 'frequency',
    label: 'Frequency',
    symbol: '[T]⁻¹',
    kind: 'linear',
    baseLabel: 'hertz',
    defaultFrom: 'Hz',
    defaultTo: 'rpm',
    units: [
      L('Hz', 'Hertz', 'Hz', 'frequency', 1),
      L('kHz', 'Kilohertz', 'kHz', 'frequency', 1000),
      L('MHz', 'Megahertz', 'MHz', 'frequency', 1e6),
      L('GHz', 'Gigahertz', 'GHz', 'frequency', 1e9),
      L('rpm', 'Revolutions per minute', 'rpm', 'frequency', 1 / 60),
    ],
  },
  angle: {
    id: 'angle',
    label: 'Angle',
    symbol: '1',
    kind: 'linear',
    baseLabel: 'radian',
    defaultFrom: 'deg',
    defaultTo: 'rad',
    units: [
      L('deg', 'Degree', '°', 'angle', Math.PI / 180),
      L('rad', 'Radian', 'rad', 'angle', 1),
      L('arcmin', 'Arcminute', '′', 'angle', Math.PI / 180 / 60),
      L('arcsec', 'Arcsecond', '″', 'angle', Math.PI / 180 / 3600),
      L('rev', 'Revolution', 'rev', 'angle', 2 * Math.PI),
    ],
  },
};

export const CATEGORY_LIST: readonly DimensionCategory[] = Object.values(CATEGORIES);

export function getCategory(id: Dimension): DimensionCategory {
  return CATEGORIES[id];
}

export function getUnit(dimension: Dimension, unitId: string): UnitDefinition | undefined {
  return CATEGORIES[dimension].units.find((u) => u.id === unitId);
}
