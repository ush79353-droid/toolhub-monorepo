import fs from 'fs';

function detectNl(s) {
  return s.includes('\r\n') ? '\r\n' : '\n';
}

function insertOnce(file, needleFactory, insertFactory, label) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(label)) {
    console.log('skip exists', file, label);
    return;
  }
  const nl = detectNl(s);
  const needle = needleFactory(nl);
  const insert = insertFactory(nl);
  if (!s.includes(needle)) {
    throw new Error(`missing needle in ${file}: ${JSON.stringify(needle)}`);
  }
  s = s.split(needle).join(needle + insert);
  fs.writeFileSync(file, s);
  console.log('patched', file);
}

insertOnce(
  'frontend/src/tools/registry/keys.ts',
  (nl) => `  'PresentValueCalculator',${nl}`,
  (nl) => `  'PresentValueOfAnnuityCalculator',${nl}`,
  'PresentValueOfAnnuityCalculator'
);
insertOnce(
  'frontend/src/tools/registry/tool.key.ts',
  (nl) => `  'PresentValueCalculator',${nl}`,
  (nl) => `  'PresentValueOfAnnuityCalculator',${nl}`,
  "'PresentValueOfAnnuityCalculator'"
);
insertOnce(
  'backend/src/modules/tools/tool.key.ts',
  (nl) => `  'PresentValueCalculator',${nl}`,
  (nl) => `  'PresentValueOfAnnuityCalculator',${nl}`,
  "'PresentValueOfAnnuityCalculator'"
);

insertOnce(
  'frontend/src/tools/registry/tool.key.ts',
  (nl) => `    !isApprovedComponentKey('PresentValueCalculator') ||${nl}`,
  (nl) => `    !isApprovedComponentKey('PresentValueOfAnnuityCalculator') ||${nl}`,
  "isApprovedComponentKey('PresentValueOfAnnuityCalculator')"
);
insertOnce(
  'backend/src/modules/tools/tool.key.ts',
  (nl) => `    !isApprovedComponentKey('PresentValueCalculator') ||${nl}`,
  (nl) => `    !isApprovedComponentKey('PresentValueOfAnnuityCalculator') ||${nl}`,
  "isApprovedComponentKey('PresentValueOfAnnuityCalculator')"
);

insertOnce(
  'frontend/src/tools/registry/index.ts',
  (nl) =>
    `  PresentValueCalculator: lazyTool(() =>${nl}` +
    `    import('@/tools/calculators/present-value/PresentValueCalculator').then((mod) => ({${nl}` +
    `      default: mod.PresentValueCalculator,${nl}` +
    `    })),${nl}` +
    `  ),${nl}`,
  (nl) =>
    `  PresentValueOfAnnuityCalculator: lazyTool(() =>${nl}` +
    `    import(${nl}` +
    `      '@/tools/calculators/present-value-of-annuity/PresentValueOfAnnuityCalculator'${nl}` +
    `    ).then((mod) => ({${nl}` +
    `      default: mod.PresentValueOfAnnuityCalculator,${nl}` +
    `    })),${nl}` +
    `  ),${nl}`,
  'PresentValueOfAnnuityCalculator:'
);

insertOnce(
  'frontend/src/tools/registry/details.ts',
  (nl) =>
    `  PresentValueCalculator: () =>${nl}` +
    `    import('@/tools/calculators/present-value/detail'),${nl}`,
  (nl) =>
    `  PresentValueOfAnnuityCalculator: () =>${nl}` +
    `    import('@/tools/calculators/present-value-of-annuity/detail'),${nl}`,
  'PresentValueOfAnnuityCalculator:'
);

for (const f of [
  'frontend/src/app/sitemap.ts',
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
]) {
  insertOnce(
    f,
    (nl) => `  'present-value-calculator',${nl}`,
    (nl) => `  'present-value-of-annuity-calculator',${nl}`,
    'present-value-of-annuity-calculator'
  );
}

console.log('done');
