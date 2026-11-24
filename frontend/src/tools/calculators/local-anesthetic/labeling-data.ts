/**
 * Plain (no epinephrine) single-dose educational ceilings.
 * Sources cited in SOURCE_NOTE (calculation.ts).
 */
export type LocalAnestheticDrug =
  | 'bupivacaine'
  | 'lidocaine'
  | 'mepivacaine'
  | 'ropivacaine';

export interface DrugLimit {
  id: LocalAnestheticDrug;
  label: string;
  /** mg/kg plain; null when label is absolute-only for usual dosing. */
  mgPerKg: number | null;
  /** Absolute single-dose ceiling (mg) without epinephrine. */
  absoluteCapMg: number;
  /** Concentrations offered in the UI (% w/v). */
  concentrationsPercent: readonly number[];
  defaultConcentrationPercent: number;
  warningNote: string | null;
}

export const DRUG_LIMITS: readonly DrugLimit[] = [
  {
    id: 'bupivacaine',
    label: 'Bupivacaine',
    mgPerKg: 2.5,
    absoluteCapMg: 175,
    concentrationsPercent: [0.25, 0.5],
    defaultConcentrationPercent: 0.25,
    warningNote:
      'It is recommended that a single dose of Bupivacaine without epinephrine should not exceed 175 mg.',
  },
  {
    id: 'lidocaine',
    label: 'Lidocaine',
    mgPerKg: 4.5,
    absoluteCapMg: 300,
    concentrationsPercent: [0.5, 1, 1.5, 2],
    defaultConcentrationPercent: 1,
    warningNote: null,
  },
  {
    id: 'mepivacaine',
    label: 'Mepivacaine',
    mgPerKg: null,
    absoluteCapMg: 400,
    concentrationsPercent: [1, 1.5, 2],
    defaultConcentrationPercent: 1,
    warningNote:
      'Carbocaine/Polocaine labeling: usual adult single dose should not usually exceed 400 mg (plain).',
  },
  {
    id: 'ropivacaine',
    label: 'Ropivacaine',
    mgPerKg: 3,
    absoluteCapMg: 225,
    concentrationsPercent: [0.2, 0.5, 0.75, 1],
    defaultConcentrationPercent: 0.5,
    warningNote: null,
  },
];

export function limitFor(drug: LocalAnestheticDrug): DrugLimit {
  const row = DRUG_LIMITS.find((d) => d.id === drug);
  if (!row) throw new Error(`Unknown drug: ${drug}`);
  return row;
}
