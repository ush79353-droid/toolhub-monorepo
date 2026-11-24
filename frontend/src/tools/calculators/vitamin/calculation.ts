/**
 * Vitamin Calculator — pure engine (ADR-018).
 *
 * Maps chronological age + sex + vitamin → National Academies / NIH ODS
 * RDA or AI from shared `dri/dri-data` DRI_NUTRIENTS (vitamin rows only),
 * plus Tolerable Upper Intake Level when published (vitamin-ul-data.ts).
 * No FX. No IU↔mcg conversion (Vitamin A converter is separate). Educational only.
 */

import { DRI_NUTRIENTS, type NutrientSpec } from '../dri/dri-data';
import type { DriAgeBand } from '../dri/types';
import { getVitaminUlSpec } from './vitamin-ul-data';
import type {
  RecommendationKind,
  VitaminId,
  VitaminInput,
  VitaminResult,
  VitaminSex,
} from './types';
import { VITAMIN_OPTIONS } from './types';

export const SOURCE_NOTE =
  'Food and Nutrition Board, National Academies / NIH Office of Dietary Supplements Dietary Reference Intakes (RDA/AI) from the shared DRI vitamin table, plus Tolerable Upper Intake Levels for vitamins (including 2011 vitamin D UL update). Educational lookup only.';

export const DISCLAIMER =
  'Educational nutrition reference only — not a clinical diet prescription, diagnosis, or substitute for a registered dietitian or physician.';

/** Continuous age (years) → shared DriAgeBand used by DRI_NUTRIENTS. */
const AGE_BANDS: readonly {
  id: DriAgeBand;
  minYears: number;
  maxYearsExclusive: number;
  labelMale: string;
  labelFemale: string;
}[] = [
  {
    id: 'birth_6mo',
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
    id: 'y19_50',
    minYears: 19,
    maxYearsExclusive: 51,
    labelMale: 'males 19–50 y',
    labelFemale: 'females 19–50 y',
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
];

const VITAMIN_ID_SET = new Set<string>(VITAMIN_OPTIONS.map((o) => o.id));

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Convert age field to years (months ÷ 12). */
export function ageToYears(value: number, unit: VitaminInput['ageUnit']): number {
  return unit === 'years' ? value : value / 12;
}

export function resolveDriAgeBand(ageYears: number): (typeof AGE_BANDS)[number] | null {
  if (!(ageYears >= 0) || !Number.isFinite(ageYears)) return null;
  for (const band of AGE_BANDS) {
    if (ageYears >= band.minYears && ageYears < band.maxYearsExclusive) {
      return band;
    }
  }
  return null;
}

export function getVitaminNutrient(id: VitaminId | string): NutrientSpec | undefined {
  if (!VITAMIN_ID_SET.has(id)) return undefined;
  return DRI_NUTRIENTS.find((n) => n.id === id);
}

export function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Number.isInteger(value)) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  if (value >= 10) {
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    });
  }
  const decimals = value < 0.01 ? 3 : value < 1 ? 2 : 1;
  return value.toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

function kindPhrase(kind: RecommendationKind): string {
  if (kind === 'rda') return 'Recommended Dietary Allowance (RDA)';
  return 'Adequate Intake (AI)';
}

function optionFor(id: VitaminId) {
  return VITAMIN_OPTIONS.find((o) => o.id === id);
}

function bandHasPublishedUl(ul: Record<DriAgeBand, number | null>): boolean {
  for (const v of Object.values(ul)) {
    if (v != null) return true;
  }
  return false;
}

function emptyResult(
  input: VitaminInput,
  partial?: Partial<VitaminResult>,
): VitaminResult {
  const opt = optionFor(input.vitaminId);
  const spec = getVitaminNutrient(input.vitaminId);
  return {
    vitaminId: input.vitaminId,
    vitaminLabel: opt?.label ?? spec?.label ?? input.vitaminId,
    vitaminShortLabel: opt?.shortLabel ?? input.vitaminId,
    populationLabel: '',
    recommendationKind: null,
    recommendationAmount: null,
    recommendationDisplay: '',
    unit: spec?.unit ?? '',
    ulAmount: null,
    ulDisplay: '',
    ulNote: null,
    statusHeadline: 'Enter age',
    statusDetail:
      'Provide age (and keep sex/vitamin selected) to look up the age- and sex-specific RDA or AI and any published Tolerable Upper Intake Level for that vitamin.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateVitamin(input: VitaminInput): VitaminResult {
  const spec = getVitaminNutrient(input.vitaminId);
  if (!spec) {
    return emptyResult(input, {
      statusHeadline: 'Unknown vitamin',
      statusDetail: 'Select a published vitamin from the list.',
    });
  }

  const ageRaw = parseNumber(input.ageText);
  if (ageRaw === null) {
    return emptyResult(input);
  }
  if (!(ageRaw > 0)) {
    return emptyResult(input, {
      statusHeadline: 'Invalid age',
      statusDetail: 'Age must be a positive number.',
    });
  }

  const ageYears = ageToYears(ageRaw, input.ageUnit);
  if (!(ageYears >= 0) || ageYears > 120) {
    return emptyResult(input, {
      statusHeadline: 'Invalid age',
      statusDetail: 'Age must be between birth and 120 years.',
    });
  }

  const band = resolveDriAgeBand(ageYears);
  if (!band) {
    return emptyResult(input, {
      statusHeadline: 'Age out of range',
      statusDetail: 'No DRI life-stage band matches that age.',
    });
  }

  const sex: VitaminSex = input.sex;
  const amount = spec.values[sex][band.id];
  const kind: RecommendationKind = spec.kind === 'ai' ? 'ai' : 'rda';
  const populationLabel = sex === 'male' ? band.labelMale : band.labelFemale;

  const ulSpec = getVitaminUlSpec(input.vitaminId);
  const ulAmount = ulSpec?.ul[band.id] ?? null;
  let ulDisplay = 'Not established';
  let ulNote = ulSpec?.ulNote ?? null;
  if (ulAmount != null) {
    ulDisplay = formatAmount(ulAmount);
  } else if (ulSpec && ulSpec.ulKind !== 'none' && bandHasPublishedUl(ulSpec.ul)) {
    ulDisplay = 'Not determinable (ND)';
    if (!ulNote) {
      ulNote =
        'UL not determinable for this life stage; food should be the only source to avoid excess.';
    }
  }

  const opt = optionFor(input.vitaminId);

  return {
    vitaminId: input.vitaminId,
    vitaminLabel: opt?.label ?? spec.label,
    vitaminShortLabel: opt?.shortLabel ?? spec.label,
    populationLabel,
    recommendationKind: kind,
    recommendationAmount: amount,
    recommendationDisplay: formatAmount(amount),
    unit: spec.unit,
    ulAmount,
    ulDisplay,
    ulNote,
    statusHeadline: `${spec.label} ${kind.toUpperCase()}`,
    statusDetail: `${kindPhrase(kind)} for ${populationLabel}. UL is shown separately as a safety ceiling, not a target.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
