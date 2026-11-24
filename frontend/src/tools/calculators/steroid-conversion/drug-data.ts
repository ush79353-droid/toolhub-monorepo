/**
 * Systemic glucocorticoid anti-inflammatory equivalence table (educational).
 *
 * Equivalent dose (mg) values are published teaching anchors for systemic
 * (oral / parenteral) use — not topical, inhaled, or intra-articular routes.
 *
 * Sources (do not invent factors):
 * - BNF / NICE CKS oral corticosteroids — equivalent anti-inflammatory doses
 *   relative to prednisolone 5 mg (betamethasone 0.75, dexamethasone 0.75,
 *   hydrocortisone 20, methylprednisolone 4, prednisone 5, triamcinolone 4).
 * - Cortisone 25 mg and prednisolone 5 mg — standard systemic glucocorticoid
 *   comparison tables (e.g. Endotext adrenal-suppression table; Medscape /
 *   Drug Facts–aligned summaries).
 *
 * Duration bands match common short / intermediate / long teaching groupings
 * (≈8–12 h / 12–36 h / 36–54 h biologic half-life framing).
 */

export type SteroidDrugId =
  | 'hydrocortisone'
  | 'cortisone'
  | 'prednisone'
  | 'prednisolone'
  | 'triamcinolone'
  | 'methylprednisolone'
  | 'dexamethasone'
  | 'betamethasone';

export type DurationGroup = 'short' | 'intermediate' | 'long';

export interface SteroidDrugMeta {
  id: SteroidDrugId;
  label: string;
  durationGroup: DurationGroup;
  /**
   * Published anti-inflammatory equivalent dose in mg (same row as classic
   * “equivalent dose” tables anchored near prednisone/prednisolone 5 mg).
   */
  equivalentDoseMg: number;
  /** Short tooltip for the label info control. */
  tooltip: string;
  source: string;
}

export const STEROID_DRUGS: readonly SteroidDrugMeta[] = [
  {
    id: 'hydrocortisone',
    label: 'Hydrocortisone',
    durationGroup: 'short',
    equivalentDoseMg: 20,
    tooltip:
      'Short-acting systemic glucocorticoid. Equivalent dose 20 mg (BNF/NICE anti-inflammatory table).',
    source: 'BNF / NICE CKS equivalent anti-inflammatory doses',
  },
  {
    id: 'cortisone',
    label: 'Cortisone',
    durationGroup: 'short',
    equivalentDoseMg: 25,
    tooltip:
      'Short-acting. Equivalent dose 25 mg (Endotext / Medscape-aligned systemic table). Requires hepatic activation.',
    source: 'Endotext / Medscape-aligned systemic glucocorticoid table',
  },
  {
    id: 'prednisone',
    label: 'Prednisone',
    durationGroup: 'intermediate',
    equivalentDoseMg: 5,
    tooltip:
      'Intermediate-acting. Equivalent dose 5 mg (BNF/NICE; common prednisone-equivalent anchor).',
    source: 'BNF / NICE CKS equivalent anti-inflammatory doses',
  },
  {
    id: 'prednisolone',
    label: 'Prednisolone',
    durationGroup: 'intermediate',
    equivalentDoseMg: 5,
    tooltip:
      'Intermediate-acting. Equivalent dose 5 mg (standard systemic tables; BNF prednisolone reference).',
    source: 'BNF / NICE CKS (prednisolone reference) + systemic tables',
  },
  {
    id: 'triamcinolone',
    label: 'Triamcinolone',
    durationGroup: 'intermediate',
    equivalentDoseMg: 4,
    tooltip:
      'Intermediate-acting. Equivalent dose 4 mg (BNF/NICE). Systemic table only—not intra-articular.',
    source: 'BNF / NICE CKS equivalent anti-inflammatory doses',
  },
  {
    id: 'methylprednisolone',
    label: 'Methylprednisolone',
    durationGroup: 'intermediate',
    equivalentDoseMg: 4,
    tooltip:
      'Intermediate-acting. Equivalent dose 4 mg (BNF/NICE).',
    source: 'BNF / NICE CKS equivalent anti-inflammatory doses',
  },
  {
    id: 'dexamethasone',
    label: 'Dexamethasone',
    durationGroup: 'long',
    equivalentDoseMg: 0.75,
    tooltip:
      'Long-acting. Equivalent dose 0.75 mg (BNF/NICE). Minimal mineralocorticoid activity.',
    source: 'BNF / NICE CKS equivalent anti-inflammatory doses',
  },
  {
    id: 'betamethasone',
    label: 'Betamethasone',
    durationGroup: 'long',
    equivalentDoseMg: 0.75,
    tooltip:
      'Long-acting. Equivalent dose 0.75 mg (BNF/NICE). Systemic oral/parenteral framing only.',
    source: 'BNF / NICE CKS equivalent anti-inflammatory doses',
  },
] as const;

export const DURATION_GROUP_LABEL: Record<DurationGroup, string> = {
  short: 'Short-acting (8-12 hours)',
  intermediate: 'Intermediate acting (12-36 hours)',
  long: 'Long-acting (36-54 hours)',
};

export const DURATION_GROUP_ORDER: readonly DurationGroup[] = [
  'short',
  'intermediate',
  'long',
];

export function drugById(id: SteroidDrugId): SteroidDrugMeta {
  const found = STEROID_DRUGS.find((d) => d.id === id);
  if (!found) throw new Error(`Unknown steroid ${id}`);
  return found;
}
