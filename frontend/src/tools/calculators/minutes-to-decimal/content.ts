import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatDecimal, minutesToDecimalHours } from './calculation';

export const M2DEC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-calculate', label: 'How to Calculate Minutes in Decimals' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'conversion-table', label: 'Minutes to Decimal Hours Table' },
  { id: 'decimal-to-clock', label: 'Decimal Hours to Hours and Minutes' },
  { id: 'why-convert', label: 'Why Convert Minutes to Decimal Hours?' },
  { id: 'related-tools', label: 'Other Related Calculators' },
  { id: 'm2dec-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MINUTES = [1, 5, 10, 15, 20, 30, 40, 45, 50, 60, 75, 90, 120] as const;

function tableHours(minutes: number): string {
  const hours = minutesToDecimalHours(minutes);
  if (Number.isInteger(hours) || hours === 0.25 || hours === 0.5 || hours === 0.75) {
    return formatDecimal(hours);
  }
  // Recurring fractions: show rounded display values.
  return hours.toFixed(7).replace(/0+$/, '').replace(/\.$/, '');
}

export const M2DEC_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-calculate',
    title: 'How to Calculate Minutes in Decimals',
    paragraphs: [
      'The Minutes to Decimal Calculator converts clock-time minutes into decimal hours and equivalent total minutes and seconds. Decimal hours are useful for payroll, employee timesheets, work-hour tracking, project estimates, billing and invoicing, study sessions, scientific measurements, and time reporting.',
      'Decimal hours are usually easier to add, multiply, and store in spreadsheets than clock notation such as 1:30.',
      'Use the exact relationship 1 hour = 60 minutes = 3,600 seconds.',
      'Decimal hours = Minutes ÷ 60. Example: 15 ÷ 60 = 0.25, so 15 minutes equals 0.25 decimal hours.',
      'Seconds = Minutes × 60. Example: 15 × 60 = 900, so 15 minutes equals 900 seconds.',
      'Other quick checks: 30 minutes = 0.5 hours, 45 minutes = 0.75 hours, and 90 minutes = 1.5 hours.',
      'Important: 1 hour 30 minutes is not 1.30 decimal hours. The correct value is 1 + 30/60 = 1.5.',
    ],
    formula:
      'Decimal Hours = Minutes / 60\n15 ÷ 60 = 0.25 hours\nSeconds = Minutes × 60\n15 × 60 = 900 seconds',
  },
  {
    id: 'how-to-use',
    title: 'How to Use This Minutes to Decimal Calculator',
    paragraphs: [
      '1. Enter the number of minutes into the Minutes (mm) field under Clock time in minutes.',
      '2. The calculator instantly shows the same duration as decimal hours, equivalent minutes, and equivalent seconds.',
      '3. Edit Hours, Minutes, or Seconds under Decimal time to convert in the other direction.',
      '4. Hours, Minutes, and Seconds are three equivalent expressions of one duration — not separate parts to add together.',
      '5. Use Reload calculator or Clear all changes to reset every field.',
      'Conversions update immediately; there is no separate Calculate button.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Minutes to Decimal Hours Conversion Table',
    paragraphs: [
      'Common minute values converted with Decimal Hours = Minutes ÷ 60. Recurring decimals are rounded for display.',
    ],
    tableHeaders: ['Minutes', 'Decimal Hours'],
    table: TABLE_MINUTES.map((min) => [String(min), tableHours(min)]),
  },
  {
    id: 'decimal-to-clock',
    title: 'Decimal Hours to Hours and Minutes',
    paragraphs: [
      'To turn decimal hours into a conventional clock duration, separate the whole hours from the fractional part, then multiply the fraction by 60 to get minutes.',
      'Example: 2.75 decimal hours → whole hours = 2, fractional hours = 0.75, minutes = 0.75 × 60 = 45.',
      'Result: 2 hours 45 minutes.',
      'Clock examples versus decimal hours: 0:15 → 0.25, 0:30 → 0.5, 0:45 → 0.75, 1:15 → 1.25, 1:30 → 1.5, 1:45 → 1.75, 2:30 → 2.5, 8:15 → 8.25.',
    ],
    formula: '2.75 → 2 hours + 0.75 × 60 = 45 minutes\n→ 2 hours 45 minutes',
  },
  {
    id: 'why-convert',
    title: 'Why Convert Minutes to Decimal Hours?',
    paragraphs: [
      'Timesheet systems and payroll math often store worked time as decimal hours so rates multiply cleanly: 7.5 hours × hourly rate needs no clock arithmetic.',
      'Project managers can sum task durations in a spreadsheet without converting each 1:20 entry by hand.',
      'Billing and invoicing tools usually expect decimal hours for line items and totals.',
      'Example: three study blocks of 45 minutes each total 135 minutes, or 2.25 decimal hours — easier to compare against a 3-hour weekly goal.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Minute Converter, Minutes to Days Calculator, Hours to Minutes Converter, Time Unit Converter, Milliseconds Converter, Hour Converter, and Seconds Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const M2DEC_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Hours Are There in 45 Minutes?',
    answer:
      '45 ÷ 60 = 0.75. Therefore 45 minutes equals 0.75 decimal hours.',
  },
  {
    question: 'How Can I Convert Minutes into Seconds?',
    answer:
      'Multiply minutes by 60. For example, 25 × 60 = 1,500, so 25 minutes equals 1,500 seconds.',
  },
  {
    question: 'What Is the Purpose of Converting Minutes into Decimals?',
    answer:
      'Decimal hours simplify payroll, timesheets, billing, project management, and time reporting because they add and multiply like ordinary numbers without clock notation.',
  },
  {
    question: 'Is It Possible to Have a Negative Number of Minutes?',
    answer:
      'Yes. Negative durations can represent time differences, adjustments, or offsets in calculations. They are valid mathematical durations even though they are not a negative clock timestamp by themselves.',
  },
  {
    question: 'What Is 1 Hour and 20 Minutes in Decimal Hours?',
    answer:
      '1 + 20/60 = 1.3333… hours. The approximate display value is 1.3333 decimal hours.',
  },
  {
    question: 'How Do I Convert 2.5 Decimal Hours to Minutes?',
    answer: '2.5 × 60 = 150. Therefore 2.5 decimal hours equals 150 minutes.',
  },
  {
    question: 'Is 1.30 Hours the Same as 1 Hour 30 Minutes?',
    answer:
      'No. 1.30 decimal hours is 1 hour and 0.30 × 60 = 18 minutes. One hour 30 minutes equals 1.5 decimal hours, not 1.30.',
  },
];
