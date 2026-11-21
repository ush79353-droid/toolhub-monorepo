import type { SupportedCurrency } from '@/tools/shared/currency';

export type QuantityUnit =
  | 'units'
  | 'items'
  | 'pieces'
  | 'kilograms'
  | 'grams'
  | 'liters'
  | 'tons';

export const QUANTITY_UNITS: readonly {
  value: QuantityUnit;
  label: string;
  short: string;
}[] = [
  { value: 'units', label: 'units', short: 'unit' },
  { value: 'items', label: 'items', short: 'item' },
  { value: 'pieces', label: 'pieces', short: 'piece' },
  { value: 'kilograms', label: 'kilograms', short: 'kg' },
  { value: 'grams', label: 'grams', short: 'g' },
  { value: 'liters', label: 'liters', short: 'L' },
  { value: 'tons', label: 'tons', short: 'ton' },
] as const;

export type MarginalCostStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroQuantityChange'
  | 'indeterminate';

export interface MarginalCostInput {
  changeInTotalCost: string;
  changeInQuantity: string;
  currency: SupportedCurrency;
  quantityUnit: QuantityUnit;
}

export interface MarginalCostResult {
  changeInTotalCost: number;
  changeInQuantity: number;
  marginalCost: number | null;
  status: MarginalCostStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  quantityUnit: QuantityUnit;
  unitShort: string;
  formattedChangeInTotalCost: string;
  formattedChangeInQuantity: string;
  formattedMarginalCost: string | null;
  formattedMarginalCostPerUnit: string | null;
}

export type MarginalCostFieldErrors = {
  changeInTotalCost?: string;
  changeInQuantity?: string;
  form?: string;
};

export function createDefaultInput(): MarginalCostInput {
  return {
    changeInTotalCost: '',
    changeInQuantity: '',
    currency: 'PKR',
    quantityUnit: 'units',
  };
}
