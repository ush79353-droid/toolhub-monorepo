export type FilingStatus = 'single' | 'married' | 'head_of_household';
export type YesNo = 'yes' | 'no';

export interface StimulusCheckInput {
  filed2019Taxes: YesNo;
  filingStatus: FilingStatus;
  kids: string;
  agi: string;
}

export interface StimulusCheckResult {
  /** Historical EIP1 estimate in whole USD. */
  paymentUsd: number;
  formattedPayment: string;
  baseAmount: number;
  childAmount: number;
  phaseoutReduction: number;
  phaseoutThreshold: number;
  /** True when filed2019Taxes is no — SSI/VA/RRB automatic paths are not modeled. */
  ineligibleNoFiling: boolean;
  isHistoricalEstimate: true;
}

export type StimulusCheckFieldErrors = {
  kids?: string;
  agi?: string;
  form?: string;
};

export function createDefaultInput(): StimulusCheckInput {
  return {
    filed2019Taxes: 'yes',
    filingStatus: 'single',
    kids: '0',
    agi: '',
  };
}
