import type { SupportedCurrency } from '@/tools/shared/currency';

export interface BondEquivalentYieldInput {
  bondPrice: string;
  /** Independent currency of the entered bond price. */
  bondPriceCurrency: SupportedCurrency;
  faceValue: string;
  /** Canonical calculation currency for face value (and normalized bond price). */
  faceValueCurrency: SupportedCurrency;
  daysToMaturity: string;
}

export interface BondEquivalentYieldResult {
  /** Full-precision BEY percent (investment basis, 365-day year). */
  beyPercent: number;
  formattedBeyPercent: string;
  faceValueCurrency: SupportedCurrency;
  bondPriceCurrency: SupportedCurrency;
  /** Bond price normalized into face-value currency (full precision). */
  bondPriceInFaceCurrency: number;
  faceValue: number;
  daysToMaturity: number;
}

export type BondEquivalentYieldFieldErrors = {
  bondPrice?: string;
  faceValue?: string;
  daysToMaturity?: string;
  form?: string;
};

export function createDefaultInput(): BondEquivalentYieldInput {
  return {
    bondPrice: '980',
    bondPriceCurrency: 'PKR',
    faceValue: '1000',
    faceValueCurrency: 'PKR',
    daysToMaturity: '180',
  };
}
