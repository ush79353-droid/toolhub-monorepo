import assert from 'node:assert/strict';
import {
  calculateDartRate,
  formatDartRate,
  shareResultText,
  solveEstimatedIncidents,
  solveHoursWorked,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateDartRateInput } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

{
  const r = calculateDartRate(5, 400_000);
  assert.ok(r);
  assert.equal(r!.dartRate, 2.5);
  assert.equal(formatDartRate(r!.dartRate), '2.50');
}

{
  const r = calculateDartRate(0, 200_000);
  assert.ok(r);
  assert.equal(r!.dartRate, 0);
}

{
  const r = calculateDartRate(2, 80_000);
  assert.ok(r);
  assert.equal(r!.dartRate, 5);
}

{
  const r = calculateDartRate(12, 1_200_000);
  assert.ok(r);
  assert.equal(r!.dartRate, 2);
}

{
  const r = calculateDartRate(1, 200_000);
  assert.ok(r);
  assert.equal(r!.dartRate, 1);
}

assert.equal(calculateDartRate(5, 0), null);
assert.equal(calculateDartRate(-3, 200_000), null);
assert.equal(calculateDartRate(2.5 as unknown as number, 200_000), null);

{
  const r = calculateDartRate(1, 100_000.5);
  assert.ok(r);
  assert.ok(Number.isFinite(r!.dartRate));
  assert.ok(r!.dartRate > 0);
}

{
  const hours = solveHoursWorked(5, 2.5);
  assert.ok(hours);
  assert.equal(hours!.hoursWorked, 400_000);
}

{
  const est = solveEstimatedIncidents(2.5, 400_000);
  assert.ok(est);
  assertClose(est!.incidents, 5);
  assert.equal(est!.incidentsEstimated, true);
}

{
  const empty = validateDartRateInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

{
  const zeroHours = validateDartRateInput({
    ...createDefaultInput(),
    incidents: '5',
    hoursWorked: '0',
  });
  assert.equal(zeroHours.isValid, false);
  assert.match(zeroHours.errors.hoursWorked ?? '', /greater than zero/i);
}

{
  const neg = validateDartRateInput({
    ...createDefaultInput(),
    incidents: '-3',
    hoursWorked: '200000',
  });
  assert.equal(neg.isValid, false);
  assert.match(neg.errors.incidents ?? '', /negative/i);
}

{
  const frac = validateDartRateInput({
    ...createDefaultInput(),
    incidents: '2.5',
    hoursWorked: '200000',
  });
  assert.equal(frac.isValid, false);
  assert.match(frac.errors.incidents ?? '', /whole/i);
}

{
  const ex = validateDartRateInput(createExampleInput());
  assert.equal(ex.isValid, true);
  assert.equal(ex.result!.formattedDartRate, '2.50');
  assert.match(shareResultText(ex.result!), /2\.50/);
}

{
  const more = validateDartRateInput({
    ...createExampleInput(),
    incidents: '8',
  });
  assert.equal(more.isValid, true);
  assert.equal(more.result!.dartRate, 4);
}

{
  const reverseHours = validateDartRateInput({
    ...createDefaultInput(),
    driver: 'hoursWorked',
    incidents: '5',
    dartRate: '2.5',
  });
  assert.equal(reverseHours.isValid, true);
  assert.equal(reverseHours.result!.hoursWorked, 400_000);
}

console.log('dart-rate calculation.test.ts: ok');
