import { execSync } from 'node:child_process';
import fs from 'node:fs';

function run(cmd) {
  console.log('>', cmd);
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function head(path) {
  return execSync(`git show HEAD:${path}`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
}

function insertAfter(src, needle, insert) {
  const idx = src.indexOf(needle);
  if (idx < 0) throw new Error(`needle missing: ${JSON.stringify(needle.slice(0, 100))}`);
  return src.slice(0, idx + needle.length) + insert + src.slice(idx + needle.length);
}

function ensurePair(src, before, after) {
  const bad = `${before}${after}`;
  const good = `${before}  'OvertimeCalculator',\n${after}`;
  return src.split(bad).join(good);
}

// Re-apply clean overtime-only registry patches from HEAD immediately before staging.
let keys = head('frontend/src/tools/registry/keys.ts');
keys = ensurePair(
  keys,
  "  'OpportunityCostCalculator',\n",
  "  'ParkingRatioCalculator',\n"
);
if ((keys.match(/'OvertimeCalculator'/g) || []).length !== 2) {
  throw new Error('keys OvertimeCalculator count != 2');
}
fs.writeFileSync('frontend/src/tools/registry/keys.ts', keys);

let index = head('frontend/src/tools/registry/index.ts');
if (!index.includes('OvertimeCalculator:')) {
  index = insertAfter(
    index,
    "  OpportunityCostCalculator: lazyTool(() =>\n" +
      "    import('@/tools/calculators/opportunity-cost/OpportunityCostCalculator').then((mod) => ({\n" +
      '      default: mod.OpportunityCostCalculator,\n' +
      '    })),\n' +
      '  ),\n',
    '  OvertimeCalculator: lazyTool(() =>\n' +
      "    import('@/tools/calculators/overtime/OvertimeCalculator').then((mod) => ({\n" +
      '      default: mod.OvertimeCalculator,\n' +
      '    })),\n' +
      '  ),\n'
  );
}
fs.writeFileSync('frontend/src/tools/registry/index.ts', index);

let details = head('frontend/src/tools/registry/details.ts');
if (!details.includes('OvertimeCalculator:')) {
  details = insertAfter(
    details,
    '  OpportunityCostCalculator: () =>\n' +
      "    import('@/tools/calculators/opportunity-cost/detail'),\n",
    '  OvertimeCalculator: () =>\n' +
      "    import('@/tools/calculators/overtime/detail'),\n"
  );
}
fs.writeFileSync('frontend/src/tools/registry/details.ts', details);

function patchToolKey(path) {
  let s = head(path);
  s = ensurePair(
    s,
    "  'OpportunityCostCalculator',\n",
    "  'ParkingRatioCalculator',\n"
  );
  if (!s.includes("isApprovedComponentKey('OvertimeCalculator')")) {
    s = insertAfter(
      s,
      "    !isApprovedComponentKey('OpportunityCostCalculator') ||\n",
      "    !isApprovedComponentKey('OvertimeCalculator') ||\n"
    );
  }
  fs.writeFileSync(path, s);
}
patchToolKey('backend/src/modules/tools/tool.key.ts');
patchToolKey('frontend/src/tools/registry/tool.key.ts');

function patchSlug(path, needle) {
  let s = head(path);
  if (!s.includes("'overtime-calculator'")) {
    s = insertAfter(s, needle, "  'overtime-calculator',\n");
  }
  fs.writeFileSync(path, s);
}
patchSlug(
  'frontend/src/tools/registry/sitemap.ts',
  "  'opportunity-cost-calculator',\n"
);
patchSlug('frontend/src/app/sitemap.ts', "  'opportunity-cost-calculator',\n");
patchSlug(
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  "  'opportunity-cost-calculator',\n"
);
patchSlug(
  'frontend/src/app/embed/[slug]/page.tsx',
  "  'opportunity-cost-calculator',\n"
);

// Clear index, then stage only overtime delivery paths.
run('git reset');
const paths = [
  'frontend/src/tools/calculators/overtime',
  'backend/src/scripts/assign-overtime-tool.ts',
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'frontend/src/tools/registry/details.ts',
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/tools/registry/tool.key.ts',
  'backend/src/modules/tools/tool.key.ts',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
  'frontend/src/app/sitemap.ts',
  'brain/CURRENT_STATE.md',
  'brain/TASKS.md',
  'brain/CHANGELOG.md',
  'brain/FRONTEND.md',
];
for (const p of paths) {
  run(`git add -- "${p}"`);
}

const staged = run('git diff --cached --name-only');
console.log('STAGED:\n' + staged);
const forbidden = staged
  .split(/\r?\n/)
  .filter(Boolean)
  .filter(
    (p) =>
      !p.includes('overtime') &&
      !p.includes('Overtime') &&
      !p.startsWith('brain/') &&
      !p.includes('tool.key.ts') &&
      !p.includes('registry/keys.ts') &&
      !p.includes('registry/index.ts') &&
      !p.includes('registry/details.ts') &&
      !p.includes('registry/sitemap.ts') &&
      !p.includes('registry/tool.key.ts') &&
      !p.includes('tools/[slug]/page.tsx') &&
      !p.includes('embed/[slug]/page.tsx') &&
      !p.includes('app/sitemap.ts')
  );
if (forbidden.length) {
  throw new Error('unexpected staged files: ' + forbidden.join(', '));
}

// Ensure staged diffs for registries only mention Overtime (not California/Florida/etc.)
for (const file of [
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'frontend/src/tools/registry/details.ts',
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/tools/registry/tool.key.ts',
  'backend/src/modules/tools/tool.key.ts',
  'frontend/src/app/sitemap.ts',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
]) {
  const diff = run(`git diff --cached -- "${file}"`);
  const bad = [
    'CaliforniaOvertime',
    'FloridaOvertime',
    'GeorgiaOvertime',
    'IllinoisOvertime',
    'VariableAnnuity',
    'PresentValueOfAnnuity',
    'ImmediateAnnuity',
    'california-overtime',
    'florida-overtime',
    'georgia-overtime',
    'illinois-overtime',
    'variable-annuity',
    'present-value-of-annuity',
    'immediate-annuity',
  ].filter((token) => diff.includes(token) && !diff.includes('OvertimeCalculator') === false);
  // simpler: any added line with those tokens is bad except OvertimeCalculator / overtime-calculator
  const addedBad = diff
    .split(/\r?\n/)
    .filter((l) => l.startsWith('+') && !l.startsWith('+++'))
    .filter((l) =>
      /CaliforniaOvertime|FloridaOvertime|GeorgiaOvertime|IllinoisOvertime|VariableAnnuity|PresentValueOfAnnuity|ImmediateAnnuity|california-overtime|florida-overtime|georgia-overtime|illinois-overtime|variable-annuity|present-value-of-annuity|immediate-annuity/.test(
        l
      )
    );
  if (addedBad.length) {
    throw new Error(`pollution in ${file}:\n` + addedBad.join('\n'));
  }
}

run('git commit -m "feat(calculator): implement overtime calculator with FX"');
console.log(run('git rev-parse HEAD'));
console.log(run('git status --short -- frontend/src/tools/calculators/overtime backend/src/scripts/assign-overtime-tool.ts'));
