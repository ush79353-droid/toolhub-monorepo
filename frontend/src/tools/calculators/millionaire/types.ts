import type { SupportedCurrency } from '@/tools/shared/currency';

export type CompoundFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'semimonthly'
  | 'biweekly'
  | 'weekly'
  | 'daily'
  | 'continuously';

export type DepositTiming = 'beginning' | 'end';

export interface MillionaireInput {
  targetAmount: string;
  initialSavings: string;
  annualInterestRate: string;
  compoundFrequency: CompoundFrequency;
  additionalDeposit: string;
  depositTiming: DepositTiming;
  inflationRate: string;
  currency: SupportedCurrency;
}

export interface SavingsProjectionRow {
  year: number;
  balance: number;
  /** Cumulative additional deposits (principal contributed). */
  contributions: number;
  /** Accumulated interest = balance − initial − contributions. */
  interestEarned: number;
  initialSavings: number;
}

export type MillionaireGoalStatus =
  | 'incomplete'
  | 'achieved'
  | 'reachable'
  | 'unreachable';

export interface MillionaireResult {
  targetAmount: number;
  initialSavings: number;
  annualInterestRatePercent: number;
  compoundFrequency: CompoundFrequency;
  additionalDeposit: number;
  depositTiming: DepositTiming;
  inflationRatePercent: number;
  periodsPerYear: number;
  totalPeriods: number;
  yearsToGoal: number;
  monthsToGoal: number;
  totalMonths: number;
  fractionalYears: number;
  finalSavings: number;
  totalContributions: number;
  totalInterest: number;
  inflationAdjustedValue: number;
  goalAlreadyAchieved: boolean;
  goalReachable: boolean;
  status: MillionaireGoalStatus;
  statusMessage: string;
  durationLabel: string;
  summaryText: string;
  projection: SavingsProjectionRow[];
  currency: SupportedCurrency;
}

export type MillionaireFieldErrors = Partial<
  Record<
    | 'targetAmount'
    | 'initialSavings'
    | 'annualInterestRate'
    | 'additionalDeposit'
    | 'inflationRate'
    | 'form',
    string
  >
>;

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundFrequency;
  label: string;
  /** Deposit/compound periods per year. Continuously uses monthly deposits with continuous rate. */
  periodsPerYear: number;
  continuous: boolean;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1, continuous: false },
  {
    value: 'semiannually',
    label: 'Semiannually',
    periodsPerYear: 2,
    continuous: false,
  },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4, continuous: false },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12, continuous: false },
  {
    value: 'semimonthly',
    label: 'Semimonthly',
    periodsPerYear: 24,
    continuous: false,
  },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26, continuous: false },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52, continuous: false },
  { value: 'daily', label: 'Daily', periodsPerYear: 365, continuous: false },
  {
    value: 'continuously',
    label: 'Continuously',
    periodsPerYear: 12,
    continuous: true,
  },
];

export function createDefaultInput(): MillionaireInput {
  return {
    targetAmount: '1,000,000',
    initialSavings: '20,000',
    annualInterestRate: '4',
    compoundFrequency: 'monthly',
    additionalDeposit: '1,000',
    depositTiming: 'end',
    inflationRate: '2',
    currency: 'USD',
  };
}

export function createBlankInput(
  currency: SupportedCurrency = 'USD',
): MillionaireInput {
  return {
    targetAmount: '',
    initialSavings: '',
    annualInterestRate: '',
    compoundFrequency: 'monthly',
    additionalDeposit: '',
    depositTiming: 'end',
    inflationRate: '',
    currency,
  };
}
