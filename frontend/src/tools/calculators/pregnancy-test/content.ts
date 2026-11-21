import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PREGNANCY_TEST_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Pregnancy Test Calculator' },
  { id: 'natural', label: 'Natural Conception Timing' },
  { id: 'ivf', label: 'IVF Timing' },
  { id: 'sensitivity', label: 'Test Sensitivity' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'pregnancy-test-faq', label: 'Frequently Asked Questions' },
];

export const PREGNANCY_TEST_FAQS: readonly FAQItem[] = [
  {
    question: 'How is ovulation estimated?',
    answer:
      'From last menstrual period and cycle length: ovulation ≈ LMP + (cycle length − 14) calendar days. You can override the ovulation date manually.',
  },
  {
    question: 'When does the calculator suggest urine vs blood testing?',
    answer:
      'Educational defaults use about 14 days after ovulation for typical urine (~25 mIU/mL) and about 10 days for qualitative blood testing. Optional sensitivity selection adjusts urine timing only—there is no unsupported fixed conversion from every mIU/mL label to a calendar day.',
  },
  {
    question: 'How does IVF timing work?',
    answer:
      'Fertilization-equivalent date ≈ transfer day minus embryo age (days). Testing windows are estimated from that reference. Follow your clinic’s instructions.',
  },
  {
    question: 'Is personal data stored?',
    answer:
      'No. Dates stay in your browser for this session. Share uses only the public page URL.',
  },
];
