/**
 * Wheel Offset Calculator — compare current vs new rim width/ET.
 * Nominal rim-edge geometry only — not tire-to-body fitment clearance.
 */

export type LengthUnit = 'mm' | 'cm' | 'in';

export const LENGTH_UNIT_LABELS: Record<LengthUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  in: 'in',
};

export const WIDTH_UNITS: readonly LengthUnit[] = ['in', 'mm', 'cm'];
export const OFFSET_UNITS: readonly LengthUnit[] = ['mm', 'cm', 'in'];

export interface WheelOffsetInput {
  currentWidth: string;
  currentWidthUnit: LengthUnit;
  currentOffset: string;
  currentOffsetUnit: LengthUnit;
  newWidth: string;
  newWidthUnit: LengthUnit;
  newOffset: string;
  newOffsetUnit: LengthUnit;
}

export interface WheelOffsetResult {
  currentWidthMm: number;
  newWidthMm: number;
  currentOffsetMm: number;
  newOffsetMm: number;
  currentInnerPositionMm: number;
  newInnerPositionMm: number;
  currentOuterPositionMm: number;
  newOuterPositionMm: number;
  clearanceChangeMm: number;
  positionChangeMm: number;
  widthDifferenceMm: number;
  offsetDifferenceMm: number;
  clearanceInterpretation: string;
  positionInterpretation: string;
  formulaSteps: string[];
  interpretation: string;
  currentWidthDisplay: string;
  newWidthDisplay: string;
  currentOffsetDisplay: string;
  newOffsetDisplay: string;
  clearanceDisplay: string;
  positionDisplay: string;
}

export type WheelOffsetFieldErrors = {
  currentWidth?: string;
  currentOffset?: string;
  newWidth?: string;
  newOffset?: string;
  form?: string;
};

export function createEmptyInput(): WheelOffsetInput {
  return {
    currentWidth: '7.5',
    currentWidthUnit: 'in',
    currentOffset: '45',
    currentOffsetUnit: 'mm',
    newWidth: '8.5',
    newWidthUnit: 'in',
    newOffset: '35',
    newOffsetUnit: 'mm',
  };
}

export function createBlankInput(): WheelOffsetInput {
  return {
    currentWidth: '',
    currentWidthUnit: 'in',
    currentOffset: '',
    currentOffsetUnit: 'mm',
    newWidth: '',
    newWidthUnit: 'in',
    newOffset: '',
    newOffsetUnit: 'mm',
  };
}
