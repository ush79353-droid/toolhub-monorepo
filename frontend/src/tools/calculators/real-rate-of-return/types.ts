export interface RealRateOfReturnInput {
  nominalRatePercent: string;
  inflationRatePercent: string;
}

export interface RealRateOfReturnResult {
  realRatePercent: number;
  formattedRealRate: string;
}

export type RealRateOfReturnFieldErrors = {
  nominalRatePercent?: string;
  inflationRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): RealRateOfReturnInput {
  return {
    nominalRatePercent: '',
    inflationRatePercent: '',
  };
}
