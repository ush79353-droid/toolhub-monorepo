export interface KeywordFact {
  keyword: string;
  searchVolume: number | null;
  difficulty: number | null;
  cpc: number | null;
}

export interface SiblingCandidate {
  toolId: string;
  slug: string;
  name: string;
  samePillar: boolean;
}

export interface SuggestedLink {
  toolId: string;
  slug: string;
  anchor: string;
}

const BRAND_TOKENS = ['calculator.net', 'nerdwallet', 'bankrate', 'investopedia', 'wikipedia', 'omnicalculator'];

function volume(fact: KeywordFact): number {
  return fact.searchVolume ?? 0;
}

function usable(facts: readonly KeywordFact[]): KeywordFact[] {
  return facts.filter((fact) => {
    const keyword = fact.keyword.trim().toLowerCase();
    return keyword.length > 0 && !BRAND_TOKENS.some((brand) => keyword.includes(brand));
  });
}

/** Highest-volume non-brand idea that shares a tool-name token. Falls back to the full list. */
export function choosePrimaryKeyword(facts: readonly KeywordFact[], toolName: string): KeywordFact | null {
  const pool = usable(facts);
  const ranked = [...(pool.length > 0 ? pool : facts)].sort((a, b) => volume(b) - volume(a));
  if (ranked.length === 0) return null;
  const tokens = toolName
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 3 && token !== 'calculator');
  return ranked.find((fact) => tokens.some((token) => fact.keyword.toLowerCase().includes(token))) ?? ranked[0];
}

export function chooseSecondaryKeywords(facts: readonly KeywordFact[], primary: string): KeywordFact[] {
  const pool = usable(facts);
  return [...(pool.length > 0 ? pool : facts)]
    .filter((fact) => fact.keyword.toLowerCase() !== primary.toLowerCase())
    .sort((a, b) => volume(b) - volume(a))
    .slice(0, 3);
}

/**
 * Same-pillar siblings first. Skips targets that already have 20 inbound suggestions in this campaign.
 * ponytail: the cap is counted from stored suggestions at inventory time. Concurrent inventory
 * workers could overshoot; inventory concurrency stays at 1. Upgrade path: assign links in one transaction.
 */
export function pickSiblingLinks(
  candidates: readonly SiblingCandidate[],
  inbound: ReadonlyMap<string, number>,
  limit = 4
): SuggestedLink[] {
  const ranked = [...candidates].sort(
    (a, b) => Number(b.samePillar) - Number(a.samePillar) || a.name.localeCompare(b.name)
  );
  const picked: SuggestedLink[] = [];
  for (const candidate of ranked) {
    if ((inbound.get(candidate.toolId) ?? 0) >= 20) continue;
    picked.push({ toolId: candidate.toolId, slug: candidate.slug, anchor: candidate.name });
    if (picked.length >= limit) break;
  }
  return picked;
}
