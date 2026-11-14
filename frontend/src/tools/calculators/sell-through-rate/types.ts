export interface SellThroughRateInput {
  unitsSold: string;
  unitsReceived: string;
}

export interface SellThroughRateResult {
  sellThroughRatePercent: number;
  formattedRate: string;
}

export type SellThroughRateFieldErrors = {
  unitsSold?: string;
  unitsReceived?: string;
  general?: string;
};
