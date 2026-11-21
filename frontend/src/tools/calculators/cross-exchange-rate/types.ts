export interface CrossExchangeRateInput {
  rateAC: string;
  rateCA: string;
  rateBC: string;
  rateCB: string;
}

export interface CrossExchangeRateResult {
  rateAC: number;
  rateCA: number;
  rateBC: number;
  rateCB: number;
  crossAB: number;
  crossBA: number;
  formattedAC: string;
  formattedCA: string;
  formattedBC: string;
  formattedCB: string;
  formattedAB: string;
  formattedBA: string;
  pairASource: 'AC' | 'CA';
  pairBSource: 'BC' | 'CB';
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type CrossExchangeRateFieldErrors = {
  form?: string;
  rateAC?: string;
  rateCA?: string;
  rateBC?: string;
  rateCB?: string;
};

/** Screenshot defaults: empty rate fields. */
export function createDefaultInput(): CrossExchangeRateInput {
  return {
    rateAC: '',
    rateCA: '',
    rateBC: '',
    rateCB: '',
  };
}

export function createEmptyInput(): CrossExchangeRateInput {
  return createDefaultInput();
}

/**
 * Worked example: A/C = 1.10, B/C = 1.25 → A/B = 0.88, B/A ≈ 1.136364
 * (e.g. EUR/USD and GBP/USD → EUR/GBP via USD bridge).
 */
export function createExampleInput(): CrossExchangeRateInput {
  return {
    rateAC: '1.10',
    rateCA: '',
    rateBC: '1.25',
    rateCB: '',
  };
}
