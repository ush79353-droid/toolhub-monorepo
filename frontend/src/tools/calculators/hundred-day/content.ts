import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HUNDRED_DAY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-100-day', label: 'What Is a 100 Day Calculator?' },
  { id: 'add-100-days', label: 'How to Calculate 100 Days From a Date' },
  { id: 'subtract-100-days', label: 'How to Find the Date 100 Days Ago' },
  { id: 'how-to-use', label: 'How to Use the 100 Day Calculator' },
  { id: 'include-start', label: 'Does the Starting Date Count as Day One?' },
  { id: 'days-between', label: 'How to Calculate Days Between Two Dates' },
  { id: 'leap-years', label: 'How Leap Years Affect Date Calculations' },
  { id: 'calendar-vs-business', label: 'Calendar Days vs. Business Days' },
  { id: 'examples', label: 'Examples of 100-Day Calculations' },
  { id: 'mistakes', label: 'Common Date Calculation Mistakes' },
  { id: 'uses', label: 'Practical Uses' },
  { id: 'hundred-faq', label: 'Frequently Asked Questions' },
];

export const HUNDRED_DAY_FAQS: readonly FAQItem[] = [
  {
    question: 'What date is 100 days from today?',
    answer:
      'Use Add or subtract days, leave the starting date on today, keep 100 days and Days after, and leave Include start date unchecked. The result is exactly 100 calendar days after today. That date changes every day, so it is not printed as a fixed answer here.',
  },
  {
    question: 'What date was 100 days ago?',
    answer:
      'Choose Days before with a count of 100 and leave Include start date unchecked. The calculator walks backward by 100 calendar days, including weekends and any February 29 that falls in the span.',
  },
  {
    question: 'How do I count 100 days from a date?',
    answer:
      'Enter the starting date, 100, and Days after. Exclusive counting treats the start as day 0, so the result is the date 100 days later. Check Include start date if the start should be day 1; the result is then 99 days later.',
  },
  {
    question: 'Does the starting date count?',
    answer:
      'Only when Include start date is checked. Unchecked, January 1 plus 100 days is April 11 in a non-leap year such as 2026. Checked, the same inputs land on April 10 because January 1 is day 1.',
  },
  {
    question: 'Are weekends included in 100 days?',
    answer:
      'Yes. This calculator counts every calendar day. Saturdays, Sundays, and holidays all count. It does not skip to business days.',
  },
  {
    question: 'How do I calculate the days between two dates?',
    answer:
      'Switch to Days between dates and enter both dates. The signed count keeps the order you entered. A negative number means the to date is earlier. Inclusive counting adds both endpoints; the same day is 1, while exclusive counting of the same day is 0.',
  },
  {
    question: 'Does a leap year affect the result?',
    answer:
      'Yes, when February 29 sits inside the span. One hundred days after February 1, 2024 is May 11, 2024 because 2024 includes February 29. The same offset from March 1, 2024 is June 9, 2024.',
  },
  {
    question: 'Can I calculate more or fewer than 100 days?',
    answer:
      'Yes. Enter any whole number from 1 through 100,000, as long as the result stays between years 1 and 9999. Fractions, zero, and negative counts are rejected. Use Days before to look backward.',
  },
  {
    question: 'Is 100 days the same as three months?',
    answer:
      'No. Three calendar months can be 89, 90, 91, or 92 days depending on the months and whether February is included. One hundred days is a fixed count of calendar days, not a month count.',
  },
];
