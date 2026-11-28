/**
 * Ideal boost horsepower model (educational):
 *   HP_boosted = HP_current × (P_boost + P_atm) / P_atm
 * Default P_atm ≈ 14.7 psi (standard atmosphere ≈ 14.6959 psi).
 * Assumes roughly unchanged VE, charge temp, AFR, and efficiencies — not a dyno guarantee.
 */

export type BoostCalculationMode =
  | 'boostedHorsepower'
  | 'requiredBoost'
  | 'originalHorsepower';

export type HorsepowerUnit = 'hp' | 'PS' | 'kW' | 'W';
export type PressureUnit = 'psi' | 'kPa' | 'bar' | 'mbar' | 'Pa';

export const DEFAULT_ATMOSPHERIC_PSI = 14.7;
export const STANDARD_ATMOSPHERIC_PSI = 14.6959;

export const HP_UNIT_LABELS: Record<HorsepowerUnit, string> = {
  hp: 'hp',
  PS: 'PS',
  kW: 'kW',
  W: 'W',
};

export const PRESSURE_UNIT_LABELS: Record<PressureUnit, string> = {
  psi: 'psi',
  kPa: 'kPa',
  bar: 'bar',
  mbar: 'mbar',
  Pa: 'Pa',
};

export interface BoostHorsepowerInput {
  mode: BoostCalculationMode;
  originalHorsepower: string;
  horsepowerUnit: HorsepowerUnit;
  boostPressure: string;
  boostPressureUnit: PressureUnit;
  targetHorsepower: string;
  targetHorsepowerUnit: HorsepowerUnit;
  atmosphericPressure: string;
  atmosphericPressureUnit: PressureUnit;
  enableAdvanced: boolean;
  efficiencyFactor: string;
}

export interface BoostComparisonPoint {
  boostPsi: number;
  boostedHp: number;
}

export interface BoostHorsepowerResult {
  mode: BoostCalculationMode;
  originalHorsepowerHp: number;
  boostedHorsepowerHp: number;
  boostPressurePsi: number;
  atmosphericPressurePsi: number;
  absolutePressurePsi: number;
  pressureRatio: number;
  horsepowerGainHp: number;
  percentageIncrease: number;
  adjustedHorsepowerHp: number | null;
  efficiencyFactor: number | null;
  formulaSteps: string[];
  comparison: BoostComparisonPoint[];
  interpretation: string;
  formattedPrimary: string;
  primaryLabel: string;
  horsepowerUnit: HorsepowerUnit;
  boostPressureUnit: PressureUnit;
}

export type BoostHorsepowerFieldErrors = {
  originalHorsepower?: string;
  boostPressure?: string;
  targetHorsepower?: string;
  atmosphericPressure?: string;
  efficiencyFactor?: string;
  form?: string;
};

export function createEmptyInput(): BoostHorsepowerInput {
  return {
    mode: 'boostedHorsepower',
    originalHorsepower: '',
    horsepowerUnit: 'hp',
    boostPressure: '6',
    boostPressureUnit: 'psi',
    targetHorsepower: '',
    targetHorsepowerUnit: 'hp',
    atmosphericPressure: String(DEFAULT_ATMOSPHERIC_PSI),
    atmosphericPressureUnit: 'psi',
    enableAdvanced: false,
    efficiencyFactor: '1',
  };
}

export function createExampleInput(): BoostHorsepowerInput {
  return {
    mode: 'boostedHorsepower',
    originalHorsepower: '200',
    horsepowerUnit: 'hp',
    boostPressure: '6',
    boostPressureUnit: 'psi',
    targetHorsepower: '',
    targetHorsepowerUnit: 'hp',
    atmosphericPressure: String(DEFAULT_ATMOSPHERIC_PSI),
    atmosphericPressureUnit: 'psi',
    enableAdvanced: false,
    efficiencyFactor: '1',
  };
}
