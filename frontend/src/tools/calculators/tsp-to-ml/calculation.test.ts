import assert from 'node:assert/strict';
import {
  ML_PER_METRIC_TSP,
  ML_PER_US_TSP,
  buildResult,
  ccToMl,
  mlToCc,
  mlToTeaspoons,
  shareResultText,
  teaspoonsToMl,
  valueFromMilliliters,
} from './calculation';
import { DEFAULT_UNITS } from './types';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(ML_PER_METRIC_TSP, 5);
assert.equal(ML_PER_US_TSP, 4.92892159375);

assert.equal(teaspoonsToMl(1), 5);
assert.equal(teaspoonsToMl(2), 10);
assert.equal(teaspoonsToMl(0.5), 2.5);
assert.equal(teaspoonsToMl(0.25), 1.25);
assert.equal(mlToTeaspoons(15), 3);
assertClose(teaspoonsToMl(1, 'us_customary'), 4.92892159375, 10);
assert.equal(teaspoonsToMl(1, 'us_nutrition'), 5);
assert.equal(teaspoonsToMl(0), 0);
assert.equal(mlToCc(10), 10);
assert.equal(ccToMl(25), 25);

const input = 3.75;
const ml = teaspoonsToMl(input);
assertClose(mlToTeaspoons(ml), input, 10);

assert.equal(teaspoonsToMl(1 / 8), 0.625);
assert.equal(teaspoonsToMl(1 / 5), 1);

const result = buildResult(teaspoonsToMl(2), DEFAULT_UNITS);
assert.equal(result.values.teaspoons, 2);
assert.equal(result.values.milliliters, 10);
assert.equal(result.values.other, 10);
assert.equal(result.units.teaspoons, 'metricTsp');
assert.equal(result.units.other, 'cm3');
assertClose(valueFromMilliliters(5, 'metricTsp'), 1);
assertClose(valueFromMilliliters(ML_PER_US_TSP, 'usTsp'), 1);
assert.match(shareResultText(result), /tsp to mL Converter/);
assert.match(shareResultText(result), /Metric/);

console.log('tsp-to-ml calculation.test.ts: ok');
