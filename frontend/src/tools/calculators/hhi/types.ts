export const MIN_FIRMS = 1;
export const DEFAULT_FIRMS = 3;
export const MAX_FIRMS = 15;

export interface HhiInput {
  /** Market shares as percentages (strings; blank until typed). Length 1–15. */
  shares: string[];
}

export interface HhiResult {
  shares: number[];
  shareTotal: number;
  hhi: number;
  firmCount: number;
  coversPartialMarket: boolean;
  formattedHhi: string;
  formattedShareTotal: string;
}

export type HhiFieldErrors = {
  shares?: string[];
  form?: string;
};

export function createDefaultInput(): HhiInput {
  return {
    shares: Array.from({ length: DEFAULT_FIRMS }, () => ''),
  };
}
