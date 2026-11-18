import type { SupportedCurrency } from '@/tools/shared/currency';

/** Period frequency for the savings plan (screenshot dropdown). */
export type PlanFrequency =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannual'
  | 'annual';

/** Screenshot radio: fixed/growing deposit vs given final balance. */
export type PlanMode = 'deposit' | 'target';

export interface SavingsPlanInput {
  frequency: PlanFrequency;
  /** Number of periods (weeks when weekly, etc.). */
  periods: string;
  mode: PlanMode;
  /**
   * Deposit mode: starting periodic deposit.
   * Target mode: unused (targetBalance holds the goal).
   */
  depositAmount: string;
  depositCurrency: SupportedCurrency;
  /** Arithmetic increase applied each subsequent period. */
  increaseAmount: string;
  increaseCurrency: SupportedCurrency;
  /** Target mode: desired final principal balance. */
  targetBalance: string;
  targetCurrency: SupportedCurrency;
}

export interface PeriodBalance {
  period: number;
  deposit: number;
  balance: number;
}

export interface SavingsPlanResult {
  mode: PlanMode;
  frequency: PlanFrequency;
  periods: number;
  /** Starting periodic deposit (solved in target mode). */
  startingDeposit: number;
  increasePerPeriod: number;
  finalBalance: number;
  totalDeposited: number;
  currency: SupportedCurrency;
  balances: PeriodBalance[];
  formattedFinalBalance: string;
  formattedStartingDeposit: string;
  formattedTotalDeposited: string;
  periodUnitSingular: string;
  periodUnitPlural: string;
  balancesLabel: string;
}

export type SavingsPlanFieldErrors = Partial<
  Record<
    | 'periods'
    | 'depositAmount'
    | 'increaseAmount'
    | 'targetBalance'
    | 'form'
    | 'currency',
    string
  >
>;

export const PLAN_FREQUENCY_OPTIONS: readonly {
  value: PlanFrequency;
  label: string;
  unitSingular: string;
  unitPlural: string;
}[] = [
  { value: 'daily', label: 'daily savings plan', unitSingular: 'day', unitPlural: 'days' },
  { value: 'weekly', label: 'weekly savings plan', unitSingular: 'week', unitPlural: 'weeks' },
  {
    value: 'biweekly',
    label: 'biweekly savings plan',
    unitSingular: 'biweek',
    unitPlural: 'biweeks',
  },
  { value: 'monthly', label: 'monthly savings plan', unitSingular: 'month', unitPlural: 'months' },
  {
    value: 'quarterly',
    label: 'quarterly savings plan',
    unitSingular: 'quarter',
    unitPlural: 'quarters',
  },
  {
    value: 'semiannual',
    label: 'semiannual savings plan',
    unitSingular: 'half-year',
    unitPlural: 'half-years',
  },
  { value: 'annual', label: 'annual savings plan', unitSingular: 'year', unitPlural: 'years' },
];

export function periodUnits(frequency: PlanFrequency): {
  singular: string;
  plural: string;
  balancesLabel: string;
} {
  const opt = PLAN_FREQUENCY_OPTIONS.find((o) => o.value === frequency)!;
  const title =
    frequency === 'daily'
      ? 'Daily'
      : frequency === 'weekly'
        ? 'Weekly'
        : frequency === 'biweekly'
          ? 'Biweekly'
          : frequency === 'monthly'
            ? 'Monthly'
            : frequency === 'quarterly'
              ? 'Quarterly'
              : frequency === 'semiannual'
                ? 'Semiannual'
                : 'Annual';
  return {
    singular: opt.unitSingular,
    plural: opt.unitPlural,
    balancesLabel: `${title} Balances`,
  };
}

export function createDefaultInput(): SavingsPlanInput {
  return {
    frequency: 'weekly',
    periods: '52',
    mode: 'deposit',
    depositAmount: '100',
    depositCurrency: 'PKR',
    increaseAmount: '0',
    increaseCurrency: 'PKR',
    targetBalance: '5200',
    targetCurrency: 'PKR',
  };
}
