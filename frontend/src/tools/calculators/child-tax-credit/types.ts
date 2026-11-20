export type FilingStatus = 'single' | 'joint' | 'head_of_household';

export interface ChildTaxCreditInput {
  filingStatus: FilingStatus;
  /** Adjusted gross income (USD). */
  agi: string;
  /** Finished years of age for 1st child (blank = not entered). */
  child1Age: string;
  /** Finished years of age for 2nd child (blank = not entered). */
  child2Age: string;
  /** Children's ages section open (screenshot default open). */
  childrenOpen: boolean;
}

export interface ChildTaxCreditResult {
  taxYear: 2025;
  eligibleChildren: number;
  maxCreditBeforePhaseout: number;
  phaseoutThreshold: number;
  phaseoutReduction: number;
  estimatedCredit: number;
  formattedEstimatedCredit: string;
  formattedPhaseoutReduction: string;
  /** ACTC requires earned income / tax liability not collected here. */
  refundableDeterminable: false;
  refundableNote: string;
  assumptionsNote: string;
}

export type ChildTaxCreditFieldErrors = {
  agi?: string;
  child1Age?: string;
  child2Age?: string;
  form?: string;
};

export function createDefaultInput(): ChildTaxCreditInput {
  return {
    filingStatus: 'single',
    agi: '',
    child1Age: '',
    child2Age: '',
    childrenOpen: true,
  };
}
