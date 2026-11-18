export type FilingStatus = 'single' | 'married' | 'head-of-household';

export interface StimulusCheck40kInput {
  filingStatus: FilingStatus;
  dependents: string;
  incomeAgi: string;
}

export interface StimulusCheck40kResult {
  paymentUsd: number;
  formattedPayment: string;
  incomeCapUsd: number;
  eligibleDependents: number;
  basePaymentUsd: number;
  dependentPaymentUsd: number;
  isEligible: boolean;
}

export type StimulusCheck40kFieldErrors = {
  dependents?: string;
  incomeAgi?: string;
  form?: string;
};

export function createDefaultInput(): StimulusCheck40kInput {
  return {
    filingStatus: 'single',
    dependents: '0',
    incomeAgi: '',
  };
}
