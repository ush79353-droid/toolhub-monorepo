const fs = require('fs');

function insertAfter(file, needle, insert) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(insert.trim())) {
    console.log('already:', file);
    return;
  }
  if (!s.includes(needle)) {
    throw new Error('needle missing in ' + file + ': ' + JSON.stringify(needle.slice(0, 120)));
  }
  const parts = s.split(needle);
  s = parts.join(needle + insert);
  fs.writeFileSync(file, s);
  console.log('patched', file, 'x' + (parts.length - 1));
}

insertAfter(
  'frontend/src/tools/registry/keys.ts',
  "  'TenureCalculator',\n",
  "  'TimeValueOfMoneyCalculator',\n"
);

insertAfter(
  'frontend/src/tools/registry/index.ts',
  `  TenureCalculator: lazyTool(() =>
    import('@/tools/calculators/tenure/TenureCalculator').then((mod) => ({
      default: mod.TenureCalculator,
    })),
  ),
`,
  `  TimeValueOfMoneyCalculator: lazyTool(() =>
    import('@/tools/calculators/time-value-of-money/TimeValueOfMoneyCalculator').then((mod) => ({
      default: mod.TimeValueOfMoneyCalculator,
    })),
  ),
`
);

insertAfter(
  'frontend/src/tools/registry/details.ts',
  "  TenureCalculator: () => import('@/tools/calculators/tenure/detail'),\n",
  `  TimeValueOfMoneyCalculator: () =>
    import('@/tools/calculators/time-value-of-money/detail'),
`
);

insertAfter(
  'backend/src/modules/tools/tool.key.ts',
  "  'TenureCalculator',\n",
  "  'TimeValueOfMoneyCalculator',\n"
);

insertAfter(
  'backend/src/modules/tools/tool.key.ts',
  "    !isApprovedComponentKey('TenureCalculator') ||\n",
  "    !isApprovedComponentKey('TimeValueOfMoneyCalculator') ||\n"
);

insertAfter(
  'frontend/src/app/sitemap.ts',
  "  'tenure-calculator',\n",
  "  'time-value-of-money-calculator',\n"
);

console.log('done');
