import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RFM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'RFM Calculator' },
  { id: 'formula', label: 'Relative Fat Mass formula' },
  { id: 'rfm-faq', label: 'Frequently Asked Questions' },
];

export const RFM_FAQS: readonly FAQItem[] = [
  {
    question: 'How is Relative Fat Mass calculated?',
    answer:
      'RFM (%) = 64 − 20 × (height ÷ waist) + 12 × sex, with sex = 1 for female and 0 for male (Woolcott & Bergman, 2018). Example: 180 cm / 90 cm → 24% male, 36% female.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
