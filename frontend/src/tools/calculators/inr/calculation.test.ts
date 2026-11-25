/**
 * Run: npx tsx calculation.test.ts
 */
import {
  calculateInr,
  formatInr,
  inrFromPts,
  roundInr,
} from './calculation';
import { createDefaultInput } from './types';
import { validateInrInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

{
  const r = calculateInr(createDefaultInput());
  assert(r.inr === null, 'blank PT leaves INR empty');
  assert(r.formattedInr === '', 'blank formatted INR');
}

{
  const r = inrFromPts(22, 22, 1.3);
  assert(approx(r, 1), 'equal PT → INR 1');
  assert(formatInr(r) === '1', 'equal PT displays 1');
}

{
  // Roche teaching example: 64 / 22 with ISI 0.93 → ≈ 2.7
  const raw = inrFromPts(64, 22, 0.93);
  assert(approx(roundInr(raw), 2.7, 0.05), `Roche-style ≈2.7 got ${raw}`);
}

{
  const r = calculateInr({
    patientPtText: '24',
    controlPtText: '12',
    isiText: '1',
  });
  assert(r.inr === 2, 'ratio 2 with ISI 1 → 2');
  assert(r.formattedInr === '2', 'formatted 2');
}

{
  let threw = false;
  try {
    inrFromPts(20, 0, 1.3);
  } catch {
    threw = true;
  }
  assert(threw, 'nonpositive control guarded');
}

{
  let threw = false;
  try {
    inrFromPts(20, -1, 1.3);
  } catch {
    threw = true;
  }
  assert(threw, 'negative control guarded');
}

{
  const v = validateInrInput({
    patientPtText: '20',
    controlPtText: '0',
    isiText: '1.300',
  });
  assert(v.errors.controlPtText, 'zero control field error');
  assert(v.result === null, 'no result when control invalid');
}

{
  const v = validateInrInput({
    patientPtText: '20',
    controlPtText: '',
    isiText: '1.300',
  });
  assert(!v.errors.controlPtText, 'blank control is incomplete not invalid');
  assert(v.result?.inr === null, 'missing control → blank INR');
}

{
  const v = validateInrInput({
    patientPtText: '30',
    controlPtText: '12',
    isiText: '1.300',
  });
  assert(!v.errors.patientPtText && !v.errors.controlPtText && !v.errors.isiText, 'valid complete input');
  assert(v.result?.inr != null, 'computes when complete');
  const expected = roundInr(Math.pow(30 / 12, 1.3));
  assert(v.result?.inr === expected, `INR ${v.result?.inr} vs ${expected}`);
}

console.log('inr calculation.test.ts: ok');
