/**
 * Aleve / naproxen dosage explorer — educational label lookup (ADR-023).
 * Screenshot layout specimen used Pain + Tablet 220 mg; clinical text follows
 * FDA OTC Aleve Drug Facts and prescription naproxen labels (not the specimen’s
 * 500 mg / “2.3 tablets” figures).
 */

export type AleveIndicationId =
  | 'pain'
  | 'arthritis'
  | 'muscular_aches'
  | 'backache'
  | 'menstrual_cramps'
  | 'headache'
  | 'toothache'
  | 'common_cold'
  | 'fever'
  | 'rheumatoid_arthritis'
  | 'osteoarthritis'
  | 'ankylosing_spondylitis'
  | 'acute_gout';

export type AleveDrugTypeId =
  | 'otc_tablet_220'
  | 'otc_caplet_220'
  | 'otc_liquid_gels_220'
  | 'rx_naproxen_250'
  | 'rx_naproxen_375'
  | 'rx_naproxen_500'
  | 'rx_naproxen_sodium_275'
  | 'rx_naproxen_sodium_550';

export type LabelChannel = 'otc' | 'rx';

export type SaltForm = 'naproxen' | 'naproxen_sodium';

export interface AleveIndicationOption {
  id: AleveIndicationId;
  label: string;
  /** OTC Drug Facts “Uses” vs prescription-only labeled indications. */
  channel: LabelChannel;
}

export interface AleveDrugTypeOption {
  id: AleveDrugTypeId;
  label: string;
  channel: LabelChannel;
  salt: SaltForm;
  /** Labeled strength of the selected product unit (mg of the salt form). */
  strengthMg: number;
  /**
   * Equivalent naproxen (base) mg for salt↔base education.
   * OTC: 220 mg NS ≈ 200 mg naproxen. Rx NS 275/550 ≈ 250/500 naproxen.
   */
  naproxenBaseMg: number;
  unitNoun: 'tablet' | 'caplet' | 'liquid gel';
}

export interface AleveDosageInput {
  indication: AleveIndicationId;
  drugType: AleveDrugTypeId;
}

export interface ScheduleBullet {
  text: string;
}

export interface AleveDosageResult {
  channel: LabelChannel;
  indicationLabel: string;
  drugLabel: string;
  strengthMg: number;
  salt: SaltForm;
  naproxenBaseMg: number;
  unitNoun: string;
  /** Compact headline, e.g. typical maintenance dose description. */
  typicalDosageLine: string;
  /** Whole-unit tablet/caplet line, or an explicit unavailable message. */
  unitEquivalenceLine: string;
  /** True when a matching whole-unit count was reported (never fractional). */
  hasWholeUnitCount: boolean;
  initialLine: string | null;
  followUpBullets: ScheduleBullet[];
  maxLines: string[];
  saltNote: string;
  warnings: string[];
  sourceNote: string;
  mismatchMessage: string | null;
}

export type AleveDosageFieldErrors = {
  form?: string;
  indication?: string;
  drugType?: string;
};

export const ALEVE_INDICATIONS: readonly AleveIndicationOption[] = [
  { id: 'pain', label: 'Pain', channel: 'otc' },
  { id: 'arthritis', label: 'Minor pain of arthritis', channel: 'otc' },
  { id: 'muscular_aches', label: 'Muscular aches', channel: 'otc' },
  { id: 'backache', label: 'Backache', channel: 'otc' },
  { id: 'menstrual_cramps', label: 'Menstrual cramps', channel: 'otc' },
  { id: 'headache', label: 'Headache', channel: 'otc' },
  { id: 'toothache', label: 'Toothache', channel: 'otc' },
  { id: 'common_cold', label: 'Common cold', channel: 'otc' },
  { id: 'fever', label: 'Fever', channel: 'otc' },
  {
    id: 'rheumatoid_arthritis',
    label: 'Rheumatoid arthritis (prescription)',
    channel: 'rx',
  },
  {
    id: 'osteoarthritis',
    label: 'Osteoarthritis (prescription)',
    channel: 'rx',
  },
  {
    id: 'ankylosing_spondylitis',
    label: 'Ankylosing spondylitis (prescription)',
    channel: 'rx',
  },
  { id: 'acute_gout', label: 'Acute gout (prescription)', channel: 'rx' },
] as const;

export const ALEVE_DRUG_TYPES: readonly AleveDrugTypeOption[] = [
  {
    id: 'otc_tablet_220',
    label: 'Tablet 220 mg (Aleve OTC)',
    channel: 'otc',
    salt: 'naproxen_sodium',
    strengthMg: 220,
    naproxenBaseMg: 200,
    unitNoun: 'tablet',
  },
  {
    id: 'otc_caplet_220',
    label: 'Caplet 220 mg (Aleve OTC)',
    channel: 'otc',
    salt: 'naproxen_sodium',
    strengthMg: 220,
    naproxenBaseMg: 200,
    unitNoun: 'caplet',
  },
  {
    id: 'otc_liquid_gels_220',
    label: 'Liquid gels 220 mg (Aleve OTC)',
    channel: 'otc',
    salt: 'naproxen_sodium',
    strengthMg: 220,
    naproxenBaseMg: 200,
    unitNoun: 'liquid gel',
  },
  {
    id: 'rx_naproxen_250',
    label: 'Prescription naproxen 250 mg',
    channel: 'rx',
    salt: 'naproxen',
    strengthMg: 250,
    naproxenBaseMg: 250,
    unitNoun: 'tablet',
  },
  {
    id: 'rx_naproxen_375',
    label: 'Prescription naproxen 375 mg',
    channel: 'rx',
    salt: 'naproxen',
    strengthMg: 375,
    naproxenBaseMg: 375,
    unitNoun: 'tablet',
  },
  {
    id: 'rx_naproxen_500',
    label: 'Prescription naproxen 500 mg',
    channel: 'rx',
    salt: 'naproxen',
    strengthMg: 500,
    naproxenBaseMg: 500,
    unitNoun: 'tablet',
  },
  {
    id: 'rx_naproxen_sodium_275',
    label: 'Prescription naproxen sodium 275 mg',
    channel: 'rx',
    salt: 'naproxen_sodium',
    strengthMg: 275,
    naproxenBaseMg: 250,
    unitNoun: 'tablet',
  },
  {
    id: 'rx_naproxen_sodium_550',
    label: 'Prescription naproxen sodium 550 mg',
    channel: 'rx',
    salt: 'naproxen_sodium',
    strengthMg: 550,
    naproxenBaseMg: 500,
    unitNoun: 'tablet',
  },
] as const;

/** Screenshot layout defaults — clinical content is OTC Drug Facts, not specimen numbers. */
export function createDefaultInput(): AleveDosageInput {
  return {
    indication: 'pain',
    drugType: 'otc_tablet_220',
  };
}

export function createEmptyInput(): AleveDosageInput {
  return createDefaultInput();
}

export function getIndication(
  id: AleveIndicationId
): AleveIndicationOption | undefined {
  return ALEVE_INDICATIONS.find((x) => x.id === id);
}

export function getDrugType(id: AleveDrugTypeId): AleveDrugTypeOption | undefined {
  return ALEVE_DRUG_TYPES.find((x) => x.id === id);
}
