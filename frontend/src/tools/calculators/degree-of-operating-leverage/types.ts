import type { SupportedCurrency } from '@/tools/shared/currency';

export type DolMethod = 'periodChange' | 'contributionMargin';

export type DolCalculationMode = 'dol' | 'salesChange' | 'ebitChange';

export type DolStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroDenominator'
  | 'nonUnique';

export interface DegreeOfOperatingLeverageInput {
  method: DolMethod;
  mode: DolCalculationMode;
  salesChangePercentage: string;
  ebitChangePercentage: string;
  degreeOfOperatingLeverage: string;
  salesRevenue: string;
  variableCosts: string;
  fixedOperatingCosts: string;
  currency: SupportedCurrency;
}

export interface DegreeOfOperatingLeverageResult {
  salesChangePercentage: number | null;
  ebitChangePercentage: number | null;
  contributionMargin: number | null;
  operatingIncome: number | null;
  degreeOfOperatingLeverage: number;
  status: DolStatus;
  interpretation: string;
  warningMessage: string | null;
  method: DolMethod;
  currency: SupportedCurrency;
  formattedSalesChangePercentage: string | null;
  formattedEbitChangePercentage: string | null;
  formattedContributionMargin: string | null;
  formattedOperatingIncome: string | null;
  formattedDegreeOfOperatingLeverage: string;
}

export type DegreeOfOperatingLeverageFieldErrors = {
  salesChangePercentage?: string;
  ebitChangePercentage?: string;
  degreeOfOperatingLeverage?: string;
  salesRevenue?: string;
  variableCosts?: string;
  fixedOperatingCosts?: string;
  form?: string;
};

export function createDefaultInput(): DegreeOfOperatingLeverageInput {
  return {
    method: 'periodChange',
    mode: 'dol',
    salesChangePercentage: '',
    ebitChangePercentage: '',
    degreeOfOperatingLeverage: '',
    salesRevenue: '',
    variableCosts: '',
    fixedOperatingCosts: '',
    currency: 'PKR',
  };
}
