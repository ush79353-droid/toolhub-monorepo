/**
 * Opioid Conversion — published equianalgesic anchors (ADR-023).
 *
 * Factors are oral-morphine equivalents (OME) per base unit. Sources are
 * CDC 2022 MME table, FDA Duragesic/Butrans labeling caveats, and NHS
 * Scottish Palliative Care Guidelines route tables — never invented ratios.
 */

export type OpioidDrugId =
  | 'morphine_iv'
  | 'morphine_oral'
  | 'morphine_sc'
  | 'diamorphine_sc'
  | 'oxycodone_oral'
  | 'oxycodone_sc'
  | 'alfentanil_sc'
  | 'fentanyl_sc'
  | 'hydromorphone_oral'
  | 'hydromorphone_sc'
  | 'codeine_oral'
  | 'tramadol_oral'
  | 'fentanyl_td'
  | 'buprenorphine_td';

/** Display / storage unit for a dose field. */
export type OpioidUnit = 'mg' | 'mcg' | 'mcg_h';

export type OpioidUnitKind = 'mass' | 'rate';

export interface OpioidDrugMeta {
  id: OpioidDrugId;
  label: string;
  /** OME (mg oral morphine) per 1 base unit. */
  omePerBaseUnit: number;
  /** Base unit the factor applies to. */
  baseUnit: OpioidUnit;
  unitKind: OpioidUnitKind;
  /** Allowed UI unit selectors. */
  units: readonly OpioidUnit[];
  defaultUnit: OpioidUnit;
  /**
   * When true, educational reverse conversion is shown with a non-linear /
   * labeling caveat (FDA Duragesic reverse forbidden for prescribing;
   * buprenorphine partial agonist / Butrans categorical start).
   */
  nonlinearCaution: boolean;
  source: string;
}

export const OPIOID_DRUGS: readonly OpioidDrugMeta[] = [
  {
    id: 'morphine_iv',
    label: 'Morphine (IV)',
    // Oral:IV ≈ 3:1 equianalgesic (oral 30 mg ≈ IV 10 mg) — Scottish/NHS-aligned tables & cancercalc guideline synthesis.
    omePerBaseUnit: 3,
    baseUnit: 'mg',
    unitKind: 'mass',
    units: ['mg', 'mcg'],
    defaultUnit: 'mg',
    nonlinearCaution: false,
    source: 'Equianalgesic oral:IV 3:1 (NHS/Scottish-aligned conversion tables)',
  },
  {
    id: 'morphine_oral',
    label: 'Morphine (oral)',
    omePerBaseUnit: 1,
    baseUnit: 'mg',
    unitKind: 'mass',
    units: ['mg', 'mcg'],
    defaultUnit: 'mg',
    nonlinearCaution: false,
    source: 'CDC 2022 MME conversion factor 1.0',
  },
  {
    id: 'morphine_sc',
    label: 'Morphine (SC)',
    // Oral morphine 10 mg ≈ SC morphine 5 mg → OME/mg = 2.
    omePerBaseUnit: 2,
    baseUnit: 'mg',
    unitKind: 'mass',
    units: ['mg', 'mcg'],
    defaultUnit: 'mg',
    nonlinearCaution: false,
    source: 'Scottish Palliative Care Guidelines (oral 10 ≈ SC 5)',
  },
  {
    id: 'diamorphine_sc',
    label: 'Diamorphine (SC)',
    // Oral morphine 10 mg ≈ SC diamorphine 3 mg → OME/mg = 10/3.
    omePerBaseUnit: 10 / 3,
    baseUnit: 'mg',
    unitKind: 'mass',
    units: ['mg', 'mcg'],
    defaultUnit: 'mg',
    nonlinearCaution: false,
    source: 'Scottish Palliative Care Guidelines (oral 10 ≈ SC diamorphine 3)',
  },
  {
    id: 'oxycodone_oral',
    label: 'Oxycodone (oral)',
    omePerBaseUnit: 1.5,
    baseUnit: 'mg',
    unitKind: 'mass',
    units: ['mg', 'mcg'],
    defaultUnit: 'mg',
    nonlinearCaution: false,
    source: 'CDC 2022 MME conversion factor 1.5',
  },
  {
    id: 'oxycodone_sc',
    label: 'Oxycodone (SC)',
    // Oral morphine 10 mg ≈ SC oxycodone 2–3 mg; guideline “divide by 4” → 2.5 mg → OME/mg = 4.
    omePerBaseUnit: 4,
    baseUnit: 'mg',
    unitKind: 'mass',
    units: ['mg', 'mcg'],
    defaultUnit: 'mg',
    nonlinearCaution: false,
    source: 'Scottish Palliative Care Guidelines (oral morphine ÷4 → SC oxycodone)',
  },
  {
    id: 'alfentanil_sc',
    label: 'Alfentanil (SC)',
    // Oral morphine 30 mg ≈ SC alfentanil 1 mg → OME/mg = 30.
    omePerBaseUnit: 30,
    baseUnit: 'mg',
    unitKind: 'mass',
    units: ['mg', 'mcg'],
    defaultUnit: 'mg',
    nonlinearCaution: false,
    source: 'Scottish Palliative Care Guidelines (oral morphine 30 ≈ SC alfentanil 1)',
  },
  {
    id: 'fentanyl_sc',
    label: 'Fentanyl (SC)',
    // Published guideline CF 150 to oral morphine (1 mg SC ≈ 150 mg oral morphine).
    omePerBaseUnit: 150,
    baseUnit: 'mg',
    unitKind: 'mass',
    units: ['mg', 'mcg'],
    defaultUnit: 'mcg',
    nonlinearCaution: false,
    source:
      'Published palliative conversion tables (CF 150 to oral morphine; Mercadante/Caraceni review–aligned)',
  },
  {
    id: 'hydromorphone_oral',
    label: 'Hydromorphone (oral)',
    omePerBaseUnit: 5,
    baseUnit: 'mg',
    unitKind: 'mass',
    units: ['mg', 'mcg'],
    defaultUnit: 'mg',
    nonlinearCaution: false,
    source: 'CDC 2022 MME conversion factor 5.0',
  },
  {
    id: 'hydromorphone_sc',
    label: 'Hydromorphone (SC)',
    // Oral morphine 15 mg ≈ SC hydromorphone 1 mg → OME/mg = 15.
    omePerBaseUnit: 15,
    baseUnit: 'mg',
    unitKind: 'mass',
    units: ['mg', 'mcg'],
    defaultUnit: 'mg',
    nonlinearCaution: false,
    source: 'Scottish Palliative Care Guidelines (oral morphine 15 ≈ SC hydromorphone 1)',
  },
  {
    id: 'codeine_oral',
    label: 'Codeine (oral)',
    omePerBaseUnit: 0.15,
    baseUnit: 'mg',
    unitKind: 'mass',
    units: ['mg', 'mcg'],
    defaultUnit: 'mg',
    nonlinearCaution: false,
    source: 'CDC 2022 MME conversion factor 0.15',
  },
  {
    id: 'tramadol_oral',
    label: 'Tramadol (oral)',
    omePerBaseUnit: 0.2,
    baseUnit: 'mg',
    unitKind: 'mass',
    units: ['mg', 'mcg'],
    defaultUnit: 'mg',
    nonlinearCaution: false,
    source: 'CDC 2022 MME conversion factor 0.2',
  },
  {
    id: 'fentanyl_td',
    label: 'Fentanyl (transdermal)',
    // CDC: MME/day ≈ mcg/h × 2.4. FDA Duragesic tables are one-way (to patch) only for prescribing.
    omePerBaseUnit: 2.4,
    baseUnit: 'mcg_h',
    unitKind: 'rate',
    units: ['mcg_h'],
    defaultUnit: 'mcg_h',
    nonlinearCaution: true,
    source:
      'CDC 2022 fentanyl transdermal factor 2.4 (mcg/h); FDA Duragesic labeling forbids reverse table for dosing',
  },
  {
    id: 'buprenorphine_td',
    label: 'Buprenorphine (transdermal)',
    // Scottish: 5 mcg/h ≈ 12 mg oral morphine/24 h → 2.4 mg OME per mcg/h.
    // CDC 2022 excludes buprenorphine from MME table; FDA Butrans start is categorical.
    omePerBaseUnit: 2.4,
    baseUnit: 'mcg_h',
    unitKind: 'rate',
    units: ['mcg_h'],
    defaultUnit: 'mcg_h',
    nonlinearCaution: true,
    source:
      'Scottish Palliative Care Guidelines (5 mcg/h ≈ 12 mg oral morphine); FDA Butrans categorical start — not linear prescribing',
  },
] as const;

export const UNIT_LABEL: Record<OpioidUnit, string> = {
  mg: 'mg',
  mcg: 'mcg',
  mcg_h: 'mcg/h',
};

export function drugById(id: OpioidDrugId): OpioidDrugMeta {
  const found = OPIOID_DRUGS.find((d) => d.id === id);
  if (!found) throw new Error(`Unknown opioid ${id}`);
  return found;
}

/** Convert a numeric amount between mass units that share the same drug factor base. */
export function convertMassAmount(
  value: number,
  from: OpioidUnit,
  to: OpioidUnit,
): number {
  if (from === to) return value;
  if (from === 'mcg_h' || to === 'mcg_h') {
    throw new Error('Cannot convert mass ↔ rate units.');
  }
  const mcg = from === 'mcg' ? value : value * 1000;
  return to === 'mcg' ? mcg : mcg / 1000;
}

export function toBaseAmount(
  value: number,
  unit: OpioidUnit,
  drug: OpioidDrugMeta,
): number {
  if (drug.unitKind === 'rate') {
    if (unit !== 'mcg_h') throw new Error('Patch doses use mcg/h only.');
    return value;
  }
  return convertMassAmount(value, unit, drug.baseUnit);
}

export function fromBaseAmount(
  baseValue: number,
  unit: OpioidUnit,
  drug: OpioidDrugMeta,
): number {
  if (drug.unitKind === 'rate') {
    if (unit !== 'mcg_h') throw new Error('Patch doses use mcg/h only.');
    return baseValue;
  }
  return convertMassAmount(baseValue, drug.baseUnit, unit);
}
