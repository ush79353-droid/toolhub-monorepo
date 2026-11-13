import type { SupportedCurrency } from '@/tools/shared/currency';

/** Required income from a known rent, or the rent a known gross income can support. */
export type ThreeXRentMode = 'required-income' | 'affordable-rent';

/** Equal division is an assumption. Custom shares are percents of the household requirement. */
export type IncomeSplit = 'equal' | 'custom';

export interface ThreeXRentInput {
  mode: ThreeXRentMode;
  /** null while the field is blank. */
  monthlyRent: number | null;
  multiplier: number | null;
  multipleTenants: boolean;
  tenantCount: number | null;
  split: IncomeSplit;
  /** Percent of the household income requirement. Used only for a custom split. */
  sharePercents: readonly (number | null)[];
  grossMonthlyIncome: number | null;
  /** Gross monthly income before taxes, one entry per tenant. */
  tenantIncomes: readonly (number | null)[];
  currency: SupportedCurrency;
}

export interface TenantLine {
  label: string;
  monthly: number;
  annual: number;
  sharePercent: number;
}

export interface ThreeXRentResult {
  mode: ThreeXRentMode;
  currency: SupportedCurrency;
  multiplier: number;
  /** Rent as a percent of gross monthly income. For a 3× rule this is 33.33. */
  rentToIncomePercent: number;
  monthlyRent: number | null;
  requiredMonthlyIncome: number | null;
  requiredAnnualIncome: number | null;
  grossMonthlyIncome: number | null;
  grossAnnualIncome: number | null;
  maximumMonthlyRent: number | null;
  maximumAnnualRent: number | null;
  multipleTenants: boolean;
  split: IncomeSplit | 'single';
  tenantLines: readonly TenantLine[];
}

export type ThreeXRentFieldErrors = {
  monthlyRent?: string;
  multiplier?: string;
  tenantCount?: string;
  sharePercents?: string;
  grossMonthlyIncome?: string;
  tenantIncomes?: string;
  currency?: string;
};

export const DEFAULT_MULTIPLIER = 3;
export const DEFAULT_TENANT_COUNT = 2;
export const MIN_TENANT_COUNT = 2;
/** ponytail: eight rows keep the form on one screen. Raise this constant if a household needs more people. */
export const MAX_TENANT_COUNT = 8;
export const MAX_MULTIPLIER = 100;
export const MAX_MONEY = 1_000_000_000_000;
export const RESULT_CAP = 1e15;
export const SHARE_SUM_TOLERANCE = 0.02;

export const DEFAULT_THREE_X_RENT_INPUT: ThreeXRentInput = {
  mode: 'required-income',
  monthlyRent: null,
  multiplier: DEFAULT_MULTIPLIER,
  multipleTenants: false,
  tenantCount: DEFAULT_TENANT_COUNT,
  split: 'equal',
  sharePercents: [50, 50],
  grossMonthlyIncome: null,
  tenantIncomes: [null, null],
  currency: 'PKR',
};
