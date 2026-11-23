import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const OVULATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Ovulation Calculator' },
  { id: 'what-is', label: 'How Timing Is Estimated' },
  { id: 'formula', label: 'Formulas Used' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ovulation-faq', label: 'Frequently Asked Questions' },
];

export const OVULATION_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this ovulation calculator do?',
    answer:
      'It estimates ovulation day, a six-day fertile window ending on ovulation, and an approximate due date for three consecutive cycles from cycle length and last-period start. Dates are educational approximations only.',
  },
  {
    question: 'Which day-counting convention is used?',
    answer:
      'Day 1 is the first day of bleeding (LMP / cycle start). Ovulation is placed on cycle day (length − 14), which is calendar start + (length − 15) days — matching ASRM natural-fertility teaching for a typical luteal phase.',
  },
  {
    question: 'How is the fertile window defined?',
    answer:
      'A six-day window ending on the ovulation day (five days before through ovulation), reflecting the teaching that the fertile window is the five days before ovulation plus the ovulation day.',
  },
  {
    question: 'How is the due date estimated?',
    answer:
      'Estimated conception is taken as the ovulation day, then EDD = conception + 266 days (ACOG-style). This is not ultrasound dating.',
  },
  {
    question: 'Are my dates stored?',
    answer:
      'No. Values stay in your browser session. Share and copy use the public page URL only.',
  },
];
