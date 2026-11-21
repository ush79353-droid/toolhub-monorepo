import type { SupportedCurrency } from '@/tools/shared/currency';

export interface MaximumDrawdownInput {
  peakValue: string;
  lowestValueAfterPeak: string;
  recoveryDrawdown: string;
  expectedAnnualGrowthRate: string;
  recoveryOpen: boolean;
  recoverySynced: boolean;
  currency: SupportedCurrency;
}

export interface MaximumDrawdownResult {
  peakValue: number;
  lowestValueAfterPeak: number;
  absoluteLoss: number;
  maximumDrawdownPercent: number;
  remainingValuePercent: number;
  requiredRecoveryGainPercent: number;
  currency: SupportedCurrency;
}

export type RecoveryStatus =
  | 'ok'
  | 'zero_drawdown'
  | 'zero_growth'
  | 'complete_loss'
  | 'invalid';

export interface RecoveryResult {
  maximumDrawdownPercent: number;
  expectedAnnualGrowthRatePercent: number;
  remainingValuePercent: number;
  requiredRecoveryGainPercent: number;
  recoveryYears: number | null;
  recoveryMonthsTotal: number | null;
  wholeYears: number | null;
  remainingMonths: number | null;
  formattedRecoveryTime: string;
  status: RecoveryStatus;
  explanation: string;
}

export type MaximumDrawdownFieldErrors = Partial<
  Record<
    | 'peakValue'
    | 'lowestValueAfterPeak'
    | 'recoveryDrawdown'
    | 'expectedAnnualGrowthRate'
    | 'form',
    string
  >
>;

export function createDefaultInput(): MaximumDrawdownInput {
  return {
    peakValue: '',
    lowestValueAfterPeak: '',
    recoveryDrawdown: '',
    expectedAnnualGrowthRate: '',
    recoveryOpen: false,
    recoverySynced: true,
    currency: 'USD',
  };
}

export function createExampleInput(): MaximumDrawdownInput {
  return {
    peakValue: '15000',
    lowestValueAfterPeak: '12500',
    recoveryDrawdown: '16.6667',
    expectedAnnualGrowthRate: '10',
    recoveryOpen: true,
    recoverySynced: true,
    currency: 'USD',
  };
}
