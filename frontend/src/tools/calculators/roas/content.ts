import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ROAS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-roas', label: 'What This Calculator Does' },
  { id: 'roas-formulas', label: 'Formulas' },
  { id: 'roas-vs-roi', label: 'ROAS vs ROI' },
  { id: 'roas-example', label: 'Example' },
  { id: 'roas-faq', label: 'Frequently Asked Questions' },
];

export const ROAS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is ROAS?',
    answer:
      'Return on ad spend measures revenue generated per unit of advertising spend: (ad revenue ÷ ad spend) × 100. A ROAS of 400% means 4× return.',
  },
  {
    question: 'How is ad-only ROI different?',
    answer:
      'Ad-only ROI is ((ad revenue − ad spend) ÷ ad spend) × 100. It uses ad spend as the only cost and is not overall business profit.',
  },
  {
    question: 'What if I do not know revenue?',
    answer:
      'Choose Yes and enter ad revenue to calculate. This calculator does not invent conversion or AOV estimators.',
  },
  {
    question: 'Does currency convert amounts?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter spend and revenue in the same currency.',
  },
];
