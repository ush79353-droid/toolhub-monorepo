/**
 * Educational gabapentin (Neurontin) label explorer — FDA PI schedules only.
 * Off-label indications stay informational (no invented regimens).
 * Source: FDA NEURONTIN label (rev. 4/2025) / DailyMed.
 */

import {
  INDICATION_OPTIONS,
  type GabapentinDosageInput,
  type GabapentinDosageResult,
  type GabapentinIndicationId,
  type LabelScope,
} from './types';

const DISCLAIMER =
  'Educational FDA label summary only — not medical advice and not a prescription. Confirm the carton/PI in hand. Gabapentin requires individualization and renal adjustment; do not start, stop, or change therapy without a clinician.';

const SOURCE =
  'FDA NEURONTIN (gabapentin) Prescribing Information (NDA 020235 / 020882 / 021129), revised 4/2025; DailyMed Neurontin SPL.';

const RENAL_NOTE =
  'Ages ≥12 with CrCl <60 mL/min: reduce total daily dose per FDA Table 1 (e.g., CrCl ≥60 → TID regimens; >30–59 → BID; >15–29 → QD; ≤15 → further proportional reduction; hemodialysis supplemental dose after sessions). Pediatric renal impairment <12 years has not been studied. This calculator does not compute CrCl (not on the reference UI).';

export function parseAgeYears(raw: string): number | null | 'invalid' {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return 'invalid';
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0 || value > 120) return 'invalid';
  return value;
}

function labelFor(id: GabapentinIndicationId | null): string {
  if (!id) return 'Not selected';
  return INDICATION_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

function epilepsyResult(age: number): Omit<
  GabapentinDosageResult,
  'indication' | 'indicationLabel' | 'ageYears' | 'disclaimer' | 'sourceNote' | 'renalNote'
> {
  if (age < 3) {
    return {
      scope: 'age_not_labeled',
      productNote: 'Immediate-release gabapentin (NEURONTIN and equivalents).',
      approvalNote:
        'FDA epilepsy indication covers adjunctive partial-onset seizures in patients 3 years and older — not under age 3.',
      doseLines: [],
      interpretation:
        'Age under 3 years is outside the labeled epilepsy population for NEURONTIN. Ask a clinician; no pediatric dose is shown here.',
    };
  }
  if (age >= 3 && age < 12) {
    return {
      scope: 'fda_labeled',
      productNote: 'Immediate-release gabapentin (NEURONTIN and equivalents).',
      approvalNote:
        'FDA-approved adjunctive therapy for partial-onset seizures, ages 3–11 (weight-based).',
      doseLines: [
        'Starting dose: 10–15 mg/kg/day in three divided doses.',
        'Ages 3–4 maintenance: 40 mg/kg/day in three divided doses (titrate over ~3 days).',
        'Ages 5–11 maintenance: 25–35 mg/kg/day in three divided doses.',
        'Maximum interval between doses should not exceed 12 hours.',
        'Weight is required to compute mg amounts — not collected on this screen; use clinician/pharmacy calculation.',
      ],
      interpretation:
        'Labeled pediatric epilepsy dosing is mg/kg. Enter age confirmed the band; a clinician must apply body weight and renal status.',
    };
  }
  return {
    scope: 'fda_labeled',
    productNote: 'Immediate-release gabapentin (NEURONTIN and equivalents).',
    approvalNote:
      'FDA-approved adjunctive therapy for partial-onset seizures in patients 12 years and older.',
    doseLines: [
      'Starting dose: 300 mg three times daily (900 mg/day).',
      'Recommended maintenance: 300 mg to 600 mg three times daily (900–1800 mg/day).',
      'Higher totals (up to 2400–3600 mg/day) appear in clinical experience; individualize.',
      'Maximum interval between doses should not exceed 12 hours.',
    ],
    interpretation:
      'Adult/adolescent epilepsy label schedule shown for normal renal function. Apply FDA renal Table 1 when CrCl is reduced.',
  };
}

function phnResult(age: number): Omit<
  GabapentinDosageResult,
  'indication' | 'indicationLabel' | 'ageYears' | 'disclaimer' | 'sourceNote' | 'renalNote'
> {
  if (age < 18) {
    return {
      scope: 'age_not_labeled',
      productNote: 'Immediate-release gabapentin (NEURONTIN and equivalents).',
      approvalNote: 'FDA PHN indication is for adults.',
      doseLines: [],
      interpretation:
        'Postherpetic neuralgia dosing on the NEURONTIN label is for adults. No pediatric PHN regimen is shown.',
    };
  }
  return {
    scope: 'fda_labeled',
    productNote: 'Immediate-release gabapentin (NEURONTIN and equivalents).',
    approvalNote: 'FDA-approved for management of postherpetic neuralgia in adults.',
    doseLines: [
      'Day 1: 300 mg once.',
      'Day 2: 600 mg/day (300 mg twice daily).',
      'Day 3: 900 mg/day (300 mg three times daily).',
      'Then titrate as needed for pain relief up to 1800 mg/day (600 mg three times daily).',
      'Studies used 1800–3600 mg/day; additional benefit above 1800 mg/day was not demonstrated.',
    ],
    interpretation:
      'Adult PHN titration from the FDA label (normal renal function). Reduce per Table 1 if CrCl <60 mL/min.',
  };
}

function offLabel(
  indication: GabapentinIndicationId,
): Omit<
  GabapentinDosageResult,
  'indication' | 'indicationLabel' | 'ageYears' | 'disclaimer' | 'sourceNote' | 'renalNote'
> {
  if (indication === 'rls') {
    return {
      scope: 'alternate_product',
      productNote:
        'Immediate-release gabapentin is not the FDA-approved RLS product.',
      approvalNote:
        'Gabapentin enacarbil (HORIZANT) is FDA-approved for moderate-to-severe primary RLS in adults. IR gabapentin (NEURONTIN) is not labeled for RLS.',
      doseLines: [],
      interpretation:
        'This tool does not invent an IR gabapentin RLS schedule. Use the Horizant PI or clinician guidance for RLS.',
    };
  }
  const name = labelFor(indication);
  return {
    scope: 'off_label_informational',
    productNote: 'Immediate-release gabapentin (NEURONTIN and equivalents).',
    approvalNote: `${name} is not an FDA-approved indication for NEURONTIN (gabapentin).`,
    doseLines: [],
    interpretation: `No FDA label dose is shown for ${name.toLowerCase()}. Any use is off-label and must be clinician-directed — this calculator will not invent a regimen.`,
  };
}

export function calculateGabapentinDosage(
  input: GabapentinDosageInput,
): GabapentinDosageResult {
  const ageParsed = parseAgeYears(input.ageYearsText);
  const ageYears = ageParsed === 'invalid' || ageParsed === null ? null : ageParsed;

  if (!input.indication || ageYears == null) {
    return {
      indication: input.indication,
      indicationLabel: labelFor(input.indication),
      ageYears,
      scope: 'awaiting_input',
      productNote: 'Immediate-release gabapentin (NEURONTIN) label explorer.',
      approvalNote:
        'Select an indication and enter age to see FDA-labeled or informational gating.',
      doseLines: [],
      renalNote: RENAL_NOTE,
      interpretation:
        'No dose is shown until indication and age are provided. Defaults stay blank (no medically actionable seed).',
      disclaimer: DISCLAIMER,
      sourceNote: SOURCE,
    };
  }

  let core: ReturnType<typeof epilepsyResult>;
  if (input.indication === 'epilepsy') {
    core = epilepsyResult(ageYears);
  } else if (input.indication === 'phn') {
    core = phnResult(ageYears);
  } else {
    core = offLabel(input.indication);
  }

  return {
    indication: input.indication,
    indicationLabel: labelFor(input.indication),
    ageYears,
    ...core,
    renalNote: RENAL_NOTE,
    disclaimer: DISCLAIMER,
    sourceNote: SOURCE,
  };
}

export type { LabelScope };
