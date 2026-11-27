export type LengthUnit = 'cm' | 'in';

export type FaceShapeSex = 'female' | 'male' | 'unset';

export type FeatureSharpness = 'sharp' | 'somewhat' | 'round';

export type FaceShapeId =
  | 'oval'
  | 'round'
  | 'oblong'
  | 'square'
  | 'triangle'
  | 'diamond'
  | 'heart';

export interface FaceShapeInput {
  sex: FaceShapeSex;
  foreheadText: string;
  foreheadUnit: LengthUnit;
  cheeksText: string;
  cheeksUnit: LengthUnit;
  jawlineText: string;
  jawlineUnit: LengthUnit;
  faceLengthText: string;
  faceLengthUnit: LengthUnit;
  sharpness: FeatureSharpness;
}

export interface FaceShapeResult {
  foreheadCm: number | null;
  cheeksCm: number | null;
  jawlineCm: number | null;
  faceLengthCm: number | null;
  rLf: number | null;
  formattedRLf: string;
  widestZone: 'forehead' | 'cheeks' | 'jawline' | '';
  shapeId: FaceShapeId | null;
  shapeLabel: string;
  matchedRule: number | null;
  fallbackNote: string;
  statusHeadline: string;
  statusDetail: string;
  sexTip: string;
  methodologyNote: string;
  disclaimer: string;
}

export type FaceShapeFieldErrors = {
  foreheadText?: string;
  cheeksText?: string;
  jawlineText?: string;
  faceLengthText?: string;
};

export function createDefaultInput(): FaceShapeInput {
  return {
    sex: 'unset',
    foreheadText: '13.5',
    foreheadUnit: 'cm',
    cheeksText: '13.5',
    cheeksUnit: 'cm',
    jawlineText: '11.5',
    jawlineUnit: 'cm',
    faceLengthText: '19.5',
    faceLengthUnit: 'cm',
    sharpness: 'somewhat',
  };
}

export function createEmptyInput(): FaceShapeInput {
  return {
    sex: 'unset',
    foreheadText: '',
    foreheadUnit: 'cm',
    cheeksText: '',
    cheeksUnit: 'cm',
    jawlineText: '',
    jawlineUnit: 'cm',
    faceLengthText: '',
    faceLengthUnit: 'cm',
    sharpness: 'somewhat',
  };
}

export function inputsEqual(a: FaceShapeInput, b: FaceShapeInput): boolean {
  return (
    a.sex === b.sex &&
    a.foreheadText === b.foreheadText &&
    a.foreheadUnit === b.foreheadUnit &&
    a.cheeksText === b.cheeksText &&
    a.cheeksUnit === b.cheeksUnit &&
    a.jawlineText === b.jawlineText &&
    a.jawlineUnit === b.jawlineUnit &&
    a.faceLengthText === b.faceLengthText &&
    a.faceLengthUnit === b.faceLengthUnit &&
    a.sharpness === b.sharpness
  );
}