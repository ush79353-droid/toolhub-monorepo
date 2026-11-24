/**
 * Blood Type Calculator — assert-based engine check.
 * Run: npx tsx src/tools/calculators/blood-type/calculation.test.ts
 */
import { calculateBloodType, formatPercent } from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  SCREENSHOT_DEFAULT_INPUT,
} from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, tol = 0.05): boolean {
  return Math.abs(a - b) <= tol;
}

{
  const r = calculateBloodType(SCREENSHOT_DEFAULT_INPUT);
  assert(r.abo !== null && r.rh !== null, 'screenshot fixture has result');
  assert(approx(r.abo.A, 50), `A expected 50 got ${r.abo.A}`);
  assert(approx(r.abo.B, 12.5), `B expected 12.5 got ${r.abo.B}`);
  assert(approx(r.abo.AB, 37.5), `AB expected 37.5 got ${r.abo.AB}`);
  assert(approx(r.abo.O, 0), `O expected 0 got ${r.abo.O}`);
  assert(approx(r.rh.positive, 75), `Rh+ expected 75 got ${r.rh.positive}`);
  assert(approx(r.rh.negative, 25), `Rh− expected 25 got ${r.rh.negative}`);
}

{
  const r = calculateBloodType({ motherBloodType: 'O-', fatherBloodType: 'O-' });
  assert(r.abo !== null, 'O×O has abo');
  assert(approx(r.abo.O, 100), `O×O type O must be 100% got ${r.abo.O}`);
  assert(approx(r.abo.A, 0), 'O×O no A');
  assert(approx(r.rh!.negative, 100), 'O−×O− Rh− must be 100%');
}

{
  const r = calculateBloodType({ motherBloodType: 'O+', fatherBloodType: 'O+' });
  assert(approx(r.rh!.positive, 93.75), `O+×O+ Rh+ aggregate got ${r.rh!.positive}`);
}

{
  const r = calculateBloodType({ motherBloodType: 'AB+', fatherBloodType: 'O+' });
  assert(r.abo !== null, 'AB×O has abo');
  assert(approx(r.abo.A, 50), `AB×O A 50% got ${r.abo.A}`);
  assert(approx(r.abo.B, 50), `AB×O B 50% got ${r.abo.B}`);
  assert(approx(r.abo.AB, 0), `AB×O AB 0% got ${r.abo.AB}`);
  assert(approx(r.abo.O, 0), `AB×O O 0% got ${r.abo.O}`);
}

{
  const r = calculateBloodType(createEmptyInput());
  assert(r.abo === null, 'empty input no probabilities');
}

{
  const r = calculateBloodType(createDefaultInput());
  assert(
    formatPercent(r.abo!.A) === '50%',
    `formatPercent A: ${formatPercent(r.abo!.A)}`,
  );
}

console.log('blood-type calculation.test.ts: ok');