import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CTR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ctr', label: 'What Is CTR?' },
  { id: 'ctr-formula', label: 'CTR Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'ctr-faq', label: 'Frequently Asked Questions' },
];

export const CTR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is click-through rate (CTR)?',
    answer:
      'CTR is the percentage of ad impressions that resulted in a click. It equals clicks divided by impressions, times 100.',
  },
  {
    question: 'How do you calculate CTR?',
    answer:
      'CTR (%) = (number of clicks ÷ ad impressions) × 100. Example: 250 clicks ÷ 10,000 impressions × 100 = 2.5%.',
  },
  {
    question: 'Can CTR be zero?',
    answer: 'Yes. If there were impressions but no clicks, CTR is 0%.',
  },
  {
    question: 'Why can’t clicks exceed impressions?',
    answer:
      'Each click comes from an impression. Clicks greater than impressions would produce an invalid CTR above 100% for a single ad placement count.',
  },
  {
    question: 'Why must impressions be greater than zero?',
    answer:
      'CTR divides by impressions. Zero impressions would make the rate undefined, so the calculator requires a positive impression count.',
  },
];
