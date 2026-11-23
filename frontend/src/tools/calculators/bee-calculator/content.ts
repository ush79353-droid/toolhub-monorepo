import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BEE_CALCULATOR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'BEE Calculator' },
  { id: 'formula', label: 'Harris–Benedict' },
  { id: 'faq', label: 'FAQ' },
];

export const BEE_CALCULATOR_FAQS: readonly FAQItem[] = [
  {
    question: 'Which BEE equation is used?',
    answer:
      'Revised Harris–Benedict (Roza & Shizgal, 1984). TEE = BEE × activity × stress × temperature multipliers.',
  },
];