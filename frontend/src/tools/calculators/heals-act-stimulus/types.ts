export type FilingStatus = 'single' | 'married' | 'head_of_household';
export type YesNo = 'yes' | 'no';

export interface HealsStimulusInput {
  filed2019Taxes: YesNo;
  filingStatus: FilingStatus;
  dependents: string;
  agi: string;
}

export interface HealsStimulusResult {
  /** Hypothetical HEALS Act rebate in whole USD. */
  paymentUsd: number;
  formattedPayment: string;
  baseAmount: number;
  dependentAmount: number;
  phaseoutReduction: number;
  phaseoutThreshold: number;
  /** True when filed2019Taxes is no — proposal required filing/benefit paperwork. */
  ineligibleNoFiling: boolean;
  isHistoricalHypothetical: true;
}

export type HealsStimulusFieldErrors = {
  dependents?: string;
  agi?: string;
  form?: string;
};

export function createDefaultInput(): HealsStimulusInput {
  return {
    filed2019Taxes: 'yes',
    filingStatus: 'single',
    dependents: '0',
    agi: '',
  };
}
