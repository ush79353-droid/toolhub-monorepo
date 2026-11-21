import type { SupportedCurrency } from '@/tools/shared/currency';

export interface RealEstateCommissionInput {
  /** Sale / house price. */
  housePrice: string;
  housePriceCurrency: SupportedCurrency;
  /** Commission rate as a percent (0–100). Never FX-converted. */
  commissionPercent: string;
  /** Independent display currency for commission amount. */
  commissionAmountCurrency: SupportedCurrency;
  /** Independent display currency for owner net proceeds. */
  ownerReceivesCurrency: SupportedCurrency;
}

export interface RealEstateCommissionResult {
  /** Full-precision commission in house-price currency. */
  commissionAmountCanonical: number;
  /** Full-precision owner proceeds in house-price currency. */
  ownerReceivesCanonical: number;
  /** Commission amount after FX into commissionAmountCurrency. */
  commissionAmount: number;
  /** Owner proceeds after FX into ownerReceivesCurrency. */
  ownerReceives: number;
  housePriceCurrency: SupportedCurrency;
  commissionAmountCurrency: SupportedCurrency;
  ownerReceivesCurrency: SupportedCurrency;
  formattedCommissionAmount: string;
  formattedOwnerReceives: string;
}

export type RealEstateCommissionFieldErrors = {
  housePrice?: string;
  commissionPercent?: string;
  form?: string;
};

export function createDefaultInput(): RealEstateCommissionInput {
  return {
    housePrice: '',
    housePriceCurrency: 'PKR',
    commissionPercent: '',
    commissionAmountCurrency: 'PKR',
    ownerReceivesCurrency: 'PKR',
  };
}
