import type { SupportedCurrency } from '@/tools/shared/currency';

export interface ReturnOnSalesInput {
  operatingProfit: string;
  operatingProfitCurrency: SupportedCurrency;
  netSales: string;
  netSalesCurrency: SupportedCurrency;
}

export interface ReturnOnSalesResult {
  /** Full-precision operating profit normalized into the net-sales currency. */
  operatingProfitNormalized: number;
  /** Full-precision net sales in the calculation currency. */
  netSalesNormalized: number;
  /** Full-precision ROS percent — never FX-converted. */
  rosPercent: number;
  calcCurrency: SupportedCurrency;
  formattedRosPercent: string;
}

export type ReturnOnSalesFieldErrors = {
  operatingProfit?: string;
  netSales?: string;
  form?: string;
};

export function createDefaultInput(): ReturnOnSalesInput {
  return {
    operatingProfit: '',
    operatingProfitCurrency: 'PKR',
    netSales: '',
    netSalesCurrency: 'PKR',
  };
}
