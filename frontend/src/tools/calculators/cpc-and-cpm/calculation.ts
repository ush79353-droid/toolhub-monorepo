import { getCurrencyFractionDigits, type SupportedCurrency } from '@/tools/shared/currency';
import type { CpcCpmField, CpcCpmSolveResult, CpcCpmValues } from './types';
import { CPC_CPM_FIELDS } from './types';

const EPS = 1e-9;

function finite(n: number | undefined): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

function nearlyEqual(a: number, b: number): boolean {
  const scale = Math.max(1, Math.abs(a), Math.abs(b));
  return Math.abs(a - b) <= EPS * scale;
}

function setIfMissing(out: CpcCpmValues, key: CpcCpmField, value: number): boolean {
  if (!Number.isFinite(value)) return false;
  if (finite(out[key])) return false;
  out[key] = value;
  return true;
}

/**
 * Derive missing CPC/CPM metrics from user-provided values.
 * Never overwrites keys already present in `manual`.
 */
export function solveCpcCpm(manual: CpcCpmValues): CpcCpmSolveResult {
  const errors: CpcCpmSolveResult['errors'] = {};
  const out: CpcCpmValues = { ...manual };

  for (const key of CPC_CPM_FIELDS) {
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
  while (changed && guard < 12) {
    changed = false;
    guard += 1;
    const { impressions, cpc, ctr, clicks, totalCost, cpm } = out;

    if (finite(impressions) && finite(ctr)) {
      changed = setIfMissing(out, 'clicks', (impressions * ctr) / 100) || changed;
    }
    if (finite(impressions) && impressions > 0 && finite(clicks)) {
      changed = setIfMissing(out, 'ctr', (clicks / impressions) * 100) || changed;
    }
    if (finite(clicks) && finite(cpc)) {
      changed = setIfMissing(out, 'totalCost', clicks * cpc) || changed;
    }
    if (finite(clicks) && clicks > 0 && finite(totalCost)) {
      changed = setIfMissing(out, 'cpc', totalCost / clicks) || changed;
    }
    if (finite(totalCost) && finite(cpc) && cpc > 0) {
      changed = setIfMissing(out, 'clicks', totalCost / cpc) || changed;
    }
    if (finite(impressions) && impressions > 0 && finite(totalCost)) {
      changed = setIfMissing(out, 'cpm', (totalCost / impressions) * 1000) || changed;
    }
    if (finite(impressions) && finite(cpm)) {
      changed = setIfMissing(out, 'totalCost', (cpm * impressions) / 1000) || changed;
    }
    if (finite(cpm) && finite(ctr) && ctr > 0) {
      // CPM = CPC × CTR × 10  →  CPC = CPM / (CTR × 10)
      changed = setIfMissing(out, 'cpc', cpm / (ctr * 10)) || changed;
    }
    if (finite(cpc) && finite(ctr)) {
      changed = setIfMissing(out, 'cpm', cpc * ctr * 10) || changed;
    }
  }

  // Consistency checks among known pairs (never emit NaN/Infinity)
  const { impressions, cpc, ctr, clicks, totalCost, cpm } = out;
  let inconsistent = false;

  if (finite(impressions) && finite(ctr) && finite(clicks)) {
    const expected = (impressions * ctr) / 100;
    if (!nearlyEqual(expected, clicks)) {
      errors.form = 'Clicks, impressions, and CTR do not match';
      inconsistent = true;
    }
  }
  if (finite(clicks) && finite(cpc) && finite(totalCost)) {
    const expected = clicks * cpc;
    if (!nearlyEqual(expected, totalCost)) {
      errors.form = 'Total cost, clicks, and CPC do not match';
      inconsistent = true;
    }
  }
  if (finite(impressions) && impressions > 0 && finite(totalCost) && finite(cpm)) {
    const expected = (totalCost / impressions) * 1000;
    if (!nearlyEqual(expected, cpm)) {
      errors.form = 'CPM, total cost, and impressions do not match';
      inconsistent = true;
    }
  }

  // Strip non-finite just in case
  for (const key of CPC_CPM_FIELDS) {
    const v = out[key];
    if (v !== undefined && !Number.isFinite(v)) {
      delete out[key];
    }
  }

  return { values: out, errors, inconsistent };
}

export function formatMetric(value: number, kind: 'count' | 'percent' | 'money', currency: SupportedCurrency): string {
  if (!Number.isFinite(value)) return '';
  if (kind === 'count') {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value);
  }
  if (kind === 'percent') {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(value);
  }
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
