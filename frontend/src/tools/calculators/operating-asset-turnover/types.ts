import type { SupportedCurrency } from '@/tools/shared/currency';

export const MAX_MONEY = 1_000_000_000_000_000;

export interface OperatingAssetTurnoverInput {
  cash: number | null;
  accountsReceivable: number | null;
  inventory: number | null;
  prepaidExpenses: number | null;
  fixedAssets: number | null;
  sales: number | null;
  currency: SupportedCurrency;
}

export interface OperatingAssetTurnoverResult {
  cash: number;
  accountsReceivable: number;
  inventory: number;
  prepaidExpenses: number;
  fixedAssets: number;
  /** null when sales not yet entered (assets total still shown). */
  sales: number | null;
  operatingAssets: number;
  /**
   * Sales / operating assets.
   * null when sales blank or operating assets is zero (avoids Infinity/NaN).
   */
  operatingAssetTurnover: number | null;
  currency: SupportedCurrency;
}

export type OperatingAssetTurnoverField =
  | 'cash'
  | 'accountsReceivable'
  | 'inventory'
  | 'prepaidExpenses'
  | 'fixedAssets'
  | 'sales'
  | 'currency';

export type OperatingAssetTurnoverFieldErrors = Partial<
  Record<OperatingAssetTurnoverField, string>
>;

export const DEFAULT_CURRENCY = 'PKR' as const;

export const DEFAULT_INPUT: OperatingAssetTurnoverInput = {
  cash: null,
  accountsReceivable: null,
  inventory: null,
  prepaidExpenses: null,
  fixedAssets: null,
  sales: null,
  currency: DEFAULT_CURRENCY,
};
