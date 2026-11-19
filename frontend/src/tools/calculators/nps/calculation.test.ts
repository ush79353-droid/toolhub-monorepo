import assert from 'node:assert/strict';
import {
  calculateNPS,
  formatNps,
  toNPSResult,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateNPSInput } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

function countsFromBuckets(promoters: number, passives: number, detractors: number) {
  // Put promoters on 10, passives on 8, detractors on 0 for compact tests.
  return {
    0: detractors,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: passives,
    9: 0,
    10: promoters,
  };
}

{
  const r = calculateNPS({
    0: 2,
    1: 1,
    2: 2,
    3: 2,
    4: 3,
    5: 5,
    6: 10,
    7: 10,
    8: 15,
    9: 20,
    10: 30,
  });
  assert.ok(r);
  assert.equal(r!.promoters, 50);
  assert.equal(r!.passives, 25);
  assert.equal(r!.detractors, 25);
  assert.equal(r!.totalResponses, 100);
  assertClose(r!.promoterPercentage, 50);
  assertClose(r!.passivePercentage, 25);
  assertClose(r!.detractorPercentage, 25);
  assertClose(r!.netPromoterScore, 25);
  assert.equal(formatNps(r!.netPromoterScore), '+25');
}

{
  const r = calculateNPS(countsFromBuckets(40, 20, 40));
  assert.ok(r);
  assertClose(r!.netPromoterScore, 0);
  assert.equal(formatNps(r!.netPromoterScore), '0');
}

{
  const r = calculateNPS(countsFromBuckets(20, 30, 50));
  assert.ok(r);
  assertClose(r!.netPromoterScore, -30);
  assert.equal(formatNps(r!.netPromoterScore), '-30');
}

{
  const r = calculateNPS(countsFromBuckets(100, 0, 0));
  assert.ok(r);
  assertClose(r!.netPromoterScore, 100);
  assert.equal(formatNps(r!.netPromoterScore), '+100');
}

{
  const r = calculateNPS(countsFromBuckets(0, 0, 100));
  assert.ok(r);
  assertClose(r!.netPromoterScore, -100);
  assert.equal(formatNps(r!.netPromoterScore), '-100');
}

{
  const r = calculateNPS(countsFromBuckets(0, 100, 0));
  assert.ok(r);
  assertClose(r!.netPromoterScore, 0);
  assert.equal(r!.passives, 100);
  assert.equal(r!.promoters, 0);
  assert.equal(r!.detractors, 0);
}

{
  const r = calculateNPS({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 10,
    10: 20,
  });
  assert.ok(r);
  assert.equal(r!.promoters, 30);
  assert.equal(r!.totalResponses, 30);
  assertClose(r!.netPromoterScore, 100);
}

assert.equal(calculateNPS(countsFromBuckets(0, 0, 0)), null);
assert.equal(calculateNPS({ ...countsFromBuckets(10, 0, 0), 10: -1 }), null);

{
  const ex = validateNPSInput(createExampleInput());
  assert.equal(ex.isValid, true);
  assertClose(ex.result!.netPromoterScore, 25);
  assert.equal(ex.result!.formattedNps, '+25');
  assert.equal(ex.result!.promoters, 50);
}

{
  const empty = validateNPSInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

{
  const zeros = validateNPSInput({
    counts: Object.fromEntries(
      Array.from({ length: 11 }, (_, i) => [String(i), '0']),
    ),
  });
  assert.equal(zeros.isValid, false);
  assert.match(zeros.errors.form ?? '', /at least one/i);
}

{
  const neg = validateNPSInput({
    ...createExampleInput(),
    counts: { ...createExampleInput().counts, '10': '-1' },
  });
  assert.equal(neg.isValid, false);
  assert.match(neg.errors.score10 ?? '', /negative/i);
}

{
  const decimal = validateNPSInput({
    ...createExampleInput(),
    counts: { ...createExampleInput().counts, '8': '1.5' },
  });
  assert.equal(decimal.isValid, false);
  assert.match(decimal.errors.score8 ?? '', /whole/i);
}

{
  const large = validateNPSInput({
    ...createDefaultInput(),
    counts: {
      ...emptyLike(),
      '10': '1000000',
      '0': '500000',
    },
  });
  assert.equal(large.isValid, true);
  assert.ok(Number.isFinite(large.result!.netPromoterScore));
  assertClose(large.result!.netPromoterScore, (1000000 - 500000) / 1500000 * 100);
}

{
  const formatted = toNPSResult(calculateNPS(countsFromBuckets(50, 25, 25))!);
  assert.equal(formatted.formattedNps, '+25');
  assert.equal(formatted.formattedPromoterPercentage, '50.0');
}

function emptyLike(): Record<string, string> {
  const c: Record<string, string> = {};
  for (let i = 0; i <= 10; i += 1) c[String(i)] = '';
  return c;
}

console.log('nps calculation.test.ts: all assertions passed');
