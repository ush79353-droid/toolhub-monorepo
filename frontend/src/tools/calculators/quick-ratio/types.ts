import type { SupportedCurrency } from '@/tools/shared/currency';

export type QuickRatioMethod = 'direct' | 'adjusted';

export type QuickRatioSolveTarget =
  | 'quickRatio'
  | 'requiredQuickAssets'
  | 'currentLiabilities'
  | 'requiredCash';

export interface QuickRatioInput {
  method: QuickRatioMethod;
  solveTarget: QuickRatioSolveTarget;
  currency: SupportedCurrency;
  cashAndCashEquivalents: string;
  marketableSecurities: string;
  accountsReceivable: string;
  currentLiabilities: string;
  /** Adjusted method */
  currentAssets: string;
  inventory: string;
  prepaidExpenses: string;
  otherNonQuickAssets: string;
  /** Reverse */
  targetQuickRatio: string;
}

export interface QuickRatioResult {
  method: QuickRatioMethod;
  solveTarget: QuickRatioSolveTarget;
  currency: SupportedCurrency;
  cashAndCashEquivalents: number;
  marketableSecurities: number;
  accountsReceivable: number;
  quickAssets: number;
  currentLiabilities: number;
  quickRatio: number;
  requiredCash: number | null;
  band: 'below' | 'equal' | 'above';
  formattedCash: string;
  formattedSecurities: string;
  formattedReceivables: string;
  formattedQuickAssets: string;
  formattedLiabilities: string;
  formattedQuickRatio: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type QuickRatioFieldErrors = {
  form?: string;
  cashAndCashEquivalents?: string;
  marketableSecurities?: string;
  accountsReceivable?: string;
  currentLiabilities?: string;
  currentAssets?: string;
  inventory?: string;
  prepaidExpenses?: string;
  otherNonQuickAssets?: string;
  targetQuickRatio?: string;
};

export function createDefaultInput(): QuickRatioInput {
  return {
    method: 'direct',
    solveTarget: 'quickRatio',
    currency: 'PKR',
    cashAndCashEquivalents: '',
    marketableSecurities: '',
    accountsReceivable: '',
    currentLiabilities: '',
    currentAssets: '',
    inventory: '',
    prepaidExpenses: '',
    otherNonQuickAssets: '',
    targetQuickRatio: '',
  };
}

export function createEmptyInput(): QuickRatioInput {
  return createDefaultInput();
}

/** Reference: 150k+50k+100k / 200k = 1.50. */
export function createExampleInput(): QuickRatioInput {
  return {
    method: 'direct',
    solveTarget: 'quickRatio',
    currency: 'PKR',
    cashAndCashEquivalents: '150000',
    marketableSecurities: '50000',
    accountsReceivable: '100000',
    currentLiabilities: '200000',
    currentAssets: '',
    inventory: '',
    prepaidExpenses: '',
    otherNonQuickAssets: '',
    targetQuickRatio: '',
  };
}
