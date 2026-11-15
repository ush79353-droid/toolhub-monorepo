const fs = require('fs');
for (const f of [
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'frontend/src/tools/registry/details.ts',
  'frontend/src/app/sitemap.ts',
  'backend/src/modules/tools/tool.key.ts',
]) {
  const s = fs.readFileSync(f, 'utf8');
  const lines = s.split(/\r?\n/);
  console.log('====', f, 'lines', lines.length);
  console.log(lines.slice(-18).join('\n'));
  console.log('');
}
const k = fs.readFileSync('frontend/src/tools/registry/keys.ts', 'utf8');
const a = k.indexOf('export type Approved');
console.log('APPROVED\n', k.slice(a - 220, a));
const sm = fs.readFileSync('frontend/src/app/sitemap.ts', 'utf8');
const m = sm.indexOf('] as const');
console.log('SITEMAP\n', sm.slice(m - 280, m + 15));
