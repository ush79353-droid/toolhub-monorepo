import type { CagrChangeInValue, CagrField, CagrResult } from './types';

export function formatCagrNumber(value: number, maxFractionDigits = 6): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e6) / 1e6;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFractionDigits,
  }).format(rounded);
}

export function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 100) / 100;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rounded);
}

export function computeChangeInValue(
  initialValue: number,
  finalValue: number
): CagrChangeInValue | null {
  if (!Number.isFinite(initialValue) || !Number.isFinite(finalValue)) return null;
  if (initialValue === 0) return null;
  const absoluteChange = finalValue - initialValue;
  const percentChange = (absoluteChange / initialValue) * 100;
  if (!Number.isFinite(absoluteChange) || !Number.isFinite(percentChange)) return null;
  return {
    absoluteChange,
    percentChange,
    absoluteDisplay: formatMoney(absoluteChange),
    percentDisplay: formatCagrNumber(percentChange),
  };
}

/** CAGR (%) = ((Final / Initial)^(1 / Periods) − 1) × 100 */
export function solveCagr(
  initialValue: number,
  finalValue: number,
  periods: number
): number | null {
  if (!Number.isFinite(initialValue) || !Number.isFinite(finalValue) || !Number.isFinite(periods)) {
    return null;
  }
  if (initialValue <= 0 || finalValue < 0 || periods <= 0) return null;
  if (finalValue === 0) return -100;
  const ratio = finalValue / initialValue;
  if (!Number.isFinite(ratio) || ratio <= 0) return null;
  const cagr = (ratio ** (1 / periods) - 1) * 100;
  return Number.isFinite(cagr) ? cagr : null;
}

/** Final = Initial × (1 + CAGR/100)^Periods */
export function solveFinal(
  initialValue: number,
  cagrPercent: number,
  periods: number
): number | null {
  if (!Number.isFinite(initialValue) || !Number.isFinite(cagrPercent) || !Number.isFinite(periods)) {
    return null;
  }
  if (initialValue <= 0 || periods <= 0 || cagrPercent < -100) return null;
  const factor = 1 + cagrPercent / 100;
  if (factor < 0) return null;
  const finalValue = initialValue * factor ** periods;
  return Number.isFinite(finalValue) ? finalValue : null;
}

/** Initial = Final / (1 + CAGR/100)^Periods */
export function solveInitial(
  finalValue: number,
  cagrPercent: number,
  periods: number
): number | null {
  if (!Number.isFinite(finalValue) || !Number.isFinite(cagrPercent) || !Number.isFinite(periods)) {
    return null;
  }
  if (finalValue < 0 || periods <= 0 || cagrPercent < -100) return null;
  const factor = 1 + cagrPercent / 100;
  if (factor <= 0) return null;
  const denom = factor ** periods;
  if (!Number.isFinite(denom) || denom === 0) return null;
  const initialValue = finalValue / denom;
  return Number.isFinite(initialValue) && initialValue > 0 ? initialValue : null;
}

/**
 * Periods = ln(Final / Initial) / ln(1 + CAGR/100)
 * Ambiguous when CAGR = 0 and Final = Initial.
 */
export function solvePeriods(
  initialValue: number,
  finalValue: number,
  cagrPercent: number
): number | null {
  if (!Number.isFinite(initialValue) || !Number.isFinite(finalValue) || !Number.isFinite(cagrPercent)) {
    return null;
  }
  if (initialValue <= 0 || finalValue <= 0 || cagrPercent <= -100) return null;
  const factor = 1 + cagrPercent / 100;
  if (factor <= 0) return null;

  const ratio = finalValue / initialValue;
  if (!Number.isFinite(ratio) || ratio <= 0) return null;

  // Ambiguous: zero growth with equal values — infinite solutions
  if (Math.abs(cagrPercent) < 1e-12 && Math.abs(ratio - 1) < 1e-12) return null;
  // Impossible: nonzero CAGR but equal values
  if (Math.abs(ratio - 1) < 1e-12 && Math.abs(cagrPercent) >= 1e-12) return null;
  // Impossible: growth rate sign contradicts value direction
  if (factor === 1) return null;

  const periods = Math.log(ratio) / Math.log(factor);
  if (!Number.isFinite(periods) || periods <= 0) return null;
  return periods;
}

export interface CagrSolveInput {
  cagrPercent: number | null;
  periods: number | null;
  initialValue: number | null;
  finalValue: number | null;
  /** Prefer solving this empty / previously solved field. */
  target: CagrField | null;
}

export function solveCagrSystem(input: CagrSolveInput): CagrResult | null {
  const { cagrPercent, periods, initialValue, finalValue, target } = input;

  const present: CagrField[] = [];
  if (cagrPercent !== null) present.push('cagrPercent');
  if (periods !== null) present.push('periods');
  if (initialValue !== null) present.push('initialValue');
  if (finalValue !== null) present.push('finalValue');

  if (present.length < 3) return null;

  let solvedField: CagrField | null = null;
  let cagr = cagrPercent;
  let n = periods;
  let initial = initialValue;
  let final = finalValue;

  const trySolve = (field: CagrField): boolean => {
    if (field === 'cagrPercent' && initial !== null && final !== null && n !== null) {
      const v = solveCagr(initial, final, n);
      if (v === null) return false;
      cagr = v;
      solvedField = 'cagrPercent';
      return true;
    }
    if (field === 'finalValue' && initial !== null && cagr !== null && n !== null) {
      const v = solveFinal(initial, cagr, n);
      if (v === null) return false;
      final = v;
      solvedField = 'finalValue';
      return true;
    }
    if (field === 'initialValue' && final !== null && cagr !== null && n !== null) {
      const v = solveInitial(final, cagr, n);
      if (v === null) return false;
      initial = v;
      solvedField = 'initialValue';
      return true;
    }
    if (field === 'periods' && initial !== null && final !== null && cagr !== null) {
      const v = solvePeriods(initial, final, cagr);
      if (v === null) return false;
      n = v;
      solvedField = 'periods';
      return true;
    }
    return false;
  };

  if (present.length === 3) {
    const missing = (['cagrPercent', 'periods', 'initialValue', 'finalValue'] as const).find(
      (f) => !present.includes(f)
    );
    if (!missing || !trySolve(missing)) return null;
  } else if (present.length === 4) {
    // All filled: only refresh a designated non-user target
    if (!target || !trySolve(target)) {
      // Keep user values as-is; still report change metrics
      solvedField = null;
    }
  } else {
    return null;
  }

  if (cagr === null || n === null || initial === null || final === null) return null;
  if (![cagr, n, initial, final].every(Number.isFinite)) return null;

  return {
    cagrPercent: cagr,
    periods: n,
    initialValue: initial,
    finalValue: final,
    solvedField,
    displays: {
      cagrPercent: formatCagrNumber(cagr),
      periods: formatCagrNumber(n),
      initialValue: formatMoney(initial),
      finalValue: formatMoney(final),
    },
    change: computeChangeInValue(initial, final),
  };
}
