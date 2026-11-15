export interface BounceRateInput {
  websiteVisits: string;
  onePageVisits: string;
}

export interface BounceRateResult {
  bounceRatePercent: number;
  formattedRate: string;
}

export type BounceRateFieldErrors = {
  websiteVisits?: string;
  onePageVisits?: string;
  general?: string;
};
