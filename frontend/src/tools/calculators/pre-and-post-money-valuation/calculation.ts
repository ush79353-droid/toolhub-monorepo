import { getCurrencyFractionDigits, type SupportedCurrency } from '@/tools/shared/currency';
import type { PpmField, PpmSolveResult, PpmValues } from './types';
import { PPM_FIELDS } from './types';

const EPS = 1e-9;

function finite(n: number | undefined): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

function nearlyEqual(a: number, b: number): boolean {
  const scale = Math.max(1, Math.abs(a), Math.abs(b));
  return Math.abs(a - b) <= EPS * scale;
}

function setIfMissing(out: PpmValues, key: PpmField, value: number): boolean {
  if (!Number.isFinite(value)) return false;
  if (finite(out[key])) return false;
  out[key] = value;
  return true;
}

/**
 * Blank-fill pre/post-money valuation. Never overwrites provided keys.
 *
 * post = pre + investment
 * equity% = investment / post × 100
 */
export function solvePrePostMoney(manual: PpmValues): PpmSolveResult {
  const errors: PpmSolveResult['errors'] = {};
  const out: PpmValues = { ...manual };

  for (const key of ['investment', 'preMoney', 'postMoney'] as const) {
    const v = out[key];
    if (finite(v) && v < 0) {
      errors[key] = 'Value cannot be negative';
    }
  }
  if (finite(out.equity) && (out.equity < 0 || out.equity > 100)) {
    errors.equity = 'Equity must be between 0% and 100%';
  }
  if (Object.keys(errors).length > 0) {
    return { values: out, errors, inconsistent: false };
  }

  let changed = true;
  let guard = 0;
  while (changed && guard < 10) {
    changed = false;
    guard += 1;
    const { investment, equity, preMoney, postMoney } = out;

    if (finite(preMoney) && finite(investment)) {
      changed = setIfMissing(out, 'postMoney', preMoney + investment) || changed;
    }
    if (finite(postMoney) && finite(investment)) {
      changed = setIfMissing(out, 'preMoney', postMoney - investment) || changed;
    }
    if (finite(postMoney) && finite(preMoney)) {
      changed = setIfMissing(out, 'investment', postMoney - preMoney) || changed;
    }

    if (finite(postMoney) && postMoney > 0 && finite(investment)) {
      changed = setIfMissing(out, 'equity', (investment / postMoney) * 100) || changed;
    }
    if (finite(postMoney) && finite(equity)) {
      changed = setIfMissing(out, 'investment', (postMoney * equity) / 100) || changed;
    }
    if (finite(investment) && finite(equity) && equity > 0) {
      changed = setIfMissing(out, 'postMoney', (investment * 100) / equity) || changed;
    }

    // pre + equity → post = pre / (1 − equity/100)
    if (finite(preMoney) && finite(equity) && equity < 100) {
      const denom = 1 - equity / 100;
      if (Math.abs(denom) > EPS) {
        changed = setIfMissing(out, 'postMoney', preMoney / denom) || changed;
      }
    }
    // investment + pre already covered; investment + equity covered
  }

  let inconsistent = false;
  const { investment, equity, preMoney, postMoney } = out;

  if (finite(preMoney) && finite(investment) && finite(postMoney)) {
    if (!nearlyEqual(preMoney + investment, postMoney)) {
      errors.form = 'Pre-money, investment, and post-money do not match';
      inconsistent = true;
    }
  }
  if (finite(postMoney) && postMoney > 0 && finite(investment) && finite(equity)) {
    if (!nearlyEqual((investment / postMoney) * 100, equity)) {
      errors.form = 'Investment, equity, and post-money do not match';
      inconsistent = true;
    }
  }
  if (finite(postMoney) && finite(investment) && postMoney < investment - EPS) {
    errors.form = 'Post-money valuation cannot be less than investment';
    inconsistent = true;
  }
  if (finite(preMoney) && finite(preMoney) && preMoney < 0) {
    errors.preMoney = 'Pre-money valuation cannot be negative';
  }

  for (const key of PPM_FIELDS) {
    const v = out[key];
    if (v !== undefined && !Number.isFinite(v)) delete out[key];
  }

  return { values: out, errors, inconsistent };
}

export function formatPpmField(
  field: PpmField,
  value: number,
  currency: SupportedCurrency
): string {
  if (!Number.isFinite(value)) return '';
  if (field === 'equity') {
    return Number(value.toFixed(4)).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });
  }
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
