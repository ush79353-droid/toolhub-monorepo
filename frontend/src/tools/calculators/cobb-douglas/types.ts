export type ReturnsToScaleType = 'constant' | 'increasing' | 'decreasing';

export interface CobbDouglasInput {
  totalFactorProductivity: string;
  labor: string;
  laborElasticity: string;
  capital: string;
  capitalElasticity: string;
}

export interface CobbDouglasResult {
  totalProduction: number;
  returnsToScaleSum: number;
  returnsToScaleType: ReturnsToScaleType;
  marginalProductOfLabor: number | null;
  marginalProductOfCapital: number | null;
  averageProductOfLabor: number | null;
  averageProductOfCapital: number | null;
  formattedTotalProduction: string;
  formattedReturnsToScaleSum: string;
  formattedReturnsToScaleType: string;
  formattedMPL: string | null;
  formattedMPK: string | null;
  formattedAPL: string | null;
  formattedAPK: string | null;
  interpretation: string;
  explanation: string;
  warningMessage: string | null;
  formulaBreakdown: string;
}

export type CobbDouglasFieldErrors = {
  form?: string;
  totalFactorProductivity?: string;
  labor?: string;
  laborElasticity?: string;
  capital?: string;
  capitalElasticity?: string;
};

/** Default A = 1; other fields empty per brief. */
export function createDefaultInput(): CobbDouglasInput {
  return {
    totalFactorProductivity: '1',
    labor: '',
    laborElasticity: '',
    capital: '',
    capitalElasticity: '',
  };
}

export function createEmptyInput(): CobbDouglasInput {
  return {
    totalFactorProductivity: '',
    labor: '',
    laborElasticity: '',
    capital: '',
    capitalElasticity: '',
  };
}

/** Worked example: A=2, L=100, K=50, α=0.6, β=0.4 → Y≈151.57 */
export function createExampleInput(): CobbDouglasInput {
  return {
    totalFactorProductivity: '2',
    labor: '100',
    laborElasticity: '0.6',
    capital: '50',
    capitalElasticity: '0.4',
  };
}
