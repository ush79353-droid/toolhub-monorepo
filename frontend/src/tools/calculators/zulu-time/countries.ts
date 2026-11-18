export interface CountryZone {
  iana: string;
  label: string;
}

export interface CountryDef {
  id: string;
  name: string;
  zones: readonly CountryZone[];
}

export const COUNTRIES: readonly CountryDef[] = [
  {
    id: 'us',
    name: 'United States of America (the)',
    zones: [
      { iana: 'America/New_York', label: 'Eastern Time (ET)' },
      { iana: 'America/Chicago', label: 'Central Time (CT)' },
      { iana: 'America/Denver', label: 'Mountain Time (MT)' },
      { iana: 'America/Phoenix', label: 'Mountain Time — Arizona (no DST)' },
      { iana: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
      { iana: 'America/Anchorage', label: 'Alaska Time (AKT)' },
      { iana: 'Pacific/Honolulu', label: 'Hawaii–Aleutian Time (HT)' },
    ],
  },
  {
    id: 'ca',
    name: 'Canada',
    zones: [
      { iana: 'America/St_Johns', label: 'Newfoundland Time (NT)' },
      { iana: 'America/Halifax', label: 'Atlantic Time (AT)' },
      { iana: 'America/Toronto', label: 'Eastern Time (ET)' },
      { iana: 'America/Winnipeg', label: 'Central Time (CT)' },
      { iana: 'America/Edmonton', label: 'Mountain Time (MT)' },
      { iana: 'America/Vancouver', label: 'Pacific Time (PT)' },
    ],
  },
  {
    id: 'gb',
    name: 'United Kingdom of Great Britain and Northern Ireland (the)',
    zones: [{ iana: 'Europe/London', label: 'Greenwich / British Time (GMT/BST)' }],
  },
  {
    id: 'fr',
    name: 'France',
    zones: [{ iana: 'Europe/Paris', label: 'Central European Time (CET/CEST)' }],
  },
  {
    id: 'de',
    name: 'Germany',
    zones: [{ iana: 'Europe/Berlin', label: 'Central European Time (CET/CEST)' }],
  },
  {
    id: 'pk',
    name: 'Pakistan',
    zones: [{ iana: 'Asia/Karachi', label: 'Pakistan Standard Time (PKT)' }],
  },
  {
    id: 'in',
    name: 'India',
    zones: [{ iana: 'Asia/Kolkata', label: 'India Standard Time (IST)' }],
  },
  {
    id: 'np',
    name: 'Nepal',
    zones: [{ iana: 'Asia/Kathmandu', label: 'Nepal Time (NPT)' }],
  },
  {
    id: 'ae',
    name: 'United Arab Emirates (the)',
    zones: [{ iana: 'Asia/Dubai', label: 'Gulf Standard Time (GST)' }],
  },
  {
    id: 'jp',
    name: 'Japan',
    zones: [{ iana: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' }],
  },
  {
    id: 'au',
    name: 'Australia',
    zones: [
      { iana: 'Australia/Sydney', label: 'Eastern (Sydney)' },
      { iana: 'Australia/Adelaide', label: 'Central (Adelaide)' },
      { iana: 'Australia/Perth', label: 'Western (Perth)' },
    ],
  },
  {
    id: 'nz',
    name: 'New Zealand',
    zones: [{ iana: 'Pacific/Auckland', label: 'New Zealand Time (NZST/NZDT)' }],
  },
  {
    id: 'br',
    name: 'Brazil',
    zones: [{ iana: 'America/Sao_Paulo', label: 'Brasília Time' }],
  },
  {
    id: 'mx',
    name: 'Mexico',
    zones: [
      { iana: 'America/Mexico_City', label: 'Central Time (Mexico City)' },
      { iana: 'America/Tijuana', label: 'Pacific Time (Tijuana)' },
    ],
  },
  {
    id: 'cn',
    name: 'China',
    zones: [{ iana: 'Asia/Shanghai', label: 'China Standard Time (CST)' }],
  },
  {
    id: 'sg',
    name: 'Singapore',
    zones: [{ iana: 'Asia/Singapore', label: 'Singapore Time (SGT)' }],
  },
  {
    id: 'za',
    name: 'South Africa',
    zones: [{ iana: 'Africa/Johannesburg', label: 'South Africa Standard Time (SAST)' }],
  },
  {
    id: 'ke',
    name: 'Kenya',
    zones: [{ iana: 'Africa/Nairobi', label: 'East Africa Time (EAT)' }],
  },
  {
    id: 'kr',
    name: 'Korea (the Republic of)',
    zones: [{ iana: 'Asia/Seoul', label: 'Korea Standard Time (KST)' }],
  },
  {
    id: 'th',
    name: 'Thailand',
    zones: [{ iana: 'Asia/Bangkok', label: 'Indochina Time (ICT)' }],
  },
  {
    id: 'bd',
    name: 'Bangladesh',
    zones: [{ iana: 'Asia/Dhaka', label: 'Bangladesh Standard Time (BST)' }],
  },
  {
    id: 'sa',
    name: 'Saudi Arabia',
    zones: [{ iana: 'Asia/Riyadh', label: 'Arabia Standard Time (AST)' }],
  },
  {
    id: 'tr',
    name: 'Türkiye',
    zones: [{ iana: 'Europe/Istanbul', label: 'Turkey Time (TRT)' }],
  },
  {
    id: 'ie',
    name: 'Ireland',
    zones: [{ iana: 'Europe/Dublin', label: 'Irish Time (IST/GMT)' }],
  },
  {
    id: 'es',
    name: 'Spain',
    zones: [{ iana: 'Europe/Madrid', label: 'Central European Time (CET/CEST)' }],
  },
  {
    id: 'it',
    name: 'Italy',
    zones: [{ iana: 'Europe/Rome', label: 'Central European Time (CET/CEST)' }],
  },
  {
    id: 'nl',
    name: 'Netherlands (the)',
    zones: [{ iana: 'Europe/Amsterdam', label: 'Central European Time (CET/CEST)' }],
  },
  {
    id: 'ar',
    name: 'Argentina',
    zones: [{ iana: 'America/Argentina/Buenos_Aires', label: 'Argentina Time (ART)' }],
  },
  {
    id: 'cl',
    name: 'Chile',
    zones: [{ iana: 'America/Santiago', label: 'Chile Time' }],
  },
  {
    id: 'ng',
    name: 'Nigeria',
    zones: [{ iana: 'Africa/Lagos', label: 'West Africa Time (WAT)' }],
  },
  {
    id: 'ph',
    name: 'Philippines (the)',
    zones: [{ iana: 'Asia/Manila', label: 'Philippine Time (PHT)' }],
  },
  {
    id: 'id',
    name: 'Indonesia',
    zones: [
      { iana: 'Asia/Jakarta', label: 'Western Indonesia Time (WIB)' },
      { iana: 'Asia/Makassar', label: 'Central Indonesia Time (WITA)' },
      { iana: 'Asia/Jayapura', label: 'Eastern Indonesia Time (WIT)' },
    ],
  },
  {
    id: 'eg',
    name: 'Egypt',
    zones: [{ iana: 'Africa/Cairo', label: 'Eastern European Time (EET)' }],
  },
  {
    id: 'utc',
    name: 'Coordinated Universal Time (UTC)',
    zones: [{ iana: 'Etc/UTC', label: 'UTC / Zulu' }],
  },
];

export const COUNTRY_BY_ID: Readonly<Record<string, CountryDef>> = Object.freeze(
  Object.fromEntries(COUNTRIES.map((country) => [country.id, country])),
);

export const DEFAULT_COUNTRY_ID = 'us';
export const DEFAULT_IANA = 'America/New_York';

export function zonesForCountry(countryId: string): readonly CountryZone[] {
  return COUNTRY_BY_ID[countryId]?.zones ?? [];
}

export function countryForIana(iana: string): CountryDef | undefined {
  return COUNTRIES.find((country) => country.zones.some((zone) => zone.iana === iana));
}

export function allIanaOptions(): { iana: string; label: string }[] {
  const seen = new Set<string>();
  const rows: { iana: string; label: string }[] = [];
  for (const country of COUNTRIES) {
    for (const zone of country.zones) {
      if (seen.has(zone.iana)) continue;
      seen.add(zone.iana);
      rows.push({ iana: zone.iana, label: `${zone.label} — ${zone.iana}` });
    }
  }
  rows.sort((a, b) => a.iana.localeCompare(b.iana));
  return rows;
}
