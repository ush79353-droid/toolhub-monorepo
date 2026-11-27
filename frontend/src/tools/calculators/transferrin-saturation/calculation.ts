/**
 * Transferrin saturation (TSAT) — educational iron-status arithmetic (ADR-018).
 *
 * Method 1: TSAT% = 100 × Fe / TIBC  (Fe & TIBC as µg/dL equivalents)
 * Method 2: TSAT% = 70.9 × Fe / TF   (Fe µg/dL, transferrin mg/dL)
 *
 * Factor 70.9 from two Fe atoms per transferrin (StatPearls NBK559119; Omni).
 * Iron: µmol/L → µg/dL = × 5.58647 (55.845 µg/µmol ÷ 10).
 * Transferrin: g/L → mg/dL = × 100.
 */

import type {
  IronUnit,
  TransferrinSaturationInput,
  TransferrinSaturationResult,
  TransferrinUnit,
} from './types';

export const SOURCE_NOTE =
  'TSAT (%) = 100 × Fe / TIBC (same iron units), or TSAT (%) = 70.9 × Fe(µg/dL) / TF(mg/dL). Educational only.';

export const DISCLAIMER =
  'Educational iron-status worksheet — not a diagnosis or treatment decision.';

/** µg/dL per µmol/L for elemental iron. */
export const UG_DL_PER_UMOL_L = 5.58647;

export const TF_FACTOR = 70.9;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function ironToUgDl(value: number, unit: IronUnit): number {
  return unit === 'ug_dl' ? value : value * UG_DL_PER_UMOL_L;
}

export function ugDlToIron(ugDl: number, unit: IronUnit): number {
  return unit === 'ug_dl' ? ugDl : ugDl / UG_DL_PER_UMOL_L;
}

export function transferrinToMgDl(value: number, unit: TransferrinUnit): number {
  return unit === 'mg_dl' ? value : value * 100;
}

export function mgDlToTransferrin(mgDl: number, unit: TransferrinUnit): number {
  return unit === 'mg_dl' ? mgDl : mgDl / 100;
}

/** Method 1 — Fe and TIBC already in µg/dL. */
export function tsatFromTibc(feUgDl: number, tibcUgDl: number): number {
  if (!(Number.isFinite(feUgDl) && feUgDl >= 0)) {
    throw new Error('Fe must be a non-negative finite number.');
  }
  if (!(Number.isFinite(tibcUgDl) && tibcUgDl > 0)) {
    throw new Error('TIBC must be a positive finite number.');
  }
  return (100 * feUgDl) / tibcUgDl;
}

/** Method 2 — Fe µg/dL, TF mg/dL. */
export function tsatFromTransferrin(feUgDl: number, tfMgDl: number): number {
  if (!(Number.isFinite(feUgDl) && feUgDl >= 0)) {
    throw new Error('Fe must be a non-negative finite number.');
  }
  if (!(Number.isFinite(tfMgDl) && tfMgDl > 0)) {
    throw new Error('Transferrin must be a positive finite number.');
  }
  return (TF_FACTOR * feUgDl) / tfMgDl;
}

export function formatTsat(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

function emptyResult(
  partial?: Partial<TransferrinSaturationResult>,
): TransferrinSaturationResult {
  return {
    tsat1: null,
    formattedTsat1: '',
    tsat2: null,
    formattedTsat2: '',
    statusHeadline: 'Enter values in either method panel.',
    statusDetail:
      'Each panel computes TSAT independently when its inputs are valid.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateTransferrinSaturation(
  input: TransferrinSaturationInput,
): TransferrinSaturationResult {
  let tsat1: number | null = null;
  let tsat2: number | null = null;

  const fe1 = parseNumber(input.fe1Text);
  const tibc = parseNumber(input.tibcText);
  if (fe1 !== null && tibc !== null) {
    if (fe1 >= 0 && tibc > 0) {
      try {
        tsat1 = tsatFromTibc(
          ironToUgDl(fe1, input.fe1Unit),
          ironToUgDl(tibc, input.tibcUnit),
        );
        if (!Number.isFinite(tsat1)) tsat1 = null;
      } catch {
        tsat1 = null;
      }
    }
  }

  const fe2 = parseNumber(input.fe2Text);
  const tf = parseNumber(input.tfText);
  if (fe2 !== null && tf !== null) {
    if (fe2 >= 0 && tf > 0) {
      try {
        tsat2 = tsatFromTransferrin(
          ironToUgDl(fe2, input.fe2Unit),
          transferrinToMgDl(tf, input.tfUnit),
        );
        if (!Number.isFinite(tsat2)) tsat2 = null;
      } catch {
        tsat2 = null;
      }
    }
  }

  if (tsat1 === null && tsat2 === null) {
    const zeroDenom =
      (tibc !== null && !(tibc > 0) && input.tibcText.trim() !== '') ||
      (tf !== null && !(tf > 0) && input.tfText.trim() !== '');
    if (zeroDenom) {
      return emptyResult({
        statusHeadline: 'Denominator must be greater than zero.',
        statusDetail: 'TIBC and transferrin cannot be zero for TSAT.',
      });
    }
    return emptyResult();
  }

  return {
    tsat1,
    formattedTsat1: formatTsat(tsat1),
    tsat2,
    formattedTsat2: formatTsat(tsat2),
    statusHeadline: 'Transferrin saturation',
    statusDetail:
      tsat1 != null && tsat2 != null
        ? 'Both independent methods produced a TSAT value.'
        : tsat1 != null
          ? 'Method 1 (Fe / TIBC) result shown.'
          : 'Method 2 (Fe / transferrin) result shown.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
