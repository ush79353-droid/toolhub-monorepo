export type FilingStatus = 'single' | 'married';

export interface StudentLoanForgivenessInput {
  filingStatus: FilingStatus;
  annualIncome: string;
  receivedPellGrants: boolean;
  outstandingStudentDebt: string;
}

export type StudentLoanForgivenessFieldErrors = {
  annualIncome?: string;
  outstandingStudentDebt?: string;
  form?: string;
};

/**
 * No computed forgiveness result: historical 2022 relief rules are not verified
 * in project/reference data and must not be presented as current benefits.
 */
export interface StudentLoanForgivenessResult {
  historicalNotice: string;
}

export function createDefaultInput(): StudentLoanForgivenessInput {
  return {
    filingStatus: 'single',
    annualIncome: '',
    receivedPellGrants: false,
    outstandingStudentDebt: '',
  };
}

export const HISTORICAL_PROGRAM_NOTICE =
  'Historical / Not Currently Available — This form mirrors fields from the blocked 2022 U.S. federal student debt relief proposal. Verified eligibility thresholds, Pell Grant distinctions, and forgiveness caps are not defined in available project/reference data, so no forgiveness amount is estimated. This is not an active government benefit calculator.';
