import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MINUTES_HOURS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'time-units', label: 'What Are the Standard Time Units?' },
  { id: 'how-to-convert', label: 'How to Convert Between Hours, Minutes, and Seconds' },
  { id: 'how-to-use', label: 'How to Use the Minutes to Hours Converter' },
  { id: 'decimal-vs-clock', label: 'Decimal Hours vs. Hours and Minutes' },
  { id: 'conversion-chart', label: 'Common Minutes to Hours Conversion Chart' },
  { id: 'practical-uses', label: 'Practical Applications of Time Conversion' },
  { id: 'minutes-hours-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly { left: string; mid?: string; right: string }[];
}

export const MINUTES_HOURS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'time-units',
    title: 'What Are the Standard Time Units and Where Do They Come From?',
    paragraphs: [
      'Everyday durations use hours, minutes, and seconds. One minute has 60 seconds and one hour has 60 minutes because of the sexagesimal (base-60) system inherited from ancient astronomy. A civil day is 24 hours, so a week is 168 hours.',
      'The SI second is now defined by atomic clocks, not by fractions of a mean solar day. Duration conversion in this calculator is exact arithmetic on those civil units. It does not follow calendar months or daylight-saving clock shifts.',
    ],
    formula: '1 min = 60 s · 1 h = 60 min = 3,600 s · 1 day = 24 h = 1,440 min · 1 week = 168 h',
    tableHeaders: ['Unit', 'Equivalent'],
    table: [
      { left: '1 minute', right: '60 seconds' },
      { left: '1 hour', right: '60 minutes' },
      { left: '1 hour', right: '3,600 seconds' },
      { left: '1 day', right: '24 hours' },
      { left: '1 day', right: '1,440 minutes' },
      { left: '1 week', right: '168 hours' },
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Between Hours, Minutes, and Seconds',
    paragraphs: [
      'Divide minutes by 60 to get hours. Multiply hours by 60 to get minutes. Minutes times 60 are seconds; seconds divided by 60 are minutes. Hours times 3,600 are seconds.',
      'Examples: 45 min = 0.75 h; 75 min = 1.25 h; 90 min = 1.5 h; 125 min = 2 hours 5 minutes; 150 min = 2.5 h.',
    ],
    formula:
      'Hours = Minutes / 60 · Minutes = Hours × 60 · Seconds = Minutes × 60 · Hours = Seconds / 3,600',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Minutes to Hours Converter',
    paragraphs: [
      '1. Enter a value in Hours, Minutes, or Seconds.',
      '2. The other decimal fields update from the same duration.',
      '3. Read the matching HH:MM:SS duration (hours may exceed 24).',
      '4. Edit HH, MM, or SS to reverse the conversion. MM and SS stay in 0–59.',
      '5. Share the result, or use Reload / Clear to reset.',
    ],
  },
  {
    id: 'decimal-vs-clock',
    title: 'Decimal Hours vs. Hours and Minutes',
    paragraphs: [
      'Decimal hours count fractional hours: 1.5 hours is 1 hour 30 minutes, 1.25 hours is 1 hour 15 minutes, 2.75 hours is 2 hours 45 minutes, and 1 hour 45 minutes is 1.75 hours.',
      '1.30 decimal hours is not 1 hour 30 minutes. 0.30 × 60 = 18, so 1.30 hours is 1 hour 18 minutes. Use HH:MM:SS when you mean clock-style parts.',
    ],
    formula: '1.5 h = 1 h 30 min · 1.30 h = 1 h 18 min · 1 h 30 min = 1.50 h',
  },
  {
    id: 'conversion-chart',
    title: 'Common Minutes to Hours Conversion Chart',
    paragraphs: ['Quick reference for common durations. HH:MM:SS here is elapsed time, not time of day.'],
    tableHeaders: ['Minutes', 'Decimal hours', 'HH:MM:SS'],
    table: [
      { left: '15', mid: '0.25', right: '00:15:00' },
      { left: '30', mid: '0.5', right: '00:30:00' },
      { left: '45', mid: '0.75', right: '00:45:00' },
      { left: '60', mid: '1', right: '01:00:00' },
      { left: '75', mid: '1.25', right: '01:15:00' },
      { left: '90', mid: '1.5', right: '01:30:00' },
      { left: '120', mid: '2', right: '02:00:00' },
      { left: '135', mid: '2.25', right: '02:15:00' },
      { left: '150', mid: '2.5', right: '02:30:00' },
      { left: '180', mid: '3', right: '03:00:00' },
      { left: '240', mid: '4', right: '04:00:00' },
      { left: '360', mid: '6', right: '06:00:00' },
      { left: '480', mid: '8', right: '08:00:00' },
      { left: '720', mid: '12', right: '12:00:00' },
      { left: '1,440', mid: '24', right: '24:00:00' },
    ],
  },
  {
    id: 'practical-uses',
    title: 'Practical Applications of Time Conversion',
    paragraphs: [
      'Timesheets, payroll, project tracking, study blocks, workouts, travel, video length, lab measurements, and production cycles all mix decimal hours with HH:MM:SS. Convert elapsed duration here; do not use it for civil clock math across daylight-saving changes.',
    ],
  },
];

export const MINUTES_HOURS_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert minutes to hours?',
    answer: 'Divide minutes by 60. Example: 150 / 60 = 2.5 hours.',
  },
  {
    question: 'How many minutes are in one hour?',
    answer: 'One hour contains exactly 60 minutes.',
  },
  {
    question: 'How many seconds are in one hour?',
    answer: 'One hour contains 3,600 seconds.',
  },
  {
    question: 'How many hours are 90 minutes?',
    answer: '90 / 60 = 1.5 hours, which is 1 hour 30 minutes.',
  },
  {
    question: 'How many hours are 150 minutes?',
    answer: '150 / 60 = 2.5 hours, which is 2 hours 30 minutes.',
  },
  {
    question: 'How many hours are 200 minutes?',
    answer: '200 / 60 = 3.333… hours, which is 3 hours 20 minutes.',
  },
  {
    question: 'How many hours are 1,000 minutes?',
    answer: '1000 / 60 = 16.666… hours, which is 16 hours 40 minutes.',
  },
  {
    question: 'How do I convert decimal hours to hours and minutes?',
    answer:
      'Keep the whole number as hours and multiply the fractional part by 60. Example: 2.75 hours = 2 hours 45 minutes.',
  },
  {
    question: 'What is 1.5 hours in hours and minutes?',
    answer: '1.5 hours equals 1 hour and 30 minutes.',
  },
  {
    question: 'Is 1.30 hours equal to 1 hour 30 minutes?',
    answer: 'No. 1.30 decimal hours is 1 hour 18 minutes. 1 hour 30 minutes is 1.50 hours.',
  },
  {
    question: 'How do I convert seconds to hours?',
    answer: 'Divide seconds by 3,600.',
  },
  {
    question: 'Can I convert more than 24 hours?',
    answer: 'Yes. Durations such as 30 hours or 48 hours are allowed. Hours do not wrap at 24.',
  },
  {
    question: 'How many minutes are in a month?',
    answer:
      'It depends on the month length. For D days: minutes = D × 24 × 60. A 30-day month has 43,200 minutes.',
  },
];
