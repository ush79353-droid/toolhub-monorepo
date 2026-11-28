/**
 * Half Square Triangle Calculator — finished/unfinished/raw square + diagonal.
 * Distinguishes geometric minimums from traditional quilting shortcuts.
 */

export type LengthUnit = 'in' | 'cm' | 'mm';

export type HSTConstructionMethod = 'two-at-a-time' | 'eight-at-a-time';

export type HSTCalculationMode =
  | 'finished-to-raw'
  | 'raw-to-finished'
  | 'diagonal-to-side';

export type HSTCuttingPreference =
  | 'geometric-minimum'
  | 'traditional'
  | 'oversized';

export const UNIT_LABELS: Record<LengthUnit, string> = {
  in: 'in',
  cm: 'cm',
  mm: 'mm',
};

export const METHOD_LABELS: Record<HSTConstructionMethod, string> = {
  'two-at-a-time': 'Two-at-a-Time',
  'eight-at-a-time': 'Eight-at-a-Time',
};

export const MODE_LABELS: Record<HSTCalculationMode, string> = {
  'finished-to-raw': 'Calculate raw square size',
  'raw-to-finished': 'Calculate finished HST size',
  'diagonal-to-side': 'Calculate side from diagonal',
};

export const CUTTING_LABELS: Record<HSTCuttingPreference, string> = {
  'geometric-minimum': 'Geometric minimum',
  traditional: 'Traditional quilting shortcut',
  oversized: 'Oversized for trimming',
};

export interface HSTInput {
  constructionMethod: HSTConstructionMethod;
  calculationMode: HSTCalculationMode;
  cuttingPreference: HSTCuttingPreference;
  finishedSize: string;
  rawSquareSize: string;
  diagonal: string;
  seamAllowance: string;
  extraTrimmingAllowance: string;
  requiredBlocks: string;
  unit: LengthUnit;
  showAdvanced: boolean;
  showChart: boolean;
}

export interface HSTResult {
  finishedSizeIn: number;
  unfinishedSizeIn: number;
  rawSquareSizeIn: number;
  finishedDiagonalIn: number;
  rawSquareDiagonalIn: number;
  seamAllowanceIn: number;
  blocksPerPair: number;
  requiredPairs: number | null;
  totalFabricSquares: number | null;
  surplusBlocks: number | null;
  constructionMethod: HSTConstructionMethod;
  cuttingPreference: HSTCuttingPreference;
  formulaSteps: string[];
  explanation: string;
  warnings: string[];
}

export type HSTFieldErrors = {
  finishedSize?: string;
  rawSquareSize?: string;
  diagonal?: string;
  seamAllowance?: string;
  extraTrimmingAllowance?: string;
  requiredBlocks?: string;
  form?: string;
};

export function createEmptyInput(): HSTInput {
  return {
    constructionMethod: 'two-at-a-time',
    calculationMode: 'finished-to-raw',
    cuttingPreference: 'traditional',
    finishedSize: '4',
    rawSquareSize: '',
    diagonal: '',
    seamAllowance: '0.25',
    extraTrimmingAllowance: '0.125',
    requiredBlocks: '',
    unit: 'in',
    showAdvanced: false,
    showChart: true,
  };
}

export function createBlankInput(): HSTInput {
  return {
    ...createEmptyInput(),
    finishedSize: '',
    rawSquareSize: '',
    diagonal: '',
    requiredBlocks: '',
  };
}
