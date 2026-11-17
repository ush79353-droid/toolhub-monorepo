import fs from 'node:fs';

const s = fs.readFileSync('frontend/src/tools/registry/keys.ts', 'utf8');
const i = s.indexOf('SafetyStockCalculator');
console.log(JSON.stringify(s.slice(i - 5, i + 90)));
console.log('hasCRLF', s.includes('\r\n'));
console.log(
  'lfPair',
  s.includes("SafetyStockCalculator',\n  'SalesCommissionCalculator'")
);
console.log(
  'crlfPair',
  s.includes("SafetyStockCalculator',\r\n  'SalesCommissionCalculator'")
);
