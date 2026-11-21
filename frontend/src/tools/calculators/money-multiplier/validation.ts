import {
  calculateBankReserves,
  calculateCurrencyDepositRatio,
  calculateMoneyMultiplier,
  calculateMonetaryBase,
  calculateMoneySupply,
  calculateReserveDepositRatio,
  calculateReserveRatioPercent,
  calculateSimpleDepositMultiplier,
  formatMoneyAmount,
  formatMultiplier,
  formatPercent,
  interpretMultiplier,
} from './calculation';
import type {
  MoneyMultiplierFieldErrors,
  MoneyMultiplierInput,
  MoneyMultiplierResult,
} from './types';

export interface MoneyMultiplierValidation {
  isValid: boolean;
  errors: MoneyMultiplierFieldErrors;
  result: MoneyMultiplierResult | null;
}

function parseNonNeg(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
  negative: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (cleaned === '') {
    return { value: null, blank: true, invalid: false, negative: false };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true, negative: false };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true, negative: false };
  }
  if (value < 0) {
    return { value: null, blank: false, invalid: false, negative: true };
  }
  return { value, blank: false, invalid: false, negative: false };
}

function moneyErr(
  p: ReturnType<typeof parseNonNeg>,
  label: string
): string | undefined {
  if (p.blank) return `Enter ${label}.`;
  if (p.invalid) return `Enter a valid ${label}.`;
  if (p.negative) return `${label} cannot be negative.`;
  return undefined;
}

export function validateMoneyMultiplierInput(
  input: MoneyMultiplierInput
): MoneyMultiplierValidation {
  const errors: MoneyMultiplierFieldErrors = {};

  const deposits = parseNonNeg(input.checkableDeposits);
  const currencyAmt = parseNonNeg(input.currencyInCirculation);
  const ratio = parseNonNeg(input.reserveRatio);
  const reservesIn = parseNonNeg(input.bankReserves);

  const dErr = moneyErr(deposits, 'checkable deposits');
  const cErr = moneyErr(currencyAmt, 'currency in circulation');
  if (dErr) errors.checkableDeposits = dErr;
  if (cErr) errors.currencyInCirculation = cErr;

  let reserveRatioPercent = 0;
  let bankReserves = 0;

  if (input.reserveSource === 'ratio') {
    if (ratio.blank) errors.reserveRatio = 'Enter a reserve ratio.';
    else if (ratio.invalid || ratio.value === null)
      errors.reserveRatio = 'Enter a valid reserve ratio.';
    else if (ratio.negative)
      errors.reserveRatio = 'Reserve ratio cannot be negative.';
    else if (ratio.value > 100)
      errors.reserveRatio = 'Reserve ratio cannot exceed 100%.';
  } else if (reservesIn.blank) {
    errors.bankReserves = 'Enter bank reserves.';
  } else if (reservesIn.invalid || reservesIn.value === null) {
    errors.bankReserves = 'Enter valid bank reserves.';
  } else if (reservesIn.negative) {
    errors.bankReserves = 'Bank reserves cannot be negative.';
  }

  if (
    errors.checkableDeposits ||
    errors.currencyInCirculation ||
    errors.reserveRatio ||
    errors.bankReserves
  ) {
    return { isValid: false, errors, result: null };
  }

  try {
    if (input.reserveSource === 'ratio') {
      reserveRatioPercent = ratio.value!;
      bankReserves = calculateBankReserves(
        deposits.value!,
        reserveRatioPercent
      );
    } else {
      bankReserves = reservesIn.value!;
      const pct = calculateReserveRatioPercent(bankReserves, deposits.value!);
      if (pct == null) {
        errors.form =
          'Reserve ratio is undefined when deposits and reserves are both zero.';
        return { isValid: false, errors, result: null };
      }
      reserveRatioPercent = pct;
    }
  } catch (e) {
    errors.form =
      e instanceof Error ? e.message : 'Unable to resolve reserves and ratio.';
    return { isValid: false, errors, result: null };
  }

  const monetaryBase = calculateMonetaryBase(currencyAmt.value!, bankReserves);
  const moneySupply = calculateMoneySupply(
    currencyAmt.value!,
    deposits.value!
  );
  const moneyMultiplier = calculateMoneyMultiplier(moneySupply, monetaryBase);
  const c = calculateCurrencyDepositRatio(
    currencyAmt.value!,
    deposits.value!
  );
  const r =
    calculateReserveDepositRatio(bankReserves, deposits.value!) ??
    reserveRatioPercent / 100;
  const simpleMd = calculateSimpleDepositMultiplier(reserveRatioPercent);

  const steps = [
    `Identify checkable deposits = ${formatMoneyAmount(deposits.value!, input.currency)}.`,
    input.reserveSource === 'ratio'
      ? `Convert reserve ratio ${formatPercent(reserveRatioPercent)} → ${(reserveRatioPercent / 100).toFixed(4)}.`
      : `Derive reserve ratio from reserves / deposits = ${formatPercent(reserveRatioPercent)}.`,
    `Calculate bank reserves = ${formatMoneyAmount(bankReserves, input.currency)}.`,
    `Calculate monetary base B = currency + reserves = ${formatMoneyAmount(monetaryBase, input.currency)}.`,
    `Calculate money supply M = currency + deposits = ${formatMoneyAmount(moneySupply, input.currency)}.`,
    moneyMultiplier == null
      ? 'Money multiplier is unavailable because monetary base is zero.'
      : `Calculate money multiplier m = M / B = ${formatMultiplier(moneyMultiplier)}.`,
    simpleMd == null
      ? 'Simple deposit multiplier 1/r is unavailable when reserve ratio is 0%.'
      : `Theoretical simple deposit multiplier 1/r = ${formatMultiplier(simpleMd)} (distinct from m = M/B).`,
  ];

  const result: MoneyMultiplierResult = {
    checkableDeposits: deposits.value!,
    reserveRatioPercent,
    bankReserves,
    currencyInCirculation: currencyAmt.value!,
    monetaryBase,
    moneySupply,
    moneyMultiplier,
    currencyDepositRatioPercent: c == null ? null : c * 100,
    reserveDepositRatioPercent: r * 100,
    simpleDepositMultiplier: simpleMd,
    formattedDeposits: formatMoneyAmount(deposits.value!, input.currency),
    formattedReserveRatio: formatPercent(reserveRatioPercent),
    formattedReserves: formatMoneyAmount(bankReserves, input.currency),
    formattedCurrency: formatMoneyAmount(currencyAmt.value!, input.currency),
    formattedBase: formatMoneyAmount(monetaryBase, input.currency),
    formattedSupply: formatMoneyAmount(moneySupply, input.currency),
    formattedMultiplier:
      moneyMultiplier == null ? 'Unavailable' : formatMultiplier(moneyMultiplier),
    formattedC: c == null ? 'Unavailable' : formatPercent(c * 100),
    formattedR: formatPercent(r * 100),
    formattedSimpleMd:
      simpleMd == null ? 'Unavailable (r = 0)' : formatMultiplier(simpleMd),
    interpretation: interpretMultiplier(
      moneyMultiplier,
      moneySupply,
      monetaryBase,
      input.currency
    ),
    explanation:
      'Simplified aggregates: M ≈ currency + checkable deposits; B = currency + bank reserves. The simple deposit multiplier 1/r is a textbook idealization and is not interchangeable with m = M/B when the public holds currency. Currency denomination labels amounts only; it does not convert values.',
    formulaBreakdown:
      moneyMultiplier == null
        ? 'm = M / B is undefined when B = 0'
        : `m = ${formatMoneyAmount(moneySupply, input.currency)} / ${formatMoneyAmount(monetaryBase, input.currency)} = ${formatMultiplier(moneyMultiplier)}`,
    steps,
  };

  return { isValid: true, errors, result };
}
