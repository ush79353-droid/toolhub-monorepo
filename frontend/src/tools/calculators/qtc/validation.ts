import {
  calculateQtc,
  fromMs,
  heartRateFromRrSec,
  rrSecFromHeartRate,
  toMs,
} from './calculation';
import type {
  QtcFieldErrors,
  QtcInput,
  QtcResult,
  QtcTimeUnit,
} from './types';

export interface QtcValidation {
  isValid: boolean;
  errors: QtcFieldErrors;
  result: QtcResult | null;
  synced: {
    heartRateBpm?: string;
    rrValue?: string;
  };
}

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

function formatSynced(value: number, unit: QtcTimeUnit | 'bpm'): string {
  if (unit === 'bpm') {
    const rounded = Math.round(value * 100) / 100;
    if (Number.isInteger(rounded)) return String(rounded);
    return String(Number(rounded.toFixed(2)));
  }
  if (unit === 's') {
    const rounded = Math.round(value * 10000) / 10000;
    return String(Number(rounded.toFixed(4)));
  }
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(Number(rounded.toFixed(2)));
}

/**
 * Sync HR ↔ RR from last-edited field, then compute Bazett (+ other methods).
 * Blank QT or missing rate stays inactive. Zero RR / HR rejected.
 */
export function validateQtcInput(input: QtcInput): QtcValidation {
  const errors: QtcFieldErrors = {};
  const synced: QtcValidation['synced'] = {};

  const qt = parseNumber(input.qtValue);
  let rrSec: number | null = null;
  let heartRateBpm: number | null = null;

  if (input.lastEdited === 'rr') {
    const rr = parseNumber(input.rrValue);
    if (rr.blank) {
      const hr = parseNumber(input.heartRateBpm);
      if (!hr.blank) {
        return validateQtcInput({ ...input, lastEdited: 'heartRate' });
      }
      if (qt.blank) {
        return { isValid: false, errors, result: null, synced };
      }
      errors.rrValue = 'Enter a positive RR interval (or heart rate).';
      return { isValid: false, errors, result: null, synced };
    }
    if (rr.invalid || rr.value === null || rr.value <= 0) {
      errors.rrValue = 'Enter a positive RR interval.';
      return { isValid: false, errors, result: null, synced };
    }
    const rrMs = toMs(rr.value, input.rrUnit);
    if (rrMs == null || rrMs <= 0) {
      errors.rrValue = 'Enter a positive RR interval.';
      return { isValid: false, errors, result: null, synced };
    }
    rrSec = rrMs / 1000;
    heartRateBpm = heartRateFromRrSec(rrSec);
    if (heartRateBpm == null) {
      errors.rrValue = 'Unable to derive heart rate from RR.';
      return { isValid: false, errors, result: null, synced };
    }
    synced.heartRateBpm = formatSynced(heartRateBpm, 'bpm');
  } else {
    const hr = parseNumber(input.heartRateBpm);
    if (hr.blank) {
      const rr = parseNumber(input.rrValue);
      if (!rr.blank) {
        return validateQtcInput({ ...input, lastEdited: 'rr' });
      }
      if (qt.blank) {
        return { isValid: false, errors, result: null, synced };
      }
      errors.heartRateBpm = 'Enter a positive heart rate (or RR interval).';
      return { isValid: false, errors, result: null, synced };
    }
    if (hr.invalid || hr.value === null || hr.value <= 0) {
      errors.heartRateBpm = 'Enter a positive heart rate in bpm.';
      return { isValid: false, errors, result: null, synced };
    }
    heartRateBpm = hr.value;
    rrSec = rrSecFromHeartRate(heartRateBpm);
    if (rrSec == null) {
      errors.heartRateBpm = 'Unable to derive RR from heart rate.';
      return { isValid: false, errors, result: null, synced };
    }
    const rrDisplay = fromMs(rrSec * 1000, input.rrUnit);
    if (rrDisplay != null) {
      synced.rrValue = formatSynced(rrDisplay, input.rrUnit);
    }
  }

  if (qt.blank) {
    return { isValid: false, errors, result: null, synced };
  }
  if (qt.invalid || qt.value === null || qt.value <= 0) {
    errors.qtValue = 'Enter a positive QT interval.';
    return { isValid: false, errors, result: null, synced };
  }
  const qtMs = toMs(qt.value, input.qtUnit);
  if (qtMs == null || qtMs <= 0) {
    errors.qtValue = 'Enter a positive QT interval.';
    return { isValid: false, errors, result: null, synced };
  }

  if (rrSec == null || heartRateBpm == null || rrSec <= 0) {
    errors.form = 'RR interval must be greater than zero.';
    return { isValid: false, errors, result: null, synced };
  }

  const result = calculateQtc({
    qtMs,
    rrSec,
    heartRateBpm,
  });
  if (result == null) {
    errors.form = 'Unable to calculate QTc from these values.';
    return { isValid: false, errors, result: null, synced };
  }

  return { isValid: true, errors, result, synced };
}
