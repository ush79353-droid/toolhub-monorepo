export type FilingStatus = 'single' | 'married' | 'head_of_household';
export type YesNo = 'yes' | 'no';

export interface AmericanRescuePlanStimulusInput {
  filed2019Or2020Taxes: YesNo;
  filingStatus: FilingStatus;
  dependents: string;
  agi: string;
}

export interface AmericanRescuePlanStimulusResult {
  /** Historical EIP3 estimate in whole USD. */
  paymentUsd: number;
  formattedPayment: string;
  baseAmount: number;
  dependentAmount: number;
  phaseoutReduction: number;
  phaseoutStart: number;
  phaseoutEnd: number;
  /** True when filed2019Or2020Taxes is no — SSI/VA/RRB automatic paths are not modeled. */
  ineligibleNoFiling: boolean;
  isHistoricalEstimate: true;
}

export type AmericanRescuePlanStimulusFieldErrors = {
  dependents?: string;
  agi?: string;
  form?: string;
};

export function createDefaultInput(): AmericanRescuePlanStimulusInput {
  return {
    filed2019Or2020Taxes: 'yes',
    filingStatus: 'single',
    dependents: '0',
    agi: '',
  };
}
