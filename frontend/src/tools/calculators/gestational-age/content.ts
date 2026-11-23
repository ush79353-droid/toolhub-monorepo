import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GESTATIONAL_AGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Gestational Age Calculator' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'formula', label: 'Dating Formula' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'gestational-age-faq', label: 'Frequently Asked Questions' },
];

export const GESTATIONAL_AGE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is gestational age calculated from a due date?',
    answer:
      'This tool uses educational ACOG-style dating: gestational days ≈ 280 − (EDD − current date) on the calendar, then splits into completed weeks and remaining days.',
  },
  {
    question: 'Why does the current date matter?',
    answer:
      'Gestational age is always “as of” a date. You can leave today as the default or choose another date to see how far along the pregnancy would be on that day.',
  },
  {
    question: 'What if my ultrasound gave a different due date?',
    answer:
      'Clinical care may revise dating after ultrasound. Enter the EDD you want to explore; this calculator does not replace obstetric ultrasound dating.',
  },
  {
    question: 'Can I share my dates in the link?',
    answer:
      'No. Share and copy include only the public tool page URL — your entered dates stay local in the browser.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. It is an educational calendar worksheet. Confirm dates and care with a licensed clinician.',
  },
];