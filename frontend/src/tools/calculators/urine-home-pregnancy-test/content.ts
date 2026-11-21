import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const URINE_HOME_PREGNANCY_TEST_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Urine Home Pregnancy Test' },
  { id: 'natural', label: 'Natural Conception Timing' },
  { id: 'ivf', label: 'IVF Timing' },
  { id: 'sensitivity', label: 'Sensitivity Threshold' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'urine-home-faq', label: 'Frequently Asked Questions' },
];

export const URINE_HOME_PREGNANCY_TEST_FAQS: readonly FAQItem[] = [
  {
    question: 'How is ovulation estimated?',
    answer:
      'From last menstrual period and cycle length: ovulation ≈ LMP + (cycle length − 14) calendar days. You can override the ovulation date manually.',
  },
  {
    question: 'What does the sensitivity threshold control?',
    answer:
      'When enabled under Natural or IVF, the educational urine date shifts earlier for more sensitive labeled assays (10–20 mIU/mL) versus a typical ~25 mIU/mL missed-period assumption. Natural and IVF toggles are independent. This does not interpret a specific test strip result.',
  },
  {
    question: 'How does IVF timing work?',
    answer:
      'Educational defaults anchor a day-5 blastocyst calendar (blood about +9 days, urine about +14 days from transfer). Earlier embryos shift suggested dates later from the transfer day. Follow your clinic’s instructions first.',
  },
  {
    question: 'Is personal data stored?',
    answer:
      'No. Dates stay in your browser for this session. Share uses only the public page URL.',
  },
];
