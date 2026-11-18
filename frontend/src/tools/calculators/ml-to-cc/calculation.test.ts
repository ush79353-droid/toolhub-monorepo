import assert from 'node:assert/strict';
import {
  ccToLiters,
  ccToMl,
  litersToCc,
  litersToMl,
  mlToCc,
  mlToLiters,
  shareResultText,
  valuesFromMl,
} from './calculation';

assert.equal(mlToCc(1), 1);
assert.equal(mlToCc(10), 10);
assert.equal(mlToCc(50), 50);
assert.equal(mlToCc(100), 100);
assert.equal(mlToCc(250), 250);
assert.equal(mlToCc(1000), 1000);

assert.equal(ccToMl(1), 1);
assert.equal(ccToMl(250), 250);

assert.equal(mlToLiters(1000), 1);
assert.equal(mlToLiters(500), 0.5);
assert.equal(mlToLiters(250), 0.25);
assert.equal(litersToCc(1), 1000);
assert.equal(litersToCc(2.5), 2500);
assert.equal(litersToMl(1), 1000);
assert.equal(ccToLiters(750), 0.75);

assert.equal(mlToCc(0), 0);
assert.equal(mlToCc(0.5), 0.5);
assert.equal(mlToCc(0.001), 0.001);

const v = valuesFromMl(250);
assert.equal(v.ml, 250);
assert.equal(v.cc, 250);
assert.equal(v.liters, 0.25);

assert.match(shareResultText(250), /mL to cc Converter/);
assert.match(shareResultText(250), /250 mL = 250 cc/);
assert.match(shareResultText(250), /0\.25 L/);

console.log('ml-to-cc calculation.test.ts: ok');
