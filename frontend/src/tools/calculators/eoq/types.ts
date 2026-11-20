import type { SupportedCurrency } from '@/tools/shared/currency';

export type InventoryUnit =
  | 'units'
  | 'pieces'
  | 'boxes'
  | 'kilograms'
  | 'liters';

export const INVENTORY_UNITS: readonly {
  value: InventoryUnit;
  label: string;
}[] = [
  { value: 'units', label: 'units' },
  { value: 'pieces', label: 'pieces' },
  { value: 'boxes', label: 'boxes' },
  { value: 'kilograms', label: 'kilograms' },
  { value: 'liters', label: 'liters' },
] as const;

export type EoqStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroDemand'
  | 'zeroOrderingCost'
  | 'zeroHoldingCost';

export interface EoqInput {
  yearlyDemand: string;
  orderCost: string;
  annualHoldingCostPerUnit: string;
  currency: SupportedCurrency;
  inventoryUnit: InventoryUnit;
}

export interface EoqResult {
  yearlyDemand: number;
  orderCost: number;
  annualHoldingCostPerUnit: number;
  economicOrderQuantity: number;
  practicalOrderQuantity: number;
  annualOrderingCost: number;
  annualHoldingCost: number;
  totalAnnualVariableCost: number;
  ordersPerYear: number;
  averageCycleInventory: number;
  daysBetweenOrders: number;
  status: EoqStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  inventoryUnit: InventoryUnit;
  formattedYearlyDemand: string;
  formattedOrderCost: string;
  formattedAnnualHoldingCostPerUnit: string;
  formattedEconomicOrderQuantity: string;
  formattedPracticalOrderQuantity: string;
  formattedAnnualOrderingCost: string;
  formattedAnnualHoldingCost: string;
  formattedTotalAnnualVariableCost: string;
  formattedOrdersPerYear: string;
  formattedAverageCycleInventory: string;
  formattedDaysBetweenOrders: string;
}

export type EoqFieldErrors = {
  yearlyDemand?: string;
  orderCost?: string;
  annualHoldingCostPerUnit?: string;
  form?: string;
};

export function createDefaultInput(): EoqInput {
  return {
    yearlyDemand: '',
    orderCost: '',
    annualHoldingCostPerUnit: '',
    currency: 'PKR',
    inventoryUnit: 'units',
  };
}
