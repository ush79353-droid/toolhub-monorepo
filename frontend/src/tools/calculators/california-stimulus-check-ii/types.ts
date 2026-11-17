export type YesNo = 'yes' | 'no';
export type TaxFileId = 'ssn' | 'itin';
export type PaymentMethod = 'direct-deposit' | 'paper-check';

export interface CaliforniaStimulusCheckIiInput {
  californiaAgi: string;
  californiaResident2020: YesNo;
  taxFileId: TaxFileId;
  qualifiedGssI: YesNo;
  claimedChildDependent: YesNo;
  paymentMethod: PaymentMethod;
  taxFilingDate: string;
}

export type CaliforniaStimulusCheckIiFieldErrors = {
  californiaAgi?: string;
  taxFilingDate?: string;
  form?: string;
};

export type EligibilityStatus =
  | 'eligible'
  | 'ineligible'
  | 'needs-income'
  | 'filing-deadline-issue';

export interface CaliforniaStimulusCheckIiResult {
  eligibilityStatus: EligibilityStatus;
  paymentAmountUsd: number | null;
  formattedPaymentAmount: string | null;
  paymentCategoryLabel: string | null;
  eligibilitySummary: string;
  historicalTimingGuidance: string;
  programClosedNotice: string;
  assumptionsNote: string;
}

export const PROGRAM_CLOSED_NOTICE =
  'Historical program — Golden State Stimulus II payments ended. The Franchise Tax Board reports no new GSS payments have been issued since July 15, 2022. This tool does not claim California is currently accepting applications or distributing these payments.';

export const HISTORICAL_INTRO =
  'On August 27, 2021, Californians began receiving the second round of Golden State Stimulus payments introduced by Gavin Newsom, the governor of California. This stimulus check is expected to provide a short-term financial boost to more than 66% of Californians. This tool helps you calculate the stimulus you are eligible for under the Golden State Stimulus II.';

export const GSS_I_INFO =
  'Golden State Stimulus I was an earlier 2021 California payment (generally tied to CalEITC / lower-income GSS I rules under Welfare & Institutions Code §8150). GSS II payment amounts depend on whether you met those GSS I requirements and whether you claimed a dependent exemption credit on your 2020 California return.';

export function createDefaultInput(): CaliforniaStimulusCheckIiInput {
  return {
    californiaAgi: '',
    californiaResident2020: 'yes',
    taxFileId: 'ssn',
    qualifiedGssI: 'yes',
    claimedChildDependent: 'yes',
    paymentMethod: 'direct-deposit',
    taxFilingDate: '',
  };
}
