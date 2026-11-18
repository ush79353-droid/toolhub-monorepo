import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ZULU_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-zulu', label: 'What Is Zulu Time?' },
  { id: 'zulu-chart', label: 'How to Calculate Zulu Time: Zulu Time Chart' },
  { id: 'dst-and-zulu', label: 'Daylight Saving Time and Zulu Time' },
  { id: 'how-to-use', label: 'How to Use the Zulu Time Converter' },
  { id: 'common-uses', label: 'Common Uses of Zulu Time' },
  { id: 'zulu-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const ZULU_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-zulu',
    title: 'What Is Zulu Time?',
    paragraphs: [
      'Zulu time is the operational name for Coordinated Universal Time (UTC), the zero-offset world time reference. In the NATO phonetic alphabet the letter Z is spoken “Zulu,” and aviation, meteorology, and military messages append Z to a clock time to mark that reference: 14:00Z is 14:00 UTC.',
      'UTC does not observe daylight saving time. GMT is a time-zone name that usually shows the same clock as UTC, but UTC is the international standard. Zulu time means UTC, not a seasonal British clock.',
    ],
    formula: '14:00Z = 14:00 UTC · Zulu Time = UTC + 00:00',
  },
  {
    id: 'zulu-chart',
    title: 'How to Calculate Zulu Time: Zulu Time Chart',
    paragraphs: [
      'Local clock = UTC + the zone offset that applies on that date. The interactive converter reads IANA rules for the selected date. The table below is a North American standard-time reference only (not year-round).',
    ],
    formula: 'Local Time = UTC Time + Time Zone Offset · UTC Time = Local Time − Time Zone Offset',
    tableHeaders: ['Zulu Time', 'EST (UTC−5)', 'CST (UTC−6)', 'MST (UTC−7)', 'PST (UTC−8)'],
    table: [
      ['00:00', '19:00 previous day', '18:00 previous day', '17:00 previous day', '16:00 previous day'],
      ['06:00', '01:00', '00:00', '23:00 previous day', '22:00 previous day'],
      ['12:00', '07:00', '06:00', '05:00', '04:00'],
      ['18:00', '13:00', '12:00', '11:00', '10:00'],
    ],
  },
  {
    id: 'dst-and-zulu',
    title: 'Daylight Saving Time and Zulu Time',
    paragraphs: [
      'Zulu time never “springs forward.” Some local zones do. The same 12:00Z is 07:00 EST in January in New York and 08:00 EDT in July. DST start and end dates differ by region, and places such as most of Arizona and Hawaii do not observe it.',
      'Do not add an hour by hand. Select the IANA zone and the conversion date and let the offset come from that instant.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Zulu Time Converter',
    paragraphs: [
      'Method 1 — Select by Country: choose Country, pick a country, pick one of its time zones, set the conversion date, enter Zulu time, and read local time (or the reverse).',
      'Method 2 — Select by Time Zone: choose Time zone, pick an IANA identifier, set the date, enter Zulu or local time, and read the counterpart plus UTC offset and DST status.',
      'When local clocks fall back, the same hour occurs twice — choose the earlier or later occurrence. When clocks spring forward, some local times do not exist.',
    ],
  },
  {
    id: 'common-uses',
    title: 'Common Uses of Zulu Time',
    paragraphs: [
      'Aviation flight plans, military communications, weather products, maritime notices, international meetings, server logs, security event timestamps, satellite operations, and emergency coordination all use a shared UTC clock so participants are not arguing over whose wall clock is correct.',
    ],
  },
];

export const ZULU_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert Zulu time to EST?',
    answer:
      'Subtract five hours when Eastern Standard Time applies: 12:00 UTC → 07:00 EST. During Eastern Daylight Time subtract four hours instead. Use America/New_York and the conversion date.',
  },
  {
    question: 'How do I convert Zulu time to CST?',
    answer:
      'North American Central Standard Time is UTC−6 (12:00 UTC → 06:00 CST). Central Daylight Time is UTC−5. CST is also used for other zones worldwide, so prefer an IANA identifier such as America/Chicago.',
  },
  {
    question: 'How do I convert Zulu time to Mountain Time?',
    answer:
      'Mountain Standard Time is UTC−7 and Mountain Daylight Time is UTC−6. Most of Arizona (America/Phoenix) stays on MST year-round. Use the IANA zone and date.',
  },
  {
    question: 'What is Zulu time in PST?',
    answer:
      'Pacific Standard Time is UTC−8; Pacific Daylight Time is UTC−7. 12:00Z is 04:00 PST or 05:00 PDT depending on the date in America/Los_Angeles.',
  },
  {
    question: 'Is Zulu time the same as UTC?',
    answer: 'Zulu time is the operational name for UTC in aviation and military use. Both refer to the zero-offset reference.',
  },
  {
    question: 'Does Zulu time change for daylight saving time?',
    answer: 'No. Zulu time remains UTC all year. Only some local zones change their offset.',
  },
  {
    question: 'What does 1200Z mean?',
    answer: '1200Z means 12:00 UTC. The Z suffix marks the UTC reference.',
  },
  {
    question: 'What does 1800 Zulu mean?',
    answer: '1800 Zulu means 18:00 UTC, or 6:00 PM UTC.',
  },
  {
    question: 'How do I convert Zulu time to Pakistan time?',
    answer: 'Add five hours. 12:00 UTC → 17:00 PKT. Pakistan Standard Time is UTC+05:00 (Asia/Karachi).',
  },
  {
    question: 'How do I convert Zulu time to India time?',
    answer: 'Add five hours and thirty minutes. 12:00 UTC → 17:30 IST. India Standard Time is UTC+05:30 (Asia/Kolkata).',
  },
  {
    question: 'Is GMT the same as Zulu time?',
    answer:
      'GMT and UTC usually show the same clock, but GMT is a zone/standard name and UTC is the international reference. Zulu time refers to UTC.',
  },
  {
    question: 'Why is Zulu time used in aviation?',
    answer:
      'UTC gives pilots, controllers, and flight plans one clock across every local zone, so a departure time does not depend on whose city is observing daylight saving.',
  },
];
