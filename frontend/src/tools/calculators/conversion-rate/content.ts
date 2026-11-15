import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CONVERSION_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-conversion-rate', label: 'What Conversion Rate Means' },
  { id: 'conversion-formula', label: 'Formula' },
  { id: 'ads-vs-websites', label: 'Ads vs Websites' },
  { id: 'conversion-example', label: 'Example' },
  { id: 'conversion-rate-faq', label: 'Frequently Asked Questions' },
];

export const CONVERSION_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is conversion rate?',
    answer:
      'Conversion rate is the percentage of clicks or visits that result in a desired action: (conversions ÷ clicks or visits) × 100.',
  },
  {
    question: 'When should I use websites mode?',
    answer:
      'Use websites when the denominator is site visits (sessions or users). Use ads, posts or links when the denominator is clicks on an ad, post, or link.',
  },
  {
    question: 'Can conversions exceed clicks or visits?',
    answer:
      'No. The calculator rejects that combination so the rate stays within a coherent period definition.',
  },
  {
    question: 'Is zero conversions allowed?',
    answer: 'Yes. Zero conversions with a positive click or visit count yields a 0% conversion rate.',
  },
];
