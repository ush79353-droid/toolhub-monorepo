import type { SupportedCurrency } from '@/tools/shared/currency';

export interface EmergencyFundInput {
  monthlyExpenses: string;
  monthsDesired: string;
  additionalOpen: boolean;
  currentSavings: string;
  currency: SupportedCurrency;
}

export interface EmergencyFundProgress {
  currentSavings: number;
  requiredEmergencyFund: number;
  remainingAmount: number;
  progressPercentage: number;
  isGoalAchieved: boolean;
}

export interface EmergencyFundResult {
  monthlyExpenses: number;
  monthsDesired: number;
  emergencyFund: number;
  annualExpenses: number;
  dailyExpenses: number;
  explanation: string;
  progress: EmergencyFundProgress | null;
  currency: SupportedCurrency;
}

export type EmergencyFundFieldErrors = Partial<
  Record<'monthlyExpenses' | 'monthsDesired' | 'currentSavings' | 'form', string>
>;

export const EMERGENCY_FUND_MAX_MONTHS = 60;

export function createDefaultInput(): EmergencyFundInput {
  return {
    monthlyExpenses: '',
    monthsDesired: '',
    additionalOpen: false,
    currentSavings: '',
    currency: 'USD',
  };
}

export function createExampleInput(): EmergencyFundInput {
  return {
    monthlyExpenses: '2500',
    monthsDesired: '6',
    additionalOpen: false,
    currentSavings: '',
    currency: 'USD',
  };
}
