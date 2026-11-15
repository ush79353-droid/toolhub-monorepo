export interface EquivalentRateInput {
  nominalInterestRatePercent: string;
  compoundingFrequency: string;
  newCompoundingFrequency: string;
}

export interface EquivalentRateResult {
  equivalentRatePercent: number;
  aerPercent: number;
  formattedEquivalentRate: string;
  formattedAer: string;
}

export type EquivalentRateFieldErrors = {
  nominalInterestRatePercent?: string;
  compoundingFrequency?: string;
  newCompoundingFrequency?: string;
  form?: string;
};

export function createDefaultInput(): EquivalentRateInput {
  return {
    nominalInterestRatePercent: '',
    compoundingFrequency: '',
    newCompoundingFrequency: '',
  };
}
