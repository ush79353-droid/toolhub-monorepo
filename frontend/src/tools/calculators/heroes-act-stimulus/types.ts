export type FilingStatus = 'single' | 'married' | 'head_of_household';

export interface HeroesStimulusInput {
  filingStatus: FilingStatus;
  dependents: string;
  agi: string;
}

export interface HeroesStimulusResult {
  /** Hypothetical HEROES Act rebate in whole USD. */
  paymentUsd: number;
  formattedPayment: string;
  baseAmount: number;
  dependentAmount: number;
  eligibleDependents: number;
  phaseoutReduction: number;
  phaseoutThreshold: number;
  isHistoricalHypothetical: true;
}

export type HeroesStimulusFieldErrors = {
  dependents?: string;
  agi?: string;
  form?: string;
};

export function createDefaultInput(): HeroesStimulusInput {
  return {
    filingStatus: 'single',
    dependents: '0',
    agi: '',
  };
}
