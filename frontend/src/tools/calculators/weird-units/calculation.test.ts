import assert from 'node:assert/strict';
import {
  convertFromWeirdUnits,
  convertToWeirdUnits,
  formatWeird,
  resultSentence,
} from './calculation';
import { parseWeirdInput, validateConversion } from './validation';

function close(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

close(convertToWeirdUnits(100, 'm', 'lego-brick-height'), 10_416.6666667);
close(convertToWeirdUnits(8848.86, 'm', 'mount-everest-height'), 1);
close(convertToWeirdUnits(1, 'km', 'olympic-pool-length'), 20);

close(convertToWeirdUnits(10, 'km', 'golden-gate-bridge'), 10_000 / 2737);
close(convertToWeirdUnits(1, 'h', 'episode', 'time'), 2);
close(convertToWeirdUnits(1, 'd', 'workday', 'time'), 3);

close(convertFromWeirdUnits(10_416.6666667, 'lego-brick-height', 'm'), 100);

assert.equal(parseWeirdInput('').blank, true);
assert.ok(parseWeirdInput('-1').error);
assert.ok(
  !validateConversion({
    category: 'length',
    regularId: 'm',
    weirdId: 'african-elephant',
    direction: 'regular-to-weird',
    value: 1,
  }).ok,
);

assert.match(
  resultSentence({
    value: 100,
    category: 'length',
    regularId: 'm',
    weirdId: 'lego-brick-height',
    direction: 'regular-to-weird',
    result: convertToWeirdUnits(100, 'm', 'lego-brick-height'),
  }),
  /LEGO/,
);

assert.ok(formatWeird(10416.67).includes('10,416'));

console.log('weird-units calculation.test.ts: ok');
