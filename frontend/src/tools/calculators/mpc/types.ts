import type { SupportedCurrency } from '@/tools/shared/currency';

/**
 * Mode A: derive MPC from ΔC / ΔYd (then consumption from a, b, Yd).
 * Mode B: enter MPC directly for the consumption function.
 */
export type MpcMode = 'from-changes' | 'direct-mpc';

export interface MpcInput {
  mode: MpcMode;
  currency: SupportedCurrency;
  changeInDisposableIncome: string;
  changeInConsumption: string;
  mpcDirect: string;
  autonomousConsumption: string;
  disposableIncome: string;
  showIncomeEqualsSpendingLine: boolean;
}

export interface ConsumptionCurvePoint {
  disposableIncome: number;
  consumerSpending: number;
}

export interface MpcResult {
  mode: MpcMode;
  currency: SupportedCurrency;
  changeInDisposableIncome: number | null;
  changeInConsumption: number | null;
  mpc: number | null;
  mpcUndefinedReason: string | null;
  mpcPercent: number | null;
  mpcWarning: string | null;
  autonomousConsumption: number;
  disposableIncome: number;
  consumerSpending: number | null;
  mps: number | null;
  mpsPercent: number | null;
  spendingMultiplier: number | null;
  multiplierUndefinedReason: string | null;
  breakEvenIncome: number | null;
  breakEvenUndefinedReason: string | null;
  formattedDeltaYd: string;
  formattedDeltaC: string;
  formattedMpc: string;
  formattedMpcPercent: string;
  formattedAutonomous: string;
  formattedDisposableIncome: string;
  formattedConsumerSpending: string;
  formattedMps: string;
  formattedMultiplier: string;
  formattedBreakEven: string;
  interpretation: string;
  explanation: string;
  formulaBreakdown: string;
  steps: string[];
  curvePoints: ConsumptionCurvePoint[];
  currentPoint: ConsumptionCurvePoint | null;
}

export type MpcFieldErrors = {
  form?: string;
  changeInDisposableIncome?: string;
  changeInConsumption?: string;
  mpcDirect?: string;
  autonomousConsumption?: string;
  disposableIncome?: string;
};

export function createDefaultInput(): MpcInput {
  return {
    mode: 'from-changes',
    currency: 'USD',
    changeInDisposableIncome: '',
    changeInConsumption: '',
    mpcDirect: '',
    autonomousConsumption: '',
    disposableIncome: '',
    showIncomeEqualsSpendingLine: false,
  };
}

export function createEmptyInput(): MpcInput {
  return createDefaultInput();
}

/** Teaching example matching the brief (ΔC=600, ΔYd=1000, a=18000, Yd=40000). */
export function createExampleInput(): MpcInput {
  return {
    mode: 'from-changes',
    currency: 'USD',
    changeInDisposableIncome: '1000',
    changeInConsumption: '600',
    mpcDirect: '0.6',
    autonomousConsumption: '18000',
    disposableIncome: '40000',
    showIncomeEqualsSpendingLine: false,
  };
}
