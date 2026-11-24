/**
 * INR Calculator — UI shell placeholders (engine commit wires WHO math).
 */

import type { InrInput, InrResult } from './types';

export const SOURCE_NOTE =
  'INR = (patient PT ÷ mean normal PT)^ISI. WHO TRS 979 Annex 6; ISI is reagent- and method-specific.';

export const DISCLAIMER =
  'Educational coagulation calculator — not a laboratory report, diagnosis, or anticoagulation order.';

/** UI placeholder — engine commit implements WHO power formula. */
export function calculateInr(_input: InrInput): InrResult {
  return {
    inr: null,
    formattedInr: '',
    statusHeadline: 'Enter PT values',
    statusDetail:
      'Enter patient PT (sec), control/mean normal PT (sec), and ISI to compute INR.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
