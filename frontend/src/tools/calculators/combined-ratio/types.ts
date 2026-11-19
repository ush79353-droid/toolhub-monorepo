import type { SupportedCurrency } from '@/tools/shared/currency';

/**
 * Last edited field drives reverse/forward solve.
 * Standard path: claimLoss / lossAdjustments / premiums / underwritingExpense.
 */
export type CombinedRatioDriver =
  | 'claimLoss'
  | 'lossAdjustments'
  | 'lossExpense'
  | 'premiums'
  | 'underwritingExpense'
  | 'combinedRatio';

/** When loss expense is edited, which loss component stays fixed. */
export type FixedLossComponent = 'claimLoss' | 'lossAdjustments';

/** When combined ratio is edited, which money field to solve. */
export type RatioSolveTarget = 'underwritingExpense' | 'premiums' | 'lossExpense';

export interface CombinedRatioInput {
  claimLoss: string;
  lossAdjustments: string;
  lossExpense: string;
  premiums: string;
  underwritingExpense: string;
  combinedRatio: string;
  driver: CombinedRatioDriver;
  fixedLossComponent: FixedLossComponent;
  ratioSolveTarget: RatioSolveTarget;
  currency: SupportedCurrency;
}

export type UnderwritingStatus = 'profit' | 'breakeven' | 'loss';

export interface CombinedRatioResult {
  claimLoss: number;
  lossAdjustments: number;
  lossExpense: number;
  premiums: number;
  underwritingExpense: number;
  lossRatio: number;
  expenseRatio: number;
  combinedRatio: number;
  underwritingResult: number;
  underwritingMargin: number;
  status: UnderwritingStatus;
  currency: SupportedCurrency;
  formattedClaimLoss: string;
  formattedLossAdjustments: string;
  formattedLossExpense: string;
  formattedPremiums: string;
  formattedUnderwritingExpense: string;
  formattedUnderwritingResult: string;
  formattedLossRatio: string;
  formattedExpenseRatio: string;
  formattedCombinedRatio: string;
  formattedUnderwritingMargin: string;
}

export type CombinedRatioFieldErrors = {
  claimLoss?: string;
  lossAdjustments?: string;
  lossExpense?: string;
  premiums?: string;
  underwritingExpense?: string;
  combinedRatio?: string;
  form?: string;
};

export function createDefaultInput(): CombinedRatioInput {
  return {
    claimLoss: '',
    lossAdjustments: '',
    lossExpense: '',
    premiums: '',
    underwritingExpense: '',
    combinedRatio: '',
    driver: 'claimLoss',
    fixedLossComponent: 'lossAdjustments',
    ratioSolveTarget: 'underwritingExpense',
    currency: 'USD',
  };
}

/** Example A — profitable underwriting (CR 70%). */
export function createExampleAInput(): CombinedRatioInput {
  return {
    ...createDefaultInput(),
    claimLoss: '40000000',
    lossAdjustments: '5000000',
    premiums: '100000000',
    underwritingExpense: '25000000',
    driver: 'claimLoss',
  };
}
