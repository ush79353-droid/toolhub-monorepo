import assert from 'node:assert/strict';
import {
  ML_PER_IMPERIAL_TSP,
  ML_PER_METRIC_TSP,
  ML_PER_US_TBSP,
  ML_PER_US_TSP,
  buildResult,
  mlToMetricTeaspoons,
  mlToUsTeaspoons,
  shareResultText,
  usTeaspoonsToMl,
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

assert.equal(ML_PER_US_TSP, 4.92892159375);
assert.equal(ML_PER_METRIC_TSP, 5);
assertClose(ML_PER_IMPERIAL_TSP, 5.91938802083333, 10);

assertClose(mlToUsTeaspoons(1), 0.2028841362);
assertClose(mlToUsTeaspoons(2.5), 0.5072103406);
assertClose(mlToUsTeaspoons(5), 1.014420681);
assertClose(mlToUsTeaspoons(10), 2.028841362);
assertClose(mlToUsTeaspoons(15), 3.043262043);
assertClose(mlToUsTeaspoons(20), 4.057682724);
assertClose(mlToUsTeaspoons(30), 6.086524086);
assertClose(mlToUsTeaspoons(40), 8.115365448);

assert.equal(mlToMetricTeaspoons(5), 1);
assert.equal(mlToMetricTeaspoons(10), 2);
assert.equal(usTeaspoonsToMl(1), 4.92892159375);
assert.equal(usTeaspoonsToMl(3), ML_PER_US_TBSP);
assert.equal(valueFromMilliliters(usTeaspoonsToMl(3), 'usTbsp'), 1);

const result = buildResult(10, DEFAULT_UNITS);
assertClose(result.values.teaspoons, mlToUsTeaspoons(10));
assert.match(shareResultText(result), /mL to tsp Converter/);
assert.match(shareResultText(result), /US tsp/);

assertClose(valueFromMilliliters(ML_PER_IMPERIAL_TSP, 'impTsp'), 1, 8);

console.log('ml-to-tsp calculation.test.ts: ok');
