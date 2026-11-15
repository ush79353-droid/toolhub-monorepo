import assert from 'node:assert/strict';
import { COUNTRIES, countryForIana, zonesForCountry } from './countries';
import {
  convertFromLocal,
  convertFromZulu,
  formatZuluIso,
  formatZuluLabel,
  isDaylightSaving,
  parseClockTime,
  shareResultText,
} from './calculation';
import { parseTimeField } from './validation';

function utc(iso: string): Date {
  const d = new Date(iso);
  assert.ok(Number.isFinite(d.getTime()));
  return d;
}

{
  const zulu = convertFromZulu('2026-01-15', '12:00', 'Etc/UTC');
  assert.equal(zulu.zuluTime, '12:00');
  assert.equal(zulu.localTime, '12:00');
  assert.equal(zulu.offsetMinutes, 0);
  assert.equal(zulu.dstActive, false);
  assert.equal(formatZuluLabel(zulu.zuluTime), '12:00Z');
  assert.equal(formatZuluIso(zulu.zuluDate, zulu.zuluTime), '2026-01-15T12:00:00Z');
}

{
  const ny = convertFromZulu('2026-01-15', '12:00', 'America/New_York');
  assert.equal(ny.localTime, '07:00');
  assert.equal(ny.offsetMinutes, -300);
  assert.equal(ny.dstActive, false);
  assert.equal(ny.abbreviation.includes('EST') || ny.offsetLabel === 'UTC−05:00', true);
}

{
  const ny = convertFromZulu('2026-07-15', '12:00', 'America/New_York');
  assert.equal(ny.localTime, '08:00');
  assert.equal(ny.offsetMinutes, -240);
  assert.equal(ny.dstActive, true);
}

{
  const chi = convertFromZulu('2026-01-15', '12:00', 'America/Chicago');
  assert.equal(chi.localTime, '06:00');
  assert.equal(chi.offsetMinutes, -360);
  assert.equal(chi.dstActive, false);
}

{
  const chi = convertFromZulu('2026-07-15', '12:00', 'America/Chicago');
  assert.equal(chi.localTime, '07:00');
  assert.equal(chi.offsetMinutes, -300);
  assert.equal(chi.dstActive, true);
}

{
  const den = convertFromZulu('2026-01-15', '12:00', 'America/Denver');
  assert.equal(den.localTime, '05:00');
  assert.equal(den.offsetMinutes, -420);
}

{
  const den = convertFromZulu('2026-07-15', '12:00', 'America/Denver');
  assert.equal(den.localTime, '06:00');
  assert.equal(den.offsetMinutes, -360);
}

{
  const la = convertFromZulu('2026-01-15', '12:00', 'America/Los_Angeles');
  assert.equal(la.localTime, '04:00');
  assert.equal(la.offsetMinutes, -480);
}

{
  const la = convertFromZulu('2026-07-15', '12:00', 'America/Los_Angeles');
  assert.equal(la.localTime, '05:00');
  assert.equal(la.offsetMinutes, -420);
}

{
  const pkt = convertFromZulu('2026-01-15', '12:00', 'Asia/Karachi');
  assert.equal(pkt.localTime, '17:00');
  assert.equal(pkt.offsetMinutes, 300);
}

{
  const ist = convertFromZulu('2026-01-15', '12:00', 'Asia/Kolkata');
  assert.equal(ist.localTime, '17:30');
  assert.equal(ist.offsetMinutes, 330);
}

{
  const jst = convertFromZulu('2026-01-15', '12:00', 'Asia/Tokyo');
  assert.equal(jst.localTime, '21:00');
  assert.equal(jst.offsetMinutes, 540);
}

{
  const npt = convertFromZulu('2026-01-15', '12:00', 'Asia/Kathmandu');
  assert.equal(npt.localTime, '17:45');
  assert.equal(npt.offsetMinutes, 345);
}

{
  const tokyo = convertFromZulu('2026-01-15', '20:00', 'Asia/Tokyo');
  assert.equal(tokyo.localDate, '2026-01-16');
  assert.equal(tokyo.localTime, '05:00');
  assert.equal(tokyo.dayDelta, 1);
}

{
  const la = convertFromZulu('2026-01-15', '02:00', 'America/Los_Angeles');
  assert.equal(la.localDate, '2026-01-14');
  assert.equal(la.dayDelta, -1);
}

{
  const year = convertFromZulu('2025-12-31', '22:00', 'Asia/Tokyo');
  assert.equal(year.localDate, '2026-01-01');
}

{
  const leap = convertFromZulu('2024-02-29', '12:00', 'America/New_York');
  assert.equal(leap.zuluDate, '2024-02-29');
  assert.equal(leap.status, 'unique');
}

{
  const phoenix = convertFromZulu('2026-07-15', '12:00', 'America/Phoenix');
  assert.equal(phoenix.localTime, '05:00');
  assert.equal(phoenix.dstActive, false);
}

{
  const local = convertFromLocal('2026-01-15', '07:00', 'America/New_York', 'earlier');
  assert.equal(local.zuluTime, '12:00');
  assert.equal(local.status, 'unique');
}

{
  const gap = convertFromLocal('2026-03-08', '02:30', 'America/New_York', 'earlier');
  assert.equal(gap.status, 'nonexistent');
}

{
  const fold = convertFromLocal('2026-11-01', '01:30', 'America/New_York', 'earlier');
  assert.equal(fold.status, 'ambiguous');
  const later = convertFromLocal('2026-11-01', '01:30', 'America/New_York', 'later');
  assert.ok(later.instant.getTime() > fold.instant.getTime());
  assert.equal(fold.offsetMinutes, -240);
  assert.equal(later.offsetMinutes, -300);
}

assert.equal(parseClockTime('12:00 PM')?.hour, 12);
assert.equal(parseClockTime('12:00 AM')?.hour, 0);
assert.equal(parseClockTime('7:00 AM')?.hour, 7);
assert.equal(parseClockTime('11:30 PM')?.hour, 23);
assert.equal(parseClockTime('14:30Z')?.hour, 14);
assert.equal(parseClockTime('1200')?.hour, 12);
assert.equal(parseClockTime('abc'), null);
assert.equal(parseTimeField('').blank, true);
assert.equal(parseTimeField('12:').incomplete, true);
assert.ok(parseTimeField('99:99').error);

{
  const us = zonesForCountry('us');
  assert.ok(us.length > 1);
  assert.ok(us.some((zone) => zone.iana === 'America/New_York'));
  assert.ok(us.some((zone) => zone.iana === 'America/Chicago'));
  assert.equal(countryForIana('Asia/Karachi')?.id, 'pk');
  assert.ok(COUNTRIES.length >= 20);
}

assert.equal(isDaylightSaving(utc('2026-01-15T12:00:00Z'), 'America/New_York'), false);
assert.equal(isDaylightSaving(utc('2026-07-15T12:00:00Z'), 'America/New_York'), true);
assert.equal(isDaylightSaving(utc('2026-07-15T12:00:00Z'), 'America/Phoenix'), false);

{
  const share = shareResultText({
    dateLabel: 'January 15, 2026',
    country: 'United States',
    iana: 'America/New_York',
    zulu: '12:00 UTC',
    local: '07:00 EST',
    offset: 'UTC−05:00',
    dst: 'Inactive',
  });
  assert.match(share, /Zulu Time Converter/);
  assert.match(share, /America\/New_York/);
  assert.match(share, /12:00 UTC/);
  assert.match(share, /Inactive/);
}

console.log('zulu-time calculation.test.ts: ok');
