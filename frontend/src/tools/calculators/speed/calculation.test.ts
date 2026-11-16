import assert from 'node:assert/strict';
import {
  convertSpeed,
  fromMetersPerSecondPace,
  paceSecondsToSpeed,
  paceToMetersPerSecond,
  shareResultText,
  speedToPaceSeconds,
  toMetersPerSecond,
} from './calculation';
import { mpsFromField, parseSpeedInput } from './validation';

function close(actual: number, expected: number, digits = 5): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

close(convertSpeed(60, 'mph', 'kmh'), 96.56064);
close(convertSpeed(100, 'kmh', 'mph'), 62.137119);
close(convertSpeed(10, 'mps', 'kmh'), 36);
close(convertSpeed(20, 'ftPerSec', 'mps'), 6.096);
close(convertSpeed(10, 'knot', 'kmh'), 18.52);

{
  const mps = toMetersPerSecond(12, 'kmh');
  const sec = speedToPaceSeconds(mps, 1000);
  assert.ok(sec != null);
  close(sec!, 300);
}

{
  const mps = paceSecondsToSpeed(240, 1000);
  assert.ok(mps != null);
  close(mps!, 1000 / 240);
  close(convertSpeed(mps!, 'mps', 'kmh'), 15);
}
close(fromMetersPerSecondPace(toMetersPerSecond(12, 'kmh'), 'minPerKm')!, 5);
close(fromMetersPerSecondPace(toMetersPerSecond(15, 'kmh'), 'minPerKm')!, 4);

assert.equal(speedToPaceSeconds(0, 1000), null);
assert.equal(paceToMetersPerSecond(0, 'minPerKm'), null);

assert.equal(parseSpeedInput('').blank, true);
assert.ok(parseSpeedInput('-1').error);
assert.ok(mpsFromField(0, 'minPerKm').ok === false);
assert.ok(mpsFromField(60, 'mph').ok);

assert.match(shareResultText(toMetersPerSecond(60, 'mph')), /mph/);
assert.match(shareResultText(toMetersPerSecond(12, 'kmh')), /min\/km/);

console.log('speed calculation.test.ts: ok');
