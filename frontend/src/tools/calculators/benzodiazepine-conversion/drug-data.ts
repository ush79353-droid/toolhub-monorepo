/**
 * Approximate benzodiazepine/barbiturate equivalencies (mg per 10 mg diazepam).
 * Educational comparisons — Ashton/CPS-style teaching table; not for prescribing switches.
 */

export type BenzodiazepineDrugId =
  | 'midazolam_iv'
  | 'midazolam_po'
  | 'oxazepam'
  | 'secobarbital'
  | 'triazolam'
  | 'alprazolam'
  | 'lorazepam'
  | 'phenobarbital'
  | 'temazepam'
  | 'bromazepam'
  | 'chlordiazepoxide'
  | 'clonazepam'
  | 'clorazepate'
  | 'diazepam'
  | 'flurazepam'
  | 'quazepam';

export type DurationGroup = 'short' | 'intermediate' | 'long';

export interface BenzodiazepineDrugMeta {
  id: BenzodiazepineDrugId;
  label: string;
  brand: string;
  durationGroup: DurationGroup;
  /** Milligrams of this drug equivalent to 10 mg oral diazepam. */
  mgPer10Diazepam: number;
}

export const BENZODIAZEPINE_DRUGS: readonly BenzodiazepineDrugMeta[] = [
  { id: 'midazolam_iv', label: 'Midazolam IV', brand: 'Versed', durationGroup: 'short', mgPer10Diazepam: 2 },
  { id: 'midazolam_po', label: 'Midazolam PO', brand: 'Versed', durationGroup: 'short', mgPer10Diazepam: 5 },
  { id: 'oxazepam', label: 'Oxazepam', brand: 'Serax', durationGroup: 'short', mgPer10Diazepam: 15 },
  { id: 'secobarbital', label: 'Secobarbital', brand: 'Seconal', durationGroup: 'short', mgPer10Diazepam: 100 },
  { id: 'triazolam', label: 'Triazolam', brand: 'Halcion', durationGroup: 'short', mgPer10Diazepam: 0.25 },
  { id: 'alprazolam', label: 'Alprazolam', brand: 'Xanax', durationGroup: 'intermediate', mgPer10Diazepam: 0.5 },
  { id: 'lorazepam', label: 'Lorazepam', brand: 'Ativan', durationGroup: 'intermediate', mgPer10Diazepam: 1 },
  { id: 'phenobarbital', label: 'Phenobarbital', brand: 'Phenobarbital', durationGroup: 'intermediate', mgPer10Diazepam: 30 },
  { id: 'temazepam', label: 'Temazepam', brand: 'Restoril', durationGroup: 'intermediate', mgPer10Diazepam: 10 },
  { id: 'bromazepam', label: 'Bromazepam', brand: 'Lectopam', durationGroup: 'long', mgPer10Diazepam: 3 },
  { id: 'chlordiazepoxide', label: 'Chlordiazepoxide', brand: 'Librium', durationGroup: 'long', mgPer10Diazepam: 25 },
  { id: 'clonazepam', label: 'Clonazepam', brand: 'Klonopin', durationGroup: 'long', mgPer10Diazepam: 0.5 },
  { id: 'clorazepate', label: 'Clorazepate', brand: 'Tranxene', durationGroup: 'long', mgPer10Diazepam: 7.5 },
  { id: 'diazepam', label: 'Diazepam', brand: 'Valium', durationGroup: 'long', mgPer10Diazepam: 10 },
  { id: 'flurazepam', label: 'Flurazepam', brand: 'Dalmane', durationGroup: 'long', mgPer10Diazepam: 15 },
  { id: 'quazepam', label: 'Quazepam', brand: 'Doral', durationGroup: 'long', mgPer10Diazepam: 10 },
];

export const DURATION_GROUP_LABEL: Record<DurationGroup, string> = {
  short: 'Short duration (approximately 2–7 h)',
  intermediate: 'Intermediate duration (approximately 8–10 h)',
  long: 'Long duration (approximately 11–20 h)',
};

export function drugById(id: BenzodiazepineDrugId): BenzodiazepineDrugMeta {
  const found = BENZODIAZEPINE_DRUGS.find((d) => d.id === id);
  if (!found) throw new Error(`Unknown drug ${id}`);
  return found;
}