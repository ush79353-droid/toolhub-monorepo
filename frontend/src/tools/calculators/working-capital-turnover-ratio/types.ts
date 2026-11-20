import type { SupportedCurrency } from '@/tools/shared/currency';

export type WctrStatus =
  | 'valid'
  | 'partial'
  | 'incomplete'
  | 'invalid'
  | 'zeroAverageWc'
  | 'negativeAverageWc';

export interface WorkingCapitalTurnoverRatioInput {
  openingCurrentAssets: string;
  closingCurrentAssets: string;
  openingCurrentLiabilities: string;
  closingCurrentLiabilities: string;
  revenue: string;
  currency: SupportedCurrency;
}

export interface WorkingCapitalTurnoverRatioResult {
  openingCurrentAssets: number;
  closingCurrentAssets: number;
  averageCurrentAssets: number;
  openingCurrentLiabilities: number;
  closingCurrentLiabilities: number;
  averageCurrentLiabilities: number;
  averageWorkingCapital: number;
  revenue: number | null;
  workingCapitalTurnover: number | null;
  status: WctrStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedOpeningCurrentAssets: string;
  formattedClosingCurrentAssets: string;
  formattedAverageCurrentAssets: string;
  formattedOpeningCurrentLiabilities: string;
  formattedClosingCurrentLiabilities: string;
  formattedAverageCurrentLiabilities: string;
  formattedAverageWorkingCapital: string;
  formattedRevenue: string | null;
  formattedWorkingCapitalTurnover: string | null;
}

export type WorkingCapitalTurnoverRatioFieldErrors = {
  openingCurrentAssets?: string;
  closingCurrentAssets?: string;
  openingCurrentLiabilities?: string;
  closingCurrentLiabilities?: string;
  revenue?: string;
  form?: string;
};

export function createDefaultInput(): WorkingCapitalTurnoverRatioInput {
  return {
    openingCurrentAssets: '',
    closingCurrentAssets: '',
    openingCurrentLiabilities: '',
    closingCurrentLiabilities: '',
    revenue: '',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): WorkingCapitalTurnoverRatioInput {
  return {
    openingCurrentAssets: '',
    closingCurrentAssets: '',
    openingCurrentLiabilities: '',
    closingCurrentLiabilities: '',
    revenue: '',
    currency,
  };
}
