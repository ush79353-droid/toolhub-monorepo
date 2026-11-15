import type { SupportedCurrency } from '@/tools/shared/currency';

export const CALCULATION_METHODS = ['fixed-variable', 'two-points'] as const;
export type CalculationMethod = (typeof CALCULATION_METHODS)[number];

export interface CostFunctionInput {
  method: CalculationMethod;
  fixedCost: string;
  variableCostPerUnit: string;
  quantity: string;
  quantity1: string;
  totalCost1: string;
  quantity2: string;
  totalCost2: string;
  currency: SupportedCurrency;
}

export interface CostFunctionResult {
  method: CalculationMethod;
  fixedCost: number;
  variableCostPerUnit: number;
  quantity: number | null;
  totalCost: number | null;
  costFunction: string;
  currency: SupportedCurrency;
  formattedFixedCost: string;
  formattedVariableCost: string;
  formattedTotalCost: string;
  shareFixedCost: string;
  shareVariableCost: string;
  shareTotalCost: string;
}

export type CostFunctionFieldErrors = {
  method?: string;
  fixedCost?: string;
  variableCostPerUnit?: string;
  quantity?: string;
  quantity1?: string;
  totalCost1?: string;
  quantity2?: string;
  totalCost2?: string;
  currency?: string;
  form?: string;
};

export function createDefaultInput(): CostFunctionInput {
  return {
    method: 'fixed-variable',
    fixedCost: '',
    variableCostPerUnit: '',
    quantity: '',
    quantity1: '',
    totalCost1: '',
    quantity2: '',
    totalCost2: '',
    currency: 'PKR',
  };
}

export function isFixedVariableMethod(
  input: Pick<CostFunctionInput, 'method'>
): boolean {
  return input.method === 'fixed-variable';
}
