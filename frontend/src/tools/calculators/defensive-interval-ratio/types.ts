import type { SupportedCurrency } from '@/tools/shared/currency';

export type DirSolveTarget = 'dir' | 'requiredAssets' | 'maxDailyExpenditure';

export interface DefensiveIntervalRatioInput {
  solveTarget: DirSolveTarget;
  currency: SupportedCurrency;
  cashAndCashEquivalents: string;
  marketableSecurities: string;
  accountsReceivable: string;
  annualOperatingExpenses: string;
  annualNonCashCharges: string;
  /** Used when solving required assets or max daily expenditure */
  targetDays: string;
  /** Used when solving required assets (direct daily spend) */
  dailyCashExpenditure: string;
  /** Used when solving max daily expenditure */
  defensiveAssetsDirect: string;
}

export interface DefensiveIntervalRatioResult {
  solveTarget: DirSolveTarget;
  currency: SupportedCurrency;
  cashAndCashEquivalents: number;
  marketableSecurities: number;
  accountsReceivable: number;
  defensiveAssets: number;
  annualOperatingExpenses: number;
  annualNonCashCharges: number;
  annualCashOperatingExpenditure: number;
  averageDailyCashExpenditure: number;
  daysPerYear: number;
  defensiveIntervalDays: number;
  formattedCash: string;
  formattedSecurities: string;
  formattedReceivables: string;
  formattedDefensiveAssets: string;
  formattedOperatingExpenses: string;
  formattedNonCashCharges: string;
  formattedAnnualCashExpenditure: string;
  formattedDailyExpenditure: string;
  formattedDirDays: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type DefensiveIntervalRatioFieldErrors = {
  form?: string;
  cashAndCashEquivalents?: string;
  marketableSecurities?: string;
  accountsReceivable?: string;
  annualOperatingExpenses?: string;
  annualNonCashCharges?: string;
  targetDays?: string;
  dailyCashExpenditure?: string;
  defensiveAssetsDirect?: string;
};

export const DAYS_PER_YEAR = 365;

export function createDefaultInput(): DefensiveIntervalRatioInput {
  return {
    solveTarget: 'dir',
    currency: 'USD',
    cashAndCashEquivalents: '',
    marketableSecurities: '',
    accountsReceivable: '',
    annualOperatingExpenses: '',
    annualNonCashCharges: '',
    targetDays: '',
    dailyCashExpenditure: '',
    defensiveAssetsDirect: '',
  };
}

export function createEmptyInput(): DefensiveIntervalRatioInput {
  return createDefaultInput();
}

/** Company Alpha reference: DIR = 160 days. */
export function createExampleInput(): DefensiveIntervalRatioInput {
  return {
    solveTarget: 'dir',
    currency: 'USD',
    cashAndCashEquivalents: '10000000',
    marketableSecurities: '5000000',
    accountsReceivable: '17000000',
    annualOperatingExpenses: '110000000',
    annualNonCashCharges: '37000000',
    targetDays: '',
    dailyCashExpenditure: '',
    defensiveAssetsDirect: '',
  };
}
