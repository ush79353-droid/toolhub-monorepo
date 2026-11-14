export interface CtrInput {
  impressions: string;
  clicks: string;
}

export interface CtrResult {
  ctrPercent: number;
  formattedRate: string;
}

export type CtrFieldErrors = {
  impressions?: string;
  clicks?: string;
  general?: string;
};
