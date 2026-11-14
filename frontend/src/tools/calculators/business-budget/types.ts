import type { SupportedCurrency } from '@/tools/shared/currency';

/** Recurring period for income / salary / monthly expense lines. */
export const PERIODS = ['day', 'week', 'month', 'year'] as const;
export type Period = (typeof PERIODS)[number];

export const PERIOD_LABEL: Record<Period, string> = {
  day: '/ day',
  week: '/ wk',
  month: '/ mo',
  year: '/ yr',
};

/** Calendar factors used to normalize a recurring amount into a monthly figure. */
export const DAYS_PER_YEAR = 365;
export const WEEKS_PER_YEAR = 52;

export interface MoneyLine {
  amount: number;
  period: Period;
}

export interface BusinessBudgetInput {
  currency: SupportedCurrency;
  /** Operating income streams. */
  income1: MoneyLine;
  income2: MoneyLine;
  income3: MoneyLine;
  income4: MoneyLine;
  /** Non-operating income. */
  interestIncome: MoneyLine;
  dividends: MoneyLine;
  gifts: MoneyLine;
  grants: MoneyLine;
  otherIncome: MoneyLine;
  /** One-time startup costs (no period — lump sum). */
  furniture: number;
  startingInventory: number;
  advertisingPromotion: number;
  operatingCash: number;
  otherOneTimeCosts: number;
  /** Salaries (recurring). */
  managerSalary: MoneyLine;
  salaries: MoneyLine;
  commissions: MoneyLine;
  benefits: MoneyLine;
  /** Monthly operating expenses (recurring). */
  rent: MoneyLine;
  advertisingMarketing: MoneyLine;
  healthInsurance: MoneyLine;
  businessInsurance: MoneyLine;
  inventory: MoneyLine;
  leases: MoneyLine;
  travel: MoneyLine;
  utilities: MoneyLine;
  officeSupplies: MoneyLine;
}

export interface BusinessBudgetResult {
  currency: SupportedCurrency;
  totalOperatingIncome: number;
  totalNonOperatingIncome: number;
  totalOneTimeCosts: number;
  totalSalaries: number;
  totalMonthlyExpenses: number;
  /** Equals total one-time costs; not added again into total expenses. */
  initialInvestment: number;
  totalIncome: number;
  /** Recurring only: salaries + monthly expenses (normalized / mo). */
  totalExpenses: number;
  budgetBalance: number;
  totalOperatingIncomeDisplay: string;
  totalNonOperatingIncomeDisplay: string;
  totalOneTimeCostsDisplay: string;
  initialInvestmentDisplay: string;
  totalIncomeDisplay: string;
  totalExpensesDisplay: string;
  budgetBalanceDisplay: string;
}

export type BusinessBudgetFieldErrors = Record<string, string>;

export function blankLine(period: Period = 'month'): MoneyLine {
  return { amount: 0, period };
}

export function createDefaultInput(): BusinessBudgetInput {
  return {
    currency: 'PKR',
    income1: blankLine(),
    income2: blankLine(),
    income3: blankLine(),
    income4: blankLine(),
    interestIncome: blankLine(),
    dividends: blankLine(),
    gifts: blankLine(),
    grants: blankLine(),
    otherIncome: blankLine(),
    furniture: 0,
    startingInventory: 0,
    advertisingPromotion: 0,
    operatingCash: 0,
    otherOneTimeCosts: 0,
    managerSalary: blankLine(),
    salaries: blankLine(),
    commissions: blankLine(),
    benefits: blankLine(),
    rent: blankLine(),
    advertisingMarketing: blankLine(),
    healthInsurance: blankLine(),
    businessInsurance: blankLine(),
    inventory: blankLine(),
    leases: blankLine(),
    travel: blankLine(),
    utilities: blankLine(),
    officeSupplies: blankLine(),
  };
}
