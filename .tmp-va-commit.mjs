import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'pipe', encoding: 'utf8' });
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, s) => fs.writeFileSync(path.join(root, p), s);

if (!fs.existsSync('frontend/src/tools/calculators/variable-annuity/calculation.ts')) {
  throw new Error('variable-annuity module missing');
}

function ensureKeys(p) {
  let t = read(p);
  const n = (t.match(/VariableAnnuityCalculator/g) || []).length;
  if (n >= 2) return;
  t = t.replace(
    /(  'ValueAtRiskCalculator',\r?\n)(?!  'VariableAnnuityCalculator',)/g,
    "$1  'VariableAnnuityCalculator',\n"
  );
  write(p, t);
}

function ensureIndex(p) {
  let t = read(p);
  if (t.includes('VariableAnnuityCalculator')) return;
  const block = `  VariableAnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/variable-annuity/VariableAnnuityCalculator'
    ).then((mod) => ({
      default: mod.VariableAnnuityCalculator,
    })),
  ),
`;
  if (!t.includes('  EidlCalculator: lazyTool(() =>')) throw new Error('index anchor missing');
  write(p, t.replace('  EidlCalculator: lazyTool(() =>', block + '  EidlCalculator: lazyTool(() =>'));
}

function ensureDetails(p) {
  let t = read(p);
  if (t.includes('VariableAnnuityCalculator')) return;
  const ins = `  VariableAnnuityCalculator: () =>
    import('@/tools/calculators/variable-annuity/detail'),
`;
  write(
    p,
    t.replace(
      "  EidlCalculator: () => import('@/tools/calculators/eidl/detail'),",
      ins + "  EidlCalculator: () => import('@/tools/calculators/eidl/detail'),"
    )
  );
}

function ensureToolKey(p) {
  let t = read(p);
  if (!t.includes("  'VariableAnnuityCalculator',")) {
    t = t.replace(
      /(  'ValueAtRiskCalculator',\r?\n)(  'EidlCalculator',)/,
      "$1  'VariableAnnuityCalculator',\n$2"
    );
  }
  if (!t.includes("isApprovedComponentKey('VariableAnnuityCalculator')")) {
    t = t.replace(
      /(!isApprovedComponentKey\('ValueAtRiskCalculator'\) \|\|\r?\n)(    !isApprovedComponentKey\('EidlCalculator'\) \|\|)/,
      "$1    !isApprovedComponentKey('VariableAnnuityCalculator') ||\n$2"
    );
  }
  write(p, t);
}

function ensureSlug(p) {
  let t = read(p);
  if (t.includes('variable-annuity-calculator')) return;
  t = t.replace(
    /(  'value-at-risk-calculator-var',\r?\n)/,
    "$1  'variable-annuity-calculator',\n"
  );
  write(p, t);
}

ensureKeys('frontend/src/tools/registry/keys.ts');
ensureIndex('frontend/src/tools/registry/index.ts');
ensureDetails('frontend/src/tools/registry/details.ts');
ensureToolKey('frontend/src/tools/registry/tool.key.ts');
ensureToolKey('backend/src/modules/tools/tool.key.ts');
ensureSlug('frontend/src/app/sitemap.ts');
ensureSlug('frontend/src/tools/registry/sitemap.ts');
ensureSlug('frontend/src/app/embed/[slug]/page.tsx');
ensureSlug('frontend/src/app/(website)/tools/[slug]/page.tsx');

const checks = [
  ['frontend/src/tools/registry/keys.ts', 'VariableAnnuityCalculator'],
  ['frontend/src/tools/registry/index.ts', 'VariableAnnuityCalculator'],
  ['frontend/src/tools/registry/details.ts', 'VariableAnnuityCalculator'],
  ['backend/src/modules/tools/tool.key.ts', 'VariableAnnuityCalculator'],
  ['frontend/src/app/sitemap.ts', 'variable-annuity-calculator'],
  ['frontend/src/app/(website)/tools/[slug]/page.tsx', 'variable-annuity-calculator'],
  ['frontend/src/app/embed/[slug]/page.tsx', 'variable-annuity-calculator'],
];
for (const [p, pat] of checks) {
  if (!read(p).includes(pat)) throw new Error(`missing ${pat} in ${p}`);
}
console.log('wiring verified');

run('git restore --staged .');

const shared = [
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'frontend/src/tools/registry/details.ts',
  'frontend/src/tools/registry/tool.key.ts',
  'frontend/src/tools/registry/sitemap.ts',
  'backend/src/modules/tools/tool.key.ts',
  'frontend/src/app/sitemap.ts',
  'frontend/src/app/embed/[slug]/page.tsx',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
];

const bak = '.tmp-va-commit-wip2';
fs.mkdirSync(bak, { recursive: true });
const safe = (f) => f.replace(/[\\/\[\]()]/g, '_');
for (const f of shared) {
  fs.copyFileSync(f, path.join(bak, safe(f)));
}

function insertVA(text, kind) {
  switch (kind) {
    case 'keys':
      return text.replace(
        /(  'ValueAtRiskCalculator',\r?\n)(?!  'VariableAnnuityCalculator',)/g,
        "$1  'VariableAnnuityCalculator',\n"
      );
    case 'index': {
      if (text.includes('VariableAnnuityCalculator:')) return text;
      const block = `  VariableAnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/variable-annuity/VariableAnnuityCalculator'
    ).then((mod) => ({
      default: mod.VariableAnnuityCalculator,
    })),
  ),
`;
      return text.replace(
        '  EidlCalculator: lazyTool(() =>',
        block + '  EidlCalculator: lazyTool(() =>'
      );
    }
    case 'details': {
      if (text.includes('VariableAnnuityCalculator:')) return text;
      const ins = `  VariableAnnuityCalculator: () =>
    import('@/tools/calculators/variable-annuity/detail'),
`;
      return text.replace(
        "  EidlCalculator: () => import('@/tools/calculators/eidl/detail'),",
        ins + "  EidlCalculator: () => import('@/tools/calculators/eidl/detail'),"
      );
    }
    case 'toolkey': {
      let t = text;
      if (!t.includes("  'VariableAnnuityCalculator',")) {
        t = t.replace(
          /(  'ValueAtRiskCalculator',\r?\n)(  'EidlCalculator',)/,
          "$1  'VariableAnnuityCalculator',\n$2"
        );
      }
      if (!t.includes("VariableAnnuityCalculator')")) {
        t = t.replace(
          /(!isApprovedComponentKey\('ValueAtRiskCalculator'\) \|\|\r?\n)(    !isApprovedComponentKey\('EidlCalculator'\) \|\|)/,
          "$1    !isApprovedComponentKey('VariableAnnuityCalculator') ||\n$2"
        );
      }
      return t;
    }
    case 'slug':
      if (text.includes('variable-annuity-calculator')) return text;
      return text.replace(
        /(  'value-at-risk-calculator-var',\r?\n)/,
        "$1  'variable-annuity-calculator',\n"
      );
    default:
      return text;
  }
}

const kinds = {
  'frontend/src/tools/registry/keys.ts': 'keys',
  'frontend/src/tools/registry/index.ts': 'index',
  'frontend/src/tools/registry/details.ts': 'details',
  'frontend/src/tools/registry/tool.key.ts': 'toolkey',
  'backend/src/modules/tools/tool.key.ts': 'toolkey',
  'frontend/src/tools/registry/sitemap.ts': 'slug',
  'frontend/src/app/sitemap.ts': 'slug',
  'frontend/src/app/embed/[slug]/page.tsx': 'slug',
  'frontend/src/app/(website)/tools/[slug]/page.tsx': 'slug',
};

for (const f of shared) {
  run(`git checkout HEAD -- "${f}"`);
  write(f, insertVA(read(f), kinds[f]));
  run(`git add -- "${f}"`);
}

for (const f of shared) {
  fs.copyFileSync(path.join(bak, safe(f)), f);
}

run('git add -- frontend/src/tools/calculators/variable-annuity backend/src/scripts/assign-variable-annuity-tool.ts');

const brainFiles = [
  'brain/CHANGELOG.md',
  'brain/CURRENT_STATE.md',
  'brain/FRONTEND.md',
  'brain/TASKS.md',
];
for (const bf of brainFiles) {
  fs.copyFileSync(bf, path.join(bak, safe(bf)));
}

const headShow = (p) => run(`git show HEAD:${p}`);

if (!/Variable Annuity Calculator \(Screenshot/.test(headShow('brain/CHANGELOG.md'))) {
  run('git checkout HEAD -- brain/CHANGELOG.md');
  const entry = `### 2026-11-17 — Variable Annuity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Variable Annuity Calculator on existing catalog slug \`variable-annuity-calculator\` (\`VariableAnnuityCalculator\`, catalog \`6af46f0fa27d8d1d4e98ffb0\`). Final-balance mode; ages/length sync; due/ordinary; tax section; FX. Activated.
- **Formulas:** \`i = (1+r/m)^(m/q)−1\`; growing-annuity FV; due ×(1+i). Example: 10,000 + 100/mo due / 12% / 35y → ≈ 1,079,079.31 before tax.
- **Tax:** Published IRS TY2024 Single ordinary brackets (Rev. Proc. 2023-34) on yearly gains. Not Omni proprietary.
- **FX:** Independent currencies on starting balance, contribution, income; normalize to starting-balance currency.
- **Important Files:** \`frontend/src/tools/calculators/variable-annuity/*\`, registries, sitemap, FX slugs, assign script, \`brain/*\`.
- **Verification:** Mongo activated. Lint/builds/tests omitted per user. No push/pull/sync.

`;
  write('brain/CHANGELOG.md', entry + read('brain/CHANGELOG.md'));
  run('git add -- brain/CHANGELOG.md');
} else console.log('CHANGELOG already in HEAD');

if (!headShow('brain/FRONTEND.md').includes('variable-annuity/')) {
  run('git checkout HEAD -- brain/FRONTEND.md');
  let t = read('brain/FRONTEND.md');
  const imm = t.split(/\r?\n/).find((l) => l.includes('immediate-annuity/'));
  if (!imm) throw new Error('FRONTEND immediate-annuity line missing');
  const dedicated =
    "- `src/tools/calculators/variable-annuity/`: Variable Annuity Calculator (`VariableAnnuityCalculator`, slug `variable-annuity-calculator`). Final-balance; IRS TY2024 tax compare; independent FX; guide.";
  t = t.replace(imm, dedicated + '\n' + imm);
  write('brain/FRONTEND.md', t);
  run('git add -- brain/FRONTEND.md');
} else console.log('FRONTEND already in HEAD');

if (!headShow('brain/CURRENT_STATE.md').includes('Variable Annuity Calculator')) {
  run('git checkout HEAD -- brain/CURRENT_STATE.md');
  let t = read('brain/CURRENT_STATE.md');
  const line =
    "- **Variable Annuity Calculator (`/tools/variable-annuity-calculator`):** Live client-side accumulation (`componentKey: 'VariableAnnuityCalculator'`, catalog `6af46f0fa27d8d1d4e98ffb0`). Final-balance; ages/length; due/ordinary; IRS TY2024 Single tax compare; independent FX. Example ≈ 1,079,079.31 pretax. Activated.\n\n";
  if (t.includes('- **Attrition Rate Calculator')) {
    t = t.replace('- **Attrition Rate Calculator', line + '- **Attrition Rate Calculator');
  } else {
    t += '\n' + line;
  }
  write('brain/CURRENT_STATE.md', t);
  run('git add -- brain/CURRENT_STATE.md');
} else console.log('CURRENT_STATE already in HEAD');

if (!headShow('brain/TASKS.md').includes('variable-annuity-calculator')) {
  run('git checkout HEAD -- brain/TASKS.md');
  let t = read('brain/TASKS.md');
  const row =
    '| `TOOL-377` | Implement Variable Annuity Calculator on existing slug `variable-annuity-calculator` with final-balance mode, age/length sync, due/ordinary accumulation, published IRS TY2024 taxable comparison, independent FX on three money fields, guide/SEO/embed, and verified activation | Cursor | Completed | `frontend/src/tools/calculators/variable-annuity/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-variable-annuity-tool.ts`, `brain/*` | `TOOL-376` |';
  const m = t.match(/\| `TOOL-376` \|[^\n]+\n/);
  if (m) {
    t = t.replace(m[0], m[0] + row + '\n');
  } else {
    t += '\n' + row + '\n';
  }
  write('brain/TASKS.md', t);
  run('git add -- brain/TASKS.md');
} else console.log('TASKS already in HEAD');

for (const bf of brainFiles) {
  const src = path.join(bak, safe(bf));
  if (fs.existsSync(src)) fs.copyFileSync(src, bf);
}

console.log(run('git diff --cached --stat'));
const staged = run('git diff --cached');
if (/NewYorkOvertime|FloridaOvertimeCalculator|GeorgiaOvertimeCalculator/.test(staged)) {
  console.warn('WARN: unrelated overtime keys present in staged diff context/content');
}

try {
  console.log(
    run('git commit -m "feat(calculator): implement variable annuity calculator with FX"')
  );
} catch (e) {
  console.error(String(e.stdout || ''), String(e.stderr || ''));
  throw e;
}

console.log(run('git log -1 --format=%H%x09%s'));
for (const [p, pat] of checks) {
  if (!read(p).includes(pat)) console.warn('worktree missing after commit:', p);
  else console.log('worktree ok', p);
}
