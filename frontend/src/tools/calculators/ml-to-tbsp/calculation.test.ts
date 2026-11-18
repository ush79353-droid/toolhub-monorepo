import assert from 'node:assert/strict';
import {
  ML_PER_AU_TBSP,
  ML_PER_IMPERIAL_TBSP,
  ML_PER_METRIC_TBSP,
  ML_PER_US_TBSP,
  australianTablespoonsToMl,
  buildResult,
  mlToMetricTablespoons,
  mlToUsCups,
  mlToUsTablespoons,
  shareResultText,
  usCupsToMl,
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
assert.equal(ML_PER_IMPERIAL_TBSP, 17.7581640625);

assertClose(mlToUsTablespoons(1), 0.0676280454);
assert.equal(mlToMetricTablespoons(15), 1);
assertClose(mlToUsTablespoons(15), 1.014420681, 6);
assert.equal(mlToMetricTablespoons(30), 2);
assertClose(mlToUsTablespoons(30), 2.028841362, 6);
assert.equal(usTablespoonsToMl(1), 14.78676478125);
assert.equal(australianTablespoonsToMl(1), 20);

assertClose(mlToUsCups(100), 0.422675, 5);
assert.equal(usCupsToMl(1) / ML_PER_US_TBSP, 16);
assert.equal(valueFromMilliliters(usCupsToMl(1), 'usTbsp'), 16);

const result = buildResult(30, DEFAULT_UNITS);
assertClose(result.values.tablespoons, mlToUsTablespoons(30));
assertClose(result.values.other, mlToUsCups(30));
assert.match(shareResultText(result), /mL to tbsp Converter/);
assert.match(shareResultText(result), /US tbsp/);

assertClose(valueFromMilliliters(ML_PER_IMPERIAL_TBSP, 'impTbsp'), 1);

console.log('ml-to-tbsp calculation.test.ts: ok');
