/**
 * Steroid Conversion — published systemic glucocorticoid equivalents (ADR-018).
 *
 *   targetMg = sourceMg × (targetEquivalentDoseMg / sourceEquivalentDoseMg)
 *
 * Factors come only from published anti-inflammatory tables (see drug-data.ts).
 * Systemic oral/parenteral framing only. One active source field per pass.
 */

import {
  STEROID_DRUGS,
  drugById,
  type SteroidDrugId,
} from './drug-data';
import type {
  SteroidConversionInput,
  SteroidConversionResult,
} from './types';

export const DISCLAIMER =
  'Always double-check the calculations, the dosing information and contraindications on the leaflet; consult your health provider before administering any medication. This tool cannot replace real medical consultation.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/**
 * Convert a systemic glucocorticoid dose using published equivalent-dose rows.
 * Rejects non-finite / negative mass. Identity when source === target.
 */
export function convertSteroidDose(
  sourceMg: number,
  sourceId: SteroidDrugId,
  targetId: SteroidDrugId,
): number {
  if (!(sourceMg >= 0) || !Number.isFinite(sourceMg)) {
    throw new Error('Dose must be a non-negative finite mass.');
  }
  if (sourceId === targetId) return sourceMg;
  const source = drugById(sourceId);
  const target = drugById(targetId);
  return (sourceMg * target.equivalentDoseMg) / source.equivalentDoseMg;
}

/**
 * First non-empty valid dose is the source. Sentinel mg = -1 if two+ filled.
 */
export function findActiveSource(
  input: SteroidConversionInput,
): { id: SteroidDrugId; mg: number } | null {
  let active: { id: SteroidDrugId; mg: number } | null = null;
  for (const drug of STEROID_DRUGS) {
    const raw = input.doses[drug.id];
    if (raw.trim() === '') continue;
    const mg = parseNumber(raw);
    if (mg === null || mg < 0) continue;
    if (active !== null) {
      return { id: active.id, mg: -1 };
    }
    active = { id: drug.id, mg };
  }
  return active;
}

export function calculateSteroidConversion(
  input: SteroidConversionInput,
): SteroidConversionResult {
  const empty = {
    convertedDoses: {} as SteroidConversionResult['convertedDoses'],
    activeSourceId: null as SteroidDrugId | null,
    disclaimer: DISCLAIMER,
  };

  const active = findActiveSource(input);
  if (!active) {
    return {
      ...empty,
      statusHeadline: 'Enter one steroid dose',
      statusDetail:
        'Enter the dose (mg) of one systemic corticosteroid to see approximate anti-inflammatory equivalents in the other fields.',
    };
  }

  if (active.mg < 0) {
    return {
      ...empty,
      statusHeadline: 'One active dose only',
      statusDetail:
        'Clear other dose fields and enter a single source steroid dose to convert.',
    };
  }

  if (active.mg === 0) {
    return {
      ...empty,
      convertedDoses: Object.fromEntries(
        STEROID_DRUGS.map((d) => [d.id, 0]),
      ) as SteroidConversionResult['convertedDoses'],
      activeSourceId: active.id,
      statusHeadline: 'Zero dose',
      statusDetail: 'All equivalent doses are 0 mg.',
    };
  }

  const convertedDoses: Partial<Record<SteroidDrugId, number>> = {};
  for (const drug of STEROID_DRUGS) {
    convertedDoses[drug.id] = convertSteroidDose(
      active.mg,
      active.id,
      drug.id,
    );
  }

  const src = drugById(active.id);
  return {
    convertedDoses,
    activeSourceId: active.id,
    statusHeadline: 'Steroid equivalents',
    statusDetail: `${active.mg} mg ${src.label} ≈ approximate anti-inflammatory equivalents (published systemic table). Durations differ; mineralocorticoid effects are not comparable. Not for taper or substitution.`,
    disclaimer: DISCLAIMER,
  };
}

export function formatDoseMg(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  const digits = abs >= 10 ? 2 : abs >= 1 ? 3 : 4;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}
