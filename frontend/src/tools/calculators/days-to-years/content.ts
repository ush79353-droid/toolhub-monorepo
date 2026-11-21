import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { daysToYears, formatDuration, yearsToDays, DAYS_PER_GREGORIAN_YEAR } from './calculation';

export const DAYS_TO_YEARS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-year', label: 'What Is a Year? How Long Is a Year?' },
  { id: 'days-to-years', label: 'Converting Days to Years: Calculations and Explanation' },
  { id: 'years-to-days', label: 'Calculate Years to Days' },
  { id: 'example-10000', label: 'Example: How Many Years Is 10,000 Days?' },
  { id: 'related-time-tools', label: 'Other Commonly Used Time Unit Converters' },
  { id: 'how-to-calculate', label: 'How Do I Calculate Days Into Years?' },
  { id: 'faq-1000-days', label: 'How Many Years Is 1,000 Days?' },
  { id: 'days-to-years-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const DAYS_TO_YEARS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-a-year',
    title: 'What Is a Year? How Long Is a Year?',
    paragraphs: [
      'A calendar year is one annual cycle of the Gregorian calendar. A common year has 365 days; a leap year has 366 days (February 29).',
      `Over the Gregorian calendar’s 400-year leap cycle, the average length is ${DAYS_PER_GREGORIAN_YEAR} days. That average is what this duration converter uses.`,
      'This tool does not pick leap years for a date range; that needs a start date. It also does not use the tropical or sidereal year.',
    ],
    formula: 'Common = 365 d · Leap = 366 d · Average Gregorian = 365.2425 d',
  },
  {
    id: 'days-to-years',
    title: 'Converting Days to Years; Calculations and Explanation',
    paragraphs: [
      `Years = Days ÷ ${DAYS_PER_GREGORIAN_YEAR}.`,
      `Example: 500 ÷ ${DAYS_PER_GREGORIAN_YEAR} ≈ ${formatDuration(daysToYears(500))}. Therefore 500 days ≈ 1.369 average years.`,
      'A decimal year is an average-duration result, not the number of complete calendar years between two named dates.',
    ],
    formula: `Y = D ÷ ${DAYS_PER_GREGORIAN_YEAR}`,
  },
  {
    id: 'years-to-days',
    title: 'Calculate Years to Days; How Many Days Are in a Given Time?',
    paragraphs: [
      `Days = Years × ${DAYS_PER_GREGORIAN_YEAR}.`,
      `Example: 2.5 × ${DAYS_PER_GREGORIAN_YEAR} = ${formatDuration(yearsToDays(2.5))}. Therefore 2.5 average Gregorian years = 913.10625 days.`,
    ],
    formula: `D = Y × ${DAYS_PER_GREGORIAN_YEAR}`,
  },
  {
    id: 'example-10000',
    title: 'Example; How Many Years Is 10,000 Days?',
    paragraphs: [
      `Y = 10,000 ÷ ${DAYS_PER_GREGORIAN_YEAR} ≈ ${formatDuration(daysToYears(10000))}.`,
      'So 10,000 days ≈ 27.379 average Gregorian years. Interpret the decimal as a fraction of an average year, not a calendar date.',
    ],
  },
  {
    id: 'related-time-tools',
    title: 'Other Commonly Used Time Unit Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Day Converter, Days to Weeks Calculator, Days to Months Calculator, Time Unit Converter, and other duration tools. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
  {
    id: 'how-to-calculate',
    title: 'How Do I Calculate Days Into Years?',
    paragraphs: [
      `Divide days by ${DAYS_PER_GREGORIAN_YEAR}: Years = Days ÷ ${DAYS_PER_GREGORIAN_YEAR}. Enter days in the calculator to see the result instantly, or enter years to reverse the conversion.`,
    ],
  },
  {
    id: 'faq-1000-days',
    title: 'How Many Years Is 1,000 Days?',
    paragraphs: [
      `1,000 ÷ ${DAYS_PER_GREGORIAN_YEAR} ≈ ${formatDuration(daysToYears(1000))}. Therefore 1,000 days ≈ 2.738 average Gregorian years.`,
    ],
  },
];

export const DAYS_TO_YEARS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Calculate Days Into Years?',
    answer: `Divide the number of days by ${DAYS_PER_GREGORIAN_YEAR}. Years = Days ÷ ${DAYS_PER_GREGORIAN_YEAR}.`,
  },
  {
    question: 'How Many Years Is 1,000 Days?',
    answer: `1,000 ÷ ${DAYS_PER_GREGORIAN_YEAR} ≈ ${formatDuration(daysToYears(1000))}. Therefore 1,000 days ≈ 2.738 years.`,
  },
  {
    question: 'How Many Years Is 365 Days?',
    answer: `365 ÷ ${DAYS_PER_GREGORIAN_YEAR} ≈ ${formatDuration(daysToYears(365))}. So 365 days is slightly less than one average Gregorian year, while 365 days is exactly one common calendar year.`,
  },
  {
    question: 'How Many Days Are in 5 Years?',
    answer: `Using the mean Gregorian year: 5 × ${DAYS_PER_GREGORIAN_YEAR} = ${formatDuration(yearsToDays(5))}. Therefore 5 average Gregorian years = 1,826.2125 days. Exact calendar spans depend on start and end dates.`,
  },
  {
    question: 'How Many Years Is 10,000 Days?',
    answer: `10,000 ÷ ${DAYS_PER_GREGORIAN_YEAR} ≈ ${formatDuration(daysToYears(10000))}. Therefore 10,000 days ≈ 27.38 years.`,
  },
  {
    question: 'What Is the Difference Between 365 and 365.2425 Days?',
    answer: `365 days is a common Gregorian calendar year. ${DAYS_PER_GREGORIAN_YEAR} days is the average year length over the Gregorian 400-year leap cycle. This converter uses the average for duration math.`,
  },
];
