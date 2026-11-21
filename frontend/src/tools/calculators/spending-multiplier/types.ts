import type { SupportedCurrency } from '@/tools/shared/currency';

/** Which of MPC / MPS / k is the authoritative input. */
export type PropensitySource = 'mpc' | 'mps' | 'multiplier';

/** Which impact field is solved for. */
export type ImpactSolve = 'output' | 'required';

export type MoneyMagnitude =
  | 'units'
  | 'thousands'
  | 'millions'
  | 'billions'
  | 'trillions';

export const MONEY_MAGNITUDE_OPTIONS: readonly {
  id: MoneyMagnitude;
  label: string;
  factor: number;
}[] = [
  { id: 'units', label: 'Units', factor: 1 },
  { id: 'thousands', label: 'Thousands', factor: 1_000 },
  { id: 'millions', label: 'Millions', factor: 1_000_000 },
  { id: 'billions', label: 'Billions', factor: 1_000_000_000 },
  { id: 'trillions', label: 'Trillions', factor: 1_000_000_000_000 },
] as const;

export interface SpendingRound {
  round: number;
  label: string;
  additionalSpending: number;
  cumulative: number;
  formattedAdditional: string;
  formattedCumulative: string;
}

export interface SpendingMultiplierInput {
  propensitySource: PropensitySource;
  impactSolve: ImpactSolve;
  currency: SupportedCurrency;
  magnitude: MoneyMagnitude;
  mpc: string;
  mps: string;
  multiplier: string;
  autonomousSpending: string;
  targetOutputChange: string;
  /** Optional observed GDP change for comparison */
  observedGdpChange: string;
  roundsToShow: string;
}

export interface SpendingMultiplierResult {
  currency: SupportedCurrency;
  magnitude: MoneyMagnitude;
  mpc: number;
  mps: number;
  multiplier: number | null;
  multiplierUndefined: boolean;
  autonomousSpendingBase: number | null;
  outputChangeBase: number | null;
  requiredSpendingBase: number | null;
  observedGdpBase: number | null;
  observedDifferenceBase: number | null;
  observedPercentDiff: number | null;
  formattedMpc: string;
  formattedMps: string;
  formattedMultiplier: string;
  formattedAutonomous: string;
  formattedOutputChange: string;
  formattedRequired: string;
  formattedObserved: string;
  formattedObservedDiff: string;
  formattedObservedPct: string;
  displayMpc: string;
  displayMps: string;
  displayMultiplier: string;
  displayAutonomous: string;
  displayOutput: string;
  displayRequired: string;
  rounds: SpendingRound[];
  roundsPartialTotal: number | null;
  roundsPartialShare: number | null;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type SpendingMultiplierFieldErrors = {
  form?: string;
  mpc?: string;
  mps?: string;
  multiplier?: string;
  autonomousSpending?: string;
  targetOutputChange?: string;
  observedGdpChange?: string;
  roundsToShow?: string;
};

export function createDefaultInput(): SpendingMultiplierInput {
  return {
    propensitySource: 'mpc',
    impactSolve: 'output',
    currency: 'USD',
    magnitude: 'units',
    mpc: '',
    mps: '',
    multiplier: '',
    autonomousSpending: '',
    targetOutputChange: '',
    observedGdpChange: '',
    roundsToShow: '5',
  };
}

export function createEmptyInput(): SpendingMultiplierInput {
  return createDefaultInput();
}

export function createExampleInput(): SpendingMultiplierInput {
  return {
    propensitySource: 'mpc',
    impactSolve: 'output',
    currency: 'USD',
    magnitude: 'units',
    mpc: '0.6',
    mps: '0.4',
    multiplier: '',
    autonomousSpending: '1000000',
    targetOutputChange: '',
    observedGdpChange: '2000000',
    roundsToShow: '5',
  };
}
