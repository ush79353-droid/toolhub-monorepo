import type { SupportedCurrency } from '@/tools/shared/currency';

export type CashBackRewardKind = 'percentage' | 'fixed';

export type CashBackSolveTarget =
  | 'cashBack'
  | 'breakEvenSpend'
  | 'requiredRate';

export interface CashBackInput {
  solveTarget: CashBackSolveTarget;
  currency: SupportedCurrency;
  hasCashbackLimit: boolean;
  cashbackLimit: string;
  purchaseAmount: string;
  rewardKind: CashBackRewardKind;
  cashbackPercentage: string;
  fixedCashback: string;
  /** Break-even mode: find spend to hit limit at a rate */
  breakEvenRate: string;
}

export interface CashBackResult {
  solveTarget: CashBackSolveTarget;
  currency: SupportedCurrency;
  purchaseAmount: number;
  cashbackPercentage: number;
  rewardKind: CashBackRewardKind;
  calculatedCashback: number;
  actualCashback: number;
  hasCashbackLimit: boolean;
  cashbackLimit: number | null;
  cashbackLimitApplied: boolean;
  effectiveCashbackRate: number | null;
  effectivePurchaseCost: number;
  breakEvenSpend: number | null;
  formattedPurchase: string;
  formattedCalculated: string;
  formattedActual: string;
  formattedLimit: string;
  formattedEffectiveRate: string;
  formattedEffectiveCost: string;
  formattedBreakEven: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type CashBackFieldErrors = {
  form?: string;
  cashbackLimit?: string;
  purchaseAmount?: string;
  cashbackPercentage?: string;
  fixedCashback?: string;
  breakEvenRate?: string;
};

export function createDefaultInput(): CashBackInput {
  return {
    solveTarget: 'cashBack',
    currency: 'USD',
    hasCashbackLimit: false,
    cashbackLimit: '',
    purchaseAmount: '',
    rewardKind: 'percentage',
    cashbackPercentage: '',
    fixedCashback: '',
    breakEvenRate: '',
  };
}

export function createEmptyInput(): CashBackInput {
  return createDefaultInput();
}

/** Reference: $500 · 5% → $25 cashback · $475 effective cost. */
export function createExampleInput(): CashBackInput {
  return {
    solveTarget: 'cashBack',
    currency: 'USD',
    hasCashbackLimit: false,
    cashbackLimit: '',
    purchaseAmount: '500',
    rewardKind: 'percentage',
    cashbackPercentage: '5',
    fixedCashback: '',
    breakEvenRate: '',
  };
}
