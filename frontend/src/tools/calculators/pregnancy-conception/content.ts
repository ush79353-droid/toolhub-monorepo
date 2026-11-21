import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PREGNANCY_CONCEPTION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Pregnancy Conception Calculator' },
  { id: 'methods', label: 'Dating Methods' },
  { id: 'window', label: 'Approximate Intercourse Window' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'pregnancy-conception-faq', label: 'Frequently Asked Questions' },
];

export const PREGNANCY_CONCEPTION_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the conception date estimated?',
    answer:
      'For educational dating aligned with ACOG Committee Opinion 700, estimated conception is the due date minus 266 days (about 38 weeks). The due date itself may come from an entered EDD, from LMP + 280 days (cycle-adjusted), or from an educational ultrasound gestational-age remainder.',
  },
  {
    question: 'What is the intercourse date range?',
    answer:
      'It is an approximate window ending on the estimated conception day and beginning up to 5 days earlier, reflecting commonly cited sperm viability of about 3–5 days. It does not prove the exact day of conception or identify a partner.',
  },
  {
    question: 'Is personal data stored?',
    answer:
      'No. Dates stay in your browser for this session. Share copies only the public page URL.',
  },
];
