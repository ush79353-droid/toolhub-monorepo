export type HemorrhageShape = 'ellipsoid' | 'irregular';

export type LengthUnit = 'cm';
export type ThicknessUnit = 'mm';

export interface IchVolumeInput {
  lengthCm: string;
  widthCm: string;
  sliceThicknessMm: string;
  numberOfSlices: string;
  shape: HemorrhageShape;
  /** Weighted-slice counts (Kothari). Empty = unused. */
  slicesGe75: string;
  slices25to75: string;
  slicesLt25: string;
}

export interface IchVolumeResult {
  volumeMl: number;
  formattedVolumeMl: string;
  cCm: number;
  weightedSliceCount: number | null;
  usedWeightedSlices: boolean;
  divisor: 2 | 3;
  formulaLabel: string;
  explanation: string;
  disclaimer: string;
}

export type IchVolumeFieldErrors = {
  form?: string;
  lengthCm?: string;
  widthCm?: string;
  sliceThicknessMm?: string;
  numberOfSlices?: string;
  slicesGe75?: string;
  slices25to75?: string;
  slicesLt25?: string;
};

/** Screenshot defaults: blank numerics; ellipsoid/round selected. */
export function createDefaultInput(): IchVolumeInput {
  return {
    lengthCm: '',
    widthCm: '',
    sliceThicknessMm: '',
    numberOfSlices: '',
    shape: 'ellipsoid',
    slicesGe75: '',
    slices25to75: '',
    slicesLt25: '',
  };
}

export function createEmptyInput(): IchVolumeInput {
  return createDefaultInput();
}

/** Prompt acceptance fixture: A=4, B=3, 10×5 mm → 30 mL ABC/2. */
export function createExampleInput(): IchVolumeInput {
  return {
    lengthCm: '4',
    widthCm: '3',
    sliceThicknessMm: '5',
    numberOfSlices: '10',
    shape: 'ellipsoid',
    slicesGe75: '',
    slices25to75: '',
    slicesLt25: '',
  };
}

export function inputsEqual(a: IchVolumeInput, b: IchVolumeInput): boolean {
  return (
    a.lengthCm === b.lengthCm &&
    a.widthCm === b.widthCm &&
    a.sliceThicknessMm === b.sliceThicknessMm &&
    a.numberOfSlices === b.numberOfSlices &&
    a.shape === b.shape &&
    a.slicesGe75 === b.slicesGe75 &&
    a.slices25to75 === b.slices25to75 &&
    a.slicesLt25 === b.slicesLt25
  );
}
