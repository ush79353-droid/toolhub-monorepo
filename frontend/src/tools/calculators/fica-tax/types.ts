import type {
  FicaEmploymentType,
  FicaFilingStatus,
  FicaTaxYear,
} from './fica-parameters';

export type { FicaEmploymentType, FicaFilingStatus, FicaTaxYear };

/** Screenshot-first FICA inputs. Fixed USD — no FX. */
export interface FicaInput {
  employmentType: FicaEmploymentType;
  taxYear: FicaTaxYear;
  filingStatus: FicaFilingStatus;
  /** FICA wages (employee) or net SE profit (self-employed). */
  income: string;
}

export interface FicaResult {
  employmentType: FicaEmploymentType;
  taxYear: FicaTaxYear;
  filingStatus: FicaFilingStatus;
  income: number;
  socialSecurityWageBase: number;
  additionalMedicareThreshold: number;

  /** Wages or SE earnings subject to Social Security (after wage base / 92.35%). */
  socialSecurityTaxable: number;
  /** Wages or SE earnings subject to Medicare (uncapped; SE after 92.35%). */
  medicareTaxable: number;

  employeeSocialSecurity: number;
  employeeMedicare: number;
  additionalMedicare: number;
  employerSocialSecurity: number;
  employerMedicare: number;

  /** Self-employment only — Schedule SE Social Security component. */
  seSocialSecurity: number;
  /** Self-employment only — Schedule SE Medicare component. */
  seMedicare: number;
  /** IRC §164(f) deductible half of regular SE tax (excludes Additional Medicare). */
  seDeductibleHalf: number;

  /** Employee FICA (SS + Medicare + Additional Medicare) or total SE tax liability. */
  taxpayerTotal: number;
  /** Employer FICA share (0 when self-employed). */
  employerTotal: number;
  /** Combined employee + employer FICA, or total SE tax. */
  combinedTotal: number;

  /** Taxpayer payroll / SE tax ÷ income × 100. */
  effectiveTaxpayerRate: number;
  /** Combined FICA ÷ income × 100 (employee mode); same as taxpayer rate for SE. */
  effectiveCombinedRate: number;

  formattedIncome: string;
  formattedEmployeeSocialSecurity: string;
  formattedEmployeeMedicare: string;
  formattedAdditionalMedicare: string;
  formattedEmployerSocialSecurity: string;
  formattedEmployerMedicare: string;
  formattedSeSocialSecurity: string;
  formattedSeMedicare: string;
  formattedSeDeductibleHalf: string;
  formattedTaxpayerTotal: string;
  formattedEmployerTotal: string;
  formattedCombinedTotal: string;
  formattedEffectiveTaxpayerRate: string;
  formattedEffectiveCombinedRate: string;
  summaryText: string;
  disclosures: readonly string[];
}

export type FicaFieldErrors = {
  income?: string;
  form?: string;
};

export const TAX_YEAR_OPTIONS: readonly { year: FicaTaxYear; label: string }[] = [
  { year: 2026, label: '2026' },
  { year: 2025, label: '2025' },
];

export const FILING_STATUS_OPTIONS: readonly {
  value: FicaFilingStatus;
  label: string;
}[] = [
  { value: 'single', label: 'Single' },
  { value: 'married-joint', label: 'Married filing jointly' },
  { value: 'married-separate', label: 'Married filing separately' },
  { value: 'head-of-household', label: 'Head of household' },
  { value: 'qualifying-surviving-spouse', label: 'Qualifying surviving spouse' },
];

export const EMPLOYMENT_TYPE_OPTIONS: readonly {
  value: FicaEmploymentType;
  label: string;
}[] = [
  { value: 'employee-employer', label: 'Employee/Employer' },
  { value: 'self-employed', label: 'Self-employed' },
];

export function createDefaultInput(): FicaInput {
  return {
    employmentType: 'employee-employer',
    taxYear: 2026,
    filingStatus: 'single',
    income: '',
  };
}

/** Worked example: 2026 single employee, $100,000 wages. */
export function createExampleInput(): FicaInput {
  return {
    employmentType: 'employee-employer',
    taxYear: 2026,
    filingStatus: 'single',
    income: '100000',
  };
}
