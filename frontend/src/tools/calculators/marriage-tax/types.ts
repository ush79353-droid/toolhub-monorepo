export type PreMarriageStatus = 'single' | 'head-of-household';

export interface SpouseInput {
  salaryBusiness: string;
  interestDividends: string;
  rentalPassive: string;
  shortTermGain: string;
  longTermGain: string;
  qualifiedDividends: string;
  retirementSavings: string;
  fileStatus: PreMarriageStatus;
  dependents: string;
  useStandardDeduction: 'yes' | 'no';
  stateCityTaxRatePercent: string;
  selfEmployed: 'yes' | 'no';
}

export interface MarriageTaxInput {
  spouse1: SpouseInput;
  spouse2: SpouseInput;
}

export interface FilingScenarioResult {
  label: string;
  agi: number;
  taxableIncome: number;
  federalTax: number;
  seTax: number;
  stateTax: number;
  totalTax: number;
  formattedTotalTax: string;
}

export interface MarriageTaxResult {
  taxYear: 2026;
  beforeMarriage: FilingScenarioResult;
  afterMarriage: FilingScenarioResult;
  /** Positive = marriage penalty; negative = marriage bonus. */
  difference: number;
  formattedDifference: string;
  verdict: 'penalty' | 'bonus' | 'neutral';
  assumptionsNote: string;
}

export type MarriageTaxFieldErrors = {
  form?: string;
  spouse1?: string;
  spouse2?: string;
};

export function createDefaultSpouse(
  defaults: Partial<SpouseInput> & {
    salaryBusiness: string;
    retirementSavings: string;
  }
): SpouseInput {
  return {
    interestDividends: '0',
    rentalPassive: '0',
    shortTermGain: '0',
    longTermGain: '0',
    qualifiedDividends: '0',
    fileStatus: 'single',
    dependents: '0',
    useStandardDeduction: 'yes',
    stateCityTaxRatePercent: '5',
    selfEmployed: 'no',
    ...defaults,
  };
}

export function createDefaultInput(): MarriageTaxInput {
  return {
    spouse1: createDefaultSpouse({
      salaryBusiness: '65000',
      retirementSavings: '10000',
    }),
    spouse2: createDefaultSpouse({
      salaryBusiness: '45000',
      retirementSavings: '6000',
    }),
  };
}
