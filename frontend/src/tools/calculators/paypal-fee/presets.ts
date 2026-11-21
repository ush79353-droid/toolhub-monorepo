/**
 * PayPal fee presets — maintainable config (not scraped at request time).
 * Rates are labeled with effective dates and official source URLs.
 * Unverified regions use Custom mode only.
 */

import type { SupportedCurrency } from '@/tools/shared/currency';

export type PayPalRegionId = 'US' | 'UK' | 'CUSTOM';

export type PayPalTransactionTypeId =
  | 'paypal_checkout'
  | 'goods_and_services'
  | 'card_payments'
  | 'qr_code'
  | 'other_commercial'
  | 'uk_other_commercial'
  | 'uk_qr_high'
  | 'uk_qr_low'
  | 'custom';

export type PayPalLocation = 'domestic' | 'international';

export interface PayPalFeePreset {
  id: string;
  region: PayPalRegionId;
  transactionType: PayPalTransactionTypeId;
  /** Percentage of gross (before international add-on). */
  percentageFee: number;
  /** When true, fixed fee comes from currencyFixedFees; otherwise 0. */
  usesCurrencyFixedFee: boolean;
  /** Fallback fixed fee if currency missing from table (same currency as schedule). */
  defaultFixedFee: number;
  defaultCurrency: SupportedCurrency;
  /** Additional % applied only when location === international. */
  internationalAdditionalPercentage: number;
  /** Optional alternate international % (e.g. UK EEA) — unused unless set on input. */
  internationalEeaPercentage?: number;
  effectiveDate: string;
  verifiedDate: string;
  sourceUrl: string;
  verified: boolean;
  label: string;
  notes?: string;
}

/** US commercial fixed fees by currency received (PayPal US schedule). */
export const US_FIXED_FEES: Partial<Record<SupportedCurrency, number>> = {
  AUD: 0.59,
  BRL: 2.9,
  CAD: 0.59,
  CZK: 10.45,
  DKK: 2.6,
  EUR: 0.39,
  HKD: 3.83,
  HUF: 133.0,
  ILS: 1.6,
  JPY: 49.0,
  MYR: 2.0,
  MXN: 9.0,
  TWD: 14.0,
  NZD: 0.69,
  NOK: 3.9,
  PHP: 25.0,
  PLN: 1.89,
  RUB: 39.0,
  SGD: 0.69,
  SEK: 4.09,
  CHF: 0.49,
  THB: 15.0,
  GBP: 0.39,
  USD: 0.49,
};

/** UK commercial fixed fees by currency received (PayPal UK schedule). */
export const UK_FIXED_FEES: Partial<Record<SupportedCurrency, number>> = {
  AUD: 0.3,
  BRL: 0.6,
  CAD: 0.3,
  CZK: 10.0,
  DKK: 2.6,
  EUR: 0.35,
  HKD: 2.35,
  HUF: 90.0,
  ILS: 1.2,
  JPY: 40.0,
  MYR: 2.0,
  MXN: 4.0,
  TWD: 10.0,
  NZD: 0.45,
  NOK: 2.8,
  PHP: 15.0,
  PLN: 1.35,
  RUB: 10.0,
  SGD: 0.5,
  SEK: 3.25,
  CHF: 0.55,
  THB: 11.0,
  GBP: 0.3,
  USD: 0.3,
};

const US_SOURCE =
  'https://www.paypal.com/us/business/paypal-business-fees';
const UK_SOURCE =
  'https://www.paypal.com/uk/business/paypal-business-fees';

export const PAYPAL_REGIONS: ReadonlyArray<{
  id: PayPalRegionId;
  label: string;
  verified: boolean;
}> = [
  { id: 'US', label: 'United States', verified: true },
  { id: 'UK', label: 'United Kingdom', verified: true },
  {
    id: 'CUSTOM',
    label: 'Custom / other region (enter your rates)',
    verified: false,
  },
];

export const PAYPAL_PRESETS: readonly PayPalFeePreset[] = [
  {
    id: 'us-paypal-checkout',
    region: 'US',
    transactionType: 'paypal_checkout',
    percentageFee: 3.49,
    usesCurrencyFixedFee: true,
    defaultFixedFee: 0.49,
    defaultCurrency: 'USD',
    internationalAdditionalPercentage: 1.5,
    effectiveDate: '2025-10-29',
    verifiedDate: '2025-10-29',
    sourceUrl: US_SOURCE,
    verified: true,
    label: 'PayPal Checkout',
    notes: 'Also covers PayPal Guest Checkout and Pay with Venmo domestic commercial rates in the US schedule.',
  },
  {
    id: 'us-goods-services',
    region: 'US',
    transactionType: 'goods_and_services',
    percentageFee: 2.99,
    usesCurrencyFixedFee: false,
    defaultFixedFee: 0,
    defaultCurrency: 'USD',
    internationalAdditionalPercentage: 1.5,
    effectiveDate: '2025-10-29',
    verifiedDate: '2025-10-29',
    sourceUrl: US_SOURCE,
    verified: true,
    label: 'Send/Receive Money (Goods & Services)',
    notes: 'US schedule lists 2.99% with no separate fixed fee for this payment type.',
  },
  {
    id: 'us-card',
    region: 'US',
    transactionType: 'card_payments',
    percentageFee: 2.99,
    usesCurrencyFixedFee: true,
    defaultFixedFee: 0.49,
    defaultCurrency: 'USD',
    internationalAdditionalPercentage: 1.5,
    effectiveDate: '2025-10-29',
    verifiedDate: '2025-10-29',
    sourceUrl: US_SOURCE,
    verified: true,
    label: 'Standard Credit & Debit Card',
  },
  {
    id: 'us-qr',
    region: 'US',
    transactionType: 'qr_code',
    percentageFee: 2.29,
    usesCurrencyFixedFee: true,
    defaultFixedFee: 0.49,
    defaultCurrency: 'USD',
    internationalAdditionalPercentage: 1.5,
    effectiveDate: '2025-10-29',
    verifiedDate: '2025-10-29',
    sourceUrl: US_SOURCE,
    verified: true,
    label: 'QR Code Transactions',
  },
  {
    id: 'us-other',
    region: 'US',
    transactionType: 'other_commercial',
    percentageFee: 3.49,
    usesCurrencyFixedFee: true,
    defaultFixedFee: 0.49,
    defaultCurrency: 'USD',
    internationalAdditionalPercentage: 1.5,
    effectiveDate: '2025-10-29',
    verifiedDate: '2025-10-29',
    sourceUrl: US_SOURCE,
    verified: true,
    label: 'All Other Commercial Transactions',
  },
  {
    id: 'uk-other',
    region: 'UK',
    transactionType: 'uk_other_commercial',
    percentageFee: 2.9,
    usesCurrencyFixedFee: true,
    defaultFixedFee: 0.3,
    defaultCurrency: 'GBP',
    internationalAdditionalPercentage: 1.99,
    internationalEeaPercentage: 1.29,
    effectiveDate: '2025-07-17',
    verifiedDate: '2025-07-17',
    sourceUrl: UK_SOURCE,
    verified: true,
    label: 'All Other Commercial Transactions',
    notes: 'International add-on defaults to 1.99% (non-EEA sender). EEA senders: 1.29% — switch via International (EEA) or Custom.',
  },
  {
    id: 'uk-qr-high',
    region: 'UK',
    transactionType: 'uk_qr_high',
    percentageFee: 1.5,
    usesCurrencyFixedFee: true,
    defaultFixedFee: 0.3,
    defaultCurrency: 'GBP',
    internationalAdditionalPercentage: 1.99,
    internationalEeaPercentage: 1.29,
    effectiveDate: '2025-07-17',
    verifiedDate: '2025-07-17',
    sourceUrl: UK_SOURCE,
    verified: true,
    label: 'QR Code (≥ £10.01)',
  },
  {
    id: 'uk-qr-low',
    region: 'UK',
    transactionType: 'uk_qr_low',
    percentageFee: 2.0,
    usesCurrencyFixedFee: true,
    defaultFixedFee: 0.3,
    defaultCurrency: 'GBP',
    internationalAdditionalPercentage: 1.99,
    internationalEeaPercentage: 1.29,
    effectiveDate: '2025-07-17',
    verifiedDate: '2025-07-17',
    sourceUrl: UK_SOURCE,
    verified: true,
    label: 'QR Code (≤ £10.00)',
  },
];

export function presetsForRegion(
  region: PayPalRegionId,
): readonly PayPalFeePreset[] {
  if (region === 'CUSTOM') return [];
  return PAYPAL_PRESETS.filter((p) => p.region === region);
}

export function findPreset(id: string): PayPalFeePreset | undefined {
  return PAYPAL_PRESETS.find((p) => p.id === id);
}

export function resolveFixedFee(
  preset: PayPalFeePreset | null,
  currency: SupportedCurrency,
  customFixed: number | null,
): number {
  if (!preset || preset.transactionType === 'custom') {
    return customFixed ?? 0;
  }
  if (!preset.usesCurrencyFixedFee) return 0;
  const table = preset.region === 'UK' ? UK_FIXED_FEES : US_FIXED_FEES;
  return table[currency] ?? preset.defaultFixedFee;
}

export function resolveInternationalRate(
  preset: PayPalFeePreset | null,
  location: PayPalLocation,
  internationalMarket: 'standard' | 'eea',
  customAdditional: number | null,
): number {
  if (location !== 'international') return 0;
  if (!preset || preset.transactionType === 'custom') {
    return customAdditional ?? 0;
  }
  if (
    internationalMarket === 'eea' &&
    preset.internationalEeaPercentage != null
  ) {
    return preset.internationalEeaPercentage;
  }
  return preset.internationalAdditionalPercentage;
}
