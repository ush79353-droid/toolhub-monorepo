/**
 * Fuel injector sizing (educational estimate).
 * IFR (lb/hr) = (HP × BSFC) / (N × DC)
 * Pressure adjust: Q2 = Q1 × √(ΔP2/ΔP1)
 * BSFC and density values are labeled engineering estimates — not measured engine data.
 */

export type FuelType =
  | 'gasoline'
  | 'diesel'
  | 'e85'
  | 'ethanol'
  | 'methanol'
  | 'custom';

export type AspirationType =
  | 'naturallyAspirated'
  | 'turbocharged'
  | 'supercharged'
  | 'custom';

export type PowerUnit = 'hp' | 'kW' | 'PS';
export type PressureUnit = 'bar' | 'psi' | 'kPa';
export type InjectorFlowUnit = 'lb/hr' | 'g/min' | 'kg/hr' | 'cc/min' | 'mL/min';

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  gasoline: 'Gasoline',
  diesel: 'Diesel',
  e85: 'E85',
  ethanol: 'Ethanol',
  methanol: 'Methanol',
  custom: 'Custom fuel',
};

export const ASPIRATION_LABELS: Record<AspirationType, string> = {
  naturallyAspirated: 'Naturally aspirated',
  turbocharged: 'Turbocharged',
  supercharged: 'Supercharged',
  custom: 'Custom',
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

export const FLOW_UNIT_LABELS: Record<InjectorFlowUnit, string> = {
  'lb/hr': 'lb/hr',
  'g/min': 'g/min',
  'kg/hr': 'kg/hr',
  'cc/min': 'cc/min',
  'mL/min': 'mL/min',
};

/** Estimated fuel density g/mL (~15 °C) — illustrative. */
export const FUEL_DENSITY_G_PER_ML: Record<Exclude<FuelType, 'custom'>, number> =
  {
    gasoline: 0.745,
    diesel: 0.832,
    e85: 0.781,
    ethanol: 0.789,
    methanol: 0.792,
  };

/**
 * Suggested BSFC lb/(hp·hr) by fuel × aspiration — engineering estimates only.
 * Forced induction often needs richer/more fuel per hp in sizing rules of thumb.
 */
export const SUGGESTED_BSFC: Record<
  Exclude<FuelType, 'custom'>,
  Record<Exclude<AspirationType, 'custom'>, number>
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

export interface FuelInjectorInput {
  fuelType: FuelType;
  aspiration: AspirationType;
  engineHorsepower: string;
  targetHorsepower: string;
  horsepowerUnit: PowerUnit;
  numberOfCylinders: string;
  numberOfInjectors: string;
  injectorCountLockedToCylinders: boolean;
  fuelPressure: string;
  fuelPressureUnit: PressureUnit;
  maxDutyCycle: string;
  bsfc: string;
  bsfcManual: boolean;
  fuelDensity: string;
  densityManual: boolean;
  referenceDifferentialPressure: string;
  actualDifferentialPressure: string;
  pressureUnit: PressureUnit;
  existingInjectorFlow: string;
  existingInjectorFlowUnit: InjectorFlowUnit;
  resultFlowUnit: InjectorFlowUnit;
}

export interface FuelInjectorResult {
  horsepowerUsed: number;
  horsepowerSource: 'engine' | 'target';
  bsfcUsed: number;
  injectorCount: number;
  dutyCycleDecimal: number;
  totalFuelMassFlowLbPerHour: number;
  requiredFlowLbPerHour: number;
  requiredFlowDisplay: string;
  requiredFlowCcPerMinute: number | null;
  densityUsed: number;
  pressureAdjustedFlowLbPerHour: number | null;
  existingInjectorRequiredDutyCyclePercent: number | null;
  existingExceedsMax: boolean | null;
  formulaSteps: string[];
  interpretation: string;
}

export type FuelInjectorFieldErrors = {
  engineHorsepower?: string;
  targetHorsepower?: string;
  numberOfCylinders?: string;
  numberOfInjectors?: string;
  fuelPressure?: string;
  maxDutyCycle?: string;
  bsfc?: string;
  fuelDensity?: string;
  referenceDifferentialPressure?: string;
  actualDifferentialPressure?: string;
  existingInjectorFlow?: string;
  form?: string;
};

export function suggestedBsfc(
  fuel: FuelType,
  aspiration: AspirationType,
): number {
  if (fuel === 'custom' || aspiration === 'custom') return 0.5;
  return SUGGESTED_BSFC[fuel][aspiration];
}

export function suggestedDensity(fuel: FuelType): number {
  if (fuel === 'custom') return 0.745;
  return FUEL_DENSITY_G_PER_ML[fuel];
}

export function createEmptyInput(): FuelInjectorInput {
  return {
    fuelType: 'gasoline',
    aspiration: 'naturallyAspirated',
    engineHorsepower: '300',
    targetHorsepower: '400',
    horsepowerUnit: 'hp',
    numberOfCylinders: '8',
    numberOfInjectors: '8',
    injectorCountLockedToCylinders: true,
    fuelPressure: '3',
    fuelPressureUnit: 'bar',
    maxDutyCycle: '80',
    bsfc: '0.5',
    bsfcManual: false,
    fuelDensity: String(FUEL_DENSITY_G_PER_ML.gasoline),
    densityManual: false,
    referenceDifferentialPressure: '3',
    actualDifferentialPressure: '3',
    pressureUnit: 'bar',
    existingInjectorFlow: '',
    existingInjectorFlowUnit: 'lb/hr',
    resultFlowUnit: 'lb/hr',
  };
}

export function createExampleFourCylinder(): FuelInjectorInput {
  return {
    ...createEmptyInput(),
    engineHorsepower: '200',
    targetHorsepower: '',
    numberOfCylinders: '4',
    numberOfInjectors: '4',
    bsfc: '0.5',
  };
}
