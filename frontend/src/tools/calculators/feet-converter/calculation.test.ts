import assert from 'node:assert/strict';
import { convertFeet, formatLength, shareResultText, toMeters } from './calculation';
import { parseLengthInput } from './validation';

function close(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

close(convertFeet(1, 'ft', 'in'), 12);
close(convertFeet(1, 'ft', 'cm'), 30.48);
close(convertFeet(1, 'ft', 'mm'), 304.8);
close(convertFeet(1, 'ft', 'm'), 0.3048);
close(convertFeet(1, 'ft', 'km'), 0.0003048);
close(convertFeet(3, 'ft', 'yd'), 1);
close(convertFeet(5280, 'ft', 'mi'), 1);
close(convertFeet(1, 'm', 'ft'), 3.280839895, 8);
close(convertFeet(12, 'in', 'ft'), 1);
close(convertFeet(1, 'mi', 'ft'), 5280);

close(convertFeet(10, 'ft', 'in'), 120);
close(convertFeet(10, 'ft', 'cm'), 304.8);
close(convertFeet(10, 'ft', 'm'), 3.048);
close(convertFeet(5, 'm', 'ft'), 16.404199475, 8);

assert.equal(toMeters(1, 'ft'), 0.3048);
assert.ok(Number.isFinite(convertFeet(1, 'ft', 'ly')));
assert.ok(Number.isFinite(convertFeet(1, 'ft', 'nmi')));
assert.ok(Number.isFinite(convertFeet(1, 'ft', 'solarRadius')));
assert.match(shareResultText(0.3048), /ft/);
assert.ok(formatLength(304.8).length > 0);

assert.equal(parseLengthInput('').blank, true);
assert.equal(parseLengthInput('-10').value, -10);
assert.equal(parseLengthInput('1.5').value, 1.5);
assert.throws(() => convertFeet(Number.NaN, 'ft', 'm'));

console.log('feet-converter calculation.test.ts: ok');
