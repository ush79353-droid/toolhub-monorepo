/**
 * BUN creatinine ratio — assert-based engine check (Ponytail).
 * Run: npx tsx src/tools/calculators/bun-creatinine-ratio/calculation.test.ts
 */

import {
  bunCreatinineRatio,
  bunToMgDl,
  calculateBunCreatinineRatio,
  creatinineToMgDl,
  interpretRatio,
} from './calculation';
import { createDefaultInput } from './types';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// Fixture from prompt: BUN 20, creatinine 1 → 20
assert(bunCreatinineRatio(20, 1) === 20, 'fixture 20/1 → 20');

const r = calculateBunCreatinineRatio({
  ...createDefaultInput(),
  bunText: '20',
  creatinineText: '1',
});
assert(r.ratio === 20, `expected ratio 20, got ${r.ratio}`);
assert(r.bandLabel === 'Typical (10–20)', `band ${r.bandLabel}`);

// Missing vs zero denominator
const missing = calculateBunCreatinineRatio({
  ...createDefaultInput(),
  bunText: '20',
  creatinineText: '',
});
assert(missing.ratio === null, 'missing creatinine → null ratio');

const zero = calculateBunCreatinineRatio({
  ...createDefaultInput(),
  bunText: '20',
  creatinineText: '0',
});
assert(zero.ratio === null, 'zero creatinine → null ratio');
assert(/zero/i.test(zero.statusDetail), 'zero denominator message');

// Urea mmol/L: 10 mmol/L × 2.8 = 28 mg/dL BUN; Cr 88.4 µmol/L → 1 mg/dL → 28
assert(approx(bunToMgDl(10, 'mmol_l_urea'), 28), 'urea mmol→BUN');
assert(approx(creatinineToMgDl(88.4, 'umol_l'), 1), 'Cr µmol→mg/dL');
const si = calculateBunCreatinineRatio({
  bunText: '10',
  bunUnit: 'mmol_l_urea',
  creatinineText: '88.4',
  creatinineUnit: 'umol_l',
});
assert(si.ratio === 28, `SI path expected 28, got ${si.ratio}`);

// Urea mg/dL (whole): 60 mg/dL urea × 28/60 = 28 BUN; Cr 1 → 28
const ureaMass = calculateBunCreatinineRatio({
  bunText: '60',
  bunUnit: 'mg_dl_urea',
  creatinineText: '1',
  creatinineUnit: 'mg_dl',
});
assert(ureaMass.ratio === 28, `urea mass path expected 28, got ${ureaMass.ratio}`);

assert(interpretRatio(9) === 'Low (<10)', 'low band');
assert(interpretRatio(20) === 'Typical (10–20)', 'typical upper');
assert(interpretRatio(21) === 'High (>20)', 'high band');

console.log('bun-creatinine-ratio calculation.test.ts: ok');
