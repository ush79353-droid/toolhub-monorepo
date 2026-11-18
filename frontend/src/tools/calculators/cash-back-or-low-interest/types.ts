/** Empty string = no state selected ("-- Select --"). */
export type UsStateCode = string;

export interface CashBackOrLowInterestInput {
  cashBackAmount: string;
  highInterestRatePercent: string;
  lowInterestRatePercent: string;
  autoPrice: string;
  loanTermMonths: string;
  downPayment: string;
  tradeInValue: string;
  /** Optional US state code; does not invent tax rates. */
  stateCode: UsStateCode;
  salesTaxPercent: string;
  titleRegistrationFees: string;
  includeAllFeesInLoan: boolean;
}

export interface OfferBreakdown {
  totalLoanAmount: number;
  salesTax: number;
  upfrontPayment: number;
  monthlyPayment: number;
  totalLoanPayments: number;
  totalLoanInterest: number;
  totalCost: number;
  formattedTotalLoanAmount: string;
  formattedSalesTax: string;
  formattedUpfrontPayment: string;
  formattedMonthlyPayment: string;
  formattedTotalLoanPayments: string;
  formattedTotalLoanInterest: string;
  formattedTotalCost: string;
}

export type BetterOffer = 'cash-back' | 'low-interest' | 'tie';

export interface CashBackOrLowInterestResult {
  loanTermMonths: number;
  cashBackAmount: number;
  cashBackOffer: OfferBreakdown;
  lowInterestOffer: OfferBreakdown;
  betterOffer: BetterOffer;
  /** Absolute difference in total economic cost. */
  totalCostSavings: number;
  /** Interest paid on cash-back offer minus low-rate offer (may be negative). */
  interestSavingsVsCashBack: number;
  formattedTotalCostSavings: string;
  formattedInterestSavingsVsCashBack: string;
  formattedCashBackAmount: string;
  verdictTitle: string;
  verdictExplanation: string;
}

export type CashBackOrLowInterestFieldErrors = {
  cashBackAmount?: string;
  highInterestRatePercent?: string;
  lowInterestRatePercent?: string;
  autoPrice?: string;
  loanTermMonths?: string;
  downPayment?: string;
  tradeInValue?: string;
  salesTaxPercent?: string;
  titleRegistrationFees?: string;
  form?: string;
};

export function createDefaultInput(): CashBackOrLowInterestInput {
  return {
    cashBackAmount: '1000',
    highInterestRatePercent: '5',
    lowInterestRatePercent: '2',
    autoPrice: '50000',
    loanTermMonths: '60',
    downPayment: '10000',
    tradeInValue: '0',
    stateCode: '',
    salesTaxPercent: '7',
    titleRegistrationFees: '2000',
    includeAllFeesInLoan: false,
  };
}
