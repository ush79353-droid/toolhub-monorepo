/**
 * Venous blood pH — Henderson–Hasselbalch estimate (educational, ADR-018).
 *
 *   pH = 6.1 + log₁₀( HCO₃ / (0.0308 × PaCO₂_mmHg) )
 *
 * Solubility coefficient 0.0308 mmol·L⁻¹·mmHg⁻¹ (standard teaching form).
 * Prompt fixture: HCO₃ 24 mEq/L, PaCO₂ 40 mmHg → pH ≈ 7.39.
 *
 * Output is an estimated pH, never a directly measured venous lab result.
 * Sample-type wording requires clinical review (PaCO₂ label vs venous title).
 */

import type { VenousBloodPhInput, VenousBloodPhResult, Paco2Unit } from './types';

export const SOURCE_NOTE =
  'Henderson–Hasselbalch: pH = 6.1 + log₁₀(HCO₃ / (0.0308 × PaCO₂ mmHg)). Educational estimate only — not a measured venous lab value.';

export const DISCLAIMER =
  'Estimated pH only — not a laboratory venous blood gas report. Review sample type and clinical context; do not treat this estimate as a directly measured venous result.';

export const UNIT_NOTE =
  'In this case, values in mEq/L are equal to those in mmol/L, and those in mmHg are equal to those in torr. If your results are in mmol/L or in mmHg, type in these values.';

export const PK_CARBONIC = 6.1;
export const CO2_SOLUBILITY = 0.0308;
/** Exact kPa → mmHg factor (760/101.325). */
export const KPA_TO_MMHG = 760 / 101.325;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function paco2ToMmHg(value: number, unit: Paco2Unit): number {
  return unit === 'mmHg' ? value : value * KPA_TO_MMHG;
}

export function mmHgToPaco2(mmHg: number, unit: Paco2Unit): number {
  return unit === 'mmHg' ? mmHg : mmHg / KPA_TO_MMHG;
}

export function hendersonHasselbalchPh(
  bicarbonate: number,
  paco2MmHg: number,
): number {
  return PK_CARBONIC + Math.log10(bicarbonate / (CO2_SOLUBILITY * paco2MmHg));
}

export function formatPh(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2);
}

function emptyResult(partial?: Partial<VenousBloodPhResult>): VenousBloodPhResult {
  return {
    ph: null,
    formattedPh: '',
    statusHeadline: 'Enter bicarbonate and PaCO₂.',
    statusDetail:
      'Estimated pH uses Henderson–Hasselbalch after converting PaCO₂ to mmHg.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    unitNote: UNIT_NOTE,
    ...partial,
  };
}

export function calculateVenousBloodPh(
  input: VenousBloodPhInput,
): VenousBloodPhResult {
  const hco3 = parseNumber(input.bicarbonateText);
  const paco2Raw = parseNumber(input.paco2Text);

  if (hco3 === null || paco2Raw === null) {
    return emptyResult();
  }

  if (!(hco3 > 0) || !(paco2Raw > 0)) {
    return emptyResult({
      statusHeadline: 'HCO₃ and PaCO₂ must be positive.',
      statusDetail: 'Nonpositive concentrations or pressures are rejected.',
    });
  }

  const paco2MmHg = paco2ToMmHg(paco2Raw, input.paco2Unit);
  if (!(paco2MmHg > 0)) {
    return emptyResult({
      statusHeadline: 'PaCO₂ conversion is invalid.',
      statusDetail: 'Check the selected pressure unit.',
    });
  }

  const ph = hendersonHasselbalchPh(hco3, paco2MmHg);
  if (!Number.isFinite(ph)) {
    return emptyResult({
      statusHeadline: 'Unable to estimate venous blood pH.',
      statusDetail: 'Check that inputs are finite positive numbers.',
    });
  }

  return {
    ph,
    formattedPh: formatPh(ph),
    statusHeadline: 'Estimated venous blood pH computed.',
    statusDetail: `Using pK 6.1 and solubility ${CO2_SOLUBILITY} with PaCO₂ ${paco2MmHg.toFixed(2)} mmHg. Not a measured venous lab value.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    unitNote: UNIT_NOTE,
  };
}
