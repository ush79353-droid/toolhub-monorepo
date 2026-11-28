/**
 * Quarter-mile horsepower estimates (educational / empirical).
 * ET:  HP = W / (ET / 5.825)^3   (W in lb, ET in s)
 * Trap: HP = W × (V / 234)^3     (V in mph)
 * Not a dynamometer measurement.
 */

export type HorsepowerMethod = 'elapsedTime' | 'trapSpeed';
export type VehicleWeightUnit = 'lb' | 'kg' | 'metricTon' | 'shortTon';
export type TrapSpeedUnit = 'mph' | 'km/h' | 'm/s';
export type HorsepowerOutputUnit = 'hp' | 'PS' | 'W' | 'kW';

export const ET_CONSTANT = 5.825;
export const TRAP_CONSTANT = 234;

export const METHOD_LABELS: Record<HorsepowerMethod, string> = {
  elapsedTime: 'Elapsed time',
  trapSpeed: 'Trap speed',
};

export const WEIGHT_UNIT_LABELS: Record<VehicleWeightUnit, string> = {
  lb: 'lb',
  kg: 'kg',
  metricTon: 't (metric)',
  shortTon: 'ton (US)',
};

export const TRAP_SPEED_UNIT_LABELS: Record<TrapSpeedUnit, string> = {
  mph: 'mph',
  'km/h': 'km/h',
  'm/s': 'm/s',
};

export const HP_OUTPUT_UNIT_LABELS: Record<HorsepowerOutputUnit, string> = {
  hp: 'hp',
  PS: 'PS',
  W: 'W',
  kW: 'kW',
};

export interface HorsepowerInput {
  method: HorsepowerMethod;
  vehicleWeight: string;
  vehicleWeightUnit: VehicleWeightUnit;
  quarterMileTime: string;
  trapSpeed: string;
  trapSpeedUnit: TrapSpeedUnit;
  outputUnit: HorsepowerOutputUnit;
}

export interface HorsepowerResult {
  method: HorsepowerMethod;
  vehicleWeightLb: number;
  quarterMileTimeSeconds: number | null;
  trapSpeedMph: number | null;
  estimatedHorsepowerHp: number;
  metricHorsepowerPs: number;
  watts: number;
  kilowatts: number;
  displayValue: number;
  displayUnit: HorsepowerOutputUnit;
  formulaSteps: string[];
  interpretation: string;
  formattedPrimary: string;
}

export type HorsepowerFieldErrors = {
  vehicleWeight?: string;
  quarterMileTime?: string;
  trapSpeed?: string;
  form?: string;
};

export function createEmptyInput(): HorsepowerInput {
  return {
    method: 'elapsedTime',
    vehicleWeight: '3500',
    vehicleWeightUnit: 'lb',
    quarterMileTime: '13.5',
    trapSpeed: '105',
    trapSpeedUnit: 'mph',
    outputUnit: 'hp',
  };
}

export function createExampleElapsedTime(): HorsepowerInput {
  return createEmptyInput();
}

export function createExampleTrapSpeed(): HorsepowerInput {
  return {
    ...createEmptyInput(),
    method: 'trapSpeed',
    trapSpeed: '105',
  };
}
