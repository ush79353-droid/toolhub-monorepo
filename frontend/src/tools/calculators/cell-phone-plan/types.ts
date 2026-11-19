import type { SupportedCurrency } from '@/tools/shared/currency';

export type RecommendedPhonePlanOption =
  | 'outright'
  | 'carrier'
  | 'equal'
  | 'infeasible';

export interface CellPhonePlanInput {
  contractDuration: string;
  annualInterestRate: string;
  phonePrice: string;
  outrightMonthlyBill: string;
  carrierMonthlyBill: string;
  outrightOpen: boolean;
  carrierOpen: boolean;
  currency: SupportedCurrency;
}

export interface SavingsSimulation {
  initialDeposit: number;
  monthlyWithdrawal: number;
  monthlyInterestRate: number;
  finalBalance: number;
  totalInterestEarned: number;
  totalWithdrawals: number;
  isFeasible: boolean;
}

export interface CellPhonePlanResult {
  contractDuration: number;
  annualInterestRate: number;
  phonePrice: number;
  outrightMonthlyBill: number;
  carrierMonthlyBill: number;
  outrightTotalCost: number;
  carrierTotalPayments: number;
  interestEarned: number;
  carrierEffectiveTotalCost: number;
  monthlyDifference: number;
  costDifference: number;
  absoluteCostDifference: number;
  recommendedOption: RecommendedPhonePlanOption;
  recommendationText: string;
  savingsSimulation: SavingsSimulation;
  currency: SupportedCurrency;
}

export type CellPhonePlanFieldErrors = Partial<
  Record<
    | 'contractDuration'
    | 'annualInterestRate'
    | 'phonePrice'
    | 'outrightMonthlyBill'
    | 'carrierMonthlyBill'
    | 'form',
    string
  >
>;

export function createDefaultInput(): CellPhonePlanInput {
  return {
    contractDuration: '24',
    annualInterestRate: '0',
    phonePrice: '',
    outrightMonthlyBill: '',
    carrierMonthlyBill: '',
    outrightOpen: true,
    carrierOpen: true,
    currency: 'USD',
  };
}

export function createExampleInput(): CellPhonePlanInput {
  return {
    contractDuration: '24',
    annualInterestRate: '4',
    phonePrice: '800',
    outrightMonthlyBill: '20',
    carrierMonthlyBill: '50',
    outrightOpen: true,
    carrierOpen: true,
    currency: 'USD',
  };
}
