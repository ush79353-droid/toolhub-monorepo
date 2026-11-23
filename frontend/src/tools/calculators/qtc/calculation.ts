/**
 * QTc Calculator — educational QT interval correction worksheet.
 *
 * Bazett (primary): QTc_ms = QT_ms / √(RR_s), RR_s = 60/HR or RR_ms/1000.
 * Also Fridericia, Framingham (Sagie), and Hodges for the collapsed panel.
 *
 * Sources: Bazett HC. Heart. 1920; Fridericia LS. Acta Med Scand. 1920;
 * Sagie A et al. Am J Cardiol. 1992 (Framingham); Hodges M et al. J
 * Electrocardiol. 1983. Educational only — not a diagnosis.
 */

import type { QtcMethodResult, QtcResult, QtcTimeUnit } from './types';

export const SOURCE_LABEL =
  'Bazett QTc = QT/√RR (RR in seconds). Also Fridericia QT/∛RR; Framingham QT+0.154×(1−RR); Hodges QT+1.75×(HR−60). Bazett 1920; Fridericia 1920; Sagie 1992; Hodges 1983.';

export const DISCLAIMER =
  'Educational QT correction only. Rate extremes distort Bazett; an isolated QTc is not a diagnosis or treatment recommendation.';

export function toMs(value: number, unit: QtcTimeUnit): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  if (unit === 'ms') return value;
  if (unit === 's') return value * 1000;
  return null;
}

export function fromMs(ms: number, unit: QtcTimeUnit): number | null {
  if (!Number.isFinite(ms) || ms < 0) return null;
  if (unit === 'ms') return ms;
  if (unit === 's') return ms / 1000;
  return null;
}

export function rrSecFromHeartRate(bpm: number): number | null {
  if (!Number.isFinite(bpm) || bpm <= 0) return null;
  return 60 / bpm;
}

export function heartRateFromRrSec(rrSec: number): number | null {
  if (!Number.isFinite(rrSec) || rrSec <= 0) return null;
  return 60 / rrSec;
}

export function qtcBazettMs(qtMs: number, rrSec: number): number | null {
  if (!Number.isFinite(qtMs) || qtMs <= 0) return null;
  if (!Number.isFinite(rrSec) || rrSec <= 0) return null;
  return qtMs / Math.sqrt(rrSec);
}

export function qtcFridericiaMs(qtMs: number, rrSec: number): number | null {
  if (!Number.isFinite(qtMs) || qtMs <= 0) return null;
  if (!Number.isFinite(rrSec) || rrSec <= 0) return null;
  return qtMs / Math.cbrt(rrSec);
}

/** Sagie / Framingham linear formula with QT in ms and RR in seconds. */
export function qtcFraminghamMs(qtMs: number, rrSec: number): number | null {
  if (!Number.isFinite(qtMs) || qtMs <= 0) return null;
  if (!Number.isFinite(rrSec) || rrSec <= 0) return null;
  return qtMs + 154 * (1 - rrSec);
}

export function qtcHodgesMs(qtMs: number, heartRateBpm: number): number | null {
  if (!Number.isFinite(qtMs) || qtMs <= 0) return null;
  if (!Number.isFinite(heartRateBpm) || heartRateBpm <= 0) return null;
  return qtMs + 1.75 * (heartRateBpm - 60);
}

export function formatQtc(ms: number): string {
  if (!Number.isFinite(ms)) return '';
  const rounded = Math.round(ms * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(Number(rounded.toFixed(2)));
}

export function formatDisplayValue(ms: number, unit: QtcTimeUnit): string {
  const v = fromMs(ms, unit);
  if (v == null) return '';
  if (unit === 's') {
    const rounded = Math.round(v * 10000) / 10000;
    return String(Number(rounded.toFixed(4)));
  }
  return formatQtc(v);
}

function methodEntry(
  method: QtcMethodResult['method'],
  label: string,
  qtcMs: number | null
): QtcMethodResult | null {
  if (qtcMs == null || !Number.isFinite(qtcMs)) return null;
  return {
    method,
    label,
    qtcMs,
    formatted: formatQtc(qtcMs),
  };
}

export function calculateQtc(args: {
  qtMs: number;
  rrSec: number;
  heartRateBpm: number;
}): QtcResult | null {
  const { qtMs, rrSec, heartRateBpm } = args;
  const bazett = qtcBazettMs(qtMs, rrSec);
  if (bazett == null) return null;

  const methods: QtcMethodResult[] = [];
  const bazettEntry = methodEntry('bazett', 'Bazett', bazett);
  if (bazettEntry) methods.push(bazettEntry);
  const fridericia = methodEntry(
    'fridericia',
    'Fridericia',
    qtcFridericiaMs(qtMs, rrSec)
  );
  if (fridericia) methods.push(fridericia);
  const framingham = methodEntry(
    'framingham',
    'Framingham',
    qtcFraminghamMs(qtMs, rrSec)
  );
  if (framingham) methods.push(framingham);
  const hodges = methodEntry(
    'hodges',
    'Hodges',
    qtcHodgesMs(qtMs, heartRateBpm)
  );
  if (hodges) methods.push(hodges);

  return {
    qtMs,
    rrSec,
    heartRateBpm,
    bazettMs: bazett,
    formattedBazett: formatQtc(bazett),
    methods,
    explanation: `RR = ${formatQtc(rrSec * 1000)} ms (${formatDisplayValue(rrSec * 1000, 's')} s). Bazett QTc = ${formatQtc(qtMs)} / √${formatDisplayValue(rrSec * 1000, 's')} = ${formatQtc(bazett)} ms. Educational correction — not a diagnosis.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
