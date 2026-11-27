export type LengthUnit = 'cm' | 'in';

/** Lee / Istook / calculator.net FFIT-style apparel shapes (7). */
export type BodyShapeId =
  | 'hourglass'
  | 'bottom_hourglass'
  | 'top_hourglass'
  | 'spoon'
  | 'triangle'
  | 'inverted_triangle'
  | 'rectangle'
  | 'unclassified';

export interface BodyTypeInput {
  bustText: string;
  bustUnit: LengthUnit;
  waistText: string;
  waistUnit: LengthUnit;
  highHipText: string;
  highHipUnit: LengthUnit;
  hipText: string;
  hipUnit: LengthUnit;
}

export interface BodyTypeResult {
  bustIn: number | null;
  waistIn: number | null;
  highHipIn: number | null;
  hipIn: number | null;
  shapeId: BodyShapeId | null;
  shapeLabel: string;
  whr: number | null;
  formattedWhr: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type BodyTypeFieldErrors = {
  bustText?: string;
  waistText?: string;
  highHipText?: string;
  hipText?: string;
};

export function createDefaultInput(): BodyTypeInput {
  return {
    bustText: '90',
    bustUnit: 'cm',
    waistText: '60',
    waistUnit: 'cm',
    highHipText: '80',
    highHipUnit: 'cm',
    hipText: '90',
    hipUnit: 'cm',
  };
}

export function createEmptyInput(): BodyTypeInput {
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

export function inputsEqual(a: BodyTypeInput, b: BodyTypeInput): boolean {
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
