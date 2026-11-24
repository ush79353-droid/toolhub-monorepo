import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CORRECTED_RETICULOCYTE_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Corrected Reticulocyte Count' },
  { id: 'formula', label: 'Formula' },
  { id: 'faq', label: 'FAQ' },
];

export const CORRECTED_RETICULOCYTE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is corrected reticulocyte count?',
    answer: 'CRC (%) = reticulocyte % × (patient Hct ÷ reference Hct), correcting for anemia.',
  },
  {
    question: 'What is the default reference hematocrit?',
    answer: '45% unless you enable a custom normal hematocrit.',
  },
];