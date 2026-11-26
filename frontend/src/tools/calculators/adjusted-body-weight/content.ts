import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ADJUSTED_BODY_WEIGHT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Adjusted Body Weight Calculator' },
  { id: 'what', label: 'What is adjusted body weight?' },
  { id: 'formula', label: 'How to calculate adjusted body weight' },
  { id: 'example', label: 'Worked example' },
  { id: 'adjbw-faq', label: 'Frequently Asked Questions' },
];

export const ADJUSTED_BODY_WEIGHT_FAQS: readonly FAQItem[] = [
  {
    question: 'Which ideal weight formula is used?',
    answer:
      'Robinson IBW: for inches of height over 60, males use 52 + 1.9 × excess inches and females use 49 + 1.7 × excess inches.',
  },
  {
    question: 'How is adjusted body weight calculated?',
    answer:
      'When actual weight exceeds IBW, AjBW = IBW + 0.4 × (actual − IBW). When actual weight is at or below IBW, AjBW equals actual weight (the 0.4 adjustment does not apply).',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
