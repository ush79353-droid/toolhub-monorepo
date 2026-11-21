/**
 * Bank Reserves = Deposits × (Reserve Ratio / 100)
 * Monetary Base B = Currency + Reserves
 * Money Supply M = Currency + Deposits (simplified)
 * Money Multiplier m = M / B
 * c = Currency / Deposits; r = Reserves / Deposits
 * Simple deposit multiplier m_d = 1/r (theoretical; distinct from m)
 */

import type { SupportedCurrency } from '@/tools/shared/currency';
import { getCurrencyFractionDigits } from '@/tools/shared/currency';

export function calculateBankReserves(
  checkableDeposits: number,
  reserveRatioPercent: number
): number {
  assertNonNeg(checkableDeposits, 'Checkable deposits');
  assertRatioPercent(reserveRatioPercent);
  return checkableDeposits * (reserveRatioPercent / 100);
}

export function calculateReserveRatioPercent(
  bankReserves: number,
  checkableDeposits: number
): number | null {
  assertNonNeg(bankReserves, 'Bank reserves');
  assertNonNeg(checkableDeposits, 'Checkable deposits');
  if (checkableDeposits === 0) {
    if (bankReserves === 0) return null;
    throw new Error(
      'Cannot compute reserve ratio when deposits are zero and reserves are positive.'
    );
  }
  const pct = (bankReserves / checkableDeposits) * 100;
  if (pct > 100 + 1e-9) {
    throw new Error(
      'Bank reserves cannot exceed checkable deposits in this reserve-ratio model.'
    );
  }
  return pct;
}

export function calculateMonetaryBase(
  currencyInCirculation: number,
  bankReserves: number
): number {
  assertNonNeg(currencyInCirculation, 'Currency in circulation');
  assertNonNeg(bankReserves, 'Bank reserves');
  return currencyInCirculation + bankReserves;
}

export function calculateMoneySupply(
  currencyInCirculation: number,
  checkableDeposits: number
): number {
  assertNonNeg(currencyInCirculation, 'Currency in circulation');
  assertNonNeg(checkableDeposits, 'Checkable deposits');
  return currencyInCirculation + checkableDeposits;
}

export function calculateMoneyMultiplier(
  moneySupply: number,
  monetaryBase: number
): number | null {
  assertNonNeg(moneySupply, 'Money supply');
  assertNonNeg(monetaryBase, 'Monetary base');
  if (monetaryBase <= 0) return null;
  return moneySupply / monetaryBase;
}

export function calculateCurrencyDepositRatio(
  currency: number,
  deposits: number
): number | null {
  assertNonNeg(currency, 'Currency in circulation');
  assertNonNeg(deposits, 'Checkable deposits');
  if (deposits === 0) return null;
  return currency / deposits;
}

export function calculateReserveDepositRatio(
  reserves: number,
  deposits: number
): number | null {
  assertNonNeg(reserves, 'Bank reserves');
  assertNonNeg(deposits, 'Checkable deposits');
  if (deposits === 0) return null;
  return reserves / deposits;
}

/** Theoretical textbook deposit multiplier 1/r; r as decimal in (0,1]. */
export function calculateSimpleDepositMultiplier(
  reserveRatioPercent: number
): number | null {
  assertRatioPercent(reserveRatioPercent);
  if (reserveRatioPercent <= 0) return null;
  return 1 / (reserveRatioPercent / 100);
}

export function calculateMoneyMultiplierBundle(input: {
  checkableDeposits: number;
  reserveRatioPercent: number;
  currencyInCirculation: number;
}): {
  bankReserves: number;
  monetaryBase: number;
  moneySupply: number;
  moneyMultiplier: number | null;
  currencyDepositRatio: number | null;
  reserveDepositRatio: number;
  simpleDepositMultiplier: number | null;
} {
  const bankReserves = calculateBankReserves(
    input.checkableDeposits,
    input.reserveRatioPercent
  );
  const monetaryBase = calculateMonetaryBase(
    input.currencyInCirculation,
    bankReserves
  );
  const moneySupply = calculateMoneySupply(
    input.currencyInCirculation,
    input.checkableDeposits
  );
  const moneyMultiplier = calculateMoneyMultiplier(moneySupply, monetaryBase);
  const currencyDepositRatio = calculateCurrencyDepositRatio(
    input.currencyInCirculation,
    input.checkableDeposits
  );
  const reserveDepositRatio =
    calculateReserveDepositRatio(bankReserves, input.checkableDeposits) ??
    input.reserveRatioPercent / 100;
  const simpleDepositMultiplier = calculateSimpleDepositMultiplier(
    input.reserveRatioPercent
  );

  return {
    bankReserves,
    monetaryBase,
    moneySupply,
    moneyMultiplier,
    currencyDepositRatio,
    reserveDepositRatio,
    simpleDepositMultiplier,
  };
}

function assertNonNeg(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a finite number ≥ 0.`);
  }
}

function assertRatioPercent(value: number): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error('Reserve ratio must be between 0% and 100%.');
  }
}

export function formatMoneyAmount(
  value: number,
  currency: SupportedCurrency
): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function formatMultiplier(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: Math.max(digits, 4),
  }).format(value)}×`;
}

export function interpretMultiplier(
  m: number | null,
  moneySupply: number,
  monetaryBase: number,
  currency: SupportedCurrency
): string {
  if (m == null) {
    return 'The money multiplier is unavailable because the monetary base is zero under the simplified definitions used here.';
  }
  return `Under the simplified monetary aggregate definitions used here, the calculated money supply (${formatMoneyAmount(moneySupply, currency)}) is ${formatMultiplier(m)} the monetary base (${formatMoneyAmount(monetaryBase, currency)}). A higher multiplier means a larger measured money supply relative to the base — not automatically “better” growth or inflation.`;
}
