export type UnitSystem = 'us' | 'metric';

export interface HealthyWeightInput {
  unitSystem: UnitSystem;
  /** Metric height in cm. */
  heightCm: string;
  /** US height feet part. */
  heightFt: string;
  /** US height inches part. */
  heightIn: string;
}

export interface HealthyWeightResult {
  heightMeters: number;
  /** Inclusive lower weight (BMI 18.5) in kg. */
  minKg: number;
  /** Exclusive upper weight (BMI 25) in kg — not in the healthy band. */
  maxExclusiveKg: number;
  formattedRange: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type HealthyWeightFieldErrors = {
  height?: string;
};

/** Screenshot fixture: Metric Units, height 180 cm. */
export function createDefaultInput(): HealthyWeightInput {
  return {
    unitSystem: 'metric',
    heightCm: '180',
    heightFt: '5',
    heightIn: '11',
  };
}

export function createEmptyInput(): HealthyWeightInput {
  return {
    unitSystem: 'metric',
    heightCm: '',
    heightFt: '',
    heightIn: '',
  };
}

export function inputsEqual(
  a: HealthyWeightInput,
  b: HealthyWeightInput,
): boolean {
  return (
    a.unitSystem === b.unitSystem &&
    a.heightCm === b.heightCm &&
    a.heightFt === b.heightFt &&
    a.heightIn === b.heightIn
  );
}
