import type { SupportedCurrency } from '@/tools/shared/currency';

export type AvcCalculationMode =
  | 'averageVariableCost'
  | 'variableCosts'
  | 'totalOutput';

export type AvcStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroDenominator'
  | 'nonUnique';

export interface AverageVariableCostInput {
  mode: AvcCalculationMode;
  variableCosts: string;
  totalOutput: string;
  averageVariableCost: string;
  currency: SupportedCurrency;
  outputUnit: string;
}

export interface AverageVariableCostResult {
  variableCosts: number;
  totalOutput: number;
  averageVariableCost: number;
  status: AvcStatus;
  warningMessage: string | null;
  currency: SupportedCurrency;
  outputUnit: string;
  formattedVariableCosts: string;
  formattedTotalOutput: string;
  formattedAverageVariableCost: string;
  formattedAverageVariableCostPerUnit: string;
}

export type AverageVariableCostFieldErrors = {
  variableCosts?: string;
  totalOutput?: string;
  averageVariableCost?: string;
  form?: string;
};

export function createDefaultInput(): AverageVariableCostInput {
  return {
    mode: 'averageVariableCost',
    variableCosts: '',
    totalOutput: '',
    averageVariableCost: '',
    currency: 'PKR',
    outputUnit: 'units',
  };
}
