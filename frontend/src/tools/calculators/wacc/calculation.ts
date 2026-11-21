import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface WaccMathResult {
  totalCapital: number;
  equityWeight: number;
  debtWeight: number;
  afterTaxCostOfDebt: number;
  equityContribution: number;
  debtContribution: number;
  wacc: number;
}

/**
 * WACC = (E/(E+D))×Re + (D/(E+D))×Rd×(1−T)
 * Rates are decimals (0.15 for 15%). Equity and debt ≥ 0; total capital > 0.
 * Tax in [0, 1].
 */
export function calculateWacc(
  costOfEquity: number,
  equity: number,
  costOfDebt: number,
  debt: number,
  taxRate: number
): WaccMathResult | null {
  if (
    ![costOfEquity, equity, costOfDebt, debt, taxRate].every(Number.isFinite)
  ) {
    return null;
  }
  if (equity < 0 || debt < 0) return null;
  if (taxRate < 0 || taxRate > 1) return null;

  const totalCapital = equity + debt;
  if (!Number.isFinite(totalCapital) || totalCapital <= 0) return null;

  const equityWeight = equity / totalCapital;
  const debtWeight = debt / totalCapital;
  const afterTaxCostOfDebt = costOfDebt * (1 - taxRate);
  const equityContribution = equityWeight * costOfEquity;
  const debtContribution = debtWeight * afterTaxCostOfDebt;
  const wacc = equityContribution + debtContribution;

  if (
    ![
      equityWeight,
      debtWeight,
      afterTaxCostOfDebt,
      equityContribution,
      debtContribution,
      wacc,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    totalCapital,
    equityWeight,
    debtWeight,
    afterTaxCostOfDebt,
    equityContribution,
    debtContribution,
    wacc,
  };
}

export function formatWaccMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatWaccPercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function interpretWacc(waccPercent: number): string {
  if (!Number.isFinite(waccPercent)) {
    return 'WACC is unavailable.';
  }
  if (waccPercent < 0) {
    return 'A negative WACC is unusual and typically reflects atypical financing-rate inputs. Review assumptions carefully — it is not a typical hurdle-rate outcome.';
  }
  if (Math.abs(waccPercent) < 1e-12) {
    return 'WACC is 0.00% under the selected financing rates and capital structure — verify that zero costs of capital are intentional.';
  }
  return 'Under the selected assumptions, WACC is the blended required return of debt and equity capital providers. Use it as a hurdle or discount rate only when project risk and financing assumptions are sufficiently comparable.';
}

export function explainWacc(
  waccPercent: number,
  currency: SupportedCurrency
): string {
  const symbol = getCurrencySymbol(currency);
  return `The company's estimated weighted average cost of capital is ${formatWaccPercent(waccPercent)}. Under the selected assumptions, this represents the blended required return on ${symbol}-denominated debt and equity capital.`;
}
