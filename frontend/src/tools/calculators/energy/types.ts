/**
 * Energy units with joules-per-unit factors.
 * Hartree / Rydberg: CODATA 2018 recommended values.
 * Therm: US therm. BTU: International Table (IT).
 */
export const ENERGY_UNITS = [
  'joule',
  'kilocalorie',
  'wattHour',
  'kilowattHour',
  'therm',
  'tonTnt',
  'kilotonTnt',
  'megatonTnt',
  'electronvolt',
  'kiloelectronvolt',
  'megaelectronvolt',
  'gigaelectronvolt',
  'hartree',
  'rydberg',
  'kilojoule',
  'megajoule',
  'gigajoule',
  'calorie',
  'btu',
  'footPoundForce',
  'erg',
] as const;

export type EnergyUnit = (typeof ENERGY_UNITS)[number];

export type EnergyFieldErrors = Partial<Record<EnergyUnit, string>>;

/** Multiply unit value by this factor to obtain joules. */
export const ENERGY_TO_JOULES: Record<EnergyUnit, number> = {
  joule: 1,
  kilocalorie: 4184,
  wattHour: 3600,
  kilowattHour: 3_600_000,
  therm: 105_505_585.257348,
  tonTnt: 4.184e9,
  kilotonTnt: 4.184e12,
  megatonTnt: 4.184e15,
  electronvolt: 1.602176634e-19,
  kiloelectronvolt: 1.602176634e-16,
  megaelectronvolt: 1.602176634e-13,
  gigaelectronvolt: 1.602176634e-10,
  hartree: 4.3597447222071e-18,
  rydberg: 2.1798723611035e-18,
  kilojoule: 1_000,
  megajoule: 1_000_000,
  gigajoule: 1_000_000_000,
  calorie: 4.184,
  btu: 1055.05585262,
  footPoundForce: 1.3558179483314004,
  erg: 1e-7,
};

export const ENERGY_UNIT_SYMBOLS: Record<EnergyUnit, string> = {
  joule: 'J',
  kilocalorie: 'kcal',
  wattHour: 'Wh',
  kilowattHour: 'kWh',
  therm: 'thm',
  tonTnt: 'ton TNT',
  kilotonTnt: 'kt TNT',
  megatonTnt: 'Mt TNT',
  electronvolt: 'eV',
  kiloelectronvolt: 'keV',
  megaelectronvolt: 'MeV',
  gigaelectronvolt: 'GeV',
  hartree: 'Eh',
  rydberg: 'Ry',
  kilojoule: 'kJ',
  megajoule: 'MJ',
  gigajoule: 'GJ',
  calorie: 'cal',
  btu: 'BTU',
  footPoundForce: 'ft·lbf',
  erg: 'erg',
};

export const ENERGY_FIELD_LABELS: Record<EnergyUnit, string> = {
  joule: 'Joule',
  kilocalorie: 'Calories (kcal)',
  wattHour: 'Watt-hour',
  kilowattHour: 'Kilowatt-hour',
  therm: 'Therm (US)',
  tonTnt: 'Ton of TNT',
  kilotonTnt: 'Kiloton of TNT',
  megatonTnt: 'Megaton of TNT',
  electronvolt: 'Electronvolt',
  kiloelectronvolt: 'Kiloelectronvolt',
  megaelectronvolt: 'Megaelectronvolt',
  gigaelectronvolt: 'Gigaelectronvolt',
  hartree: 'Hartree energy',
  rydberg: 'Rydberg energy',
  kilojoule: 'Kilojoule',
  megajoule: 'Megajoule',
  gigajoule: 'Gigajoule',
  calorie: 'Calorie (thermochemical)',
  btu: 'British thermal unit (IT)',
  footPoundForce: 'Foot-pound force',
  erg: 'Erg',
};

export const SI_UNITS: readonly EnergyUnit[] = ['joule'];

export const LARGE_UNITS: readonly EnergyUnit[] = [
  'kilocalorie',
  'wattHour',
  'kilowattHour',
  'therm',
  'tonTnt',
  'kilotonTnt',
  'megatonTnt',
];

export const MICROSCOPIC_UNITS: readonly EnergyUnit[] = [
  'electronvolt',
  'kiloelectronvolt',
  'megaelectronvolt',
  'gigaelectronvolt',
  'hartree',
  'rydberg',
];

export const OTHER_UNITS: readonly EnergyUnit[] = [
  'kilojoule',
  'megajoule',
  'gigajoule',
  'calorie',
  'btu',
  'footPoundForce',
  'erg',
];

export const MAX_ABS_JOULES = 1e40;
