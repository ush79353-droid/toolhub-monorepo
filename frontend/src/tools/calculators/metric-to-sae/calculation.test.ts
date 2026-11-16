import assert from 'node:assert/strict';
import {
  allFromMeters,
  formatLength,
  metersFromUnit,
  shareResultText,
  WRENCH_CHART,
} from './calculation';
import { convertLength } from './units';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(convertLength(25.4, 'mm', 'in'), 1, 10);
assertClose(convertLength(1, 'in', 'mm'), 25.4, 10);
assertClose(convertLength(1, 'ft', 'm'), 0.3048, 10);
assertClose(convertLength(1, 'mi', 'km'), 1.609344, 10);
assertClose(convertLength(100, 'cm', 'm'), 1, 10);
assertClose(convertLength(1000, 'mm', 'm'), 1, 10);
assert.equal(convertLength(0, 'mm', 'in'), 0);

{
  const meters = metersFromUnit(25.4, 'mm');
  const values = allFromMeters(meters);
  assertClose(values.in, 1, 10);
  assertClose(values.cm, 2.54, 10);
  assertClose(values.m, 0.0254, 10);
  assert.match(shareResultText(meters, 'mm'), /Metric to SAE/);
}

{
  const values = allFromMeters(metersFromUnit(1, 'm'));
  assertClose(values.ft, 1 / 0.3048, 8);
  assertClose(values.in, 1 / 0.0254, 8);
}

{
  const values = allFromMeters(metersFromUnit(1, 'mi'));
  assertClose(values.km, 1.609344, 10);
}

assert.equal(formatLength(0), '0');
assert.ok(!formatLength(Number.NaN));
assert.ok(!formatLength(Number.POSITIVE_INFINITY));

{
  const row19 = WRENCH_CHART.find((r) => r.metricMm === 19)!;
  assertClose(row19.saeMm, 19.05, 10);
  assertClose(row19.differenceMm, 0.05, 10);
  const row13 = WRENCH_CHART.find((r) => r.metricMm === 13)!;
  assertClose(row13.saeMm, 12.7, 10);
  assertClose(row13.differenceMm, 0.3, 10);
}

console.log('metric-to-sae calculation.test.ts: ok');
