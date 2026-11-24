import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DIC_SYNDROME_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'DIC Syndrome Calculator' },
  { id: 'isth', label: 'ISTH score' },
];

export const DIC_SYNDROME_FAQS: readonly FAQItem[] = [
  {
    question: 'What does the ISTH score measure?',
    answer: 'An additive score (0–8) for overt DIC in underlying disorders; ≥5 is compatible with overt DIC.',
  },
];