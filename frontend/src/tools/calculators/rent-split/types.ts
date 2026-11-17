import type { SupportedCurrency } from '@/tools/shared/currency';

export type BedroomCount = 1 | 2 | 3;

export interface RentSplitInput {
  totalRent: string;
  currency: SupportedCurrency;
  bedroomCount: BedroomCount;
  /** People per bedroom; index 0 = Bedroom 1. Always length 3; unused slots ignored. */
  people: [string, string, string];
}

export interface BedroomShare {
  bedroom: number;
  people: number;
  share: number;
  formattedShare: string;
}

export interface RentSplitResult {
  totalPeople: number;
  perPersonRent: number;
  formattedPerPersonRent: string;
  bedrooms: BedroomShare[];
  currency: SupportedCurrency;
}

export type RentSplitFieldErrors = {
  totalRent?: string;
  people1?: string;
  people2?: string;
  people3?: string;
  form?: string;
};

export function createDefaultInput(): RentSplitInput {
  return {
    totalRent: '',
    currency: 'PKR',
    bedroomCount: 1,
    people: ['1', '1', '1'],
  };
}
