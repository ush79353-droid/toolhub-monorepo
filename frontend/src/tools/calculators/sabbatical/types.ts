import type { SupportedCurrency } from '@/tools/shared/currency';

export type SabbaticalDurationUnit = 'years' | 'months' | 'weeks';

export type MonthlySavingsMode = 'auto' | 'manual';

export interface SabbaticalInput {
  savingsPercentage: string;
  yearsToSave: string;
  desiredDuration: string;
  durationUnit: SabbaticalDurationUnit;
  monthlyIncome: string;
  monthlySavings: string;
  monthlySavingsMode: MonthlySavingsMode;
  currentSavings: string;
  monthlyExpenses: string;
  bufferPercentage: string;
  currency: SupportedCurrency;
}

export interface SabbaticalResult {
  savingsPercentage: number;
  yearsToSave: number;
  desiredDurationValue: number;
  durationUnit: SabbaticalDurationUnit;
  desiredMonths: number;
  monthlyIncome: number;
  monthlySavings: number;
  currentSavings: number;
  monthlyExpenses: number;
  bufferPercentage: number;
  accumulatedSavings: number;
  totalAvailableFund: number;
  requiredFund: number;
  emergencyBuffer: number;
  totalRequired: number;
  affordableMonths: number | null;
  savingsSurplus: number;
  isAffordable: boolean;
  statusMessage: string;
  explanation: string;
  currency: SupportedCurrency;
}

export type SabbaticalFieldErrors = Partial<
  Record<
    | 'savingsPercentage'
    | 'yearsToSave'
    | 'desiredDuration'
    | 'monthlyIncome'
    | 'monthlySavings'
    | 'currentSavings'
    | 'monthlyExpenses'
    | 'bufferPercentage'
    | 'form',
    string
  >
>;

export function createDefaultInput(): SabbaticalInput {
  return {
    savingsPercentage: '50',
    yearsToSave: '1',
    desiredDuration: '1',
    durationUnit: 'years',
    monthlyIncome: '5000',
    monthlySavings: '2500',
    monthlySavingsMode: 'auto',
    currentSavings: '0',
    monthlyExpenses: '3000',
    bufferPercentage: '10',
    currency: 'USD',
  };
}

export function createEmptyInput(currency: SupportedCurrency = 'USD'): SabbaticalInput {
  return {
    savingsPercentage: '',
    yearsToSave: '',
    desiredDuration: '',
    durationUnit: 'years',
    monthlyIncome: '',
    monthlySavings: '',
    monthlySavingsMode: 'auto',
    currentSavings: '',
    monthlyExpenses: '',
    bufferPercentage: '',
    currency,
  };
}
