/**
 * Compression ratio → pressure estimate (educational).
 * Simplified (default): P_abs = r × P_atm  — linear approximation, not a dyno/compression-test prediction.
 * Polytropic: P2 = P1 × r^n
 * Gauge: P_g = P_abs − P_atm
 */

export type PressureUnit = 'psi' | 'bar' | 'kPa' | 'MPa' | 'Pa' | 'atm';
export type CompressionModel = 'simplified' | 'polytropic';
export type CalculationDirection = 'ratioToPressure' | 'pressureToRatio';
export type PressureReference = 'absolute' | 'gauge';

export const PRESSURE_UNIT_LABELS: Record<PressureUnit, string> = {
  psi: 'psi',
  bar: 'bar',
  kPa: 'kPa',
  MPa: 'MPa',
  Pa: 'Pa',
  atm: 'atm',
};

export const MODEL_LABELS: Record<CompressionModel, string> = {
  simplified: 'Simplified estimate (P = r × P_atm)',
  polytropic: 'Polytropic estimate (P = P_atm × rⁿ)',
};

export const DIRECTION_LABELS: Record<CalculationDirection, string> = {
  ratioToPressure: 'Ratio → pressure',
  pressureToRatio: 'Pressure → ratio',
};

export const DEFAULT_ATM_PSI = 14.7;
export const DEFAULT_POLYTROPIC_N = 1.3;

export interface CompressionRatioToPsiInput {
  direction: CalculationDirection;
  numerator: string;
  denominator: string;
  atmosphericPressure: string;
  atmosphericPressureUnit: PressureUnit;
  model: CompressionModel;
  polytropicExponent: string;
  compressionPressure: string;
  compressionPressureUnit: PressureUnit;
  pressureReference: PressureReference;
  resultPressureUnit: PressureUnit;
}

export interface CompressionRatioToPsiResult {
  direction: CalculationDirection;
  model: CompressionModel;
  normalizedCompressionRatio: number;
  atmosphericPressurePsi: number;
  absolutePressurePsi: number;
  gaugePressurePsi: number;
  pressureIncreasePsi: number;
  pressureRatio: number;
  polytropicExponent: number | null;
  formulaSteps: string[];
  interpretation: string;
  formattedPrimary: string;
  primaryLabel: string;
  resultPressureUnit: PressureUnit;
}

export type CompressionRatioToPsiFieldErrors = {
  numerator?: string;
  denominator?: string;
  atmosphericPressure?: string;
  polytropicExponent?: string;
  compressionPressure?: string;
  form?: string;
};

export function createEmptyInput(): CompressionRatioToPsiInput {
  return {
    direction: 'ratioToPressure',
    numerator: '10',
    denominator: '1',
    atmosphericPressure: String(DEFAULT_ATM_PSI),
    atmosphericPressureUnit: 'psi',
    model: 'simplified',
    polytropicExponent: String(DEFAULT_POLYTROPIC_N),
    compressionPressure: '',
    compressionPressureUnit: 'psi',
    pressureReference: 'gauge',
    resultPressureUnit: 'psi',
  };
}

export function createExampleInput(): CompressionRatioToPsiInput {
  return createEmptyInput();
}

export function createExample8to1(): CompressionRatioToPsiInput {
  return { ...createEmptyInput(), numerator: '8', denominator: '1' };
}

export function createExample12to1(): CompressionRatioToPsiInput {
  return { ...createEmptyInput(), numerator: '12', denominator: '1' };
}

export function createExamplePolytropic(): CompressionRatioToPsiInput {
  return {
    ...createEmptyInput(),
    numerator: '10',
    denominator: '1',
    model: 'polytropic',
    polytropicExponent: '1.3',
  };
}
