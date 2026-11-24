/**
 * Opioid equianalgesic conversion — pure engine (ADR-018).
 *
 *   OME_mg = sourceAmount_base × omePerBaseUnit
 *   target_base = OME_mg / target.omePerBaseUnit
 *   if target ≠ source: target_base *= (1 − ICT/100)
 *
 * Factors: CDC 2022 / FDA labeling caveats / Scottish Palliative Care Guidelines.
 * Educational comparison only — not for automatic rotation or prescribing.
 */

import {
  OPIOID_DRUGS,
  drugById,
  fromBaseAmount,
  toBaseAmount,
  type OpioidDrugId,
} from './drug-data';
import type {
  OpioidConversionInput,
  OpioidConversionResult,
} from './types';

export const DISCLAIMER =
  'Approximate educational equianalgesic comparison only—not for patient-specific opioid rotation, automatic dosing, or prescribing. Patch rows follow CDC/FDA caveats and are not bidirectional clinical switch tables.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function findActiveSource(
  input: OpioidConversionInput,
): { id: OpioidDrugId; amount: number } | null {
  let active: { id: OpioidDrugId; amount: number } | null = null;
  for (const drug of OPIOID_DRUGS) {
    const raw = input.doses[drug.id];
    if (raw.trim() === '') continue;
    const amount = parseNumber(raw);
    if (amount === null || amount < 0) continue;
    if (active !== null) {
      return { id: active.id, amount: -1 };
    }
    active = { id: drug.id, amount };
  }
  return active;
}

/**
 * Convert a source dose into a target drug amount in the target’s selected unit.
 * ICT reduction applies only when drug/route differs from the source.
 */
export function convertOpioidDose(
  sourceAmountDisplay: number,
  sourceId: OpioidDrugId,
  sourceUnit: OpioidConversionInput['units'][OpioidDrugId],
  targetId: OpioidDrugId,
  targetUnit: OpioidConversionInput['units'][OpioidDrugId],
  crossTolerancePercent: number,
): number {
  if (!(sourceAmountDisplay >= 0)) throw new Error('Dose must be non-negative.');
  if (!(crossTolerancePercent >= 0 && crossTolerancePercent <= 100)) {
    throw new Error('Incomplete cross-tolerance must be 0–100%.');
  }

  const source = drugById(sourceId);
  const target = drugById(targetId);
  const sourceBase = toBaseAmount(sourceAmountDisplay, sourceUnit, source);
  const ome = sourceBase * source.omePerBaseUnit;

  let targetBase = ome / target.omePerBaseUnit;
  if (sourceId !== targetId) {
    targetBase *= 1 - crossTolerancePercent / 100;
  }
  return fromBaseAmount(targetBase, targetUnit, target);
}

export function calculateOpioidConversion(
  input: OpioidConversionInput,
): OpioidConversionResult {
  const empty: OpioidConversionResult = {
    convertedDoses: {},
    activeSourceId: null,
    oralMorphineEquivalentMg: null,
    crossTolerancePercent: 0,
    statusHeadline: 'Enter one opioid dose',
    statusDetail:
      'Enter the dose of one opioid (with route) to see approximate equianalgesic equivalents in the other fields.',
    cautionNotes: [],
    disclaimer: DISCLAIMER,
  };

  const ictRaw = parseNumber(input.crossToleranceText);
  const ict = ictRaw === null ? 0 : ictRaw;

  const active = findActiveSource(input);
  if (!active) {
    return { ...empty, crossTolerancePercent: ict };
  }

  if (active.amount < 0) {
    return {
      ...empty,
      crossTolerancePercent: ict,
      statusHeadline: 'One active dose only',
      statusDetail:
        'Clear other dose fields and enter a single source opioid dose to convert.',
    };
  }

  const source = drugById(active.id);
  const sourceUnit = input.units[active.id];
  const sourceBase = toBaseAmount(active.amount, sourceUnit, source);
  const ome = sourceBase * source.omePerBaseUnit;

  const convertedDoses: Partial<Record<OpioidDrugId, number>> = {};
  const cautionNotes: string[] = [];

  for (const drug of OPIOID_DRUGS) {
    const value = convertOpioidDose(
      active.amount,
      active.id,
      sourceUnit,
      drug.id,
      input.units[drug.id],
      ict,
    );
    convertedDoses[drug.id] = value;

    if (
      drug.nonlinearCaution &&
      drug.id !== active.id &&
      (active.id === 'fentanyl_td' ||
        active.id === 'buprenorphine_td' ||
        drug.id === 'fentanyl_td' ||
        drug.id === 'buprenorphine_td')
    ) {
      if (drug.id === 'fentanyl_td' || active.id === 'fentanyl_td') {
        cautionNotes.push(
          'Fentanyl patch: CDC factor 2.4 used for educational MME-style comparison; FDA Duragesic tables are not for converting from a patch to another opioid.',
        );
      }
      if (drug.id === 'buprenorphine_td' || active.id === 'buprenorphine_td') {
        cautionNotes.push(
          'Buprenorphine patch: approximate Scottish 5 mcg/h ≈ 12 mg oral morphine factor; CDC excludes buprenorphine from MME; FDA Butrans start is categorical, not linear.',
        );
      }
    }
  }

  const uniqueCautions = [...new Set(cautionNotes)];

  if (active.amount === 0) {
    return {
      convertedDoses,
      activeSourceId: active.id,
      oralMorphineEquivalentMg: 0,
      crossTolerancePercent: ict,
      statusHeadline: 'Zero dose',
      statusDetail: 'All equivalent doses are 0.',
      cautionNotes: uniqueCautions,
      disclaimer: DISCLAIMER,
    };
  }

  const ictNote =
    ict > 0
      ? ` Converted doses reduced by ${ict}% for incomplete cross-tolerance.`
      : '';

  return {
    convertedDoses,
    activeSourceId: active.id,
    oralMorphineEquivalentMg: ome,
    crossTolerancePercent: ict,
    statusHeadline: 'Equianalgesic comparison',
    statusDetail: `${active.amount} ${sourceUnit === 'mcg_h' ? 'mcg/h' : sourceUnit} ${source.label} ≈ ${ome.toPrecision(6)} mg oral morphine equivalent (before ICT).${ictNote}`,
    cautionNotes: uniqueCautions,
    disclaimer: DISCLAIMER,
  };
}
