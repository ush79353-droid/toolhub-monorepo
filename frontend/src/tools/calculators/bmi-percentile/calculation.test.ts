/**
 * Focused self-check for BMI Percentile (WHO LMS + tail policy).
 * Run: npx tsx src/tools/calculators/bmi-percentile/calculation.test.ts
 */
import {
  WHO_BMI_LMS_BOYS,
  WHO_BMI_LMS_GIRLS,
} from './datasets';
import {
  calculateBmiPercentile,
  computeBmiFromAnthropometry,
  lmsZScore,
  lookupLms,
  whoAdjustedZScore,
  zToPercentile,
} from './calculation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-6): boolean {
  return Math.abs(a - b) <= eps;
}

// Dataset length
assert(WHO_BMI_LMS_BOYS.length === 61, 'boys LMS length');
assert(WHO_BMI_LMS_GIRLS.length === 61, 'girls LMS length');

// Median BMI → z≈0 → ~50th
const boy24 = lookupLms(24, 'boy');
assert(approx(boy24.M, 15.7356, 1e-4), 'boy 24m median');
const med = calculateBmiPercentile({
  ageMonths: 24,
  sex: 'boy',
  bmi: boy24.M,
});
assert(approx(med.zScore, 0, 1e-9), `median z got ${med.zScore}`);
assert(approx(med.percentile, 50, 1e-6), `median pct got ${med.percentile}`);

// L=0 path: synthetic
const zLn = lmsZScore(10, { L: 0, M: 10, S: 0.1 });
assert(approx(zLn, 0, 1e-12), 'L=0 at median');

// Mode equivalence: BMI from anthropometry matches direct BMI path
const bmiFromHw = computeBmiFromAnthropometry(80, 10); // 10 / 0.64 = 15.625
const direct = calculateBmiPercentile({
  ageMonths: 24,
  sex: 'boy',
  bmi: bmiFromHw,
});
const viaKnown = calculateBmiPercentile({
  ageMonths: 24,
  sex: 'boy',
  bmi: 15.625,
});
assert(approx(direct.zScore, viaKnown.zScore, 1e-12), 'mode z match');
assert(approx(direct.percentile, viaKnown.percentile, 1e-12), 'mode pct match');

// No silent extrapolation
let threw = false;
try {
  lookupLms(61, 'girl');
} catch {
  threw = true;
}
assert(threw, 'age 61 must reject');

// WHO tail: extreme high BMI pushes z above 3 with adjustment ≠ raw LMS
const rawHi = lmsZScore(40, boy24);
const adjHi = whoAdjustedZScore(40, boy24);
assert(rawHi > 3, 'raw extreme > 3');
assert(adjHi > 3, 'adjusted still > 3');
assert(!approx(adjHi, rawHi, 1e-6), 'tail policy changes extreme z');

// Percentile bounds
assert(approx(zToPercentile(0), 50, 1e-6), 'phi(0)');
assert(zToPercentile(-10) < 0.1, 'far left');
assert(zToPercentile(10) > 99.9, 'far right');

// Girl table distinct
const girl24 = lookupLms(24, 'girl');
assert(!approx(girl24.M, boy24.M, 1e-6), 'sex-specific M');

console.log('bmi-percentile calculation.test.ts: ok');
