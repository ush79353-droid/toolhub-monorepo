/**
 * Rate-pressure product (RPP / double product) educational arithmetic (ADR-018).
 *
 *   RPP = HR × SBP
 *
 * Units: beats/min × mmHg → bpm·mmHg. No scaling factor unless a labeled
 * convention is required (prompt: preserve raw product).
 *
 * Sources: Gobel FL et al., Circulation 1978 (exercise double product and
 * myocardial oxygen demand); common clinical exercise-lab usage of peak
 * HR and peak SBP for a stage-specific product.
 */

import type {
  RatePressureProductInput,
  RatePressureProductResult,
} from './types';

export const SOURCE_NOTE =
  'Rate-pressure product (double product) = maximum heart rate × maximum systolic blood pressure (bpm·mmHg). Reflects myocardial oxygen demand during exercise; use contemporaneous HR and SBP for the same stage. Educational arithmetic only.';

export const DISCLAIMER =
  'Educational physiology calculator — not a diagnosis, stress-test interpretation, or clinical recommendation.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/**
 * Raw double product.
 * @throws if HR or SBP is non-finite or ≤ 0
 */
export function ratePressureProduct(hr: number, sbp: number): number {
  if (!(Number.isFinite(hr) && hr > 0)) {
    throw new Error('Heart rate must be a positive finite number.');
  }
  if (!(Number.isFinite(sbp) && sbp > 0)) {
    throw new Error('Systolic BP must be a positive finite number.');
  }
  return hr * sbp;
}

export function calculateRatePressureProduct(
  input: RatePressureProductInput,
): RatePressureProductResult {
  const hr = parseNumber(input.heartRateText);
  const sbp = parseNumber(input.systolicBpText);

  if (hr === null || sbp === null) {
    return {
      product: null,
      statusHeadline: 'Enter HR and SBP',
      statusDetail:
        'Enter maximum heart rate (beats/min) and maximum systolic blood pressure (mmHg) measured at the same exercise stage.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  if (!(hr > 0)) {
    return {
      product: null,
      statusHeadline: 'Invalid heart rate',
      statusDetail: 'Maximum heart rate must be positive.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }
  if (!(sbp > 0)) {
    return {
      product: null,
      statusHeadline: 'Invalid systolic BP',
      statusDetail: 'Maximum systolic blood pressure must be positive.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const product = ratePressureProduct(hr, sbp);

  return {
    product,
    statusHeadline: 'Rate-pressure product',
    statusDetail: `RPP = ${hr} × ${sbp} = ${formatProduct(product)} bpm·mmHg (raw double product; no scaling).`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

/** Thousands grouping for display (e.g. 24000 → "24,000"). */
export function formatProduct(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(Math.round(value));
}
