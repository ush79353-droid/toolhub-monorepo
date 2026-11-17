import type { BetterOffer } from './types';

export function formatUsdAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * r = APR / 1200; Payment = P × r / (1 − (1+r)^(-n)); zero interest → P / n.
 */
export function calculateMonthlyPayment(input: {
  principal: number;
  annualRatePercent: number;
  paymentCount: number;
}): number | null {
  const { principal, annualRatePercent, paymentCount } = input;
  if (![principal, annualRatePercent, paymentCount].every(Number.isFinite)) {
    return null;
  }
  if (principal < 0 || paymentCount <= 0 || annualRatePercent < 0) return null;
  if (principal === 0) return 0;

  const r = annualRatePercent / 1200;
  if (r === 0) {
    const payment = principal / paymentCount;
    return Number.isFinite(payment) ? payment : null;
  }

  const denom = 1 - Math.pow(1 + r, -paymentCount);
  if (!(denom > 0)) return null;
  const payment = (principal * r) / denom;
  return Number.isFinite(payment) ? payment : null;
}

export interface ScenarioEngineInput {
  autoPrice: number;
  downPayment: number;
  tradeInValue: number;
  cashBackAmount: number;
  annualRatePercent: number;
  loanTermMonths: number;
  salesTaxPercent: number;
  titleRegistrationFees: number;
  includeAllFeesInLoan: boolean;
}

export interface ScenarioEngineResult {
  totalLoanAmount: number;
  salesTax: number;
  upfrontPayment: number;
  monthlyPayment: number;
  totalLoanPayments: number;
  totalLoanInterest: number;
  /** price + interest + tax + fees − cashBack (cashBack counted once). */
  totalCost: number;
}

/**
 * One financing scenario.
 * - Sales tax on full auto price (not reduced by cash back or trade-in).
 * - Cash back reduces financed principal only (never changes tax base).
 * - When fees are not financed: tax + title/registration stay upfront.
 * - When "Include All Fees in Loan": tax + title/registration roll into principal;
 *   upfront is down payment only.
 */
export function calculateOfferScenario(
  input: ScenarioEngineInput
): ScenarioEngineResult | null {
  const {
    autoPrice,
    downPayment,
    tradeInValue,
    cashBackAmount,
    annualRatePercent,
    loanTermMonths,
    salesTaxPercent,
    titleRegistrationFees,
    includeAllFeesInLoan,
  } = input;

  if (
    ![
      autoPrice,
      downPayment,
      tradeInValue,
      cashBackAmount,
      annualRatePercent,
      loanTermMonths,
      salesTaxPercent,
      titleRegistrationFees,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (autoPrice < 0 || downPayment < 0 || tradeInValue < 0 || cashBackAmount < 0) {
    return null;
  }
  if (annualRatePercent < 0 || salesTaxPercent < 0 || titleRegistrationFees < 0) {
    return null;
  }
  if (!(loanTermMonths > 0) || !Number.isInteger(loanTermMonths)) return null;

  const salesTax = autoPrice * (salesTaxPercent / 100);
  if (!Number.isFinite(salesTax)) return null;

  const netCredits = downPayment + tradeInValue + cashBackAmount;
  let totalLoanAmount = autoPrice - netCredits;
  if (includeAllFeesInLoan) {
    totalLoanAmount += salesTax + titleRegistrationFees;
  }
  if (totalLoanAmount < 0) totalLoanAmount = 0;

  const upfrontPayment = includeAllFeesInLoan
    ? downPayment
    : downPayment + salesTax + titleRegistrationFees;

  const monthlyPayment = calculateMonthlyPayment({
    principal: totalLoanAmount,
    annualRatePercent,
    paymentCount: loanTermMonths,
  });
  if (monthlyPayment === null) return null;

  const totalLoanPayments = monthlyPayment * loanTermMonths;
  const totalLoanInterest = totalLoanPayments - totalLoanAmount;
  // Cash back reduces economic cost once; tax and fees counted once (not again via loan).
  const totalCost =
    autoPrice + totalLoanInterest + salesTax + titleRegistrationFees - cashBackAmount;

  if (
    ![
      totalLoanAmount,
      salesTax,
      upfrontPayment,
      monthlyPayment,
      totalLoanPayments,
      totalLoanInterest,
      totalCost,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    totalLoanAmount,
    salesTax,
    upfrontPayment,
    monthlyPayment,
    totalLoanPayments,
    totalLoanInterest,
    totalCost,
  };
}

export interface ComparisonEngineInput {
  cashBackAmount: number;
  highInterestRatePercent: number;
  lowInterestRatePercent: number;
  autoPrice: number;
  loanTermMonths: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxPercent: number;
  titleRegistrationFees: number;
  includeAllFeesInLoan: boolean;
}

export interface ComparisonEngineResult {
  loanTermMonths: number;
  cashBackAmount: number;
  cashBackOffer: ScenarioEngineResult;
  lowInterestOffer: ScenarioEngineResult;
  betterOffer: BetterOffer;
  totalCostSavings: number;
  interestSavingsVsCashBack: number;
  verdictTitle: string;
  verdictExplanation: string;
}

function formatUsdPlain(amount: number): string {
  return `$${formatUsdAmount(amount)}`;
}

export function calculateCashBackOrLowInterest(
  input: ComparisonEngineInput
): ComparisonEngineResult | null {
  const cashBackOffer = calculateOfferScenario({
    autoPrice: input.autoPrice,
    downPayment: input.downPayment,
    tradeInValue: input.tradeInValue,
    cashBackAmount: input.cashBackAmount,
    annualRatePercent: input.highInterestRatePercent,
    loanTermMonths: input.loanTermMonths,
    salesTaxPercent: input.salesTaxPercent,
    titleRegistrationFees: input.titleRegistrationFees,
    includeAllFeesInLoan: input.includeAllFeesInLoan,
  });
  if (!cashBackOffer) return null;

  const lowInterestOffer = calculateOfferScenario({
    autoPrice: input.autoPrice,
    downPayment: input.downPayment,
    tradeInValue: input.tradeInValue,
    cashBackAmount: 0,
    annualRatePercent: input.lowInterestRatePercent,
    loanTermMonths: input.loanTermMonths,
    salesTaxPercent: input.salesTaxPercent,
    titleRegistrationFees: input.titleRegistrationFees,
    includeAllFeesInLoan: input.includeAllFeesInLoan,
  });
  if (!lowInterestOffer) return null;

  const costDiff = cashBackOffer.totalCost - lowInterestOffer.totalCost;
  const interestSavingsVsCashBack =
    cashBackOffer.totalLoanInterest - lowInterestOffer.totalLoanInterest;
  const totalCostSavings = Math.abs(costDiff);

  let betterOffer: BetterOffer;
  let verdictTitle: string;
  let verdictExplanation: string;

  if (Math.abs(costDiff) < 0.005) {
    betterOffer = 'tie';
    verdictTitle = 'Both Offers Cost the Same';
    verdictExplanation = `Both offers have the same total cost of ${formatUsdPlain(
      cashBackOffer.totalCost
    )}.`;
  } else if (costDiff > 0) {
    betterOffer = 'low-interest';
    verdictTitle = 'The Low Interest Rate Offer is Better!';
    if (interestSavingsVsCashBack > input.cashBackAmount) {
      verdictExplanation = `The low rate will save you ${formatUsdPlain(
        interestSavingsVsCashBack
      )} in interest, which is larger than the cash back of ${formatUsdPlain(
        input.cashBackAmount
      )}.`;
    } else {
      verdictExplanation = `The low interest rate offer costs ${formatUsdPlain(
        totalCostSavings
      )} less overall than the cash back offer.`;
    }
  } else {
    betterOffer = 'cash-back';
    verdictTitle = 'The Cash Back Offer is Better!';
    verdictExplanation = `The cash back offer costs ${formatUsdPlain(
      totalCostSavings
    )} less overall than the low interest rate offer.`;
  }

  return {
    loanTermMonths: input.loanTermMonths,
    cashBackAmount: input.cashBackAmount,
    cashBackOffer,
    lowInterestOffer,
    betterOffer,
    totalCostSavings,
    interestSavingsVsCashBack,
    verdictTitle,
    verdictExplanation,
  };
}
