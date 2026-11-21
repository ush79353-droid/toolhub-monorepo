import type { UkLocation, UkTaxYearId } from './tax-parameters';
import { DEFAULT_UK_TAX_YEAR } from './tax-parameters';

export type { UkLocation, UkTaxYearId };

export interface TakeHomePayUkInput {
  location: UkLocation;
  taxYear: UkTaxYearId;
  employmentIncome: string;
  selfEmploymentIncome: string;
  rentalIncome: string;
}

export interface TakeHomePayUkResult {
  location: UkLocation;
  taxYear: UkTaxYearId;
  taxYearLabel: string;
  employmentIncome: number;
  selfEmploymentIncome: number;
  rentalIncome: number;
  totalIncome: number;
  personalAllowance: number;
  taxableIncome: number;
  incomeTax: number;
  class1Ni: number;
  class4Ni: number;
  totalNi: number;
  totalDeductions: number;
  takeHomePay: number;
  formattedTotalIncome: string;
  formattedIncomeTax: string;
  formattedTotalNi: string;
  formattedTakeHome: string;
  summaryMessage: string;
  assumptionNotes: string[];
}

export type TakeHomePayUkFieldErrors = Partial<
  Record<keyof TakeHomePayUkInput, string>
> & { form?: string };

export function createDefaultInput(): TakeHomePayUkInput {
  return {
    location: 'england',
    taxYear: DEFAULT_UK_TAX_YEAR,
    employmentIncome: '40000',
    selfEmploymentIncome: '0',
    rentalIncome: '0',
  };
}

export function createEmptyInput(): TakeHomePayUkInput {
  return {
    location: 'england',
    taxYear: DEFAULT_UK_TAX_YEAR,
    employmentIncome: '',
    selfEmploymentIncome: '',
    rentalIncome: '',
  };
}
