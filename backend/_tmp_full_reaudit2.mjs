import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('..');
const keys = fs.readFileSync(path.join(root, 'frontend/src/tools/registry/keys.ts'), 'utf8');
const a = (keys.match(/APPROVED_COMPONENT_KEYS = \[([\s\S]*?)\] as const/) || [])[1] || '';
const r = (keys.match(/REGISTERED_COMPONENT_KEYS = \[([\s\S]*?)\] as const/) || [])[1] || '';
const idx = fs.readFileSync(path.join(root, 'frontend/src/tools/registry/index.ts'), 'utf8');
const det = fs.readFileSync(path.join(root, 'frontend/src/tools/registry/details.ts'), 'utf8');
const be = fs.readFileSync(path.join(root, 'backend/src/modules/tools/tool.key.ts'), 'utf8');
const page = fs.readFileSync(
  path.join(root, 'frontend/src/app/(website)/tools/[slug]/page.tsx'),
  'utf8',
);
const app = fs.readFileSync(path.join(root, 'frontend/src/app/sitemap.ts'), 'utf8');
const reg = fs.readFileSync(path.join(root, 'frontend/src/tools/registry/sitemap.ts'), 'utf8');

const table = fs.readFileSync('_tmp_audit_table.md', 'utf8');
const rows = [];
for (const line of table.split('\n')) {
  if (!line.startsWith('|') || line.includes('Calculator | Slug') || line.includes('---|'))
    continue;
  const cols = line.split('|').map((c) => c.trim());
  // ['', '#', name, slug, key, registry, mongo, fx, status, issues, '']
  if (cols.length < 10) continue;
  const slug = cols[3].replace(/`/g, '');
  const key = cols[4].replace(/`/g, '');
  const origStatus = cols[8].replace(/\*/g, '');
  const fxCol = cols[7].replace(/\*/g, '');
  const needFx =
    fxCol.toLowerCase().includes('fx gap') ||
    fxCol.toLowerCase().includes('phase2');
  // stimulus fixed USD / TDS N/A / cashback N/A don't need FX slug
  rows.push({
    n: cols[1],
    name: cols[2],
    slug,
    key,
    origStatus,
    needFx,
    fxCol,
  });
}

function dirFromKey(key) {
  // best-effort: look for lazy import path
  const m = idx.match(
    new RegExp(
      `${key}: lazyTool\\([\\s\\S]*?@/tools/calculators/([^/]+)/`,
    ),
  );
  if (m) return m[1];
  // fallback camel to kebab-ish
  return key.replace(/Calculator$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

const counts = { DEVELOPED: 0, PARTIAL: 0, MISSING: 0, BLOCKED: 0 };
const results = [];
for (const row of rows) {
  const dir = dirFromKey(row.key);
  const hasModule = fs.existsSync(
    path.join(root, 'frontend/src/tools/calculators', dir),
  );
  const okA = a.includes(`'${row.key}'`);
  const okR = r.includes(`'${row.key}'`);
  const okL = new RegExp(`${row.key}\\s*:`).test(idx);
  const okD = new RegExp(`${row.key}\\s*:`).test(det);
  const okB = be.includes(`'${row.key}'`);
  const okFx = !row.needFx || page.includes(`'${row.slug}'`);
  const okSm = app.includes(`'${row.slug}'`) && reg.includes(`'${row.slug}'`);
  let status = 'DEVELOPED';
  if (!hasModule) status = 'MISSING';
  else if (!(okA && okR && okL && okD && okB && okFx && okSm)) status = 'PARTIAL';
  counts[status]++;
  const gaps = [];
  if (!hasModule) gaps.push('module');
  if (!okA) gaps.push('APPROVED');
  if (!okR) gaps.push('REGISTERED');
  if (!okL) gaps.push('lazy');
  if (!okD) gaps.push('details');
  if (!okB) gaps.push('backend');
  if (!okFx) gaps.push('FX');
  if (!okSm) gaps.push('sitemap');
  results.push({ ...row, status, gaps: gaps.join(',') || '—', dir });
}

console.log(JSON.stringify(counts));
for (const r of results) {
  console.log(
    `${r.n.padStart(2)} ${r.status.padEnd(9)} ${r.key} slug=${r.slug} fxNeed=${r.needFx} gaps=${r.gaps}`,
  );
}
fs.writeFileSync('_tmp_reaudit_results.json', JSON.stringify({ counts, results }, null, 2));
