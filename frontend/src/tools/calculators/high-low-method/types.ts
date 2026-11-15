import type { SupportedCurrency } from '@/tools/shared/currency';

export interface HighLowMethodInput {
  highCost: number;
  highVolume: number;
  lowCost: number;
  lowVolume: number;
  unitsX: number;
  currency: SupportedCurrency;
}

export interface HighLowMethodResult {
  highCost: number;
  highVolume: number;
  lowCost: number;
  lowVolume: number;
  unitsX: number;
  variableCostPerUnit: number;
  totalFixedCost: number;
  totalCost: number;
  currency: SupportedCurrency;
  variableDisplay: string;
  fixedDisplay: string;
  totalDisplay: string;
  shareVariable: string;
  shareFixed: string;
  shareTotal: string;
}

export type HighLowMethodFieldErrors = Record<string, string>;

export function createDefaultInput(): HighLowMethodInput {
  return {
    highCost: Number.NaN,
    highVolume: Number.NaN,
    lowCost: Number.NaN,
    lowVolume: Number.NaN,
    unitsX: Number.NaN,
    currency: 'PKR',
  };
}
