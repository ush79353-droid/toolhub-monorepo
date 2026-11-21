export type FisherEquationMode = 'real' | 'nominal' | 'inflation';

export interface FisherEquationInput {
  mode: FisherEquationMode;
  nominalRate: string;
  realRate: string;
  expectedInflation: string;
}

export interface FisherEquationResult {
  mode: FisherEquationMode;
  nominalRate: number;
  realRate: number;
  expectedInflation: number;
  exactComputed: number;
  approximateValue: number;
  approximationDifference: number;
  formattedNominal: string;
  formattedReal: string;
  formattedInflation: string;
  formattedApproximate: string;
  formattedDifferencePp: string;
  formulaBreakdown: string;
  stepByStep: string[];
  interpretation: string;
  explanation: string;
  activeEquation: string;
}

export type FisherEquationFieldErrors = {
  form?: string;
  nominalRate?: string;
  realRate?: string;
  expectedInflation?: string;
};

/** Screenshot-aligned defaults: 8% nominal, 3% inflation. */
export function createDefaultInput(): FisherEquationInput {
  return {
    mode: 'real',
    nominalRate: '8',
    realRate: '',
    expectedInflation: '3',
  };
}

export function createEmptyInput(
  mode: FisherEquationMode = 'real'
): FisherEquationInput {
  return {
    mode,
    nominalRate: '',
    realRate: '',
    expectedInflation: '',
  };
}
