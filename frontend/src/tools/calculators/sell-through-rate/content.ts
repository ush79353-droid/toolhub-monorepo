import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SELL_THROUGH_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-sell-through-rate', label: 'What Is Sell-Through Rate?' },
  { id: 'sell-through-rate-formula', label: 'Sell-Through Rate Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'sell-through-rate-faq', label: 'Frequently Asked Questions' },
];

export const SELL_THROUGH_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is sell-through rate?',
    answer:
      'Sell-through rate is the percentage of received inventory that was sold in a period. It equals units sold divided by units received, times 100.',
  },
  {
    question: 'How do you calculate sell-through rate?',
    answer:
      'Sell-through Rate (%) = (units sold ÷ units received) × 100. Example: 150 sold ÷ 200 received × 100 = 75%.',
  },
  {
    question: 'Can sell-through rate be zero?',
    answer:
      'Yes. If units were received but none were sold, sell-through rate is 0%.',
  },
  {
    question: 'Why can’t units sold exceed units received?',
    answer:
      'You cannot sell more units than were received in the measured stock. That would produce a rate above 100% for this simple formula.',
  },
  {
    question: 'Why must units received be greater than zero?',
    answer:
      'Sell-through rate divides by units received. Zero received would make the rate undefined, so the calculator requires a positive received count.',
  },
];
