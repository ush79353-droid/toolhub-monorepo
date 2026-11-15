import type { ZoneGroup } from './types';

function fixed(id: string, label: string, offsetMinutes: number) {
  return { id, label, kind: 'fixed' as const, offsetMinutes };
}

function iana(id: string, label: string, zone: string) {
  return { id, label, kind: 'iana' as const, iana: zone };
}

export const ZONE_GROUPS: readonly ZoneGroup[] = [
  {
    id: 'eastern',
    title: 'Eastern Time Zones',
    zones: [
      fixed('utc-p1', 'UTC+01:00', 60),
      fixed('utc-p2', 'UTC+02:00', 120),
      fixed('utc-p3', 'UTC+03:00', 180),
      fixed('utc-p4', 'UTC+04:00', 240),
      fixed('utc-p5', 'UTC+05:00', 300),
      fixed('utc-p530', 'UTC+05:30', 330),
      fixed('utc-p545', 'UTC+05:45', 345),
      fixed('utc-p6', 'UTC+06:00', 360),
      fixed('utc-p7', 'UTC+07:00', 420),
      fixed('utc-p8', 'UTC+08:00', 480),
      fixed('utc-p9', 'UTC+09:00', 540),
      fixed('utc-p930', 'UTC+09:30', 570),
      fixed('utc-p10', 'UTC+10:00', 600),
      fixed('utc-p11', 'UTC+11:00', 660),
      fixed('utc-p12', 'UTC+12:00', 720),
      fixed('utc-p13', 'UTC+13:00', 780),
      fixed('utc-p14', 'UTC+14:00', 840),
      iana('karachi', 'Asia/Karachi (PKT)', 'Asia/Karachi'),
      iana('kolkata', 'Asia/Kolkata (IST)', 'Asia/Kolkata'),
      iana('tokyo', 'Asia/Tokyo (JST)', 'Asia/Tokyo'),
    ],
  },
  {
    id: 'western',
    title: 'Western Time Zones',
    zones: [
      fixed('utc-m1', 'UTC−01:00', -60),
      fixed('utc-m2', 'UTC−02:00', -120),
      fixed('utc-m3', 'UTC−03:00', -180),
      fixed('utc-m330', 'UTC−03:30', -210),
      fixed('utc-m4', 'UTC−04:00', -240),
      fixed('utc-m5', 'UTC−05:00', -300),
      fixed('utc-m6', 'UTC−06:00', -360),
      fixed('utc-m7', 'UTC−07:00', -420),
      fixed('utc-m8', 'UTC−08:00', -480),
      fixed('utc-m9', 'UTC−09:00', -540),
      fixed('utc-m930', 'UTC−09:30', -570),
      fixed('utc-m10', 'UTC−10:00', -600),
      fixed('utc-m11', 'UTC−11:00', -660),
      fixed('utc-m12', 'UTC−12:00', -720),
    ],
  },
  {
    id: 'eastern-summer',
    title: 'Eastern Summer Time Zones',
    zones: [
      iana('london', 'British Summer Time · Europe/London', 'Europe/London'),
      iana('berlin', 'Central European Summer Time · Europe/Berlin', 'Europe/Berlin'),
      iana('bucharest', 'Eastern European Summer Time · Europe/Bucharest', 'Europe/Bucharest'),
      iana('sydney', 'Australian Eastern Daylight Time · Australia/Sydney', 'Australia/Sydney'),
      iana('auckland', 'New Zealand Daylight Time · Pacific/Auckland', 'Pacific/Auckland'),
    ],
  },
  {
    id: 'western-summer',
    title: 'Western Summer Time Zones',
    zones: [
      iana('new-york', 'Eastern Daylight Time · America/New_York', 'America/New_York'),
      iana('chicago', 'Central Daylight Time · America/Chicago', 'America/Chicago'),
      iana('denver', 'Mountain Daylight Time · America/Denver', 'America/Denver'),
      iana('los-angeles', 'Pacific Daylight Time · America/Los_Angeles', 'America/Los_Angeles'),
      iana('halifax', 'Atlantic Daylight Time · America/Halifax', 'America/Halifax'),
    ],
  },
];
