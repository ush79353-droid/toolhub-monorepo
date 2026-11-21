import type { SupportedCurrency } from '@/tools/shared/currency';

export type LgdMode = 'basic' | 'advanced';

/** Last-edited source for recovery rate ↔ loss severity sync. */
export type RateSource = 'recoveryRate' | 'lossSeverity';

/** Advanced reverse solve target when enough fields are supplied. */
export type AdvancedSolveTarget =
  | 'lgdAmount'
  | 'eadFromLgd'
  | 'ratesFromAmounts';

export interface LgdInput {
  mode: LgdMode;
  currency: SupportedCurrency;
  rateSource: RateSource;
  recoveryRatePercent: string;
  lossSeverityPercent: string;
  expectedExposure: string;
  /** Advanced */
  advancedSolve: AdvancedSolveTarget;
  recoveryAmount: string;
  lossGivenDefaultAmount: string;
  probabilityOfDefaultPercent: string;
  pdHorizonLabel: string;
}

export interface LgdResult {
  mode: LgdMode;
  currency: SupportedCurrency;
  recoveryRate: number;
  lossSeverity: number;
  exposureAtDefault: number;
  recoveryAmount: number;
  lossGivenDefault: number;
  expectedLoss: number | null;
  pdDecimal: number | null;
  pdHorizonLabel: string;
  formattedRecoveryRate: string;
  formattedLossSeverity: string;
  formattedExposure: string;
  formattedRecoveryAmount: string;
  formattedLgdAmount: string;
  formattedExpectedLoss: string | null;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type LgdFieldErrors = {
  form?: string;
  recoveryRatePercent?: string;
  lossSeverityPercent?: string;
  expectedExposure?: string;
  recoveryAmount?: string;
  lossGivenDefaultAmount?: string;
  probabilityOfDefaultPercent?: string;
};

export function createDefaultInput(): LgdInput {
  return {
    mode: 'basic',
    currency: 'PKR',
    rateSource: 'recoveryRate',
    recoveryRatePercent: '',
    lossSeverityPercent: '',
    expectedExposure: '',
    advancedSolve: 'lgdAmount',
    recoveryAmount: '',
    lossGivenDefaultAmount: '',
    probabilityOfDefaultPercent: '',
    pdHorizonLabel: 'One year',
  };
}

export function createEmptyInput(): LgdInput {
  return createDefaultInput();
}

/** Reference example: EAD 100,000 · RR 80% → LGD 20,000. */
export function createExampleInput(): LgdInput {
  return {
    mode: 'basic',
    currency: 'PKR',
    rateSource: 'recoveryRate',
    recoveryRatePercent: '80',
    lossSeverityPercent: '20',
    expectedExposure: '100000',
    advancedSolve: 'lgdAmount',
    recoveryAmount: '',
    lossGivenDefaultAmount: '',
    probabilityOfDefaultPercent: '',
    pdHorizonLabel: 'One year',
  };
}
