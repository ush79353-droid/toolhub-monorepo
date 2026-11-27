import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BODY_TYPE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Body Type Calculator' },
  { id: 'shapes', label: 'Female body shapes' },
  { id: 'formula', label: 'Classification rules' },
  { id: 'whr', label: 'Waist-hip ratio' },
  { id: 'bt-faq', label: 'Frequently Asked Questions' },
];

export const BODY_TYPE_FAQS: readonly FAQItem[] = [
  {
    question: 'Which body shapes does this calculator use?',
    answer:
      'Seven apparel categories from the Lee/Istook FFIT-style rules used by calculator.net: hourglass, bottom hourglass, top hourglass, spoon, triangle, inverted triangle, and rectangle.',
  },
  {
    question: 'Why is high hip required?',
    answer:
      'Bottom hourglass vs spoon uses high hip ÷ waist with a cutoff of 1.193. High hip is the upper hip swell (~7 in / 18 cm below the waist).',
  },
  {
    question: 'Is body shape a health diagnosis?',
    answer:
      'No. This is an apparel-fit label. Waist-hip ratio is shown as a separate context metric and is not a diagnosis or treatment recommendation.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only — not your measurements.',
  },
];
