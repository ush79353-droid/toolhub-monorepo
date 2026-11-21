import type { SupportedCurrency } from '@/tools/shared/currency';

/** Screenshot frequency selectors: monthly or yearly only. */
export const FREQUENCIES = ['month', 'year'] as const;
export type Frequency = (typeof FREQUENCIES)[number];

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  month: 'mo',
  year: 'yr',
};

export interface MoneyLine {
  amount: string;
  currency: SupportedCurrency;
  frequency: Frequency;
}

export type IncomeMoneyKey =
  | 'salary'
  | 'pension'
  | 'otherMonthlyIncome'
  | 'taxRefunds'
  | 'otherAnnualIncome';

export type SavingsKey =
  | 'emergencyFund'
  | 'investments'
  | 'retirement'
  | 'otherSavings';

export type MonthlyExpenseKey =
  | 'food'
  | 'clothing'
  | 'shelter'
  | 'utilities'
  | 'health'
  | 'transportation'
  | 'loansAndLiabilities'
  | 'homeMaintenance'
  | 'childCare'
  | 'entertainment'
  | 'otherMonthlyExpenses';

export type AnnualExpenseKey =
  | 'tuition'
  | 'carInsurance'
  | 'homeInsurance'
  | 'travelAndVacation'
  | 'taxes'
  | 'otherAnnualExpenses';

export type MoneyFieldKey =
  | IncomeMoneyKey
  | SavingsKey
  | MonthlyExpenseKey
  | AnnualExpenseKey;

export interface BudgetInput {
  salary: MoneyLine;
  /** Percent of gross salary withheld as income tax (screenshot “Tax rate”). */
  taxRate: string;
  pension: MoneyLine;
  otherMonthlyIncome: MoneyLine;
  taxRefunds: MoneyLine;
  otherAnnualIncome: MoneyLine;
  emergencyFund: MoneyLine;
  investments: MoneyLine;
  retirement: MoneyLine;
  otherSavings: MoneyLine;
  food: MoneyLine;
  clothing: MoneyLine;
  shelter: MoneyLine;
  utilities: MoneyLine;
  health: MoneyLine;
  transportation: MoneyLine;
  loansAndLiabilities: MoneyLine;
  homeMaintenance: MoneyLine;
  childCare: MoneyLine;
  entertainment: MoneyLine;
  otherMonthlyExpenses: MoneyLine;
  tuition: MoneyLine;
  carInsurance: MoneyLine;
  homeInsurance: MoneyLine;
  travelAndVacation: MoneyLine;
  taxes: MoneyLine;
  otherAnnualExpenses: MoneyLine;
  incomeOpen: boolean;
  savingsOpen: boolean;
  monthlyExpensesOpen: boolean;
  annualExpensesOpen: boolean;
  summaryOpen: boolean;
}

export interface BudgetResult {
  /** Aggregation / summary currency = salary currency. */
  currency: SupportedCurrency;
  monthlyIncome: number;
  monthlySavings: number;
  monthlyExpenses: number;
  annualExpenses: number;
  monthlyBudgetBalance: number;
  annualBudgetBalance: number;
  formattedMonthlyIncome: string;
  formattedMonthlySavings: string;
  formattedMonthlyExpenses: string;
  formattedAnnualExpenses: string;
  formattedMonthlyBudgetBalance: string;
  formattedAnnualBudgetBalance: string;
}

export type BudgetFieldErrors = Partial<
  Record<MoneyFieldKey | 'taxRate' | 'form', string>
>;

function money(
  frequency: Frequency,
  currency: SupportedCurrency = 'PKR'
): MoneyLine {
  return { amount: '0', currency, frequency };
}

export function createDefaultInput(): BudgetInput {
  return {
    salary: money('month'),
    taxRate: '0',
    pension: money('month'),
    otherMonthlyIncome: money('month'),
    taxRefunds: money('year'),
    otherAnnualIncome: money('year'),
    emergencyFund: money('month'),
    investments: money('month'),
    retirement: money('month'),
    otherSavings: money('month'),
    food: money('month'),
    clothing: money('month'),
    shelter: money('month'),
    utilities: money('month'),
    health: money('month'),
    transportation: money('month'),
    loansAndLiabilities: money('month'),
    homeMaintenance: money('month'),
    childCare: money('month'),
    entertainment: money('month'),
    otherMonthlyExpenses: money('month'),
    tuition: money('year'),
    carInsurance: money('year'),
    homeInsurance: money('year'),
    travelAndVacation: money('year'),
    taxes: money('year'),
    otherAnnualExpenses: money('year'),
    incomeOpen: true,
    savingsOpen: true,
    monthlyExpensesOpen: true,
    annualExpensesOpen: true,
    summaryOpen: true,
  };
}

export function inputsEqual(a: BudgetInput, b: BudgetInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const INCOME_MONEY_KEYS: readonly IncomeMoneyKey[] = [
  'salary',
  'pension',
  'otherMonthlyIncome',
  'taxRefunds',
  'otherAnnualIncome',
];

export const SAVINGS_KEYS: readonly SavingsKey[] = [
  'emergencyFund',
  'investments',
  'retirement',
  'otherSavings',
];

export const MONTHLY_EXPENSE_KEYS: readonly MonthlyExpenseKey[] = [
  'food',
  'clothing',
  'shelter',
  'utilities',
  'health',
  'transportation',
  'loansAndLiabilities',
  'homeMaintenance',
  'childCare',
  'entertainment',
  'otherMonthlyExpenses',
];

export const ANNUAL_EXPENSE_KEYS: readonly AnnualExpenseKey[] = [
  'tuition',
  'carInsurance',
  'homeInsurance',
  'travelAndVacation',
  'taxes',
  'otherAnnualExpenses',
];

export const ALL_MONEY_KEYS: readonly MoneyFieldKey[] = [
  ...INCOME_MONEY_KEYS,
  ...SAVINGS_KEYS,
  ...MONTHLY_EXPENSE_KEYS,
  ...ANNUAL_EXPENSE_KEYS,
];
