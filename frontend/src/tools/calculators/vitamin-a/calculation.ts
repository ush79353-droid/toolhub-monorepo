import {
  formatMeasure,
  getSubstanceOption,
  iuToMcg,
  mcgToIu,
} from '../mcg-to-iu/calculation';
import {
  AGE_BAND_OPTIONS,
  DISCLAIMER,
  SOURCE_OPTIONS,
  type VitaminAAgeBand,
  type VitaminAInput,
  type VitaminAResult,
  type VitaminASex,
  type VitaminASourceDraft,
  type VitaminASourceId,
  type VitaminASourceResult,
} from './types';

export { formatMeasure, iuToMcg, mcgToIu };

/** NIH ODS Table 1 — mcg RAE/day. Infant rows are AI (*). */
const RDA_MCG_RAE: Record<
  VitaminAAgeBand,
  { male: number; female: number; kind: 'rda' | 'ai' }
> = {
  birth_6mo: { male: 400, female: 400, kind: 'ai' },
  mo7_12: { male: 500, female: 500, kind: 'ai' },
  y1_3: { male: 300, female: 300, kind: 'rda' },
  y4_8: { male: 400, female: 400, kind: 'rda' },
  y9_13: { male: 600, female: 600, kind: 'rda' },
  y14_18: { male: 900, female: 700, kind: 'rda' },
  y19_50: { male: 900, female: 700, kind: 'rda' },
  y51plus: { male: 900, female: 700, kind: 'rda' },
};

export function getSourceOption(id: VitaminASourceId) {
  const option = SOURCE_OPTIONS.find((row) => row.id === id);
  if (!option) {
    throw new Error(`Unknown vitamin A source: ${id}`);
  }
  return option;
}

/** Guard: local factors must match mcg-to-iu vitamin A presets. */
export function assertFactorParityWithMcgToIu(): void {
  for (const source of SOURCE_OPTIONS) {
    const shared = getSubstanceOption(source.mcgIuSubstance);
    if (shared.mcgPerIu !== source.mcgPerIu) {
      throw new Error(
        `Vitamin A factor drift for ${source.id}: local ${source.mcgPerIu} vs mcg-to-iu ${shared.mcgPerIu}`
      );
    }
  }
}

export function lookupRda(
  sex: VitaminASex,
  ageBand: VitaminAAgeBand
): { mcgRae: number; kind: 'rda' | 'ai'; label: string; ageBandLabel: string } {
  const row = RDA_MCG_RAE[ageBand];
  const ageBandLabel = AGE_BAND_OPTIONS.find((o) => o.id === ageBand)?.label ?? ageBand;
  const mcgRae = sex === 'male' ? row.male : row.female;
  const kind = row.kind;
  const label =
    kind === 'ai'
      ? `Adequate Intake · ${sex === 'male' ? 'Male' : 'Female'} · ${ageBandLabel}`
      : `RDA · ${sex === 'male' ? 'Male' : 'Female'} · ${ageBandLabel}`;
  return { mcgRae, kind, label, ageBandLabel };
}

/**
 * Keep IU ↔ RAE in lockstep for one source.
 * Incomplete drafts keep the edited side and leave the other side alone (no inverse write).
 */
export function syncSourceDraft(
  id: VitaminASourceId,
  draft: VitaminASourceDraft
): VitaminASourceDraft {
  const { mcgPerIu } = getSourceOption(id);
  const raw = draft.lastEdited === 'iu' ? draft.iuText.trim() : draft.raeText.trim();
  if (
    raw === '' ||
    raw === '.' ||
    raw === '-' ||
    raw === '-.' ||
    raw.endsWith('.') ||
    /e[+-]?$/i.test(raw)
  ) {
    return draft;
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return draft;
  }
  if (draft.lastEdited === 'iu') {
    return {
      ...draft,
      raeText: formatMeasure(iuToMcg(value, mcgPerIu)),
    };
  }
  return {
    ...draft,
    iuText: formatMeasure(mcgToIu(value, mcgPerIu)),
  };
}

function parseFinite(raw: string): number | null {
  const cleaned = raw.trim();
  if (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    /e[+-]?$/i.test(cleaned)
  ) {
    return null;
  }
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

export function resolveSourcePair(
  id: VitaminASourceId,
  draft: VitaminASourceDraft
): { iu: number; raeMcg: number } | null {
  const option = getSourceOption(id);
  const iuRaw = parseFinite(draft.iuText);
  const raeRaw = parseFinite(draft.raeText);

  if (draft.lastEdited === 'iu') {
    if (iuRaw === null || !Number.isFinite(iuRaw)) return null;
    return { iu: iuRaw, raeMcg: iuToMcg(iuRaw, option.mcgPerIu) };
  }
  if (raeRaw === null || !Number.isFinite(raeRaw)) return null;
  return { iu: mcgToIu(raeRaw, option.mcgPerIu), raeMcg: raeRaw };
}

export function calculateVitaminA(input: VitaminAInput): VitaminAResult {
  const rda = lookupRda(input.sex, input.ageBand);
  const sources: VitaminASourceResult[] = [];
  let totalRaeMcg = 0;

  for (const option of SOURCE_OPTIONS) {
    const pair = resolveSourcePair(option.id, input.sources[option.id]);
    const iu = pair?.iu ?? 0;
    const raeMcg = pair?.raeMcg ?? 0;
    totalRaeMcg += raeMcg;
    sources.push({
      id: option.id,
      label: option.label,
      iu,
      raeMcg,
      mcgPerIu: option.mcgPerIu,
      factorNote: option.factorNote,
    });
  }

  const vsRdaPercent = rda.mcgRae > 0 ? (totalRaeMcg / rda.mcgRae) * 100 : null;

  return {
    sex: input.sex,
    ageBand: input.ageBand,
    ageBandLabel: rda.ageBandLabel,
    rdaMcgRae: rda.mcgRae,
    rdaKind: rda.kind,
    rdaLabel: rda.label,
    sources,
    totalRaeMcg,
    vsRdaPercent,
    statusHeadline: `Total ${formatMeasure(totalRaeMcg)} mcg RAE from ${sources.length} source panels`,
    statusDetail: `Compared with NIH ODS ${rda.kind.toUpperCase()} of ${formatMeasure(rda.mcgRae)} mcg RAE/day for this age/sex row.`,
    sourceNote:
      'NIH ODS Vitamin A Health Professional Fact Sheet — IU→mcg RAE factors and Table 1 RDA/AI.',
    disclaimer: DISCLAIMER,
  };
}
