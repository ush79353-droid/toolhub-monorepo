import type { ZoneDef, ZoneGroup } from './types';

function fixed(id: string, city: string, label: string, offsetMinutes: number): ZoneDef {
  return { id, city, label, kind: 'fixed', offsetMinutes };
}

function iana(id: string, city: string, label: string, zone: string): ZoneDef {
  return { id, city, label, kind: 'iana', iana: zone };
}

export const UTC_ZONE: ZoneDef = fixed('utc', 'UTC', 'Coordinated Universal Time (fixed)', 0);

export const ZONE_CATALOG: readonly ZoneDef[] = [
  UTC_ZONE,
  iana('london', 'London', 'Europe/London', 'Europe/London'),
  iana('paris', 'Paris', 'Europe/Paris (CET/CEST)', 'Europe/Paris'),
  iana('berlin', 'Berlin', 'Europe/Berlin', 'Europe/Berlin'),
  iana('helsinki', 'Helsinki', 'Europe/Helsinki (EET/EEST)', 'Europe/Helsinki'),
  iana('nairobi', 'Nairobi', 'Africa/Nairobi (UTC+03, fixed)', 'Africa/Nairobi'),
  iana('dubai', 'Dubai', 'Asia/Dubai (UTC+04, fixed)', 'Asia/Dubai'),
  iana('karachi', 'Karachi', 'Asia/Karachi (PKT, UTC+05)', 'Asia/Karachi'),
  iana('mumbai', 'Mumbai', 'Asia/Kolkata (IST, UTC+05:30)', 'Asia/Kolkata'),
  iana('kathmandu', 'Kathmandu', 'Asia/Kathmandu (UTC+05:45)', 'Asia/Kathmandu'),
  iana('dhaka', 'Dhaka', 'Asia/Dhaka (BST, UTC+06)', 'Asia/Dhaka'),
  iana('bangkok', 'Bangkok', 'Asia/Bangkok (UTC+07, fixed)', 'Asia/Bangkok'),
  iana('singapore', 'Singapore', 'Asia/Singapore (UTC+08, fixed)', 'Asia/Singapore'),
  iana('tokyo', 'Tokyo', 'Asia/Tokyo (JST, UTC+09)', 'Asia/Tokyo'),
  iana('seoul', 'Seoul', 'Asia/Seoul', 'Asia/Seoul'),
  iana('adelaide', 'Adelaide', 'Australia/Adelaide (UTC+09:30 / +10:30)', 'Australia/Adelaide'),
  iana('sydney', 'Sydney', 'Australia/Sydney', 'Australia/Sydney'),
  iana('auckland', 'Auckland', 'Pacific/Auckland', 'Pacific/Auckland'),
  iana('tonga', 'Nukuʻalofa', 'Pacific/Tongatapu (UTC+13)', 'Pacific/Tongatapu'),
  iana('azores', 'Azores', 'Atlantic/Azores', 'Atlantic/Azores'),
  iana('noronha', 'Fernando de Noronha', 'America/Noronha (UTC−02)', 'America/Noronha'),
  iana('sao-paulo', 'São Paulo', 'America/Sao_Paulo', 'America/Sao_Paulo'),
  iana('halifax', 'Halifax', 'America/Halifax', 'America/Halifax'),
  iana('new-york', 'New York', 'America/New_York', 'America/New_York'),
  iana('toronto', 'Toronto', 'America/Toronto', 'America/Toronto'),
  iana('chicago', 'Chicago', 'America/Chicago', 'America/Chicago'),
  iana('denver', 'Denver', 'America/Denver', 'America/Denver'),
  iana('los-angeles', 'Los Angeles', 'America/Los_Angeles', 'America/Los_Angeles'),
  iana('anchorage', 'Anchorage', 'America/Anchorage', 'America/Anchorage'),
  iana('honolulu', 'Honolulu', 'Pacific/Honolulu (HST, UTC−10)', 'Pacific/Honolulu'),
  iana('pago-pago', 'Pago Pago', 'Pacific/Pago_Pago (UTC−11)', 'Pacific/Pago_Pago'),
  fixed('utc-m12', 'UTC−12', 'Fixed offset UTC−12:00', -720),
];

export const ZONE_BY_ID: Readonly<Record<string, ZoneDef>> = Object.freeze(
  Object.fromEntries(ZONE_CATALOG.map((z) => [z.id, z])),
);

export const EASTERN_ZONE_IDS = [
  'paris',
  'helsinki',
  'nairobi',
  'dubai',
  'karachi',
  'mumbai',
  'dhaka',
  'bangkok',
  'singapore',
  'tokyo',
  'adelaide',
  'sydney',
  'auckland',
  'tonga',
] as const;

export const WESTERN_ZONE_IDS = [
  'azores',
  'noronha',
  'sao-paulo',
  'halifax',
  'new-york',
  'chicago',
  'denver',
  'los-angeles',
  'anchorage',
  'honolulu',
  'pago-pago',
  'utc-m12',
] as const;

export const ZONE_GROUPS: readonly ZoneGroup[] = [
  { id: 'eastern', title: 'Eastern time zones', zoneIds: EASTERN_ZONE_IDS },
  { id: 'western', title: 'Western time zones', zoneIds: WESTERN_ZONE_IDS },
];

const DEFAULT_SHOWN = new Set<string>(['utc', ...EASTERN_ZONE_IDS, ...WESTERN_ZONE_IDS]);

export const ADDABLE_ZONE_IDS = ZONE_CATALOG.map((z) => z.id).filter((id) => !DEFAULT_SHOWN.has(id));

export function isIanaSupported(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date(0));
    return true;
  } catch {
    return false;
  }
}
