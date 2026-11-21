import type { SupportedCurrency } from '@/tools/shared/currency';

/** Screenshot mode — only the verified “how long” question is implemented. */
export type SavingsWithdrawalMode = 'how_long';

export const SAVINGS_WITHDRAWAL_MODE_OPTIONS: readonly {
  value: SavingsWithdrawalMode;
  label: string;
}[] = [
  {
    value: 'how_long',
    label: 'how long will my money last?',
  },
] as const;

export interface SavingsWithdrawalInput {
  mode: SavingsWithdrawalMode;
  /** Opening savings balance. */
  balance: string;
  balanceCurrency: SupportedCurrency;
  /** First withdrawal date as YYYY-MM-DD. */
  firstWithdrawalDate: string;
  /** Recurring withdrawal amount (monthly in the verified default convention). */
  withdrawalAmount: string;
  withdrawalCurrency: SupportedCurrency;
  /** Nominal annual interest rate percent. */
  annualInterestRatePercent: string;
  /**
   * Collapsible Advanced settings disclosure. No extra fields are unlocked —
   * project specs do not define verified advanced parameters for this tool.
   */
  advancedOpen: boolean;
}

export interface SavingsWithdrawalResult {
  /** Whole years savings last (from withdrawal count). */
  years: number;
  /** Remaining whole months after years. */
  months: number;
  /** Number of withdrawals including a possible partial final withdrawal. */
  withdrawalCount: number;
  /** Scheduled monthly withdrawal in balance currency (full precision). */
  monthlyWithdrawal: number;
  /** Sum of actual withdrawals in balance currency. */
  totalWithdrawal: number;
  /** Accumulated interest credited before withdrawals. */
  interestEarned: number;
  /** Balance immediately before the first withdrawal period’s withdrawal. */
  balanceAtFirstWithdrawal: number;
  /** Remaining balance after the final withdrawal (typically 0). */
  balanceAfterLastWithdrawal: number;
  /** Last withdrawal civil date. */
  lastWithdrawalDate: { y: number; m: number; d: number };
  /** True when interest covers withdrawals and the balance never depletes. */
  neverDepletes: boolean;
  currency: SupportedCurrency;
  formattedMonthlyWithdrawal: string;
  formattedTotalWithdrawal: string;
  formattedInterestEarned: string;
  formattedBalanceAtFirstWithdrawal: string;
  formattedBalanceAfterLastWithdrawal: string;
  formattedLastWithdrawalDate: string;
  /** Narrative: “Your savings will last for X year(s) and Y month(s)…” */
  timelineSummary: string;
}

export type SavingsWithdrawalFieldErrors = {
  balance?: string;
  firstWithdrawalDate?: string;
  withdrawalAmount?: string;
  annualInterestRatePercent?: string;
  mode?: string;
  form?: string;
};

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultInput(): SavingsWithdrawalInput {
  return {
    mode: 'how_long',
    balance: '100000',
    balanceCurrency: 'PKR',
    firstWithdrawalDate: todayIsoDate(),
    withdrawalAmount: '500',
    withdrawalCurrency: 'PKR',
    annualInterestRatePercent: '2',
    advancedOpen: false,
  };
}
