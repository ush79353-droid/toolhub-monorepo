export type FilingStatus = 'single' | 'married' | 'head_of_household';
export type YesNo = 'yes' | 'no';

export interface CashActStimulusInput {
  filed2019Taxes: YesNo;
  filingStatus: FilingStatus;
  dependents: string;
  agi: string;
  /** Qualifying children under 17 for the enacted $600 EIP comparison. */
  dependentsUnder17: string;
}

export interface CashActStimulusResult {
  /** Hypothetical CASH Act total rebate in whole USD. */
  paymentUsd: number;
  formattedPayment: string;
  baseAmount: number;
  dependentAmount: number;
  phaseoutReduction: number;
  phaseoutThreshold: number;
  /** Enacted December 2020 $600 EIP estimate (same AGI / filing status). */
  enactedPaymentUsd: number;
  formattedEnactedPayment: string;
  /** CASH Act total minus enacted $600 EIP (floored at $0). */
  additionalUsd: number;
  formattedAdditional: string;
  /** True when filed2019Taxes is no. */
  ineligibleNoFiling: boolean;
  /** True when dependents-under-17 was provided and comparison is shown. */
  hasAdditionalComparison: boolean;
  isHistoricalHypothetical: true;
}

export type CashActStimulusFieldErrors = {
  dependents?: string;
  dependentsUnder17?: string;
  agi?: string;
  form?: string;
};

export function createDefaultInput(): CashActStimulusInput {
  return {
    filed2019Taxes: 'yes',
    filingStatus: 'single',
    dependents: '0',
    agi: '',
    dependentsUnder17: '',
  };
}
