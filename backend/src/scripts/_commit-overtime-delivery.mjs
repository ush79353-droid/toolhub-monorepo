import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function run(cmd, opts = {}) {
  console.log('>', typeof cmd === 'string' ? cmd : 'spawn');
  return execSync(cmd, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...opts,
  });
}

function head(filePath) {
  return execSync(`git show HEAD:${filePath}`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
}

/** Stage exact bytes into the index without depending on the working tree. */
function stageContents(filePath, contents) {
  const hash = execSync('git hash-object -w --stdin', {
    input: contents,
    encoding: 'utf8',
  }).trim();
  // 100644 = normal file
  run(`git update-index --add --cacheinfo 100644,${hash},${filePath}`);
  // Also write working tree so the tree isn't confusing mid-flight.
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

function insertAfter(src, needle, insert) {
  const idx = src.indexOf(needle);
  if (idx < 0) throw new Error(`needle missing: ${JSON.stringify(needle.slice(0, 120))}`);
  return src.slice(0, idx + needle.length) + insert + src.slice(idx + needle.length);
}

function ensureOvertimeKey(src) {
  if (/(^|\n|\r\n)  'OvertimeCalculator',\r?\n/.test(src)) return src;
  if (!src.includes("  'OpportunityCostCalculator',")) {
    throw new Error('OpportunityCostCalculator missing');
  }
  const next = src.replace(
    /  'OpportunityCostCalculator',\r?\n/g,
    "  'OpportunityCostCalculator',\n  'OvertimeCalculator',\n"
  );
  if (!/(^|\n|\r\n)  'OvertimeCalculator',\r?\n/.test(next)) {
    throw new Error('failed to insert OvertimeCalculator key');
  }
  return next;
}

function hasExactOvertimeEntry(src) {
  return (
    src.includes('\n  OvertimeCalculator:') ||
    src.includes('\r\n  OvertimeCalculator:') ||
    src.startsWith('OvertimeCalculator:')
  );
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

const registryFiles = [
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

const bakDir = 'backend/src/scripts/_overtime-precommit-bak';
fs.mkdirSync(bakDir, { recursive: true });
for (const f of registryFiles) {
  fs.copyFileSync(f, `${bakDir}/${f.replaceAll('/', '__')}`);
}

run('git reset');

for (const f of moduleFiles) {
  const contents = fs.readFileSync(f);
  const hash = execSync('git hash-object -w --stdin', {
    input: contents,
    encoding: 'utf8',
  }).trim();
  run(`git update-index --add --cacheinfo 100644,${hash},${f}`);
}

stageContents(
  'frontend/src/tools/registry/keys.ts',
  ensureOvertimeKey(head('frontend/src/tools/registry/keys.ts'))
);

{
  let index = head('frontend/src/tools/registry/index.ts');
  if (!hasExactOvertimeEntry(index)) {
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
  stageContents('frontend/src/tools/registry/index.ts', index);
}

{
  let details = head('frontend/src/tools/registry/details.ts');
  if (!hasExactOvertimeEntry(details)) {
    details = insertAfter(
      details,
      '  OpportunityCostCalculator: () =>\n' +
        "    import('@/tools/calculators/opportunity-cost/detail'),\n",
      '  OvertimeCalculator: () =>\n' +
        "    import('@/tools/calculators/overtime/detail'),\n"
    );
  }
  stageContents('frontend/src/tools/registry/details.ts', details);
}

function patchToolKey(filePath) {
  let s = ensureOvertimeKey(head(filePath));
  if (!s.includes("isApprovedComponentKey('OvertimeCalculator')")) {
    s = s.replace(
      /!isApprovedComponentKey\('OpportunityCostCalculator'\) \|\|\r?\n/g,
      "!isApprovedComponentKey('OpportunityCostCalculator') ||\n    !isApprovedComponentKey('OvertimeCalculator') ||\n"
    );
  }
  if (!s.includes("isApprovedComponentKey('OvertimeCalculator')")) {
    throw new Error(`assertion insert failed for ${filePath}`);
  }
  stageContents(filePath, s);
}
patchToolKey('frontend/src/tools/registry/tool.key.ts');
patchToolKey('backend/src/modules/tools/tool.key.ts');

function patchSlug(filePath) {
  let s = head(filePath);
  if (!s.includes("'overtime-calculator'")) {
    s = s.replace(
      /  'opportunity-cost-calculator',\r?\n/,
      "  'opportunity-cost-calculator',\n  'overtime-calculator',\n"
    );
  }
  if (!s.includes("'overtime-calculator'")) {
    throw new Error(`slug insert failed for ${filePath}`);
  }
  stageContents(filePath, s);
}
patchSlug('frontend/src/tools/registry/sitemap.ts');
patchSlug('frontend/src/app/sitemap.ts');
patchSlug('frontend/src/app/(website)/tools/[slug]/page.tsx');
patchSlug('frontend/src/app/embed/[slug]/page.tsx');

const staged = run('git diff --cached --name-only')
  .split(/\r?\n/)
  .filter(Boolean);
console.log('STAGED:\n' + staged.join('\n'));

for (const file of registryFiles) {
  if (!staged.includes(file) && !staged.includes(file.replaceAll('/', '\\'))) {
    // Still verify blob has overtime via git show :path
    const blob = execSync(`git show :${file}`, { encoding: 'utf8' });
    if (
      !/(^|\n|\r\n)  'OvertimeCalculator',\r?\n/.test(blob) &&
      !hasExactOvertimeEntry(blob) &&
      !blob.includes("'overtime-calculator'")
    ) {
      throw new Error(`index blob missing overtime: ${file}`);
    }
    continue;
  }
  const diff = run(`git diff --cached -- "${file}"`);
  if (
    !diff.includes("+  'OvertimeCalculator'") &&
    !diff.includes('+  OvertimeCalculator:') &&
    !diff.includes("+  'overtime-calculator'")
  ) {
    // File may already contain overtime in HEAD — confirm index blob.
    const blob = execSync(`git show :${file}`, { encoding: 'utf8' });
    if (
      !/(^|\n|\r\n)  'OvertimeCalculator',\r?\n/.test(blob) &&
      !hasExactOvertimeEntry(blob) &&
      !blob.includes("'overtime-calculator'")
    ) {
      throw new Error(`staged missing overtime in ${file}\n${diff.slice(0, 400)}`);
    }
  }
  const addedBad = diff
    .split(/\r?\n/)
    .filter((l) => l.startsWith('+') && !l.startsWith('+++'))
    .filter((l) =>
      /TexasOvertime|NewYorkOvertime|VariableAnnuity|PresentValueOfAnnuity|ImmediateAnnuity|LotteryAnnuity|texas-overtime|new-york-overtime|variable-annuity/.test(
        l
      )
    );
  if (addedBad.length) throw new Error(`staged pollution ${file}:\n` + addedBad.join('\n'));
}

run('git commit -m "feat(calculator): implement overtime calculator with FX"');
console.log('COMMIT=' + run('git rev-parse HEAD').trim());
console.log(run('git log -1 --oneline'));

for (const f of registryFiles) {
  let s = fs.readFileSync(`${bakDir}/${f.replaceAll('/', '__')}`, 'utf8');
  if (f.endsWith('keys.ts') || f.endsWith('tool.key.ts')) {
    s = ensureOvertimeKey(s);
    if (
      f.endsWith('tool.key.ts') &&
      !s.includes("isApprovedComponentKey('OvertimeCalculator')")
    ) {
      s = s.replace(
        /!isApprovedComponentKey\('OpportunityCostCalculator'\) \|\|\r?\n/g,
        "!isApprovedComponentKey('OpportunityCostCalculator') ||\n    !isApprovedComponentKey('OvertimeCalculator') ||\n"
      );
    }
  } else if (f.endsWith('index.ts') && !hasExactOvertimeEntry(s)) {
    const needleLf =
      "  OpportunityCostCalculator: lazyTool(() =>\n" +
      "    import('@/tools/calculators/opportunity-cost/OpportunityCostCalculator').then((mod) => ({\n" +
      '      default: mod.OpportunityCostCalculator,\n' +
      '    })),\n' +
      '  ),\n';
    const needleCrlf = needleLf.replaceAll('\n', '\r\n');
    const insert =
      '  OvertimeCalculator: lazyTool(() =>\n' +
      "    import('@/tools/calculators/overtime/OvertimeCalculator').then((mod) => ({\n" +
      '      default: mod.OvertimeCalculator,\n' +
      '    })),\n' +
      '  ),\n';
    if (s.includes(needleLf)) s = insertAfter(s, needleLf, insert);
    else if (s.includes(needleCrlf)) s = insertAfter(s, needleCrlf, insert.replaceAll('\n', '\r\n'));
  } else if (f.endsWith('details.ts') && !hasExactOvertimeEntry(s)) {
    const needleLf =
      '  OpportunityCostCalculator: () =>\n' +
      "    import('@/tools/calculators/opportunity-cost/detail'),\n";
    const needleCrlf = needleLf.replaceAll('\n', '\r\n');
    const insert =
      '  OvertimeCalculator: () =>\n' +
      "    import('@/tools/calculators/overtime/detail'),\n";
    if (s.includes(needleLf)) s = insertAfter(s, needleLf, insert);
    else if (s.includes(needleCrlf)) s = insertAfter(s, needleCrlf, insert.replaceAll('\n', '\r\n'));
  } else if (
    (f.includes('sitemap') || f.includes('page.tsx')) &&
    !s.includes("'overtime-calculator'")
  ) {
    s = s.replace(
      /  'opportunity-cost-calculator',\r?\n/,
      "  'opportunity-cost-calculator',\n  'overtime-calculator',\n"
    );
  }
  fs.writeFileSync(f, s);
}

console.log('restored colleague WIP with Overtime retained');
console.log(run('git status --short -- frontend/src/tools/calculators/overtime'));
console.log(run('git show --stat --oneline -1'));
