export type FisherCalculationMode = 'real' | 'nominal' | 'inflation';

export interface FisherEffectInput {
  mode: FisherCalculationMode;
  nominalRate: string;
  realRate: string;
  expectedInflation: string;
}

export interface FisherEffectResult {
  mode: FisherCalculationMode;
  nominalRate: number;
  realRate: number;
  expectedInflation: number;
  /** Exact Fisher value for the computed field (same as that field). */
  exactComputed: number;
  /** Approximate Fisher value for the computed field. */
  approximateValue: number;
  approximationDifference: number;
  formattedNominal: string;
  formattedReal: string;
  formattedInflation: string;
  formattedApproximate: string;
  formattedDifference: string;
  formulaBreakdown: string;
  interpretation: string;
  explanation: string;
}

export type FisherEffectFieldErrors = {
  form?: string;
  nominalRate?: string;
  realRate?: string;
  expectedInflation?: string;
};

export function createDefaultInput(): FisherEffectInput {
  return {
    mode: 'real',
    nominalRate: '5',
    realRate: '',
    expectedInflation: '2',
  };
}

export function createEmptyInput(mode: FisherCalculationMode = 'real'): FisherEffectInput {
  return {
    mode,
    nominalRate: '',
    realRate: '',
    expectedInflation: '',
  };
}
