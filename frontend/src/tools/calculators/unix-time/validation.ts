import { instantFromUnix, isValidDate, parseUtcDateTime } from './calculation';
import type { UnixFieldErrors, UnixUnit } from './types';

export function parseUnixInput(
  raw: string,
  unit: UnixUnit,
): { ok: true; value: number; date: Date } | { ok: false; errors: UnixFieldErrors; incomplete?: boolean } {
  const t = raw.trim();
  if (t === '' || t === '-' || t === '.' || t === '-.') {
    return { ok: false, errors: {}, incomplete: true };
  }
  if (!/^[+-]?\d+(\.\d+)?$/.test(t)) {
    return { ok: false, errors: { unix: 'Enter a valid Unix timestamp number.' } };
  }
  const value = Number(t);
  if (!Number.isFinite(value)) {
    return { ok: false, errors: { unix: 'Enter a finite Unix timestamp.' } };
  }
  // Seconds mode expects whole seconds for display consistency; allow decimals by flooring via Date.
  const date = instantFromUnix(unit === 'seconds' ? value : value, unit);
  if (!date || !isValidDate(date)) {
    return {
      ok: false,
      errors: { unix: 'This timestamp is outside the supported date range.' },
    };
  }
  return { ok: true, value, date };
}

export function parseUtcInputs(
  dateStr: string,
  timeStr: string,
): { ok: true; date: Date } | { ok: false; errors: UnixFieldErrors; incomplete?: boolean } {
  if (!dateStr.trim() || !timeStr.trim()) {
    return { ok: false, errors: {}, incomplete: true };
  }
  const date = parseUtcDateTime(dateStr, timeStr);
  if (!date) {
    return {
      ok: false,
      errors: {
        utcDate: 'Enter a valid UTC date (YYYY-MM-DD) and time (HH:MM:SS).',
      },
    };
  }
  return { ok: true, date };
}
