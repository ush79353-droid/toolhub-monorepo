import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EXIT_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-exit-rate', label: 'What Is Exit Rate?' },
  { id: 'exit-rate-formula', label: 'Exit Rate Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'exit-rate-faq', label: 'Frequently Asked Questions' },
];

export const EXIT_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is exit rate?',
    answer:
      'Exit rate is the percentage of pageviews that were the last page in a session. It equals exits divided by pageviews, times 100.',
  },
  {
    question: 'How do you calculate exit rate?',
    answer:
      'Exit Rate (%) = (number of exits ÷ number of pageviews) × 100. Example: 250 exits ÷ 1,000 pageviews × 100 = 25%.',
  },
  {
    question: 'Can exit rate be zero?',
    answer: 'Yes. If there were pageviews but no exits on that page, exit rate is 0%.',
  },
  {
    question: 'Why can’t exits exceed pageviews?',
    answer:
      'Each exit is tied to a pageview of that page. More exits than pageviews would produce an invalid rate above 100%.',
  },
  {
    question: 'Why must pageviews be greater than zero?',
    answer:
      'Exit rate divides by pageviews. Zero pageviews would make the rate undefined, so the calculator requires a positive pageview count.',
  },
];
