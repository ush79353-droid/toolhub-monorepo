import type { SupportedCurrency } from '@/tools/shared/currency';

export type ReserveRatioMode =
  | 'ratio'
  | 'required'
  | 'excess'
  | 'deposits'
  | 'reserves';

export type MoneyMagnitude =
  | 'units'
  | 'thousands'
  | 'millions'
  | 'billions'
  | 'trillions';

export const MONEY_MAGNITUDE_OPTIONS: readonly {
  id: MoneyMagnitude;
  label: string;
  factor: number;
}[] = [
  { id: 'units', label: 'Units', factor: 1 },
  { id: 'thousands', label: 'Thousands', factor: 1_000 },
  { id: 'millions', label: 'Millions', factor: 1_000_000 },
  { id: 'billions', label: 'Billions', factor: 1_000_000_000 },
  { id: 'trillions', label: 'Trillions', factor: 1_000_000_000_000 },
] as const;

export const RESERVE_RATIO_MODE_OPTIONS: readonly {
  id: ReserveRatioMode;
  label: string;
}[] = [
  { id: 'ratio', label: 'Reserve Ratio' },
  { id: 'required', label: 'Required Reserves' },
  { id: 'excess', label: 'Excess / Shortfall' },
  { id: 'deposits', label: 'Deposits' },
  { id: 'reserves', label: 'Reserves' },
] as const;

export interface ReserveRatioInput {
  mode: ReserveRatioMode;
  currency: SupportedCurrency;
  magnitude: MoneyMagnitude;
  deposits: string;
  reserves: string;
  /** Required reserve ratio % (advanced / required / excess helpers) */
  requiredRatio: string;
  requiredReserves: string;
}

export interface ReserveRatioResult {
  mode: ReserveRatioMode;
  currency: SupportedCurrency;
  magnitude: MoneyMagnitude;
  depositsBase: number;
  reservesBase: number;
  reserveRatioPercent: number | null;
  requiredRatioPercent: number | null;
  requiredReservesBase: number | null;
  excessOrShortfallBase: number | null;
  excessStatus: 'surplus' | 'shortfall' | 'exact' | null;
  unreservedFundsBase: number | null;
  unreservedApplicable: boolean;
  moneyMultiplier: number | null;
  moneyMultiplierUndefined: boolean;
  formattedDeposits: string;
  formattedReserves: string;
  formattedRatio: string;
  formattedRequiredRatio: string;
  formattedRequiredReserves: string;
  formattedExcess: string;
  formattedUnreserved: string;
  formattedMultiplier: string;
  displayDeposits: string;
  displayReserves: string;
  displayRatio: string;
  displayRequiredRatio: string;
  displayRequiredReserves: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
  chartReservesShare: number | null;
  chartRemainderShare: number | null;
}

export type ReserveRatioFieldErrors = {
  form?: string;
  deposits?: string;
  reserves?: string;
  requiredRatio?: string;
  requiredReserves?: string;
};

export function createDefaultInput(): ReserveRatioInput {
  return {
    mode: 'ratio',
    currency: 'USD',
    magnitude: 'millions',
    deposits: '',
    reserves: '',
    requiredRatio: '',
    requiredReserves: '',
  };
}

export function createEmptyInput(
  mode: ReserveRatioMode = 'ratio'
): ReserveRatioInput {
  return { ...createDefaultInput(), mode };
}

export function createExampleInput(
  mode: ReserveRatioMode = 'ratio'
): ReserveRatioInput {
  switch (mode) {
    case 'required':
      return {
        mode,
        currency: 'USD',
        magnitude: 'millions',
        deposits: '1000',
        reserves: '',
        requiredRatio: '10',
        requiredReserves: '',
      };
    case 'excess':
      return {
        mode,
        currency: 'USD',
        magnitude: 'millions',
        deposits: '',
        reserves: '150',
        requiredRatio: '',
        requiredReserves: '100',
      };
    case 'deposits':
      return {
        mode,
        currency: 'USD',
        magnitude: 'millions',
        deposits: '',
        reserves: '100',
        requiredRatio: '10',
        requiredReserves: '',
      };
    case 'reserves':
      return {
        mode,
        currency: 'USD',
        magnitude: 'millions',
        deposits: '2000',
        reserves: '',
        requiredRatio: '12',
        requiredReserves: '',
      };
    case 'ratio':
    default:
      return {
        mode: 'ratio',
        currency: 'USD',
        magnitude: 'millions',
        deposits: '1000',
        reserves: '100',
        requiredRatio: '10',
        requiredReserves: '',
      };
  }
}
