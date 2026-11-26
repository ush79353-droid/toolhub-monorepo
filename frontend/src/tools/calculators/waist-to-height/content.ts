import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WHTR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Waist to Height Ratio Calculator' },
  { id: 'formula', label: 'Waist-to-height ratio formula' },
  { id: 'whtr-faq', label: 'Frequently Asked Questions' },
];

export const WHTR_FAQS: readonly FAQItem[] = [
  {
    question: 'How is waist-to-height ratio calculated?',
    answer:
      'Convert waist and height to the same length unit, then divide waist by height. Example: 80 cm ÷ 160 cm = 0.5. The result is a dimensionless ratio, not a percent.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
