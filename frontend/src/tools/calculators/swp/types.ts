import type { SupportedCurrency } from '@/tools/shared/currency';

export type SwpSolveMode =
  | 'initial'
  | 'withdrawal'
  | 'duration'
  | 'final'
  | 'rate';

export type SwpFrequency =
  | 'monthly'
  | 'quarterly'
  | 'semiannually'
  | 'annually';

export type DurationUnit = 'yrs' | 'mos';

export const SWP_MODE_OPTIONS: readonly {
  value: SwpSolveMode;
  label: string;
}[] = [
  { value: 'initial', label: 'what should be my initial investment?' },
  { value: 'withdrawal', label: 'how much can I withdraw?' },
  { value: 'duration', label: 'how long will my SWP last?' },
  { value: 'final', label: 'what will be my final balance?' },
  { value: 'rate', label: 'what rate of return do I need?' },
] as const;

export const SWP_FREQUENCY_OPTIONS: readonly {
  value: SwpFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
] as const;

export interface SwpInput {
  mode: SwpSolveMode;
  currency: SupportedCurrency;
  /** Periodic withdrawal amount (hidden when mode=withdrawal) */
  withdrawalAmount: string;
  /** Initial investment (hidden when mode=initial) */
  initialInvestment: string;
  frequency: SwpFrequency;
  durationValue: string;
  durationUnit: DurationUnit;
  annualReturn: string;
  inflationRate: string;
  firstWithdrawalDate: string;
  /** Desired ending balance when solving initial/withdrawal/duration/rate */
  endBalance: string;
}

export interface SwpResult {
  mode: SwpSolveMode;
  currency: SupportedCurrency;
  openingBalance: number;
  periodicWithdrawal: number;
  totalWithdrawal: number;
  totalReturn: number;
  numberOfWithdrawals: number;
  lastWithdrawalDate: string;
  endingBalance: number;
  annualReturnPercent: number;
  inflationPercent: number;
  frequency: SwpFrequency;
  frequencyLabel: string;
  summaryMessage: string;
  formattedOpening: string;
  formattedWithdrawal: string;
  formattedTotalWithdrawal: string;
  formattedTotalReturn: string;
  formattedEnding: string;
  assumptionNotes: string[];
}

export type SwpFieldErrors = Partial<Record<keyof SwpInput, string>> & {
  form?: string;
};

function defaultFirstWithdrawalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function createDefaultInput(): SwpInput {
  return {
    mode: 'initial',
    currency: 'PKR',
    withdrawalAmount: '1000',
    initialInvestment: '',
    frequency: 'monthly',
    durationValue: '10',
    durationUnit: 'yrs',
    annualReturn: '5',
    inflationRate: '0',
    firstWithdrawalDate: defaultFirstWithdrawalDate(),
    endBalance: '0',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): SwpInput {
  return {
    mode: 'initial',
    currency,
    withdrawalAmount: '',
    initialInvestment: '',
    frequency: 'monthly',
    durationValue: '',
    durationUnit: 'yrs',
    annualReturn: '',
    inflationRate: '',
    firstWithdrawalDate: '',
    endBalance: '',
  };
}
