/**
 * Melatonin dosage explorer — educational label / SmPC lookup (ADR-023).
 * Screenshot defaults: Indication “Trouble falling asleep”, Medication type
 * “Tablets / capsules”, therapy duration blank. No dose or duration is inferred
 * from those blanks. US dietary-supplement forms have no FDA Drug Facts schedule
 * here; EMA Circadin 2 mg prolonged-release SmPC is the only authorized product
 * schedule encoded.
 */

export type MelatoninIndicationId =
  | 'trouble_falling_asleep'
  | 'poor_sleep_quality'
  | 'jet_lag'
  | 'shift_work'
  | 'delayed_sleep_phase'
  | 'children';

export type MelatoninMedicationTypeId =
  | 'tablets_capsules'
  | 'liquid'
  | 'spray'
  | 'strips'
  | 'prolonged_release_2mg';

export type DurationUnit = 'days' | 'weeks';

export type MelatoninChannel = 'circadin_ema' | 'dietary_supplement' | 'out_of_scope';

export interface MelatoninIndicationOption {
  id: MelatoninIndicationId;
  label: string;
  /** True when Circadin primary-insomnia SmPC can apply (age ≥55 gate in copy). */
  circadinEligible: boolean;
}

export interface MelatoninMedicationOption {
  id: MelatoninMedicationTypeId;
  label: string;
  channel: 'circadin_ema' | 'dietary_supplement';
}

export interface MelatoninDosageInput {
  indication: MelatoninIndicationId;
  medicationType: MelatoninMedicationTypeId;
  /** Blank by default — never invent a course length. */
  durationText: string;
  durationUnit: DurationUnit;
}

export interface MelatoninDosageResult {
  channel: MelatoninChannel;
  indicationLabel: string;
  medicationLabel: string;
  headline: string;
  scheduleLines: string[];
  durationLines: string[];
  unitLines: string[];
  warnings: string[];
  sourceNote: string;
  mismatchMessage: string | null;
  /** Parsed duration in whole days when provided and valid; else null. */
  durationDays: number | null;
}

export type MelatoninDosageFieldErrors = {
  form?: string;
  indication?: string;
  medicationType?: string;
  durationText?: string;
};

export const MELATONIN_INDICATIONS: readonly MelatoninIndicationOption[] = [
  {
    id: 'trouble_falling_asleep',
    label: 'Trouble falling asleep',
    circadinEligible: true,
  },
  {
    id: 'poor_sleep_quality',
    label: 'Poor sleep quality (primary insomnia)',
    circadinEligible: true,
  },
  {
    id: 'jet_lag',
    label: 'Jet lag',
    circadinEligible: false,
  },
  {
    id: 'shift_work',
    label: 'Shift work sleep disruption',
    circadinEligible: false,
  },
  {
    id: 'delayed_sleep_phase',
    label: 'Delayed sleep phase',
    circadinEligible: false,
  },
  {
    id: 'children',
    label: 'Children / adolescents',
    circadinEligible: false,
  },
] as const;

export const MELATONIN_MEDICATION_TYPES: readonly MelatoninMedicationOption[] = [
  {
    id: 'tablets_capsules',
    label: 'Tablets / capsules',
    channel: 'dietary_supplement',
  },
  {
    id: 'liquid',
    label: 'Liquid',
    channel: 'dietary_supplement',
  },
  {
    id: 'spray',
    label: 'Spray',
    channel: 'dietary_supplement',
  },
  {
    id: 'strips',
    label: 'Oral strips',
    channel: 'dietary_supplement',
  },
  {
    id: 'prolonged_release_2mg',
    label: 'Prolonged-release tablets 2 mg (e.g. Circadin)',
    channel: 'circadin_ema',
  },
] as const;

/** Screenshot layout defaults — duration stays blank; no inferred mg. */
export function createDefaultInput(): MelatoninDosageInput {
  return {
    indication: 'trouble_falling_asleep',
    medicationType: 'tablets_capsules',
    durationText: '',
    durationUnit: 'days',
  };
}

export function createEmptyInput(): MelatoninDosageInput {
  return createDefaultInput();
}

export function getIndication(
  id: MelatoninIndicationId
): MelatoninIndicationOption | undefined {
  return MELATONIN_INDICATIONS.find((x) => x.id === id);
}

export function getMedicationType(
  id: MelatoninMedicationTypeId
): MelatoninMedicationOption | undefined {
  return MELATONIN_MEDICATION_TYPES.find((x) => x.id === id);
}
