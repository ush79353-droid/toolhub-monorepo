import type { SupportedCurrency } from '@/tools/shared/currency';

export type CurrentRatioMode =
  | 'currentRatio'
  | 'currentAssets'
  | 'currentLiabilities';

export type CurrentRatioStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroDenominator'
  | 'nonUnique';

export interface CurrentRatioInput {
  mode: CurrentRatioMode;
  currentAssets: string;
  currentLiabilities: string;
  currentRatio: string;
  currency: SupportedCurrency;
}

export interface CurrentRatioResult {
  currentAssets: number;
  currentLiabilities: number;
  currentRatio: number;
  workingCapital: number;
  status: CurrentRatioStatus;
  interpretation: string;
  currency: SupportedCurrency;
  formattedCurrentAssets: string;
  formattedCurrentLiabilities: string;
  formattedCurrentRatio: string;
  formattedCurrentRatioColon: string;
  formattedWorkingCapital: string;
}

export type CurrentRatioFieldErrors = {
  currentAssets?: string;
  currentLiabilities?: string;
  currentRatio?: string;
  form?: string;
};

export function createDefaultInput(): CurrentRatioInput {
  return {
    mode: 'currentRatio',
    currentAssets: '',
    currentLiabilities: '',
    currentRatio: '',
    currency: 'PKR',
  };
}
