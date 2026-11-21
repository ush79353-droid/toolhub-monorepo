export type PhillipsVersion =
  | 'traditional'
  | 'new-classical'
  | 'new-keynesian';

export type TraditionalTarget =
  | 'wage-growth'
  | 'unemployment-change'
  | 'trend-wage-growth';

export type NewClassicalTarget =
  | 'inflation'
  | 'unemployment'
  | 'expected-inflation'
  | 'natural-unemployment'
  | 'supply-shock';

export type NewKeynesianTarget =
  | 'inflation'
  | 'expected-inflation'
  | 'output-gap'
  | 'cost-push';

export const PHILLIPS_VERSION_OPTIONS: readonly {
  id: PhillipsVersion;
  label: string;
  short: string;
}[] = [
  {
    id: 'traditional',
    label: 'Traditional',
    short: 'Simplified wage-change: w = w_T − β Δu (β > 0 documented)',
  },
  {
    id: 'new-classical',
    label: 'New Classical',
    short: 'Expectations-augmented: π = πᵉ − α(u − uₙ) + s',
  },
  {
    id: 'new-keynesian',
    label: 'New Keynesian',
    short: 'Simplified NKPC: πₜ = β E[πₜ₊₁] + κ xₜ + sₜ',
  },
] as const;

export const TRADITIONAL_TARGET_OPTIONS: readonly {
  id: TraditionalTarget;
  label: string;
}[] = [
  { id: 'wage-growth', label: 'Money-wage growth (w)' },
  { id: 'unemployment-change', label: 'Unemployment change (Δu)' },
  { id: 'trend-wage-growth', label: 'Trend wage growth (w_T)' },
] as const;

export const NEW_CLASSICAL_TARGET_OPTIONS: readonly {
  id: NewClassicalTarget;
  label: string;
}[] = [
  { id: 'inflation', label: 'Inflation (π)' },
  { id: 'unemployment', label: 'Unemployment (u)' },
  { id: 'expected-inflation', label: 'Expected inflation (πᵉ)' },
  { id: 'natural-unemployment', label: 'Natural unemployment (uₙ)' },
  { id: 'supply-shock', label: 'Supply shock (s)' },
] as const;

export const NEW_KEYNESIAN_TARGET_OPTIONS: readonly {
  id: NewKeynesianTarget;
  label: string;
}[] = [
  { id: 'inflation', label: 'Current inflation (πₜ)' },
  { id: 'expected-inflation', label: 'Expected inflation E[πₜ₊₁]' },
  { id: 'output-gap', label: 'Output gap (xₜ)' },
  { id: 'cost-push', label: 'Cost-push shock (sₜ)' },
] as const;

export interface PhillipsCurveInput {
  version: PhillipsVersion;
  traditionalTarget: TraditionalTarget;
  newClassicalTarget: NewClassicalTarget;
  newKeynesianTarget: NewKeynesianTarget;
  /** Traditional */
  wageGrowth: string;
  trendWageGrowth: string;
  unemploymentChange: string;
  traditionalSensitivity: string;
  /** New Classical */
  inflation: string;
  expectedInflation: string;
  unemploymentRate: string;
  naturalUnemploymentRate: string;
  classicalSlope: string;
  supplyShock: string;
  /** New Keynesian */
  nkExpectedInflation: string;
  discountFactor: string;
  outputGap: string;
  nkSlope: string;
  costPushShock: string;
  nkInflation: string;
}

export interface PhillipsChartPoint {
  x: number;
  y: number;
}

export interface PhillipsCurveResult {
  version: PhillipsVersion;
  versionLabel: string;
  targetLabel: string;
  primaryValue: number;
  primaryLabel: string;
  formattedPrimary: string;
  unemploymentGap: number | null;
  inflationSurprise: number | null;
  expectedContribution: number | null;
  gapContribution: number | null;
  shockContribution: number | null;
  wageVsTrend: number | null;
  formattedUnemploymentGap: string;
  formattedInflationSurprise: string;
  formattedExpectedContribution: string;
  formattedGapContribution: string;
  formattedShockContribution: string;
  formattedWageVsTrend: string;
  interpretation: string;
  explanation: string;
  formulaBreakdown: string;
  steps: string[];
  chartTitle: string;
  chartXLabel: string;
  chartYLabel: string;
  chartPoints: PhillipsChartPoint[];
  highlight: PhillipsChartPoint | null;
  referenceLines: { x?: number; y?: number; label: string }[];
}

export type PhillipsFieldErrors = {
  form?: string;
  wageGrowth?: string;
  trendWageGrowth?: string;
  unemploymentChange?: string;
  traditionalSensitivity?: string;
  inflation?: string;
  expectedInflation?: string;
  unemploymentRate?: string;
  naturalUnemploymentRate?: string;
  classicalSlope?: string;
  supplyShock?: string;
  nkExpectedInflation?: string;
  discountFactor?: string;
  outputGap?: string;
  nkSlope?: string;
  costPushShock?: string;
  nkInflation?: string;
};

export function createDefaultInput(): PhillipsCurveInput {
  return {
    version: 'traditional',
    traditionalTarget: 'wage-growth',
    newClassicalTarget: 'inflation',
    newKeynesianTarget: 'inflation',
    wageGrowth: '',
    trendWageGrowth: '',
    unemploymentChange: '',
    traditionalSensitivity: '',
    inflation: '',
    expectedInflation: '',
    unemploymentRate: '',
    naturalUnemploymentRate: '',
    classicalSlope: '',
    supplyShock: '',
    nkExpectedInflation: '',
    discountFactor: '',
    outputGap: '',
    nkSlope: '',
    costPushShock: '',
    nkInflation: '',
  };
}

export function createEmptyInput(
  version: PhillipsVersion = 'traditional'
): PhillipsCurveInput {
  return { ...createDefaultInput(), version };
}

export function createExampleInput(
  version: PhillipsVersion = 'traditional'
): PhillipsCurveInput {
  const base = createDefaultInput();
  if (version === 'traditional') {
    return {
      ...base,
      version,
      traditionalTarget: 'wage-growth',
      trendWageGrowth: '4',
      unemploymentChange: '1',
      traditionalSensitivity: '0.5',
    };
  }
  if (version === 'new-classical') {
    return {
      ...base,
      version,
      newClassicalTarget: 'inflation',
      expectedInflation: '3',
      unemploymentRate: '6',
      naturalUnemploymentRate: '5',
      classicalSlope: '0.5',
      supplyShock: '0',
    };
  }
  return {
    ...base,
    version: 'new-keynesian',
    newKeynesianTarget: 'inflation',
    nkExpectedInflation: '3',
    discountFactor: '0.99',
    outputGap: '2',
    nkSlope: '0.25',
    costPushShock: '0.5',
  };
}
