/**
 * Hexagon Quilt Calculator — flat-top staggered columns.
 * Finished geometry is authoritative; seam allowance affects cutting only.
 */

export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';

export type HexagonMeasurementType = 'side' | 'pointToPoint' | 'flatToFlat';

export const UNIT_LABELS: Record<LengthUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  m: 'm',
  in: 'in',
  ft: 'ft',
};

export const QUILT_UNITS: readonly LengthUnit[] = ['mm', 'cm', 'm', 'in', 'ft'];
export const HEX_UNITS: readonly LengthUnit[] = ['mm', 'cm', 'in'];
export const SEAM_UNITS: readonly LengthUnit[] = ['mm', 'cm', 'in'];
export const FABRIC_WIDTH_UNITS: readonly LengthUnit[] = ['cm', 'in'];

export const MEASUREMENT_LABELS: Record<HexagonMeasurementType, string> = {
  side: 'Side length',
  pointToPoint: 'Point-to-point width',
  flatToFlat: 'Flat-to-flat width',
};

export const FABRIC_WIDTH_PRESETS_IN = [42, 44, 45, 54, 60] as const;

export interface HexagonQuiltInput {
  quiltWidth: string;
  quiltLength: string;
  quiltUnit: LengthUnit;
  hexagonSize: string;
  hexagonUnit: LengthUnit;
  measurementType: HexagonMeasurementType;
  seamAllowance: string;
  seamUnit: LengthUnit;
  showAdvanced: boolean;
  fabricWidth: string;
  fabricWidthUnit: LengthUnit;
  wastePercent: string;
  showFabric: boolean;
  showPreview: boolean;
}

export interface HexPreviewCell {
  col: number;
  row: number;
  kind: 'full' | 'half-vertical' | 'half-horizontal';
  cx: number;
  cy: number;
}

export interface HexagonQuiltResult {
  sideLengthCm: number;
  pointToPointCm: number;
  flatToFlatCm: number;
  hexagonAreaCm2: number;
  columns: number;
  rows: number;
  fullHexagons: number;
  verticalHalfHexagons: number;
  horizontalHalfHexagons: number;
  halfHexagons: number;
  trimmedPieces: number;
  equivalentHexagons: number;
  desiredWidthCm: number;
  desiredLengthCm: number;
  actualWidthCm: number;
  actualLengthCm: number;
  cuttingSideCm: number;
  cuttingPointToPointCm: number;
  cuttingFlatToFlatCm: number;
  estimatedFabricAreaCm2: number | null;
  estimatedFabricLengthCm: number | null;
  estimatedFabricYards: number | null;
  previewCells: HexPreviewCell[];
  previewSimplified: boolean;
  previewNote: string | null;
  formulaSteps: string[];
  explanation: string;
  warnings: string[];
}

export type HexagonQuiltFieldErrors = {
  quiltWidth?: string;
  quiltLength?: string;
  hexagonSize?: string;
  seamAllowance?: string;
  fabricWidth?: string;
  wastePercent?: string;
  form?: string;
};

export function createEmptyInput(): HexagonQuiltInput {
  return {
    quiltWidth: '150',
    quiltLength: '200',
    quiltUnit: 'cm',
    hexagonSize: '5',
    hexagonUnit: 'cm',
    measurementType: 'side',
    seamAllowance: '0.25',
    seamUnit: 'in',
    showAdvanced: false,
    fabricWidth: '44',
    fabricWidthUnit: 'in',
    wastePercent: '10',
    showFabric: false,
    showPreview: true,
  };
}

export function createBlankInput(): HexagonQuiltInput {
  return {
    ...createEmptyInput(),
    quiltWidth: '',
    quiltLength: '',
    hexagonSize: '',
  };
}
