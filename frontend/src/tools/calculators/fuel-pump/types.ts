/**
 * Fuel pump demand estimate (educational).
 * ṁ = HP × BSFC (lb/hr)
 * Q_L/hr = (HP × BSFC × 0.45359237) / ρ_kg/L
 * Manifold-referenced 1:1: P_rail = P_base + P_boost
 * Fixed rail: P_rail = P_base
 * BSFC/density are labeled estimates — not measured maps or OEM pump curves.
 */

export type FuelType =
  | 'gasoline'
  | 'diesel'
  | 'e85'
  | 'ethanol'
  | 'methanol'
  | 'custom';

export type InductionType =
  | 'naturallyAspirated'
  | 'turbocharged'
  | 'supercharged'
  | 'custom';

export type FuelSystemType = 'return' | 'returnless';
export type PressureControlMode =
  | 'manifoldReferenced'
  | 'fixedRail'
  | 'electronic'
  | 'custom';

export type PowerUnit = 'hp' | 'kW' | 'PS';
export type PressureUnit = 'bar' | 'psi' | 'kPa';
export type FlowUnit =
  | 'L/hr'
  | 'L/min'
  | 'mL/min'
  | 'cc/min'
  | 'galUS/hr'
  | 'galUS/min'
  | 'lb/hr'
  | 'kg/hr';

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  gasoline: 'Petrol / Gasoline',
  diesel: 'Diesel',
  e85: 'E85',
  ethanol: 'Ethanol',
  methanol: 'Methanol',
  custom: 'Custom fuel',
};

export const INDUCTION_LABELS: Record<InductionType, string> = {
  naturallyAspirated: 'Naturally aspirated',
  turbocharged: 'Turbocharged',
  supercharged: 'Supercharged',
  custom: 'Custom',
};

export const SYSTEM_LABELS: Record<FuelSystemType, string> = {
  return: 'Return',
  returnless: 'Returnless',
};

export const PRESSURE_MODE_LABELS: Record<PressureControlMode, string> = {
  manifoldReferenced: 'Manifold-referenced 1:1',
  fixedRail: 'Fixed rail pressure',
  electronic: 'Electronically controlled',
  custom: 'Custom configuration',
};

export const POWER_UNIT_LABELS: Record<PowerUnit, string> = {
  hp: 'hp',
  kW: 'kW',
  PS: 'PS',
};

export const PRESSURE_UNIT_LABELS: Record<PressureUnit, string> = {
  bar: 'bar',
  psi: 'psi',
  kPa: 'kPa',
};

export const FLOW_UNIT_LABELS: Record<FlowUnit, string> = {
  'L/hr': 'L/hr',
  'L/min': 'L/min',
  'mL/min': 'mL/min',
  'cc/min': 'cc/min',
  'galUS/hr': 'US gal/hr',
  'galUS/min': 'US gal/min',
  'lb/hr': 'lb/hr',
  'kg/hr': 'kg/hr',
};

/** Estimated density kg/L (~15 °C) — illustrative (= g/mL numerically). */
export const FUEL_DENSITY_KG_PER_L: Record<Exclude<FuelType, 'custom'>, number> =
  {
    gasoline: 0.745,
    diesel: 0.832,
    e85: 0.781,
    ethanol: 0.789,
    methanol: 0.792,
  };

export const SUGGESTED_BSFC: Record<
  Exclude<FuelType, 'custom'>,
  Record<Exclude<InductionType, 'custom'>, number>
> = {
  gasoline: {
    naturallyAspirated: 0.5,
    turbocharged: 0.55,
    supercharged: 0.55,
  },
  diesel: {
    naturallyAspirated: 0.4,
    turbocharged: 0.38,
    supercharged: 0.4,
  },
  e85: {
    naturallyAspirated: 0.65,
    turbocharged: 0.7,
    supercharged: 0.7,
  },
  ethanol: {
    naturallyAspirated: 0.65,
    turbocharged: 0.72,
    supercharged: 0.7,
  },
  methanol: {
    naturallyAspirated: 0.9,
    turbocharged: 1.0,
    supercharged: 0.95,
  },
};

export interface FuelPumpCurvePoint {
  pressureBar: number;
  flowLitersPerHour: number;
}

export interface FuelPumpInput {
  power: string;
  powerUnit: PowerUnit;
  inductionType: InductionType;
  fuelType: FuelType;
  bsfc: string;
  bsfcManual: boolean;
  fuelDensity: string;
  densityManual: boolean;
  baseFuelPressure: string;
  boostPressure: string;
  pressureUnit: PressureUnit;
  fuelSystemType: FuelSystemType;
  pressureControlMode: PressureControlMode;
  pressureModeManual: boolean;
  pressureLoss: string;
  safetyMarginPercent: string;
  resultFlowUnit: FlowUnit;
  resultPressureUnit: PressureUnit;
  /** Optional manufacturer curve as "pressure,flow;pressure,flow" in bar & L/hr */
  pumpCurveRaw: string;
}

export interface FuelPumpResult {
  horsepower: number;
  bsfcUsed: number;
  densityUsed: number;
  fuelMassFlowLbPerHour: number;
  fuelMassFlowKgPerHour: number;
  requiredFuelFlowLitersPerHour: number;
  targetPumpFlowLitersPerHour: number;
  formattedFlow: string;
  fuelRailPressureBar: number;
  injectorDifferentialPressureBar: number | null;
  estimatedPumpOutletPressureBar: number;
  formattedRailPressure: string;
  formattedOutletPressure: string;
  manufacturerPumpFlowAtPressure: number | null;
  pumpCapacitySufficient: boolean | null;
  pumpCurveWarning: string | null;
  formulaSteps: string[];
  interpretation: string;
}

export type FuelPumpFieldErrors = {
  power?: string;
  bsfc?: string;
  fuelDensity?: string;
  baseFuelPressure?: string;
  boostPressure?: string;
  pressureLoss?: string;
  safetyMarginPercent?: string;
  pumpCurveRaw?: string;
  form?: string;
};

export function suggestedBsfc(
  fuel: FuelType,
  induction: InductionType,
): number {
  if (fuel === 'custom' || induction === 'custom') return 0.5;
  return SUGGESTED_BSFC[fuel][induction];
}

export function suggestedDensity(fuel: FuelType): number {
  if (fuel === 'custom') return 0.745;
  return FUEL_DENSITY_KG_PER_L[fuel];
}

export function defaultPressureMode(
  system: FuelSystemType,
): PressureControlMode {
  return system === 'returnless' ? 'fixedRail' : 'manifoldReferenced';
}

export function createEmptyInput(): FuelPumpInput {
  return {
    power: '300',
    powerUnit: 'hp',
    inductionType: 'naturallyAspirated',
    fuelType: 'gasoline',
    bsfc: '0.5',
    bsfcManual: false,
    fuelDensity: String(FUEL_DENSITY_KG_PER_L.gasoline),
    densityManual: false,
    baseFuelPressure: '3',
    boostPressure: '0',
    pressureUnit: 'bar',
    fuelSystemType: 'return',
    pressureControlMode: 'manifoldReferenced',
    pressureModeManual: false,
    pressureLoss: '0',
    safetyMarginPercent: '0',
    resultFlowUnit: 'L/hr',
    resultPressureUnit: 'bar',
    pumpCurveRaw: '',
  };
}

export function createExampleBoosted(): FuelPumpInput {
  return {
    ...createEmptyInput(),
    power: '400',
    inductionType: 'turbocharged',
    bsfc: String(SUGGESTED_BSFC.gasoline.turbocharged),
    boostPressure: '1',
  };
}
