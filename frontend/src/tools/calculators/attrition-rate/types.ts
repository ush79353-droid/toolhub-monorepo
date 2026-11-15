export interface AttritionRateInput {
  startEmployees: string;
  endEmployees: string;
  leftEmployees: string;
}

export interface AttritionRateResult {
  averageEmployees: number;
  attritionRatePercent: number;
  formattedRate: string;
}

export type AttritionRateFieldErrors = {
  startEmployees?: string;
  endEmployees?: string;
  leftEmployees?: string;
  general?: string;
};
