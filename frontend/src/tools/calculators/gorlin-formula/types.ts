export type FlowUnit = 'Lmin' | 'mLmin';
export type PressureUnit = 'mmHg' | 'kPa';
export type PeriodUnit = 'sec' | 'msec';
export type AreaUnit = 'cm2' | 'mm2';

export interface GorlinInput {
  cardiacOutput: string;
  cardiacOutputUnit: FlowUnit;
  heartRate: string;
  aorticGradient: string;
  aorticGradientUnit: PressureUnit;
  systolicEjectionPeriod: string;
  systolicEjectionPeriodUnit: PeriodUnit;
  aorticAreaUnit: AreaUnit;
  mitralGradient: string;
  mitralGradientUnit: PressureUnit;
  diastolicFillingPeriod: string;
  diastolicFillingPeriodUnit: PeriodUnit;
  mitralAreaUnit: AreaUnit;
}

export interface GorlinValveResult {
  areaCm2: number;
  areaDisplay: number;
  formattedArea: string;
}

export interface GorlinResult {
  aortic: GorlinValveResult | null;
  mitral: GorlinValveResult | null;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type GorlinFieldErrors = {
  form?: string;
  cardiacOutput?: string;
  heartRate?: string;
  aorticGradient?: string;
  systolicEjectionPeriod?: string;
  mitralGradient?: string;
  diastolicFillingPeriod?: string;
};

export function createDefaultInput(): GorlinInput {
  return {
    cardiacOutput: '',
    cardiacOutputUnit: 'Lmin',
    heartRate: '',
    aorticGradient: '',
    aorticGradientUnit: 'mmHg',
    systolicEjectionPeriod: '',
    systolicEjectionPeriodUnit: 'sec',
    aorticAreaUnit: 'cm2',
    mitralGradient: '',
    mitralGradientUnit: 'mmHg',
    diastolicFillingPeriod: '',
    diastolicFillingPeriodUnit: 'sec',
    mitralAreaUnit: 'cm2',
  };
}

export function createEmptyInput(): GorlinInput {
  return createDefaultInput();
}

/** Prompt fixture: CO 5, HR 75, SEP 0.30, ΔP 40 → AVA ≈ 0.79 cm². */
export function createExampleInput(): GorlinInput {
  return {
    ...createDefaultInput(),
    cardiacOutput: '5',
    heartRate: '75',
    aorticGradient: '40',
    systolicEjectionPeriod: '0.30',
  };
}

export function inputsEqual(a: GorlinInput, b: GorlinInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const FLOW_UNIT_LABELS: Record<FlowUnit, string> = {
  Lmin: 'L/min',
  mLmin: 'mL/min',
};

export const PRESSURE_UNIT_LABELS: Record<PressureUnit, string> = {
  mmHg: 'mmHg',
  kPa: 'kPa',
};

export const PERIOD_UNIT_LABELS: Record<PeriodUnit, string> = {
  sec: 'sec',
  msec: 'msec',
};

export const AREA_UNIT_LABELS: Record<AreaUnit, string> = {
  cm2: 'cm²',
  mm2: 'mm²',
};
