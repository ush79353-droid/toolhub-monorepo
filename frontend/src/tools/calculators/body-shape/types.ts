import type { BodyShapeId, LengthUnit } from '../body-type/types';

export type { BodyShapeId, LengthUnit };

export interface BodyShapeInput {
  bustText: string;
  bustUnit: LengthUnit;
  waistText: string;
  waistUnit: LengthUnit;
  highHipText: string;
  highHipUnit: LengthUnit;
  hipText: string;
  hipUnit: LengthUnit;
}

export interface BodyShapeResult {
  shapeId: BodyShapeId;
  shapeLabel: string;
  resultHeadline: string;
  sourceNote: string;
  disclaimer: string;
}

export type BodyShapeFieldErrors = {
  bustText?: string;
  waistText?: string;
  highHipText?: string;
  hipText?: string;
};

export function createEmptyInput(): BodyShapeInput {
  return {
    bustText: '',
    bustUnit: 'cm',
    waistText: '',
    waistUnit: 'cm',
    highHipText: '',
    highHipUnit: 'cm',
    hipText: '',
    hipUnit: 'cm',
  };
}

export function inputsEqual(a: BodyShapeInput, b: BodyShapeInput): boolean {
  return (
    a.bustText === b.bustText &&
    a.bustUnit === b.bustUnit &&
    a.waistText === b.waistText &&
    a.waistUnit === b.waistUnit &&
    a.highHipText === b.highHipText &&
    a.highHipUnit === b.highHipUnit &&
    a.hipText === b.hipText &&
    a.hipUnit === b.hipUnit
  );
}