import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  BindingLimit,
  CostMode,
  DownPaymentMode,
  DtiProfile,
  FixedBudgetResult,
  IncomeBasedResult,
} from './types';
import { DTI_PROFILE_RATIOS } from './types';

const PRICE_TOLERANCE = 0.05;
const MAX_BINARY_ITERATIONS = 80;

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatHouseMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function calculateMonthlyGrossIncome(annualIncome: number): number {
  return annualIncome / 12;
}

export function monthlyInterestRate(annualPercent: number): number {
  return annualPercent / 1200;
}

export function mortgagePaymentFactor(
  annualInterestRatePercent: number,
  termMonths: number
): number | null {
  if (
    !Number.isFinite(annualInterestRatePercent) ||
    annualInterestRatePercent < 0 ||
    !Number.isFinite(termMonths) ||
    termMonths <= 0
  ) {
    return null;
  }
  const r = monthlyInterestRate(annualInterestRatePercent);
  if (r === 0) return 1 / termMonths;
  const growth = (1 + r) ** termMonths;
  const denom = growth - 1;
  if (!(denom > 0) || !Number.isFinite(growth)) return null;
  // M = L * r / (1 - (1+r)^-n) = L * r*(1+r)^n / ((1+r)^n - 1)
  return (r * growth) / denom;
}

export function calculateMonthlyMortgagePayment(
  loanPrincipal: number,
  annualInterestRatePercent: number,
  termMonths: number
): number | null {
  if (
    !Number.isFinite(loanPrincipal) ||
    loanPrincipal < 0 ||
    !Number.isFinite(annualInterestRatePercent) ||
    annualInterestRatePercent < 0 ||
    !Number.isFinite(termMonths) ||
    termMonths <= 0
  ) {
    return null;
  }
  if (loanPrincipal === 0) return 0;
  const k = mortgagePaymentFactor(annualInterestRatePercent, termMonths);
  if (k === null) return null;
  const m = loanPrincipal * k;
  return Number.isFinite(m) ? m : null;
}

export function calculateMaximumLoanPrincipal(
  monthlyPi: number,
  annualInterestRatePercent: number,
  termMonths: number
): number | null {
  if (
    !Number.isFinite(monthlyPi) ||
    monthlyPi < 0 ||
    !Number.isFinite(annualInterestRatePercent) ||
    annualInterestRatePercent < 0 ||
    !Number.isFinite(termMonths) ||
    termMonths <= 0
  ) {
    return null;
  }
  if (monthlyPi === 0) return 0;
  const r = monthlyInterestRate(annualInterestRatePercent);
  if (r === 0) return monthlyPi * termMonths;
  const loan = monthlyPi * ((1 - (1 + r) ** -termMonths) / r);
  return Number.isFinite(loan) ? loan : null;
}

export function resolveDtiLimits(
  profile: DtiProfile,
  customFront: number | null,
  customBack: number | null
): { front: number; back: number; note: string } | null {
  if (profile === 'custom') {
    if (
      customFront === null ||
      customBack === null ||
      !Number.isFinite(customFront) ||
      !Number.isFinite(customBack)
    ) {
      return null;
    }
    return {
      front: customFront,
      back: customBack,
      note: 'Custom DTI limits entered by the user; illustrative only.',
    };
  }
  return DTI_PROFILE_RATIOS[profile];
}

export function calculateFrontEndDTILimit(
  monthlyIncome: number,
  frontPercent: number
): number {
  return monthlyIncome * (frontPercent / 100);
}

export function calculateBackEndDTILimit(
  monthlyIncome: number,
  backPercent: number,
  monthlyDebt: number
): number {
  return monthlyIncome * (backPercent / 100) - monthlyDebt;
}

export function calculateDTIBasedHousingBudget(
  frontLimit: number,
  backLimit: number
): { budget: number; binding: BindingLimit } {
  if (frontLimit < backLimit) return { budget: frontLimit, binding: 'front' };
  if (backLimit < frontLimit) return { budget: backLimit, binding: 'back' };
  return { budget: frontLimit, binding: 'tie' };
}

export function monthlyCostFromMode(
  housePrice: number,
  value: number,
  mode: CostMode
): number {
  if (mode === 'annualPercentage') return (housePrice * value) / 1200;
  if (mode === 'annualAmount') return value / 12;
  return value; // monthlyAmount
}

export function downPaymentAndLoan(
  housePrice: number,
  mode: DownPaymentMode,
  downPaymentValue: number
): { downPayment: number; loanAmount: number } {
  if (mode === 'percentage') {
    const downPayment = housePrice * (downPaymentValue / 100);
    return {
      downPayment,
      loanAmount: Math.max(0, housePrice - downPayment),
    };
  }
  const downPayment = Math.min(downPaymentValue, housePrice);
  return {
    downPayment,
    loanAmount: Math.max(0, housePrice - downPaymentValue),
  };
}

export interface IncomeSolveParams {
  housingBudget: number;
  annualInterestRatePercent: number;
  termMonths: number;
  downPaymentMode: DownPaymentMode;
  downPaymentValue: number;
  propertyTax: number;
  propertyTaxMode: CostMode;
  hoaFee: number;
  hoaMode: CostMode;
  insurance: number;
  insuranceMode: CostMode;
  monthlyIncome: number;
  monthlyDebt: number;
  bindingLimit: BindingLimit;
  frontEndLimit: number;
  backEndLimit: number;
  dtiProfile: DtiProfile;
  profileNote: string;
  currency: SupportedCurrency;
}

export type SolveOutcome<T> =
  | { ok: true; result: T }
  | { ok: false; reason: string };

function incomeHousingAtPrice(
  price: number,
  params: IncomeSolveParams,
  paymentFactor: number
): {
  downPayment: number;
  loanAmount: number;
  monthlyPi: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  total: number;
} | null {
  if (!(price >= 0) || !Number.isFinite(price)) return null;
  const { downPayment, loanAmount } = downPaymentAndLoan(
    price,
    params.downPaymentMode,
    params.downPaymentValue
  );
  // Fixed down payment: cannot buy above cash without a loan; loan path handles P > DP
  if (
    params.downPaymentMode === 'amount' &&
    price < params.downPaymentValue - PRICE_TOLERANCE &&
    loanAmount === 0 &&
    price < params.downPaymentValue
  ) {
    // all-cash up to available funds only
  }
  const monthlyPi = loanAmount * paymentFactor;
  const monthlyTax = monthlyCostFromMode(
    price,
    params.propertyTax,
    params.propertyTaxMode
  );
  const monthlyInsurance = monthlyCostFromMode(
    price,
    params.insurance,
    params.insuranceMode
  );
  const monthlyHoa = monthlyCostFromMode(price, params.hoaFee, params.hoaMode);
  const total =
    monthlyPi + monthlyTax + monthlyInsurance + monthlyHoa;
  if (![monthlyPi, monthlyTax, monthlyInsurance, monthlyHoa, total].every(Number.isFinite)) {
    return null;
  }
  return {
    downPayment,
    loanAmount,
    monthlyPi,
    monthlyTax,
    monthlyInsurance,
    monthlyHoa,
    total,
  };
}

/**
 * Max house price so qualifying housing (PI+tax+ins+HOA) ≤ DTI budget.
 * Maintenance is excluded from lender-style DTI housing costs.
 */
export function solveIncomeBasedAffordability(
  params: IncomeSolveParams
): SolveOutcome<IncomeBasedResult> {
  const budget = params.housingBudget;
  if (!Number.isFinite(budget)) {
    return { ok: false, reason: 'Housing budget is invalid.' };
  }
  if (budget < 0) {
    return {
      ok: false,
      reason:
        'Existing monthly debts exceed the selected back-end DTI allowance, so no qualifying housing budget remains.',
    };
  }

  const factor = mortgagePaymentFactor(
    params.annualInterestRatePercent,
    params.termMonths
  );
  if (factor === null) {
    return { ok: false, reason: 'Unable to compute mortgage payment factor.' };
  }

  // Detect unbounded case: 100% down + zero recurring % costs
  const pctDown =
    params.downPaymentMode === 'percentage' && params.downPaymentValue >= 100;
  const noPctCosts =
    (params.propertyTaxMode !== 'annualPercentage' || params.propertyTax === 0) &&
    (params.insuranceMode !== 'annualPercentage' || params.insurance === 0) &&
    (params.hoaMode !== 'annualPercentage' || params.hoaFee === 0) &&
    params.propertyTaxMode !== 'annualAmount' &&
    params.propertyTaxMode !== 'monthlyAmount' &&
    params.insuranceMode !== 'annualAmount' &&
    params.insuranceMode !== 'monthlyAmount' &&
    params.hoaMode !== 'annualAmount' &&
    params.hoaMode !== 'monthlyAmount';

  if (pctDown && noPctCosts && budget >= 0) {
    return {
      ok: false,
      reason:
        'With a 100% down payment and no price-linked housing expenses, the monthly DTI budget does not define a finite maximum house price. Add a purchase-funds limit or ownership expense rates.',
    };
  }

  // Fixed down payment caps all-cash purchases at available cash
  const cashCap =
    params.downPaymentMode === 'amount' ? params.downPaymentValue : null;

  let low = 0;
  let high = Math.max(params.downPaymentValue * 2, budget * 500, 100_000);
  let best = 0;

  for (let i = 0; i < 40; i += 1) {
    const atHigh = incomeHousingAtPrice(high, params, factor);
    if (!atHigh) break;
    if (atHigh.total > budget + PRICE_TOLERANCE) break;
    best = high;
    high *= 2;
    if (high > 1e12) break;
  }

  for (let i = 0; i < MAX_BINARY_ITERATIONS; i += 1) {
    const mid = (low + high) / 2;
    const atMid = incomeHousingAtPrice(mid, params, factor);
    if (!atMid) {
      high = mid;
      continue;
    }
    // Enforce fixed-DP cash ceiling for all-cash segment
    if (cashCap !== null && mid > cashCap && atMid.loanAmount === 0) {
      high = mid;
      continue;
    }
    if (atMid.total <= budget + PRICE_TOLERANCE) {
      best = mid;
      low = mid;
    } else {
      high = mid;
    }
    if (high - low < PRICE_TOLERANCE) break;
  }

  if (cashCap !== null) {
    best = Math.min(best, Math.max(best, 0));
    // Prefer financed solution; if best > cashCap that's fine (loan > 0)
  }

  const breakdown = incomeHousingAtPrice(best, params, factor);
  if (!breakdown || best <= 0) {
    return {
      ok: false,
      reason:
        'No feasible positive house price fits the selected DTI housing budget under these assumptions.',
    };
  }
  if (breakdown.total > budget + 1) {
    return {
      ok: false,
      reason:
        'Could not find a house price whose qualifying housing payment stays within the DTI budget.',
    };
  }

  const currency = params.currency;
  const housePrice = roundMoney(best, currency);
  const loanAmount = roundMoney(breakdown.loanAmount, currency);
  const downPayment = roundMoney(breakdown.downPayment, currency);
  const monthlyPi = roundMoney(breakdown.monthlyPi, currency);
  const monthlyTax = roundMoney(breakdown.monthlyTax, currency);
  const monthlyInsurance = roundMoney(breakdown.monthlyInsurance, currency);
  const monthlyHoa = roundMoney(breakdown.monthlyHoa, currency);
  const totalHousing = roundMoney(breakdown.total, currency);
  const housingBudget = roundMoney(budget, currency);

  const frontEndDti =
    params.monthlyIncome > 0
      ? (totalHousing / params.monthlyIncome) * 100
      : 0;
  const backEndDti =
    params.monthlyIncome > 0
      ? ((totalHousing + params.monthlyDebt) / params.monthlyIncome) * 100
      : 0;

  return {
    ok: true,
    result: {
      housePrice,
      loanAmount,
      downPayment,
      monthlyPi,
      monthlyTax,
      monthlyInsurance,
      monthlyHoa,
      totalHousingPayment: totalHousing,
      frontEndDti,
      backEndDti,
      housingBudget,
      bindingLimit: params.bindingLimit,
      frontEndLimit: roundMoney(params.frontEndLimit, currency),
      backEndLimit: roundMoney(params.backEndLimit, currency),
      dtiProfile: params.dtiProfile,
      profileNote: params.profileNote,
      currency,
      formattedHousePrice: formatHouseMoney(housePrice, currency),
      formattedLoanAmount: formatHouseMoney(loanAmount, currency),
      formattedDownPayment: formatHouseMoney(downPayment, currency),
      formattedMonthlyPi: formatHouseMoney(monthlyPi, currency),
      formattedMonthlyTax: formatHouseMoney(monthlyTax, currency),
      formattedMonthlyInsurance: formatHouseMoney(monthlyInsurance, currency),
      formattedMonthlyHoa: formatHouseMoney(monthlyHoa, currency),
      formattedTotalHousing: formatHouseMoney(totalHousing, currency),
      formattedBudget: formatHouseMoney(housingBudget, currency),
    },
  };
}

export interface FixedBudgetSolveParams {
  monthlyHousingBudget: number;
  annualInterestRatePercent: number;
  termMonths: number;
  downPaymentMode: DownPaymentMode;
  downPaymentValue: number;
  includeTaxesAndFees: boolean;
  propertyTax: number;
  propertyTaxMode: CostMode;
  hoaFee: number;
  hoaMode: CostMode;
  insurance: number;
  insuranceMode: CostMode;
  maintenance: number;
  maintenanceMode: CostMode;
  currency: SupportedCurrency;
}

function fixedBudgetCostsAtPrice(
  price: number,
  params: FixedBudgetSolveParams,
  paymentFactor: number
): {
  downPayment: number;
  loanAmount: number;
  monthlyPi: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyMaintenance: number;
  constrainedTotal: number;
  fullTotal: number;
} | null {
  if (!(price >= 0) || !Number.isFinite(price)) return null;
  const { downPayment, loanAmount } = downPaymentAndLoan(
    price,
    params.downPaymentMode,
    params.downPaymentValue
  );
  const monthlyPi = loanAmount * paymentFactor;
  const monthlyTax = monthlyCostFromMode(
    price,
    params.propertyTax,
    params.propertyTaxMode
  );
  const monthlyInsurance = monthlyCostFromMode(
    price,
    params.insurance,
    params.insuranceMode
  );
  const monthlyHoa = monthlyCostFromMode(price, params.hoaFee, params.hoaMode);
  const monthlyMaintenance = monthlyCostFromMode(
    price,
    params.maintenance,
    params.maintenanceMode
  );
  const fullTotal =
    monthlyPi +
    monthlyTax +
    monthlyInsurance +
    monthlyHoa +
    monthlyMaintenance;
  const constrainedTotal = params.includeTaxesAndFees
    ? fullTotal
    : monthlyPi;
  if (
    ![
      monthlyPi,
      monthlyTax,
      monthlyInsurance,
      monthlyHoa,
      monthlyMaintenance,
      constrainedTotal,
      fullTotal,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  return {
    downPayment,
    loanAmount,
    monthlyPi,
    monthlyTax,
    monthlyInsurance,
    monthlyHoa,
    monthlyMaintenance,
    constrainedTotal,
    fullTotal,
  };
}

export function solveFixedBudgetAffordability(
  params: FixedBudgetSolveParams
): SolveOutcome<FixedBudgetResult> {
  const budget = params.monthlyHousingBudget;
  if (!Number.isFinite(budget) || budget < 0) {
    return { ok: false, reason: 'Monthly housing budget is invalid.' };
  }
  if (budget === 0) {
    return {
      ok: false,
      reason: 'A zero monthly budget cannot support a financed house purchase.',
    };
  }

  const factor = mortgagePaymentFactor(
    params.annualInterestRatePercent,
    params.termMonths
  );
  if (factor === null) {
    return { ok: false, reason: 'Unable to compute mortgage payment factor.' };
  }

  const pctDown =
    params.downPaymentMode === 'percentage' && params.downPaymentValue >= 100;
  if (pctDown && !params.includeTaxesAndFees) {
    return {
      ok: false,
      reason:
        'With 100% down payment and fees excluded from the budget constraint, principal-and-interest is zero for any price; no finite maximum house price exists without a purchase-funds limit.',
    };
  }

  let low = 0;
  let high = Math.max(params.downPaymentValue * 2, budget * 500, 100_000);
  let best = 0;

  for (let i = 0; i < 40; i += 1) {
    const atHigh = fixedBudgetCostsAtPrice(high, params, factor);
    if (!atHigh) break;
    if (atHigh.constrainedTotal > budget + PRICE_TOLERANCE) break;
    best = high;
    high *= 2;
    if (high > 1e12) break;
  }

  for (let i = 0; i < MAX_BINARY_ITERATIONS; i += 1) {
    const mid = (low + high) / 2;
    const atMid = fixedBudgetCostsAtPrice(mid, params, factor);
    if (!atMid) {
      high = mid;
      continue;
    }
    if (
      params.downPaymentMode === 'amount' &&
      mid > params.downPaymentValue &&
      atMid.loanAmount === 0
    ) {
      high = mid;
      continue;
    }
    if (atMid.constrainedTotal <= budget + PRICE_TOLERANCE) {
      best = mid;
      low = mid;
    } else {
      high = mid;
    }
    if (high - low < PRICE_TOLERANCE) break;
  }

  const breakdown = fixedBudgetCostsAtPrice(best, params, factor);
  if (!breakdown || best <= 0) {
    return {
      ok: false,
      reason:
        'No feasible positive house price fits the selected monthly budget under these assumptions.',
    };
  }
  if (breakdown.constrainedTotal > budget + 1) {
    return {
      ok: false,
      reason:
        'Could not find a house price that stays within the monthly budget.',
    };
  }

  const currency = params.currency;
  const housePrice = roundMoney(best, currency);
  const loanAmount = roundMoney(breakdown.loanAmount, currency);
  const downPayment = roundMoney(breakdown.downPayment, currency);
  const monthlyPi = roundMoney(breakdown.monthlyPi, currency);
  const monthlyTax = roundMoney(breakdown.monthlyTax, currency);
  const monthlyInsurance = roundMoney(breakdown.monthlyInsurance, currency);
  const monthlyHoa = roundMoney(breakdown.monthlyHoa, currency);
  const monthlyMaintenance = roundMoney(breakdown.monthlyMaintenance, currency);
  const totalMonthly = roundMoney(breakdown.fullTotal, currency);
  const budgetRounded = roundMoney(budget, currency);
  const constrained = roundMoney(breakdown.constrainedTotal, currency);
  const budgetDifference = roundMoney(budget - constrained, currency);

  const note = params.includeTaxesAndFees
    ? 'Taxes, HOA, insurance, and maintenance are included in the monthly budget constraint.'
    : 'Budget constrains principal and interest only. Total ownership costs shown separately may exceed the entered budget.';

  return {
    ok: true,
    result: {
      housePrice,
      loanAmount,
      downPayment,
      monthlyPi,
      monthlyTax,
      monthlyInsurance,
      monthlyHoa,
      monthlyMaintenance,
      totalMonthlyHousingCosts: totalMonthly,
      monthlyHousingBudget: budgetRounded,
      budgetDifference,
      includeTaxesAndFees: params.includeTaxesAndFees,
      currency,
      note,
      formattedHousePrice: formatHouseMoney(housePrice, currency),
      formattedLoanAmount: formatHouseMoney(loanAmount, currency),
      formattedDownPayment: formatHouseMoney(downPayment, currency),
      formattedMonthlyPi: formatHouseMoney(monthlyPi, currency),
      formattedMonthlyTax: formatHouseMoney(monthlyTax, currency),
      formattedMonthlyInsurance: formatHouseMoney(monthlyInsurance, currency),
      formattedMonthlyHoa: formatHouseMoney(monthlyHoa, currency),
      formattedMonthlyMaintenance: formatHouseMoney(
        monthlyMaintenance,
        currency
      ),
      formattedTotalHousing: formatHouseMoney(totalMonthly, currency),
      formattedBudget: formatHouseMoney(budgetRounded, currency),
      formattedBudgetDifference: formatHouseMoney(budgetDifference, currency),
    },
  };
}
