/**
 * Engine compression ratio (educational geometric model).
 * Vs = π/4 · D² · L
 * Vc = chamber + gasket + deck + piston (signed)
 * CR = (Vs + Vc) / Vc
 * DCR uses crank-slider effective stroke after IVC ABDC.
 */

export type LengthUnit = 'mm' | 'cm' | 'm' | 'in';
export type VolumeUnit = 'cc' | 'mL' | 'L' | 'in3';

export type CompressionMode =
  | 'engineGeometry'
  | 'knownVolumes'
  | 'clearanceFromRatio';

export const LENGTH_UNIT_LABELS: Record<LengthUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  m: 'm',
  in: 'in',
};

export const VOLUME_UNIT_LABELS: Record<VolumeUnit, string> = {
  cc: 'cc',
  mL: 'mL',
  L: 'L',
  in3: 'in³',
};

export const MODE_LABELS: Record<CompressionMode, string> = {
  engineGeometry: 'From engine geometry',
  knownVolumes: 'From known volumes',
  clearanceFromRatio: 'Clearance from target CR',
};

export interface CompressionRatioInput {
  mode: CompressionMode;
  cylinders: string;
  bore: string;
  boreUnit: LengthUnit;
  stroke: string;
  strokeUnit: LengthUnit;
  gasketThickness: string;
  gasketThicknessUnit: LengthUnit;
  gasketBore: string;
  gasketBoreUnit: LengthUnit;
  useBoreForGasket: boolean;
  deckClearance: string;
  deckClearanceUnit: LengthUnit;
  chamberVolume: string;
  chamberVolumeUnit: VolumeUnit;
  pistonVolume: string;
  pistonVolumeUnit: VolumeUnit;
  // known volumes / reverse
  compressedVolume: string;
  compressedVolumeUnit: VolumeUnit;
  displacementVolume: string;
  displacementVolumeUnit: VolumeUnit;
  targetCR: string;
  // dynamic
  enableDynamic: boolean;
  rodLength: string;
  rodLengthUnit: LengthUnit;
  ivcAbdc: string;
}

export interface CompressionRatioResult {
  mode: CompressionMode;
  cylinders: number;
  sweptVolumePerCylinderCc: number;
  engineDisplacementCc: number;
  gasketVolumeCc: number;
  deckVolumeCc: number;
  pistonVolumeCc: number;
  chamberVolumeCc: number;
  clearanceVolumeCc: number;
  volumeAtBDCCc: number;
  staticCompressionRatio: number;
  effectiveStrokeMm: number | null;
  effectiveSweptVolumeCc: number | null;
  dynamicCompressionRatio: number | null;
  formulaSteps: string[];
  interpretation: string;
  formattedPrimary: string;
  primaryLabel: string;
}

export type CompressionFieldErrors = {
  cylinders?: string;
  bore?: string;
  stroke?: string;
  gasketThickness?: string;
  gasketBore?: string;
  deckClearance?: string;
  chamberVolume?: string;
  pistonVolume?: string;
  compressedVolume?: string;
  displacementVolume?: string;
  targetCR?: string;
  rodLength?: string;
  ivcAbdc?: string;
  form?: string;
};

export function createEmptyInput(): CompressionRatioInput {
  return {
    mode: 'engineGeometry',
    cylinders: '1',
    bore: '',
    boreUnit: 'mm',
    stroke: '',
    strokeUnit: 'mm',
    gasketThickness: '0',
    gasketThicknessUnit: 'mm',
    gasketBore: '',
    gasketBoreUnit: 'mm',
    useBoreForGasket: true,
    deckClearance: '0',
    deckClearanceUnit: 'mm',
    chamberVolume: '',
    chamberVolumeUnit: 'cc',
    pistonVolume: '0',
    pistonVolumeUnit: 'cc',
    compressedVolume: '',
    compressedVolumeUnit: 'cc',
    displacementVolume: '',
    displacementVolumeUnit: 'cc',
    targetCR: '',
    enableDynamic: false,
    rodLength: '',
    rodLengthUnit: 'mm',
    ivcAbdc: '',
  };
}

export function createExampleSingleCylinder(): CompressionRatioInput {
  return {
    ...createEmptyInput(),
    cylinders: '1',
    bore: '80',
    stroke: '75',
    chamberVolume: '40',
    gasketThickness: '1',
    gasketBore: '80',
    useBoreForGasket: false,
    deckClearance: '0',
    pistonVolume: '0',
  };
}

export function createExampleFourCylinder(): CompressionRatioInput {
  return {
    ...createEmptyInput(),
    cylinders: '4',
    bore: '86',
    stroke: '86',
    chamberVolume: '50',
    gasketThickness: '1',
    gasketBore: '86',
    useBoreForGasket: false,
    deckClearance: '0',
    pistonVolume: '0',
  };
}

export function createExampleKnownVolumes(): CompressionRatioInput {
  return {
    ...createEmptyInput(),
    mode: 'knownVolumes',
    compressedVolume: '50',
    displacementVolume: '450',
  };
}

export function createExampleInput(): CompressionRatioInput {
  return createExampleFourCylinder();
}
