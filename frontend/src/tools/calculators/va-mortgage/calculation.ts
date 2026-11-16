import {
  VA_PURCHASE_FUNDING_FEE_RATES,
  type DownPaymentUnit,
  type FundingFeePayment,
  type VaEligibility,
  type YesNo,
} from './types';

export function formatVaMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatVaPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
}

/**
 * Published VA purchase funding-fee percent of base loan (va.gov).
 * Exempt: service-connected disability compensation (10+% modeled here) or
 * surviving-spouse eligibility (DIC / VA loan-eligible surviving spouse).
 * Active/Veteran and Reservist/National Guard share the same rate table.
 */
export function resolveVaFundingFeeRatePercent(input: {
  eligibility: VaEligibility;
  usedVaLoanBefore: YesNo;
  serviceRelatedDisability: YesNo;
  downPaymentPercent: number;
}): { ratePercent: number; exempt: boolean } {
  const { eligibility, usedVaLoanBefore, serviceRelatedDisability, downPaymentPercent } =
    input;

  if (serviceRelatedDisability === 'yes' || eligibility === 'surviving_spouses') {
    return { ratePercent: 0, exempt: true };
  }

  const table =
    usedVaLoanBefore === 'yes'
      ? VA_PURCHASE_FUNDING_FEE_RATES.subsequentUse
      : VA_PURCHASE_FUNDING_FEE_RATES.firstUse;

  if (downPaymentPercent >= 10) return { ratePercent: table.from10, exempt: false };
  if (downPaymentPercent >= 5) return { ratePercent: table.from5, exempt: false };
  return { ratePercent: table.under5, exempt: false };
}

export function resolveDownPayment(input: {
  homePrice: number;
  downPayment: number;
  downPaymentUnit: DownPaymentUnit;
}): { downPaymentAmount: number; downPaymentPercent: number } | null {
  const { homePrice, downPayment, downPaymentUnit } = input;
  if (!(homePrice > 0) || !(downPayment >= 0)) return null;

  if (downPaymentUnit === 'percent') {
    if (downPayment >= 100) return null;
    const downPaymentAmount = homePrice * (downPayment / 100);
    return { downPaymentAmount, downPaymentPercent: downPayment };
  }

  if (downPayment >= homePrice) return null;
  return {
    downPaymentAmount: downPayment,
    downPaymentPercent: (downPayment / homePrice) * 100,
  };
}

export function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  paymentCount: number
): number | null {
  if (!(principal > 0) || !(paymentCount > 0) || annualRatePercent < 0) return null;
  if (!Number.isFinite(principal) || !Number.isFinite(annualRatePercent)) return null;

  const r = annualRatePercent / 1200;
  if (r === 0) {
    const m = principal / paymentCount;
    return Number.isFinite(m) ? m : null;
  }
  const denom = 1 - Math.pow(1 + r, -paymentCount);
  if (!(denom > 0)) return null;
  const m = (principal * r) / denom;
  return Number.isFinite(m) ? m : null;
}

export interface VaMortgageCanonicalInput {
  homePrice: number;
  downPayment: number;
  downPaymentUnit: DownPaymentUnit;
  loanTermYears: number;
  interestRatePercent: number;
  eligibility: VaEligibility;
  usedVaLoanBefore: YesNo;
  serviceRelatedDisability: YesNo;
  fundingFeePayment: FundingFeePayment;
}

export interface VaMortgageCanonicalResult {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  baseLoanAmount: number;
  fundingFeeRatePercent: number;
  fundingFee: number;
  fundingFeeExempt: boolean;
  loanAmount: number;
  monthlyPayment: number;
  paymentCount: number;
  totalOfPayments: number;
  totalInterest: number;
  principalSharePercent: number;
  interestSharePercent: number;
  fundingFeeFinanced: boolean;
}

export function calculateVaMortgage(
  input: VaMortgageCanonicalInput
): VaMortgageCanonicalResult | null {
  const {
    homePrice,
    downPayment,
    downPaymentUnit,
    loanTermYears,
    interestRatePercent,
    eligibility,
    usedVaLoanBefore,
    serviceRelatedDisability,
    fundingFeePayment,
  } = input;

  if (
    ![homePrice, downPayment, loanTermYears, interestRatePercent].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(homePrice > 0) || !(loanTermYears > 0) || interestRatePercent < 0) return null;

  const down = resolveDownPayment({ homePrice, downPayment, downPaymentUnit });
  if (!down) return null;

  const baseLoanAmount = homePrice - down.downPaymentAmount;
  if (!(baseLoanAmount > 0)) return null;

  const feeMeta = resolveVaFundingFeeRatePercent({
    eligibility,
    usedVaLoanBefore,
    serviceRelatedDisability,
    downPaymentPercent: down.downPaymentPercent,
  });

  const fundingFee = baseLoanAmount * (feeMeta.ratePercent / 100);
  const fundingFeeFinanced = fundingFeePayment === 'financed' && fundingFee > 0;
  const loanAmount = fundingFeeFinanced ? baseLoanAmount + fundingFee : baseLoanAmount;

  const paymentCount = Math.round(loanTermYears * 12);
  if (!(paymentCount > 0)) return null;

  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    interestRatePercent,
    paymentCount
  );
  if (monthlyPayment === null) return null;

  const totalOfPayments = monthlyPayment * paymentCount;
  const totalInterest = totalOfPayments - loanAmount;
  const chartTotal = totalOfPayments > 0 ? totalOfPayments : 1;

  return {
    homePrice,
    downPayment: down.downPaymentAmount,
    downPaymentPercent: down.downPaymentPercent,
    baseLoanAmount,
    fundingFeeRatePercent: feeMeta.ratePercent,
    fundingFee,
    fundingFeeExempt: feeMeta.exempt,
    loanAmount,
    monthlyPayment,
    paymentCount,
    totalOfPayments,
    totalInterest,
    principalSharePercent: (loanAmount / chartTotal) * 100,
    interestSharePercent: (totalInterest / chartTotal) * 100,
    fundingFeeFinanced,
  };
}
