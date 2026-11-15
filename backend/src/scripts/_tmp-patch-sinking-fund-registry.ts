import { execSync } from 'node:child_process';
import fs from 'node:fs';

function show(path: string): string {
  return execSync(`git show HEAD:${path.replace(/\\/g, '/')}`, { encoding: 'utf8' });
}

function replaceAll(src: string, from: string, to: string, label: string): string {
  if (!src.includes(from)) {
    throw new Error(`Missing ${label}: ${JSON.stringify(from).slice(0, 160)}`);
  }
  return src.split(from).join(to);
}

let keys = show('frontend/src/tools/registry/keys.ts');
keys = replaceAll(
  keys,
  `  'SimpleInterestCalculator',\n  'SmokersCtcCalculator',`,
  `  'SimpleInterestCalculator',\n  'SinkingFundCalculator',\n  'SmokersCtcCalculator',`,
  'keys'
);
fs.writeFileSync('frontend/src/tools/registry/keys.ts', keys);

let tk = show('backend/src/modules/tools/tool.key.ts');
tk = replaceAll(
  tk,
  `  'SimpleInterestCalculator',\n  'SmokersCtcCalculator',`,
  `  'SimpleInterestCalculator',\n  'SinkingFundCalculator',\n  'SmokersCtcCalculator',`,
  'tool.key list'
);
tk = replaceAll(
  tk,
  `    !isApprovedComponentKey('SimpleInterestCalculator') ||\n    !isApprovedComponentKey('SmokersCtcCalculator') ||`,
  `    !isApprovedComponentKey('SimpleInterestCalculator') ||\n    !isApprovedComponentKey('SinkingFundCalculator') ||\n    !isApprovedComponentKey('SmokersCtcCalculator') ||`,
  'tool.key check'
);
fs.writeFileSync('backend/src/modules/tools/tool.key.ts', tk);

let sm = show('frontend/src/app/sitemap.ts');
sm = replaceAll(
  sm,
  `  'simple-interest-calculator',\n  'smokers-ctc-calculator',`,
  `  'simple-interest-calculator',\n  'sinking-fund-calculator',\n  'smokers-ctc-calculator',`,
  'sitemap'
);
fs.writeFileSync('frontend/src/app/sitemap.ts', sm);

let det = show('frontend/src/tools/registry/details.ts');
det = replaceAll(
  det,
  `  SimpleInterestCalculator: () =>\n    import('@/tools/calculators/simple-interest/detail'),\n  SmokersCtcCalculator:`,
  `  SimpleInterestCalculator: () =>\n    import('@/tools/calculators/simple-interest/detail'),\n  SinkingFundCalculator: () =>\n    import('@/tools/calculators/sinking-fund/detail'),\n  SmokersCtcCalculator:`,
  'details'
);
fs.writeFileSync('frontend/src/tools/registry/details.ts', det);

let idx = show('frontend/src/tools/registry/index.ts');
idx = replaceAll(
  idx,
  `  SimpleInterestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/simple-interest/SimpleInterestCalculator'
    ).then((mod) => ({
      default: mod.SimpleInterestCalculator,
    })),
  ),
  SmokersCtcCalculator:`,
  `  SimpleInterestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/simple-interest/SimpleInterestCalculator'
    ).then((mod) => ({
      default: mod.SimpleInterestCalculator,
    })),
  ),
  SinkingFundCalculator: lazyTool(() =>
    import('@/tools/calculators/sinking-fund/SinkingFundCalculator').then((mod) => ({
      default: mod.SinkingFundCalculator,
    })),
  ),
  SmokersCtcCalculator:`,
  'index'
);
fs.writeFileSync('frontend/src/tools/registry/index.ts', idx);

console.log('sinking-fund registry patch ok');
console.log(
  'keys count',
  (fs.readFileSync('frontend/src/tools/registry/keys.ts', 'utf8').match(/SinkingFundCalculator/g) || [])
    .length
);
