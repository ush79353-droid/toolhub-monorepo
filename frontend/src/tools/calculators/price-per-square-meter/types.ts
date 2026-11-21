import type { SupportedCurrency } from '@/tools/shared/currency';
import type {
  AreaUnit,
  PricePerAreaMode,
  PricingContext,
  RentalPeriod,
} from '@/tools/shared/price-per-area';

export type { AreaUnit, PricingContext, RentalPeriod };
export type CalculationMode = PricePerAreaMode;

export interface PricePerSqmInput {
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

export interface PricePerSqmResult {
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

  absoluteDifference: number | null;
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

export type PricePerSqmFieldErrors = {
  price?: string;
  area?: string;
  pricePerArea?: string;
  secondPrice?: string;
  secondArea?: string;
  secondPricePerArea?: string;
  form?: string;
};

export function createDefaultInput(): PricePerSqmInput {
  return {
    calculationMode: 'pricePerArea',
    pricingContext: 'purchase',
    rentalPeriod: 'monthly',
    currency: 'PKR',
    price: '',
    area: '',
    pricePerArea: '',
    areaUnit: 'm2',
    compareSecondProperty: false,
    secondPrice: '',
    secondArea: '',
    secondPricePerArea: '',
    secondAreaUnit: 'm2',
  };
}
