const fs = require('fs');

const KEY = 'ValueAtRiskCalculator';
const SLUG = 'value-at-risk-calculator-var';

function patch(file, transform) {
  const s = fs.readFileSync(file, 'utf8');
  const next = transform(s);
  if (next === null) {
    console.error('FAIL', file);
    process.exitCode = 1;
    return;
  }
  if (next === s) console.log('unchanged', file);
  else {
    fs.writeFileSync(file, next);
    console.log('updated', file);
  }
}

patch('frontend/src/tools/registry/keys.ts', (s) => {
  const nl = s.includes('\r\n') ? '\r\n' : '\n';
  let out = s;
  const approvedEnd = out.indexOf('export type ApprovedComponentKey');
  if (!out.slice(0, approvedEnd).includes(`'${KEY}'`)) {
    const needle = `  'SavingsInterestRateCalculator',${nl}] as const;`;
    if (!out.slice(0, approvedEnd).includes(needle)) return null;
    out = out.replace(needle, `  'SavingsInterestRateCalculator',${nl}  '${KEY}',${nl}] as const;`);
  }
  const regStart = out.indexOf('REGISTERED_COMPONENT_KEYS');
  const regEnd = out.indexOf('export type RegisteredComponentKey');
  const reg = out.slice(regStart, regEnd);
  if (!reg.includes(`'${KEY}'`)) {
    const needle = `  'SavingsInterestRateCalculator',${nl}] as const;`;
    if (!reg.includes(needle)) return null;
    out =
      out.slice(0, regStart) +
      reg.replace(needle, `  'SavingsInterestRateCalculator',${nl}  '${KEY}',${nl}] as const;`) +
      out.slice(regEnd);
  }
  return out;
});

patch('frontend/src/tools/registry/index.ts', (s) => {
  let out = s;
  const nl = out.includes('\r\n') ? '\r\n' : '\n';

  // Fix broken JensensAlpha / SavingsInterestRate block if present
  const broken = `  JensensAlphaCalculator: lazyTool(() =>${nl}    import(${nl}      '@/tools/calculators/jensens-alpha/JensensAlphaCalculator'${nl}    ).then((mod) => ({${nl}      default: mod.JensensAlphaCalculator,${nl}    })),${nl}  SavingsInterestRateCalculator: lazyTool(() =>${nl}    import(${nl}      '@/tools/calculators/savings-interest-rate/SavingsInterestRateCalculator'${nl}    ).then((mod) => ({${nl}      default: mod.SavingsInterestRateCalculator,${nl}    })),${nl}  ),${nl}  ),${nl}};`;
  const fixed = `  JensensAlphaCalculator: lazyTool(() =>${nl}    import(${nl}      '@/tools/calculators/jensens-alpha/JensensAlphaCalculator'${nl}    ).then((mod) => ({${nl}      default: mod.JensensAlphaCalculator,${nl}    })),${nl}  ),${nl}  SavingsInterestRateCalculator: lazyTool(() =>${nl}    import(${nl}      '@/tools/calculators/savings-interest-rate/SavingsInterestRateCalculator'${nl}    ).then((mod) => ({${nl}      default: mod.SavingsInterestRateCalculator,${nl}    })),${nl}  ),${nl}  ${KEY}: lazyTool(() =>${nl}    import(${nl}      '@/tools/calculators/value-at-risk/ValueAtRiskCalculator'${nl}    ).then((mod) => ({${nl}      default: mod.${KEY},${nl}    })),${nl}  ),${nl}};`;

  if (out.includes(broken)) {
    return out.replace(broken, fixed);
  }

  if (out.includes(`  ${KEY}:`)) return out;

  const marker = `  SavingsInterestRateCalculator: lazyTool(() =>${nl}    import(${nl}      '@/tools/calculators/savings-interest-rate/SavingsInterestRateCalculator'${nl}    ).then((mod) => ({${nl}      default: mod.SavingsInterestRateCalculator,${nl}    })),${nl}  ),`;
  if (!out.includes(marker)) {
    // looser append before final };
    const start = out.lastIndexOf('SavingsInterestRateCalculator: lazyTool');
    if (start < 0) return null;
    const after = out.indexOf('),', start);
    if (after < 0) return null;
    const insert = `${nl}  ${KEY}: lazyTool(() =>${nl}    import(${nl}      '@/tools/calculators/value-at-risk/ValueAtRiskCalculator'${nl}    ).then((mod) => ({${nl}      default: mod.${KEY},${nl}    })),${nl}  ),`;
    return out.slice(0, after + 2) + insert + out.slice(after + 2);
  }
  return out.replace(
    marker,
    `${marker}${nl}  ${KEY}: lazyTool(() =>${nl}    import(${nl}      '@/tools/calculators/value-at-risk/ValueAtRiskCalculator'${nl}    ).then((mod) => ({${nl}      default: mod.${KEY},${nl}    })),${nl}  ),`
  );
});

patch('frontend/src/tools/registry/details.ts', (s) => {
  if (s.includes(`  ${KEY}:`)) return s;
  const nl = s.includes('\r\n') ? '\r\n' : '\n';
  const marker = `  SavingsInterestRateCalculator: () =>${nl}    import('@/tools/calculators/savings-interest-rate/detail'),`;
  if (!s.includes(marker)) return null;
  return s.replace(
    marker,
    `${marker}${nl}  ${KEY}: () => import('@/tools/calculators/value-at-risk/detail'),`
  );
});

patch('frontend/src/app/sitemap.ts', (s) => {
  if (s.includes(`'${SLUG}'`)) return s;
  const nl = s.includes('\r\n') ? '\r\n' : '\n';
  const needle = `  'savings-interest-rate-calculator',${nl}] as const;`;
  if (!s.includes(needle)) return null;
  return s.replace(needle, `  'savings-interest-rate-calculator',${nl}  '${SLUG}',${nl}] as const;`);
});

patch('backend/src/modules/tools/tool.key.ts', (s) => {
  const nl = s.includes('\r\n') ? '\r\n' : '\n';
  let out = s;
  const approvedEnd = out.indexOf('export type ApprovedComponentKey');
  if (!out.slice(0, approvedEnd).includes(`'${KEY}'`)) {
    const needle = `  'SavingsInterestRateCalculator',${nl}] as const;`;
    if (!out.slice(0, approvedEnd).includes(needle)) return null;
    out = out.replace(needle, `  'SavingsInterestRateCalculator',${nl}  '${KEY}',${nl}] as const;`);
  }
  if (!out.includes(`!isApprovedComponentKey('${KEY}')`)) {
    out = out.replace(
      /(!isApprovedComponentKey\('SavingsInterestRateCalculator'\) \|\|)(\r?\n)/,
      `$1$2    !isApprovedComponentKey('${KEY}') ||$2`
    );
  }
  return out;
});
