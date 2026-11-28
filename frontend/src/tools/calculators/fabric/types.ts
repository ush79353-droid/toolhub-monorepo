/**
 * Fabric Calculator — rectangular cutting layout, yardage, utilization.
 * Simplified uniform-orientation packing; not a global optimal packer.
 */

export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft' | 'yd';

export const LENGTH_UNIT_LABELS: Record<LengthUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  m: 'm',
  in: 'in',
  ft: 'ft',
  yd: 'yd',
};

export const LENGTH_UNITS: readonly LengthUnit[] = [
  'mm',
  'cm',
  'm',
  'in',
  'ft',
  'yd',
];

export const FABRIC_WIDTH_PRESETS_IN = [36, 44, 45, 54, 58, 60, 72] as const;

export interface FabricInput {
  fabricWidth: string;
  pieceWidth: string;
  pieceLength: string;
  numberOfPieces: string;
  allowRotation: boolean;
  cuttingGap: string;
  edgeAllowance: string;
  shrinkagePercent: string;
  extraFabricPercent: string;
  unit: LengthUnit;
  showAdvanced: boolean;
}

export interface FabricResult {
  usableFabricWidthMm: number;
  piecesAcross: number;
  rowsRequired: number;
  piecesInLastRow: number;
  baseFabricLengthMm: number;
  adjustedFabricLengthMm: number;
  fabricMeters: number;
  fabricYards: number;
  fabricAreaMm2: number;
  piecesAreaMm2: number;
  unusedAreaMm2: number;
  utilizationPercent: number;
  isRotated: boolean;
  pieceWidthMm: number;
  pieceLengthMm: number;
  formulaSteps: string[];
  explanation: string;
  warnings: string[];
}

export type FabricFieldErrors = {
  fabricWidth?: string;
  pieceWidth?: string;
  pieceLength?: string;
  numberOfPieces?: string;
  cuttingGap?: string;
  edgeAllowance?: string;
  shrinkagePercent?: string;
  extraFabricPercent?: string;
  form?: string;
};

export function createEmptyInput(): FabricInput {
  return {
    fabricWidth: '60',
    pieceWidth: '12',
    pieceLength: '18',
    numberOfPieces: '12',
    allowRotation: false,
    cuttingGap: '0',
    edgeAllowance: '0',
    shrinkagePercent: '0',
    extraFabricPercent: '0',
    unit: 'in',
    showAdvanced: false,
  };
}

export function createBlankInput(): FabricInput {
  return {
    ...createEmptyInput(),
    fabricWidth: '',
    pieceWidth: '',
    pieceLength: '',
    numberOfPieces: '',
  };
}
