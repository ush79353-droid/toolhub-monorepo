import fs from 'node:fs';
import path from 'node:path';

/** types.ts + calculation.ts, plus short UI labels. Large modules are cut at the end. */
const SOURCE_CAP = 12_000;

const CHROME = new Set([
  'copied',
  'copy results',
  'share result',
  'clear all changes',
  'reload calculator',
  'yes',
  'no',
]);

function clean(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/** Visible input and result names. Skips buttons, errors, and sentences. */
export function extractUiLabels(source: string): { inputs: string[]; results: string[] } {
  const inputs: string[] = [];
  const results: string[] = [];
  const seen = new Set<string>();
  const add = (list: string[], raw: string) => {
    const text = clean(raw);
    const key = text.toLowerCase();
    if (text.length < 2 || text.length > 48 || /[{}<>]/.test(text) || CHROME.has(key) || seen.has(key)) return;
    seen.add(key);
    list.push(text);
  };
  for (const match of source.matchAll(/<label\b[^>]*>([^<{]+)<\/label>/g)) add(inputs, match[1] ?? '');
  for (const match of source.matchAll(/\blabel="([^"]+)"/g)) add(inputs, match[1] ?? '');
  for (const match of source.matchAll(/<span\b([^>]*)>([^<{]+)<\/span>/g)) {
    const attrs = match[1] ?? '';
    if (!attrs.includes('font-medium') || !attrs.includes('text-accent')) continue;
    add(inputs, match[2] ?? '');
  }
  for (const match of source.matchAll(/<(?:p|span)\b([^>]*)>([^<{]+)<\/(?:p|span)>/g)) {
    const attrs = match[1] ?? '';
    const text = clean(match[2] ?? '');
    if (!attrs.includes('text-muted-foreground') && !attrs.includes('text-primary')) continue;
    if (text.endsWith('.')) continue;
    add(results, text);
  }
  return { inputs, results };
}

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
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const read = (name: string) => {
    const full = path.join(dir, name);
    return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
  };
  const formFiles = files.filter((name) => name.endsWith('Form.tsx'));
  const resultFiles = files.filter((name) => name.endsWith('Results.tsx'));
  const uiFiles = [
    ...(formFiles.length > 0 ? formFiles : files.filter((name) => name.endsWith('Calculator.tsx'))),
    ...resultFiles,
  ];
  const inputs: string[] = [];
  const results: string[] = [];
  for (const name of uiFiles) {
    const labels = extractUiLabels(read(name));
    inputs.push(...labels.inputs.filter((label) => !inputs.includes(label)));
    results.push(...labels.results.filter((label) => !results.includes(label)));
  }
  const parts: string[] = [];
  if (inputs.length > 0 || results.length > 0) {
    parts.push(
      ['// fields', inputs.length > 0 ? `Inputs: ${inputs.join(', ')}` : '', results.length > 0 ? `Results: ${results.join(', ')}` : '']
        .filter(Boolean)
        .join('\n')
    );
  }
  for (const file of ['types.ts', 'calculation.ts']) {
    const body = read(file).trim();
    if (body) parts.push(`// ${file}\n${body}`);
  }
  const joined = parts.join('\n\n');
  if (joined.length <= SOURCE_CAP) return joined;
  return `${joined.slice(0, SOURCE_CAP)}\n\n// source truncated`;
}
