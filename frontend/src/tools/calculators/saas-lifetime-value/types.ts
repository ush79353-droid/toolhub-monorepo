import type { SupportedCurrency } from '@/tools/shared/currency';

export const MAX_MONEY = 1_000_000_000_000_000;
export const MAX_ACCOUNTS = 1_000_000_000_000;

export interface SaasLifetimeValueInput {
  /** Direct ARPA when the user knows it. */
  arpa: number | null;
  dontKnowArpa: boolean;
  recurringRevenue: number | null;
  numberOfAccounts: number | null;
  grossMarginPercent: number | null;
  churnPercent: number | null;
  accountExpansion: number | null;
  currency: SupportedCurrency;
}

export interface SaasLifetimeValueResult {
  arpa: number;
  grossMarginPercent: number;
  churnPercent: number;
  accountExpansion: number;
  /** null when churn is zero (no finite estimate). */
  customerLifetimeValue: number | null;
  currency: SupportedCurrency;
  derivedFromRevenue: boolean;
}

export type SaasLifetimeValueField =
  | 'arpa'
  | 'recurringRevenue'
  | 'numberOfAccounts'
  | 'grossMarginPercent'
  | 'churnPercent'
  | 'accountExpansion'
  | 'currency';

export type SaasLifetimeValueFieldErrors = Partial<Record<SaasLifetimeValueField, string>>;

export const DEFAULT_CURRENCY = 'PKR' as const;

/** Screenshot defaults: gross margin 100%, account expansion 0. */
export const DEFAULT_INPUT: SaasLifetimeValueInput = {
  arpa: null,
  dontKnowArpa: false,
  recurringRevenue: null,
  numberOfAccounts: null,
  grossMarginPercent: 100,
  churnPercent: null,
  accountExpansion: 0,
  currency: DEFAULT_CURRENCY,
};
