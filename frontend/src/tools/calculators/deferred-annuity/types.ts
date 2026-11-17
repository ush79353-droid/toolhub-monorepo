import type { SupportedCurrency } from '@/tools/shared/currency';

/** Screenshot default: how much I can withdraw. Omni also confirms duration mode. */
export type KnowMode = 'withdraw_amount' | 'duration';

/** Omni-confirmed deferral length modes. */
export type DeferralMode = 'until_date' | 'by_period';

export const KNOW_MODE_OPTIONS: readonly { value: KnowMode; label: string }[] = [
  { value: 'withdraw_amount', label: 'how much I can withdraw' },
  { value: 'duration', label: 'how long my annuity will last' },
] as const;

export const DEFERRAL_MODE_OPTIONS: readonly {
  value: DeferralMode;
  label: string;
}[] = [
  { value: 'until_date', label: 'until a given date' },
  { value: 'by_period', label: 'by a given period' },
] as const;

export interface DeferredAnnuityInput {
  knowMode: KnowMode;
  showAdvanced: boolean;
  deferralMode: DeferralMode;
  /** ISO date YYYY-MM-DD when deferralMode is until_date. */
  deferralEndDate: string;
  /** Years part when deferralMode is by_period. */
  deferralYears: string;
  /** Months part when deferralMode is by_period. */
  deferralMonths: string;
  lumpSum: string;
  lumpSumCurrency: SupportedCurrency;
  monthlyContribution: string;
  contributionCurrency: SupportedCurrency;
  accumulationRatePercent: string;
  withdrawalYears: string;
  withdrawalMonths: string;
  payoutRatePercent: string;
  /**
   * Fixed monthly withdrawal when knowMode is duration.
   * Independent FX (third monetary selector with lump + contribution).
   */
  fixedWithdrawal: string;
  withdrawalCurrency: SupportedCurrency;
  /** Independent display currency for money results. */
  resultCurrency: SupportedCurrency;
}

export interface DeferredAnnuityResult {
  summaryText: string;
  balanceAtFirstWithdrawal: number;
  monthlyWithdrawal: number;
  totalWithdrawal: number;
  totalContribution: number;
  totalReturn: number;
  numberOfWithdrawals: number;
  lastWithdrawalDateIso: string;
  lastWithdrawalDateLabel: string;
  deferralMonths: number;
  formattedBalanceAtFirstWithdrawal: string;
  formattedMonthlyWithdrawal: string;
  formattedTotalWithdrawal: string;
  formattedTotalContribution: string;
  formattedTotalReturn: string;
  resultCurrency: SupportedCurrency;
  calcCurrency: SupportedCurrency;
}

export type DeferredAnnuityFieldErrors = {
  deferralEndDate?: string;
  deferralYears?: string;
  deferralMonths?: string;
  lumpSum?: string;
  monthlyContribution?: string;
  accumulationRatePercent?: string;
  withdrawalYears?: string;
  withdrawalMonths?: string;
  payoutRatePercent?: string;
  fixedWithdrawal?: string;
  form?: string;
};

function defaultDeferralEndIso(): string {
  const now = new Date();
  const y = now.getFullYear() + 15;
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultInput(): DeferredAnnuityInput {
  return {
    knowMode: 'withdraw_amount',
    showAdvanced: false,
    deferralMode: 'until_date',
    deferralEndDate: defaultDeferralEndIso(),
    deferralYears: '15',
    deferralMonths: '0',
    lumpSum: '20000',
    lumpSumCurrency: 'PKR',
    monthlyContribution: '500',
    contributionCurrency: 'PKR',
    accumulationRatePercent: '1.5',
    withdrawalYears: '20',
    withdrawalMonths: '0',
    payoutRatePercent: '1.5',
    fixedWithdrawal: '',
    withdrawalCurrency: 'PKR',
    resultCurrency: 'PKR',
  };
}
