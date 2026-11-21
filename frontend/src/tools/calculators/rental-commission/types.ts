import type { SupportedCurrency } from '@/tools/shared/currency';

export type RentSource = 'annual' | 'monthly';

export interface RentalCommissionInput {
  annualRent: string;
  annualCurrency: SupportedCurrency;
  monthlyRent: string;
  monthlyCurrency: SupportedCurrency;
  /** Which rent field the user last edited — drives annual↔monthly sync. */
  rentSource: RentSource;
  customPercent: string;
  halfMonthCurrency: SupportedCurrency;
  oneMonthCurrency: SupportedCurrency;
  oneHalfMonthCurrency: SupportedCurrency;
  customAmountCurrency: SupportedCurrency;
}

export interface RentalCommissionResult {
  /** Canonical annual rent in annualCurrency (full precision). */
  annualRentCanonical: number;
  /** Canonical monthly rent in annualCurrency (full precision). */
  monthlyRentCanonical: number;
  halfMonthCanonical: number;
  oneMonthCanonical: number;
  oneHalfMonthCanonical: number;
  customAmountCanonical: number;
  halfMonth: number;
  oneMonth: number;
  oneHalfMonth: number;
  customAmount: number;
  annualCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  halfMonthCurrency: SupportedCurrency;
  oneMonthCurrency: SupportedCurrency;
  oneHalfMonthCurrency: SupportedCurrency;
  customAmountCurrency: SupportedCurrency;
  formattedHalfMonth: string;
  formattedOneMonth: string;
  formattedOneHalfMonth: string;
  formattedCustomAmount: string;
  formattedAnnualRent: string;
  formattedMonthlyRent: string;
  customPercent: number;
}

export type RentalCommissionFieldErrors = {
  annualRent?: string;
  monthlyRent?: string;
  customPercent?: string;
  form?: string;
};

export function createDefaultInput(): RentalCommissionInput {
  return {
    annualRent: '',
    annualCurrency: 'PKR',
    monthlyRent: '',
    monthlyCurrency: 'PKR',
    rentSource: 'annual',
    customPercent: '15',
    halfMonthCurrency: 'PKR',
    oneMonthCurrency: 'PKR',
    oneHalfMonthCurrency: 'PKR',
    customAmountCurrency: 'PKR',
  };
}
