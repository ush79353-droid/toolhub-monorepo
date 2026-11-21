export type GiniMode = 'areas' | 'incomes';

export interface GiniInput {
  mode: GiniMode;
  areaA: string;
  areaB: string;
  /** Comma or newline separated nonnegative incomes (advanced mode). */
  incomesText: string;
}

export interface LorenzPoint {
  populationShare: number;
  incomeShare: number;
}

export interface GiniResult {
  mode: GiniMode;
  giniCoefficient: number;
  giniIndex: number;
  areaA: number | null;
  areaB: number | null;
  combinedArea: number | null;
  areaAShare: number | null;
  areaBShare: number | null;
  formattedGini: string;
  formattedIndex: string;
  statusTitle: string;
  interpretation: string;
  formulaBreakdown: string;
  steps: string[];
  explanation: string;
  lorenz: {
    kind: 'illustrative' | 'from-data';
    points: LorenzPoint[];
    note: string;
  };
  observationCount: number | null;
}

export type GiniFieldErrors = {
  form?: string;
  areaA?: string;
  areaB?: string;
  incomesText?: string;
};

export function createDefaultInput(): GiniInput {
  return {
    mode: 'areas',
    areaA: '',
    areaB: '',
    incomesText: '',
  };
}

export function createEmptyInput(mode: GiniMode = 'areas'): GiniInput {
  return { ...createDefaultInput(), mode };
}

export function createExampleInput(): GiniInput {
  return {
    mode: 'areas',
    areaA: '1200',
    areaB: '3800',
    incomesText: '',
  };
}

export function createIncomeExampleInput(): GiniInput {
  return {
    mode: 'incomes',
    areaA: '',
    areaB: '',
    incomesText: '10000, 20000, 30000, 40000, 100000',
  };
}
