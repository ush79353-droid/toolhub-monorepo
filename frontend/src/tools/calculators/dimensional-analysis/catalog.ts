import { dim, type DimensionVector } from './dimensions';

export type UnitKind = 'base' | 'derived';
export type ConversionKind = 'linear' | 'temperature';

export interface UnitDef {
  id: string;
  label: string;
  symbol: string;
  /** Multiply value by toSI to get SI base (linear). Unused for temperature. */
  toSI: number;
}

export interface QuantityDef {
  id: string;
  label: string;
  kind: UnitKind;
  dimension: DimensionVector;
  conversionKind: ConversionKind;
  siSymbol: string;
  defaultUnitId: string;
  units: readonly UnitDef[];
}

const FOOT = 0.3048;
const INCH = 0.0254;
const YARD = 0.9144;
const MILE = 1609.344;
const LB = 0.45359237;
const OZ = LB / 16;

function U(id: string, label: string, symbol: string, toSI: number): UnitDef {
  return { id, label, symbol, toSI };
}

export const QUANTITIES: readonly QuantityDef[] = [
  {
    id: 'length',
    label: 'Length',
    kind: 'base',
    dimension: dim({ L: 1 }),
    conversionKind: 'linear',
    siSymbol: 'm',
    defaultUnitId: 'm',
    units: [
      U('mm', 'Millimeter', 'mm', 0.001),
      U('cm', 'Centimeter', 'cm', 0.01),
      U('m', 'Meter', 'm', 1),
      U('km', 'Kilometer', 'km', 1000),
      U('in', 'Inch', 'in', INCH),
      U('ft', 'Foot', 'ft', FOOT),
      U('yd', 'Yard', 'yd', YARD),
      U('mi', 'Mile', 'mi', MILE),
    ],
  },
  {
    id: 'mass',
    label: 'Mass',
    kind: 'base',
    dimension: dim({ M: 1 }),
    conversionKind: 'linear',
    siSymbol: 'kg',
    defaultUnitId: 'kg',
    units: [
      U('mg', 'Milligram', 'mg', 1e-6),
      U('g', 'Gram', 'g', 0.001),
      U('kg', 'Kilogram', 'kg', 1),
      U('t', 'Metric ton', 't', 1000),
      U('oz', 'Ounce', 'oz', OZ),
      U('lb', 'Pound', 'lb', LB),
    ],
  },
  {
    id: 'time',
    label: 'Time',
    kind: 'base',
    dimension: dim({ T: 1 }),
    conversionKind: 'linear',
    siSymbol: 's',
    defaultUnitId: 's',
    units: [
      U('ms', 'Millisecond', 'ms', 0.001),
      U('s', 'Second', 's', 1),
      U('min', 'Minute', 'min', 60),
      U('h', 'Hour', 'h', 3600),
      U('d', 'Day', 'd', 86400),
      U('wk', 'Week', 'wk', 604800),
    ],
  },
  {
    id: 'current',
    label: 'Electric current',
    kind: 'base',
    dimension: dim({ I: 1 }),
    conversionKind: 'linear',
    siSymbol: 'A',
    defaultUnitId: 'A',
    units: [
      U('uA', 'Microampere', 'µA', 1e-6),
      U('mA', 'Milliampere', 'mA', 0.001),
      U('A', 'Ampere', 'A', 1),
      U('kA', 'Kiloampere', 'kA', 1000),
    ],
  },
  {
    id: 'temperature',
    label: 'Thermodynamic temperature',
    kind: 'base',
    dimension: dim({ theta: 1 }),
    conversionKind: 'temperature',
    siSymbol: 'K',
    defaultUnitId: 'C',
    units: [
      U('C', 'Celsius', '°C', 1),
      U('F', 'Fahrenheit', '°F', 1),
      U('K', 'Kelvin', 'K', 1),
      U('R', 'Rankine', '°R', 1),
    ],
  },
  {
    id: 'amount',
    label: 'Amount of substance',
    kind: 'base',
    dimension: dim({ N: 1 }),
    conversionKind: 'linear',
    siSymbol: 'mol',
    defaultUnitId: 'mol',
    units: [
      U('umol', 'Micromole', 'µmol', 1e-6),
      U('mmol', 'Millimole', 'mmol', 0.001),
      U('mol', 'Mole', 'mol', 1),
      U('kmol', 'Kilomole', 'kmol', 1000),
    ],
  },
  {
    id: 'luminous',
    label: 'Luminous intensity',
    kind: 'base',
    dimension: dim({ J: 1 }),
    conversionKind: 'linear',
    siSymbol: 'cd',
    defaultUnitId: 'cd',
    units: [
      U('mcd', 'Millicandela', 'mcd', 0.001),
      U('cd', 'Candela', 'cd', 1),
      U('kcd', 'Kilocandela', 'kcd', 1000),
    ],
  },
  {
    id: 'area',
    label: 'Area',
    kind: 'derived',
    dimension: dim({ L: 2 }),
    conversionKind: 'linear',
    siSymbol: 'm²',
    defaultUnitId: 'm2',
    units: [
      U('cm2', 'Square centimeter', 'cm²', 1e-4),
      U('m2', 'Square meter', 'm²', 1),
      U('km2', 'Square kilometer', 'km²', 1e6),
      U('ft2', 'Square foot', 'ft²', FOOT * FOOT),
      U('in2', 'Square inch', 'in²', INCH * INCH),
    ],
  },
  {
    id: 'volume',
    label: 'Volume',
    kind: 'derived',
    dimension: dim({ L: 3 }),
    conversionKind: 'linear',
    siSymbol: 'm³',
    defaultUnitId: 'm3',
    units: [
      U('mL', 'Milliliter', 'mL', 1e-6),
      U('L', 'Liter', 'L', 0.001),
      U('m3', 'Cubic meter', 'm³', 1),
      U('ft3', 'Cubic foot', 'ft³', FOOT ** 3),
    ],
  },
  {
    id: 'velocity',
    label: 'Velocity',
    kind: 'derived',
    dimension: dim({ L: 1, T: -1 }),
    conversionKind: 'linear',
    siSymbol: 'm/s',
    defaultUnitId: 'm_s',
    units: [
      U('m_s', 'Meter per second', 'm/s', 1),
      U('km_h', 'Kilometer per hour', 'km/h', 1000 / 3600),
      U('mph', 'Mile per hour', 'mph', MILE / 3600),
      U('ft_s', 'Foot per second', 'ft/s', FOOT),
    ],
  },
  {
    id: 'acceleration',
    label: 'Acceleration',
    kind: 'derived',
    dimension: dim({ L: 1, T: -2 }),
    conversionKind: 'linear',
    siSymbol: 'm/s²',
    defaultUnitId: 'm_s2',
    units: [
      U('m_s2', 'Meter per second squared', 'm/s²', 1),
      U('ft_s2', 'Foot per second squared', 'ft/s²', FOOT),
      U('g0', 'Standard gravity', 'g₀', 9.80665),
    ],
  },
  {
    id: 'force',
    label: 'Force',
    kind: 'derived',
    dimension: dim({ M: 1, L: 1, T: -2 }),
    conversionKind: 'linear',
    siSymbol: 'N',
    defaultUnitId: 'N',
    units: [
      U('N', 'Newton', 'N', 1),
      U('kN', 'Kilonewton', 'kN', 1000),
      U('lbf', 'Pound-force', 'lbf', 4.4482216152605),
    ],
  },
  {
    id: 'energy',
    label: 'Energy',
    kind: 'derived',
    dimension: dim({ M: 1, L: 2, T: -2 }),
    conversionKind: 'linear',
    siSymbol: 'J',
    defaultUnitId: 'J',
    units: [
      U('J', 'Joule', 'J', 1),
      U('kJ', 'Kilojoule', 'kJ', 1000),
      U('cal', 'Calorie (thermochemical)', 'cal', 4.184),
      U('kWh', 'Kilowatt-hour', 'kWh', 3.6e6),
    ],
  },
  {
    id: 'power',
    label: 'Power',
    kind: 'derived',
    dimension: dim({ M: 1, L: 2, T: -3 }),
    conversionKind: 'linear',
    siSymbol: 'W',
    defaultUnitId: 'W',
    units: [
      U('W', 'Watt', 'W', 1),
      U('kW', 'Kilowatt', 'kW', 1000),
      U('hp', 'Mechanical horsepower', 'hp', 745.6998715822702),
    ],
  },
  {
    id: 'pressure',
    label: 'Pressure',
    kind: 'derived',
    dimension: dim({ M: 1, L: -1, T: -2 }),
    conversionKind: 'linear',
    siSymbol: 'Pa',
    defaultUnitId: 'Pa',
    units: [
      U('Pa', 'Pascal', 'Pa', 1),
      U('kPa', 'Kilopascal', 'kPa', 1000),
      U('bar', 'Bar', 'bar', 1e5),
      U('atm', 'Atmosphere', 'atm', 101325),
      U('psi', 'Pound per square inch', 'psi', 6894.757293168),
    ],
  },
  {
    id: 'density',
    label: 'Density',
    kind: 'derived',
    dimension: dim({ M: 1, L: -3 }),
    conversionKind: 'linear',
    siSymbol: 'kg/m³',
    defaultUnitId: 'kg_m3',
    units: [
      U('kg_m3', 'Kilogram per cubic meter', 'kg/m³', 1),
      U('g_cm3', 'Gram per cubic centimeter', 'g/cm³', 1000),
      U('lb_ft3', 'Pound per cubic foot', 'lb/ft³', LB / FOOT ** 3),
    ],
  },
  {
    id: 'momentum',
    label: 'Momentum',
    kind: 'derived',
    dimension: dim({ M: 1, L: 1, T: -1 }),
    conversionKind: 'linear',
    siSymbol: 'kg·m/s',
    defaultUnitId: 'kg_m_s',
    units: [
      U('kg_m_s', 'Kilogram meter per second', 'kg·m/s', 1),
      U('g_cm_s', 'Gram centimeter per second', 'g·cm/s', 1e-5),
    ],
  },
  {
    id: 'frequency',
    label: 'Frequency',
    kind: 'derived',
    dimension: dim({ T: -1 }),
    conversionKind: 'linear',
    siSymbol: 'Hz',
    defaultUnitId: 'Hz',
    units: [
      U('Hz', 'Hertz', 'Hz', 1),
      U('kHz', 'Kilohertz', 'kHz', 1000),
      U('MHz', 'Megahertz', 'MHz', 1e6),
      U('rpm', 'Revolutions per minute', 'rpm', 1 / 60),
    ],
  },
  {
    id: 'charge',
    label: 'Electric charge',
    kind: 'derived',
    dimension: dim({ I: 1, T: 1 }),
    conversionKind: 'linear',
    siSymbol: 'C',
    defaultUnitId: 'C',
    units: [
      U('C', 'Coulomb', 'C', 1),
      U('mC', 'Millicoulomb', 'mC', 0.001),
      U('uC', 'Microcoulomb', 'µC', 1e-6),
    ],
  },
  {
    id: 'voltage',
    label: 'Voltage',
    kind: 'derived',
    dimension: dim({ M: 1, L: 2, T: -3, I: -1 }),
    conversionKind: 'linear',
    siSymbol: 'V',
    defaultUnitId: 'V',
    units: [
      U('mV', 'Millivolt', 'mV', 0.001),
      U('V', 'Volt', 'V', 1),
      U('kV', 'Kilovolt', 'kV', 1000),
    ],
  },
  {
    id: 'resistance',
    label: 'Resistance',
    kind: 'derived',
    dimension: dim({ M: 1, L: 2, T: -3, I: -2 }),
    conversionKind: 'linear',
    siSymbol: 'Ω',
    defaultUnitId: 'ohm',
    units: [
      U('ohm', 'Ohm', 'Ω', 1),
      U('kohm', 'Kilohm', 'kΩ', 1000),
      U('Mohm', 'Megohm', 'MΩ', 1e6),
    ],
  },
  {
    id: 'capacitance',
    label: 'Capacitance',
    kind: 'derived',
    dimension: dim({ M: -1, L: -2, T: 4, I: 2 }),
    conversionKind: 'linear',
    siSymbol: 'F',
    defaultUnitId: 'F',
    units: [
      U('pF', 'Picofarad', 'pF', 1e-12),
      U('nF', 'Nanofarad', 'nF', 1e-9),
      U('uF', 'Microfarad', 'µF', 1e-6),
      U('F', 'Farad', 'F', 1),
    ],
  },
  {
    id: 'viscosity',
    label: 'Dynamic viscosity',
    kind: 'derived',
    dimension: dim({ M: 1, L: -1, T: -1 }),
    conversionKind: 'linear',
    siSymbol: 'Pa·s',
    defaultUnitId: 'Pa_s',
    units: [
      U('Pa_s', 'Pascal second', 'Pa·s', 1),
      U('cP', 'Centipoise', 'cP', 0.001),
      U('P', 'Poise', 'P', 0.1),
    ],
  },
];

export function getQuantity(id: string): QuantityDef | undefined {
  return QUANTITIES.find((q) => q.id === id);
}

export function quantitiesByKind(kind: UnitKind): readonly QuantityDef[] {
  return QUANTITIES.filter((q) => q.kind === kind);
}

export function getUnit(quantityId: string, unitId: string): UnitDef | undefined {
  return getQuantity(quantityId)?.units.find((u) => u.id === unitId);
}

export const DEFAULT_BASE_QUANTITY = 'length';
export const DEFAULT_DERIVED_QUANTITY = 'area';
