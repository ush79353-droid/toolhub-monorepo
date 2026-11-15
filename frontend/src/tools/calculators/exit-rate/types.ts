export interface ExitRateInput {
  pageviews: string;
  exits: string;
}

export interface ExitRateResult {
  exitRatePercent: number;
  formattedRate: string;
}

export type ExitRateFieldErrors = {
  pageviews?: string;
  exits?: string;
  general?: string;
};
