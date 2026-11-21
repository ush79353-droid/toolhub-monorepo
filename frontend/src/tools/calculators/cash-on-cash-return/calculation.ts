import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Vacancy Loss = Gross Annual Rental × (Vacancy Rate / 100) */
export function calculateVacancyLoss(
  grossAnnualRental: number,
  vacancyRatePercent: number
): number | null {
  if (
    !Number.isFinite(grossAnnualRental) ||
    !Number.isFinite(vacancyRatePercent) ||
    grossAnnualRental < 0 ||
    vacancyRatePercent < 0 ||
    vacancyRatePercent > 100
  ) {
    return null;
  }
  const loss = grossAnnualRental * (vacancyRatePercent / 100);
  return Number.isFinite(loss) ? loss : null;
}

/** Effective Annual Rental = Gross − Vacancy Loss */
export function calculateEffectiveRentalIncome(
  grossAnnualRental: number,
  vacancyLoss: number
): number | null {
  if (!Number.isFinite(grossAnnualRental) || !Number.isFinite(vacancyLoss)) {
    return null;
  }
  const effective = grossAnnualRental - vacancyLoss;
  return Number.isFinite(effective) ? effective : null;
}

/**
 * NOI = Effective Rental − Annual Operating Expenses.
 * Negative NOI is returned as-is.
 */
export function calculateNetOperatingIncome(
  effectiveRentalIncome: number,
  annualOperatingExpenses: number
): number | null {
  if (
    !Number.isFinite(effectiveRentalIncome) ||
    !Number.isFinite(annualOperatingExpenses) ||
    annualOperatingExpenses < 0
  ) {
    return null;
  }
  const noi = effectiveRentalIncome - annualOperatingExpenses;
  return Number.isFinite(noi) ? noi : null;
}

/** Annual Debt Service = Monthly Loan Payment × 12 */
export function calculateAnnualDebtService(
  monthlyLoanPayment: number
): number | null {
  if (!Number.isFinite(monthlyLoanPayment) || monthlyLoanPayment < 0) {
    return null;
  }
  const annual = monthlyLoanPayment * 12;
  return Number.isFinite(annual) ? annual : null;
}

/**
 * Annual Cash Flow = NOI − Annual Debt Service.
 * Negative cash flow is returned as-is (not clamped).
 */
export function calculateAnnualCashFlow(
  noi: number,
  annualDebtService: number
): number | null {
  if (!Number.isFinite(noi) || !Number.isFinite(annualDebtService)) {
    return null;
  }
  const cashFlow = noi - annualDebtService;
  return Number.isFinite(cashFlow) ? cashFlow : null;
}

/**
 * Cash-on-Cash Return (%) = (Annual Cash Flow / Total Cash Investment) × 100.
 * Investment must be > 0. Zero investment → unavailable (not Infinity).
 */
export function calculateCashOnCashReturn(
  annualCashFlow: number,
  totalCashInvestment: number
): number | null {
  if (
    !Number.isFinite(annualCashFlow) ||
    !Number.isFinite(totalCashInvestment)
  ) {
    return null;
  }
  if (totalCashInvestment <= 0) return null;
  const rate = (annualCashFlow / totalCashInvestment) * 100;
  return Number.isFinite(rate) ? rate : null;
}

export function formatCashOnCashMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatCashOnCashPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
