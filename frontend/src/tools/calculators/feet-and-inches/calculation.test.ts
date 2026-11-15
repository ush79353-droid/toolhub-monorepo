import assert from 'node:assert/strict';
import {
  calculateFeetAndInches,
  lengthPartsToTotalInches,
  normalizeTotalInches,
  parseFeetInput,
  parseLengthInput,
  toTotalInches,
} from './calculation';
import { DEFAULT_FEET_AND_INCHES_INPUT, DEFAULT_PRECISION } from './types';
import { draftScalars } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

assert.equal(toTotalInches(5, 8), 68);
assert.equal(toTotalInches(0, 12), 12);
assert.equal(toTotalInches(-2, 0), -24);
assert.equal(toTotalInches(-1, 6), -18);

assert.equal(parseLengthInput('1/2').kind === 'ok' && parseLengthInput('1/2').kind === 'ok', true);
{
  const half = parseLengthInput('1/2');
  assert.equal(half.kind, 'ok');
  if (half.kind === 'ok') assert.equal(half.value, 0.5);
}
{
  const mixed = parseLengthInput('2 3/8');
  assert.equal(mixed.kind, 'ok');
  if (mixed.kind === 'ok') assert.equal(mixed.value, 2.375);
}
{
  const threeEight = parseLengthInput('3/8');
  assert.equal(threeEight.kind, 'ok');
  if (threeEight.kind === 'ok') assert.equal(threeEight.value, 0.375);
}
{
  const sevenSixteen = parseLengthInput('7/16');
  assert.equal(sevenSixteen.kind, 'ok');
  if (sevenSixteen.kind === 'ok') assert.equal(sevenSixteen.value, 0.4375);
}

assert.equal(parseFeetInput('5').kind, 'ok');
assert.equal(parseFeetInput('1.').kind, 'incomplete');
assert.equal(parseLengthInput('1/').kind, 'incomplete');

{
  const r = calculateFeetAndInches({
    operation: 'add',
    first: { feet: 5, inches: 8 },
    second: { feet: 2, inches: 4 },
    scalar: null,
    precision: 16,
  });
  assert.equal(r.totalInches, 96);
  assert.equal(r.normalized.mixedLabel, '8 ft 0 in');
}

{
  const r = calculateFeetAndInches({
    operation: 'add',
    first: { feet: 3, inches: 8 },
    second: { feet: 2, inches: 7 },
    scalar: null,
    precision: 16,
  });
  assert.equal(r.totalInches, 75);
  assert.equal(r.normalized.mixedLabel, '6 ft 3 in');
}

{
  const r = calculateFeetAndInches({
    operation: 'add',
    first: { feet: 2, inches: 3.5 },
    second: { feet: 1, inches: 4.25 },
    scalar: null,
    precision: 16,
  });
  assertClose(r.totalInches, 43.75);
  assert.equal(r.normalized.mixedLabel, '3 ft 7 3/4 in');
}

{
  const r = calculateFeetAndInches({
    operation: 'subtract',
    first: { feet: 7, inches: 3 },
    second: { feet: 2, inches: 8 },
    scalar: null,
    precision: 16,
  });
  assert.equal(r.totalInches, 55);
  assert.equal(r.normalized.mixedLabel, '4 ft 7 in');
}

{
  const r = calculateFeetAndInches({
    operation: 'subtract',
    first: { feet: 6, inches: 2 },
    second: { feet: 3, inches: 8 },
    scalar: null,
    precision: 16,
  });
  assert.equal(r.totalInches, 30);
  assert.equal(r.normalized.mixedLabel, '2 ft 6 in');
}

{
  const r = calculateFeetAndInches({
    operation: 'subtract',
    first: { feet: 2, inches: 0 },
    second: { feet: 3, inches: 6 },
    scalar: null,
    precision: 16,
  });
  assert.equal(r.totalInches, -18);
  assert.equal(r.normalized.mixedLabel, '-1 ft 6 in');
}

{
  const r = calculateFeetAndInches({
    operation: 'multiply',
    first: { feet: 3, inches: 6 },
    second: { feet: null, inches: null },
    scalar: 2,
    precision: 16,
  });
  assert.equal(r.totalInches, 84);
  assert.equal(r.normalized.mixedLabel, '7 ft 0 in');
}

{
  const r = calculateFeetAndInches({
    operation: 'multiply',
    first: { feet: 4, inches: 3 },
    second: { feet: null, inches: null },
    scalar: 3,
    precision: 16,
  });
  assert.equal(r.totalInches, 153);
  assert.equal(r.normalized.mixedLabel, '12 ft 9 in');
}

{
  const r = calculateFeetAndInches({
    operation: 'divide',
    first: { feet: 10, inches: 0 },
    second: { feet: null, inches: null },
    scalar: 4,
    precision: 16,
  });
  assert.equal(r.totalInches, 30);
  assert.equal(r.normalized.mixedLabel, '2 ft 6 in');
}

{
  const r = calculateFeetAndInches({
    operation: 'divide',
    first: { feet: 8, inches: 6 },
    second: { feet: null, inches: null },
    scalar: 3,
    precision: 16,
  });
  assert.equal(r.totalInches, 34);
  assert.equal(r.normalized.mixedLabel, '2 ft 10 in');
}

{
  const n = normalizeTotalInches(62, 16);
  assert.equal(n.mixedLabel, '5 ft 2 in');
}

{
  const n = normalizeTotalInches(98.5, 16);
  assert.equal(n.mixedLabel, '8 ft 2 1/2 in');
  assertClose(n.totalInches, 98.5);
}

{
  // Rounding near next foot: 11.999 at 1/16 → 12 in = 1 ft 0 in
  const n = normalizeTotalInches(11.999, 16);
  assert.equal(n.mixedLabel, '1 ft 0 in');
  assert.equal(n.isApproximate, true);
}

{
  const demo = calculateFeetAndInches(DEFAULT_FEET_AND_INCHES_INPUT);
  assert.equal(demo.totalInches, 96);
  assertClose(demo.decimalFeet, 8);
  const m = demo.otherUnits.find((row) => row.unit === 'm');
  assert.ok(m && Math.abs(m.value - 96 * 0.0254) < 1e-12);
}

{
  assert.equal(lengthPartsToTotalInches({ feet: 5, inches: null }), 60);
  assert.equal(lengthPartsToTotalInches({ feet: null, inches: 8 }), 8);
  assert.equal(lengthPartsToTotalInches({ feet: null, inches: null }), null);
}

{
  const ok = draftScalars('add', '5', '8', '2', '4', '', DEFAULT_PRECISION);
  assert.equal(ok.isValid, true);
  assert.equal(ok.input?.first.feet, 5);

  const divZero = draftScalars('divide', '10', '0', '', '', '0', DEFAULT_PRECISION);
  assert.equal(divZero.isValid, false);
  assert.ok(divZero.errors.scalar);

  const blank = draftScalars('add', '', '', '', '', '', DEFAULT_PRECISION);
  assert.equal(blank.isValid, false);

  const frac = draftScalars('add', '2', '3 1/2', '1', '4 1/4', '', DEFAULT_PRECISION);
  assert.equal(frac.isValid, true);
  assert.equal(frac.input?.first.inches, 3.5);
  assert.equal(frac.input?.second.inches, 4.25);
}

console.log('feet-and-inches calculation.test.ts: ok');
