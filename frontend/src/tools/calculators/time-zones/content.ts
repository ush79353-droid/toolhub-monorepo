import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TIME_ZONES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'why-time-zones', label: 'Why Do We Use Time Zones?' },
  { id: 'how-to-use', label: 'How to Use the Time Zones Converter' },
  { id: 'world-time-zones', label: 'All World Time Zones Explained' },
  { id: 'utc-idl', label: 'UTC and the International Date Line' },
  { id: 'eastern-zones', label: 'Eastern Time Zones by Time Difference' },
  { id: 'western-zones', label: 'Western Time Zones by Time Difference' },
  { id: 'summer-time', label: 'Summer Time Zones' },
  { id: 'fixed-offsets', label: 'Fixed Time Zones and UTC Offsets' },
  { id: 'frequent-zones', label: 'Frequently Used World Time Zones' },
  { id: 'time-zones-faq', label: 'Frequently Asked Questions' },
];

export interface GuideTableRow {
  left: string;
  mid?: string;
  mid2?: string;
  right: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly GuideTableRow[];
}

export const TIME_ZONES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'why-time-zones',
    title: 'Why Do We Use Time Zones?',
    paragraphs: [
      'Earth rotates once per day, so local solar noon moves westward. A single civil clock for the whole planet would put sunrise at midnight in some places. Time zones group longitudes so people can keep “morning” near the start of the working day.',
      'Standardized zones support travel, aviation, shipping, broadcasting, and remote work. A meeting at 12:00 UTC is 17:00 in Karachi and 07:00 in New York on 15 November 2026, same instant, different wall clocks.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Time Zones Converter',
    paragraphs: [
      '1. Choose a reference time zone (UTC by default).',
      '2. Set the date, then the time in that zone.',
      '3. Open Eastern or Western sections to read synchronized conversions.',
      '4. Add another city from the searchable list when you need it.',
      '5. Edit any destination date or time to reverse the conversion from that zone.',
      '6. If a time occurs twice during a fall-back, pick the earlier or later occurrence. If a time is skipped in spring, enter a valid local time instead.',
    ],
  },
  {
    id: 'world-time-zones',
    title: 'All World Time Zones Explained',
    paragraphs: [
      'UTC is the global time scale. A UTC offset is how far a clock sits from UTC at a given instant (for example UTC+05:30). A geographic time zone is a named set of rules, usually an IANA identifier such as America/New_York, that can change offset during the year.',
      'Standard time is the offset used outside daylight saving. Daylight saving (summer) time is a seasonal shift, often one hour. Abbreviations such as EST or IST are ambiguous without a location: IST can mean India or Ireland. This converter labels cities and IANA ids rather than bare abbreviations.',
      'Two cities can share an offset on one date and differ on another because their DST transition dates are not the same.',
    ],
  },
  {
    id: 'utc-idl',
    title: 'Universal Time Coordinated (UTC) and International Date Line (IDL)',
    paragraphs: [
      'UTC is the reference for civil time. Positive offsets are east of Greenwich; negative offsets are west. Crossing the International Date Line changes the calendar date while the absolute instant stays continuous.',
      'The date line is not a straight 180° meridian. It bends around island groups so that a country can keep one civil date. That is why UTC 20:00 on 15 November 2026 is already 05:00 on 16 November in Tokyo.',
    ],
  },
  {
    id: 'eastern-zones',
    title: 'Eastern Time Zones by Time Difference',
    paragraphs: [
      'East of UTC, clocks read later on the same instant. On 15 November 2026 at 12:00 UTC, Dubai is 16:00 (fixed UTC+04), Karachi 17:00 (UTC+05), Mumbai 17:30 (UTC+05:30), Singapore 20:00 (UTC+08), Tokyo 21:00 (UTC+09). Sydney is on daylight time then (UTC+11), so it is 23:00, not UTC+10.',
      'Paris, Helsinki, Auckland, and Adelaide observe seasonal changes. Dubai, Karachi, Mumbai, Bangkok, Singapore, and Tokyo do not. Always convert with a date, not a year-round offset.',
    ],
  },
  {
    id: 'western-zones',
    title: 'Western Time Zones by Time Difference',
    paragraphs: [
      'West of UTC, clocks read earlier. On 15 November 2026 at 12:00 UTC, New York is 07:00 (EST, UTC−05), Chicago 06:00, Denver 05:00, Los Angeles 04:00, Anchorage 03:00, Honolulu 02:00 (HST, no DST).',
      'New York, Chicago, Denver, Los Angeles, and Anchorage change offset in March and November. Honolulu does not. São Paulo uses a different DST history from the United States.',
    ],
  },
  {
    id: 'summer-time',
    title: 'Summer Time Zones',
    paragraphs: [
      'Daylight saving time shifts clocks, usually one hour, so evening light lasts longer. Not every country uses it, and start/end dates differ. The United Kingdom and the United States can be five hours apart or four, depending on whether both have changed clocks.',
      'This converter applies the IANA rules for the selected instant. It does not guess “summer” from the month name alone, southern-hemisphere summer is not July.',
    ],
  },
  {
    id: 'fixed-offsets',
    title: 'Fixed Time Zones and UTC Offsets',
    paragraphs: [
      'A fixed offset such as UTC−12 is useful for technical timestamps. It is not enough for a city that observes DST. Prefer IANA identifiers for people and places; use fixed offsets when a protocol literally says “UTC+05:00 with no seasonal change.”',
    ],
  },
  {
    id: 'frequent-zones',
    title: 'Frequently Used World Time Zones',
    paragraphs: [
      'Offsets below are typical standard-time values. Seasonal columns note whether the zone currently has DST rules in the IANA database.',
    ],
    tableHeaders: ['City', 'IANA identifier', 'Standard offset', 'Seasonal change'],
    table: [
      { left: 'UTC', mid: 'Etc/UTC', mid2: 'UTC+00:00', right: 'No' },
      { left: 'London', mid: 'Europe/London', mid2: 'UTC+00:00', right: 'Yes (BST)' },
      { left: 'Paris', mid: 'Europe/Paris', mid2: 'UTC+01:00', right: 'Yes (CEST)' },
      { left: 'Dubai', mid: 'Asia/Dubai', mid2: 'UTC+04:00', right: 'No' },
      { left: 'Karachi', mid: 'Asia/Karachi', mid2: 'UTC+05:00', right: 'No' },
      { left: 'Mumbai', mid: 'Asia/Kolkata', mid2: 'UTC+05:30', right: 'No' },
      { left: 'Kathmandu', mid: 'Asia/Kathmandu', mid2: 'UTC+05:45', right: 'No' },
      { left: 'Singapore', mid: 'Asia/Singapore', mid2: 'UTC+08:00', right: 'No' },
      { left: 'Tokyo', mid: 'Asia/Tokyo', mid2: 'UTC+09:00', right: 'No' },
      { left: 'Adelaide', mid: 'Australia/Adelaide', mid2: 'UTC+09:30', right: 'Yes' },
      { left: 'Sydney', mid: 'Australia/Sydney', mid2: 'UTC+10:00', right: 'Yes' },
      { left: 'Auckland', mid: 'Pacific/Auckland', mid2: 'UTC+12:00', right: 'Yes' },
      { left: 'New York', mid: 'America/New_York', mid2: 'UTC−05:00', right: 'Yes (EDT)' },
      { left: 'Chicago', mid: 'America/Chicago', mid2: 'UTC−06:00', right: 'Yes' },
      { left: 'Denver', mid: 'America/Denver', mid2: 'UTC−07:00', right: 'Yes' },
      { left: 'Los Angeles', mid: 'America/Los_Angeles', mid2: 'UTC−08:00', right: 'Yes' },
      { left: 'Honolulu', mid: 'Pacific/Honolulu', mid2: 'UTC−10:00', right: 'No' },
    ],
  },
];

export const TIME_ZONES_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a time zone?',
    answer:
      'A time zone is the set of rules for civil time in a region: its relationship to UTC and any daylight saving changes. Geographic zones are identified with IANA names such as Asia/Karachi.',
  },
  {
    question: 'How do I convert between time zones?',
    answer:
      'Select a reference zone, enter a date and local time, and read the matching wall time in each destination. Editing another city recalculates from that city’s local time.',
  },
  {
    question: 'What is UTC?',
    answer:
      'UTC (Coordinated Universal Time) is the primary global time reference. Other civil times are expressed as UTC plus or minus an offset.',
  },
  {
    question: 'What is the difference between UTC and GMT?',
    answer:
      'UTC is a modern atomic time standard. GMT historically meant mean solar time at Greenwich and is still used as a civil zone name (Europe/London in winter). For conversion, treat GMT as UTC+00:00 when London is not on British Summer Time.',
  },
  {
    question: 'What is the difference between UTC and local time?',
    answer:
      'Local time is what clocks show in a place after applying that zone’s rules. UTC does not change with seasons.',
  },
  {
    question: 'How many time zones are there?',
    answer:
      'There are many civil zones, not just 24 hourly bands. Offsets include half hours (India UTC+05:30) and 45 minutes (Nepal UTC+05:45). IANA maintains hundreds of region identifiers because legal rules differ.',
  },
  {
    question: 'Why do some countries have half-hour time zones?',
    answer:
      'Offsets such as UTC+05:30 or UTC+09:30 are political and historical choices, often to sit between neighboring zones or to keep solar time closer to local noon.',
  },
  {
    question: 'What is daylight saving time?',
    answer:
      'DST is a seasonal clock change used in some regions, typically moving clocks forward in spring and back in autumn.',
  },
  {
    question: 'How does daylight saving time affect time-zone conversion?',
    answer:
      'A location’s UTC offset can change during the year, so the conversion date matters. New York is UTC−05 in November and UTC−04 in July.',
  },
  {
    question: 'What time zone is Pakistan in?',
    answer: 'Pakistan Standard Time is UTC+05:00 year-round (Asia/Karachi).',
  },
  {
    question: 'What time zone does India use?',
    answer: 'India Standard Time is UTC+05:30 year-round (Asia/Kolkata).',
  },
  {
    question: 'How do I convert New York time to London time?',
    answer:
      'The difference is often five hours in winter and four in summer, but the US and UK change clocks on different dates. Convert a specific date rather than assuming a fixed gap.',
  },
  {
    question: 'Can a time-zone conversion change the date?',
    answer:
      'Yes. UTC 20:00 on 15 November 2026 is 05:00 on 16 November in Tokyo. UTC 02:00 on 15 November 2026 is 18:00 on 14 November in Los Angeles.',
  },
];
