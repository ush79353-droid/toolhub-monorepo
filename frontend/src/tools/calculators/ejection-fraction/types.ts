/** Which known quantity drives stroke volume for EF. */
export type EjectionFractionMode = 'sv' | 'esv' | 'coHr';

export interface EjectionFractionInput {
  mode: EjectionFractionMode;
  edvMl: string;
  strokeVolumeMl: string;
  esvMl: string;
  cardiacOutputLMin: string;
  heartRateBpm: string;
}

export interface EjectionFractionResult {
  edvMl: number;
  strokeVolumeMl: number;
  ejectionFractionPercent: number;
  formattedEf: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type EjectionFractionFieldErrors = {
  form?: string;
  edvMl?: string;
  strokeVolumeMl?: string;
  esvMl?: string;
  cardiacOutputLMin?: string;
  heartRateBpm?: string;
};

/** Screenshot defaults: SV mode selected; all values blank. */
export function createDefaultInput(): EjectionFractionInput {
  return {
    mode: 'sv',
    edvMl: '',
    strokeVolumeMl: '',
    esvMl: '',
    cardiacOutputLMin: '',
    heartRateBpm: '',
  };
}

export function createEmptyInput(): EjectionFractionInput {
  return createDefaultInput();
}

/** Educational fixture: EDV 120 mL · SV 72 mL → EF 60%. */
export function createExampleInput(): EjectionFractionInput {
  return {
    mode: 'sv',
    edvMl: '120',
    strokeVolumeMl: '72',
    esvMl: '',
    cardiacOutputLMin: '',
    heartRateBpm: '',
  };
}

/**
 * Switch mode while preserving EDV; clear fields belonging to other modes
 * (prompt: preserve EDV but clear hidden-mode state).
 */
export function switchMode(
  input: EjectionFractionInput,
  next: EjectionFractionMode
): EjectionFractionInput {
  if (next === input.mode) return input;
  return {
    mode: next,
    edvMl: input.edvMl,
    strokeVolumeMl: next === 'sv' ? input.strokeVolumeMl : '',
    esvMl: next === 'esv' ? input.esvMl : '',
    cardiacOutputLMin: next === 'coHr' ? input.cardiacOutputLMin : '',
    heartRateBpm: next === 'coHr' ? input.heartRateBpm : '',
  };
}

export function inputsEqual(
  a: EjectionFractionInput,
  b: EjectionFractionInput
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const MODE_OPTIONS: readonly {
  value: EjectionFractionMode;
  label: string;
}[] = [
  { value: 'sv', label: 'stroke volume (SV)' },
  { value: 'esv', label: 'end-systolic volume (ESV)' },
  { value: 'coHr', label: 'cardiac output & heart rate (CO & HR)' },
];
