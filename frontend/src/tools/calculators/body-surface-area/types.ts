export type Sex = 'male' | 'female';
export type WeightUnit = 'lb' | 'kg';
/** Which height representation was last edited (ft/in vs cm). */
export type HeightSource = 'imperial' | 'metric';

export interface BodySurfaceAreaInput {
  sex: Sex;
  weightText: string;
  weightUnit: WeightUnit;
  heightFt: string;
  heightIn: string;
  heightCm: string;
  heightSource: HeightSource;
}

export interface BodySurfaceAreaMethodValues {
  duBois: number;
  mosteller: number;
  haycock: number;
  gehanGeorge: number;
  boyd: number;
  fujimoto: number;
  takahira: number;
  schlich: number;
}

export interface BodySurfaceAreaResult {
  weightKg: number;
  heightCm: number;
  methods: BodySurfaceAreaMethodValues;
  formatted: {
    duBois: string;
    mosteller: string;
    haycock: string;
    gehanGeorge: string;
    boyd: string;
    fujimoto: string;
    takahira: string;
    schlich: string;
  };
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type BodySurfaceAreaFieldErrors = {
  weight?: string;
  height?: string;
};

/** Screenshot fixture: male, 155 lb, 5 ft 9 in, empty cm. */
export function createDefaultInput(): BodySurfaceAreaInput {
  return {
    sex: 'male',
    weightText: '155',
    weightUnit: 'lb',
    heightFt: '5',
    heightIn: '9',
    heightCm: '',
    heightSource: 'imperial',
  };
}

export function createEmptyInput(): BodySurfaceAreaInput {
  return {
    sex: 'male',
    weightText: '',
    weightUnit: 'lb',
    heightFt: '',
    heightIn: '',
    heightCm: '',
    heightSource: 'imperial',
  };
}

export function inputsEqual(
  a: BodySurfaceAreaInput,
  b: BodySurfaceAreaInput,
): boolean {
  return (
    a.sex === b.sex &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.heightFt === b.heightFt &&
    a.heightIn === b.heightIn &&
    a.heightCm === b.heightCm &&
    a.heightSource === b.heightSource
  );
}
