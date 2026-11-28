/**
 * Circle Skirt Calculator — sector geometry for waist radius & cutting dims.
 * R = W / (2πf). Cutting ≠ guaranteed fabric yardage (layout/width matter).
 */

export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';

export type CircleSkirtType = 'full' | 'threeQuarter' | 'half' | 'quarter';

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

export const SKIRT_TYPE_LABELS: Record<CircleSkirtType, string> = {
  full: 'Full circle skirt',
  threeQuarter: '3/4 circle skirt',
  half: 'Half circle skirt',
  quarter: 'Quarter circle skirt',
};

export interface CircleSkirtInput {
  skirtType: CircleSkirtType;
  waist: string;
  skirtLength: string;
  unit: LengthUnit;
  waistSeamAllowance: string;
  hemAllowance: string;
  fabricWidth: string;
  showAdvanced: boolean;
}

export interface FabricEstimate {
  fabricWidthCm: number;
  estimatedFabricLengthCm: number | null;
  layoutSupported: boolean;
  warning: string | null;
}

export interface CircleSkirtResult {
  circleFraction: number;
  waistRadiusCm: number;
  outerRadiusCm: number;
  radialCuttingDimensionCm: number;
  hemCircumferenceCm: number;
  finishedOuterRadiusCm: number;
  waistSeamAllowanceCm: number;
  hemAllowanceCm: number;
  skirtType: CircleSkirtType;
  fabricEstimate: FabricEstimate | null;
  formulaSteps: string[];
  explanation: string;
  warnings: string[];
}

export type CircleSkirtFieldErrors = {
  waist?: string;
  skirtLength?: string;
  waistSeamAllowance?: string;
  hemAllowance?: string;
  fabricWidth?: string;
  form?: string;
};

export function createEmptyInput(): CircleSkirtInput {
  return {
    skirtType: 'full',
    waist: '75',
    skirtLength: '70',
    unit: 'cm',
    waistSeamAllowance: '0',
    hemAllowance: '0',
    fabricWidth: '',
    showAdvanced: false,
  };
}

export function createBlankInput(): CircleSkirtInput {
  return {
    ...createEmptyInput(),
    waist: '',
    skirtLength: '',
    waistSeamAllowance: '0',
    hemAllowance: '0',
    fabricWidth: '',
  };
}
