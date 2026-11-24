/**
 * Morphine milligram equivalents (MME) — CDC 2022 factors only (ADR-018).
 *
 *   MME/day = dose_in_table_units × conversion_factor
 *
 * Table units: mg/day for all listed opioids except fentanyl transdermal (mcg/hr).
 * Oral mcg entries convert to mg (÷ 1000) before multiplying.
 *
 * Source: CDC Clinical Practice Guideline for Prescribing Opioids for Pain —
 * United States, 2022 (MMWR Recommendations and Reports Vol. 71 / No. RR-3),
 * table “Morphine milligram equivalent doses for commonly prescribed opioids
 * for pain management” (https://www.cdc.gov/mmwr/volumes/71/rr/rr7103a1.htm).
 *
 * Do NOT invent factors. Buprenorphine and other agents absent from that table
 * are unsupported. MME must not be used to select a replacement opioid dose.
 */

import {
  opioidOption,
  type MmeDoseUnit,
  type MmeInput,
  type MmeOpioidId,
  type MmeResult,
} from './types';

/** CDC 2022 MMWR conversion factors (multiply dose × factor → MME/day). */
export const CDC_2022_MME_FACTORS: Readonly<Record<MmeOpioidId, number>> = {
  codeine: 0.15,
  fentanyl_td: 2.4,
  hydrocodone: 1.0,
  hydromorphone: 5.0,
  methadone: 4.7,
  morphine: 1.0,
  oxycodone: 1.5,
  oxymorphone: 3.0,
  tapentadol: 0.4,
  tramadol: 0.2,
};

export const SOURCE_NOTE =
  'Conversion factors from CDC Clinical Practice Guideline for Prescribing Opioids for Pain — United States, 2022 (MMWR). All doses mg/day except fentanyl transdermal (mcg/hr). Do not use MME to choose a replacement opioid dose.';

export const DISCLAIMER =
  'Educational MME comparison only — not for selecting a replacement opioid dose, tapering, prescribing, or opioid use disorder dosing. Confirm product labeling with a licensed clinician.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Convert entered amount into the CDC table unit for the selected opioid. */
export function toCanonicalDose(
  amount: number,
  unit: MmeDoseUnit,
  opioidId: MmeOpioidId,
): number {
  const basis = opioidOption(opioidId).doseBasis;
  if (basis === 'mcg_per_hr') {
    if (unit !== 'mcg_hr') {
      throw new Error('Fentanyl transdermal requires mcg/hr.');
    }
    return amount;
  }
  if (unit === 'mcg_hr') {
    throw new Error('Use mg or mcg per day for this opioid.');
  }
  if (unit === 'mcg') return amount / 1000;
  return amount;
}

export function mmeForDose(
  opioidId: MmeOpioidId,
  doseCanonical: number,
): number {
  if (!(doseCanonical >= 0) || !Number.isFinite(doseCanonical)) {
    throw new Error('Dose must be a non-negative finite number.');
  }
  const factor = CDC_2022_MME_FACTORS[opioidId];
  if (factor == null || !Number.isFinite(factor)) {
    throw new Error('Unsupported opioid: no CDC 2022 MME factor.');
  }
  return doseCanonical * factor;
}

export function formatMme(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

function unscored(headline: string, detail: string): MmeResult {
  return {
    opioidId: null,
    doseCanonical: null,
    conversionFactor: null,
    mme: null,
    statusHeadline: headline,
    statusDetail: detail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function calculateMme(input: MmeInput): MmeResult {
  const option = opioidOption(input.opioidId);
  const factor = CDC_2022_MME_FACTORS[input.opioidId];
  if (factor == null) {
    return unscored(
      'Unsupported opioid',
      'Only CDC 2022 table opioids are available. No factor was invented for other formulations.',
    );
  }

  const raw = parseNumber(input.doseText);
  if (raw === null) {
    return unscored(
      'Enter dose',
      option.doseBasis === 'mcg_per_hr'
        ? 'Enter the transdermal fentanyl patch rate in mcg/hr to see MME/day.'
        : 'Enter the total daily opioid amount to see morphine milligram equivalents.',
    );
  }
  if (!(raw >= 0)) {
    throw new Error('Dose must be zero or greater.');
  }

  const doseCanonical = toCanonicalDose(raw, input.doseUnit, input.opioidId);
  const mme = mmeForDose(input.opioidId, doseCanonical);
  const unitLabel =
    option.doseBasis === 'mcg_per_hr' ? 'mcg/hr' : 'mg/day';

  return {
    opioidId: input.opioidId,
    doseCanonical,
    conversionFactor: factor,
    mme,
    statusHeadline: 'Morphine milligram equivalents',
    statusDetail: `${formatMme(doseCanonical)} ${unitLabel} ${option.label} × ${factor} = ${formatMme(mme)} MME/day (CDC 2022). Educational comparison only — not for opioid switching.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
