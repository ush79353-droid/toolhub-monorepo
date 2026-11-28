/**
 * Turbo Size Calculator — estimated airflow sizing heuristic + optional advanced.
 * Simplified: ṁ ≈ HP / C (default C = 10 hp per lb/min). Not an exact turbo model picker.
 */

export type CapacityUnit = 'cc' | 'L' | 'cu-in';
export type PowerUnit = 'hp' | 'kW' | 'PS';
export type AirflowUnit = 'lb/min' | 'kg/min' | 'g/s';
export type PressureUnit = 'kPa' | 'bar' | 'psi';
export type TemperatureUnit = 'C' | 'F' | 'K';

export const CAPACITY_UNIT_LABELS: Record<CapacityUnit, string> = {
  cc: 'cc',
  L: 'L',
  'cu-in': 'cu in',
};

export const POWER_UNIT_LABELS: Record<PowerUnit, string> = {
  hp: 'hp',
  kW: 'kW',
  PS: 'PS',
};

export const PRESSURE_UNIT_LABELS: Record<PressureUnit, string> = {
  kPa: 'kPa',
  bar: 'bar',
  psi: 'psi',
};

export const TEMP_UNIT_LABELS: Record<TemperatureUnit, string> = {
  C: '°C',
  F: '°F',
  K: 'K',
};

/** Default sizing heuristic — editable assumption, not a physical law. */
export const DEFAULT_HP_PER_LB_MIN = 10;

export interface TurboExample {
  id: string;
  label: string;
  capacityL: number;
  powerHp: number;
  note: string;
}

export const TURBO_EXAMPLES: readonly TurboExample[] = [
  {
    id: 'a',
    label: '2.0 L · 250 hp',
    capacityL: 2,
    powerHp: 250,
    note: 'Illustrative ≈ 25 lb/min @ 10 hp/(lb/min)',
  },
  {
    id: 'b',
    label: '2.5 L · 350 hp',
    capacityL: 2.5,
    powerHp: 350,
    note: 'Illustrative ≈ 35 lb/min @ 10 hp/(lb/min)',
  },
  {
    id: 'c',
    label: '3.0 L · 450 hp',
    capacityL: 3,
    powerHp: 450,
    note: 'Illustrative ≈ 45 lb/min @ 10 hp/(lb/min)',
  },
  {
    id: 'd',
    label: '4.0 L · 600 hp',
    capacityL: 4,
    powerHp: 600,
    note: 'Illustrative ≈ 60 lb/min @ 10 hp/(lb/min)',
  },
];

export interface TurboSizeInput {
  engineCapacity: string;
  engineCapacityUnit: CapacityUnit;
  desiredPower: string;
  desiredPowerUnit: PowerUnit;
  horsepowerPerLbMin: string;
  advancedMode: boolean;
  engineRPM: string;
  volumetricEfficiency: string;
  intakeManifoldPressure: string;
  intakePressureUnit: PressureUnit;
  compressorInletPressure: string;
  inletPressureUnit: PressureUnit;
  intakeTemperature: string;
  intakeTempUnit: TemperatureUnit;
  compressorInletTemperature: string;
  inletTempUnit: TemperatureUnit;
  compressorEfficiency: string;
}

export interface TurboSizeResult {
  engineCapacityLiters: number;
  desiredHorsepower: number;
  horsepowerPerLbMin: number;
  requiredAirflowLbMin: number;
  requiredAirflowKgMin: number;
  horsepowerPerLiter: number;
  volumetricAirflowM3PerS: number | null;
  actualAirflowKgPerS: number | null;
  actualAirflowLbMin: number | null;
  compressorPressureRatio: number | null;
  correctedAirflowLbMin: number | null;
  estimatedHpFromAdvancedAirflow: number | null;
  formulaSteps: string[];
  interpretation: string;
  requiredAirflowDisplay: string;
  powerDensityDisplay: string;
}

export type TurboSizeFieldErrors = {
  engineCapacity?: string;
  desiredPower?: string;
  horsepowerPerLbMin?: string;
  engineRPM?: string;
  volumetricEfficiency?: string;
  intakeManifoldPressure?: string;
  compressorInletPressure?: string;
  intakeTemperature?: string;
  compressorInletTemperature?: string;
  compressorEfficiency?: string;
  form?: string;
};

/** Spec fixture: 2.0 L · 400 hp → 40 lb/min · 200 hp/L */
export function createEmptyInput(): TurboSizeInput {
  return {
    engineCapacity: '2',
    engineCapacityUnit: 'L',
    desiredPower: '400',
    desiredPowerUnit: 'hp',
    horsepowerPerLbMin: String(DEFAULT_HP_PER_LB_MIN),
    advancedMode: false,
    engineRPM: '6000',
    volumetricEfficiency: '90',
    intakeManifoldPressure: '200',
    intakePressureUnit: 'kPa',
    compressorInletPressure: '101.325',
    inletPressureUnit: 'kPa',
    intakeTemperature: '40',
    intakeTempUnit: 'C',
    compressorInletTemperature: '25',
    inletTempUnit: 'C',
    compressorEfficiency: '70',
  };
}

export function createBlankInput(): TurboSizeInput {
  return {
    engineCapacity: '',
    engineCapacityUnit: 'cc',
    desiredPower: '',
    desiredPowerUnit: 'hp',
    horsepowerPerLbMin: String(DEFAULT_HP_PER_LB_MIN),
    advancedMode: false,
    engineRPM: '',
    volumetricEfficiency: '',
    intakeManifoldPressure: '',
    intakePressureUnit: 'kPa',
    compressorInletPressure: '',
    inletPressureUnit: 'kPa',
    intakeTemperature: '',
    intakeTempUnit: 'C',
    compressorInletTemperature: '',
    inletTempUnit: 'C',
    compressorEfficiency: '',
  };
}
