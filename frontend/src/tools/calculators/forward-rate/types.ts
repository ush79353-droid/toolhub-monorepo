/** Time unit for period inputs; engine always works in years. */
export type ForwardRateTimeUnit = 'years' | 'months';

export interface ForwardRateInput {
  n1: string;
  n1Unit: ForwardRateTimeUnit;
  s1Percent: string;
  n2: string;
  n2Unit: ForwardRateTimeUnit;
  s2Percent: string;
  section1Open: boolean;
  section2Open: boolean;
  resultsOpen: boolean;
}

export interface ForwardRateResult {
  n1Years: number;
  n2Years: number;
  s1Decimal: number;
  s2Decimal: number;
  forwardRateDecimal: number;
  forwardRatePercent: number;
  formattedForwardRate: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
  compoundingNote: string;
}

export type ForwardRateFieldErrors = {
  form?: string;
  n1?: string;
  s1Percent?: string;
  n2?: string;
  s2Percent?: string;
};

export function createDefaultInput(): ForwardRateInput {
  return {
    n1: '',
    n1Unit: 'years',
    s1Percent: '',
    n2: '',
    n2Unit: 'years',
    s2Percent: '',
    section1Open: true,
    section2Open: true,
    resultsOpen: true,
  };
}

export function createEmptyInput(): ForwardRateInput {
  return createDefaultInput();
}

/** Worked example: n1=1y @ 5%, n2=2y @ 6% → f ≈ 7.0095%. */
export function createExampleInput(): ForwardRateInput {
  return {
    n1: '1',
    n1Unit: 'years',
    s1Percent: '5',
    n2: '2',
    n2Unit: 'years',
    s2Percent: '6',
    section1Open: true,
    section2Open: true,
    resultsOpen: true,
  };
}
