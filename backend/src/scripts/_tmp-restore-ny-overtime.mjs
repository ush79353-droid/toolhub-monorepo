import { execSync } from 'child_process';
import fs from 'fs';

function detectNl(s) {
  return s.includes('\r\n') ? '\r\n' : '\n';
}
function insertOnce(file, needleFactory, insertFactory, label, before = true) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(label)) {
    console.log('skip', file, label);
    return;
  }
  const nl = detectNl(s);
  const needle = needleFactory(nl);
  const insert = insertFactory(nl);
  if (!s.includes(needle)) {
    throw new Error(`missing needle in ${file}: ${JSON.stringify(needle)}`);
  }
  fs.writeFileSync(
    file,
    s.split(needle).join(before ? insert + needle : needle + insert)
  );
  console.log('restored into', file);
}

insertOnce(
  'frontend/src/tools/registry/keys.ts',
  (nl) => `  'NopatCalculator',${nl}`,
  (nl) => `  'NewYorkOvertimeCalculator',${nl}`,
  'NewYorkOvertimeCalculator'
);
insertOnce(
  'frontend/src/tools/registry/tool.key.ts',
  (nl) => `  'NopatCalculator',${nl}`,
  (nl) => `  'NewYorkOvertimeCalculator',${nl}`,
  "'NewYorkOvertimeCalculator'"
);
insertOnce(
  'backend/src/modules/tools/tool.key.ts',
  (nl) => `  'NopatCalculator',${nl}`,
  (nl) => `  'NewYorkOvertimeCalculator',${nl}`,
  "'NewYorkOvertimeCalculator'"
);
insertOnce(
  'frontend/src/tools/registry/tool.key.ts',
  (nl) => `    !isApprovedComponentKey('NopatCalculator') ||${nl}`,
  (nl) => `    !isApprovedComponentKey('NewYorkOvertimeCalculator') ||${nl}`,
  "isApprovedComponentKey('NewYorkOvertimeCalculator')"
);
insertOnce(
  'backend/src/modules/tools/tool.key.ts',
  (nl) => `    !isApprovedComponentKey('NopatCalculator') ||${nl}`,
  (nl) => `    !isApprovedComponentKey('NewYorkOvertimeCalculator') ||${nl}`,
  "isApprovedComponentKey('NewYorkOvertimeCalculator')"
);

insertOnce(
  'frontend/src/tools/registry/index.ts',
  (nl) =>
    `  NopatCalculator: lazyTool(() =>${nl}` +
    `    import('@/tools/calculators/nopat/NopatCalculator').then((mod) => ({${nl}` +
    `      default: mod.NopatCalculator,${nl}` +
    `    })),${nl}` +
    `  ),${nl}`,
  (nl) =>
    `  NewYorkOvertimeCalculator: lazyTool(() =>${nl}` +
    `    import(${nl}` +
    `      '@/tools/calculators/new-york-overtime/NewYorkOvertimeCalculator'${nl}` +
    `    ).then((mod) => ({${nl}` +
    `      default: mod.NewYorkOvertimeCalculator,${nl}` +
    `    })),${nl}` +
    `  ),${nl}`,
  'NewYorkOvertimeCalculator:'
);

insertOnce(
  'frontend/src/tools/registry/details.ts',
  (nl) => `  NopatCalculator: () =>${nl}`,
  (nl) =>
    `  NewYorkOvertimeCalculator: () =>${nl}` +
    `    import('@/tools/calculators/new-york-overtime/detail'),${nl}`,
  'NewYorkOvertimeCalculator:'
);

for (const f of [
  'frontend/src/app/sitemap.ts',
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
]) {
  insertOnce(
    f,
    (nl) => `  'nopat-calculator',${nl}`,
    (nl) => `  'new-york-overtime-calculator',${nl}`,
    'new-york-overtime-calculator'
  );
}

if (!fs.readFileSync('frontend/src/tools/registry/keys.ts', 'utf8').includes('TexasOvertimeCalculator')) {
  throw new Error('Texas key missing after restore');
}
if (!fs.readFileSync('frontend/src/tools/registry/keys.ts', 'utf8').includes('NewYorkOvertimeCalculator')) {
  throw new Error('NY key still missing');
}

const files = [
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'frontend/src/tools/registry/details.ts',
  'frontend/src/tools/registry/tool.key.ts',
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/app/sitemap.ts',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
  'backend/src/modules/tools/tool.key.ts',
];
execSync('git add ' + files.map((f) => JSON.stringify(f)).join(' '), {
  stdio: 'inherit',
  shell: true,
});
execSync(
  'git commit -m "fix(registry): restore New York overtime keys after Texas OT"',
  { stdio: 'inherit', shell: true }
);
console.log('COMMIT', execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim());
