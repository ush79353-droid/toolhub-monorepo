import assert from 'node:assert/strict';
import { convertInches, formatLength, shareResultText, toMeters } from './calculation';
import { METERS_PER_LIGHT_YEAR, METERS_PER_NAUTICAL_MILE, METERS_PER_SOLAR_RADIUS } from './types';
import { parseLengthInput } from './validation';

function close(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

close(convertInches(1, 'in', 'mm'), 25.4);
close(convertInches(1, 'in', 'cm'), 2.54);
close(convertInches(1, 'in', 'm'), 0.0254);
close(convertInches(1, 'in', 'km'), 0.0000254);
close(convertInches(12, 'in', 'ft'), 1);
close(convertInches(36, 'in', 'yd'), 1);
close(convertInches(63360, 'in', 'mi'), 1);

close(convertInches(2.54, 'cm', 'in'), 1);
close(convertInches(25.4, 'mm', 'in'), 1);
close(convertInches(0.3048, 'm', 'in'), 12);
close(convertInches(1, 'ft', 'in'), 12);
close(convertInches(1, 'yd', 'in'), 36);
close(convertInches(1, 'mi', 'in'), 63360);

assert.equal(toMeters(1, 'nmi'), METERS_PER_NAUTICAL_MILE);
assert.equal(toMeters(1, 'ly'), METERS_PER_LIGHT_YEAR);
assert.equal(toMeters(1, 'solarRadius'), METERS_PER_SOLAR_RADIUS);
assert.ok(Number.isFinite(convertInches(1, 'in', 'nmi')));
assert.ok(Number.isFinite(convertInches(1, 'in', 'ly')));
assert.ok(Number.isFinite(convertInches(1, 'in', 'solarRadius')));

assert.match(shareResultText(0.0254), /Inch Converter/);
assert.ok(formatLength(25.4).length > 0);

assert.equal(parseLengthInput('').blank, true);
assert.equal(parseLengthInput('-10').value, -10);
assert.equal(parseLengthInput('1.5').value, 1.5);
assert.throws(() => convertInches(Number.NaN, 'in', 'm'));

console.log('inch-converter calculation.test.ts: ok');
