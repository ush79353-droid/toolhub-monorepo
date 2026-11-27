export type PatientAgeGroup = 'adult' | 'child';
export type WeightUnit = 'kg' | 'lb';

/** Region burn selection — screenshot defaults to Not affected. */
export type RegionBurn =
  | 'none'
  | 'entire'
  | 'front'
  | 'back'
  | 'chest'
  | 'abdomen'
  | 'halfFront'
  | 'halfBack'
  | 'affected';

export interface ParklandInput {
  ageGroup: PatientAgeGroup;
  weightText: string;
  weightUnit: WeightUnit;
  head: RegionBurn;
  torso: RegionBurn;
  arm: RegionBurn;
  leg: RegionBurn;
  groin: RegionBurn;
  additionalArm: RegionBurn;
  additionalLeg: RegionBurn;
}

export interface ParklandResult {
  tbsaPercent: number | null;
  totalMl24h: number | null;
  first8Ml: number | null;
  next16Ml: number | null;
  first8MlPerHour: number | null;
  next16MlPerHour: number | null;
  formattedTbsa: string;
  formattedTotal24h: string;
  formattedFirst8: string;
  formattedNext16: string;
  formattedFirst8Rate: string;
  formattedNext16Rate: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type ParklandFieldErrors = {
  weightText?: string;
};

export function createDefaultInput(): ParklandInput {
  return {
    ageGroup: 'adult',
    weightText: '',
    weightUnit: 'kg',
    head: 'none',
    torso: 'none',
    arm: 'none',
    leg: 'none',
    groin: 'none',
    additionalArm: 'none',
    additionalLeg: 'none',
  };
}

export function createEmptyInput(): ParklandInput {
  return createDefaultInput();
}

export function inputsEqual(a: ParklandInput, b: ParklandInput): boolean {
  return (
    a.ageGroup === b.ageGroup &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.head === b.head &&
    a.torso === b.torso &&
    a.arm === b.arm &&
    a.leg === b.leg &&
    a.groin === b.groin &&
    a.additionalArm === b.additionalArm &&
    a.additionalLeg === b.additionalLeg
  );
}
