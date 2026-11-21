import type { SupportedCurrency } from '@/tools/shared/currency';

/** Standard listed equity option: one contract = 100 shares. */
export const EQUITY_OPTION_CONTRACT_MULTIPLIER = 100;

export type OptionMode = 'call' | 'put';

export interface CallOptionInput {
  mode: OptionMode;
  /** Current underlying price or price target for P/L context. */
  assetPrice: string;
  strikePrice: string;
  /** Quoted option premium per share. */
  optionPrice: string;
  contracts: string;
  currency: SupportedCurrency;
}

export interface CallOptionResult {
  mode: OptionMode;
  currency: SupportedCurrency;
  assetPrice: number;
  strikePrice: number;
  optionPrice: number;
  contracts: number;
  contractMultiplier: number;
  /** Total premium outlay = optionPrice × multiplier × contracts. */
  totalPremiumCost: number;
  /** Call: K + premium; Put: K − premium (per share). */
  breakEvenPrice: number;
  /** Call: max(0, S−K); Put: max(0, K−S) per share. */
  intrinsicPerShare: number;
  /** optionPrice − intrinsicPerShare (can be negative if quote &lt; intrinsic). */
  timeValuePerShare: number;
  /** (intrinsicPerShare − optionPrice) × multiplier × contracts at the given asset/target price. */
  profitLossAtAsset: number;
  moneyness: 'itm' | 'atm' | 'otm';
  formattedTotalPremiumCost: string;
  formattedBreakEvenPrice: string;
  formattedIntrinsicPerShare: string;
  formattedTimeValuePerShare: string;
  formattedProfitLossAtAsset: string;
  explanation: string;
}

export type CallOptionFieldErrors = {
  form?: string;
  assetPrice?: string;
  strikePrice?: string;
  optionPrice?: string;
  contracts?: string;
};

/** Worked example: call · S 100 · K 100 · premium 5 · 1 contract → total 500. */
export function createDefaultInput(): CallOptionInput {
  return {
    mode: 'call',
    assetPrice: '100',
    strikePrice: '100',
    optionPrice: '5',
    contracts: '1',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR',
  mode: OptionMode = 'call'
): CallOptionInput {
  return {
    mode,
    assetPrice: '',
    strikePrice: '',
    optionPrice: '',
    contracts: '',
    currency,
  };
}
