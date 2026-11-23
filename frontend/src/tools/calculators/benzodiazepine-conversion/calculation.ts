/**
 * Benzodiazepine equivalency — approximate mg conversions vs 10 mg diazepam (ADR-018).
 *
 *   targetMg = sourceMg × (targetMgPer10Diazepam / sourceMgPer10Diazepam)
 *
 * Only one active source field per calculation pass.
 */

import {
  BENZODIAZEPINE_DRUGS,
  drugById,
  type BenzodiazepineDrugId,
} from './drug-data';
import type {
  BenzodiazepineConversionInput,
  BenzodiazepineConversionResult,
} from './types';

export const DISCLAIMER =
  'Approximate educational equivalencies only—not for benzodiazepine switching, tapering, or prescribing.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function convertBenzodiazepineDose(
  sourceMg: number,
  sourceId: BenzodiazepineDrugId,
  targetId: BenzodiazepineDrugId,
): number {
  if (!(sourceMg >= 0)) throw new Error('Dose must be non-negative.');
  if (sourceId === targetId) return sourceMg;
  const source = drugById(sourceId);
  const target = drugById(targetId);
  return (sourceMg * target.mgPer10Diazepam) / source.mgPer10Diazepam;
}

export function findActiveSource(
  input: BenzodiazepineConversionInput,
): { id: BenzodiazepineDrugId; mg: number } | null {
  let active: { id: BenzodiazepineDrugId; mg: number } | null = null;
  for (const drug of BENZODIAZEPINE_DRUGS) {
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

export function calculateBenzodiazepineConversion(
  input: BenzodiazepineConversionInput,
): BenzodiazepineConversionResult {
  const empty = {
    convertedDoses: {},
    activeSourceId: null,
    disclaimer: DISCLAIMER,
  };

  const active = findActiveSource(input);
  if (!active) {
    return {
      ...empty,
      statusHeadline: 'Enter one drug dose',
      statusDetail:
        'Enter the dose (mg) of one benzodiazepine or barbiturate to see approximate equivalents in the other fields.',
    };
  }

  if (active.mg < 0) {
    return {
      ...empty,
      statusHeadline: 'One active dose only',
      statusDetail:
        'Clear other dose fields and enter a single source drug dose to convert.',
    };
  }

  if (active.mg === 0) {
    return {
      ...empty,
      convertedDoses: Object.fromEntries(
        BENZODIAZEPINE_DRUGS.map((d) => [d.id, 0]),
      ) as BenzodiazepineConversionResult['convertedDoses'],
      activeSourceId: active.id,
      statusHeadline: 'Zero dose',
      statusDetail: 'All equivalent doses are 0 mg.',
      disclaimer: DISCLAIMER,
    };
  }

  const convertedDoses: Partial<Record<BenzodiazepineDrugId, number>> = {};
  for (const drug of BENZODIAZEPINE_DRUGS) {
    convertedDoses[drug.id] = convertBenzodiazepineDose(
      active.mg,
      active.id,
      drug.id,
    );
  }

  const src = drugById(active.id);
  return {
    convertedDoses,
    activeSourceId: active.id,
    statusHeadline: 'Benzodiazepine equivalents',
    statusDetail: `${active.mg} mg ${src.label} ≈ approximate equivalents across listed agents (anchored to 10 mg diazepam).`,
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