import assert from 'node:assert/strict';
import {
  calculateDegreesMinutesSeconds,
  decimalToDMS,
  dmsToDecimal,
  formatDdAngle,
  formatDmsAngleLine,
} from './calculation';
import { parseDdDraft, parseDmsDraft } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected} ± ${eps}, got ${actual}`
  );
}

// DMS → DD
assertClose(dmsToDecimal(47, 23, 12, 1), 47.38666666666667);
assertClose(dmsToDecimal(10, 34, 47, 1), 10.579722222222222);
assertClose(dmsToDecimal(12, 30, 0, -1), -12.5);
assertClose(dmsToDecimal(0, 0, 0, 1), 0);
assertClose(dmsToDecimal(720, 30, 0, 1), 720.5);
assertClose(dmsToDecimal(10, 20, 30.5, 1), 10.341805555555556);
assertClose(dmsToDecimal(0, 30, 0, -1), -0.5);
assertClose(dmsToDecimal(0, 30, 0, 1), 0.5);
assertClose(dmsToDecimal(47, 30, 0, 1), 47.5);
assertClose(dmsToDecimal(10, 30, 0, 1), 10.5);

assert.throws(() => dmsToDecimal(-1, 0, 0, 1));
assert.throws(() => dmsToDecimal(0, 60, 0, 1));
assert.throws(() => dmsToDecimal(0, 0, 60, 1));
assert.throws(() => dmsToDecimal(0, -1, 0, 1));

// DD → DMS
{
  const p = decimalToDMS(47.38666666666667);
  assert.equal(p.sign, 1);
  assert.equal(p.degrees, 47);
  assert.equal(p.minutes, 23);
  assertClose(p.seconds, 12, 0.01);
}

{
  const p = decimalToDMS(-12.5);
  assert.equal(p.sign, -1);
  assert.equal(p.degrees, 12);
  assert.equal(p.minutes, 30);
  assertClose(p.seconds, 0, 1e-6);
}

{
  const p = decimalToDMS(10.5797222222);
  assert.equal(p.degrees, 10);
  assert.equal(p.minutes, 34);
  assertClose(p.seconds, 47, 0.05);
}

{
  const p = decimalToDMS(720.5);
  assert.equal(p.degrees, 720);
  assert.equal(p.minutes, 30);
  assertClose(p.seconds, 0, 1e-6);
}

// Rounding carry: seconds must not display as 60
{
  const crafted = 47 + 22 / 60 + 59.999999 / 3600;
  const p = decimalToDMS(crafted, 2);
  assert.ok(p.seconds < 60);
  assert.ok(p.minutes < 60);
}

// Round-trip
for (const dd of [0, 0.5, 12.25, 47.3866666667, -12.5, 360, 720.5, -0.5, 90]) {
  const parts = decimalToDMS(dd);
  const back = dmsToDecimal(parts.degrees, parts.minutes, parts.seconds, parts.sign);
  assertClose(back, dd, 1e-6);
}

// Near-zero negative keeps southern/negative sign
{
  const neg = decimalToDMS(-1e-15);
  assert.equal(neg.sign, -1);
}

// Validation DMS
{
  const ok = parseDmsDraft({ degrees: '47', minutes: '23', seconds: '12' });
  assert.equal(ok.isValid, true);
  assertClose(ok.decimalDegrees!, 47.38666666666667);
}

{
  const neg = parseDmsDraft({ degrees: '-12', minutes: '30', seconds: '0' });
  assert.equal(neg.isValid, true);
  assertClose(neg.decimalDegrees!, -12.5);
}

{
  const negZero = parseDmsDraft({ degrees: '-0', minutes: '30', seconds: '0' });
  assert.equal(negZero.isValid, true);
  assertClose(negZero.decimalDegrees!, -0.5);
}

{
  const bad = parseDmsDraft({ degrees: '10', minutes: '60', seconds: '0' });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.minutes);
}

{
  const blank = parseDmsDraft({ degrees: '', minutes: '', seconds: '' });
  assert.equal(blank.blank, true);
}

{
  const large = parseDmsDraft({ degrees: '720', minutes: '30', seconds: '' });
  assert.equal(large.isValid, true);
  assertClose(large.decimalDegrees!, 720.5);
}

// Validation DD
{
  const ok = parseDdDraft('10.5797222222');
  assert.equal(ok.isValid, true);
  assertClose(ok.decimalDegrees!, 10.5797222222);
}

{
  const blank = parseDdDraft('');
  assert.equal(blank.blank, true);
}

{
  const result = calculateDegreesMinutesSeconds({
    activeInput: 'DMS',
    decimalDegrees: 47.38666666666667,
  });
  assert.equal(result.dms.degrees, 47);
  assert.equal(result.dms.minutes, 23);
  assert.ok(formatDmsAngleLine(result.dms).includes('47°'));
  assert.ok(formatDdAngle(result.decimalDegrees).startsWith('47.3866'));
}

console.log('degrees-minutes-seconds calculation.test.ts: ok');
