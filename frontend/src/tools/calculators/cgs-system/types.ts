export type CgsField = 'si' | 'cgs';

export type CgsFieldErrors = Partial<Record<CgsField, string>>;

export const QUANTITY_IDS = [
  'length',
  'mass',
  'time',
  'area',
  'volume',
  'velocity',
  'acceleration',
  'force',
  'energy',
  'power',
  'pressure',
  'density',
  'momentum',
  'dynamicViscosity',
  'kinematicViscosity',
  'surfaceTension',
] as const;

export type QuantityId = (typeof QUANTITY_IDS)[number];

export interface ConversionQuantity {
  id: QuantityId;
  label: string;
  siUnit: string;
  cgsUnit: string;
  /** Multiply SI value by this to get CGS. */
  siToCgsFactor: number;
  formula: string;
}

export const DEFAULT_QUANTITY: QuantityId = 'acceleration';
export const DEFAULT_SI = 9.80665;
export const MAX_ABS_VALUE = 1e24;

export const QUANTITIES: Record<QuantityId, ConversionQuantity> = {
  length: {
    id: 'length',
    label: 'Length',
    siUnit: 'm',
    cgsUnit: 'cm',
    siToCgsFactor: 100,
    formula: '1 m = 100 cm',
  },
  mass: {
    id: 'mass',
    label: 'Mass',
    siUnit: 'kg',
    cgsUnit: 'g',
    siToCgsFactor: 1000,
    formula: '1 kg = 1,000 g',
  },
  time: {
    id: 'time',
    label: 'Time',
    siUnit: 's',
    cgsUnit: 's',
    siToCgsFactor: 1,
    formula: '1 s = 1 s',
  },
  area: {
    id: 'area',
    label: 'Area',
    siUnit: 'm²',
    cgsUnit: 'cm²',
    siToCgsFactor: 10_000,
    formula: '1 m² = 10,000 cm²',
  },
  volume: {
    id: 'volume',
    label: 'Volume',
    siUnit: 'm³',
    cgsUnit: 'cm³',
    siToCgsFactor: 1_000_000,
    formula: '1 m³ = 1,000,000 cm³',
  },
  velocity: {
    id: 'velocity',
    label: 'Velocity',
    siUnit: 'm/s',
    cgsUnit: 'cm/s',
    siToCgsFactor: 100,
    formula: '1 m/s = 100 cm/s',
  },
  acceleration: {
    id: 'acceleration',
    label: 'Acceleration',
    siUnit: 'm/s²',
    cgsUnit: 'Gal',
    siToCgsFactor: 100,
    formula: '1 m/s² = 100 Gal',
  },
  force: {
    id: 'force',
    label: 'Force',
    siUnit: 'N',
    cgsUnit: 'dyn',
    siToCgsFactor: 100_000,
    formula: '1 N = 100,000 dyn',
  },
  energy: {
    id: 'energy',
    label: 'Work/Energy',
    siUnit: 'J',
    cgsUnit: 'erg',
    siToCgsFactor: 10_000_000,
    formula: '1 J = 10,000,000 erg',
  },
  power: {
    id: 'power',
    label: 'Power',
    siUnit: 'W',
    cgsUnit: 'erg/s',
    siToCgsFactor: 10_000_000,
    formula: '1 W = 10,000,000 erg/s',
  },
  pressure: {
    id: 'pressure',
    label: 'Pressure',
    siUnit: 'Pa',
    cgsUnit: 'Ba',
    siToCgsFactor: 10,
    formula: '1 Pa = 10 Ba',
  },
  density: {
    id: 'density',
    label: 'Density',
    siUnit: 'kg/m³',
    cgsUnit: 'g/cm³',
    siToCgsFactor: 0.001,
    formula: '1 kg/m³ = 0.001 g/cm³',
  },
  momentum: {
    id: 'momentum',
    label: 'Momentum',
    siUnit: 'kg·m/s',
    cgsUnit: 'g·cm/s',
    siToCgsFactor: 100_000,
    formula: '1 kg·m/s = 100,000 g·cm/s',
  },
  dynamicViscosity: {
    id: 'dynamicViscosity',
    label: 'Dynamic viscosity',
    siUnit: 'Pa·s',
    cgsUnit: 'P',
    siToCgsFactor: 10,
    formula: '1 Pa·s = 10 P',
  },
  kinematicViscosity: {
    id: 'kinematicViscosity',
    label: 'Kinematic viscosity',
    siUnit: 'm²/s',
    cgsUnit: 'St',
    siToCgsFactor: 10_000,
    formula: '1 m²/s = 10,000 St',
  },
  surfaceTension: {
    id: 'surfaceTension',
    label: 'Surface tension',
    siUnit: 'N/m',
    cgsUnit: 'dyn/cm',
    siToCgsFactor: 1000,
    formula: '1 N/m = 1,000 dyn/cm',
  },
};

export const QUANTITY_LIST: readonly ConversionQuantity[] = QUANTITY_IDS.map(
  (id) => QUANTITIES[id],
);
