/**
 * Pure CIWA-Ar total (Sullivan et al. 1989). No React / Mongo / HTTP.
 * Total = sum of ten item scores. Max 67.
 */

import { DISCLAIMER, SOURCE_LABEL } from './content';
import type { CiwaInput, CiwaResult, CiwaSeverityBand } from './types';
import { CIWA_ITEMS, CIWA_MAX_TOTAL } from './types';

export function isAssessed(v: number | null): v is number {
  return v != null && Number.isFinite(v);
}

export function calculateCiwa(input: CiwaInput): CiwaResult {
  let total = 0;
  let assessedCount = 0;

  for (const item of CIWA_ITEMS) {
    const v = input[item.id];
    if (!isAssessed(v)) continue;
    assessedCount += 1;
    total += v;
  }

  const allAssessed = assessedCount === CIWA_ITEMS.length;
  let band: CiwaSeverityBand = 'incomplete';
  let bandLabel = 'Incomplete — assess every item (0 = observed absence; “Not assessed” is different).';

  if (allAssessed) {
    if (total < 10) {
      band = 'low';
      bandLabel =
        'Educational band often cited as lower severity (<10). Not a treatment order.';
    } else if (total <= 20) {
      band = 'moderate';
      bandLabel =
        'Educational band often cited as intermediate (10–20). Clinical judgment required — not a medication prescription.';
    } else {
      band = 'severe';
      bandLabel =
        'Educational band often cited as higher severity (>20). Seek clinical care — this tool does not prescribe benzodiazepines.';
    }
  }

  return {
    total,
    maxTotal: CIWA_MAX_TOTAL,
    assessedCount,
    allAssessed,
    band,
    bandLabel,
    formattedTotal: allAssessed ? String(total) : `${total}*`,
    explanation: allAssessed
      ? `CIWA-Ar total = sum of 10 item scores (${total} / ${CIWA_MAX_TOTAL}). ${bandLabel}`
      : `Partial sum ${total} from ${assessedCount}/10 assessed items. Complete all items for a full CIWA-Ar total (max ${CIWA_MAX_TOTAL}).`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
