import assert from 'node:assert/strict';
import {
  ML_PER_AU_TBSP,
  ML_PER_METRIC_TBSP,
  ML_PER_US_TBSP,
  australianTablespoonsToMl,
  buildResult,
  metricTablespoonsToMl,
  mlToTablespoons,
  shareResultText,
  tablespoonsToMl,
  usTablespoonsToMl,
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

assert.equal(ML_PER_US_TBSP, 14.78676478125);
assert.equal(ML_PER_METRIC_TBSP, 15);
assert.equal(ML_PER_AU_TBSP, 20);

assertClose(tablespoonsToMl(2, 'us'), 29.5735295625, 10);
assert.equal(tablespoonsToMl(2, 'metric'), 30);
assert.equal(tablespoonsToMl(2, 'australian'), 40);
assertClose(mlToTablespoons(100, 'us'), 6.76280454037, 8);
assert.equal(tablespoonsToMl(0, 'us'), 0);
assert.equal(tablespoonsToMl(0.5, 'metric'), 7.5);

const roundTripMl = tablespoonsToMl(8.75, 'us');
assertClose(mlToTablespoons(roundTripMl, 'us'), 8.75, 10);

assert.equal(usTablespoonsToMl(1), 14.78676478125);
assert.equal(metricTablespoonsToMl(1), 15);
assert.equal(australianTablespoonsToMl(1), 20);
assertClose(usTablespoonsToMl(3), 44.36029434375, 10);

const result = buildResult(usTablespoonsToMl(2), DEFAULT_UNITS);
assertClose(result.values.tablespoons, 2);
assertClose(result.values.milliliters, 29.5735295625, 10);
assertClose(result.values.other, 6);
assert.match(shareResultText(result), /Tbsp to mL Converter/);
assert.match(shareResultText(result), /US tbsp/);

assertClose(valueFromMilliliters(ML_PER_US_TBSP, 'usTbsp'), 1);
assertClose(valueFromMilliliters(30, 'metricTbsp'), 2);
assertClose(valueFromMilliliters(40, 'auTbsp'), 2);

console.log('tbsp-to-ml calculation.test.ts: ok');
