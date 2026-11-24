/**
 * NIH ODS / National Academies DRI element tables (RDA, AI, CDRR) + UL.
 *
 * Sources (cited; values cross-checked against ODS health-professional fact sheets
 * and National Academies DRI summary tables):
 * - Dietary Reference Intakes for Calcium and Vitamin D (2011) — calcium RDA/AI/UL
 * - Dietary Reference Intakes for Sodium and Potassium (2019) — potassium AI; sodium CDRR
 * - Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate (2005) — chloride AI
 * - Dietary Reference Intakes for Vitamin A, Vitamin K, Arsenic, Boron, Chromium, Copper,
 *   Iodine, Iron, Manganese, Molybdenum, Nickel, Silicon, Vanadium, and Zinc (2001)
 * - Dietary Reference Intakes for Calcium, Phosphorus, Magnesium, Vitamin D, and Fluoride (1997)
 * - Dietary Reference Intakes for Vitamin C, Vitamin E, Selenium, and Carotenoids (2000)
 * - NIH ODS Calcium / Iron fact sheets (RDA/AI/UL tables)
 *
 * Pregnancy and lactation rows are out of screenshot scope (male/female only).
 */

import type { ElementId, MicronutrientSex, RecommendationKind } from './types';

/** NIH life-stage bands with continuous age mapping. */
export type LifeStageId =
  | 'mo0_6'
  | 'mo7_12'
  | 'y1_3'
  | 'y4_8'
  | 'y9_13'
  | 'y14_18'
  | 'y19_30'
  | 'y31_50'
  | 'y51_70'
  | 'y71plus';

export interface LifeStage {
  id: LifeStageId;
  /** Inclusive lower bound in years (0 = birth). */
  minYears: number;
  /** Exclusive upper bound in years (Infinity for open end). */
  maxYearsExclusive: number;
  labelMale: string;
  labelFemale: string;
}

export const LIFE_STAGES: readonly LifeStage[] = [
  {
    id: 'mo0_6',
    minYears: 0,
    maxYearsExclusive: 0.5,
    labelMale: 'males 0–6 mo',
    labelFemale: 'females 0–6 mo',
  },
  {
    id: 'mo7_12',
    minYears: 0.5,
    maxYearsExclusive: 1,
    labelMale: 'males 7–12 mo',
    labelFemale: 'females 7–12 mo',
  },
  {
    id: 'y1_3',
    minYears: 1,
    maxYearsExclusive: 4,
    labelMale: 'males 1–3 y',
    labelFemale: 'females 1–3 y',
  },
  {
    id: 'y4_8',
    minYears: 4,
    maxYearsExclusive: 9,
    labelMale: 'males 4–8 y',
    labelFemale: 'females 4–8 y',
  },
  {
    id: 'y9_13',
    minYears: 9,
    maxYearsExclusive: 14,
    labelMale: 'males 9–13 y',
    labelFemale: 'females 9–13 y',
  },
  {
    id: 'y14_18',
    minYears: 14,
    maxYearsExclusive: 19,
    labelMale: 'males 14–18 y',
    labelFemale: 'females 14–18 y',
  },
  {
    id: 'y19_30',
    minYears: 19,
    maxYearsExclusive: 31,
    labelMale: 'males 19–30 y',
    labelFemale: 'females 19–30 y',
  },
  {
    id: 'y31_50',
    minYears: 31,
    maxYearsExclusive: 51,
    labelMale: 'males 31–50 y',
    labelFemale: 'females 31–50 y',
  },
  {
    id: 'y51_70',
    minYears: 51,
    maxYearsExclusive: 71,
    labelMale: 'males 51–70 y',
    labelFemale: 'females 51–70 y',
  },
  {
    id: 'y71plus',
    minYears: 71,
    maxYearsExclusive: Infinity,
    labelMale: 'males >70 y',
    labelFemale: 'females >70 y',
  },
] as const;

export type UlKind = 'total' | 'supplement' | 'none' | 'nd';

export interface ElementSpec {
  id: ElementId;
  label: string;
  unit: string;
  recommendationKind: RecommendationKind;
  /** Amount by [sex][lifeStage]. */
  values: Record<MicronutrientSex, Record<LifeStageId, number>>;
  /**
   * UL by life stage when published (sex-independent for these elements).
   * null = not established / withdrawn / ND for that band.
   */
  ul: Record<LifeStageId, number | null>;
  ulKind: UlKind;
  ulNote: string | null;
}

const STAGES: LifeStageId[] = [
  'mo0_6',
  'mo7_12',
  'y1_3',
  'y4_8',
  'y9_13',
  'y14_18',
  'y19_30',
  'y31_50',
  'y51_70',
  'y71plus',
];

function both(
  map: Partial<Record<LifeStageId, number>> & Record<string, number>,
): Record<LifeStageId, number> {
  const out = {} as Record<LifeStageId, number>;
  for (const s of STAGES) out[s] = map[s];
  return out;
}

function sexed(
  female: Record<LifeStageId, number>,
  male: Record<LifeStageId, number>,
): Record<MicronutrientSex, Record<LifeStageId, number>> {
  return { female, male };
}

function ulMap(
  map: Partial<Record<LifeStageId, number | null>> & Record<string, number | null>,
): Record<LifeStageId, number | null> {
  const out = {} as Record<LifeStageId, number | null>;
  for (const s of STAGES) out[s] = map[s] ?? null;
  return out;
}

/** Flat UL helper when one adult value covers 19+. */
function ulFlat(parts: {
  mo0_6: number | null;
  mo7_12: number | null;
  y1_3: number | null;
  y4_8: number | null;
  y9_13: number | null;
  y14_18: number | null;
  adult: number | null;
  older?: number | null;
}): Record<LifeStageId, number | null> {
  const older = parts.older ?? parts.adult;
  return ulMap({
    mo0_6: parts.mo0_6,
    mo7_12: parts.mo7_12,
    y1_3: parts.y1_3,
    y4_8: parts.y4_8,
    y9_13: parts.y9_13,
    y14_18: parts.y14_18,
    y19_30: parts.adult,
    y31_50: parts.adult,
    y51_70: older,
    y71plus: older,
  });
}

export const ELEMENT_SPECS: readonly ElementSpec[] = [
  {
    id: 'calcium',
    label: 'Calcium',
    unit: 'mg',
    recommendationKind: 'rda', // infants 0–12 mo are AI — overridden in lookup
    values: sexed(
      both({
        mo0_6: 200,
        mo7_12: 260,
        y1_3: 700,
        y4_8: 1000,
        y9_13: 1300,
        y14_18: 1300,
        y19_30: 1000,
        y31_50: 1000,
        y51_70: 1200,
        y71plus: 1200,
      }),
      both({
        mo0_6: 200,
        mo7_12: 260,
        y1_3: 700,
        y4_8: 1000,
        y9_13: 1300,
        y14_18: 1300,
        y19_30: 1000,
        y31_50: 1000,
        y51_70: 1000,
        y71plus: 1200,
      }),
    ),
    ul: ulMap({
      mo0_6: 1000,
      mo7_12: 1500,
      y1_3: 2500,
      y4_8: 2500,
      y9_13: 3000,
      y14_18: 3000,
      y19_30: 2500,
      y31_50: 2500,
      y51_70: 2000,
      y71plus: 2000,
    }),
    ulKind: 'total',
    ulNote: null,
  },
  {
    id: 'chloride',
    label: 'Chloride',
    unit: 'g',
    recommendationKind: 'ai',
    values: sexed(
      both({
        mo0_6: 0.18,
        mo7_12: 0.57,
        y1_3: 1.5,
        y4_8: 1.9,
        y9_13: 2.3,
        y14_18: 2.3,
        y19_30: 2.3,
        y31_50: 2.3,
        y51_70: 2.0,
        y71plus: 1.8,
      }),
      both({
        mo0_6: 0.18,
        mo7_12: 0.57,
        y1_3: 1.5,
        y4_8: 1.9,
        y9_13: 2.3,
        y14_18: 2.3,
        y19_30: 2.3,
        y31_50: 2.3,
        y51_70: 2.0,
        y71plus: 1.8,
      }),
    ),
    // 2005 electrolyte UL for chloride; kept as published total intake UL.
    ul: ulFlat({
      mo0_6: null,
      mo7_12: null,
      y1_3: 2.3,
      y4_8: 2.9,
      y9_13: 3.4,
      y14_18: 3.6,
      adult: 3.6,
    }),
    ulKind: 'total',
    ulNote: null,
  },
  {
    id: 'chromium',
    label: 'Chromium',
    unit: 'mcg',
    recommendationKind: 'ai',
    values: sexed(
      both({
        mo0_6: 0.2,
        mo7_12: 5.5,
        y1_3: 11,
        y4_8: 15,
        y9_13: 21,
        y14_18: 24,
        y19_30: 25,
        y31_50: 25,
        y51_70: 20,
        y71plus: 20,
      }),
      both({
        mo0_6: 0.2,
        mo7_12: 5.5,
        y1_3: 11,
        y4_8: 15,
        y9_13: 25,
        y14_18: 35,
        y19_30: 35,
        y31_50: 35,
        y51_70: 30,
        y71plus: 30,
      }),
    ),
    ul: ulFlat({
      mo0_6: null,
      mo7_12: null,
      y1_3: null,
      y4_8: null,
      y9_13: null,
      y14_18: null,
      adult: null,
    }),
    ulKind: 'none',
    ulNote: 'No Tolerable Upper Intake Level established for chromium.',
  },
  {
    id: 'copper',
    label: 'Copper',
    unit: 'mcg',
    recommendationKind: 'rda',
    values: sexed(
      both({
        mo0_6: 200,
        mo7_12: 220,
        y1_3: 340,
        y4_8: 440,
        y9_13: 700,
        y14_18: 890,
        y19_30: 900,
        y31_50: 900,
        y51_70: 900,
        y71plus: 900,
      }),
      both({
        mo0_6: 200,
        mo7_12: 220,
        y1_3: 340,
        y4_8: 440,
        y9_13: 700,
        y14_18: 890,
        y19_30: 900,
        y31_50: 900,
        y51_70: 900,
        y71plus: 900,
      }),
    ),
    ul: ulFlat({
      mo0_6: null,
      mo7_12: null,
      y1_3: 1000,
      y4_8: 3000,
      y9_13: 5000,
      y14_18: 8000,
      adult: 10000,
    }),
    ulKind: 'total',
    ulNote: null,
  },
  {
    id: 'fluoride',
    label: 'Fluoride',
    unit: 'mg',
    recommendationKind: 'ai',
    values: sexed(
      both({
        mo0_6: 0.01,
        mo7_12: 0.5,
        y1_3: 0.7,
        y4_8: 1,
        y9_13: 2,
        y14_18: 3,
        y19_30: 3,
        y31_50: 3,
        y51_70: 3,
        y71plus: 3,
      }),
      both({
        mo0_6: 0.01,
        mo7_12: 0.5,
        y1_3: 0.7,
        y4_8: 1,
        y9_13: 2,
        y14_18: 3,
        y19_30: 4,
        y31_50: 4,
        y51_70: 4,
        y71plus: 4,
      }),
    ),
    ul: ulFlat({
      mo0_6: 0.7,
      mo7_12: 0.9,
      y1_3: 1.3,
      y4_8: 2.2,
      y9_13: 10,
      y14_18: 10,
      adult: 10,
    }),
    ulKind: 'total',
    ulNote: null,
  },
  {
    id: 'iodine',
    label: 'Iodine',
    unit: 'mcg',
    recommendationKind: 'rda',
    values: sexed(
      both({
        mo0_6: 110,
        mo7_12: 130,
        y1_3: 90,
        y4_8: 90,
        y9_13: 120,
        y14_18: 150,
        y19_30: 150,
        y31_50: 150,
        y51_70: 150,
        y71plus: 150,
      }),
      both({
        mo0_6: 110,
        mo7_12: 130,
        y1_3: 90,
        y4_8: 90,
        y9_13: 120,
        y14_18: 150,
        y19_30: 150,
        y31_50: 150,
        y51_70: 150,
        y71plus: 150,
      }),
    ),
    ul: ulFlat({
      mo0_6: null,
      mo7_12: null,
      y1_3: 200,
      y4_8: 300,
      y9_13: 600,
      y14_18: 900,
      adult: 1100,
    }),
    ulKind: 'total',
    ulNote: null,
  },
  {
    id: 'iron',
    label: 'Iron',
    unit: 'mg',
    recommendationKind: 'rda', // 0–6 mo AI — overridden in lookup
    values: sexed(
      both({
        mo0_6: 0.27,
        mo7_12: 11,
        y1_3: 7,
        y4_8: 10,
        y9_13: 8,
        y14_18: 15,
        y19_30: 18,
        y31_50: 18,
        y51_70: 8,
        y71plus: 8,
      }),
      both({
        mo0_6: 0.27,
        mo7_12: 11,
        y1_3: 7,
        y4_8: 10,
        y9_13: 8,
        y14_18: 11,
        y19_30: 8,
        y31_50: 8,
        y51_70: 8,
        y71plus: 8,
      }),
    ),
    ul: ulFlat({
      mo0_6: 40,
      mo7_12: 40,
      y1_3: 40,
      y4_8: 40,
      y9_13: 40,
      y14_18: 45,
      adult: 45,
    }),
    ulKind: 'total',
    ulNote: null,
  },
  {
    id: 'magnesium',
    label: 'Magnesium',
    unit: 'mg',
    recommendationKind: 'rda', // infants AI — overridden
    values: sexed(
      both({
        mo0_6: 30,
        mo7_12: 75,
        y1_3: 80,
        y4_8: 130,
        y9_13: 240,
        y14_18: 360,
        y19_30: 310,
        y31_50: 320,
        y51_70: 320,
        y71plus: 320,
      }),
      both({
        mo0_6: 30,
        mo7_12: 75,
        y1_3: 80,
        y4_8: 130,
        y9_13: 240,
        y14_18: 410,
        y19_30: 400,
        y31_50: 420,
        y51_70: 420,
        y71plus: 420,
      }),
    ),
    // Magnesium UL is from supplemental/pharmacological sources only (not food).
    ul: ulFlat({
      mo0_6: null,
      mo7_12: null,
      y1_3: 65,
      y4_8: 110,
      y9_13: 350,
      y14_18: 350,
      adult: 350,
    }),
    ulKind: 'supplement',
    ulNote:
      'Magnesium UL applies to supplemental / pharmacological magnesium in addition to food (National Academies).',
  },
  {
    id: 'manganese',
    label: 'Manganese',
    unit: 'mg',
    recommendationKind: 'ai',
    values: sexed(
      both({
        mo0_6: 0.003,
        mo7_12: 0.6,
        y1_3: 1.2,
        y4_8: 1.5,
        y9_13: 1.6,
        y14_18: 1.6,
        y19_30: 1.8,
        y31_50: 1.8,
        y51_70: 1.8,
        y71plus: 1.8,
      }),
      both({
        mo0_6: 0.003,
        mo7_12: 0.6,
        y1_3: 1.2,
        y4_8: 1.5,
        y9_13: 1.9,
        y14_18: 2.2,
        y19_30: 2.3,
        y31_50: 2.3,
        y51_70: 2.3,
        y71plus: 2.3,
      }),
    ),
    ul: ulFlat({
      mo0_6: null,
      mo7_12: null,
      y1_3: 2,
      y4_8: 3,
      y9_13: 6,
      y14_18: 9,
      adult: 11,
    }),
    ulKind: 'total',
    ulNote: null,
  },
  {
    id: 'molybdenum',
    label: 'Molybdenum',
    unit: 'mcg',
    recommendationKind: 'rda',
    values: sexed(
      both({
        mo0_6: 2,
        mo7_12: 3,
        y1_3: 17,
        y4_8: 22,
        y9_13: 34,
        y14_18: 43,
        y19_30: 45,
        y31_50: 45,
        y51_70: 45,
        y71plus: 45,
      }),
      both({
        mo0_6: 2,
        mo7_12: 3,
        y1_3: 17,
        y4_8: 22,
        y9_13: 34,
        y14_18: 43,
        y19_30: 45,
        y31_50: 45,
        y51_70: 45,
        y71plus: 45,
      }),
    ),
    ul: ulFlat({
      mo0_6: null,
      mo7_12: null,
      y1_3: 300,
      y4_8: 600,
      y9_13: 1100,
      y14_18: 1700,
      adult: 2000,
    }),
    ulKind: 'total',
    ulNote: null,
  },
  {
    id: 'phosphorus',
    label: 'Phosphorus',
    unit: 'mg',
    recommendationKind: 'rda',
    values: sexed(
      both({
        mo0_6: 100,
        mo7_12: 275,
        y1_3: 460,
        y4_8: 500,
        y9_13: 1250,
        y14_18: 1250,
        y19_30: 700,
        y31_50: 700,
        y51_70: 700,
        y71plus: 700,
      }),
      both({
        mo0_6: 100,
        mo7_12: 275,
        y1_3: 460,
        y4_8: 500,
        y9_13: 1250,
        y14_18: 1250,
        y19_30: 700,
        y31_50: 700,
        y51_70: 700,
        y71plus: 700,
      }),
    ),
    ul: ulMap({
      mo0_6: null,
      mo7_12: null,
      y1_3: 3000,
      y4_8: 3000,
      y9_13: 4000,
      y14_18: 4000,
      y19_30: 4000,
      y31_50: 4000,
      y51_70: 4000,
      y71plus: 3000,
    }),
    ulKind: 'total',
    ulNote: null,
  },
  {
    id: 'potassium',
    label: 'Potassium',
    unit: 'mg',
    recommendationKind: 'ai',
    // 2019 National Academies potassium AI (replaces earlier 4,700 mg adult AI).
    values: sexed(
      both({
        mo0_6: 400,
        mo7_12: 860,
        y1_3: 2000,
        y4_8: 2300,
        y9_13: 2300,
        y14_18: 2300,
        y19_30: 2600,
        y31_50: 2600,
        y51_70: 2600,
        y71plus: 2600,
      }),
      both({
        mo0_6: 400,
        mo7_12: 860,
        y1_3: 2000,
        y4_8: 2300,
        y9_13: 2500,
        y14_18: 3000,
        y19_30: 3400,
        y31_50: 3400,
        y51_70: 3400,
        y71plus: 3400,
      }),
    ),
    ul: ulFlat({
      mo0_6: null,
      mo7_12: null,
      y1_3: null,
      y4_8: null,
      y9_13: null,
      y14_18: null,
      adult: null,
    }),
    ulKind: 'none',
    ulNote:
      'No Tolerable Upper Intake Level for potassium in the 2019 National Academies DRI update.',
  },
  {
    id: 'selenium',
    label: 'Selenium',
    unit: 'mcg',
    recommendationKind: 'rda',
    values: sexed(
      both({
        mo0_6: 15,
        mo7_12: 20,
        y1_3: 20,
        y4_8: 30,
        y9_13: 40,
        y14_18: 55,
        y19_30: 55,
        y31_50: 55,
        y51_70: 55,
        y71plus: 55,
      }),
      both({
        mo0_6: 15,
        mo7_12: 20,
        y1_3: 20,
        y4_8: 30,
        y9_13: 40,
        y14_18: 55,
        y19_30: 55,
        y31_50: 55,
        y51_70: 55,
        y71plus: 55,
      }),
    ),
    ul: ulFlat({
      mo0_6: 45,
      mo7_12: 60,
      y1_3: 90,
      y4_8: 150,
      y9_13: 280,
      y14_18: 400,
      adult: 400,
    }),
    ulKind: 'total',
    ulNote: null,
  },
  {
    id: 'sodium',
    label: 'Sodium',
    unit: 'mg',
    recommendationKind: 'cdrr',
    // 2019 CDRR for ages ≥14 y; younger bands use AI values published alongside CDRR framing.
    values: sexed(
      both({
        mo0_6: 110,
        mo7_12: 370,
        y1_3: 1200,
        y4_8: 1500,
        y9_13: 1800,
        y14_18: 2300,
        y19_30: 2300,
        y31_50: 2300,
        y51_70: 2300,
        y71plus: 2300,
      }),
      both({
        mo0_6: 110,
        mo7_12: 370,
        y1_3: 1200,
        y4_8: 1500,
        y9_13: 1800,
        y14_18: 2300,
        y19_30: 2300,
        y31_50: 2300,
        y51_70: 2300,
        y71plus: 2300,
      }),
    ),
    ul: ulFlat({
      mo0_6: null,
      mo7_12: null,
      y1_3: null,
      y4_8: null,
      y9_13: null,
      y14_18: null,
      adult: null,
    }),
    ulKind: 'none',
    ulNote:
      '2019 DRI uses Chronic Disease Risk Reduction (CDRR) intake for sodium; classic UL was withdrawn.',
  },
  {
    id: 'zinc',
    label: 'Zinc',
    unit: 'mg',
    recommendationKind: 'rda',
    values: sexed(
      both({
        mo0_6: 2,
        mo7_12: 3,
        y1_3: 3,
        y4_8: 5,
        y9_13: 8,
        y14_18: 9,
        y19_30: 8,
        y31_50: 8,
        y51_70: 8,
        y71plus: 8,
      }),
      both({
        mo0_6: 2,
        mo7_12: 3,
        y1_3: 3,
        y4_8: 5,
        y9_13: 8,
        y14_18: 11,
        y19_30: 11,
        y31_50: 11,
        y51_70: 11,
        y71plus: 11,
      }),
    ),
    ul: ulFlat({
      mo0_6: 4,
      mo7_12: 5,
      y1_3: 7,
      y4_8: 12,
      y9_13: 23,
      y14_18: 34,
      adult: 40,
    }),
    ulKind: 'total',
    ulNote: null,
  },
];

/**
 * Infant bands use AI for several minerals even when older ages have an RDA.
 * Sodium ≥14 y uses CDRR; younger sodium values are AI (2019 DRI).
 */
export function recommendationKindFor(
  spec: ElementSpec,
  stage: LifeStageId,
): RecommendationKind {
  if (spec.id === 'sodium') {
    if (
      stage === 'mo0_6' ||
      stage === 'mo7_12' ||
      stage === 'y1_3' ||
      stage === 'y4_8' ||
      stage === 'y9_13'
    ) {
      return 'ai';
    }
    return 'cdrr';
  }

  const infantAi =
    spec.id === 'calcium' ||
    spec.id === 'magnesium' ||
    spec.id === 'phosphorus' ||
    spec.id === 'copper' ||
    spec.id === 'iodine' ||
    spec.id === 'molybdenum' ||
    spec.id === 'selenium' ||
    spec.id === 'iron' ||
    spec.id === 'zinc';

  if (infantAi && (stage === 'mo0_6' || stage === 'mo7_12')) {
    // Iron and zinc establish RDA from 7–12 months; 0–6 months remain AI.
    if ((spec.id === 'iron' || spec.id === 'zinc') && stage === 'mo7_12') {
      return 'rda';
    }
    return 'ai';
  }

  return spec.recommendationKind;
}

export function resolveLifeStage(ageYears: number): LifeStage | null {
  if (!(ageYears >= 0) || !Number.isFinite(ageYears)) return null;
  for (const stage of LIFE_STAGES) {
    if (ageYears >= stage.minYears && ageYears < stage.maxYearsExclusive) {
      return stage;
    }
  }
  return null;
}

export function getElementSpec(id: ElementId): ElementSpec | undefined {
  return ELEMENT_SPECS.find((s) => s.id === id);
}
