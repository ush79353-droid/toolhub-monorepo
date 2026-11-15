export const CONVERSION_MODES = ['ads', 'websites'] as const;
export type ConversionMode = (typeof CONVERSION_MODES)[number];

export interface ConversionRateInput {
  mode: ConversionMode;
  totalConversions: number;
  totalClicksOrVisits: number;
}

export interface ConversionRateResult {
  mode: ConversionMode;
  totalConversions: number;
  totalClicksOrVisits: number;
  conversionRatePercent: number;
  rateDisplay: string;
}

export type ConversionRateFieldErrors = Record<string, string>;
