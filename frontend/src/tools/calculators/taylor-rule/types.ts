import type { SupportedCurrency } from '@/tools/shared/currency';

export type GdpMagnitude =
  | 'units'
  | 'thousands'
  | 'millions'
  | 'billions'
  | 'trillions';

export const GDP_MAGNITUDE_OPTIONS: readonly {
  id: GdpMagnitude;
  label: string;
  factor: number;
}[] = [
  { id: 'units', label: 'Units', factor: 1 },
  { id: 'thousands', label: 'Thousands', factor: 1_000 },
  { id: 'millions', label: 'Millions', factor: 1_000_000 },
  { id: 'billions', label: 'Billions', factor: 1_000_000_000 },
  { id: 'trillions', label: 'Trillions', factor: 1_000_000_000_000 },
] as const;

export interface TaylorRuleInput {
  currency: SupportedCurrency;
  magnitude: GdpMagnitude;
  currentInflation: string;
  targetInflation: string;
  actualGdp: string;
  potentialGdp: string;
  neutralRealRate: string;
  inflationCoefficient: string;
  outputCoefficient: string;
  /** Optional expected inflation for approximate ex-ante real rate */
  expectedInflation: string;
  /** Optional lower bound for comparison only (not auto-imposed) */
  policyFloor: string;
}

export interface TaylorRuleResult {
  currency: SupportedCurrency;
  magnitude: GdpMagnitude;
  currentInflation: number;
  targetInflation: number;
  inflationGap: number;
  actualGdpBase: number;
  potentialGdpBase: number;
  outputGap: number;
  neutralRealRate: number;
  inflationCoefficient: number;
  outputCoefficient: number;
  standardRate: number;
  customRate: number;
  rateDifference: number;
  expectedInflation: number | null;
  approximateExAnteReal: number | null;
  policyFloor: number | null;
  flooredCustomRate: number | null;
  formattedInflationGap: string;
  formattedOutputGap: string;
  formattedActualGdp: string;
  formattedPotentialGdp: string;
  formattedNeutral: string;
  formattedStandardRate: string;
  formattedCustomRate: string;
  formattedDifference: string;
  formattedExAnte: string;
  formattedFloored: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
  outputGapStatus: 'positive' | 'zero' | 'negative';
}

export type TaylorRuleFieldErrors = {
  form?: string;
  currentInflation?: string;
  targetInflation?: string;
  actualGdp?: string;
  potentialGdp?: string;
  neutralRealRate?: string;
  inflationCoefficient?: string;
  outputCoefficient?: string;
  expectedInflation?: string;
  policyFloor?: string;
};

export function createDefaultInput(): TaylorRuleInput {
  return {
    currency: 'USD',
    magnitude: 'trillions',
    currentInflation: '',
    targetInflation: '',
    actualGdp: '',
    potentialGdp: '',
    neutralRealRate: '',
    inflationCoefficient: '0.5',
    outputCoefficient: '0.5',
    expectedInflation: '',
    policyFloor: '',
  };
}

export function createEmptyInput(): TaylorRuleInput {
  return createDefaultInput();
}

export function createExampleInput(): TaylorRuleInput {
  return {
    currency: 'USD',
    magnitude: 'trillions',
    currentInflation: '4',
    targetInflation: '2',
    actualGdp: '21',
    potentialGdp: '20',
    neutralRealRate: '2',
    inflationCoefficient: '0.5',
    outputCoefficient: '0.5',
    expectedInflation: '',
    policyFloor: '',
  };
}
