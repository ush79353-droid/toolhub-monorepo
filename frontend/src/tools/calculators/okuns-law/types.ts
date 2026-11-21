export type OkunsLawMode =
  | 'output-gap'
  | 'unemployment-change'
  | 'required-gdp-growth'
  | 'gdp-growth-gap';

export const OKUNS_LAW_MODE_OPTIONS: readonly {
  id: OkunsLawMode;
  label: string;
  short: string;
}[] = [
  {
    id: 'output-gap',
    label: 'Output gap',
    short: 'OutputGap = −β × (u − u*) with positive β',
  },
  {
    id: 'unemployment-change',
    label: 'Change in unemployment',
    short: 'Δu = −α × (g − g*) with positive α',
  },
  {
    id: 'required-gdp-growth',
    label: 'Required GDP growth',
    short: 'g = g* − Δu / α',
  },
  {
    id: 'gdp-growth-gap',
    label: 'GDP growth gap',
    short: 'g − g* = −Δu / α',
  },
] as const;

export interface OkunsLawInput {
  mode: OkunsLawMode;
  unemploymentRate: string;
  naturalUnemploymentRate: string;
  /** Positive β for output-gap mode */
  outputGapCoefficient: string;
  actualGDPGrowthRate: string;
  trendGDPGrowthRate: string;
  /** Positive α for growth-rate modes */
  growthCoefficient: string;
  unemploymentChange: string;
}

export interface OkunsLawChartPoint {
  x: number;
  y: number;
}

export interface OkunsLawResult {
  mode: OkunsLawMode;
  modeLabel: string;
  unemploymentRate: number | null;
  naturalUnemploymentRate: number | null;
  unemploymentGap: number | null;
  outputGapCoefficient: number | null;
  outputGap: number | null;
  actualGDPGrowthRate: number | null;
  trendGDPGrowthRate: number | null;
  gdpGrowthGap: number | null;
  growthCoefficient: number | null;
  unemploymentChange: number | null;
  requiredGDPGrowth: number | null;
  formattedUnemploymentRate: string;
  formattedNaturalRate: string;
  formattedUnemploymentGap: string;
  formattedOutputGapCoeff: string;
  formattedOutputGap: string;
  formattedActualGrowth: string;
  formattedTrendGrowth: string;
  formattedGrowthGap: string;
  formattedGrowthCoeff: string;
  formattedUnemploymentChange: string;
  formattedRequiredGrowth: string;
  interpretation: string;
  explanation: string;
  formulaBreakdown: string;
  steps: string[];
  chartPoints: OkunsLawChartPoint[];
  highlight: OkunsLawChartPoint | null;
  chartKind: 'output-gap' | 'growth' | null;
}

export type OkunsLawFieldErrors = {
  form?: string;
  unemploymentRate?: string;
  naturalUnemploymentRate?: string;
  outputGapCoefficient?: string;
  actualGDPGrowthRate?: string;
  trendGDPGrowthRate?: string;
  growthCoefficient?: string;
  unemploymentChange?: string;
};

export function createDefaultInput(): OkunsLawInput {
  return {
    mode: 'output-gap',
    unemploymentRate: '',
    naturalUnemploymentRate: '',
    outputGapCoefficient: '',
    actualGDPGrowthRate: '',
    trendGDPGrowthRate: '',
    growthCoefficient: '',
    unemploymentChange: '',
  };
}

export function createEmptyInput(mode: OkunsLawMode = 'output-gap'): OkunsLawInput {
  return { ...createDefaultInput(), mode };
}

export function createExampleInput(mode: OkunsLawMode = 'output-gap'): OkunsLawInput {
  const base = createDefaultInput();
  if (mode === 'output-gap') {
    return {
      ...base,
      mode,
      unemploymentRate: '7',
      naturalUnemploymentRate: '5',
      outputGapCoefficient: '2',
    };
  }
  if (mode === 'unemployment-change') {
    return {
      ...base,
      mode,
      actualGDPGrowthRate: '4.5',
      trendGDPGrowthRate: '2.5',
      growthCoefficient: '0.4',
    };
  }
  if (mode === 'required-gdp-growth') {
    return {
      ...base,
      mode,
      unemploymentChange: '-1',
      trendGDPGrowthRate: '2',
      growthCoefficient: '0.5',
    };
  }
  return {
    ...base,
    mode: 'gdp-growth-gap',
    unemploymentChange: '-0.8',
    growthCoefficient: '0.4',
  };
}
