import { getCurrencyFractionDigits, type SupportedCurrency } from '@/tools/shared/currency';
import type { CpmField, CpmSolveResult, CpmValues } from './types';
import { CPM_FIELDS } from './types';

const EPS = 1e-9;

function finite(n: number | undefined): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

function nearlyEqual(a: number, b: number): boolean {
  const scale = Math.max(1, Math.abs(a), Math.abs(b));
  return Math.abs(a - b) <= EPS * scale;
}

function setIfMissing(out: CpmValues, key: CpmField, value: number): boolean {
  if (!Number.isFinite(value)) return false;
  if (finite(out[key])) return false;
  out[key] = value;
  return true;
}

/** CPM = (cost / impressions) × 1000 — never overwrites provided keys. */
export function solveCpm(manual: CpmValues): CpmSolveResult {
  const errors: CpmSolveResult['errors'] = {};
  const out: CpmValues = { ...manual };

  for (const key of CPM_FIELDS) {
    const v = out[key];
    if (finite(v) && v < 0) {
      errors[key] = 'Value cannot be negative';
    }
  }
  if (Object.keys(errors).length > 0) {
    return { values: out, errors, inconsistent: false };
  }

  let changed = true;
  let guard = 0;
  while (changed && guard < 6) {
    changed = false;
    guard += 1;
    const { totalCost, cpm, impressions } = out;

    if (finite(impressions) && impressions > 0 && finite(totalCost)) {
      changed = setIfMissing(out, 'cpm', (totalCost / impressions) * 1000) || changed;
    }
    if (finite(impressions) && finite(cpm)) {
      changed = setIfMissing(out, 'totalCost', (cpm * impressions) / 1000) || changed;
    }
    if (finite(totalCost) && finite(cpm) && cpm > 0) {
      changed = setIfMissing(out, 'impressions', (totalCost / cpm) * 1000) || changed;
    }
  }

  const { totalCost, cpm, impressions } = out;
  let inconsistent = false;
  if (finite(impressions) && impressions > 0 && finite(totalCost) && finite(cpm)) {
    const expected = (totalCost / impressions) * 1000;
    if (!nearlyEqual(expected, cpm)) {
      errors.form = 'CPM, total cost, and impressions do not match';
      inconsistent = true;
    }
  }

  return { values: out, errors, inconsistent };
}

export function formatCpmField(
  field: CpmField,
  value: number,
  currency: SupportedCurrency
): string {
  if (!Number.isFinite(value)) return '';
  if (field === 'impressions') {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 6,
    }).format(value);
  }
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
