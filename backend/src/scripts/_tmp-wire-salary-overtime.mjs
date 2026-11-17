import fs from 'node:fs';

function nlOf(s) {
  return s.includes('\r\n') ? '\r\n' : '\n';
}

function mustInclude(s, needle, file) {
  if (!s.includes(needle)) {
    throw new Error(`needle missing in ${file}: ${JSON.stringify(needle)}`);
  }
}

function patchPair(file, before, after, middle, { expectedCount = 1 } = {}) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(middle) || s.includes('SalaryWithOvertimeCalculator')) {
    console.log('SKIP already', file);
    return s;
  }
  const nl = nlOf(s);
  const needle = `${before}${nl}${after}`;
  const insert = `${before}${nl}${middle}${nl}${after}`;
  const count = s.split(needle).length - 1;
  if (count !== expectedCount) {
    throw new Error(`${file}: expected ${expectedCount} of ${JSON.stringify(needle)}, got ${count}`);
  }
  s = s.split(needle).join(insert);
  fs.writeFileSync(file, s);
  console.log('OK', file, `x${expectedCount}`);
  return s;
}

// keys.ts — both lists
patchPair(
  'frontend/src/tools/registry/keys.ts',
  "  'SafetyStockCalculator',",
  "  'SalesCommissionCalculator',",
  "  'SalaryWithOvertimeCalculator',",
  { expectedCount: 2 }
);

// index.ts
{
  const file = 'frontend/src/tools/registry/index.ts';
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('SalaryWithOvertimeCalculator')) {
    console.log('SKIP index');
  } else {
    const nl = nlOf(s);
    const needle = [
      '  SafetyStockCalculator: lazyTool(() =>',
      "    import('@/tools/calculators/safety-stock/SafetyStockCalculator').then((mod) => ({",
      '      default: mod.SafetyStockCalculator,',
      '    })),',
      '  ),',
      '  SalesCommissionCalculator:',
    ].join(nl);
    const insert = [
      '  SafetyStockCalculator: lazyTool(() =>',
      "    import('@/tools/calculators/safety-stock/SafetyStockCalculator').then((mod) => ({",
      '      default: mod.SafetyStockCalculator,',
      '    })),',
      '  ),',
      '  SalaryWithOvertimeCalculator: lazyTool(() =>',
      "    import('@/tools/calculators/salary-with-overtime/SalaryWithOvertimeCalculator').then(",
      '      (mod) => ({',
      '        default: mod.SalaryWithOvertimeCalculator,',
      '      })',
      '    )',
      '  ),',
      '  SalesCommissionCalculator:',
    ].join(nl);
    mustInclude(s, needle, file);
    s = s.replace(needle, insert);
    fs.writeFileSync(file, s);
    console.log('OK index');
  }
}

// details.ts
{
  const file = 'frontend/src/tools/registry/details.ts';
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('SalaryWithOvertimeCalculator')) {
    console.log('SKIP details');
  } else {
    const nl = nlOf(s);
    const needle = [
      '  SafetyStockCalculator: () =>',
      "    import('@/tools/calculators/safety-stock/detail'),",
      '  SalesCommissionCalculator:',
    ].join(nl);
    const insert = [
      '  SafetyStockCalculator: () =>',
      "    import('@/tools/calculators/safety-stock/detail'),",
      '  SalaryWithOvertimeCalculator: () =>',
      "    import('@/tools/calculators/salary-with-overtime/detail'),",
      '  SalesCommissionCalculator:',
    ].join(nl);
    mustInclude(s, needle, file);
    s = s.replace(needle, insert);
    fs.writeFileSync(file, s);
    console.log('OK details');
  }
}

// backend tool.key.ts list + selfcheck
{
  const file = 'backend/src/modules/tools/tool.key.ts';
  patchPair(
    file,
    "  'SafetyStockCalculator',",
    "  'SalesCommissionCalculator',",
    "  'SalaryWithOvertimeCalculator',",
    { expectedCount: 1 }
  );
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes("isApprovedComponentKey('SalaryWithOvertimeCalculator')")) {
    console.log('SKIP backend selfcheck');
  } else {
    const nl = nlOf(s);
    const needle = [
      "    !isApprovedComponentKey('SafetyStockCalculator') ||",
      "    !isApprovedComponentKey('SalesCommissionCalculator') ||",
    ].join(nl);
    const insert = [
      "    !isApprovedComponentKey('SafetyStockCalculator') ||",
      "    !isApprovedComponentKey('SalaryWithOvertimeCalculator') ||",
      "    !isApprovedComponentKey('SalesCommissionCalculator') ||",
    ].join(nl);
    mustInclude(s, needle, file);
    s = s.replace(needle, insert);
    fs.writeFileSync(file, s);
    console.log('OK backend selfcheck');
  }
}

// frontend registry tool.key.ts
{
  const file = 'frontend/src/tools/registry/tool.key.ts';
  if (fs.existsSync(file)) {
    patchPair(
      file,
      "  'SafetyStockCalculator',",
      "  'SalesCommissionCalculator',",
      "  'SalaryWithOvertimeCalculator',",
      { expectedCount: 1 }
    );
    let s = fs.readFileSync(file, 'utf8');
    if (s.includes("isApprovedComponentKey('SalaryWithOvertimeCalculator')")) {
      console.log('SKIP fe tool.key selfcheck');
    } else {
      const nl = nlOf(s);
      const needle = [
        "    !isApprovedComponentKey('SafetyStockCalculator') ||",
        "    !isApprovedComponentKey('SalesCommissionCalculator') ||",
      ].join(nl);
      const insert = [
        "    !isApprovedComponentKey('SafetyStockCalculator') ||",
        "    !isApprovedComponentKey('SalaryWithOvertimeCalculator') ||",
        "    !isApprovedComponentKey('SalesCommissionCalculator') ||",
      ].join(nl);
      if (s.includes(needle)) {
        s = s.replace(needle, insert);
        fs.writeFileSync(file, s);
        console.log('OK fe tool.key selfcheck');
      } else console.log('WARN fe tool.key selfcheck needle missing');
    }
  }
}

// sitemap + FX
for (const file of [
  'frontend/src/app/sitemap.ts',
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
]) {
  if (!fs.existsSync(file)) continue;
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes("'salary-calculator-with-overtime'")) {
    console.log('SKIP slug', file);
    continue;
  }
  const nl = nlOf(s);
  const needle = `  'sales-commission-calculator',`;
  mustInclude(s, needle, file);
  s = s.replace(
    needle,
    `  'salary-calculator-with-overtime',${nl}  'sales-commission-calculator',`
  );
  fs.writeFileSync(file, s);
  console.log('OK slug', file);
}

// verify
const checks = [
  ['frontend/src/tools/registry/keys.ts', 'SalaryWithOvertimeCalculator', 2],
  ['frontend/src/tools/registry/index.ts', 'SalaryWithOvertimeCalculator', 1],
  ['frontend/src/tools/registry/details.ts', 'SalaryWithOvertimeCalculator', 1],
  ['backend/src/modules/tools/tool.key.ts', 'SalaryWithOvertimeCalculator', 2],
  ['frontend/src/app/sitemap.ts', 'salary-calculator-with-overtime', 1],
  [
    'frontend/src/app/(website)/tools/[slug]/page.tsx',
    'salary-calculator-with-overtime',
    1,
  ],
  [
    'frontend/src/app/embed/[slug]/page.tsx',
    'salary-calculator-with-overtime',
    1,
  ],
];
for (const [file, token, min] of checks) {
  const n = fs.readFileSync(file, 'utf8').split(token).length - 1;
  console.log(`VERIFY ${file}: ${token} x${n}`);
  if (n < min) throw new Error(`missing ${token} in ${file}`);
}
console.log('DONE wire');
