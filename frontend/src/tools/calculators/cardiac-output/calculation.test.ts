/**
 * Self-check for Fick cardiac output (run: npx tsx calculation.test.ts).
 */
import {
  cardiacIndex,
  fickCardiacOutputLPerMin,
  mostellerBsaM2,
  oxygenContentMlPerDl,
  oxygenContentMlPerL,
  estimateVo2MlPerMin,
} from './calculation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-6): boolean {
  return Math.abs(a - b) <= eps;
}

// Prompt fixture: VO₂ 250, content difference 50 mL/L → 5 L/min
assert(
  approx(fickCardiacOutputLPerMin(250, 200, 150)!, 5),
  'VO2 250 / AV 50 → CO 5'
);

assert(fickCardiacOutputLPerMin(250, 150, 150) == null, 'reject zero AV');
assert(fickCardiacOutputLPerMin(250, 140, 150) == null, 'reject negative AV');

const bsa = mostellerBsaM2(170, 70)!;
assert(approx(bsa, Math.sqrt((170 * 70) / 3600), 1e-9), 'Mosteller BSA');
assert(approx(estimateVo2MlPerMin(bsa)!, 125 * bsa, 1e-9), 'VO2 index 125');

const cao = oxygenContentMlPerDl(15, 100, 0)!;
assert(approx(cao, 1.34 * 15, 1e-9), 'bound-only content');
assert(approx(oxygenContentMlPerL(15, 100, 0)!, cao * 10, 1e-9), 'mL/L = ×10');

assert(approx(cardiacIndex(5, 2)!, 2.5), 'CI = CO/BSA');

assert(oxygenContentMlPerDl(15, 101, 0) == null, 'sat > 100 rejected');
assert(oxygenContentMlPerDl(15, -1, 0) == null, 'sat < 0 rejected');

console.log('cardiac-output calculation.test.ts: ok');
