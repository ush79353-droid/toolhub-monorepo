export interface RecentTool {
  name: string;
  slug: string;
}

const STORAGE_KEY = 'omega-recent-tools';
const MAX_RECENT_TOOLS = 3;

function isRecentTool(value: unknown): value is RecentTool {
  if (!value || typeof value !== 'object') return false;
  const item = value as { name?: unknown; slug?: unknown };
  return (
    typeof item.name === 'string' &&
    item.name.trim().length > 0 &&
    item.name.length <= 160 &&
    typeof item.slug === 'string' &&
    /^[a-z0-9-]{1,120}$/.test(item.slug)
  );
}

export function mergeRecentTools(current: RecentTool[], tool: RecentTool): RecentTool[] {
  return [tool, ...current.filter((item) => item.slug !== tool.slug)].slice(0, MAX_RECENT_TOOLS);
}

export function readRecentTools(): RecentTool[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentTool).slice(0, MAX_RECENT_TOOLS);
  } catch {
    return [];
  }
}

export function rememberRecentTool(tool: RecentTool): void {
  if (typeof window === 'undefined' || !isRecentTool(tool)) return;
  const next = mergeRecentTools(readRecentTools(), { name: tool.name.trim(), slug: tool.slug });
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function selfCheck(): void {
  const a = { name: 'A', slug: 'a' };
  const b = { name: 'B', slug: 'b' };
  const c = { name: 'C', slug: 'c' };
  const d = { name: 'D', slug: 'd' };
  const three = mergeRecentTools(mergeRecentTools(mergeRecentTools([], a), b), c);
  const four = mergeRecentTools(three, d);
  const again = mergeRecentTools(four, { name: 'C again', slug: 'c' });
  if (four.map((item) => item.slug).join() !== 'd,c,b') throw new Error('recent tools cap');
  if (again.map((item) => item.slug).join() !== 'c,d,b') throw new Error('recent tools move');
  if (again[0]?.name !== 'C again') throw new Error('recent tools name');
}

const entry = typeof process !== 'undefined' ? process.argv[1] : '';
if (entry && entry.replace(/\\/g, '/').endsWith('src/lib/recent-tools.ts')) {
  selfCheck();
}
