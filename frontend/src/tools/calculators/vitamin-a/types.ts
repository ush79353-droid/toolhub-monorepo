/**
 * Vitamin A Calculator — NIH ODS RAE / IU worksheet (ADR-023 screenshot-first).
 * Factors and RDA table: https://ods.od.nih.gov/factsheets/VitaminA-HealthProfessional/
 */

export type VitaminASex = 'female' | 'male';

/** NIH ODS Table 1 life-stage bands (pregnancy/lactation omitted — not on screenshot). */
export type VitaminAAgeBand =
  | 'birth_6mo'
  | 'mo7_12'
  | 'y1_3'
  | 'y4_8'
  | 'y9_13'
  | 'y14_18'
  | 'y19_50'
  | 'y51plus';

export type VitaminASourceId =
  | 'retinol'
  | 'dietaryBetaCarotene'
  | 'supplementalBetaCarotene'
  | 'dietaryOtherCarotenoids';

/** Which side of a source pair the user last edited. */
export type VitaminAPairSource = 'iu' | 'rae';

export interface VitaminASourceDraft {
  iuText: string;
  raeText: string;
  lastEdited: VitaminAPairSource;
}

export interface VitaminAInput {
  sex: VitaminASex;
  ageBand: VitaminAAgeBand;
  sources: Record<VitaminASourceId, VitaminASourceDraft>;
}

export interface VitaminASourceResult {
  id: VitaminASourceId;
  label: string;
  iu: number;
  raeMcg: number;
  mcgPerIu: number;
  factorNote: string;
}

export interface VitaminAResult {
  sex: VitaminASex;
  ageBand: VitaminAAgeBand;
  ageBandLabel: string;
  rdaMcgRae: number;
  rdaKind: 'rda' | 'ai';
  rdaLabel: string;
  sources: readonly VitaminASourceResult[];
  totalRaeMcg: number;
  vsRdaPercent: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type VitaminAFieldErrors = {
  ageBand?: string;
  retinolIu?: string;
  retinolRae?: string;
  dietaryBetaCaroteneIu?: string;
  dietaryBetaCaroteneRae?: string;
  supplementalBetaCaroteneIu?: string;
  supplementalBetaCaroteneRae?: string;
  dietaryOtherCarotenoidsIu?: string;
  dietaryOtherCarotenoidsRae?: string;
};

export interface VitaminASourceOption {
  id: VitaminASourceId;
  label: string;
  shortLabel: string;
  /** mcg RAE per 1 IU — NIH ODS only. */
  mcgPerIu: number;
  factorNote: string;
  /** mcg-to-iu registry key for factor parity checks. */
  mcgIuSubstance:
    | 'vitaminARetinol'
    | 'vitaminADietaryBetaCarotene'
    | 'vitaminASuppBetaCarotene'
    | 'vitaminADietaryOtherCarotenoids';
}

export const AGE_BAND_OPTIONS: readonly { id: VitaminAAgeBand; label: string }[] = [
  { id: 'birth_6mo', label: 'Birth to 6 months' },
  { id: 'mo7_12', label: '7–12 months' },
  { id: 'y1_3', label: '1–3 years' },
  { id: 'y4_8', label: '4–8 years' },
  { id: 'y9_13', label: '9–13 years' },
  { id: 'y14_18', label: '14–18 years' },
  { id: 'y19_50', label: '19–50 years' },
  { id: 'y51plus', label: '51+ years' },
] as const;

export const SOURCE_OPTIONS: readonly VitaminASourceOption[] = [
  {
    id: 'retinol',
    label: 'Retinol (animal source)',
    shortLabel: 'Retinol',
    mcgPerIu: 0.3,
    factorNote: 'NIH ODS: 1 IU retinol = 0.3 mcg RAE.',
    mcgIuSubstance: 'vitaminARetinol',
  },
  {
    id: 'dietaryBetaCarotene',
    label: 'Dietary beta-carotene from food (plant source)',
    shortLabel: 'Dietary β-carotene',
    mcgPerIu: 0.05,
    factorNote: 'NIH ODS: 1 IU dietary β-carotene = 0.05 mcg RAE.',
    mcgIuSubstance: 'vitaminADietaryBetaCarotene',
  },
  {
    id: 'supplementalBetaCarotene',
    label: 'Supplemental beta-carotene',
    shortLabel: 'Supplemental β-carotene',
    mcgPerIu: 0.3,
    factorNote: 'NIH ODS: 1 IU supplemental β-carotene = 0.3 mcg RAE.',
    mcgIuSubstance: 'vitaminASuppBetaCarotene',
  },
  {
    id: 'dietaryOtherCarotenoids',
    label: 'Dietary alpha-carotene and/or beta-cryptoxanthin (plant source)',
    shortLabel: 'Dietary α-carotene / β-cryptoxanthin',
    mcgPerIu: 0.025,
    factorNote: 'NIH ODS: 1 IU dietary α-carotene or β-cryptoxanthin = 0.025 mcg RAE.',
    mcgIuSubstance: 'vitaminADietaryOtherCarotenoids',
  },
] as const;

export const SOURCE_IDS: readonly VitaminASourceId[] = SOURCE_OPTIONS.map((s) => s.id);

export const MAX_ABS_VALUE = 1e15;

export const DISCLAIMER =
  'Always double-check the calculations, the dosing information, and the contraindications on the leaflet. Consult your health provider before administering any medication or supplements. This tool cannot replace real medical consultation.';

function zeroDraft(): VitaminASourceDraft {
  return { iuText: '0', raeText: '0', lastEdited: 'iu' };
}

/** Screenshot: Female selected; IU/RAE pairs start at zero; adult age band for RDA context. */
export function createDefaultInput(): VitaminAInput {
  return {
    sex: 'female',
    ageBand: 'y19_50',
    sources: {
      retinol: zeroDraft(),
      dietaryBetaCarotene: zeroDraft(),
      supplementalBetaCarotene: zeroDraft(),
      dietaryOtherCarotenoids: zeroDraft(),
    },
  };
}

export function createEmptyInput(): VitaminAInput {
  return createDefaultInput();
}

export function inputsEqual(a: VitaminAInput, b: VitaminAInput): boolean {
  if (a.sex !== b.sex || a.ageBand !== b.ageBand) return false;
  for (const id of SOURCE_IDS) {
    const left = a.sources[id];
    const right = b.sources[id];
    if (
      left.iuText !== right.iuText ||
      left.raeText !== right.raeText ||
      left.lastEdited !== right.lastEdited
    ) {
      return false;
    }
  }
  return true;
}
