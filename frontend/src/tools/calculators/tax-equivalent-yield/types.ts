export type TaxEquivalentYieldSolveTarget =
  | 'taxableEquivalentYield'
  | 'taxExemptYield'
  | 'impliedTaxRate';

export interface TaxEquivalentYieldInput {
  solveTarget: TaxEquivalentYieldSolveTarget;
  bondYieldPercent: string;
  marginalTaxRatePercent: string;
  taxableEquivalentYieldPercent: string;
  /** Optional comparison panel */
  showComparison: boolean;
  taxableInvestmentYieldPercent: string;
}

export interface TaxEquivalentYieldResult {
  solveTarget: TaxEquivalentYieldSolveTarget;
  bondYieldPercent: number;
  marginalTaxRatePercent: number;
  taxableEquivalentYieldPercent: number;
  taxRetentionFactor: number;
  formattedBondYield: string;
  formattedTaxRate: string;
  formattedRetention: string;
  formattedTey: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
  /** Optional comparison */
  comparison: {
    taxableInvestmentYieldPercent: number;
    afterTaxTaxableYieldPercent: number;
    differencePp: number;
    formattedTaxableYield: string;
    formattedAfterTax: string;
    formattedDifference: string;
    note: string;
  } | null;
}

export type TaxEquivalentYieldFieldErrors = {
  form?: string;
  bondYieldPercent?: string;
  marginalTaxRatePercent?: string;
  taxableEquivalentYieldPercent?: string;
  taxableInvestmentYieldPercent?: string;
};

export function createDefaultInput(): TaxEquivalentYieldInput {
  return {
    solveTarget: 'taxableEquivalentYield',
    bondYieldPercent: '',
    marginalTaxRatePercent: '',
    taxableEquivalentYieldPercent: '',
    showComparison: false,
    taxableInvestmentYieldPercent: '',
  };
}

export function createEmptyInput(): TaxEquivalentYieldInput {
  return createDefaultInput();
}

/** Reference: 6% tax-exempt / (1 − 0.30) = 8.57% TEY. */
export function createExampleInput(): TaxEquivalentYieldInput {
  return {
    solveTarget: 'taxableEquivalentYield',
    bondYieldPercent: '6',
    marginalTaxRatePercent: '30',
    taxableEquivalentYieldPercent: '',
    showComparison: false,
    taxableInvestmentYieldPercent: '',
  };
}
