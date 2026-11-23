import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EDD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'EDD Calculator' },
  { id: 'methods', label: 'LMP and Ultrasound Methods' },
  { id: 'cycle', label: 'Cycle Length Adjustment' },
  { id: 'comparison', label: 'Comparing Gestational Ages' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'edd-faq', label: 'Frequently Asked Questions' },
];

export const EDD_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this EDD calculator do?',
    answer:
      'It estimates due dates from last menstrual period and/or ultrasound gestational age, then compares gestational ages as of a current date. It does not pick which date a clinic should use.',
  },
  {
    question: 'Which formulas are used?',
    answer:
      'LMP EDD = LMP + 280 + (cycle − 28). Ultrasound EDD = scan date + 280 − (7 × weeks + days). Gestational age days = 280 − (EDD − current date), using date-only calendar math aligned with ACOG Committee Opinion 700 teaching conventions.',
  },
  {
    question: 'Why is menstrual cycle length next to the ultrasound fields?',
    answer:
      'The reference layout places the cycle control under the ultrasound panel. This tool still applies cycle length only to LMP dating, never to the ultrasound EDD.',
  },
  {
    question: 'What does the difference mean?',
    answer:
      'When both methods produce an age, difference is ultrasound gestational days minus LMP gestational days (unrounded day totals). Positive means the ultrasound-based age is older; negative means the LMP-based age is older.',
  },
  {
    question: 'Are my dates stored or shared?',
    answer:
      'No. Entries stay in your browser session. Share and copy use the public tool page URL only.',
  },
];
