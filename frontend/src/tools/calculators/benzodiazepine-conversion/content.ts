import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BENZODIAZEPINE_CONVERSION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Benzodiazepine conversion' },
  { id: 'disclaimer', label: 'Clinical caution' },
];

export const BENZODIAZEPINE_CONVERSION_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I use this to taper benzodiazepines?',
    answer: 'No. Equivalencies are approximate and not a taper or switching protocol.',
  },
];