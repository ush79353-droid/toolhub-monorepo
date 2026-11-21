import type { SupportedCurrency } from '@/tools/shared/currency';

export interface LeveredFreeCashFlowInput {
  /** Earnings before interest, taxes, depreciation, and amortization. */
  ebitda: string;
  ebitdaCurrency: SupportedCurrency;
  /** Capital expenditures (positive = spending outflow). */
  capex: string;
  capexCurrency: SupportedCurrency;
  /** Net change in working capital (positive = cash outflow). */
  changeInWc: string;
  changeInWcCurrency: SupportedCurrency;
  /** Mandatory debt repayments (positive = cash outflow). */
  debtRepayments: string;
  debtRepaymentsCurrency: SupportedCurrency;
  /** Independent display currency for levered free cash flow. */
  leveredFcfCurrency: SupportedCurrency;
}

export interface LeveredFreeCashFlowResult {
  /** Full-precision levered FCF in the result currency (may be negative). */
  leveredFcf: number;
  /** Same value before display rounding. */
  leveredFcfCanonical: number;
  currency: SupportedCurrency;
  formattedLeveredFcf: string;
  /** True when levered FCF < 0. */
  isNegative: boolean;
}

export type LeveredFreeCashFlowFieldErrors = {
  ebitda?: string;
  capex?: string;
  changeInWc?: string;
  debtRepayments?: string;
  form?: string;
};

export function createDefaultInput(): LeveredFreeCashFlowInput {
  return {
    ebitda: '',
    ebitdaCurrency: 'PKR',
    capex: '',
    capexCurrency: 'PKR',
    changeInWc: '',
    changeInWcCurrency: 'PKR',
    debtRepayments: '',
    debtRepaymentsCurrency: 'PKR',
    leveredFcfCurrency: 'PKR',
  };
}
