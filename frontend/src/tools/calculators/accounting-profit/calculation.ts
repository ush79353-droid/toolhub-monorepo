import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface AccountingProfitCalculationInput {
  totalRevenue: number;
  operationExpenses: number;
  interest: number;
  depreciation: number;
  taxes: number;
}

export interface AccountingProfitCalculationResult {
  totalExplicitCosts: number;
  accountingProfit: number;
}

/**
 * Accounting profit from explicit costs only:
 *   Total Explicit Costs = OpEx + Interest + Depreciation + Taxes
 *   Accounting Profit    = Total Revenue − Total Explicit Costs
 *
 * All expense fields are nonnegative cost amounts.
 * Negative profit (loss) is allowed.
 * Rejects non-finite or negative inputs.
 * Full precision — round only for display.
 */
export function calculateAccountingProfit(
  input: AccountingProfitCalculationInput
): AccountingProfitCalculationResult | null {
  const {
    totalRevenue,
    operationExpenses,
    interest,
    depreciation,
    taxes,
  } = input;

  if (
    ![
      totalRevenue,
      operationExpenses,
      interest,
      depreciation,
      taxes,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (totalRevenue < 0) return null;
  if (operationExpenses < 0 || interest < 0 || depreciation < 0 || taxes < 0) {
    return null;
  }

  const totalExplicitCosts =
    operationExpenses + interest + depreciation + taxes;
  const accountingProfit = totalRevenue - totalExplicitCosts;

  if (![totalExplicitCosts, accountingProfit].every(Number.isFinite)) {
    return null;
  }

  return { totalExplicitCosts, accountingProfit };
}

/** Display rounding only — never used inside the formulas. */
export function formatAccountingProfitMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
