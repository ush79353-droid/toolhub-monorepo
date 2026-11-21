import type { SupportedCurrency } from '@/tools/shared/currency';

export interface UnleveredFreeCashFlowInput {
  /** Earnings before interest and taxes (before financing costs). */
  ebit: string;
  ebitCurrency: SupportedCurrency;
  /** Effective tax rate as a percent (0–100). Never FX-converted. */
  etr: string;
  /** Depreciation and amortization for the period. */
  da: string;
  daCurrency: SupportedCurrency;
  /** Capital expenditures (positive = spending outflow). */
  capex: string;
  capexCurrency: SupportedCurrency;
  /** Change in operating working capital (positive = cash outflow). */
  changeInWc: string;
  changeInWcCurrency: SupportedCurrency;
  /** Independent display currency for unlevered free cash flow. */
  ufcfCurrency: SupportedCurrency;
}

export interface UnleveredFreeCashFlowResult {
  /** Full-precision NOPAT in the result currency. */
  nopat: number;
  /** Full-precision UFCF in the result currency (may be negative). */
  ufcf: number;
  /** Same UFCF before display rounding. */
  ufcfCanonical: number;
  currency: SupportedCurrency;
  formattedUfcf: string;
  /** True when UFCF < 0. */
  isNegative: boolean;
}

export type UnleveredFreeCashFlowFieldErrors = {
  ebit?: string;
  etr?: string;
  da?: string;
  capex?: string;
  changeInWc?: string;
  form?: string;
};

export function createDefaultInput(): UnleveredFreeCashFlowInput {
  return {
    ebit: '',
    ebitCurrency: 'PKR',
    etr: '',
    da: '',
    daCurrency: 'PKR',
    capex: '',
    capexCurrency: 'PKR',
    changeInWc: '',
    changeInWcCurrency: 'PKR',
    ufcfCurrency: 'PKR',
  };
}
