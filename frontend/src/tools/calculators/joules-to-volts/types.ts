export const SOLVE_FOR = ['voltage', 'energy', 'charge'] as const;
export type SolveFor = (typeof SOLVE_FOR)[number];

export const SOLVE_FOR_LABELS: Record<SolveFor, string> = {
  voltage: 'Calculate voltage (V = E / Q)',
  energy: 'Calculate energy (E = V × Q)',
  charge: 'Calculate charge (Q = E / V)',
};

export const ENERGY_UNITS = [
  'joule',
  'millijoule',
  'kilojoule',
  'megajoule',
  'wattHour',
  'kilowattHour',
  'electronvolt',
] as const;
export type EnergyUnit = (typeof ENERGY_UNITS)[number];

/** Multiply unit value by this factor to obtain joules. */
export const ENERGY_TO_JOULES: Record<EnergyUnit, number> = {
  joule: 1,
  millijoule: 0.001,
  kilojoule: 1_000,
  megajoule: 1_000_000,
  wattHour: 3_600,
  kilowattHour: 3_600_000,
  electronvolt: 1.602176634e-19,
};

export const ENERGY_UNIT_SYMBOLS: Record<EnergyUnit, string> = {
  joule: 'J',
  millijoule: 'mJ',
  kilojoule: 'kJ',
  megajoule: 'MJ',
  wattHour: 'Wh',
  kilowattHour: 'kWh',
  electronvolt: 'eV',
};

export const CHARGE_UNITS = [
  'coulomb',
  'millicoulomb',
  'microcoulomb',
  'nanocoulomb',
  'ampereHour',
  'milliampereHour',
] as const;
export type ChargeUnit = (typeof CHARGE_UNITS)[number];

/** Multiply unit value by this factor to obtain coulombs. */
export const CHARGE_TO_COULOMBS: Record<ChargeUnit, number> = {
  coulomb: 1,
  millicoulomb: 0.001,
  microcoulomb: 1e-6,
  nanocoulomb: 1e-9,
  ampereHour: 3_600,
  milliampereHour: 3.6,
};

export const CHARGE_UNIT_SYMBOLS: Record<ChargeUnit, string> = {
  coulomb: 'C',
  millicoulomb: 'mC',
  microcoulomb: 'μC',
  nanocoulomb: 'nC',
  ampereHour: 'Ah',
  milliampereHour: 'mAh',
};

export const VOLTAGE_UNITS = [
  'microvolt',
  'millivolt',
  'volt',
  'kilovolt',
  'megavolt',
] as const;
export type VoltageUnit = (typeof VOLTAGE_UNITS)[number];

/** Multiply unit value by this factor to obtain volts. */
export const VOLTAGE_TO_VOLTS: Record<VoltageUnit, number> = {
  microvolt: 1e-6,
  millivolt: 0.001,
  volt: 1,
  kilovolt: 1_000,
  megavolt: 1_000_000,
};

export const VOLTAGE_UNIT_SYMBOLS: Record<VoltageUnit, string> = {
  microvolt: 'μV',
  millivolt: 'mV',
  volt: 'V',
  kilovolt: 'kV',
  megavolt: 'MV',
};

export type JoulesToVoltsFieldErrors = {
  energy?: string;
  charge?: string;
  voltage?: string;
};

export const MAX_ABS = 1e30;
