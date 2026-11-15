import assert from 'node:assert/strict';
import {
  combineHms,
  convertHoursToMinutes,
  convertMinutesToHours,
  formatDurationDisplay,
  formatHms,
  fromSeconds,
  parseDecimalString,
  splitHms,
  toSeconds,
} from './calculation';
import { parseDurationInput, parseHmsComponent } from './validation';

assert.equal(convertMinutesToHours(60), 1);
assert.equal(convertMinutesToHours(90), 1.5);
assert.equal(convertMinutesToHours(150), 2.5);
assert.equal(convertMinutesToHours(30), 0.5);
assert.equal(convertHoursToMinutes(1), 60);
assert.equal(convertHoursToMinutes(2.5), 150);

{
  const sec = toSeconds(parseDecimalString('150')!, 'minutes');
  assert.equal(formatDurationDisplay(fromSeconds(sec, 'hours')), '2.5');
  assert.equal(formatDurationDisplay(fromSeconds(sec, 'seconds')), '9000');
  assert.equal(formatHms(splitHms(sec)), '02:30:00');
}

{
  const sec = toSeconds(parseDecimalString('135')!, 'minutes');
  assert.equal(formatDurationDisplay(fromSeconds(sec, 'hours')), '2.25');
  assert.equal(formatHms(splitHms(sec)), '02:15:00');
}

{
  const sec = toSeconds(parseDecimalString('3600')!, 'seconds');
  assert.equal(formatDurationDisplay(fromSeconds(sec, 'hours')), '1');
}

{
  const sec = toSeconds(parseDecimalString('5400')!, 'seconds');
  assert.equal(formatDurationDisplay(fromSeconds(sec, 'hours')), '1.5');
}

{
  const sec = toSeconds(parseDecimalString('1440')!, 'minutes');
  assert.equal(formatHms(splitHms(sec)), '24:00:00');
}

{
  const sec = toSeconds(parseDecimalString('1500')!, 'minutes');
  assert.equal(formatHms(splitHms(sec)), '25:00:00');
}

{
  const sec = combineHms({ sign: 1, hours: '4', minutes: '20', seconds: '30' });
  assert.equal(formatDurationDisplay(fromSeconds(sec, 'minutes')), '260.5');
  assert.equal(formatDurationDisplay(fromSeconds(sec, 'seconds')), '15630');
  assert.equal(formatHms(splitHms(sec)), '04:20:30');
}

{
  const sec = toSeconds(parseDecimalString('-150')!, 'minutes');
  assert.equal(formatHms(splitHms(sec)), '-02:30:00');
  assert.equal(formatDurationDisplay(fromSeconds(sec, 'hours')), '-2.5');
}

{
  const sec = toSeconds(parseDecimalString('0')!, 'minutes');
  assert.equal(formatHms(splitHms(sec)), '00:00:00');
}

{
  const sec = combineHms({ sign: 1, hours: '0', minutes: '0', seconds: '1.5' });
  assert.equal(formatDurationDisplay(fromSeconds(sec, 'seconds')), '1.5');
  assert.equal(formatHms(splitHms(sec)), '00:00:01.5');
}

assert.equal(parseDurationInput('').blank, true);
assert.ok(parseDurationInput('abc').error);
assert.ok(parseHmsComponent('60', 'minutes').error);
assert.ok(parseHmsComponent('30', 'minutes').value);

console.log('minutes-to-hours calculation.test.ts: ok');
