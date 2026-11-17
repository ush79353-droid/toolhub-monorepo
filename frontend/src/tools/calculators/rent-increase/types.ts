import type { SupportedCurrency } from '@/tools/shared/currency';

export interface RentIncreaseInput {
  currentAnnualRent: string;
  currentRentCurrency: SupportedCurrency;
  averageRentChangePercent: string;
  numberOfYears: string;
  /** Independent display currency for expected future annual rent. */
  futureRentCurrency: SupportedCurrency;
}

export interface RentIncreaseResult {
  /** Full-precision future rent in the current-rent currency. */
  futureAnnualRentInCurrent: number;
  /** Full-precision future rent in the result/display currency. */
  futureAnnualRent: number;
  currentRentCurrency: SupportedCurrency;
  futureRentCurrency: SupportedCurrency;
  formattedFutureAnnualRent: string;
}

export type RentIncreaseFieldErrors = {
  currentAnnualRent?: string;
  averageRentChangePercent?: string;
  numberOfYears?: string;
  form?: string;
};

export function createDefaultRentIncreaseInput(): RentIncreaseInput {
  return {
    currentAnnualRent: '',
    currentRentCurrency: 'PKR',
    averageRentChangePercent: '',
    numberOfYears: '',
    futureRentCurrency: 'PKR',
  };
}
