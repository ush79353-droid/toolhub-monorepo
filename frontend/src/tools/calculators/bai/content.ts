import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BAI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'BAI Calculator' },
  { id: 'formula', label: 'Body Adiposity Index formula' },
  { id: 'bai-faq', label: 'Frequently Asked Questions' },
];

export const BAI_FAQS: readonly FAQItem[] = [
  {
    question: 'How is BAI calculated?',
    answer:
      'BAI (%) = hip circumference in centimeters ÷ (height in meters)^1.5 − 18, from Bergman et al. (Obesity, 2011).',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
