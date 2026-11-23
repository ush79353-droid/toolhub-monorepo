export type SpeedUnit = 'cm/s' | 'm/s';
export type LengthUnit = 'cm' | 'mm' | 'm';
export type FlowUnit = 'mL/s' | 'L/s' | 'mL/min';
export type AreaUnit = 'cm2' | 'mm2';
export type VolumeUnit = 'mL' | 'L';

export interface EroaMitralRegurgitationInput {
  aliasingSpeed: string;
  aliasingSpeedUnit: SpeedUnit;
  radius: string;
  radiusUnit: LengthUnit;
  maxVelocity: string;
  maxVelocityUnit: SpeedUnit;
  vti: string;
  vtiUnit: LengthUnit;
  flowUnit: FlowUnit;
  eroaUnit: AreaUnit;
  rvolUnit: VolumeUnit;
}

export interface EroaMitralRegurgitationResult {
  flowMlPerS: number | null;
  eroaCm2: number | null;
  regurgitantVolumeMl: number | null;
  formattedFlow: string;
  formattedEroa: string;
  formattedRvol: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type EroaFieldErrors = {
  form?: string;
  aliasingSpeed?: string;
  radius?: string;
  maxVelocity?: string;
  vti?: string;
};

export function createDefaultInput(): EroaMitralRegurgitationInput {
  return {
    aliasingSpeed: '',
    aliasingSpeedUnit: 'cm/s',
    radius: '',
    radiusUnit: 'cm',
    maxVelocity: '',
    maxVelocityUnit: 'cm/s',
    vti: '',
    vtiUnit: 'cm',
    flowUnit: 'mL/s',
    eroaUnit: 'cm2',
    rvolUnit: 'mL',
  };
}

export function createEmptyInput(): EroaMitralRegurgitationInput {
  return createDefaultInput();
}

/** Prompt fixture: r=1 cm, Va=40, Vmax=500, VTI=100 → ~251.33 / 0.503 / 50.27 */
export function createExampleInput(): EroaMitralRegurgitationInput {
  return {
    ...createDefaultInput(),
    aliasingSpeed: '40',
    radius: '1',
    maxVelocity: '500',
    vti: '100',
  };
}

export function inputsEqual(
  a: EroaMitralRegurgitationInput,
  b: EroaMitralRegurgitationInput
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const SPEED_UNIT_LABELS: Record<SpeedUnit, string> = {
  'cm/s': 'cm/s',
  'm/s': 'm/s',
};

export const LENGTH_UNIT_LABELS: Record<LengthUnit, string> = {
  cm: 'cm',
  mm: 'mm',
  m: 'm',
};

export const FLOW_UNIT_LABELS: Record<FlowUnit, string> = {
  'mL/s': 'ml/s',
  'L/s': 'L/s',
  'mL/min': 'mL/min',
};

export const AREA_UNIT_LABELS: Record<AreaUnit, string> = {
  cm2: 'cm²',
  mm2: 'mm²',
};

export const VOLUME_UNIT_LABELS: Record<VolumeUnit, string> = {
  mL: 'mL',
  L: 'L',
};
