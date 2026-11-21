import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PREGNANCY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Pregnancy Calculator' },
  { id: 'methods', label: 'Dating Methods' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'pregnancy-faq', label: 'Frequently Asked Questions' },
];

export const PREGNANCY_FAQS: readonly FAQItem[] = [
  {
    question: 'What dating rules does this tool use?',
    answer:
      'Educational ACOG Committee Opinion 700 calendar rules: LMP + 280 days (cycle-adjusted), conception + 266, ultrasound scan + (280 − GA days), IVF day-3 + 263 / day-5 + 261. From a known due date, LMP-equivalent = EDD − 280.',
  },
  {
    question: 'Is this a medical due date?',
    answer:
      'No. Clinical dating may combine ultrasound and other factors. Use this schedule for education only and confirm with your clinician.',
  },
  {
    question: 'Are dates stored?',
    answer:
      'No. Dates stay in your browser for this session. Share uses only the public page URL.',
  },
];
