import { MONTH_OPTIONS, type MortgageUkChartSlice, type MortgageUkResult } from './types';

export function formatGbp(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function monthLabel(month: number): string {
  return MONTH_OPTIONS.find((m) => Number(m.value) === month)?.label ?? String(month);
}

/** Advance month/year by whole months (1-indexed month). */
export function addMonths(year: number, month: number, months: number): {
  year: number;
  month: number;
} {
  const idx = year * 12 + (month - 1) + months;
  return { year: Math.floor(idx / 12), month: (idx % 12) + 1 };
}

/**
 * UK mortgage CAPM-style amortizing payment (monthly compounding):
 * Loan = Home × (1 − Deposit%/100)
 * r = APR/1200; n = years×12
 * Interest-only = Loan × r
 * Repayment = Loan × r / (1 − (1+r)^(-n)); r=0 → Loan/n
 * Optional annual taxes = Home × Taxes%/100; other optionals ÷ 12 for monthly.
 */
export function calculateMortgageUk(input: {
  homePrice: number;
  depositPercent: number;
  termYears: number;
  annualRatePercent: number;
  includeOptionals: boolean;
  taxesPercent: number;
  homeInsuranceAnnual: number;
  mortgageInsuranceAnnual: number;
  otherCostsAnnual: number;
  startMonth: number;
  startYear: number;
}): MortgageUkResult | null {
  const {
    homePrice,
    depositPercent,
    termYears,
    annualRatePercent,
    includeOptionals,
    taxesPercent,
    homeInsuranceAnnual,
    mortgageInsuranceAnnual,
    otherCostsAnnual,
    startMonth,
    startYear,
  } = input;

  if (
    ![
      homePrice,
      depositPercent,
      termYears,
      annualRatePercent,
      taxesPercent,
      homeInsuranceAnnual,
      mortgageInsuranceAnnual,
      otherCostsAnnual,
      startMonth,
      startYear,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(homePrice > 0)) return null;
  if (depositPercent < 0 || depositPercent >= 100) return null;
  if (!(termYears > 0) || !Number.isInteger(termYears)) return null;
  if (annualRatePercent < 0) return null;
  if (includeOptionals) {
    if (taxesPercent < 0) return null;
    if (homeInsuranceAnnual < 0 || mortgageInsuranceAnnual < 0 || otherCostsAnnual < 0) {
      return null;
    }
  }
  if (!Number.isInteger(startMonth) || startMonth < 1 || startMonth > 12) return null;
  if (!Number.isInteger(startYear) || startYear < 1 || startYear > 9999) return null;

  const depositAmount = homePrice * (depositPercent / 100);
  const loanAmount = homePrice - depositAmount;
  if (!(loanAmount > 0) || !Number.isFinite(loanAmount)) return null;

  const paymentCount = termYears * 12;
  const r = annualRatePercent / 1200;

  let monthlyRepayment: number;
  if (r === 0) {
    monthlyRepayment = loanAmount / paymentCount;
  } else {
    const factor = Math.pow(1 + r, -paymentCount);
    if (!Number.isFinite(factor)) return null;
    const denom = 1 - factor;
    if (!(denom > 0)) return null;
    monthlyRepayment = (loanAmount * r) / denom;
  }
  if (!Number.isFinite(monthlyRepayment) || monthlyRepayment < 0) return null;

  const interestOnlyMonthly = r === 0 ? 0 : loanAmount * r;
  if (!Number.isFinite(interestOnlyMonthly)) return null;

  const totalMortgagePayments = monthlyRepayment * paymentCount;
  const totalInterest = totalMortgagePayments - loanAmount;
  if (![totalMortgagePayments, totalInterest].every(Number.isFinite)) return null;

  const taxesAnnual = includeOptionals ? homePrice * (taxesPercent / 100) : 0;
  const homeInsAnnual = includeOptionals ? homeInsuranceAnnual : 0;
  const mortInsAnnual = includeOptionals ? mortgageInsuranceAnnual : 0;
  const otherAnnual = includeOptionals ? otherCostsAnnual : 0;

  const taxesMonthly = taxesAnnual / 12;
  const homeInsuranceMonthly = homeInsAnnual / 12;
  const mortgageInsuranceMonthly = mortInsAnnual / 12;
  const otherCostsMonthly = otherAnnual / 12;

  const taxesTotal = taxesMonthly * paymentCount;
  const homeInsuranceTotal = homeInsuranceMonthly * paymentCount;
  const mortgageInsuranceTotal = mortgageInsuranceMonthly * paymentCount;
  const otherCostsTotal = otherCostsMonthly * paymentCount;

  const outOfPocketMonthly =
    monthlyRepayment +
    taxesMonthly +
    homeInsuranceMonthly +
    mortgageInsuranceMonthly +
    otherCostsMonthly;
  const outOfPocketTotal =
    totalMortgagePayments +
    taxesTotal +
    homeInsuranceTotal +
    mortgageInsuranceTotal +
    otherCostsTotal;

  if (![outOfPocketMonthly, outOfPocketTotal].every(Number.isFinite)) return null;

  const chartBase = outOfPocketTotal > 0 ? outOfPocketTotal : 1;
  const rawSlices: MortgageUkChartSlice[] = [
    {
      key: 'mortgage',
      label: 'Mortgage repayment',
      amount: totalMortgagePayments,
      percent: (totalMortgagePayments / chartBase) * 100,
    },
    {
      key: 'taxes',
      label: 'Taxes',
      amount: taxesTotal,
      percent: (taxesTotal / chartBase) * 100,
    },
    {
      key: 'homeInsurance',
      label: 'Home insurance',
      amount: homeInsuranceTotal,
      percent: (homeInsuranceTotal / chartBase) * 100,
    },
    {
      key: 'mortgageInsurance',
      label: 'Mortgage insurance',
      amount: mortgageInsuranceTotal,
      percent: (mortgageInsuranceTotal / chartBase) * 100,
    },
    {
      key: 'other',
      label: 'Other costs',
      amount: otherCostsTotal,
      percent: (otherCostsTotal / chartBase) * 100,
    },
  ];
  const chartSlices = rawSlices.filter((s) => s.amount > 1e-9);

  const payoff = addMonths(startYear, startMonth, paymentCount);
  const startLabel = `${monthLabel(startMonth)} ${startYear}`;
  const payoffLabel = `${monthLabel(payoff.month)} ${payoff.year}`;

  return {
    loanAmount,
    depositAmount,
    paymentCount,
    interestOnlyMonthly,
    monthlyRepayment,
    totalMortgagePayments,
    totalInterest,
    taxesMonthly,
    taxesTotal,
    homeInsuranceMonthly,
    homeInsuranceTotal,
    mortgageInsuranceMonthly,
    mortgageInsuranceTotal,
    otherCostsMonthly,
    otherCostsTotal,
    outOfPocketMonthly,
    outOfPocketTotal,
    startLabel,
    payoffLabel,
    chartSlices,
    formattedLoanAmount: formatGbp(loanAmount),
    formattedDepositAmount: formatGbp(depositAmount),
    formattedInterestOnlyMonthly: formatGbp(interestOnlyMonthly),
    formattedMonthlyRepayment: formatGbp(monthlyRepayment),
    formattedTotalMortgagePayments: formatGbp(totalMortgagePayments),
    formattedTotalInterest: formatGbp(totalInterest),
    formattedTaxesMonthly: formatGbp(taxesMonthly),
    formattedTaxesTotal: formatGbp(taxesTotal),
    formattedHomeInsuranceMonthly: formatGbp(homeInsuranceMonthly),
    formattedHomeInsuranceTotal: formatGbp(homeInsuranceTotal),
    formattedMortgageInsuranceMonthly: formatGbp(mortgageInsuranceMonthly),
    formattedMortgageInsuranceTotal: formatGbp(mortgageInsuranceTotal),
    formattedOtherCostsMonthly: formatGbp(otherCostsMonthly),
    formattedOtherCostsTotal: formatGbp(otherCostsTotal),
    formattedOutOfPocketMonthly: formatGbp(outOfPocketMonthly),
    formattedOutOfPocketTotal: formatGbp(outOfPocketTotal),
  };
}
