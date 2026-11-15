import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import {
  COMPOUNDING_OPTIONS,
  DEPOSIT_FREQUENCY_OPTIONS,
  type CompoundFrequency,
  type CompoundInterestResult,
  type DepositFrequency,
  type DepositTiming,
  type YearBalanceRow,
} from './types';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function periodsPerYear(compounding: CompoundFrequency): number {
  return COMPOUNDING_OPTIONS.find((o) => o.value === compounding)?.periodsPerYear ?? 12;
}

export function depositPeriodsPerYear(freq: DepositFrequency): number {
  return DEPOSIT_FREQUENCY_OPTIONS.find((o) => o.value === freq)?.periodsPerYear ?? 0;
}

function compoundFactor(rateDecimal: number, n: number, years: number): number {
  if (n <= 0 || years < 0) return Number.NaN;
  if (rateDecimal === 0) return 1;
  return (1 + rateDecimal / n) ** (n * years);
}

/**
 * Period-by-period balance with optional recurring deposits.
 * Deposits are applied as depositPeriods/compoundPeriods per compounding step
 * when frequencies differ (exact when evenly divisible).
 */
export function simulateBalance(params: {
  principal: number;
  rateDecimal: number;
  years: number;
  compoundN: number;
  depositAmount: number;
  depositN: number;
  timing: DepositTiming;
}): { finalBalance: number; totalDeposits: number; yearEnds: number[] } | null {
  const { principal, rateDecimal, years, compoundN, depositAmount, depositN, timing } =
    params;

  if (
    ![principal, rateDecimal, years, compoundN, depositAmount, depositN].every(Number.isFinite)
  ) {
    return null;
  }
  if (principal < 0 || years <= 0 || compoundN <= 0 || rateDecimal < 0) return null;
  if (depositAmount < 0 || depositN < 0) return null;

  const totalPeriods = Math.round(compoundN * years);
  if (!Number.isFinite(totalPeriods) || totalPeriods <= 0) return null;

  const ratePer = rateDecimal / compoundN;
  if (!Number.isFinite(ratePer) || 1 + ratePer <= 0) return null;

  const depositsPerCompound = depositN > 0 ? depositAmount * (depositN / compoundN) : 0;
  if (!Number.isFinite(depositsPerCompound)) return null;

  let balance = principal;
  let totalDeposits = principal;
  const yearEnds: number[] = [];
  const periodsPerYear = compoundN;

  for (let i = 1; i <= totalPeriods; i++) {
    if (timing === 'beginning' && depositsPerCompound > 0) {
      balance += depositsPerCompound;
      totalDeposits += depositsPerCompound;
    }
    balance *= 1 + ratePer;
    if (!Number.isFinite(balance)) return null;

    if (timing === 'end' && depositsPerCompound > 0) {
      balance += depositsPerCompound;
      totalDeposits += depositsPerCompound;
    }

    if (i % periodsPerYear === 0) {
      yearEnds.push(roundMoney(balance));
    }
  }

  // Partial final year (months)
  if (totalPeriods % periodsPerYear !== 0) {
    yearEnds.push(roundMoney(balance));
  }

  return {
    finalBalance: roundMoney(balance),
    totalDeposits: roundMoney(totalDeposits),
    yearEnds,
  };
}

export function calculateCompoundInterest(input: {
  initialBalance: number;
  interestRatePercent: number;
  termYears: number;
  termMonths: number;
  compounding: CompoundFrequency;
  depositFrequency: DepositFrequency;
  depositAmount: number;
  depositTiming: DepositTiming;
  currency: SupportedCurrency;
}): CompoundInterestResult | null {
  const {
    initialBalance,
    interestRatePercent,
    termYears,
    termMonths,
    compounding,
    depositFrequency,
    depositAmount,
    depositTiming,
    currency,
  } = input;

  if (
    ![initialBalance, interestRatePercent, termYears, termMonths, depositAmount].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (initialBalance < 0 || interestRatePercent < 0 || depositAmount < 0) return null;

  const years = termYears + termMonths / 12;
  if (!Number.isFinite(years) || years <= 0) return null;

  const compoundN = periodsPerYear(compounding);
  const depositN =
    depositFrequency === 'never' ? 0 : depositPeriodsPerYear(depositFrequency);
  const pmt = depositFrequency === 'never' ? 0 : depositAmount;

  const selected = simulateBalance({
    principal: initialBalance,
    rateDecimal: interestRatePercent / 100,
    years,
    compoundN,
    depositAmount: pmt,
    depositN,
    timing: depositTiming,
  });
  if (!selected) return null;

  // Yearly-compounding comparison baseline (same deposits, annual compound)
  const yearly = simulateBalance({
    principal: initialBalance,
    rateDecimal: interestRatePercent / 100,
    years,
    compoundN: 1,
    depositAmount: pmt,
    depositN: depositN > 0 ? Math.min(depositN, 1) : 0, // annual deposits for yearly baseline
    timing: depositTiming,
  });

  // If deposits are more frequent than annual, still apply annualized deposit total on yearly baseline
  const yearlyWithDeposits =
    depositN > 1
      ? simulateBalance({
          principal: initialBalance,
          rateDecimal: interestRatePercent / 100,
          years,
          compoundN: 1,
          depositAmount: pmt * depositN, // one annual lump equal to yearly deposit total
          depositN: 1,
          timing: depositTiming,
        })
      : yearly;

  if (!yearlyWithDeposits) return null;

  const wholeYears = Math.max(1, Math.ceil(years - 1e-9));
  const yearlyRows: YearBalanceRow[] = [];
  for (let y = 1; y <= wholeYears; y++) {
    const selectedBal =
      selected.yearEnds[Math.min(y, selected.yearEnds.length) - 1] ?? selected.finalBalance;
    // Rebuild year y under annual compounding for clean (1+r)^y path when no deposits
    let yearlyBal: number;
    if (pmt === 0) {
      yearlyBal = roundMoney(
        initialBalance * compoundFactor(interestRatePercent / 100, 1, y)
      );
    } else {
      yearlyBal =
        yearlyWithDeposits.yearEnds[Math.min(y, yearlyWithDeposits.yearEnds.length) - 1] ??
        yearlyWithDeposits.finalBalance;
    }
    if (!Number.isFinite(yearlyBal) || !Number.isFinite(selectedBal)) return null;
    yearlyRows.push({
      year: y,
      yearlyCompBalance: yearlyBal,
      selectedCompBalance: selectedBal,
      additionalInterest: roundMoney(Math.max(0, selectedBal - yearlyBal)),
    });
  }

  const totalPrincipalContributed = selected.totalDeposits;
  const totalCompoundInterest = roundMoney(
    selected.finalBalance - totalPrincipalContributed
  );
  if (!Number.isFinite(totalCompoundInterest)) return null;

  return {
    finalBalance: selected.finalBalance,
    totalCompoundInterest,
    totalPrincipalContributed,
    initialBalance,
    totalDeposits: roundMoney(totalPrincipalContributed - initialBalance),
    years,
    periodsPerYear: compoundN,
    yearlyRows,
    formattedFinalBalance: formatCurrencyValue(selected.finalBalance, currency),
    formattedInterest: formatCurrencyValue(totalCompoundInterest, currency),
    formattedPrincipal: formatCurrencyValue(totalPrincipalContributed, currency),
  };
}
