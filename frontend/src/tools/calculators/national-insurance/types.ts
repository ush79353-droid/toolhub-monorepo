import {
  DEFAULT_NI_TAX_YEAR,
  type NiTaxYearId,
} from './ni-parameters';

export type { NiTaxYearId };

export interface NationalInsuranceInput {
  employmentIncome: string;
  selfEmploymentIncome: string;
  taxYear: NiTaxYearId;
}

export interface NationalInsuranceResult {
  taxYear: NiTaxYearId;
  taxYearLabel: string;
  employmentIncome: number;
  selfEmploymentIncome: number;
  totalAnnualIncome: number;
  class1Employee: number;
  class4: number;
  class2: number;
  totalNationalInsurance: number;
  formattedEmploymentIncome: string;
  formattedSelfEmploymentIncome: string;
  formattedTotalAnnualIncome: string;
  formattedClass1Employee: string;
  formattedClass4: string;
  formattedTotalNationalInsurance: string;
  explanation: string;
  disclosures: readonly string[];
}

export type NationalInsuranceFieldErrors = {
  form?: string;
  employmentIncome?: string;
  selfEmploymentIncome?: string;
};

/** Empty employment; SE default 0; current tax year. */
export function createDefaultInput(): NationalInsuranceInput {
  return {
    employmentIncome: '',
    selfEmploymentIncome: '0',
    taxYear: DEFAULT_NI_TAX_YEAR,
  };
}

/** Worked example: £40,000 employment → Class 1 £2,194.40 (2026/27). */
export function createExampleInput(): NationalInsuranceInput {
  return {
    employmentIncome: '40000',
    selfEmploymentIncome: '0',
    taxYear: DEFAULT_NI_TAX_YEAR,
  };
}

export function createEmptyInput(
  taxYear: NiTaxYearId = DEFAULT_NI_TAX_YEAR
): NationalInsuranceInput {
  return {
    employmentIncome: '',
    selfEmploymentIncome: '',
    taxYear,
  };
}
