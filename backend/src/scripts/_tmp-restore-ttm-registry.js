const fs = require('fs');

function insertAfter(file, needle, insert) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(insert.trim())) {
    console.log('already:', file);
    return;
  }
  if (!s.includes(needle)) {
    throw new Error('needle missing in ' + file);
  }
  fs.writeFileSync(file, s.split(needle).join(needle + insert));
  console.log('patched', file);
}

insertAfter(
  'frontend/src/tools/registry/keys.ts',
  "  'TimeValueOfMoneyCalculator',\n",
  "  'TtmCalculator',\n"
);

insertAfter(
  'frontend/src/tools/registry/index.ts',
  `  TimeValueOfMoneyCalculator: lazyTool(() =>
    import('@/tools/calculators/time-value-of-money/TimeValueOfMoneyCalculator').then((mod) => ({
      default: mod.TimeValueOfMoneyCalculator,
    })),
  ),
`,
  `  TtmCalculator: lazyTool(() =>
    import('@/tools/calculators/ttm/TtmCalculator').then((mod) => ({
      default: mod.TtmCalculator,
    })),
  ),
`
);

insertAfter(
  'frontend/src/tools/registry/details.ts',
  `  TimeValueOfMoneyCalculator: () =>
    import('@/tools/calculators/time-value-of-money/detail'),
`,
  "  TtmCalculator: () => import('@/tools/calculators/ttm/detail'),\n"
);

insertAfter(
  'backend/src/modules/tools/tool.key.ts',
  "  'TimeValueOfMoneyCalculator',\n",
  "  'TtmCalculator',\n"
);

insertAfter(
  'backend/src/modules/tools/tool.key.ts',
  "    !isApprovedComponentKey('TimeValueOfMoneyCalculator') ||\n",
  "    !isApprovedComponentKey('TtmCalculator') ||\n"
);

insertAfter(
  'frontend/src/app/sitemap.ts',
  "  'time-value-of-money-calculator',\n",
  "  'ttm-calculator-trailing-twelve-months',\n"
);

console.log('done');
