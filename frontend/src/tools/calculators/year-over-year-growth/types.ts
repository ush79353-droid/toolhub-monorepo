export interface YearOverYearGrowthInput {
  initialYearValue: string;
  finalYearValue: string;
  /** Optional CAGR periods; blank until the CAGR section is used. */
  numberOfYears: string;
}

export interface YearOverYearGrowthResult {
  yoyGrowthPercent: number;
  formattedYoyGrowth: string;
  cagrPercent: number | null;
  formattedCagr: string | null;
}

export type YearOverYearGrowthFieldErrors = {
  initialYearValue?: string;
  finalYearValue?: string;
  numberOfYears?: string;
  form?: string;
};

export function createDefaultInput(): YearOverYearGrowthInput {
  return {
    initialYearValue: '',
    finalYearValue: '',
    numberOfYears: '',
  };
}
