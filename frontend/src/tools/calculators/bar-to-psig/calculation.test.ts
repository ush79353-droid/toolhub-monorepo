import assert from 'node:assert/strict';
import {
  absoluteBarToPsig,
  calculateBarToPsig,
  gaugeBarToPsig,
  psigToAbsoluteBar,
  psigToGaugeBar,
  shareResultText,
} from './calculation';
import { PSI_PER_BAR, STANDARD_ATMOSPHERIC_BAR } from './types';
import { parseOptionalNumber, validateBarToPsig } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(PSI_PER_BAR, 14.5037738007);
assert.equal(STANDARD_ATMOSPHERIC_BAR, 1.01325);

assertClose(absoluteBarToPsig(10), 130.34, 2);
assertClose(absoluteBarToPsig(1.01325), 0, 8);
assertClose(absoluteBarToPsig(150), 2160.85, 2);
assertClose(gaugeBarToPsig(5), 72.5189, 4);
assertClose(gaugeBarToPsig(10), 145.037738007, 8);
assertClose(psigToAbsoluteBar(100), 7.90799, 5);
assertClose(psigToGaugeBar(145.037738007), 10, 8);
assertClose(gaugeBarToPsig(-0.5), -7.2519, 4);

assert.throws(() => absoluteBarToPsig(-1));
assert.throws(() => absoluteBarToPsig(10, -1));
assert.throws(() => psigToAbsoluteBar(-20)); // → negative absolute

{
  const result = calculateBarToPsig({
    source: 'bar',
    bar: 10,
    psig: null,
    reference: 'absolute',
    atmosphericBar: STANDARD_ATMOSPHERIC_BAR,
  });
  assertClose(result.psig, 130.34, 2);
  assert.match(shareResultText(result), /Bar to PSIG/);
}

{
  const result = calculateBarToPsig({
    source: 'bar',
    bar: 5,
    psig: null,
    reference: 'gauge',
    atmosphericBar: STANDARD_ATMOSPHERIC_BAR,
  });
  assertClose(result.psig, 72.5189, 4);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateBarToPsig({
    source: 'bar',
    bar: -1,
    psig: null,
    reference: 'absolute',
    atmosphericBar: STANDARD_ATMOSPHERIC_BAR,
  }).isValid,
);
assert.ok(
  validateBarToPsig({
    source: 'bar',
    bar: -0.5,
    psig: null,
    reference: 'gauge',
    atmosphericBar: STANDARD_ATMOSPHERIC_BAR,
  }).isValid,
);

console.log('bar-to-psig calculation.test.ts: ok');
