/** Blankable fields that can be solved for. */
export type CommissionSolveTarget = 'salesPrice' | 'commissionRate' | 'commission';

export interface CommissionInput {
  salesPrice: string;
  commissionRate: string;
  commission: string;
}

export interface CommissionResult {
  solvedField: CommissionSolveTarget;
  salesPrice: number;
  commissionRate: number;
  commission: number;
  formattedSalesPrice: string;
  formattedCommissionRate: string;
  formattedCommission: string;
  /** e.g. "Given the sales price and commission rate, the commission is:" */
  summaryLead: string;
  /** Bolded answer fragment, e.g. "$6,000.00" */
  summaryValue: string;
  summaryText: string;
}

export type CommissionFieldErrors = {
  salesPrice?: string;
  commissionRate?: string;
  commission?: string;
  form?: string;
};

/**
 * Screenshot defaults: sales price $200,000, rate 3%, commission blank (solve).
 */
export function createDefaultInput(): CommissionInput {
  return {
    salesPrice: '200000',
    commissionRate: '3',
    commission: '',
  };
}
