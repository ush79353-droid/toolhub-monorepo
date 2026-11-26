import fs from 'node:fs';
import path from 'node:path';

/** types.ts + calculation.ts. Large modules are cut so the prompt stays bounded. */
const SOURCE_CAP = 12_000;

const ENTRY =
  /(\w+)\s*:\s*lazyTool\(\(\)\s*=>\s*import\(\s*['"]@\/tools\/calculators\/([^'"]+)['"]/g;

export function calculatorFolders(registrySource: string): Map<string, string> {
  const folders = new Map<string, string>();
  for (const match of registrySource.matchAll(ENTRY)) {
    const key = match[1];
    const folder = match[2]?.split('/')[0] ?? '';
    if (!key || !/^[a-z0-9-]+$/.test(folder)) continue;
    folders.set(key, folder);
  }
  return folders;
}

function toolsRoot(): string | null {
  let dir = __dirname;
  for (let i = 0; i < 6; i += 1) {
    const candidate = path.join(dir, 'frontend', 'src', 'tools');
    if (fs.existsSync(path.join(candidate, 'registry', 'index.ts'))) return candidate;
    dir = path.dirname(dir);
  }
  return null;
}

let cached: Map<string, string> | null = null;

function folderFor(componentKey: string): string | null {
  const root = toolsRoot();
  if (!root) return null;
  if (!cached) {
    cached = calculatorFolders(fs.readFileSync(path.join(root, 'registry', 'index.ts'), 'utf8'));
  }
  return cached.get(componentKey) ?? null;
}

/** Implementation the SEO draft may describe. Empty when the module is not on disk. */
export function readCalculatorSource(componentKey: string): string {
  const key = componentKey.trim();
  const folder = key ? folderFor(key) : null;
  const root = toolsRoot();
  if (!folder || !root) return '';
  const dir = path.join(root, 'calculators', folder);
  const parts: string[] = [];
  for (const file of ['types.ts', 'calculation.ts']) {
    const full = path.join(dir, file);
    if (!fs.existsSync(full)) continue;
    const body = fs.readFileSync(full, 'utf8').trim();
    if (body) parts.push(`// ${file}\n${body}`);
  }
  const joined = parts.join('\n\n');
  if (joined.length <= SOURCE_CAP) return joined;
  return `${joined.slice(0, SOURCE_CAP)}\n\n// source truncated`;
}
