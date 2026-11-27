import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

/** Guide copy; engine SOURCE_NOTE in calculation.ts mirrors this disclosure. */
export const BODY_SHAPE_CLASSIFICATION_NOTE =
  'Classification uses Lee/Istook/calculator.net inch-based FFIT rules (first match in published order). High-hip/waist threshold 1.193 separates bottom hourglass from spoon. Educational apparel label — not health or fitness advice. Omni’s Body Shape page does not publish the full threshold table; this tool does not claim exact parity with Omni live results.';

export const BODY_SHAPE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Body Shape Calculator' },
  { id: 'shapes', label: 'Female body shapes' },
  { id: 'formula', label: 'How classification works' },
  { id: 'bs-faq', label: 'Frequently Asked Questions' },
];

export const BODY_SHAPE_FAQS: readonly FAQItem[] = [
  {
    question: 'Which body shapes can this calculator show?',
    answer:
      'Seven apparel categories from the Lee/Istook FFIT-style rules used by calculator.net: hourglass, bottom hourglass, top hourglass, spoon, triangle, inverted triangle, and rectangle.',
  },
  {
    question: 'Why is high hip a separate measurement?',
    answer:
      'Bottom hourglass vs spoon uses high hip ÷ waist with a cutoff of 1.193. High hip is the upper swell of the hip curve (~7 in / 18 cm below the natural waist).',
  },
  {
    question: 'Is this a health or fitness assessment?',
    answer:
      'No. This is an educational apparel-fit label for clothing context. It is not a medical diagnosis or treatment recommendation.',
  },
  {
    question: 'Are my measurements saved or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only — not your measurements.',
  },
];