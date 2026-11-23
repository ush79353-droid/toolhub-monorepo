/**
 * Ankle-Brachial Index (ABI).
 *
 * Per leg: ABI = (highest ipsilateral pedal systolic mmHg) /
 *               (highest of the two brachial systolic mmHg).
 *
 * This UI accepts the already-selected higher arm and higher foot values
 * (screenshot scope). Sources: AHA scientific statement on ABI measurement
 * (Aboyans et al., Circulation 2012) and 2024 ACC/AHA PAD guideline reporting
 * bands (≤0.90 abnormal; 0.91–0.99 borderline; 1.00–1.40 normal; >1.40
 * noncompressible). Educational ratio only — not a diagnosis.
 */

import type { AbiInput, AbiResult, AbiSideResult } from './types';

export const SOURCE_CITATION =
  'Aboyans V et al. Measurement and Interpretation of the Ankle-Brachial Index. Circulation. 2012;126:2890–2909. ACC/AHA 2024 PAD guideline ABI reporting categories.';

export const DISCLAIMER =
  'Educational ABI ratio only. It does not diagnose peripheral artery disease or replace Doppler measurement and clinical judgement.';

export function parsePressureMmHg(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  if (/infinity|nan/i.test(cleaned)) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n;
}

/** Display ABI to two decimal places (fixture 108/120 → 0.90). */
export function formatAbi(abi: number): string {
  return abi.toFixed(2);
}

export function computeSideAbi(
  armMmHg: number,
  footMmHg: number
): AbiSideResult | null {
  if (!(armMmHg > 0) || !(footMmHg > 0)) return null;
  if (!Number.isFinite(armMmHg) || !Number.isFinite(footMmHg)) return null;
  const abi = footMmHg / armMmHg;
  if (!Number.isFinite(abi)) return null;
  return { abi, formattedAbi: formatAbi(abi) };
}

export function calculateAbi(input: AbiInput): AbiResult {
  const arm = parsePressureMmHg(input.armMmHg);
  const rightFoot = parsePressureMmHg(input.rightFootMmHg);
  const leftFoot = parsePressureMmHg(input.leftFootMmHg);

  return {
    right:
      arm != null && rightFoot != null
        ? computeSideAbi(arm, rightFoot)
        : null,
    left:
      arm != null && leftFoot != null ? computeSideAbi(arm, leftFoot) : null,
  };
}
