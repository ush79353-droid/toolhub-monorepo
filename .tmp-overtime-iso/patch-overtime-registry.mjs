import { execSync } from 'node:child_process';
import fs from 'node:fs';

function head(path) {
  return execSync(`git show HEAD:${path}`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
}

function insertAfter(src, needle, insert) {
  const idx = src.indexOf(needle);
  if (idx < 0) throw new Error(`needle missing: ${JSON.stringify(needle.slice(0, 80))}`);
  return src.slice(0, idx + needle.length) + insert + src.slice(idx + needle.length);
}

function ensurePair(src, before, after) {
  const bad = `${before}${after}`;
  const good = `${before}  'OvertimeCalculator',\n${after}`;
  if (src.includes(`'OvertimeCalculator'`)) {
    // still fix Opportunity→Parking gaps without Overtime
  }
  return src.split(bad).join(good);
}

let keys = head('frontend/src/tools/registry/keys.ts');
keys = ensurePair(
  keys,
  "  'OpportunityCostCalculator',\n",
  "  'ParkingRatioCalculator',\n"
);
const keysOt = (keys.match(/'OvertimeCalculator'/g) || []).length;
if (keysOt !== 2) throw new Error(`expected 2 OvertimeCalculator in keys, got ${keysOt}`);
fs.writeFileSync('frontend/src/tools/registry/keys.ts', keys);

let index = head('frontend/src/tools/registry/index.ts');
if (!index.includes('OvertimeCalculator:')) {
  const needle =
    "  OpportunityCostCalculator: lazyTool(() =>\n" +
    "    import('@/tools/calculators/opportunity-cost/OpportunityCostCalculator').then((mod) => ({\n" +
    '      default: mod.OpportunityCostCalculator,\n' +
    '    })),\n' +
    '  ),\n';
  const insert =
    '  OvertimeCalculator: lazyTool(() =>\n' +
    "    import('@/tools/calculators/overtime/OvertimeCalculator').then((mod) => ({\n" +
    '      default: mod.OvertimeCalculator,\n' +
    '    })),\n' +
    '  ),\n';
  index = insertAfter(index, needle, insert);
}
fs.writeFileSync('frontend/src/tools/registry/index.ts', index);

let details = head('frontend/src/tools/registry/details.ts');
if (!details.includes('OvertimeCalculator:')) {
  const needle =
    '  OpportunityCostCalculator: () =>\n' +
    "    import('@/tools/calculators/opportunity-cost/detail'),\n";
  const insert =
    '  OvertimeCalculator: () =>\n' +
    "    import('@/tools/calculators/overtime/detail'),\n";
  details = insertAfter(details, needle, insert);
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

function patchSlugList(path, needle) {
  let s = head(path);
  if (!s.includes("'overtime-calculator'")) {
    s = insertAfter(s, needle, "  'overtime-calculator',\n");
  }
  fs.writeFileSync(path, s);
}
patchSlugList(
  'frontend/src/tools/registry/sitemap.ts',
  "  'opportunity-cost-calculator',\n"
);
patchSlugList('frontend/src/app/sitemap.ts', "  'opportunity-cost-calculator',\n");
patchSlugList(
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  "  'opportunity-cost-calculator',\n"
);
patchSlugList(
  'frontend/src/app/embed/[slug]/page.tsx',
  "  'opportunity-cost-calculator',\n"
);

console.log(
  JSON.stringify(
    {
      keysOt: (fs.readFileSync('frontend/src/tools/registry/keys.ts', 'utf8').match(
        /'OvertimeCalculator'/g
      ) || []).length,
      indexOt: fs
        .readFileSync('frontend/src/tools/registry/index.ts', 'utf8')
        .includes('OvertimeCalculator:'),
      detailsOt: fs
        .readFileSync('frontend/src/tools/registry/details.ts', 'utf8')
        .includes('OvertimeCalculator:'),
      beOt: fs
        .readFileSync('backend/src/modules/tools/tool.key.ts', 'utf8')
        .includes("'OvertimeCalculator'"),
      feToolOt: fs
        .readFileSync('frontend/src/tools/registry/tool.key.ts', 'utf8')
        .includes("'OvertimeCalculator'"),
      fx: fs
        .readFileSync('frontend/src/app/(website)/tools/[slug]/page.tsx', 'utf8')
        .includes("'overtime-calculator'"),
      embed: fs
        .readFileSync('frontend/src/app/embed/[slug]/page.tsx', 'utf8')
        .includes("'overtime-calculator'"),
      smApp: fs
        .readFileSync('frontend/src/app/sitemap.ts', 'utf8')
        .includes("'overtime-calculator'"),
      smReg: fs
        .readFileSync('frontend/src/tools/registry/sitemap.ts', 'utf8')
        .includes("'overtime-calculator'"),
    },
    null,
    2
  )
);
