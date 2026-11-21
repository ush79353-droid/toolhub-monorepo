import type { SupportedCurrency } from '@/tools/shared/currency';

export interface OperatingCashFlowInput {
  netIncome: string;
  netIncomeCurrency: SupportedCurrency;
  depreciation: string;
  depreciationCurrency: SupportedCurrency;
  amortization: string;
  amortizationCurrency: SupportedCurrency;
  /** Ending − beginning inventory balance (ΔInv). */
  changeInInventories: string;
  changeInInventoriesCurrency: SupportedCurrency;
  /** Ending − beginning accounts receivable (ΔAR). */
  changeInAr: string;
  changeInArCurrency: SupportedCurrency;
  /** Ending − beginning accounts payable (ΔAP). */
  changeInAp: string;
  changeInApCurrency: SupportedCurrency;
  /**
   * Change in income tax payable (ending − beginning), not an absolute
   * tax-payable balance.
   */
  incomeTaxPayable: string;
  incomeTaxPayableCurrency: SupportedCurrency;
  netOtherCashFlows: string;
  netOtherCashFlowsCurrency: SupportedCurrency;
  /** Independent display currency for the WC cash-adjustment result. */
  changeInOperatingWcCurrency: SupportedCurrency;
  /** Calculation / display currency for operating cash flow. */
  operatingCashFlowCurrency: SupportedCurrency;
  /** Collapsed by default — no invented balance-change fields. */
  balanceChangesOpen: boolean;
}

export interface OperatingCashFlowResult {
  /** WC cash adjustment in OCF currency (full precision). */
  workingCapitalCashAdjustment: number;
  /** Same adjustment re-expressed in changeInOperatingWcCurrency. */
  changeInOperatingWc: number;
  changeInOperatingWcCurrency: SupportedCurrency;
  formattedChangeInOperatingWc: string;
  /** Operating cash flow in OCF currency (full precision; may be negative). */
  operatingCashFlow: number;
  operatingCashFlowCanonical: number;
  operatingCashFlowCurrency: SupportedCurrency;
  formattedOperatingCashFlow: string;
  isNegativeOcf: boolean;
}

export type OperatingCashFlowFieldErrors = {
  netIncome?: string;
  depreciation?: string;
  amortization?: string;
  changeInInventories?: string;
  changeInAr?: string;
  changeInAp?: string;
  incomeTaxPayable?: string;
  netOtherCashFlows?: string;
  form?: string;
};

export function createDefaultInput(): OperatingCashFlowInput {
  return {
    netIncome: '',
    netIncomeCurrency: 'PKR',
    depreciation: '',
    depreciationCurrency: 'PKR',
    amortization: '',
    amortizationCurrency: 'PKR',
    changeInInventories: '',
    changeInInventoriesCurrency: 'PKR',
    changeInAr: '',
    changeInArCurrency: 'PKR',
    changeInAp: '',
    changeInApCurrency: 'PKR',
    incomeTaxPayable: '',
    incomeTaxPayableCurrency: 'PKR',
    netOtherCashFlows: '',
    netOtherCashFlowsCurrency: 'PKR',
    changeInOperatingWcCurrency: 'PKR',
    operatingCashFlowCurrency: 'PKR',
    balanceChangesOpen: false,
  };
}
