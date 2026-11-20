import type { SupportedCurrency } from '@/tools/shared/currency';

export type AreaUnit = 'ft2' | 'm2';
export type RentalPeriod = 'monthly' | 'annually';
export type ExpenseMode = 'manual' | 'breakdown';

export interface NoiInput {
  area: string;
  areaUnit: AreaUnit;
  rentalRatePerArea: string;
  rentalPeriod: RentalPeriod;
  otherIncome: string;
  occupancyRate: string;
  expenseMode: ExpenseMode;
  manualOperatingExpenses: string;
  propertyTaxes: string;
  insurance: string;
  managementFees: string;
  maintenance: string;
  utilities: string;
  cleaningAndLandscaping: string;
  administrativeExpenses: string;
  otherOperatingExpenses: string;
  currency: SupportedCurrency;
}

export interface NoiResult {
  annualRentalIncome: number;
  otherAnnualIncome: number;
  potentialGrossIncome: number;
  vacancyRatePercent: number;
  vacancyLoss: number;
  effectiveGrossIncome: number;
  operatingExpenses: number;
  expenseMode: ExpenseMode;
  noi: number;
  operatingExpenseRatio: number | null;
  noiMargin: number | null;
  currency: SupportedCurrency;
  formattedAnnualRentalIncome: string;
  formattedOtherIncome: string;
  formattedPotentialGrossIncome: string;
  formattedVacancyLoss: string;
  formattedEffectiveGrossIncome: string;
  formattedOperatingExpenses: string;
  formattedNoi: string;
  formattedExpenseRatio: string | null;
  formattedNoiMargin: string | null;
}

export type NoiFieldErrors = {
  area?: string;
  rentalRatePerArea?: string;
  otherIncome?: string;
  occupancyRate?: string;
  manualOperatingExpenses?: string;
  propertyTaxes?: string;
  insurance?: string;
  managementFees?: string;
  maintenance?: string;
  utilities?: string;
  cleaningAndLandscaping?: string;
  administrativeExpenses?: string;
  otherOperatingExpenses?: string;
  form?: string;
};

export function createDefaultInput(): NoiInput {
  return {
    area: '',
    areaUnit: 'ft2',
    rentalRatePerArea: '',
    rentalPeriod: 'annually',
    otherIncome: '',
    occupancyRate: '100',
    expenseMode: 'manual',
    manualOperatingExpenses: '',
    propertyTaxes: '',
    insurance: '',
    managementFees: '',
    maintenance: '',
    utilities: '',
    cleaningAndLandscaping: '',
    administrativeExpenses: '',
    otherOperatingExpenses: '',
    currency: 'USD',
  };
}
