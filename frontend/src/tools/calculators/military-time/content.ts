import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MILITARY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-military-time', label: 'What Is Military Time?' },
  { id: 'military-time-chart', label: 'Military Time Chart' },
  { id: 'minutes-chart', label: 'Military Time Minutes Conversion Chart' },
  { id: 'how-to-read', label: 'How to Tell Military Time' },
  { id: 'noon-midnight', label: 'Noon and Midnight in Military Time' },
  { id: 'what-time-now', label: 'What Time Is It in Military Time?' },
  { id: 'convert-to-military', label: 'How to Convert 12-Hour Time to Military Time' },
  { id: 'convert-to-standard', label: 'How to Convert Military Time to 12-Hour Time' },
  { id: 'military-time-faq', label: 'Frequently Asked Questions' },
];

export interface GuideTableRow {
  left: string;
  mid?: string;
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

export const HOUR_CHART: readonly GuideTableRow[] = [
  { left: '12:00 AM', mid: '00:00', right: '0000' },
  { left: '1:00 AM', mid: '01:00', right: '0100' },
  { left: '2:00 AM', mid: '02:00', right: '0200' },
  { left: '3:00 AM', mid: '03:00', right: '0300' },
  { left: '4:00 AM', mid: '04:00', right: '0400' },
  { left: '5:00 AM', mid: '05:00', right: '0500' },
  { left: '6:00 AM', mid: '06:00', right: '0600' },
  { left: '7:00 AM', mid: '07:00', right: '0700' },
  { left: '8:00 AM', mid: '08:00', right: '0800' },
  { left: '9:00 AM', mid: '09:00', right: '0900' },
  { left: '10:00 AM', mid: '10:00', right: '1000' },
  { left: '11:00 AM', mid: '11:00', right: '1100' },
  { left: '12:00 PM', mid: '12:00', right: '1200' },
  { left: '1:00 PM', mid: '13:00', right: '1300' },
  { left: '2:00 PM', mid: '14:00', right: '1400' },
  { left: '3:00 PM', mid: '15:00', right: '1500' },
  { left: '4:00 PM', mid: '16:00', right: '1600' },
  { left: '5:00 PM', mid: '17:00', right: '1700' },
  { left: '6:00 PM', mid: '18:00', right: '1800' },
  { left: '7:00 PM', mid: '19:00', right: '1900' },
  { left: '8:00 PM', mid: '20:00', right: '2000' },
  { left: '9:00 PM', mid: '21:00', right: '2100' },
  { left: '10:00 PM', mid: '22:00', right: '2200' },
  { left: '11:00 PM', mid: '23:00', right: '2300' },
];

export const MINUTE_CHART: readonly GuideTableRow[] = [
  { left: '12:00 AM', right: '0000' },
  { left: '12:05 AM', right: '0005' },
  { left: '12:10 AM', right: '0010' },
  { left: '12:15 AM', right: '0015' },
  { left: '12:30 AM', right: '0030' },
  { left: '12:45 AM', right: '0045' },
  { left: '1:00 AM', right: '0100' },
  { left: '1:15 AM', right: '0115' },
  { left: '1:30 AM', right: '0130' },
  { left: '1:45 AM', right: '0145' },
  { left: '2:00 PM', right: '1400' },
  { left: '2:15 PM', right: '1415' },
  { left: '2:30 PM', right: '1430' },
  { left: '2:45 PM', right: '1445' },
  { left: '6:30 PM', right: '1830' },
  { left: '11:59 PM', right: '2359' },
];

export const MILITARY_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-military-time',
    title: 'What Is Military Time?',
    paragraphs: [
      'Military time is a 24-hour clock written as four digits. Hours run from 00 through 23 and minutes from 00 through 59. There is no AM or PM label, which removes the ambiguity of 12-hour clocks.',
      'The same clock is used in aviation, healthcare, emergency services, logistics, and international scheduling. Spoken military time usually reads the four digits: 1830 is “eighteen thirty.”',
      '6:00 AM is 0600. 6:00 PM is 1800. Colon-separated 18:30 is ordinary 24-hour notation for the same instant as military-style 1830.',
    ],
    formula: '6:00 AM = 0600 · 6:00 PM = 1800 · 18:30 = 1830',
  },
  {
    id: 'military-time-chart',
    title: 'Military Time Chart',
    paragraphs: [
      'Read across a row to match 12-hour time, colon-separated 24-hour time, and four-digit military notation. Hours after noon add 12; midnight is 0000 and noon is 1200.',
    ],
    tableHeaders: ['Standard Time', '24-Hour Time', 'Military Time'],
    table: HOUR_CHART,
  },
  {
    id: 'minutes-chart',
    title: 'Military Time Minutes Conversion Chart',
    paragraphs: [
      'The last two digits are ordinary clock minutes from 00 through 59. They are not decimal fractions of an hour. 1830 means 18 hours and 30 minutes, not 18.30 decimal hours. Thirty minutes is 0.5 hours, not 0.30 hours.',
    ],
    formula: '1830 = 18 hours + 30 minutes · 30 minutes = 0.5 hours, not 0.30 hours',
    tableHeaders: ['Standard Time', 'Military Time'],
    table: MINUTE_CHART,
  },
  {
    id: 'how-to-read',
    title: 'How to Tell Military Time: How to Read Hours and Minutes',
    paragraphs: [
      '1. The first two digits are the hour (00–23).',
      '2. The last two digits are the minutes (00–59).',
      '3. If the hour is 00–11, the time is AM (00 becomes 12 AM).',
      '4. Hour 12 is 12 PM.',
      '5. If the hour is 13–23, subtract 12 and use PM.',
    ],
    formula: '2145 → hours 21, minutes 45 → 21 − 12 = 9 → 9:45 PM',
  },
  {
    id: 'noon-midnight',
    title: 'Noon and Midnight in Military Time',
    paragraphs: [
      'Midnight and noon are the two most common conversion mistakes. Midnight at the start of the day is 0000 (12:00 AM). Noon is 1200 (12:00 PM). This converter accepts 0000–2359. Some schedules write 2400 for the end of a day; that is not treated as a normal valid input here.',
    ],
    formula: '12:00 AM = 0000 · 12:00 PM = 1200 · 2359 = 11:59 PM',
  },
  {
    id: 'what-time-now',
    title: 'What Time Is It in Military Time?',
    paragraphs: [
      'To convert the current time, take the local 12-hour clock, apply the AM/PM rules above, and write four digits. Afternoon hours add 12. This page does not freeze a sample “now” in the article, because that value would be wrong for most readers. Use the converter with the time you want to check.',
    ],
  },
  {
    id: 'convert-to-military',
    title: 'How to Convert 12-Hour Time to Military Time',
    paragraphs: [
      'Keep the minutes. For AM hours 1–11, write the hour with a leading zero. 12 AM becomes 00. For PM hours 1–11, add 12. 12 PM stays 12.',
    ],
    formula: '7:25 PM → 7 + 12 = 19 → 1925',
  },
  {
    id: 'convert-to-standard',
    title: 'How to Convert Military Time to 12-Hour Time',
    paragraphs: [
      'Keep the minutes. If the hour is greater than 12, subtract 12 and use PM. Hour 12 is 12 PM. Hour 00 is 12 AM. Hours 01–11 stay AM.',
    ],
    formula: '1640 → 16 − 12 = 4 → 4:40 PM',
  },
];

export const MILITARY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is military time?',
    answer:
      'Military time expresses the 24-hour clock as four digits, usually without a colon and without AM/PM. 1830 is 6:30 PM.',
  },
  {
    question: 'How do I convert to military time?',
    answer:
      'For PM hours 1–11, add 12 and keep the minutes. For AM hours 1–11, keep the hour with a leading zero. 12 AM is 00; 12 PM is 12. Example: 6:35 PM → 1835.',
  },
  {
    question: 'How do I convert military time to standard time?',
    answer:
      'If the hour is greater than 12, subtract 12 and use PM. Hour 12 is 12 PM. Hour 00 is 12 AM. Otherwise use AM. Example: 1300 = 1:00 PM.',
  },
  {
    question: 'How is 6:35 PM written in military time?',
    answer: '6 + 12 = 18, so 6:35 PM = 1835.',
  },
  {
    question: 'How much is 15 minutes in military time?',
    answer:
      'Minutes stay the same. 1:15 AM = 0115 and 1:15 PM = 1315. Military minutes are clock minutes, not decimal hours.',
  },
  {
    question: 'What is 1300 in standard time?',
    answer: '1300 = 1:00 PM.',
  },
  {
    question: 'What is 2400 in military time?',
    answer:
      '2400 is sometimes used in schedules to mark the end of a day. 0000 marks the beginning of the next day. This converter’s supported range is 0000–2359.',
  },
  {
    question: 'What is 12:00 AM in military time?',
    answer: '0000.',
  },
  {
    question: 'What is 12:00 PM in military time?',
    answer: '1200.',
  },
  {
    question: 'Is military time the same as 24-hour time?',
    answer:
      'They use the same 00–23 clock. Military notation usually omits the colon (1830 instead of 18:30) and may add a time-zone letter when the context requires it.',
  },
];
