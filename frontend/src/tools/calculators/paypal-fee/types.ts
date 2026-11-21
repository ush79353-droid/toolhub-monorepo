import type { SupportedCurrency } from '@/tools/shared/currency';
import type {
  PayPalLocation,
  PayPalRegionId,
  PayPalTransactionTypeId,
} from './presets';

export type PayPalSolveMode = 'fromGross' | 'fromNet';

export type PayPalInternationalMarket = 'standard' | 'eea';

export interface PayPalFeeConfig {
  percentageFee: number;
  fixedFee: number;
  additionalPercentageFee: number;
  currency: SupportedCurrency;
}

export interface PayPalFeeInput {
  region: PayPalRegionId;
  presetId: string;
  transactionType: PayPalTransactionTypeId;
  location: PayPalLocation;
  internationalMarket: PayPalInternationalMarket;
  currency: SupportedCurrency;
  solveMode: PayPalSolveMode;
  grossAmount: string;
  desiredNet: string;
  /** Custom / override percentage */
  customPercentage: string;
  customFixed: string;
  customAdditional: string;
}

export interface PayPalComparisonRow {
  gross: number;
  fee: number;
  net: number;
  formattedGross: string;
  formattedFee: string;
  formattedNet: string;
}

export interface PayPalFeeResult {
  currency: SupportedCurrency;
  solveMode: PayPalSolveMode;
  region: PayPalRegionId;
  presetId: string;
  location: PayPalLocation;
  percentageFee: number;
  additionalPercentageFee: number;
  fixedFee: number;
  grossAmount: number;
  percentageFeeAmount: number;
  additionalFeeAmount: number;
  fixedFeeAmount: number;
  totalFee: number;
  netAmount: number;
  effectiveFeePercentage: number | null;
  formattedGross: string;
  formattedPercentageFeeAmount: string;
  formattedAdditionalFeeAmount: string;
  formattedFixedFeeAmount: string;
  formattedTotalFee: string;
  formattedNet: string;
  formattedEffectiveRate: string;
  formattedPercentageRate: string;
  formattedAdditionalRate: string;
  formattedFixedFee: string;
  scheduleLabel: string;
  scheduleSourceUrl: string | null;
  scheduleEffectiveDate: string | null;
  verified: boolean;
  excludesCurrencyConversion: true;
  comparison: PayPalComparisonRow[];
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type PayPalFeeFieldErrors = {
  form?: string;
  grossAmount?: string;
  desiredNet?: string;
  customPercentage?: string;
  customFixed?: string;
  customAdditional?: string;
  region?: string;
};

export function createDefaultInput(): PayPalFeeInput {
  return {
    region: 'US',
    presetId: 'us-paypal-checkout',
    transactionType: 'paypal_checkout',
    location: 'domestic',
    internationalMarket: 'standard',
    currency: 'USD',
    solveMode: 'fromGross',
    grossAmount: '',
    desiredNet: '',
    customPercentage: '3.49',
    customFixed: '0.49',
    customAdditional: '0',
  };
}

export function createEmptyInput(): PayPalFeeInput {
  return {
    ...createDefaultInput(),
    grossAmount: '',
    desiredNet: '',
  };
}

/** Reference: $100 · 3.49% + $0.49 → fee $3.98 · net $96.02 */
export function createExampleInput(): PayPalFeeInput {
  return {
    region: 'US',
    presetId: 'us-paypal-checkout',
    transactionType: 'paypal_checkout',
    location: 'domestic',
    internationalMarket: 'standard',
    currency: 'USD',
    solveMode: 'fromGross',
    grossAmount: '100',
    desiredNet: '',
    customPercentage: '3.49',
    customFixed: '0.49',
    customAdditional: '0',
  };
}
