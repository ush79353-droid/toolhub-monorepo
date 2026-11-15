export interface PvifaInput {
  interestRatePercent: string;
  periods: string;
}

export interface PvifaResult {
  interestRatePercent: number;
  periods: number;
  pvifa: number;
  formattedPvifa: string;
}

export type PvifaFieldErrors = {
  interestRatePercent?: string;
  periods?: string;
  form?: string;
};

export function createDefaultInput(): PvifaInput {
  return {
    interestRatePercent: '',
    periods: '',
  };
}
