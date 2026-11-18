import { MONTH_OPTIONS } from './types';

export function formatUsdAmount(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculateMonthlyMortgage(input: {
  principal: number;
  annualRatePercent: number;
  paymentCount: number;
}): number | null {
  const { principal, annualRatePercent, paymentCount } = input;
  if (![principal, annualRatePercent, paymentCount].every(Number.isFinite)) {
    return null;
  }
  if (principal <= 0 || paymentCount <= 0 || annualRatePercent < 0) return null;

  const r = annualRatePercent / 1200;
  let payment: number;
  if (r === 0) {
    payment = principal / paymentCount;
  } else {
    const factor = Math.pow(1 + r, -paymentCount);
    if (!Number.isFinite(factor)) return null;
    const denom = 1 - factor;
    if (!(denom > 0)) return null;
    payment = (principal * r) / denom;
  }
  return Number.isFinite(payment) ? payment : null;
}

export function payoffLabel(startMonth: number, startYear: number, termYears: number): string | null {
  if (!(startMonth >= 1 && startMonth <= 12) || !Number.isInteger(startMonth)) return null;
  if (!Number.isInteger(startYear) || !Number.isInteger(termYears) || termYears <= 0) {
    return null;
  }
  const endYear = startYear + termYears;
  const month = MONTH_OPTIONS.find((m) => m.value === startMonth);
  if (!month) return null;
  return `${month.label}. ${endYear}`;
}

export interface MortgageAmortizationCanonicalInput {
  homePrice: number;
  downPaymentPercent: number;
  termYears: number;
  annualRatePercent: number;
  includeOptionals: boolean;
  propertyTaxPercent: number;
  homeInsuranceAnnual: number;
  pmiInsuranceAnnual: number;
  hoaFeeAnnual: number;
  otherCostsAnnual: number;
  startMonth: number;
  startYear: number;
}

export interface MortgageAmortizationCanonicalResult {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  monthlyMortgage: number;
  totalMortgagePayments: number;
  totalInterest: number;
  paymentCount: number;
  monthlyPropertyTax: number;
  totalPropertyTax: number;
  monthlyHomeInsurance: number;
  totalHomeInsurance: number;
  monthlyPmi: number;
  totalPmi: number;
  monthlyHoa: number;
  totalHoa: number;
  monthlyOtherCosts: number;
  totalOtherCosts: number;
  monthlyOutOfPocket: number;
  totalOutOfPocket: number;
  payoffLabel: string;
  mortgageSharePercent: number;
  taxSharePercent: number;
  insuranceSharePercent: number;
  pmiSharePercent: number;
  hoaSharePercent: number;
  otherSharePercent: number;
}

/**
 * Screenshot mortgage amortization with optional annual housing costs.
 * Optionals convert annual → monthly (/12) and lifetime = monthly × n.
 * Taxes = homePrice × (tax%/100) / 12 when optionals enabled.
 */
export function calculateMortgageAmortization(
  input: MortgageAmortizationCanonicalInput
): MortgageAmortizationCanonicalResult | null {
  const {
    homePrice,
    downPaymentPercent,
    termYears,
    annualRatePercent,
    includeOptionals,
    propertyTaxPercent,
    homeInsuranceAnnual,
    pmiInsuranceAnnual,
    hoaFeeAnnual,
    otherCostsAnnual,
    startMonth,
    startYear,
  } = input;

  if (
    ![
      homePrice,
      downPaymentPercent,
      termYears,
      annualRatePercent,
      propertyTaxPercent,
      homeInsuranceAnnual,
      pmiInsuranceAnnual,
      hoaFeeAnnual,
      otherCostsAnnual,
      startMonth,
      startYear,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(homePrice > 0)) return null;
  if (downPaymentPercent < 0 || downPaymentPercent > 100) return null;
  if (!(termYears > 0) || !Number.isInteger(termYears)) return null;
  if (annualRatePercent < 0) return null;
  if (
    propertyTaxPercent < 0 ||
    homeInsuranceAnnual < 0 ||
    pmiInsuranceAnnual < 0 ||
    hoaFeeAnnual < 0 ||
    otherCostsAnnual < 0
  ) {
    return null;
  }

  const downPayment = homePrice * (downPaymentPercent / 100);
  const loanAmount = homePrice - downPayment;
  if (!(loanAmount > 0)) return null;

  const paymentCount = termYears * 12;
  const monthlyMortgage = calculateMonthlyMortgage({
    principal: loanAmount,
    annualRatePercent,
    paymentCount,
  });
  if (monthlyMortgage === null) return null;

  const totalMortgagePayments = monthlyMortgage * paymentCount;
  const totalInterest = totalMortgagePayments - loanAmount;

  const monthlyPropertyTax = includeOptionals
    ? (homePrice * (propertyTaxPercent / 100)) / 12
    : 0;
  const monthlyHomeInsurance = includeOptionals ? homeInsuranceAnnual / 12 : 0;
  const monthlyPmi = includeOptionals ? pmiInsuranceAnnual / 12 : 0;
  const monthlyHoa = includeOptionals ? hoaFeeAnnual / 12 : 0;
  const monthlyOtherCosts = includeOptionals ? otherCostsAnnual / 12 : 0;

  const totalPropertyTax = monthlyPropertyTax * paymentCount;
  const totalHomeInsurance = monthlyHomeInsurance * paymentCount;
  const totalPmi = monthlyPmi * paymentCount;
  const totalHoa = monthlyHoa * paymentCount;
  const totalOtherCosts = monthlyOtherCosts * paymentCount;

  const monthlyOutOfPocket =
    monthlyMortgage +
    monthlyPropertyTax +
    monthlyHomeInsurance +
    monthlyPmi +
    monthlyHoa +
    monthlyOtherCosts;
  const totalOutOfPocket =
    totalMortgagePayments +
    totalPropertyTax +
    totalHomeInsurance +
    totalPmi +
    totalHoa +
    totalOtherCosts;

  const payoff = payoffLabel(startMonth, startYear, termYears);
  if (!payoff) return null;

  const chartTotal = monthlyOutOfPocket > 0 ? monthlyOutOfPocket : 1;
  const mortgageSharePercent = (monthlyMortgage / chartTotal) * 100;
  const taxSharePercent = (monthlyPropertyTax / chartTotal) * 100;
  const insuranceSharePercent = (monthlyHomeInsurance / chartTotal) * 100;
  const pmiSharePercent = (monthlyPmi / chartTotal) * 100;
  const hoaSharePercent = (monthlyHoa / chartTotal) * 100;
  const otherSharePercent = (monthlyOtherCosts / chartTotal) * 100;

  if (
    ![
      totalMortgagePayments,
      totalInterest,
      monthlyOutOfPocket,
      totalOutOfPocket,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    homePrice,
    downPayment,
    loanAmount,
    monthlyMortgage,
    totalMortgagePayments,
    totalInterest,
    paymentCount,
    monthlyPropertyTax,
    totalPropertyTax,
    monthlyHomeInsurance,
    totalHomeInsurance,
    monthlyPmi,
    totalPmi,
    monthlyHoa,
    totalHoa,
    monthlyOtherCosts,
    totalOtherCosts,
    monthlyOutOfPocket,
    totalOutOfPocket,
    payoffLabel: payoff,
    mortgageSharePercent,
    taxSharePercent,
    insuranceSharePercent,
    pmiSharePercent,
    hoaSharePercent,
    otherSharePercent,
  };
}
