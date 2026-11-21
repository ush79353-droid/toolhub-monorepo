import { calculateVelocityOfMoney } from './calculation';
import type {
  VelocityOfMoneyFieldErrors,
  VelocityOfMoneyInput,
  VelocityOfMoneyResult,
} from './types';

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export interface VelocityOfMoneyValidation {
  isValid: boolean;
  errors: VelocityOfMoneyFieldErrors;
  result: VelocityOfMoneyResult | null;
}

function errNonNeg(
  p: ReturnType<typeof parseNumber>,
  blank: string,
  neg: string
): string | undefined {
  if (p.blank) return blank;
  if (p.invalid || p.value == null) return 'Enter a valid number.';
  if (p.value < 0) return neg;
  return undefined;
}

function errPositive(
  p: ReturnType<typeof parseNumber>,
  blank: string,
  bad: string
): string | undefined {
  if (p.blank) return blank;
  if (p.invalid || p.value == null) return 'Enter a valid number.';
  if (p.value <= 0) return bad;
  return undefined;
}

export function collectFieldErrors(
  input: VelocityOfMoneyInput
): VelocityOfMoneyFieldErrors {
  const errors: VelocityOfMoneyFieldErrors = {};
  const { mode, solveTarget, transactionSource } = input;

  const money = parseNumber(input.moneySupply);
  const velocity = parseNumber(input.velocity);
  const txn = parseNumber(input.nominalTransactionValue);
  const gdp = parseNumber(input.nominalGdp);
  const priceIndex = parseNumber(input.priceIndex);
  const indexBase = parseNumber(input.indexBase);
  const basePrice = parseNumber(input.basePrice);
  const volume = parseNumber(input.volume);

  if (mode === 'gdp' && (solveTarget === 'priceIndex' || solveTarget === 'volume')) {
    errors.form =
      'Price index and volume targets are only available in transaction (derived) mode.';
    return errors;
  }

  if (
    mode === 'transactions' &&
    transactionSource === 'direct' &&
    (solveTarget === 'priceIndex' || solveTarget === 'volume')
  ) {
    errors.form =
      'Switch to “derive from price index & volume” to solve for P or N.';
    return errors;
  }

  // Money stock
  if (
    solveTarget === 'velocity' ||
    solveTarget === 'nominalFlow' ||
    solveTarget === 'priceIndex' ||
    solveTarget === 'volume'
  ) {
    if (solveTarget === 'velocity') {
      const e = errPositive(
        money,
        'Enter the money stock (M).',
        'Velocity cannot be calculated when the money supply is zero or negative.'
      );
      if (e) errors.moneySupply = e;
    } else {
      const e = errPositive(
        money,
        'Enter the money stock (M).',
        'Money stock must be greater than zero.'
      );
      if (e) errors.moneySupply = e;
    }
  }

  // Velocity input
  if (
    solveTarget === 'moneySupply' ||
    solveTarget === 'nominalFlow' ||
    solveTarget === 'priceIndex' ||
    solveTarget === 'volume'
  ) {
    if (solveTarget === 'moneySupply') {
      const e = errPositive(
        velocity,
        'Enter velocity (V).',
        'Velocity must be greater than zero to solve for money stock.'
      );
      if (e) errors.velocity = e;
    } else {
      const e = errNonNeg(
        velocity,
        'Enter velocity (V).',
        'Velocity cannot be negative.'
      );
      if (e) errors.velocity = e;
    }
  }

  if (mode === 'gdp') {
    if (solveTarget === 'velocity' || solveTarget === 'moneySupply') {
      const e = errNonNeg(
        gdp,
        'Enter nominal GDP.',
        'Nominal GDP cannot be negative.'
      );
      if (e) errors.nominalGdp = e;
    }
    return errors;
  }

  // Transaction mode
  if (transactionSource === 'direct') {
    if (solveTarget === 'velocity' || solveTarget === 'moneySupply') {
      const e = errNonNeg(
        txn,
        'Enter the sum of all transactions (T).',
        'Transaction value cannot be negative.'
      );
      if (e) errors.nominalTransactionValue = e;
    }
    return errors;
  }

  // Derived path — never treat index alone as a currency price
  if (
    solveTarget === 'velocity' ||
    solveTarget === 'moneySupply' ||
    solveTarget === 'volume'
  ) {
    const e = errNonNeg(
      priceIndex,
      'Enter the price index (P).',
      'Price index cannot be negative.'
    );
    if (e) errors.priceIndex = e;
  }

  if (
    solveTarget === 'velocity' ||
    solveTarget === 'moneySupply' ||
    solveTarget === 'priceIndex' ||
    solveTarget === 'volume'
  ) {
    const ib = errPositive(
      indexBase,
      'Enter the index base (e.g. 100).',
      'Index base must be greater than zero.'
    );
    if (ib) errors.indexBase = ib;

    const bp = errPositive(
      basePrice,
      'Enter a base basket price to convert the index into money units.',
      'Base price must be greater than zero.'
    );
    if (bp) errors.basePrice = bp;
  }

  if (
    solveTarget === 'velocity' ||
    solveTarget === 'moneySupply' ||
    solveTarget === 'priceIndex'
  ) {
    if (solveTarget === 'priceIndex') {
      const e = errPositive(
        volume,
        'Enter transaction volume (N).',
        'Volume must be greater than zero.'
      );
      if (e) errors.volume = e;
    } else {
      const e = errNonNeg(
        volume,
        'Enter transaction volume (N).',
        'Volume cannot be negative.'
      );
      if (e) errors.volume = e;
    }
  }

  return errors;
}

export function hasFieldErrors(errors: VelocityOfMoneyFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateVelocityOfMoneyInput(
  input: VelocityOfMoneyInput
): VelocityOfMoneyValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateVelocityOfMoney(input);
  if (!result) {
    const money = parseNumber(input.moneySupply);
    return {
      isValid: false,
      errors: {
        form:
          input.solveTarget === 'velocity' && money.value === 0
            ? 'Velocity cannot be calculated when the money supply is zero.'
            : 'Unable to calculate with these inputs.',
      },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
