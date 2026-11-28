/**
 * Cross-Stitch Calculator — finished size, fabric cut, optional floss estimate.
 * Fabric count is threads/squares per inch; D = C/O stitches per inch.
 */

export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';

export const LENGTH_UNIT_LABELS: Record<LengthUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  m: 'm',
  in: 'in',
  ft: 'ft',
};

export const LENGTH_UNITS: readonly LengthUnit[] = [
  'mm',
  'cm',
  'm',
  'in',
  'ft',
];

export const COMMON_FABRIC_COUNTS = [
  6, 8, 11, 14, 16, 18, 20, 22, 25, 28, 32, 36, 40,
] as const;

export const COMPARE_COUNTS = [11, 14, 16, 18, 22] as const;

export interface CrossStitchInput {
  patternWidth: string;
  patternHeight: string;
  fabricCount: string;
  stitchOver: string;
  extraFabric: string;
  unit: LengthUnit;
  showThread: boolean;
  coveragePercentage: string;
  flossStrands: string;
  strandLengthPerCrossCm: string;
  wastePercentage: string;
  skeinLengthCm: string;
  strandsPerSkein: string;
}

export interface FabricCompareRow {
  fabricCount: number;
  finishedWidthCm: number;
  finishedHeightCm: number;
}

export interface ThreadEstimate {
  estimatedCompletedCrosses: number;
  estimatedStrandLengthCm: number;
  estimatedSkeins: number;
  explanation: string;
}

export interface CrossStitchResult {
  effectiveStitchesPerInch: number;
  finishedWidthCm: number;
  finishedHeightCm: number;
  fabricWidthCm: number;
  fabricHeightCm: number;
  totalPatternPositions: number;
  extraFabricCm: number;
  compareRows: FabricCompareRow[];
  thread: ThreadEstimate | null;
  formulaSteps: string[];
  explanation: string;
  warnings: string[];
}

export type CrossStitchFieldErrors = {
  patternWidth?: string;
  patternHeight?: string;
  fabricCount?: string;
  stitchOver?: string;
  extraFabric?: string;
  coveragePercentage?: string;
  flossStrands?: string;
  strandLengthPerCrossCm?: string;
  wastePercentage?: string;
  skeinLengthCm?: string;
  strandsPerSkein?: string;
  form?: string;
};

export function createEmptyInput(): CrossStitchInput {
  return {
    patternWidth: '100',
    patternHeight: '80',
    fabricCount: '14',
    stitchOver: '1',
    extraFabric: '8',
    unit: 'cm',
    showThread: false,
    coveragePercentage: '70',
    flossStrands: '2',
    strandLengthPerCrossCm: '1.3',
    wastePercentage: '10',
    skeinLengthCm: '800',
    strandsPerSkein: '6',
  };
}

export function createBlankInput(): CrossStitchInput {
  return {
    ...createEmptyInput(),
    patternWidth: '',
    patternHeight: '',
    fabricCount: '',
    stitchOver: '1',
    extraFabric: '',
  };
}
