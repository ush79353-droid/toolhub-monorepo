import fs from 'node:fs';
import path from 'node:path';
import generatedManifest from '../../generated/component-manifest.json';
import type { ComponentFile, RegistryBinding, SourceIndex } from './classify';

const PLACEHOLDER_RE = /coming soon|not yet implemented/i;
const MANIFEST_RELATIVE = path.join('src', 'generated', 'component-manifest.json');

function isInside(parent: string, child: string): boolean {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function toPosix(relativePath: string): string {
  return relativePath.split(path.sep).join('/');
}

function hasToolRegistry(dir: string): boolean {
  return fs.existsSync(path.join(dir, 'src', 'tools', 'registry', 'index.ts'));
}

export function findFrontendRoot(start = process.cwd()): string | null {
  let current = path.resolve(start);
  for (let depth = 0; depth < 6; depth += 1) {
    if (hasToolRegistry(current)) return current;
    const nested = path.join(current, 'frontend');
    if (hasToolRegistry(nested)) return nested;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
  return null;
}

function listExports(source: string): string[] {
  const names = new Set<string>();
  for (const match of source.matchAll(/export\s+(?:async\s+)?function\s+([A-Za-z_]\w*)/g)) {
    names.add(match[1]);
  }
  for (const match of source.matchAll(/export\s+const\s+([A-Za-z_]\w*)/g)) {
    names.add(match[1]);
  }
  return [...names].sort();
}

function walkTools(dir: string, out: string[]): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'registry' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkTools(full, out);
      continue;
    }
    if (entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.tsx')) continue;
    if (!entry.name.endsWith('.ts') && !entry.name.endsWith('.tsx')) continue;
    out.push(full);
  }
}

function resolveAlias(root: string, specifier: string): { file: string | null; expectedPath: string } {
  const fallback = `src/${specifier.replace(/^@\//, '')}.tsx`;
  if (!specifier.startsWith('@/')) return { file: null, expectedPath: '' };
  const base = path.resolve(root, 'src', specifier.slice(2));
  const srcRoot = path.resolve(root, 'src');
  const candidates = [`${base}.tsx`, `${base}.ts`, path.join(base, 'index.tsx'), path.join(base, 'index.ts')];
  for (const candidate of candidates) {
    if (!isInside(srcRoot, candidate)) continue;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return { file: candidate, expectedPath: toPosix(path.relative(root, candidate)) };
    }
  }
  return { file: null, expectedPath: fallback };
}

function readText(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function quotedKeys(block: string): string[] {
  return [...block.matchAll(/'([^']+)'/g)].map((match) => match[1]).sort();
}

function unavailable(warning: string): SourceIndex {
  return {
    version: 1,
    available: false,
    source: 'manifest',
    scannedAt: new Date().toISOString(),
    warning,
    routeFileExists: false,
    routeUsesRegistry: false,
    detailRequired: false,
    embedUsesRegistry: false,
    registeredKeys: [],
    bindings: [],
    files: [],
  };
}

function isSourceIndex(value: unknown): value is SourceIndex {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<SourceIndex>;
  return record.version === 1 && Array.isArray(record.bindings) && Array.isArray(record.files) && Array.isArray(record.registeredKeys);
}

function readManifestFile(filePath: string): SourceIndex | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const parsed: unknown = JSON.parse(readText(filePath));
    if (!isSourceIndex(parsed)) return null;
    return { ...parsed, source: 'manifest', available: true };
  } catch {
    return null;
  }
}

export function writeComponentManifest(root: string, index: SourceIndex): void {
  const target = path.join(root, MANIFEST_RELATIVE);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const stable = { ...index, source: 'filesystem' as const, scannedAt: '', warning: '' };
  const body = `${JSON.stringify(stable, null, 2)}\n`;
  const current = fs.existsSync(target) ? readText(target) : '';
  if (current === body) return;
  fs.writeFileSync(target, body, 'utf8');
}

export function scanFrontendSource(root: string): SourceIndex {
  const srcRoot = path.join(root, 'src');
  const registryPath = path.join(srcRoot, 'tools', 'registry', 'index.ts');
  const keysPath = path.join(srcRoot, 'tools', 'registry', 'keys.ts');
  const detailsPath = path.join(srcRoot, 'tools', 'registry', 'details.ts');
  const pagePath = path.join(srcRoot, 'app', '(website)', 'tools', '[slug]', 'page.tsx');
  const workspacePath = path.join(srcRoot, 'components', 'shared', 'ToolWorkspace.tsx');
  const embedPath = path.join(srcRoot, 'app', 'embed', '[slug]', 'page.tsx');

  const registrySource = fs.existsSync(registryPath) ? readText(registryPath).replace(/\s+/g, ' ') : '';
  const keysSource = fs.existsSync(keysPath) ? readText(keysPath) : '';
  const detailsSource = fs.existsSync(detailsPath) ? readText(detailsPath).replace(/\s+/g, ' ') : '';
  const pageSource = fs.existsSync(pagePath) ? readText(pagePath) : '';
  const workspaceSource = fs.existsSync(workspacePath) ? readText(workspacePath) : '';
  const embedSource = fs.existsSync(embedPath) ? readText(embedPath) : '';

  const keysBlock = keysSource.match(/export const REGISTERED_COMPONENT_KEYS = \[([\s\S]*?)\]/);
  const registeredKeys = keysBlock ? quotedKeys(keysBlock[1]) : [];

  const detailImports = new Map<string, string>();
  for (const match of detailsSource.matchAll(/(\w+): \(\) => import\('([^']+)'\)/g)) {
    detailImports.set(match[1], match[2]);
  }

  const filesOnDisk: string[] = [];
  walkTools(path.join(srcRoot, 'tools'), filesOnDisk);
  const files: ComponentFile[] = filesOnDisk
    .map((filePath) => {
      const source = readText(filePath);
      return {
        relativePath: toPosix(path.relative(root, filePath)),
        exports: listExports(source),
        placeholder: source.length < 1500 && PLACEHOLDER_RE.test(source),
      };
    })
    .sort((left, right) => left.relativePath.localeCompare(right.relativePath));
  const filesByPath = new Map(files.map((file) => [file.relativePath, file]));

  const bindings: RegistryBinding[] = [];
  for (const match of registrySource.matchAll(/(\w+): lazyTool\(\(\) => import\('([^']+)'\).*?default: mod\.(\w+)/g)) {
    const key = match[1];
    const importPath = match[2];
    const exportName = match[3];
    const resolved = resolveAlias(root, importPath);
    const relativePath = resolved.file ? toPosix(path.relative(root, resolved.file)) : '';
    let file = relativePath ? filesByPath.get(relativePath) : undefined;
    if (resolved.file && !file) {
      const source = readText(resolved.file);
      file = {
        relativePath,
        exports: listExports(source),
        placeholder: source.length < 1500 && PLACEHOLDER_RE.test(source),
      };
    }
    const detailImportPath = detailImports.get(key) ?? '';
    const detailResolved = detailImportPath ? resolveAlias(root, detailImportPath) : { file: null, expectedPath: '' };
    const detailSource = detailResolved.file ? readText(detailResolved.file) : '';
    bindings.push({
      key,
      importPath,
      expectedPath: resolved.expectedPath,
      relativePath,
      exportName,
      exportFound: Boolean(file?.exports.includes(exportName)),
      fileExists: Boolean(resolved.file),
      placeholder: Boolean(file?.placeholder),
      detailImportPath,
      detailExpectedPath: detailResolved.expectedPath,
      detailFileExists: Boolean(detailResolved.file),
      detailExportsPageDetail: /export\s+const\s+toolPageDetail\b/.test(detailSource),
    });
  }
  bindings.sort((left, right) => left.key.localeCompare(right.key));

  const routeFileExists = fs.existsSync(pagePath);
  const routeUsesRegistry =
    routeFileExists &&
    pageSource.includes('isRegisteredComponentKey') &&
    pageSource.includes('ToolWorkspace') &&
    workspaceSource.includes('getToolComponent');

  return {
    version: 1,
    available: true,
    source: 'filesystem',
    scannedAt: new Date().toISOString(),
    warning: '',
    routeFileExists,
    routeUsesRegistry,
    detailRequired: pageSource.includes('loadToolPageDetail'),
    embedUsesRegistry: embedSource.includes('isRegisteredComponentKey') && embedSource.includes('ToolWorkspace'),
    registeredKeys,
    bindings,
    files,
  };
}

export function loadSourceIndex(options?: { writeManifest?: boolean; start?: string }): SourceIndex {
  const root = findFrontendRoot(options?.start);
  if (!root) {
    const fromCwd = readManifestFile(path.join(process.cwd(), MANIFEST_RELATIVE));
    const fromFrontend = readManifestFile(path.join(process.cwd(), 'frontend', MANIFEST_RELATIVE));
    const bundled = isSourceIndex(generatedManifest)
      ? {
          ...generatedManifest,
          source: 'manifest' as const,
          available: true,
          warning: 'Source directories are not on this server. Results use the build-time component manifest.',
        }
      : null;
    return fromCwd ?? fromFrontend ?? bundled ?? unavailable('Component source and the build-time manifest are unavailable.');
  }

  const index = scanFrontendSource(root);
  if (options?.writeManifest !== false) {
    try {
      writeComponentManifest(root, index);
    } catch {
      index.warning = 'The component manifest could not be written. This audit still used the live source tree.';
    }
  }
  return index;
}
