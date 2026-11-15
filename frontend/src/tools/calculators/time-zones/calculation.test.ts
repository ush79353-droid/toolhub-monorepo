import assert from 'node:assert/strict';
import {
  calendarDayDelta,
  formatDisplayTime,
  formatOffsetLabel,
  formatWallTime12,
  instantInZone,
  parseDateTime,
  pickInstant,
  zonedClockToInstant,
} from './calculation';
import { ZONE_BY_ID } from './zones';

function utc(iso: string): Date {
  const d = new Date(iso);
  assert.ok(Number.isFinite(d.getTime()));
  return d;
}

const utcNoon = utc('2026-11-15T12:00:00.000Z');

{
  const london = instantInZone(utcNoon, ZONE_BY_ID.london);
  const dubai = instantInZone(utcNoon, ZONE_BY_ID.dubai);
  const karachi = instantInZone(utcNoon, ZONE_BY_ID.karachi);
  const mumbai = instantInZone(utcNoon, ZONE_BY_ID.mumbai);
  const tokyo = instantInZone(utcNoon, ZONE_BY_ID.tokyo);
  const ny = instantInZone(utcNoon, ZONE_BY_ID['new-york']);
  const la = instantInZone(utcNoon, ZONE_BY_ID['los-angeles']);
  assert.equal(london.time, '12:00');
  assert.equal(dubai.time, '16:00');
  assert.equal(karachi.time, '17:00');
  assert.equal(mumbai.time, '17:30');
  assert.equal(tokyo.time, '21:00');
  assert.equal(ny.time, '07:00');
  assert.equal(la.time, '04:00');
}

{
  const tokyo = instantInZone(utc('2026-11-15T20:00:00.000Z'), ZONE_BY_ID.tokyo);
  assert.equal(tokyo.date, '2026-11-16');
  assert.equal(tokyo.time, '05:00');
  assert.equal(calendarDayDelta('2026-11-15', tokyo.date), 1);
}

{
  const la = instantInZone(utc('2026-11-15T02:00:00.000Z'), ZONE_BY_ID['los-angeles']);
  assert.equal(la.date, '2026-11-14');
  assert.equal(la.time, '18:00');
  assert.equal(calendarDayDelta('2026-11-15', la.date), -1);
}

{
  const clock = parseDateTime('2026-11-15', '12:00');
  assert.ok(clock);
  const result = zonedClockToInstant(clock, ZONE_BY_ID.utc);
  const instant = pickInstant(result, 'earlier')!;
  const mumbai = instantInZone(instant, ZONE_BY_ID.mumbai);
  assert.equal(mumbai.time, '17:30');
}

{
  const ny = instantInZone(utc('2026-03-08T07:00:00.000Z'), ZONE_BY_ID['new-york']);
  assert.equal(ny.time, '03:00');
  assert.equal(ny.offsetMinutes, -240);
}

{
  const clock = parseDateTime('2026-03-08', '02:30');
  assert.ok(clock);
  const result = zonedClockToInstant(clock, ZONE_BY_ID['new-york']);
  assert.equal(result.status, 'nonexistent');
}

{
  const clock = parseDateTime('2026-11-01', '01:30');
  assert.ok(clock);
  const result = zonedClockToInstant(clock, ZONE_BY_ID['new-york']);
  assert.equal(result.status, 'ambiguous');
  assert.equal(result.instants.length, 2);
  const earlier = pickInstant(result, 'earlier')!;
  const later = pickInstant(result, 'later')!;
  assert.ok(later.getTime() > earlier.getTime());
  assert.equal(instantInZone(earlier, ZONE_BY_ID['new-york']).offsetMinutes, -240);
  assert.equal(instantInZone(later, ZONE_BY_ID['new-york']).offsetMinutes, -300);
}

{
  const clock = parseDateTime('2026-03-29', '01:30');
  assert.ok(clock);
  assert.equal(zonedClockToInstant(clock, ZONE_BY_ID.london).status, 'nonexistent');
}

{
  const sydney = instantInZone(utc('2026-11-15T12:00:00.000Z'), ZONE_BY_ID.sydney);
  assert.equal(sydney.offsetMinutes, 660);
}

{
  const ktm = instantInZone(utcNoon, ZONE_BY_ID.kathmandu);
  assert.equal(ktm.time, '17:45');
  assert.equal(formatOffsetLabel(345), 'UTC+05:45');
}

{
  const leap = parseDateTime('2024-02-29', '12:00');
  assert.ok(leap);
  const invalid = parseDateTime('2025-02-29', '12:00');
  assert.equal(invalid, null);
}

{
  const year = instantInZone(utc('2025-12-31T22:00:00.000Z'), ZONE_BY_ID.tokyo);
  assert.equal(year.date, '2026-01-01');
}

assert.equal(formatWallTime12({ year: 2026, month: 11, day: 15, hour: 7, minute: 0, second: 0 }), '7:00 AM');
assert.equal(
  formatDisplayTime(
    instantInZone(utcNoon, ZONE_BY_ID['new-york']),
    'h12',
  ),
  '7:00 AM',
);

{
  const clock = parseDateTime('2026-11-15', '17:00');
  assert.ok(clock);
  const result = zonedClockToInstant(clock, ZONE_BY_ID.karachi);
  const instant = pickInstant(result, 'earlier')!;
  assert.equal(instantInZone(instant, ZONE_BY_ID.london).time, '12:00');
}

console.log('time-zones calculation.test.ts: ok');
