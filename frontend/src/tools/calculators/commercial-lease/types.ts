import type { SupportedCurrency } from '@/tools/shared/currency';

export type AreaUnit = 'm2' | 'ft2';
export type RatePeriod = 'yr' | 'mo';
export type RentPeriod = 'yr' | 'mo';

export interface CommercialLeaseInput {
  area: string;
  areaUnit: AreaUnit;
  baseRate: string;
  baseCurrency: SupportedCurrency;
  baseAreaUnit: AreaUnit;
  basePeriod: RatePeriod;
  opex: string;
  opexCurrency: SupportedCurrency;
  opexAreaUnit: AreaUnit;
  opexPeriod: RatePeriod;
  totalRateCurrency: SupportedCurrency;
  totalRateAreaUnit: AreaUnit;
  totalRatePeriod: RatePeriod;
  rentCurrency: SupportedCurrency;
  rentPeriod: RentPeriod;
  agentPercent: string;
  agentYears: string;
  feeCurrency: SupportedCurrency;
}

export interface CommercialLeaseResult {
  /** Total rate per m² per year in baseCurrency (canonical engine currency). */
  totalRatePerM2PerYearCanonical: number;
  /** Annual rent in baseCurrency. */
  annualRentCanonical: number;
  /** Agent fee in baseCurrency. */
  feeCanonical: number;
  totalRateDisplay: number;
  rentDisplay: number;
  feeDisplay: number;
  totalRateCurrency: SupportedCurrency;
  totalRateAreaUnit: AreaUnit;
  totalRatePeriod: RatePeriod;
  rentCurrency: SupportedCurrency;
  rentPeriod: RentPeriod;
  feeCurrency: SupportedCurrency;
  formattedTotalRate: string;
  formattedRent: string;
  formattedFee: string;
  agentPercent: number;
  agentYears: number;
  areaM2: number;
}

export type CommercialLeaseFieldErrors = {
  area?: string;
  baseRate?: string;
  opex?: string;
  agentPercent?: string;
  agentYears?: string;
  form?: string;
};

export function createDefaultInput(): CommercialLeaseInput {
  return {
    area: '',
    areaUnit: 'm2',
    baseRate: '',
    baseCurrency: 'PKR',
    baseAreaUnit: 'm2',
    basePeriod: 'yr',
    opex: '',
    opexCurrency: 'PKR',
    opexAreaUnit: 'm2',
    opexPeriod: 'yr',
    totalRateCurrency: 'PKR',
    totalRateAreaUnit: 'm2',
    totalRatePeriod: 'yr',
    rentCurrency: 'PKR',
    rentPeriod: 'yr',
    agentPercent: '6',
    agentYears: '2',
    feeCurrency: 'PKR',
  };
}
