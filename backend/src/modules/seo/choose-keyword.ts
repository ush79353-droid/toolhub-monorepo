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

/** The part after " - " names the tool. The words before it are only the shared family. */
function distinctiveName(toolName: string): string {
  const parts = toolName.split(/\s+-\s+/);
  return (parts.length > 1 ? parts[parts.length - 1] : toolName).trim();
}

/** 2–3 letter all-caps tokens, such as LWA. Longer names such as CARES stay required words. */
function shortAcronyms(name: string): string[] {
  return name
    .split(/[^A-Za-z0-9]+/)
    .filter((token) => token.length >= 2 && token.length <= 3 && token === token.toUpperCase() && /[A-Z]/.test(token))
    .map((token) => token.toLowerCase());
}

function contentTokens(name: string): string[] {
  return name
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2 && !STOP_TOKENS.has(token) && !SEED_NOISE.has(token));
}

/**
 * Tool name for the DataForSEO seed. A dashed suffix is the seed.
 * Drop calculator/converter only when at least two words remain.
 */
export function keywordSeed(toolName: string): string {
  const trimmed = distinctiveName(toolName);
  const words = trimmed.split(/[^A-Za-z0-9]+/).filter((word) => word.length > 0);
  const kept = words.filter((word) => !SEED_NOISE.has(word.toLowerCase()));
  return kept.length >= 2 ? kept.join(' ') : trimmed;
}

/**
 * A suggestion matches when it contains every long distinctive word, or the one
 * short acronym that stands for that phrase. "unemployment benefits" does not
 * match CARES Act or LWA.
 */
export function keywordContainsSeed(keyword: string, seed: string): boolean {
  return coversDistinctive(keyword, seed);
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

function wordsOf(keyword: string): Set<string> {
  return new Set(keyword.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 0));
}

function coversDistinctive(keyword: string, name: string): boolean {
  const words = wordsOf(keyword);
  const tokens = [...new Set(contentTokens(name))];
  if (tokens.length === 0) return false;
  const numbers = tokens.filter((token) => /^\d+$/.test(token));
  const longWords = tokens.filter((token) => token.length >= 4);
  const hasNumbers = numbers.every((token) => words.has(token));
  if (longWords.length > 0 && hasNumbers && longWords.every((token) => words.has(token))) return true;
  const acronyms = shortAcronyms(name);
  if (longWords.length > 0 && hasNumbers && acronyms.length === 1 && words.has(acronyms[0] ?? '')) return true;
  return longWords.length === 0 && tokens.every((token) => words.has(token));
}

function matchesTool(keyword: string, toolName: string): boolean {
  return coversDistinctive(keyword, distinctiveName(toolName));
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
