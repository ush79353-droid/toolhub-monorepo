import { execSync } from 'node:child_process';
import fs from 'node:fs';

function run(cmd, opts = {}) {
  console.log('>', cmd);
  return execSync(cmd, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...opts,
  });
}

function head(path) {
  return execSync(`git show HEAD:${path}`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
}

function insertAfter(src, needle, insert) {
  const idx = src.indexOf(needle);
  if (idx < 0) throw new Error(`needle missing: ${JSON.stringify(needle.slice(0, 120))}`);
  return src.slice(0, idx + needle.length) + insert + src.slice(idx + needle.length);
}

function ensurePair(src, before, after) {
  const bad = `${before}${after}`;
  const good = `${before}  'OvertimeCalculator',\n${after}`;
  if (!src.includes(bad) && !src.includes(`${before}  'OvertimeCalculator',\n${after}`)) {
    throw new Error(`pair not found: ${before.trim()} → ${after.trim()}`);
  }
  return src.split(bad).join(good);
}

const moduleFiles = [
  'frontend/src/tools/calculators/overtime/types.ts',
  'frontend/src/tools/calculators/overtime/calculation.ts',
  'frontend/src/tools/calculators/overtime/validation.ts',
  'frontend/src/tools/calculators/overtime/OvertimeForm.tsx',
  'frontend/src/tools/calculators/overtime/OvertimeCalculator.tsx',
  'frontend/src/tools/calculators/overtime/content.ts',
  'frontend/src/tools/calculators/overtime/OvertimeGuideArticle.tsx',
  'frontend/src/tools/calculators/overtime/detail.tsx',
  'backend/src/scripts/assign-overtime-tool.ts',
];
for (const f of moduleFiles) {
  if (!fs.existsSync(f)) throw new Error(`missing ${f}`);
}

// Snapshot colleague working copies to restore after commit.
const restoreTargets = [
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'frontend/src/tools/registry/details.ts',
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/tools/registry/tool.key.ts',
  'backend/src/modules/tools/tool.key.ts',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
  'frontend/src/app/sitemap.ts',
];
const bakDir = '.tmp-overtime-iso/precommit-bak';
fs.mkdirSync(bakDir, { recursive: true });
for (const f of restoreTargets) {
  fs.copyFileSync(f, `${bakDir}/${f.replaceAll('/', '__').replaceAll('\\', '__')}`);
}

// Clean overtime-only patches from HEAD.
let keys = head('frontend/src/tools/registry/keys.ts');
keys = ensurePair(
  keys,
  "  'OpportunityCostCalculator',\n",
  "  'ParkingRatioCalculator',\n"
);
if ((keys.match(/'OvertimeCalculator'/g) || []).length !== 2) {
  throw new Error('keys Overtime count');
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

// Verify no pollution tokens in the clean files beyond known state overtime siblings already in HEAD.
for (const file of restoreTargets) {
  const diff = run(`git diff HEAD -- "${file}"`);
  const added = diff
    .split(/\r?\n/)
    .filter((l) => l.startsWith('+') && !l.startsWith('+++'));
  for (const line of added) {
    if (
      /TexasOvertime|NewYorkOvertime|VariableAnnuity|PresentValueOfAnnuity|ImmediateAnnuity|LotteryAnnuity/.test(
        line
      ) &&
      !/OvertimeCalculator/.test(line)
    ) {
      throw new Error(`pollution in ${file}: ${line}`);
    }
  }
  if (!diff.includes('OvertimeCalculator') && !diff.includes('overtime-calculator')) {
    throw new Error(`no overtime addition in ${file}`);
  }
}

run('git reset');
const toAdd = [
  ...moduleFiles,
  ...restoreTargets,
];
for (const p of toAdd) {
  run(`git add -- "${p}"`);
}

const staged = run('git diff --cached --name-only')
  .split(/\r?\n/)
  .filter(Boolean);
console.log('STAGED:\n' + staged.join('\n'));
for (const p of staged) {
  if (
    !p.includes('overtime') &&
    !p.includes('Overtime') &&
    !restoreTargets.includes(p.replaceAll('\\', '/'))
  ) {
    throw new Error(`unexpected staged: ${p}`);
  }
}

// Re-check staged diffs are overtime-only additions.
for (const file of restoreTargets) {
  const diff = run(`git diff --cached -- "${file}"`);
  const addedBad = diff
    .split(/\r?\n/)
    .filter((l) => l.startsWith('+') && !l.startsWith('+++'))
    .filter(
      (l) =>
        /TexasOvertime|NewYorkOvertime|VariableAnnuity|PresentValueOfAnnuity|ImmediateAnnuity|LotteryAnnuity|california-overtime|florida-overtime|georgia-overtime|illinois-overtime|texas-overtime|new-york-overtime|variable-annuity/.test(
          l
        ) && !/OvertimeCalculator|overtime-calculator/.test(l)
    );
  if (addedBad.length) throw new Error(`staged pollution ${file}:\n` + addedBad.join('\n'));
}

run('git commit -m "feat(calculator): implement overtime calculator with FX"');
const hash = run('git rev-parse HEAD').trim();
console.log('COMMIT=' + hash);

// Restore colleague working copies and ensure Overtime remains present.
for (const f of restoreTargets) {
  const bak = `${bakDir}/${f.replaceAll('/', '__').replaceAll('\\', '__')}`;
  let s = fs.readFileSync(bak, 'utf8');
  if (f.endsWith('keys.ts') || f.endsWith('tool.key.ts')) {
    s = ensurePair(
      s.includes("  'OpportunityCostCalculator',\n  'ParkingRatioCalculator',\n")
        ? s
        : s, // may already have Overtime
      "  'OpportunityCostCalculator',\n",
      "  'ParkingRatioCalculator',\n"
    );
    // ensurePair is idempotent if Overtime already between them via split/join of absent bad pair
    if (
      s.includes("  'OpportunityCostCalculator',\n  'ParkingRatioCalculator',\n")
    ) {
      s = s.replaceAll(
        "  'OpportunityCostCalculator',\n  'ParkingRatioCalculator',\n",
        "  'OpportunityCostCalculator',\n  'OvertimeCalculator',\n  'ParkingRatioCalculator',\n"
      );
    }
    if (
      f.endsWith('tool.key.ts') &&
      !s.includes("isApprovedComponentKey('OvertimeCalculator')")
    ) {
      s = insertAfter(
        s,
        "    !isApprovedComponentKey('OpportunityCostCalculator') ||\n",
        "    !isApprovedComponentKey('OvertimeCalculator') ||\n"
      );
    }
  } else if (f.endsWith('index.ts') && !s.includes('OvertimeCalculator:')) {
    if (s.includes('OpportunityCostCalculator: lazyTool')) {
      s = insertAfter(
        s,
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
  } else if (f.endsWith('details.ts') && !s.includes('OvertimeCalculator:')) {
    s = insertAfter(
      s,
      '  OpportunityCostCalculator: () =>\n' +
        "    import('@/tools/calculators/opportunity-cost/detail'),\n",
      '  OvertimeCalculator: () =>\n' +
        "    import('@/tools/calculators/overtime/detail'),\n"
    );
  } else if (
    (f.includes('sitemap') || f.includes('page.tsx')) &&
    !s.includes("'overtime-calculator'")
  ) {
    if (s.includes("  'opportunity-cost-calculator',\n")) {
      s = insertAfter(
        s,
        "  'opportunity-cost-calculator',\n",
        "  'overtime-calculator',\n"
      );
    }
  }
  fs.writeFileSync(f, s);
}

console.log('restored colleague WIP with Overtime retained');
console.log(run('git log -1 --oneline'));
console.log(run('git status --short -- frontend/src/tools/calculators/overtime'));
