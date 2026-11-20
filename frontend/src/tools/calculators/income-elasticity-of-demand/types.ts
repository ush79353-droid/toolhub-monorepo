import type { SupportedCurrency } from '@/tools/shared/currency';

export type IncomeElasticityMethod = 'standard' | 'midpoint';

export type IncomeElasticityClassification =
  | 'inferior'
  | 'zeroElasticity'
  | 'normalNecessity'
  | 'unitIncomeElasticity'
  | 'incomeElasticNormal'
  | 'unknown';

export type IncomeElasticityStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroIncomeChange'
  | 'indeterminate'
  | 'undefinedIncomePercentage'
  | 'undefinedQuantityPercentage';

export interface IncomeElasticityOfDemandInput {
  method: IncomeElasticityMethod;
  incomePeriod1: string;
  incomePeriod2: string;
  quantityPeriod1: string;
  quantityPeriod2: string;
  currency: SupportedCurrency;
}

export interface IncomeElasticityOfDemandResult {
  incomePercentageChange: number;
  quantityPercentageChange: number;
  incomeElasticityOfDemand: number | null;
  classification: IncomeElasticityClassification;
  status: IncomeElasticityStatus;
  interpretation: string;
  warningMessage: string | null;
  method: IncomeElasticityMethod;
  currency: SupportedCurrency;
  formattedIncomePercentageChange: string;
  formattedQuantityPercentageChange: string;
  formattedIncomeElasticity: string | null;
}

export type IncomeElasticityOfDemandFieldErrors = {
  incomePeriod1?: string;
  incomePeriod2?: string;
  quantityPeriod1?: string;
  quantityPeriod2?: string;
  form?: string;
};

export function createDefaultInput(): IncomeElasticityOfDemandInput {
  return {
    method: 'standard',
    incomePeriod1: '',
    incomePeriod2: '',
    quantityPeriod1: '',
    quantityPeriod2: '',
    currency: 'PKR',
  };
}
