import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Net Borrowing = Ending Debt − Beginning Debt. Both balances ≥ 0. */
export function calculateNetBorrowingFromDebtBalances(
  beginningDebt: number,
  endingDebt: number
): number | null {
  if (
    !Number.isFinite(beginningDebt) ||
    beginningDebt < 0 ||
    !Number.isFinite(endingDebt) ||
    endingDebt < 0
  ) {
    return null;
  }
  const nb = endingDebt - beginningDebt;
  return Number.isFinite(nb) ? nb : null;
}

/**
 * Simplified tax on pretax earnings: apply rate only when pretax > 0.
 * Negative pretax → estimated NI = pretax (no automatic tax refund).
 */
export function applyEffectiveTax(
  pretaxEarnings: number,
  taxRate: number
): number | null {
  if (
    !Number.isFinite(pretaxEarnings) ||
    !Number.isFinite(taxRate) ||
    taxRate < 0 ||
    taxRate > 1
  ) {
    return null;
  }
  if (pretaxEarnings <= 0) return pretaxEarnings;
  const ni = pretaxEarnings * (1 - taxRate);
  return Number.isFinite(ni) ? ni : null;
}

/** FCFE = NI + D&A − CapEx − ΔNWC + NB */
export function calculateFcfeFromNetIncome(
  netIncome: number,
  depreciationAmortization: number,
  capex: number,
  workingCapitalInvestment: number,
  netBorrowing: number
): number | null {
  if (
    !Number.isFinite(netIncome) ||
    !Number.isFinite(depreciationAmortization) ||
    depreciationAmortization < 0 ||
    !Number.isFinite(capex) ||
    capex < 0 ||
    !Number.isFinite(workingCapitalInvestment) ||
    !Number.isFinite(netBorrowing)
  ) {
    return null;
  }
  const fcfe =
    netIncome +
    depreciationAmortization -
    capex -
    workingCapitalInvestment +
    netBorrowing;
  return Number.isFinite(fcfe) ? fcfe : null;
}

/**
 * FCFE = (EBIT − Interest)(1 − t) + D&A − CapEx − ΔNWC + NB
 * (tax only on positive pretax)
 */
export function calculateFcfeFromEbit(
  ebit: number,
  interestExpense: number,
  taxRate: number,
  depreciationAmortization: number,
  capex: number,
  workingCapitalInvestment: number,
  netBorrowing: number
): { fcfe: number; netIncome: number } | null {
  if (
    !Number.isFinite(ebit) ||
    !Number.isFinite(interestExpense) ||
    interestExpense < 0 ||
    !Number.isFinite(taxRate) ||
    taxRate < 0 ||
    taxRate > 1 ||
    !Number.isFinite(depreciationAmortization) ||
    depreciationAmortization < 0 ||
    !Number.isFinite(capex) ||
    capex < 0 ||
    !Number.isFinite(workingCapitalInvestment) ||
    !Number.isFinite(netBorrowing)
  ) {
    return null;
  }
  const pretax = ebit - interestExpense;
  const netIncome = applyEffectiveTax(pretax, taxRate);
  if (netIncome === null) return null;
  const fcfe = calculateFcfeFromNetIncome(
    netIncome,
    depreciationAmortization,
    capex,
    workingCapitalInvestment,
    netBorrowing
  );
  if (fcfe === null) return null;
  return { fcfe, netIncome };
}

/**
 * FCFE = (EBITDA − D&A − Interest)(1 − t) + D&A − CapEx − ΔNWC + NB
 */
export function calculateFcfeFromEbitda(
  ebitda: number,
  depreciationAmortization: number,
  interestExpense: number,
  taxRate: number,
  capex: number,
  workingCapitalInvestment: number,
  netBorrowing: number
): { fcfe: number; netIncome: number; ebit: number } | null {
  if (
    !Number.isFinite(ebitda) ||
    !Number.isFinite(depreciationAmortization) ||
    depreciationAmortization < 0
  ) {
    return null;
  }
  const ebit = ebitda - depreciationAmortization;
  const fromEbit = calculateFcfeFromEbit(
    ebit,
    interestExpense,
    taxRate,
    depreciationAmortization,
    capex,
    workingCapitalInvestment,
    netBorrowing
  );
  if (fromEbit === null) return null;
  return { ...fromEbit, ebit };
}

/**
 * FCFE = CFO − CapEx + NB
 * (assumes after-interest CFO; D&A and ΔNWC already in CFO)
 */
export function calculateFcfeFromCfo(
  operatingCashFlow: number,
  capex: number,
  netBorrowing: number
): number | null {
  if (
    !Number.isFinite(operatingCashFlow) ||
    !Number.isFinite(capex) ||
    capex < 0 ||
    !Number.isFinite(netBorrowing)
  ) {
    return null;
  }
  const fcfe = operatingCashFlow - capex + netBorrowing;
  return Number.isFinite(fcfe) ? fcfe : null;
}

/**
 * FCFE = FCFF − Interest(1 − t) + NB
 * For Interest(1−t): if interest = 0 → 0; use tax shield only when interest > 0.
 */
export function calculateFcfeFromFcff(
  fcff: number,
  interestExpense: number,
  taxRate: number,
  netBorrowing: number
): number | null {
  if (
    !Number.isFinite(fcff) ||
    !Number.isFinite(interestExpense) ||
    interestExpense < 0 ||
    !Number.isFinite(taxRate) ||
    taxRate < 0 ||
    taxRate > 1 ||
    !Number.isFinite(netBorrowing)
  ) {
    return null;
  }
  const afterTaxInterest = interestExpense * (1 - taxRate);
  const fcfe = fcff - afterTaxInterest + netBorrowing;
  return Number.isFinite(fcfe) ? fcfe : null;
}

export function interpretFcfe(fcfe: number): string {
  if (!Number.isFinite(fcfe)) {
    return 'Free cash flow to equity could not be determined from the inputs.';
  }
  if (fcfe > 0) {
    return `Positive FCFE of ${formatPlain(fcfe)} means the company generated positive free cash flow to equity under the entered assumptions. That does not guarantee dividends or share repurchases.`;
  }
  if (fcfe === 0) {
    return 'Calculated free cash flow to equity is zero for the selected period under the entered assumptions.';
  }
  return `Negative FCFE of ${formatPlain(fcfe)} means reinvestment and other cash requirements exceed residual equity cash under the selected financing assumptions. That is not automatically a failure or bankruptcy signal; growth CapEx, working-capital buildup, or debt repayments can drive negative FCFE.`;
}

function formatPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatFcfeMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Parse tax rate percent string (0–100) into decimal rate in [0, 1]. */
export function parseTaxRatePercent(raw: string): {
  rate: number | null;
  blank: boolean;
  invalid: boolean;
  error?: string;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/%/g, '');
  if (cleaned === '') return { rate: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return {
      rate: null,
      blank: false,
      invalid: true,
      error: 'Enter a valid tax rate.',
    };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return {
      rate: null,
      blank: false,
      invalid: true,
      error: 'Enter a valid tax rate.',
    };
  }
  if (value < 0 || value > 100) {
    return {
      rate: null,
      blank: false,
      invalid: true,
      error: 'Tax rate must be between 0% and 100%.',
    };
  }
  return { rate: value / 100, blank: false, invalid: false };
}
