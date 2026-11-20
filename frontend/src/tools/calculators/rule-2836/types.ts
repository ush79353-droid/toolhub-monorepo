import type { SupportedCurrency } from '@/tools/shared/currency';

export type HousingExpenseMode = 'combined' | 'itemized';

export type Rule2836Status =
  | 'valid'
  | 'partial'
  | 'incomplete'
  | 'invalid'
  | 'zeroIncome';

export interface Rule2836Input {
  grossMonthlyIncome: string;
  housingExpenseMode: HousingExpenseMode;
  combinedHousingCosts: string;
  mortgagePrincipalAndInterest: string;
  propertyTaxes: string;
  homeownersInsurance: string;
  hoaFees: string;
  otherHousingExpenses: string;
  otherMonthlyDebts: string;
  currency: SupportedCurrency;
}

export interface Rule2836Result {
  monthlyHousingCosts: number | null;
  frontEndRatio: number | null;
  totalMonthlyDebt: number | null;
  backEndRatio: number | null;
  maximumHousingCosts: number | null;
  maximumTotalDebt: number | null;
  housingCapacity: number | null;
  meetsFrontEndGuideline: boolean | null;
  meetsBackEndGuideline: boolean | null;
  meetsBothGuidelines: boolean | null;
  status: Rule2836Status;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedMonthlyHousingCosts: string | null;
  formattedFrontEndRatio: string | null;
  formattedTotalMonthlyDebt: string | null;
  formattedBackEndRatio: string | null;
  formattedMaximumHousingCosts: string | null;
  formattedMaximumTotalDebt: string | null;
  formattedHousingCapacity: string | null;
}

export type Rule2836FieldErrors = {
  grossMonthlyIncome?: string;
  combinedHousingCosts?: string;
  mortgagePrincipalAndInterest?: string;
  propertyTaxes?: string;
  homeownersInsurance?: string;
  hoaFees?: string;
  otherHousingExpenses?: string;
  otherMonthlyDebts?: string;
  form?: string;
};

export function createDefaultInput(): Rule2836Input {
  return {
    grossMonthlyIncome: '',
    housingExpenseMode: 'combined',
    combinedHousingCosts: '',
    mortgagePrincipalAndInterest: '',
    propertyTaxes: '',
    homeownersInsurance: '',
    hoaFees: '',
    otherHousingExpenses: '',
    otherMonthlyDebts: '',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): Rule2836Input {
  return {
    ...createDefaultInput(),
    currency,
  };
}
