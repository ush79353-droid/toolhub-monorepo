export type PaymentMode = 'fixed-term' | 'fixed-payments';

export type ScheduleView = 'annual' | 'monthly';

export interface PaymentInput {
  mode: PaymentMode;
  loanAmount: string;
  /** Fixed-term: years. */
  loanTermYears: string;
  interestRatePercent: string;
  /** Fixed-payments: specified monthly payment. */
  monthlyPayment: string;
}

export interface PaymentScheduleRow {
  period: number;
  interest: number;
  principal: number;
  payment: number;
  endingBalance: number;
}

export interface PaymentAnnualRow {
  year: number;
  interest: number;
  principal: number;
  endingBalance: number;
}

export interface PaymentChartPoint {
  year: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePayment: number;
}

export interface PaymentResult {
  monthlyPayment: number;
  numberOfPayments: number;
  totalRepayment: number;
  totalInterest: number;
  principal: number;
  termYearsDisplay: number;
  principalPercent: number;
  interestPercent: number;
  monthlySchedule: PaymentScheduleRow[];
  annualSchedule: PaymentAnnualRow[];
  chartPoints: PaymentChartPoint[];
  formattedMonthlyPayment: string;
  formattedTotalRepayment: string;
  formattedTotalInterest: string;
  summaryText: string;
}

export type PaymentFieldErrors = {
  loanAmount?: string;
  loanTermYears?: string;
  interestRatePercent?: string;
  monthlyPayment?: string;
  form?: string;
};

/** Screenshot defaults: $200,000 / 15 years / 6%. */
export function createDefaultInput(): PaymentInput {
  return {
    mode: 'fixed-term',
    loanAmount: '200000',
    loanTermYears: '15',
    interestRatePercent: '6',
    monthlyPayment: '',
  };
}
