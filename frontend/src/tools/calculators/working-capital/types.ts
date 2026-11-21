import type { SupportedCurrency } from '@/tools/shared/currency';

export type WorkingCapitalStatus =
  | 'valid'
  | 'partial'
  | 'incomplete'
  | 'invalid'
  | 'zeroLiabilities'
  | 'zeroAverageWc'
  | 'negativeAverageWc';

export interface WorkingCapitalInput {
  currentAssets: string;
  currentLiabilities: string;
  revenue: string;
  beginningCurrentAssets: string;
  beginningCurrentLiabilities: string;
  endingCurrentAssets: string;
  endingCurrentLiabilities: string;
  currency: SupportedCurrency;
}

export interface WorkingCapitalResult {
  currentAssets: number | null;
  currentLiabilities: number | null;
  workingCapital: number | null;
  workingCapitalRatio: number | null;

  revenue: number | null;
  beginningCurrentAssets: number | null;
  beginningCurrentLiabilities: number | null;
  endingCurrentAssets: number | null;
  endingCurrentLiabilities: number | null;

  beginningWorkingCapital: number | null;
  endingWorkingCapital: number | null;
  averageWorkingCapital: number | null;
  changeInWorkingCapital: number | null;
  workingCapitalTurnoverRatio: number | null;

  status: WorkingCapitalStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;

  formattedCurrentAssets: string | null;
  formattedCurrentLiabilities: string | null;
  formattedWorkingCapital: string | null;
  formattedWorkingCapitalRatio: string | null;
  formattedRevenue: string | null;
  formattedBeginningWorkingCapital: string | null;
  formattedEndingWorkingCapital: string | null;
  formattedAverageWorkingCapital: string | null;
  formattedChangeInWorkingCapital: string | null;
  formattedWorkingCapitalTurnoverRatio: string | null;
}

export type WorkingCapitalFieldErrors = {
  currentAssets?: string;
  currentLiabilities?: string;
  revenue?: string;
  beginningCurrentAssets?: string;
  beginningCurrentLiabilities?: string;
  endingCurrentAssets?: string;
  endingCurrentLiabilities?: string;
  form?: string;
};

export function createDefaultInput(): WorkingCapitalInput {
  return {
    currentAssets: '',
    currentLiabilities: '',
    revenue: '',
    beginningCurrentAssets: '',
    beginningCurrentLiabilities: '',
    endingCurrentAssets: '',
    endingCurrentLiabilities: '',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): WorkingCapitalInput {
  return {
    currentAssets: '',
    currentLiabilities: '',
    revenue: '',
    beginningCurrentAssets: '',
    beginningCurrentLiabilities: '',
    endingCurrentAssets: '',
    endingCurrentLiabilities: '',
    currency,
  };
}
