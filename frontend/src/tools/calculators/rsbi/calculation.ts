import { DISCLAIMER, SOURCE_LABEL } from './content';
import type { RsbiInput, RsbiResult } from './types';

export { DISCLAIMER, SOURCE_LABEL };

/**
 * RSBI = f / VT_L where VT_L = tidalVolumeMl / 1000.
 * Example: 20 breaths/min ÷ 0.4 L = 50 breaths/min/L.
 */
export function calculateRsbi(input: RsbiInput): RsbiResult {
  const f = input.respiratoryRate as number;
  const vtMl = input.tidalVolumeMl as number;
  const vtL = vtMl / 1000;
  const rsbi = f / vtL;
  const rounded = Math.round(rsbi * 1000) / 1000;

  return {
    rsbi,
    formattedRsbi: String(rounded),
    explanation: `RSBI = f ÷ VT(L) = ${f} ÷ (${vtMl} mL / 1000) = ${rounded} breaths/min/L. Measurement conditions and weaning context matter; a threshold alone is not extubation readiness.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
