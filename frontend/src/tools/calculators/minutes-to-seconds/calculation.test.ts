import assert from 'node:assert/strict';
import {
  minutesAndSecondsToSeconds,
  minutesToSeconds,
  secondsToMinutes,
  secondsToMinutesAndSeconds,
  shareResultText,
  valuesFromSeconds,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(minutesToSeconds(0), 0);
assert.equal(minutesToSeconds(0.5), 30);
assert.equal(minutesToSeconds(1), 60);
assert.equal(minutesToSeconds(1.5), 90);
assert.equal(minutesToSeconds(2), 120);
assert.equal(minutesToSeconds(2.5), 150);
assert.equal(minutesToSeconds(5), 300);
assert.equal(minutesToSeconds(10), 600);
assert.equal(minutesToSeconds(15), 900);
assert.equal(minutesToSeconds(30), 1800);
assert.equal(minutesToSeconds(60), 3600);

assert.equal(secondsToMinutes(30), 0.5);
assert.equal(secondsToMinutes(90), 1.5);
assert.equal(secondsToMinutes(150), 2.5);
assert.equal(secondsToMinutes(300), 5);
assert.equal(secondsToMinutes(3600), 60);

assert.equal(minutesAndSecondsToSeconds(2, 52), 172);
assert.equal(minutesAndSecondsToSeconds(4, 30), 270);

const from125 = secondsToMinutesAndSeconds(125);
assert.equal(from125.sign, 1);
assert.equal(from125.minutes, 2);
assert.equal(from125.seconds, 5);

const from172 = secondsToMinutesAndSeconds(172);
assert.equal(from172.minutes, 2);
assertClose(from172.seconds, 52);

const neg = secondsToMinutesAndSeconds(-90);
assert.equal(neg.sign, -1);
assert.equal(neg.minutes, 1);
assert.equal(neg.seconds, 30);

const v = valuesFromSeconds(150);
assert.equal(v.minutes, 2.5);
assert.equal(v.seconds, 150);
assert.equal(v.combinedMinutes, 2);
assert.equal(v.combinedSeconds, 30);

assert.match(shareResultText(150), /Minutes to Seconds/);
assert.match(shareResultText(150), /2\.5 minutes = 150 seconds/);

console.log('minutes-to-seconds calculation.test.ts: ok');
