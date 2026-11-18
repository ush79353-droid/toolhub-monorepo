import type { SupportedCurrency } from '@/tools/shared/currency';

/** Period for gross rental income amounts. */
export type RentPeriod = 'mo' | 'yr';

export const RENT_PERIOD_OPTIONS: readonly { value: RentPeriod; label: string }[] = [
  { value: 'mo', label: 'mo' },
  { value: 'yr', label: 'yr' },
] as const;

export interface GrossRentMultiplierInput {
  propertyPrice: string;
  propertyPriceCurrency: SupportedCurrency;
  grossRentalIncome: string;
  grossRentalIncomeCurrency: SupportedCurrency;
  rentPeriod: RentPeriod;
}

export interface GrossRentMultiplierResult {
  /** Full-precision annual gross rental income in calc currency. */
  annualGrossRentalIncome: number;
  /** Full-precision property price in calc currency. */
  propertyPriceNormalized: number;
  /** Full-precision GRM (dimensionless). */
  grossRentMultiplier: number;
  calcCurrency: SupportedCurrency;
  formattedGrossRentMultiplier: string;
}

export type GrossRentMultiplierFieldErrors = {
  propertyPrice?: string;
  grossRentalIncome?: string;
  form?: string;
};

export function createDefaultInput(): GrossRentMultiplierInput {
  return {
    propertyPrice: '',
    propertyPriceCurrency: 'PKR',
    grossRentalIncome: '',
    grossRentalIncomeCurrency: 'PKR',
    rentPeriod: 'yr',
  };
}
