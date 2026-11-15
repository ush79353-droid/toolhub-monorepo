import assert from 'node:assert/strict';
import { buildBradfordFactorResult, calculateBradfordFactor } from './calculation';

assert.equal(calculateBradfordFactor(4, 12), 192);
assert.equal(calculateBradfordFactor(0, 12), 0);
assert.equal(calculateBradfordFactor(4, 0), 0);
assert.ok(Number.isNaN(calculateBradfordFactor(-1, 5)));

const result = buildBradfordFactorResult({ spells: 4, daysAbsent: 12 });
assert.equal(result?.factorDisplay, '192');

console.log('bradford-factor calculation.test.ts: ok');
