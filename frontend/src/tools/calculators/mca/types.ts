import type { PregnancyPlurality } from './reference-data';

export type VelocityUnit = 'cm/s' | 'mm/s';

export interface McaInput {
  plurality: PregnancyPlurality;
  gaWeeks: number;
  psvText: string;
  /** Display unit for measured MCA-PSV (median/MoM follow this unit). */
  velocityUnit: VelocityUnit;
}

export interface McaResult {
  measuredPsvCm: number;
  medianPsvCm: number;
  mom: number;
  formattedMeasured: string;
  formattedMedian: string;
  formattedMom: string;
  referenceNote: string;
  sourceLabel: string;
  disclaimer: string;
  /** When twin GA is outside the published MCDA table. */
  twinReferenceGap?: string;
  explanation: string;
}

export type McaFieldErrors = {
  form?: string;
  psvText?: string;
  gaWeeks?: string;
};

export function createDefaultInput(): McaInput {
  return {
    plurality: 'single',
    gaWeeks: 14,
    psvText: '',
    velocityUnit: 'cm/s',
  };
}

export function createEmptyInput(): McaInput {
  return createDefaultInput();
}

export function inputsEqual(a: McaInput, b: McaInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const VELOCITY_UNIT_LABELS: Record<VelocityUnit, string> = {
  'cm/s': 'cm/s',
  'mm/s': 'mm/s',
};