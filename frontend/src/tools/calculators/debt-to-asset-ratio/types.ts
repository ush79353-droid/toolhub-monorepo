import type { SupportedCurrency } from '@/tools/shared/currency';

export interface DebtToAssetRatioInput {
  longTermDebt: string;
  longTermDebtCurrency: SupportedCurrency;
  shortTermDebt: string;
  shortTermDebtCurrency: SupportedCurrency;
  /** Display currency for the calculated total debt (independent). */
  totalDebtCurrency: SupportedCurrency;
  totalAssets: string;
  totalAssetsCurrency: SupportedCurrency;
}

export interface DebtToAssetRatioResult {
  /** Total debt in the calculation currency (assets currency). */
  totalDebtInCalc: number;
  /** Total debt converted into `totalDebtCurrency` for display. */
  totalDebtDisplayed: number;
  totalAssetsNormalized: number;
  debtToAssetsRatioPercent: number;
  calcCurrency: SupportedCurrency;
  totalDebtCurrency: SupportedCurrency;
  formattedTotalDebt: string;
  formattedRatioPercent: string;
}

export type DebtToAssetRatioFieldErrors = {
  longTermDebt?: string;
  shortTermDebt?: string;
  totalAssets?: string;
  form?: string;
};

export function createDefaultInput(): DebtToAssetRatioInput {
  return {
    longTermDebt: '',
    longTermDebtCurrency: 'PKR',
    shortTermDebt: '',
    shortTermDebtCurrency: 'PKR',
    totalDebtCurrency: 'PKR',
    totalAssets: '',
    totalAssetsCurrency: 'PKR',
  };
}
