export const VOLUME_UNITS = [
  'ft3',
  'ccf',
  'mcf',
  'm3',
  'thousand_m3',
  'in3',
  'yd3',
  'L',
  'gal',
] as const;

export const ENERGY_UNITS = [
  'btu_it',
  'kbtu',
  'mmbtu',
  'therm',
  'ktherm',
  'J',
  'kJ',
  'MJ',
  'GJ',
  'kWh',
  'MWh',
] as const;

export const HEATING_UNITS = ['btu_ft3', 'mj_m3', 'kwh_m3'] as const;

export type VolumeUnit = (typeof VOLUME_UNITS)[number];
export type EnergyUnit = (typeof ENERGY_UNITS)[number];
export type HeatingUnit = (typeof HEATING_UNITS)[number];
export type NaturalGasField = 'volume' | 'energy' | 'heating';

export type NaturalGasFieldErrors = Partial<Record<NaturalGasField, string>>;

/** Exact international foot → cubic metre. */
export const M3_PER_FT3 = 0.028316846592;
export const FT3_PER_CCF = 100;
export const FT3_PER_MCF = 1000;
export const IN3_PER_FT3 = 1728;
export const FT3_PER_YD3 = 27;
export const M3_PER_L = 0.001;
export const M3_PER_US_GAL = 0.003785411784;

/** International Table BTU. */
export const J_PER_BTU_IT = 1055.05585262;
export const BTU_PER_THERM = 100_000;
export const BTU_PER_KBTU = 1000;
export const BTU_PER_MMBTU = 1_000_000;
export const BTU_PER_KTHERM = 100_000_000;
export const J_PER_KWH = 3_600_000;

/** Illustrative default — not a universal utility rate. */
export const DEFAULT_HEATING_BTU_PER_FT3 = 1038;
export const DEFAULT_VOLUME = 100;
export const DEFAULT_VOLUME_UNIT: VolumeUnit = 'ccf';
export const DEFAULT_ENERGY_UNIT: EnergyUnit = 'therm';
export const DEFAULT_HEATING_UNIT: HeatingUnit = 'btu_ft3';
export const MAX_ABS_VALUE = 1e18;

export interface UnitDef<T extends string> {
  id: T;
  label: string;
  symbol: string;
}

export const VOLUME_UNIT_DEFS: Record<VolumeUnit, UnitDef<VolumeUnit>> = {
  ft3: { id: 'ft3', label: 'Cubic foot', symbol: 'ft³' },
  ccf: { id: 'ccf', label: 'Hundred cubic feet', symbol: 'CCF' },
  mcf: { id: 'mcf', label: 'Thousand cubic feet', symbol: 'MCF' },
  m3: { id: 'm3', label: 'Cubic meter', symbol: 'm³' },
  thousand_m3: { id: 'thousand_m3', label: 'Thousand cubic meters', symbol: '10³ m³' },
  in3: { id: 'in3', label: 'Cubic inch', symbol: 'in³' },
  yd3: { id: 'yd3', label: 'Cubic yard', symbol: 'yd³' },
  L: { id: 'L', label: 'Liter', symbol: 'L' },
  gal: { id: 'gal', label: 'US gallon', symbol: 'gal' },
};

export const ENERGY_UNIT_DEFS: Record<EnergyUnit, UnitDef<EnergyUnit>> = {
  btu_it: { id: 'btu_it', label: 'British thermal unit (IT)', symbol: 'BTU_IT' },
  kbtu: { id: 'kbtu', label: 'Thousand BTU', symbol: 'kBTU' },
  mmbtu: { id: 'mmbtu', label: 'Million BTU', symbol: 'MMBTU' },
  therm: { id: 'therm', label: 'Therm', symbol: 'therm' },
  ktherm: { id: 'ktherm', label: 'Kilotherm', symbol: 'ktherm' },
  J: { id: 'J', label: 'Joule', symbol: 'J' },
  kJ: { id: 'kJ', label: 'Kilojoule', symbol: 'kJ' },
  MJ: { id: 'MJ', label: 'Megajoule', symbol: 'MJ' },
  GJ: { id: 'GJ', label: 'Gigajoule', symbol: 'GJ' },
  kWh: { id: 'kWh', label: 'Kilowatt-hour', symbol: 'kWh' },
  MWh: { id: 'MWh', label: 'Megawatt-hour', symbol: 'MWh' },
};

export const HEATING_UNIT_DEFS: Record<HeatingUnit, UnitDef<HeatingUnit>> = {
  btu_ft3: { id: 'btu_ft3', label: 'BTU per cubic foot', symbol: 'BTU/ft³' },
  mj_m3: { id: 'mj_m3', label: 'Megajoule per cubic meter', symbol: 'MJ/m³' },
  kwh_m3: { id: 'kwh_m3', label: 'Kilowatt-hour per cubic meter', symbol: 'kWh/m³' },
};

/** Cubic metres per 1 unit of volume. */
export const M3_PER_VOLUME: Record<VolumeUnit, number> = {
  ft3: M3_PER_FT3,
  ccf: FT3_PER_CCF * M3_PER_FT3,
  mcf: FT3_PER_MCF * M3_PER_FT3,
  m3: 1,
  thousand_m3: 1000,
  in3: M3_PER_FT3 / IN3_PER_FT3,
  yd3: FT3_PER_YD3 * M3_PER_FT3,
  L: M3_PER_L,
  gal: M3_PER_US_GAL,
};

/** Joules per 1 unit of energy. */
export const J_PER_ENERGY: Record<EnergyUnit, number> = {
  btu_it: J_PER_BTU_IT,
  kbtu: BTU_PER_KBTU * J_PER_BTU_IT,
  mmbtu: BTU_PER_MMBTU * J_PER_BTU_IT,
  therm: BTU_PER_THERM * J_PER_BTU_IT,
  ktherm: BTU_PER_KTHERM * J_PER_BTU_IT,
  J: 1,
  kJ: 1000,
  MJ: 1_000_000,
  GJ: 1_000_000_000,
  kWh: J_PER_KWH,
  MWh: J_PER_KWH * 1000,
};
