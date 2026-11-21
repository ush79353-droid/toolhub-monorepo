import assert from 'node:assert/strict';
import {
  calculateCES,
  formatCes,
  medianFromDistribution,
  modesFromDistribution,
} from './calculation';
import { createDefaultInput, createExampleInput, emptyCounts } from './types';
import { validateCESInput } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

{
  const r = calculateCES(5, { 1: 10, 2: 5, 3: 3, 4: 5, 5: 5 });
  assert.ok(r);
  assert.equal(r!.totalResponses, 28);
  assert.equal(r!.weightedSum, 74);
  assertClose(r!.ces, 74 / 28);
  assert.equal(formatCes(r!.ces), '2.64');
}

{
  const r = calculateCES(5, { 1: 20, 2: 0, 3: 0, 4: 0, 5: 0 });
  assert.ok(r);
  assert.equal(r!.ces, 1);
}

{
  const r = calculateCES(5, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 20 });
  assert.ok(r);
  assert.equal(r!.ces, 5);
}

{
  const r = calculateCES(7, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 50 });
  assert.ok(r);
  assert.equal(r!.ces, 7);
}

{
  const r = calculateCES(5, { 1: 10, 2: 10, 3: 10, 4: 10, 5: 10 });
  assert.ok(r);
  assert.equal(r!.ces, 3);
}

{
  const r = calculateCES(7, {
    1: 10,
    2: 10,
    3: 10,
    4: 10,
    5: 10,
    6: 10,
    7: 10,
  });
  assert.ok(r);
  assert.equal(r!.ces, 4);
}

assert.equal(calculateCES(5, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }), null);
assert.equal(calculateCES(5, { 1: -1, 2: 0, 3: 0, 4: 0, 5: 0 }), null);

{
  const r = calculateCES(5, { 1: 20, 2: 30, 3: 10, 4: 20, 5: 20 });
  assert.ok(r);
  assert.equal(r!.lowEffortPercentage, 50);
  assert.equal(r!.neutralPercentage, 10);
  assert.equal(r!.highEffortPercentage, 40);
}

{
  const empty = validateCESInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.match(empty.errors.form ?? '', /at least one/i);
}

{
  const neg = validateCESInput({
    ...createDefaultInput(),
    counts: { ...emptyCounts(5), '1': '-3' },
  });
  assert.equal(neg.isValid, false);
  assert.match(neg.errors.score1 ?? '', /negative/i);
}

{
  const decimal = validateCESInput({
    ...createDefaultInput(),
    counts: { ...emptyCounts(5), '1': '2.5' },
  });
  assert.equal(decimal.isValid, false);
  assert.match(decimal.errors.score1 ?? '', /whole/i);
}

{
  const ex = validateCESInput(createExampleInput());
  assert.equal(ex.isValid, true);
  assert.equal(ex.result!.formattedCes, '2.64');
  assert.equal(ex.result!.scale, 5);
}

{
  const dist = [
    { score: 1, count: 2 },
    { score: 2, count: 2 },
    { score: 3, count: 2 },
  ];
  assert.equal(medianFromDistribution(dist, 6), 2);
  assert.deepEqual(modesFromDistribution(dist), [1, 2, 3]);
}

{
  const switchScale = validateCESInput({
    scale: 7,
    counts: emptyCounts(7),
    analysisOpen: false,
  });
  assert.equal(switchScale.isValid, false);
}

console.log('customer-effort-score calculation.test.ts: ok');
