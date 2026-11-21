import type { SupportedCurrency } from '@/tools/shared/currency';

export interface RealtorCommissionVatInput {
  housePrice: string;
  /** Canonical calculation currency for house price. */
  housePriceCurrency: SupportedCurrency;
  commissionPercent: string;
  vatRatePercent: string;
  /** Independent display currency for commission gross. */
  commissionGrossCurrency: SupportedCurrency;
  /** Independent display currency for owner receives. */
  ownerReceivesCurrency: SupportedCurrency;
  breakdownOpen: boolean;
}

export interface RealtorCommissionVatResult {
  /** Full-precision amounts in house-price currency. */
  netCommissionInHouseCurrency: number;
  vatAmountInHouseCurrency: number;
  commissionGrossInHouseCurrency: number;
  ownerReceivesInHouseCurrency: number;
  /** Display amounts after FX into independent result currencies. */
  commissionGross: number;
  ownerReceives: number;
  housePriceCurrency: SupportedCurrency;
  commissionGrossCurrency: SupportedCurrency;
  ownerReceivesCurrency: SupportedCurrency;
  formattedNetCommission: string;
  formattedVatAmount: string;
  formattedCommissionGross: string;
  formattedOwnerReceives: string;
}

export type RealtorCommissionVatFieldErrors = {
  housePrice?: string;
  commissionPercent?: string;
  vatRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): RealtorCommissionVatInput {
  return {
    housePrice: '250000',
    housePriceCurrency: 'PKR',
    commissionPercent: '3',
    vatRatePercent: '20',
    commissionGrossCurrency: 'PKR',
    ownerReceivesCurrency: 'PKR',
    breakdownOpen: false,
  };
}
