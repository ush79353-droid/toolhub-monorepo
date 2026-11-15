import assert from 'node:assert/strict';
import {
  convertUnixDisplay,
  dateToUnixSeconds,
  formatFixedOffset,
  formatUtcDate,
  formatUtcTime,
  parseUtcDateTime,
  unixMillisecondsToDate,
  unixSecondsToDate,
} from './calculation';
import { parseUnixInput } from './validation';

assert.equal(unixSecondsToDate(0).toISOString(), '1970-01-01T00:00:00.000Z');
assert.equal(unixSecondsToDate(86400).toISOString(), '1970-01-02T00:00:00.000Z');
assert.equal(unixSecondsToDate(-1).toISOString(), '1969-12-31T23:59:59.000Z');
assert.equal(unixSecondsToDate(2147483647).toISOString(), '2038-01-19T03:14:07.000Z');

assert.equal(dateToUnixSeconds(new Date('1970-01-01T00:00:00Z')), 0);
assert.equal(dateToUnixSeconds(new Date('1970-01-02T00:00:00Z')), 86400);

assert.equal(unixMillisecondsToDate(1000).toISOString(), '1970-01-01T00:00:01.000Z');

assert.equal(convertUnixDisplay(1700000000, 'seconds', 'milliseconds'), 1700000000000);
assert.equal(convertUnixDisplay(1700000000000, 'milliseconds', 'seconds'), 1700000000);

{
  const d = unixSecondsToDate(1_794_744_000);
  assert.equal(formatUtcDate(d), '2026-11-15');
  assert.equal(formatUtcTime(d), '12:00:00');
}

{
  const d = parseUtcDateTime('1970-01-01', '00:00:00');
  assert.ok(d);
  assert.equal(d!.toISOString(), '1970-01-01T00:00:00.000Z');
}
assert.equal(parseUtcDateTime('2026-02-30', '12:00:00'), null);

assert.equal(
  formatFixedOffset(unixSecondsToDate(0), 330),
  '1970-01-01 05:30:00 (UTC+05:30)',
);

{
  const ok = parseUnixInput('0', 'seconds');
  assert.equal(ok.ok, true);
}
{
  const bad = parseUnixInput('abc', 'seconds');
  assert.equal(bad.ok, false);
}

console.log('unix-time calculation.test.ts: ok');
