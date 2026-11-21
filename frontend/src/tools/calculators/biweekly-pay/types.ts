import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last-edited wage period — authoritative for biweekly conversion. */
export type BiweeklyPaySourceField =
  | 'annual'
  | 'monthly'
  | 'weekly'
  | 'daily'
  | 'hourly';

export interface BiweeklyPayInput {
  sourceField: BiweeklyPaySourceField;
  annualSalary: string;
  annualSalaryCurrency: SupportedCurrency;
  monthlyWage: string;
  monthlyWageCurrency: SupportedCurrency;
  weeklyWage: string;
  weeklyWageCurrency: SupportedCurrency;
  dailyWage: string;
  dailyWageCurrency: SupportedCurrency;
  hourlyWage: string;
  hourlyWageCurrency: SupportedCurrency;
  /** Hours per week (default 40). Never FX-converted. */
  hoursPerWeek: string;
  /** Days per week (default 5). Never FX-converted. */
  daysPerWeek: string;
  biweeklyCurrency: SupportedCurrency;
  wagesOpen: boolean;
  resultsOpen: boolean;
}

export interface BiweeklyPayResult {
  biweeklyCanonical: number;
  biweekly: number;
  sourceField: BiweeklyPaySourceField;
  sourceCurrency: SupportedCurrency;
  biweeklyCurrency: SupportedCurrency;
  formattedBiweekly: string;
}

export type BiweeklyPayFieldErrors = {
  annualSalary?: string;
  monthlyWage?: string;
  weeklyWage?: string;
  dailyWage?: string;
  hourlyWage?: string;
  hoursPerWeek?: string;
  daysPerWeek?: string;
  form?: string;
};

export function createDefaultInput(): BiweeklyPayInput {
  return {
    sourceField: 'annual',
    annualSalary: '',
    annualSalaryCurrency: 'PKR',
    monthlyWage: '',
    monthlyWageCurrency: 'PKR',
    weeklyWage: '',
    weeklyWageCurrency: 'PKR',
    dailyWage: '',
    dailyWageCurrency: 'PKR',
    hourlyWage: '',
    hourlyWageCurrency: 'PKR',
    hoursPerWeek: '40',
    daysPerWeek: '5',
    biweeklyCurrency: 'PKR',
    wagesOpen: true,
    resultsOpen: true,
  };
}
