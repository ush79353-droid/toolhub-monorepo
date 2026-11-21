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

/** Which population field the user last edited (drives which of E / U / LF is derived). */
export type UnemploymentDriver = 'employed' | 'unemployed' | 'laborForce';

export interface UnemploymentInput {
  employed: string;
  employedUnit: PopulationUnit;
  unemployed: string;
  unemployedUnit: PopulationUnit;
  laborForce: string;
  laborForceUnit: PopulationUnit;
  /** Working-age population for optional labor-force participation. */
  workingAge: string;
  workingAgeUnit: PopulationUnit;
  driver: UnemploymentDriver;
}

export interface UnemploymentResult {
  employedPeople: number;
  unemployedPeople: number;
  laborForcePeople: number;
  unemploymentRatePercent: number | null;
  formattedUnemploymentRate: string;
  workingAgePeople: number | null;
  participationRatePercent: number | null;
  formattedParticipationRate: string;
  interpretation: string;
}

export type UnemploymentFieldErrors = {
  employed?: string;
  unemployed?: string;
  laborForce?: string;
  workingAge?: string;
  form?: string;
};

export function createDefaultInput(): UnemploymentInput {
  return {
    employed: '',
    employedUnit: 'thousand',
    unemployed: '',
    unemployedUnit: 'thousand',
    laborForce: '',
    laborForceUnit: 'thousand',
    workingAge: '',
    workingAgeUnit: 'thousand',
    driver: 'employed',
  };
}

/** Spec example: 150k employed + 10k unemployed → LF 160k · rate 6.25%. */
export function createExampleInput(): UnemploymentInput {
  return {
    employed: '150',
    employedUnit: 'thousand',
    unemployed: '10',
    unemployedUnit: 'thousand',
    laborForce: '160',
    laborForceUnit: 'thousand',
    workingAge: '250',
    workingAgeUnit: 'thousand',
    driver: 'employed',
  };
}
