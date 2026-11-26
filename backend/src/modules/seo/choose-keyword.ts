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
const SEED_NOISE = new Set(['calculator', 'calculators', 'converter', 'converters']);

/**
 * Tool name for the DataForSEO seed. Drop calculator/converter only when at least
 * two words remain. "Meter Converter" stays whole so the search is not just "Meter".
 */
export function keywordSeed(toolName: string): string {
  const trimmed = toolName.trim();
  const words = trimmed.split(/[^A-Za-z0-9]+/).filter((word) => word.length > 0);
  const kept = words.filter((word) => !SEED_NOISE.has(word.toLowerCase()));
  return kept.length >= 2 ? kept.join(' ') : trimmed;
}

/** Suggestion must contain every seed word, so a broad calculator keyword cannot be saved. */
export function keywordContainsSeed(keyword: string, seed: string): boolean {
  const words = new Set(keyword.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 0));
  const required = seed.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length >= 2);
  return required.length > 0 && required.every((word) => words.has(word));
}
const STOP_TOKENS = new Set(['calculator', 'calculators', 'the', 'and', 'for', 'with', 'from', 'vs', 'per']);

function volume(fact: KeywordFact): number {
  return fact.searchVolume ?? 0;
}

function usable(facts: readonly KeywordFact[]): KeywordFact[] {
  return facts.filter((fact) => {
    const keyword = fact.keyword.trim().toLowerCase();
    return keyword.length > 0 && !BRAND_TOKENS.some((brand) => keyword.includes(brand));
  });
}

function tokensOf(toolName: string): string[] {
  const tokens = toolName
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2 && !STOP_TOKENS.has(token));
  return [...new Set(tokens)];
}

function wordsOf(keyword: string): Set<string> {
  return new Set(keyword.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 0));
}

/** Tokens the keyword must contain as whole words. Numbers always count. Words of 4+ letters count when any exist. */
function requiredTokens(toolName: string): string[] {
  const tokens = tokensOf(toolName);
  const numbers = tokens.filter((token) => /^\d+$/.test(token));
  const specific = tokens.filter((token) => token.length >= 4);
  const must = specific.length > 0 ? specific : tokens;
  return [...new Set([...numbers, ...must])];
}

function matchesTool(keyword: string, toolName: string): boolean {
  const must = requiredTokens(toolName);
  if (must.length === 0) return false;
  const words = wordsOf(keyword);
  return must.every((token) => words.has(token));
}

/**
 * Highest-volume idea whose whole words cover this tool's distinctive tokens.
 * Short names such as APR and 529 stay in play. No whole-word match returns null.
 */
export function choosePrimaryKeyword(
  facts: readonly KeywordFact[],
  toolName: string,
  taken: ReadonlySet<string> = new Set()
): KeywordFact | null {
  const ranked = usable(facts)
    .filter((fact) => !taken.has(fact.keyword.toLowerCase()) && matchesTool(fact.keyword, toolName))
    .sort((a, b) => volume(b) - volume(a));
  return ranked[0] ?? null;
}

export function chooseSecondaryKeywords(
  facts: readonly KeywordFact[],
  primary: string,
  toolName: string,
  taken: ReadonlySet<string> = new Set()
): KeywordFact[] {
  const primaryKey = primary.toLowerCase();
  return usable(facts)
    .filter((fact) => {
      const keyword = fact.keyword.toLowerCase();
      return keyword !== primaryKey && !taken.has(keyword) && matchesTool(fact.keyword, toolName);
    })
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
