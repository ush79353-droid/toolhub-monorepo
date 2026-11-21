export type Producer = 'countryX' | 'countryY';
export type Advantage = Producer | 'tie';
export type SpecializeGood = 'goodA' | 'goodB' | 'none';

export interface ComparativeAdvantageInput {
  countryXGoodA: string;
  countryXGoodB: string;
  countryYGoodA: string;
  countryYGoodB: string;
  /** Common labor endowment for optional PPF intercepts (disclosed). */
  laborEndowment: string;
  goodALabel: string;
  goodBLabel: string;
}

export interface ComparativeAdvantageResult {
  ocXA: number;
  ocXB: number;
  ocYA: number;
  ocYB: number;
  comparativeA: Advantage;
  comparativeB: Advantage;
  absoluteA: Advantage;
  absoluteB: Advantage;
  specializeX: SpecializeGood;
  specializeY: SpecializeGood;
  termsOfTradeLow: number | null;
  termsOfTradeHigh: number | null;
  labelXA: string;
  labelXB: string;
  labelYA: string;
  labelYB: string;
  labelCompXA: string;
  labelCompXB: string;
  labelCompYA: string;
  labelCompYB: string;
  formattedOcXA: string;
  formattedOcXB: string;
  formattedOcYA: string;
  formattedOcYB: string;
  summary: string;
  explanation: string;
  absoluteSummary: string;
  termsOfTradeNote: string | null;
  ppf: {
    laborH: number;
    xAMax: number;
    xBMax: number;
    yAMax: number;
    yBMax: number;
  };
  formulaBreakdown: string;
}

export type ComparativeAdvantageFieldErrors = {
  form?: string;
  countryXGoodA?: string;
  countryXGoodB?: string;
  countryYGoodA?: string;
  countryYGoodB?: string;
  laborEndowment?: string;
};

export function createDefaultInput(): ComparativeAdvantageInput {
  return {
    countryXGoodA: '',
    countryXGoodB: '',
    countryYGoodA: '',
    countryYGoodB: '',
    laborEndowment: '1',
    goodALabel: 'Good A',
    goodBLabel: 'Good B',
  };
}

export function createExampleInput(): ComparativeAdvantageInput {
  return {
    countryXGoodA: '100',
    countryXGoodB: '80',
    countryYGoodA: '90',
    countryYGoodB: '90',
    laborEndowment: '1',
    goodALabel: 'Good A',
    goodBLabel: 'Good B',
  };
}

export function createEmptyInput(): ComparativeAdvantageInput {
  return createDefaultInput();
}
