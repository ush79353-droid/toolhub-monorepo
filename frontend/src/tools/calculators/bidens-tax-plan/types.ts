export type FilingStatus = 'single' | 'married' | 'head_of_household';

export interface BidensTaxPlanInput {
  age: string;
  agi: string;
  filingStatus: FilingStatus;
  childrenUnder6: string;
  children6to17: string;
  dependents: string;
}

export interface BidensTaxPlanResult {
  /** Estimated federal income tax under TY2022 TCJA baseline (USD). */
  baselineTaxUsd: number;
  /** Estimated federal income tax under AFP (USD; may be negative if refundable CTC exceeds liability). */
  bidenTaxUsd: number;
  /** Effective rate = tax / AGI × 100; null when AGI is 0. */
  baselineEffectiveRatePct: number | null;
  bidenEffectiveRatePct: number | null;
  formattedBaselineTax: string;
  formattedBidenTax: string;
  formattedBaselineRate: string;
  formattedBidenRate: string;
  baselineTaxableIncome: number;
  bidenTaxableIncome: number;
  isHistoricalEstimate: true;
}

export type BidensTaxPlanFieldErrors = {
  age?: string;
  agi?: string;
  childrenUnder6?: string;
  children6to17?: string;
  dependents?: string;
  form?: string;
};

export function createDefaultInput(): BidensTaxPlanInput {
  return {
    age: '',
    agi: '',
    filingStatus: 'single',
    childrenUnder6: '0',
    children6to17: '0',
    dependents: '0',
  };
}
