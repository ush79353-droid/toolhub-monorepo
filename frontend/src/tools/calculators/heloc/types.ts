import type { SupportedCurrency } from '@/tools/shared/currency';

export type HelocAdjustmentType = 'none' | 'scheduled';

export type HelocPhase = 'draw' | 'repayment';

export interface HelocInput {
  currentBalance: string;
  drawPeriodYears: string;
  repaymentTermYears: string;
  initialInterestRate: string;
  upfrontFeePercent: string;
  upfrontFeeFixed: string;
  annualFee: string;
  adjustmentType: HelocAdjustmentType;
  expectedRateAdjustment: string;
  firstAdjustmentAfterYears: string;
  adjustmentIntervalMonths: string;
  maximumInterestRate: string;
  currency: SupportedCurrency;
}

export interface HelocScheduleRow {
  month: number;
  phase: HelocPhase;
  annualInterestRate: number;
  beginningBalance: number;
  monthlyInterest: number;
  monthlyPrincipal: number;
  scheduledPayment: number;
  fees: number;
  totalCashOutflow: number;
  endingBalance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
  cumulativeFees: number;
}

export interface HelocChartPoint {
  year: number;
  outstandingBalance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface HelocResult {
  initialPrincipal: number;
  drawMonths: number;
  repaymentMonths: number;
  totalMonths: number;
  initialDrawPayment: number;
  initialRepaymentPayment: number;
  drawPeriodInterest: number;
  repaymentPeriodInterest: number;
  totalInterest: number;
  upfrontFees: number;
  recurringFees: number;
  totalFees: number;
  financingCost: number;
  principalRepaid: number;
  totalCashOutflow: number;
  schedule: HelocScheduleRow[];
  chartPoints: HelocChartPoint[];
  currency: SupportedCurrency;
  formattedInitialPrincipal: string;
  formattedInitialDrawPayment: string;
  formattedInitialRepaymentPayment: string;
  formattedDrawPeriodInterest: string;
  formattedRepaymentPeriodInterest: string;
  formattedTotalInterest: string;
  formattedUpfrontFees: string;
  formattedRecurringFees: string;
  formattedTotalFees: string;
  formattedFinancingCost: string;
  formattedTotalCashOutflow: string;
}

export type HelocFieldErrors = {
  currentBalance?: string;
  drawPeriodYears?: string;
  repaymentTermYears?: string;
  initialInterestRate?: string;
  upfrontFeePercent?: string;
  upfrontFeeFixed?: string;
  annualFee?: string;
  expectedRateAdjustment?: string;
  firstAdjustmentAfterYears?: string;
  adjustmentIntervalMonths?: string;
  maximumInterestRate?: string;
  form?: string;
};

/** Screenshot-aligned defaults (PKR denomination). Adjustment fields prefilled; type none. */
export function createDefaultInput(): HelocInput {
  return {
    currentBalance: '50000',
    drawPeriodYears: '10',
    repaymentTermYears: '20',
    initialInterestRate: '6',
    upfrontFeePercent: '1',
    upfrontFeeFixed: '500',
    annualFee: '200',
    adjustmentType: 'none',
    expectedRateAdjustment: '0.5',
    firstAdjustmentAfterYears: '5',
    adjustmentIntervalMonths: '24',
    maximumInterestRate: '8',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): HelocInput {
  return {
    currentBalance: '',
    drawPeriodYears: '',
    repaymentTermYears: '',
    initialInterestRate: '',
    upfrontFeePercent: '',
    upfrontFeeFixed: '',
    annualFee: '',
    adjustmentType: 'none',
    expectedRateAdjustment: '',
    firstAdjustmentAfterYears: '',
    adjustmentIntervalMonths: '',
    maximumInterestRate: '',
    currency,
  };
}
