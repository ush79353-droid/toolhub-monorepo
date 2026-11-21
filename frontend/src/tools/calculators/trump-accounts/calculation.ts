import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  getScenarioReturnPercent,
  type InvestmentScenario,
  type TrumpAccountsResult,
} from './types';

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function parseOptionalNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

/** N = ending age − starting age. */
export function calculateInvestmentYears(
  startingAge: number,
  targetAge: number,
): number | null {
  if (![startingAge, targetAge].every(Number.isFinite)) return null;
  if (startingAge < 0 || targetAge <= startingAge) return null;
  return targetAge - startingAge;
}

/** FV_initial = P(1+r)^N */
export function futureValueOfStartingBalance(
  principal: number,
  annualRateDecimal: number,
  years: number,
): number | null {
  if (![principal, annualRateDecimal, years].every(Number.isFinite)) return null;
  if (principal < 0 || annualRateDecimal < 0 || years < 0) return null;
  if (years === 0) return principal;
  if (Math.abs(annualRateDecimal) < 1e-15) return principal;
  const fv = principal * Math.pow(1 + annualRateDecimal, years);
  return Number.isFinite(fv) ? fv : null;
}

/**
 * End-of-year ordinary annuity:
 * FV_contributions = C × ((1+r)^N − 1) / r
 * When r = 0: C × N
 */
export function futureValueOfContributions(
  annualContribution: number,
  annualRateDecimal: number,
  years: number,
): number | null {
  if (
    ![annualContribution, annualRateDecimal, years].every(Number.isFinite)
  ) {
    return null;
  }
  if (annualContribution < 0 || annualRateDecimal < 0 || years < 0) return null;
  if (years === 0) return 0;
  if (Math.abs(annualRateDecimal) < 1e-15) {
    return annualContribution * years;
  }
  const growth = Math.pow(1 + annualRateDecimal, years);
  if (!Number.isFinite(growth)) return null;
  const fv = annualContribution * ((growth - 1) / annualRateDecimal);
  return Number.isFinite(fv) ? fv : null;
}

export function inflationAdjustedBalance(
  nominalFutureValue: number,
  inflationRateDecimal: number,
  years: number,
): number | null {
  if (![nominalFutureValue, inflationRateDecimal, years].every(Number.isFinite)) {
    return null;
  }
  if (years < 0) return null;
  const factor = 1 + inflationRateDecimal;
  if (!(factor > 0)) return null;
  if (years === 0) return nominalFutureValue;
  const real = nominalFutureValue / Math.pow(factor, years);
  return Number.isFinite(real) ? real : null;
}

export interface TrumpAccountsCalcInput {
  startingAge: number;
  targetAge: number;
  startingBalance: number;
  annualContribution: number;
  investmentScenario: InvestmentScenario;
  includeInflation: boolean;
  inflationRatePercent: number;
  currency: SupportedCurrency;
}

export function calculateTrumpAccounts(
  input: TrumpAccountsCalcInput,
): TrumpAccountsResult | null {
  const {
    startingAge,
    targetAge,
    startingBalance,
    annualContribution,
    investmentScenario,
    includeInflation,
    inflationRatePercent,
    currency,
  } = input;

  const years = calculateInvestmentYears(startingAge, targetAge);
  if (years === null) return null;

  const annualReturnPercent = getScenarioReturnPercent(investmentScenario);
  const r = annualReturnPercent / 100;

  const fvInitial = futureValueOfStartingBalance(startingBalance, r, years);
  const fvContributions = futureValueOfContributions(
    annualContribution,
    r,
    years,
  );
  if (fvInitial === null || fvContributions === null) return null;

  const finalBalanceRaw = fvInitial + fvContributions;
  if (!Number.isFinite(finalBalanceRaw)) return null;

  const totalContributionsRaw =
    startingBalance + annualContribution * years;
  const investmentGrowthRaw = finalBalanceRaw - totalContributionsRaw;

  let inflationAdjusted: number | null = null;
  if (includeInflation) {
    inflationAdjusted = inflationAdjustedBalance(
      finalBalanceRaw,
      inflationRatePercent / 100,
      years,
    );
    if (inflationAdjusted === null) return null;
  }

  const finalBalance = roundMoney(finalBalanceRaw, currency);
  const totalContributions = roundMoney(totalContributionsRaw, currency);
  const investmentGrowth = roundMoney(investmentGrowthRaw, currency);
  const futureValueOfStartingBalanceRounded = roundMoney(fvInitial, currency);
  const futureValueOfContributionsRounded = roundMoney(fvContributions, currency);
  const inflationAdjustedRounded =
    inflationAdjusted === null
      ? null
      : roundMoney(inflationAdjusted, currency);

  const pieTotal = Math.max(0, totalContributions) + Math.max(0, investmentGrowth);
  const contributionsSharePercent =
    pieTotal > 0 ? (Math.max(0, totalContributions) / pieTotal) * 100 : 0;
  const growthSharePercent =
    pieTotal > 0 ? (Math.max(0, investmentGrowth) / pieTotal) * 100 : 0;

  const explanation = `From the initial balance and your annual contributions, your account could grow significantly over ${years} year${years === 1 ? '': 's'} at a ${annualReturnPercent}% annual return. The final value depends on the selected investment return and contribution assumptions. Results are illustrative estimates, not guarantees.`;

  return {
    startingAge,
    targetAge,
    investmentYears: years,
    startingBalance: roundMoney(startingBalance, currency),
    annualContribution: roundMoney(annualContribution, currency),
    investmentScenario,
    annualReturnPercent,
    includeInflation,
    inflationRatePercent,
    futureValueOfStartingBalance: futureValueOfStartingBalanceRounded,
    futureValueOfContributions: futureValueOfContributionsRounded,
    totalContributions,
    investmentGrowth,
    finalBalance,
    inflationAdjustedBalance: inflationAdjustedRounded,
    contributionsSharePercent,
    growthSharePercent,
    explanation,
    currency,
  };
}

export function shareTrumpAccountsText(result: TrumpAccountsResult): string {
  const lines = [
    'Trump Accounts Calculator',
    `Child's starting age: ${result.startingAge}`,
    `Project until age: ${result.targetAge} (${result.investmentYears} years)`,
    `Starting balance: ${formatMoney(result.startingBalance, result.currency)}`,
    `Annual contribution: ${formatMoney(result.annualContribution, result.currency)}`,
    `Scenario: ${result.investmentScenario} (${result.annualReturnPercent}% annual return)`,
    `Total contributions: ${formatMoney(result.totalContributions, result.currency)}`,
    `Final projected balance: ${formatMoney(result.finalBalance, result.currency)}`,
    `Investment growth: ${formatMoney(result.investmentGrowth, result.currency)}`,
  ];
  if (
    result.includeInflation &&
    result.inflationAdjustedBalance !== null
  ) {
    lines.push(
      `Inflation-adjusted balance (${result.inflationRatePercent}%): ${formatMoney(result.inflationAdjustedBalance, result.currency)}`,
    );
  }
  return lines.join('\n');
}
