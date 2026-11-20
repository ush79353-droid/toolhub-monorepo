import type { SupportedCurrency } from '@/tools/shared/currency';

export type AreaUnit = 'ft2' | 'm2';
export type CalculationMode = 'pricePerArea' | 'totalPrice' | 'area';
export type PricingContext = 'purchase' | 'rent';
export type RentalPeriod = 'monthly' | 'annually';

export interface PricePerSqftInput {
  calculationMode: CalculationMode;
  pricingContext: PricingContext;
  rentalPeriod: RentalPeriod;
  currency: SupportedCurrency;

  price: string;
  area: string;
  pricePerArea: string;
  areaUnit: AreaUnit;

  compareSecondProperty: boolean;
  secondPrice: string;
  secondArea: string;
  secondPricePerArea: string;
  secondAreaUnit: AreaUnit;
}

export interface PricePerSqftResult {
  price: number;
  area: number;
  pricePerArea: number;
  areaUnit: AreaUnit;
  pricingContext: PricingContext;
  rentalPeriod: RentalPeriod | null;
  currency: SupportedCurrency;

  secondEnabled: boolean;
  secondPrice: number | null;
  secondArea: number | null;
  secondPricePerArea: number | null;
  secondAreaUnit: AreaUnit | null;

  /** Absolute difference (B − A) in primary property's area unit. */
  absoluteDifference: number | null;
  /** Percentage difference vs property A: ((B/A) − 1) × 100. */
  percentageDifference: number | null;
  cheaperLabel: string | null;

  formattedPrice: string;
  formattedArea: string;
  formattedPricePerArea: string;
  pricePerAreaUnitLabel: string;
  formattedSecondPrice: string | null;
  formattedSecondArea: string | null;
  formattedSecondPricePerArea: string | null;
  secondPricePerAreaUnitLabel: string | null;
  formattedAbsoluteDifference: string | null;
  formattedPercentageDifference: string | null;
}

export type PricePerSqftFieldErrors = {
  price?: string;
  area?: string;
  pricePerArea?: string;
  secondPrice?: string;
  secondArea?: string;
  secondPricePerArea?: string;
  form?: string;
};

export function createDefaultInput(): PricePerSqftInput {
  return {
    calculationMode: 'pricePerArea',
    pricingContext: 'purchase',
    rentalPeriod: 'monthly',
    currency: 'PKR',
    price: '',
    area: '',
    pricePerArea: '',
    areaUnit: 'ft2',
    compareSecondProperty: false,
    secondPrice: '',
    secondArea: '',
    secondPricePerArea: '',
    secondAreaUnit: 'ft2',
  };
}
