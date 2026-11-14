import type { SupportedCurrency } from '@/tools/shared/currency';

export const MAX_MONEY = 1_000_000_000_000_000;
export const MAX_SEATS = 1_000_000_000_000;
export const MAX_YEARS = 100;
export const MAX_MONTHS = 1200;

export interface SoftwareContractValueInput {
  retailPrice: number | null;
  seats: number | null;
  discountPercent: number | null;
  durationYears: number | null;
  durationMonths: number | null;
  currency: SupportedCurrency;
}

export interface SoftwareContractValueResult {
  retailPrice: number;
  seats: number;
  discountPercent: number;
  discountAmount: number;
  discountedPrice: number;
  monthlyCost: number;
  annualCost: number;
  contractMonths: number;
  contractValue: number;
  durationYears: number;
  durationMonths: number;
  currency: SupportedCurrency;
}

export type SoftwareContractValueField =
  | 'retailPrice'
  | 'seats'
  | 'discountPercent'
  | 'durationYears'
  | 'durationMonths'
  | 'currency';

export type SoftwareContractValueFieldErrors = Partial<
  Record<SoftwareContractValueField, string>
>;

export const DEFAULT_CURRENCY = 'PKR' as const;
