export type RefinanceMethod = 'know-balance';

export interface RefinanceInput {
  method: RefinanceMethod;
  remainingBalance: string;
  monthlyPayment: string;
  currentRatePercent: string;
  newTermYears: string;
  newRatePercent: string;
  points: string;
  costsAndFees: string;
  cashOutAmount: string;
}

export interface RefinanceResult {
  currentRemainingMonths: number;
  currentRemainingTermLabel: string;
  currentRemainingInterest: number;
  newMonthlyPayment: number;
  newLoanAmount: number;
  pointsCost: number;
  closingCosts: number;
  monthlyPaymentDiff: number;
  currentTotalInterest: number;
  newTotalInterest: number;
  interestDiff: number;
  breakEvenMonths: number | null;
  breakEvenLabel: string;
  netSavings: number;
  formatted: {
    remainingBalance: string;
    currentPayment: string;
    currentInterest: string;
    newPayment: string;
    newLoanAmount: string;
    pointsCost: string;
    closingCosts: string;
    monthlyDiff: string;
    currentTotalInterest: string;
    newTotalInterest: string;
    interestDiff: string;
    netSavings: string;
  };
}

export type RefinanceFieldErrors = {
  remainingBalance?: string;
  monthlyPayment?: string;
  currentRatePercent?: string;
  newTermYears?: string;
  newRatePercent?: string;
  points?: string;
  costsAndFees?: string;
  cashOutAmount?: string;
  form?: string;
};

export function createDefaultInput(): RefinanceInput {
  return {
    method: 'know-balance',
    remainingBalance: '250000',
    monthlyPayment: '1800',
    currentRatePercent: '7',
    newTermYears: '20',
    newRatePercent: '6',
    points: '2',
    costsAndFees: '1500',
    cashOutAmount: '0',
  };
}
