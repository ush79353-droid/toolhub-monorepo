/** Mitral valve area estimation method (screenshot radios). */
export type MvaMethod = 'continuity' | 'pht' | 'deceleration';

export type LengthUnit = 'mm' | 'cm';
export type VtiUnit = 'cm' | 'm';
export type AreaUnit = 'cm2' | 'mm2';
export type TimeUnit = 'ms' | 's';

export interface MitralValveAreaInput {
  method: MvaMethod;
  /** Continuity: LVOT diameter. */
  lvotValue: string;
  lvotUnit: LengthUnit;
  lvotVtiValue: string;
  lvotVtiUnit: VtiUnit;
  mitralVtiValue: string;
  mitralVtiUnit: VtiUnit;
  /** Pressure half-time (ms|s). */
  phtValue: string;
  phtUnit: TimeUnit;
  /** Deceleration time (ms|s). */
  dtValue: string;
  dtUnit: TimeUnit;
  areaUnit: AreaUnit;
}

export interface MitralValveAreaResult {
  method: MvaMethod;
  mvaCm2: number;
  mvaDisplay: number;
  formattedMva: string;
  lvotAreaCm2: number | null;
  formattedLvotArea: string | null;
  explanation: string;
  limitationNote: string;
  disclaimer: string;
  sourceLabel: string;
}

export type MitralValveAreaFieldErrors = {
  form?: string;
  lvotValue?: string;
  lvotVtiValue?: string;
  mitralVtiValue?: string;
  phtValue?: string;
  dtValue?: string;
};

export const METHOD_OPTIONS: readonly {
  value: MvaMethod;
  label: string;
}[] = [
  { value: 'continuity', label: 'Continuity equation' },
  { value: 'pht', label: 'Pressure half-time' },
  { value: 'deceleration', label: 'Deceleration time' },
];

/** Screenshot defaults: Continuity selected; blank fields; cm / cm². */
export function createDefaultInput(): MitralValveAreaInput {
  return {
    method: 'continuity',
    lvotValue: '',
    lvotUnit: 'cm',
    lvotVtiValue: '',
    lvotVtiUnit: 'cm',
    mitralVtiValue: '',
    mitralVtiUnit: 'cm',
    phtValue: '',
    phtUnit: 'ms',
    dtValue: '',
    dtUnit: 'ms',
    areaUnit: 'cm2',
  };
}

export function createEmptyInput(): MitralValveAreaInput {
  return createDefaultInput();
}

/** Continuity fixture: d=2 cm · LVOT VTI 20 · mitral VTI 40 → ≈1.571 cm². */
export function createExampleInput(): MitralValveAreaInput {
  return {
    ...createDefaultInput(),
    lvotValue: '2',
    lvotVtiValue: '20',
    mitralVtiValue: '40',
  };
}

/** Clear method-specific fields on switch; keep area display unit. */
export function switchMethod(
  input: MitralValveAreaInput,
  method: MvaMethod
): MitralValveAreaInput {
  if (method === input.method) return input;
  return {
    ...createDefaultInput(),
    method,
    areaUnit: input.areaUnit,
  };
}

export function inputsEqual(
  a: MitralValveAreaInput,
  b: MitralValveAreaInput
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const LENGTH_UNIT_LABELS: Record<LengthUnit, string> = {
  mm: 'mm',
  cm: 'cm',
};

export const VTI_UNIT_LABELS: Record<VtiUnit, string> = {
  cm: 'cm',
  m: 'm',
};

export const AREA_UNIT_LABELS: Record<AreaUnit, string> = {
  cm2: 'cm²',
  mm2: 'mm²',
};

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
  ms: 'ms',
  s: 's',
};
