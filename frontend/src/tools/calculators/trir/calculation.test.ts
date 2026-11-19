import assert from 'node:assert/strict';
import {
  calculateTRIR,
  classifyTrirBand,
  formatTrir,
  solveEstimatedInjuries,
  solveHoursWorked,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateTrirInput } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

{
  const r = calculateTRIR(2, 2_000_000);
  assert.ok(r);
  assertClose(r!.trir, 0.2);
  assert.equal(r!.band, 'low');
  assert.equal(formatTrir(r!.trir), '0.20');
}

{
  const r = calculateTRIR(20, 1_000_000);
  assert.ok(r);
  assertClose(r!.trir, 4);
  assert.equal(r!.band, 'moderate');
}

{
  const r = calculateTRIR(50, 1_000_000);
  assert.ok(r);
  assertClose(r!.trir, 10);
  assert.equal(r!.band, 'high');
}

{
  const r = calculateTRIR(0, 500_000);
  assert.ok(r);
  assertClose(r!.trir, 0);
  assert.equal(r!.band, 'low');
}

{
  const r = calculateTRIR(30, 10_000_000);
  assert.ok(r);
  assertClose(r!.trir, 0.6);
}

{
  const r = calculateTRIR(1, 200_000);
  assert.ok(r);
  assertClose(r!.trir, 1);
}

assert.equal(calculateTRIR(1, 0), null);
assert.equal(calculateTRIR(-1, 1000), null);
assert.equal(calculateTRIR(1.5 as unknown as number, 1000), null);

{
  const est = solveEstimatedInjuries(2, 1_000_000);
  assert.ok(est);
  assertClose(est!.injuries, 10);
  assert.equal(est!.injuriesEstimated, true);
}

{
  const hours = solveHoursWorked(10, 2);
  assert.ok(hours);
  assertClose(hours!.hoursWorked, 1_000_000);
}

assert.equal(classifyTrirBand(2.99), 'low');
assert.equal(classifyTrirBand(3), 'moderate');
assert.equal(classifyTrirBand(8), 'moderate');
assert.equal(classifyTrirBand(8.01), 'high');

{
  const ex = validateTrirInput(createExampleInput());
  assert.equal(ex.isValid, true);
  assertClose(ex.result!.trir, 0.2);
  assert.equal(ex.result!.formattedTrir, '0.20');
}

{
  const empty = validateTrirInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

{
  const zeroHours = validateTrirInput({
    ...createExampleInput(),
    hoursWorked: '0',
  });
  assert.equal(zeroHours.isValid, false);
  assert.match(zeroHours.errors.hoursWorked ?? '', /greater than zero/i);
}

{
  const frac = validateTrirInput({
    ...createExampleInput(),
    injuries: '1.5',
  });
  assert.equal(frac.isValid, false);
  assert.match(frac.errors.injuries ?? '', /whole/i);
}

{
  const neg = validateTrirInput({
    ...createExampleInput(),
    injuries: '-1',
  });
  assert.equal(neg.isValid, false);
}

{
  const reverse = validateTrirInput({
    hoursWorked: '1000000',
    injuries: '',
    trir: '2',
    driver: 'trir',
  });
  assert.equal(reverse.isValid, true);
  assertClose(reverse.result!.injuries, 10);
  assert.equal(reverse.result!.injuriesEstimated, true);
}

console.log('trir calculation.test.ts: all assertions passed');
