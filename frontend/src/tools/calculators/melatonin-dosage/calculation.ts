/**
 * Melatonin label / SmPC lookup (pure, ADR-018).
 *
 * Sources (educational; not personalized medical advice):
 * - EMA Circadin 2 mg prolonged-release tablets SmPC / EPAR: monotherapy for
 *   short-term primary insomnia (poor sleep quality) in adults aged 55+;
 *   2 mg once daily after food, 1–2 hours before bedtime; up to 13 weeks;
 *   swallow whole; not established in children 0–18; not recommended in
 *   hepatic impairment.
 * - United States: melatonin sold as a dietary supplement is not an FDA-
 *   approved OTC drug with standardized Drug Facts dosing. This tool does not
 *   invent milligram schedules for tablets/capsules/liquid/spray/strips.
 */

import {
  getIndication,
  getMedicationType,
  type DurationUnit,
  type MelatoninDosageInput,
  type MelatoninDosageResult,
  type MelatoninIndicationOption,
  type MelatoninMedicationOption,
} from './types';

const SOURCE_CIRCADIN =
  'EMA Circadin 2 mg prolonged-release tablets SmPC / EPAR (primary insomnia, adults ≥55). Educational only — follow the dispensed label and clinician.';

const SOURCE_SUPPLEMENT =
  'United States dietary-supplement labeling (DSHEA). Melatonin products are not FDA-approved drugs with a single Drug Facts schedule. Educational only — read your product label; ask a clinician or pharmacist.';

/** Circadin labeled course ceiling: 13 weeks. */
export const CIRCADIN_MAX_DAYS = 13 * 7;

export function parseDurationDays(
  text: string,
  unit: DurationUnit
): { days: number | null; error: string | null } {
  const trimmed = text.trim();
  if (trimmed === '') {
    return { days: null, error: null };
  }
  const n = Number(trimmed.replace(/,/g, ''));
  if (!Number.isFinite(n)) {
    return { days: null, error: 'Enter a valid therapy duration number.' };
  }
  if (n < 0) {
    return { days: null, error: 'Therapy duration cannot be negative.' };
  }
  if (n === 0) {
    return { days: null, error: 'Therapy duration must be greater than zero when provided.' };
  }
  if (unit === 'weeks') {
    const days = n * 7;
    if (!Number.isFinite(days) || days > 3650) {
      return { days: null, error: 'Therapy duration is too large.' };
    }
    return { days, error: null };
  }
  if (n > 3650) {
    return { days: null, error: 'Therapy duration is too large.' };
  }
  return { days: n, error: null };
}

function formatDays(days: number): string {
  if (days === 1) return '1 day';
  if (days % 7 === 0) {
    const w = days / 7;
    return w === 1 ? '1 week (7 days)' : `${w} weeks (${days} days)`;
  }
  return `${days} days`;
}

function circadinResult(
  indication: MelatoninIndicationOption,
  medication: MelatoninMedicationOption,
  durationDays: number | null,
  mismatchMessage: string | null
): MelatoninDosageResult {
  const scheduleLines = [
    'Labeled dose: 2 mg melatonin once daily (one prolonged-release tablet).',
    'Timing: take after food, 1–2 hours before bedtime.',
    'Swallow the tablet whole — do not crush or chew (prolonged-release properties).',
    'Age scope on the Circadin SmPC: adults aged 55 years and over.',
    'Course length on the SmPC: this dosage may be continued for up to 13 weeks.',
  ];

  const durationLines: string[] = [];
  const unitLines: string[] = [];

  if (durationDays == null) {
    durationLines.push(
      'Therapy duration left blank — no course length or tablet count is inferred from the defaults.'
    );
  } else {
    durationLines.push(`Entered therapy duration: ${formatDays(durationDays)}.`);
    if (durationDays > CIRCADIN_MAX_DAYS) {
      durationLines.push(
        `This exceeds the Circadin SmPC ceiling of 13 weeks (${CIRCADIN_MAX_DAYS} days). Ask a clinician — this tool does not extend the labeled course.`
      );
    } else {
      durationLines.push(
        `Within the Circadin SmPC short-term window (≤ 13 weeks / ${CIRCADIN_MAX_DAYS} days).`
      );
    }
    // 1 × 2 mg tablet per day when a duration is supplied.
    const tablets = Math.round(durationDays);
    unitLines.push(
      `At one 2 mg prolonged-release tablet per day, a ${formatDays(durationDays)} course is ${tablets} tablet${tablets === 1 ? '' : 's'} (educational supply math only).`
    );
  }

  return {
    channel: 'circadin_ema',
    indicationLabel: indication.label,
    medicationLabel: medication.label,
    headline:
      'Circadin (melatonin 2 mg prolonged-release) SmPC summary for short-term primary insomnia in adults ≥55.',
    scheduleLines,
    durationLines,
    unitLines,
    warnings: [
      'Educational SmPC summary only — not medical advice and not a substitute for the dispensed label.',
      'Circadin is not established in children aged 0–18 years on this SmPC; other forms may be considered only under clinician care.',
      'Not recommended in hepatic impairment per Circadin labeling; use caution in renal impairment.',
      'Do not combine with other melatonin products unless a clinician directs you to.',
    ],
    sourceNote: SOURCE_CIRCADIN,
    mismatchMessage,
    durationDays,
  };
}

function supplementResult(
  indication: MelatoninIndicationOption,
  medication: MelatoninMedicationOption,
  durationDays: number | null
): MelatoninDosageResult {
  const isPediatric = indication.id === 'children';

  if (isPediatric) {
    return {
      channel: 'out_of_scope',
      indicationLabel: indication.label,
      medicationLabel: medication.label,
      headline:
        'No pediatric melatonin schedule is provided here — ask a clinician before giving melatonin to children or adolescents.',
      scheduleLines: [
        'This tool does not invent pediatric milligram doses or durations from blank defaults.',
        'US dietary-supplement melatonin products are not FDA-approved drugs with a single pediatric Drug Facts table in this explorer.',
      ],
      durationLines:
        durationDays == null
          ? [
              'Therapy duration left blank — no course length is inferred.',
            ]
          : [
              `Entered therapy duration: ${formatDays(durationDays)} — still ask a clinician; duration alone does not authorize a dose.`,
            ],
      unitLines: [],
      warnings: [
        'Educational only. Pediatric melatonin use requires individualized clinician guidance and the specific product label.',
      ],
      sourceNote: SOURCE_SUPPLEMENT,
      mismatchMessage: null,
      durationDays,
    };
  }

  const scheduleLines = [
    'US melatonin tablets, capsules, liquids, sprays, and strips are typically marketed as dietary supplements — not FDA-approved OTC drugs with one national Drug Facts dose table.',
    'This calculator does not invent a milligram dose, spray count, or drop volume from the blank defaults.',
    'Read the Supplement Facts / directions on YOUR product. Strengths and serving sizes vary widely between brands.',
    'For an EU-authorized prolonged-release medicine schedule (Circadin 2 mg, adults ≥55, primary insomnia), switch Medication type to “Prolonged-release tablets 2 mg (e.g. Circadin)”.',
  ];

  if (!indication.circadinEligible) {
    scheduleLines.push(
      `Indication “${indication.label}” is outside Circadin’s primary-insomnia SmPC. Do not assume a Circadin or supplement milligram schedule applies — ask a clinician.`
    );
  }

  const durationLines: string[] = [];
  if (durationDays == null) {
    durationLines.push(
      'Therapy duration left blank — no course length or unit count is inferred from the defaults.'
    );
  } else {
    durationLines.push(`Entered therapy duration: ${formatDays(durationDays)}.`);
    durationLines.push(
      'Without a labeled daily milligram amount from YOUR product (or a clinician-directed regimen), this tool will not invent total milligrams or tablet counts for dietary supplements.'
    );
  }

  return {
    channel: 'dietary_supplement',
    indicationLabel: indication.label,
    medicationLabel: medication.label,
    headline:
      'Label information only — no invented melatonin milligram schedule for this dietary-supplement form.',
    scheduleLines,
    durationLines,
    unitLines: [],
    warnings: [
      'Educational only — not medical advice. Melatonin can interact with medicines and is not appropriate for everyone.',
      'Pregnancy, breastfeeding, autoimmune disease, seizure disorders, and depression need clinician guidance before use.',
      'Share Result shares only the public page URL — not your selections.',
    ],
    sourceNote: SOURCE_SUPPLEMENT,
    mismatchMessage: null,
    durationDays,
  };
}

export function calculateMelatoninDosage(
  input: MelatoninDosageInput
): MelatoninDosageResult | null {
  const indication = getIndication(input.indication);
  const medication = getMedicationType(input.medicationType);
  if (!indication || !medication) return null;

  const parsed = parseDurationDays(input.durationText, input.durationUnit);
  if (parsed.error) return null;
  const durationDays = parsed.days;

  if (medication.channel === 'circadin_ema') {
    if (indication.id === 'children') {
      return {
        channel: 'out_of_scope',
        indicationLabel: indication.label,
        medicationLabel: medication.label,
        headline:
          'Circadin SmPC: safety and efficacy in children 0–18 years have not been established.',
        scheduleLines: [
          'Do not use this explorer to invent a pediatric Circadin dose.',
          'Ask a specialist; other pharmaceutical forms may be considered only under clinician care.',
        ],
        durationLines:
          durationDays == null
            ? ['Therapy duration left blank — no course is inferred.']
            : [`Entered therapy duration: ${formatDays(durationDays)}.`],
        unitLines: [],
        warnings: [
          'Educational SmPC note only — not a prescribing recommendation for minors.',
        ],
        sourceNote: SOURCE_CIRCADIN,
        mismatchMessage: null,
        durationDays,
      };
    }

    if (!indication.circadinEligible) {
      return {
        channel: 'out_of_scope',
        indicationLabel: indication.label,
        medicationLabel: medication.label,
        headline:
          'Circadin is labeled for short-term primary insomnia (poor sleep quality) in adults ≥55 — not for this indication.',
        scheduleLines: [
          `“${indication.label}” is outside the Circadin therapeutic indication on the EMA SmPC.`,
          'This tool will not invent an off-label milligram schedule.',
        ],
        durationLines:
          durationDays == null
            ? ['Therapy duration left blank — no course is inferred.']
            : [`Entered therapy duration: ${formatDays(durationDays)}.`],
        unitLines: [],
        warnings: [
          'Ask a clinician about evidence-based options for this indication.',
        ],
        sourceNote: SOURCE_CIRCADIN,
        mismatchMessage: `Circadin SmPC indication is primary insomnia in adults ≥55 — not “${indication.label}”.`,
        durationDays,
      };
    }

    const mismatch =
      indication.id === 'trouble_falling_asleep'
        ? 'Circadin’s formal indication wording is primary insomnia characterised by poor quality of sleep (adults ≥55). “Trouble falling asleep” is shown for screenshot parity; confirm the clinical picture matches the SmPC before relying on this summary.'
        : null;

    return circadinResult(indication, medication, durationDays, mismatch);
  }

  return supplementResult(indication, medication, durationDays);
}
