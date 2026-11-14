import type { SupportedCurrency } from '@/tools/shared/currency';

/** Omni-style single-rate commission bases (no tier table). */
export const COMMISSION_BASES = [
  'gross-sales',
  'sales-profit',
  'excess-above-threshold',
  'excess-above-margin-target',
  'gross-margin-and-base-pay-target',
] as const;

export type CommissionBase = (typeof COMMISSION_BASES)[number];

export const COMMISSION_BASE_LABELS: Record<CommissionBase, string> = {
  'gross-sales': 'total gross sales',
  'sales-profit': 'sales profit',
  'excess-above-threshold': 'excess above sales threshold',
  'excess-above-margin-target': 'excess above margin target',
  'gross-margin-and-base-pay-target': 'gross margin and base pay target',
};

export interface SalesCommissionInput {
  revenue: number;
  cogs: number;
  sellingExpenses: number;
  discountRatePercent: number;
  baseSalary: number;
  commissionRatePercent: number;
  commissionBase: CommissionBase;
  /** Manual quota when commission is excess above sales threshold. */
  salesQuota: number;
  basePayTargetPercent: number;
  grossMarginTargetPercent: number;
  currency: SupportedCurrency;
}

export interface SalesCommissionResult {
  defined: boolean;
  explanation: string | null;
  revenue: number;
  cogs: number;
  grossProfit: number;
  sellingExpenses: number;
  discountRatePercent: number;
  discount: number;
  baseSalary: number;
  commissionRatePercent: number;
  commissionBase: CommissionBase;
  basePayTargetPercent: number | null;
  grossMarginTargetPercent: number | null;
  salesThreshold: number | null;
  commissionBaseAmount: number;
  commission: number;
  totalLaborCost: number;
  operationalCost: number;
  operationalProfit: number;
  /** Gross profit after discount and selling expenses (before labor). */
  grossSalesMargin: number;
  operationalMarginPercent: number | null;
  grossMarginRatePercent: number | null;
  laborCostToSalesPercent: number | null;
  currency: SupportedCurrency;
}

export type SalesCommissionFieldErrors = Record<string, string>;

export function createDefaultSalesCommissionInput(): SalesCommissionInput {
  return {
    revenue: 10_000,
    cogs: 4_000,
    sellingExpenses: 200,
    discountRatePercent: 0,
    baseSalary: 750,
    commissionRatePercent: 10,
    commissionBase: 'gross-margin-and-base-pay-target',
    salesQuota: 6_000,
    basePayTargetPercent: 10,
    grossMarginTargetPercent: 50,
    currency: 'PKR',
  };
}

export function usesManualQuota(base: CommissionBase): boolean {
  return base === 'excess-above-threshold';
}

export function usesBasePayTarget(base: CommissionBase): boolean {
  return base === 'gross-margin-and-base-pay-target';
}

export function usesGrossMarginTarget(base: CommissionBase): boolean {
  return base === 'excess-above-margin-target' || base === 'gross-margin-and-base-pay-target';
}

export function showsDerivedThreshold(base: CommissionBase): boolean {
  return (
    base === 'excess-above-threshold' ||
    base === 'excess-above-margin-target' ||
    base === 'gross-margin-and-base-pay-target'
  );
}
