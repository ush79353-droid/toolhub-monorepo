/**
 * Bag Calculator — folded-bottom tote fabric cut estimate.
 * Flat: Fw=W+2S, Fh=2H+2T. Boxed: Fw=W+D+2S, Fh=2H+D+2T.
 * Single-piece construction model — not a universal pattern.
 */

export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';
export type AreaUnit = 'cm2' | 'm2' | 'in2' | 'ft2';
export type ConstructionType = 'flat-tote' | 'boxed-corner-tote';

export const LENGTH_UNIT_LABELS: Record<LengthUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  m: 'm',
  in: 'in',
  ft: 'ft',
};

export const AREA_UNIT_LABELS: Record<AreaUnit, string> = {
  cm2: 'cm²',
  m2: 'm²',
  in2: 'in²',
  ft2: 'ft²',
};

export const LENGTH_UNITS: readonly LengthUnit[] = [
  'mm',
  'cm',
  'm',
  'in',
  'ft',
];

export interface BagInput {
  height: string;
  width: string;
  depth: string;
  heightUnit: LengthUnit;
  widthUnit: LengthUnit;
  depthUnit: LengthUnit;
  boxCorners: boolean;
  sideSeamAllowance: string;
  topHemAllowance: string;
  allowanceUnit: LengthUnit;
  fabricDisplayUnit: LengthUnit;
  areaUnit: AreaUnit;
  showAdvanced: boolean;
}

export interface BagResult {
  fabricWidthMm: number;
  fabricHeightMm: number;
  fabricAreaMm2: number;
  constructionType: ConstructionType;
  finishedHeightMm: number;
  finishedWidthMm: number;
  finishedDepthMm: number;
  sideSeamAllowanceMm: number;
  topHemAllowanceMm: number;
  depthIgnored: boolean;
  fabricWidthDisplay: string;
  fabricHeightDisplay: string;
  fabricAreaDisplay: string;
  formulaSteps: string[];
  interpretation: string;
  constructionDescription: string;
}

export type BagFieldErrors = {
  height?: string;
  width?: string;
  depth?: string;
  sideSeamAllowance?: string;
  topHemAllowance?: string;
  form?: string;
};

export function createEmptyInput(): BagInput {
  return {
    height: '40',
    width: '35',
    depth: '10',
    heightUnit: 'cm',
    widthUnit: 'cm',
    depthUnit: 'cm',
    boxCorners: false,
    sideSeamAllowance: '1',
    topHemAllowance: '2',
    allowanceUnit: 'cm',
    fabricDisplayUnit: 'cm',
    areaUnit: 'cm2',
    showAdvanced: false,
  };
}

export function createBlankInput(): BagInput {
  return {
    ...createEmptyInput(),
    height: '',
    width: '',
    depth: '',
    sideSeamAllowance: '',
    topHemAllowance: '',
  };
}
