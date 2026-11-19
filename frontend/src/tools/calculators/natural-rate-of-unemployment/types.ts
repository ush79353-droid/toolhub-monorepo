export const POPULATION_UNITS = ['people', 'thousand', 'million'] as const;
export type PopulationUnit = (typeof POPULATION_UNITS)[number];

/** Multipliers to convert a displayed amount into a count of people. */
export const POPULATION_UNIT_FACTOR: Record<PopulationUnit, number> = {
  people: 1,
  thousand: 1_000,
  million: 1_000_000,
};

export const POPULATION_UNIT_LABEL: Record<PopulationUnit, string> = {
  people: 'people',
  thousand: 'thousand',
  million: 'million',
};

export interface NaturalUnemploymentInput {
  frictional: string;
  frictionalUnit: PopulationUnit;
  structural: string;
  structuralUnit: PopulationUnit;
  laborForce: string;
  laborForceUnit: PopulationUnit;
}

export interface NaturalUnemploymentResult {
  frictionalPeople: number;
  structuralPeople: number;
  naturalUnemployedPeople: number;
  laborForcePeople: number;
  naturalRatePercent: number;
  formattedNaturalRate: string;
}

export type NaturalUnemploymentFieldErrors = {
  frictional?: string;
  structural?: string;
  laborForce?: string;
  form?: string;
};

export function createDefaultInput(): NaturalUnemploymentInput {
  return {
    frictional: '',
    frictionalUnit: 'million',
    structural: '',
    structuralUnit: 'million',
    laborForce: '',
    laborForceUnit: 'million',
  };
}
