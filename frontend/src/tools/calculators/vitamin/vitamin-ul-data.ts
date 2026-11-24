/**
 * NIH ODS / National Academies Tolerable Upper Intake Levels for vitamins.
 *
 * Recommendation (RDA/AI) amounts come from `dri/dri-data` DRI_NUTRIENTS — not duplicated here.
 * UL values only, keyed by the shared DriAgeBand used by that table.
 *
 * Sources:
 * - Food and Nutrition Board UL tables for vitamins (NAP / NIH ODS summaries)
 * - Dietary Reference Intakes for Calcium and Vitamin D (2011) — updated vitamin D ULs
 * - ODS fact sheets (preformed vitamin A; supplemental α-tocopherol / niacin / folate notes)
 *
 * ND = not determinable for infants where published; null = no UL established for that nutrient.
 */

import type { DriAgeBand } from '../dri/types';
import type { VitaminId } from './types';

export type UlKind = 'total' | 'preformed' | 'supplement' | 'none' | 'nd';

export interface VitaminUlSpec {
  id: VitaminId;
  /** UL by DriAgeBand in the same unit as the DRI recommendation row. */
  ul: Record<DriAgeBand, number | null>;
  ulKind: UlKind;
  ulNote: string | null;
}

const BANDS: DriAgeBand[] = [
  'birth_6mo',
  'mo7_12',
  'y1_3',
  'y4_8',
  'y9_13',
  'y14_18',
  'y19_50',
  'y51_70',
  'y71plus',
];

function ulMap(
  map: Partial<Record<DriAgeBand, number | null>> & Record<string, number | null>,
): Record<DriAgeBand, number | null> {
  const out = {} as Record<DriAgeBand, number | null>;
  for (const b of BANDS) out[b] = map[b] ?? null;
  return out;
}

/** Flat helper when one adult value covers 19+. */
function ulFlat(parts: {
  birth_6mo: number | null;
  mo7_12: number | null;
  y1_3: number | null;
  y4_8: number | null;
  y9_13: number | null;
  y14_18: number | null;
  adult: number | null;
}): Record<DriAgeBand, number | null> {
  return ulMap({
    birth_6mo: parts.birth_6mo,
    mo7_12: parts.mo7_12,
    y1_3: parts.y1_3,
    y4_8: parts.y4_8,
    y9_13: parts.y9_13,
    y14_18: parts.y14_18,
    y19_50: parts.adult,
    y51_70: parts.adult,
    y71plus: parts.adult,
  });
}

const NO_UL = ulFlat({
  birth_6mo: null,
  mo7_12: null,
  y1_3: null,
  y4_8: null,
  y9_13: null,
  y14_18: null,
  adult: null,
});

export const VITAMIN_UL_SPECS: readonly VitaminUlSpec[] = [
  {
    id: 'vit_a',
    // mcg RAE as preformed vitamin A only (retinol).
    ul: ulFlat({
      birth_6mo: 600,
      mo7_12: 600,
      y1_3: 600,
      y4_8: 900,
      y9_13: 1700,
      y14_18: 2800,
      adult: 3000,
    }),
    ulKind: 'preformed',
    ulNote: 'UL applies to preformed vitamin A (retinol) only — not β-carotene provitamin A.',
  },
  {
    id: 'vit_c',
    ul: ulFlat({
      birth_6mo: null, // ND
      mo7_12: null,
      y1_3: 400,
      y4_8: 650,
      y9_13: 1200,
      y14_18: 1800,
      adult: 2000,
    }),
    ulKind: 'total',
    ulNote: null,
  },
  {
    id: 'vit_d',
    // 2011 Calcium & Vitamin D report (ODS) — mcg.
    ul: ulFlat({
      birth_6mo: 25,
      mo7_12: 38,
      y1_3: 63,
      y4_8: 75,
      y9_13: 100,
      y14_18: 100,
      adult: 100,
    }),
    ulKind: 'total',
    ulNote: null,
  },
  {
    id: 'vit_e',
    // mg α-tocopherol; supplemental forms only.
    ul: ulFlat({
      birth_6mo: null,
      mo7_12: null,
      y1_3: 200,
      y4_8: 300,
      y9_13: 600,
      y14_18: 800,
      adult: 1000,
    }),
    ulKind: 'supplement',
    ulNote:
      'UL applies to any form of supplemental α-tocopherol (not naturally occurring food vitamin E alone).',
  },
  {
    id: 'vit_k',
    ul: NO_UL,
    ulKind: 'none',
    ulNote: null,
  },
  {
    id: 'vit_b1',
    ul: NO_UL,
    ulKind: 'none',
    ulNote: null,
  },
  {
    id: 'vit_b2',
    ul: NO_UL,
    ulKind: 'none',
    ulNote: null,
  },
  {
    id: 'vit_b3',
    // mg niacin; synthetic / supplemental forms.
    ul: ulFlat({
      birth_6mo: null,
      mo7_12: null,
      y1_3: 10,
      y4_8: 15,
      y9_13: 20,
      y14_18: 30,
      adult: 35,
    }),
    ulKind: 'supplement',
    ulNote:
      'UL applies to nicotinic acid and nicotinamide from supplements and fortified foods, not niacin naturally in food.',
  },
  {
    id: 'vit_b5',
    ul: NO_UL,
    ulKind: 'none',
    ulNote: null,
  },
  {
    id: 'vit_b6',
    ul: ulFlat({
      birth_6mo: null,
      mo7_12: null,
      y1_3: 30,
      y4_8: 40,
      y9_13: 60,
      y14_18: 80,
      adult: 100,
    }),
    ulKind: 'total',
    ulNote: null,
  },
  {
    id: 'biotin',
    ul: NO_UL,
    ulKind: 'none',
    ulNote: null,
  },
  {
    id: 'vit_b9',
    // mcg DFE from synthetic folic acid / fortified foods.
    ul: ulFlat({
      birth_6mo: null,
      mo7_12: null,
      y1_3: 300,
      y4_8: 400,
      y9_13: 600,
      y14_18: 800,
      adult: 1000,
    }),
    ulKind: 'supplement',
    ulNote:
      'UL applies to synthetic folic acid from supplements and fortified foods, not food folate alone.',
  },
  {
    id: 'vit_b12',
    ul: NO_UL,
    ulKind: 'none',
    ulNote: null,
  },
  {
    id: 'choline',
    // Published UL in g/d → stored as mg to match DRI_NUTRIENTS choline unit.
    ul: ulFlat({
      birth_6mo: null,
      mo7_12: null,
      y1_3: 1000,
      y4_8: 1000,
      y9_13: 2000,
      y14_18: 3000,
      adult: 3500,
    }),
    ulKind: 'total',
    ulNote: null,
  },
];

export function getVitaminUlSpec(id: VitaminId): VitaminUlSpec | undefined {
  return VITAMIN_UL_SPECS.find((s) => s.id === id);
}
