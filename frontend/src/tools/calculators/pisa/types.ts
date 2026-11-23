export type SpeedUnit = 'cm/s' | 'm/s';
export type LengthUnit = 'cm' | 'mm' | 'm';
export type FlowUnit = 'mL/s' | 'L/s' | 'mL/min';
export type AreaUnit = 'cm2' | 'mm2';
export type VolumeUnit = 'mL' | 'L';
export type AngleUnit = 'deg';

export interface PisaInput {
  vmax: string;
  vmaxUnit: SpeedUnit;
  radius: string;
  radiusUnit: LengthUnit;
  vr: string;
  vrUnit: SpeedUnit;
  alpha: string;
  alphaUnit: AngleUnit;
  vti: string;
  vtiUnit: LengthUnit;
  mvaUnit: AreaUnit;
  vfrUnit: FlowUnit;
  eroaUnit: AreaUnit;
  rvolUnit: VolumeUnit;
  pisaUnit: AreaUnit;
}

export interface PisaResult {
  pisaCm2: number | null;
  vfrMlPerS: number | null;
  mvaCm2: number | null;
  eroaCm2: number | null;
  regurgitantVolumeMl: number | null;
  alphaUsedDeg: number;
  formattedPisa: string;
  formattedVfr: string;
  formattedMva: string;
  formattedEroa: string;
  formattedRvol: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type PisaFieldErrors = {
  form?: string;
  vmax?: string;
  radius?: string;
  vr?: string;
  alpha?: string;
  vti?: string;
};

export function createDefaultInput(): PisaInput {
  return {
    vmax: '',
    vmaxUnit: 'cm/s',
    radius: '',
    radiusUnit: 'cm',
    vr: '',
    vrUnit: 'cm/s',
    alpha: '',
    alphaUnit: 'deg',
    vti: '',
    vtiUnit: 'cm',
    mvaUnit: 'cm2',
    vfrUnit: 'mL/s',
    eroaUnit: 'mm2',
    rvolUnit: 'mL',
    pisaUnit: 'cm2',
  };
}

export function createEmptyInput(): PisaInput {
  return createDefaultInput();
}

/** Fixture: r=1 cm, Vr=40, Vmax=500, α=180, VTI=100 → PISA≈6.28, VFR≈251.33, MVA/EROA≈0.503 cm² / 50.3 mm², RVol≈50.3 */
export function createExampleInput(): PisaInput {
  return {
    ...createDefaultInput(),
    vmax: '500',
    radius: '1',
    vr: '40',
    alpha: '180',
    vti: '100',
  };
}

export function inputsEqual(a: PisaInput, b: PisaInput): boolean {
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
  'mL/s': 'mL/s',
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
