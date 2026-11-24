/**
 * MME Calculator — types & defaults (ADR-018 / ADR-023).
 *
 * Screenshot scope: opioid dropdown (Codeine default), daily dose with unit + /day,
 * read-only morphine equivalents (MME). No FX. No medically actionable dose seed.
 *
 * Conversion factors live in calculation.ts (CDC 2022 MMWR table only).
 */

/** Opioids listed in CDC 2022 Clinical Practice Guideline MME table. */
export type MmeOpioidId =
  | 'codeine'
  | 'fentanyl_td'
  | 'hydrocodone'
  | 'hydromorphone'
  | 'methadone'
  | 'morphine'
  | 'oxycodone'
  | 'oxymorphone'
  | 'tapentadol'
  | 'tramadol';

/** Oral/systemic opioids use mg or mcg per day; fentanyl TD uses mcg/hr. */
export type MmeDoseUnit = 'mg' | 'mcg' | 'mcg_hr';

export interface MmeOpioidOption {
  id: MmeOpioidId;
  label: string;
  /** CDC table dose basis for this row. */
  doseBasis: 'mg_per_day' | 'mcg_per_hr';
}

export const MME_OPIOID_OPTIONS: readonly MmeOpioidOption[] = [
  { id: 'codeine', label: 'Codeine', doseBasis: 'mg_per_day' },
  {
    id: 'fentanyl_td',
    label: 'Fentanyl transdermal',
    doseBasis: 'mcg_per_hr',
  },
  { id: 'hydrocodone', label: 'Hydrocodone', doseBasis: 'mg_per_day' },
  { id: 'hydromorphone', label: 'Hydromorphone', doseBasis: 'mg_per_day' },
  { id: 'methadone', label: 'Methadone', doseBasis: 'mg_per_day' },
  { id: 'morphine', label: 'Morphine', doseBasis: 'mg_per_day' },
  { id: 'oxycodone', label: 'Oxycodone', doseBasis: 'mg_per_day' },
  { id: 'oxymorphone', label: 'Oxymorphone', doseBasis: 'mg_per_day' },
  { id: 'tapentadol', label: 'Tapentadol', doseBasis: 'mg_per_day' },
  { id: 'tramadol', label: 'Tramadol', doseBasis: 'mg_per_day' },
] as const;

export interface MmeInput {
  opioidId: MmeOpioidId;
  doseText: string;
  doseUnit: MmeDoseUnit;
}

export interface MmeResult {
  opioidId: MmeOpioidId | null;
  /** Daily dose in the CDC row unit (mg/day or mcg/hr). */
  doseCanonical: number | null;
  conversionFactor: number | null;
  /** Morphine milligram equivalents per day. */
  mme: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type MmeFieldErrors = {
  opioidId?: string;
  doseText?: string;
  doseUnit?: string;
};

export function opioidOption(id: MmeOpioidId): MmeOpioidOption {
  const found = MME_OPIOID_OPTIONS.find((o) => o.id === id);
  if (!found) throw new Error(`Unknown opioid ${id}`);
  return found;
}

/** Screenshot default opioid selection; dose stays blank (no clinical seed). */
export function createDefaultInput(): MmeInput {
  return {
    opioidId: 'codeine',
    doseText: '',
    doseUnit: 'mg',
  };
}

export function createEmptyInput(): MmeInput {
  return createDefaultInput();
}

/** Align unit with CDC dose basis when the opioid changes. */
export function unitForOpioid(
  opioidId: MmeOpioidId,
  previousUnit: MmeDoseUnit,
): MmeDoseUnit {
  const basis = opioidOption(opioidId).doseBasis;
  if (basis === 'mcg_per_hr') return 'mcg_hr';
  if (previousUnit === 'mcg_hr') return 'mg';
  return previousUnit === 'mcg' ? 'mcg' : 'mg';
}

export function inputsEqual(a: MmeInput, b: MmeInput): boolean {
  return (
    a.opioidId === b.opioidId &&
    a.doseText === b.doseText &&
    a.doseUnit === b.doseUnit
  );
}
