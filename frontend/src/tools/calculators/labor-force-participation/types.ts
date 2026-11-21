export type WorkingAgeDefinition =
  | 'us-16-plus'
  | 'intl-15-plus'
  | 'ages-15-64'
  | 'prime-25-54'
  | 'other';

export const WORKING_AGE_DEFINITIONS: {
  id: WorkingAgeDefinition;
  label: string;
}[] = [
  {
    id: 'us-16-plus',
    label: 'US civilian noninstitutional 16+ (BLS-style)',
  },
  { id: 'intl-15-plus', label: 'Ages 15 and older (common international)' },
  { id: 'ages-15-64', label: 'Ages 15–64' },
  { id: 'prime-25-54', label: 'Prime-age 25–54' },
  { id: 'other', label: 'Other / custom coverage' },
];

export interface LfprInput {
  employedPopulation: string;
  unemployedPopulation: string;
  workingAgePopulation: string;
  workingAgeDefinition: WorkingAgeDefinition;
}

export interface LfprResult {
  employedPopulation: number;
  unemployedPopulation: number;
  workingAgePopulation: number;
  laborForce: number;
  unemploymentRate: number | null;
  laborForceParticipationRate: number;
  notInLaborForce: number;
  employmentPopulationRatio: number;
  outsideLaborForceShare: number;
  workingAgeDefinitionLabel: string;
  formattedEmployed: string;
  formattedUnemployed: string;
  formattedWorkingAge: string;
  formattedLaborForce: string;
  formattedUnemploymentRate: string;
  formattedLfpr: string;
  formattedNotInLaborForce: string;
  formattedEpr: string;
  formattedOutsideShare: string;
  interpretation: string;
  explanation: string;
  formulaBreakdown: string;
  steps: string[];
}

export type LfprFieldErrors = {
  form?: string;
  employedPopulation?: string;
  unemployedPopulation?: string;
  workingAgePopulation?: string;
};

export function createDefaultInput(): LfprInput {
  return {
    employedPopulation: '',
    unemployedPopulation: '',
    workingAgePopulation: '',
    workingAgeDefinition: 'us-16-plus',
  };
}

export function createEmptyInput(): LfprInput {
  return createDefaultInput();
}

/** Hypothetical teaching example from the brief (not a national statistic). */
export function createExampleInput(): LfprInput {
  return {
    employedPopulation: '5500000',
    unemployedPopulation: '700000',
    workingAgePopulation: '7200000',
    workingAgeDefinition: 'us-16-plus',
  };
}
