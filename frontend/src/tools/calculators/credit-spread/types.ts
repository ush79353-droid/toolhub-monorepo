export type CreditSpreadSolveTarget =
  | 'spread'
  | 'corporateYield'
  | 'governmentYield';

export type SpreadInputUnit = 'percentagePoints' | 'basisPoints';

export interface CreditSpreadInput {
  solveTarget: CreditSpreadSolveTarget;
  corporateBondYield: string;
  governmentBondYield: string;
  /** Spread entered when solving for a yield — unit selected separately */
  creditSpread: string;
  spreadInputUnit: SpreadInputUnit;
}

export interface CreditSpreadResult {
  solveTarget: CreditSpreadSolveTarget;
  corporateBondYield: number;
  governmentBondYield: number;
  spreadPercentagePoints: number;
  spreadBasisPoints: number;
  formattedCorporateYield: string;
  formattedGovernmentYield: string;
  formattedSpreadPp: string;
  formattedSpreadBps: string;
  signLabel: 'positive' | 'zero' | 'negative';
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type CreditSpreadFieldErrors = {
  form?: string;
  corporateBondYield?: string;
  governmentBondYield?: string;
  creditSpread?: string;
};

export function createDefaultInput(): CreditSpreadInput {
  return {
    solveTarget: 'spread',
    corporateBondYield: '',
    governmentBondYield: '',
    creditSpread: '',
    spreadInputUnit: 'basisPoints',
  };
}

export function createEmptyInput(): CreditSpreadInput {
  return createDefaultInput();
}

/** Omni-style example: 5.30% − 1.80% = 350 bps. */
export function createExampleInput(): CreditSpreadInput {
  return {
    solveTarget: 'spread',
    corporateBondYield: '5.30',
    governmentBondYield: '1.80',
    creditSpread: '',
    spreadInputUnit: 'basisPoints',
  };
}
