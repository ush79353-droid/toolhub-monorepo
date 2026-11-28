/**
 * BSFC / brake thermal efficiency (educational).
 * η_b(%) = 360000 / (BSFC_g_per_kWh × LHV_MJ_per_kg)
 * Fuel mass flow = BSFC × Power (with consistent units).
 */

export type BSFCCalculationMode =
  | 'efficiency'
  | 'bsfc'
  | 'fuelConsumption'
  | 'enginePower';

export type PowerUnit = 'W' | 'kW' | 'MW' | 'hp' | 'PS';

export type BSFCUnit =
  | 'g/kWh'
  | 'kg/kWh'
  | 'lb/hph'
  | 'g/hph'
  | 'kg/J'
  | 'kg/MJ';

export type FuelType =
  | 'gasoline'
  | 'diesel'
  | 'ethanol'
  | 'methanol'
  | 'lpg'
  | 'naturalGas'
  | 'hydrogen'
  | 'custom';

export type LHVUnit = 'MJ/kg' | 'kJ/kg' | 'J/kg' | 'BTU/lb';
export type DensityUnit = 'kg/L' | 'g/mL' | 'lb/gal';
export type MassFlowUnit = 'g/h' | 'kg/h' | 'g/s' | 'kg/s' | 'lb/h' | 'g/min';

export const POWER_UNIT_LABELS: Record<PowerUnit, string> = {
  W: 'W',
  kW: 'kW',
  MW: 'MW',
  hp: 'hp',
  PS: 'PS',
};

export const BSFC_UNIT_LABELS: Record<BSFCUnit, string> = {
  'g/kWh': 'g/(kW·h)',
  'kg/kWh': 'kg/(kW·h)',
  'lb/hph': 'lb/(hp·h)',
  'g/hph': 'g/(hp·h)',
  'kg/J': 'kg/J',
  'kg/MJ': 'kg/MJ',
};

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  gasoline: 'Gasoline',
  diesel: 'Diesel',
  ethanol: 'Ethanol',
  methanol: 'Methanol',
  lpg: 'LPG',
  naturalGas: 'CNG / Natural Gas',
  hydrogen: 'Hydrogen',
  custom: 'Custom Fuel',
};

/** Representative LHV assumptions (MJ/kg) — composition varies. */
export const FUEL_LHV_MJ_PER_KG: Record<Exclude<FuelType, 'custom'>, number> = {
  gasoline: 43.4,
  diesel: 42.7,
  ethanol: 26.8,
  methanol: 19.9,
  lpg: 46.0,
  naturalGas: 50.0,
  hydrogen: 120.0,
};

/** Optional default densities (kg/L) for volume flow — custom must supply. */
export const FUEL_DENSITY_KG_PER_L: Partial<
  Record<Exclude<FuelType, 'custom'>, number>
> = {
  gasoline: 0.74,
  diesel: 0.84,
  ethanol: 0.789,
  methanol: 0.792,
  lpg: 0.54,
};

export const LHV_UNIT_LABELS: Record<LHVUnit, string> = {
  'MJ/kg': 'MJ/kg',
  'kJ/kg': 'kJ/kg',
  'J/kg': 'J/kg',
  'BTU/lb': 'BTU/lb',
};

export const DENSITY_UNIT_LABELS: Record<DensityUnit, string> = {
  'kg/L': 'kg/L',
  'g/mL': 'g/mL',
  'lb/gal': 'lb/gal (US)',
};

export const MASS_FLOW_UNIT_LABELS: Record<MassFlowUnit, string> = {
  'g/h': 'g/h',
  'kg/h': 'kg/h',
  'g/s': 'g/s',
  'kg/s': 'kg/s',
  'lb/h': 'lb/h',
  'g/min': 'g/min',
};

export interface EfficiencyChartPoint {
  bsfcGPerKWh: number;
  efficiencyPercent: number;
}

export interface FuelConsumptionChartPoint {
  powerKW: number;
  fuelKgPerHour: number;
}

export interface BSFCInput {
  mode: BSFCCalculationMode;
  power: string;
  powerUnit: PowerUnit;
  bsfc: string;
  bsfcUnit: BSFCUnit;
  fuelType: FuelType;
  customLHV: string;
  lhvUnit: LHVUnit;
  efficiency: string;
  fuelMassFlow: string;
  massFlowUnit: MassFlowUnit;
  customDensity: string;
  densityUnit: DensityUnit;
  enableVolume: boolean;
}

export interface BSFCResult {
  mode: BSFCCalculationMode;
  powerKW: number | null;
  bsfcGPerKWh: number;
  fuelType: FuelType;
  fuelLHV_MJPerKg: number;
  brakeThermalEfficiencyPercent: number;
  fuelConsumptionKgPerHour: number | null;
  fuelEnergyInputMJPerHour: number | null;
  usefulEnergyOutputMJPerHour: number | null;
  volumetricConsumptionLPerHour: number | null;
  efficiencyWarning: string | null;
  formulaSteps: string[];
  efficiencyChart: EfficiencyChartPoint[];
  fuelChart: FuelConsumptionChartPoint[];
  interpretation: string;
  formattedPrimary: string;
  primaryLabel: string;
}

export type BSFCFieldErrors = {
  power?: string;
  bsfc?: string;
  customLHV?: string;
  efficiency?: string;
  fuelMassFlow?: string;
  customDensity?: string;
  form?: string;
};

export function createEmptyInput(): BSFCInput {
  return {
    mode: 'efficiency',
    power: '',
    powerUnit: 'kW',
    bsfc: '',
    bsfcUnit: 'g/kWh',
    fuelType: 'gasoline',
    customLHV: '',
    lhvUnit: 'MJ/kg',
    efficiency: '',
    fuelMassFlow: '',
    massFlowUnit: 'kg/h',
    customDensity: '',
    densityUnit: 'kg/L',
    enableVolume: false,
  };
}

export function createExampleInput(): BSFCInput {
  return {
    mode: 'efficiency',
    power: '100',
    powerUnit: 'kW',
    bsfc: '250',
    bsfcUnit: 'g/kWh',
    fuelType: 'gasoline',
    customLHV: '',
    lhvUnit: 'MJ/kg',
    efficiency: '',
    fuelMassFlow: '',
    massFlowUnit: 'kg/h',
    customDensity: '',
    densityUnit: 'kg/L',
    enableVolume: false,
  };
}
