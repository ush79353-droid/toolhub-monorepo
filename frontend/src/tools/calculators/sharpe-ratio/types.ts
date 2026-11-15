export interface SharpeRatioInput {
  investmentReturn: string;
  riskFreeReturn: string;
  standardDeviation: string;
}

export interface SharpeRatioResult {
  riskPremiumPercent: number;
  sharpeRatio: number;
  formattedRiskPremium: string;
  formattedSharpeRatio: string;
}

export type SharpeRatioFieldErrors = {
  investmentReturn?: string;
  riskFreeReturn?: string;
  standardDeviation?: string;
  form?: string;
};

export function createDefaultInput(): SharpeRatioInput {
  return {
    investmentReturn: '',
    riskFreeReturn: '',
    standardDeviation: '',
  };
}
