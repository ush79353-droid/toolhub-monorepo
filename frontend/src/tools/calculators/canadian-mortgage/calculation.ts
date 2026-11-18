import { MONTH_OPTIONS } from './types';

export function formatUsdAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPayoffDate(month: number, year: number): string {
  const label = MONTH_OPTIONS.find((m) => m.value === month)?.label ?? String(month);
  return `${label}. ${year}`;
}

/**
 * Canadian residential mortgage convention:
 * nominal annual rate compounded semi-annually → effective monthly rate.
 * r = (1 + APR / 200)^(1/6) − 1
 */
export function canadianEffectiveMonthlyRate(annualRatePercent: number): number {
  if (!(annualRatePercent >= 0) || !Number.isFinite(annualRatePercent)) return NaN;
  if (annualRatePercent === 0) return 0;
  return Math.pow(1 + annualRatePercent / 200, 1 / 6) - 1;
}

export function amortizingMonthlyPayment(
  principal: number,
  monthlyRate: number,
  paymentCount: number
): number | null {
  if (!(principal > 0) || !(paymentCount > 0)) return null;
  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) return null;
  if (monthlyRate === 0) {
    const m = principal / paymentCount;
    return Number.isFinite(m) ? m : null;
  }
  const denom = 1 - Math.pow(1 + monthlyRate, -paymentCount);
  if (!(denom > 0)) return null;
  const m = (principal * monthlyRate) / denom;
  return Number.isFinite(m) ? m : null;
}

function sharePercent(part: number, total: number): number {
  if (!(total > 0) || !(part > 0)) return 0;
  return (part / total) * 100;
}

export interface CanadianMortgageCanonical {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  paymentCount: number;
  monthlyMortgagePayment: number;
  totalMortgagePayments: number;
  totalInterest: number;
  monthlyPropertyTax: number;
  totalPropertyTax: number;
  monthlyHomeInsurance: number;
  totalHomeInsurance: number;
  monthlyMortgageInsurance: number;
  totalMortgageInsurance: number;
  monthlyCondoHoa: number;
  totalCondoHoa: number;
  monthlyOtherCosts: number;
  totalOtherCosts: number;
  monthlyOutOfPocket: number;
  totalOutOfPocket: number;
  mortgageSharePercent: number;
  propertyTaxSharePercent: number;
  homeInsuranceSharePercent: number;
  mortgageInsuranceSharePercent: number;
  condoHoaSharePercent: number;
  otherCostsSharePercent: number;
  payoffMonth: number;
  payoffYear: number;
}

export function calculateCanadianMortgage(input: {
  homePrice: number;
  downPaymentPercent: number;
  loanTermYears: number;
  interestRatePercent: number;
  includeOptionals: boolean;
  propertyTaxPercent: number;
  homeInsuranceAnnual: number;
  mortgageInsuranceAnnual: number;
  condoHoaFeeAnnual: number;
  otherCostsAnnual: number;
  startMonth: number;
  startYear: number;
}): CanadianMortgageCanonical | null {
  const {
    homePrice,
    downPaymentPercent,
    loanTermYears,
    interestRatePercent,
    includeOptionals,
    propertyTaxPercent,
    homeInsuranceAnnual,
    mortgageInsuranceAnnual,
    condoHoaFeeAnnual,
    otherCostsAnnual,
    startMonth,
    startYear,
  } = input;

  if (
    ![
      homePrice,
      downPaymentPercent,
      loanTermYears,
      interestRatePercent,
      propertyTaxPercent,
      homeInsuranceAnnual,
      mortgageInsuranceAnnual,
      condoHoaFeeAnnual,
      otherCostsAnnual,
      startMonth,
      startYear,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(homePrice > 0)) return null;
  if (!(downPaymentPercent >= 0) || !(downPaymentPercent < 100)) return null;
  if (!(loanTermYears > 0) || !Number.isInteger(loanTermYears)) return null;
  if (interestRatePercent < 0) return null;
  if (includeOptionals) {
    if (propertyTaxPercent < 0) return null;
    if (
      homeInsuranceAnnual < 0 ||
      mortgageInsuranceAnnual < 0 ||
      condoHoaFeeAnnual < 0 ||
      otherCostsAnnual < 0
    ) {
      return null;
    }
  }
  if (!(startMonth >= 1) || !(startMonth <= 12) || !Number.isInteger(startMonth)) {
    return null;
  }
  if (!(startYear >= 1) || !Number.isInteger(startYear)) return null;

  const downPayment = homePrice * (downPaymentPercent / 100);
  const loanAmount = homePrice * (1 - downPaymentPercent / 100);
  if (!(loanAmount > 0)) return null;

  const paymentCount = loanTermYears * 12;
  if (!(paymentCount > 0)) return null;

  const monthlyRate = canadianEffectiveMonthlyRate(interestRatePercent);
  const monthlyMortgagePayment = amortizingMonthlyPayment(
    loanAmount,
    monthlyRate,
    paymentCount
  );
  if (monthlyMortgagePayment === null) return null;

  const totalMortgagePayments = monthlyMortgagePayment * paymentCount;
  const totalInterest = totalMortgagePayments - loanAmount;

  const annualPropertyTax = includeOptionals
    ? homePrice * (propertyTaxPercent / 100)
    : 0;
  const monthlyPropertyTax = annualPropertyTax / 12;
  const totalPropertyTax = annualPropertyTax * loanTermYears;

  const monthlyHomeInsurance = includeOptionals ? homeInsuranceAnnual / 12 : 0;
  const totalHomeInsurance = includeOptionals
    ? homeInsuranceAnnual * loanTermYears
    : 0;

  const monthlyMortgageInsurance = includeOptionals
    ? mortgageInsuranceAnnual / 12
    : 0;
  const totalMortgageInsurance = includeOptionals
    ? mortgageInsuranceAnnual * loanTermYears
    : 0;

  const monthlyCondoHoa = includeOptionals ? condoHoaFeeAnnual / 12 : 0;
  const totalCondoHoa = includeOptionals ? condoHoaFeeAnnual * loanTermYears : 0;

  const monthlyOtherCosts = includeOptionals ? otherCostsAnnual / 12 : 0;
  const totalOtherCosts = includeOptionals ? otherCostsAnnual * loanTermYears : 0;

  const monthlyOutOfPocket =
    monthlyMortgagePayment +
    monthlyPropertyTax +
    monthlyHomeInsurance +
    monthlyMortgageInsurance +
    monthlyCondoHoa +
    monthlyOtherCosts;

  const totalOutOfPocket =
    totalMortgagePayments +
    totalPropertyTax +
    totalHomeInsurance +
    totalMortgageInsurance +
    totalCondoHoa +
    totalOtherCosts;

  // Screenshot convention: start month/year + term years (same calendar month).
  const payoffMonth = startMonth;
  const payoffYear = startYear + loanTermYears;

  const values = [
    downPayment,
    loanAmount,
    monthlyMortgagePayment,
    totalMortgagePayments,
    totalInterest,
    monthlyPropertyTax,
    totalPropertyTax,
    monthlyHomeInsurance,
    totalHomeInsurance,
    monthlyMortgageInsurance,
    totalMortgageInsurance,
    monthlyCondoHoa,
    totalCondoHoa,
    monthlyOtherCosts,
    totalOtherCosts,
    monthlyOutOfPocket,
    totalOutOfPocket,
    payoffMonth,
    payoffYear,
  ];
  if (!values.every(Number.isFinite)) return null;

  return {
    homePrice,
    downPayment,
    loanAmount,
    paymentCount,
    monthlyMortgagePayment,
    totalMortgagePayments,
    totalInterest,
    monthlyPropertyTax,
    totalPropertyTax,
    monthlyHomeInsurance,
    totalHomeInsurance,
    monthlyMortgageInsurance,
    totalMortgageInsurance,
    monthlyCondoHoa,
    totalCondoHoa,
    monthlyOtherCosts,
    totalOtherCosts,
    monthlyOutOfPocket,
    totalOutOfPocket,
    mortgageSharePercent: sharePercent(monthlyMortgagePayment, monthlyOutOfPocket),
    propertyTaxSharePercent: sharePercent(monthlyPropertyTax, monthlyOutOfPocket),
    homeInsuranceSharePercent: sharePercent(monthlyHomeInsurance, monthlyOutOfPocket),
    mortgageInsuranceSharePercent: sharePercent(
      monthlyMortgageInsurance,
      monthlyOutOfPocket
    ),
    condoHoaSharePercent: sharePercent(monthlyCondoHoa, monthlyOutOfPocket),
    otherCostsSharePercent: sharePercent(monthlyOtherCosts, monthlyOutOfPocket),
    payoffMonth,
    payoffYear,
  };
}
