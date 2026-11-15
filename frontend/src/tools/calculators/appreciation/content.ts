import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const APPRECIATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-appreciation', label: 'What Is Appreciation?' },
  { id: 'appreciation-formula', label: 'Appreciation Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'appreciation-faq', label: 'Frequently Asked Questions' },
];

export const APPRECIATION_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this appreciation calculator do?',
    answer:
      'It compounds a starting value forward by a daily, monthly, or yearly appreciation rate over a duration in years and months.',
  },
  {
    question: 'How is the final value calculated?',
    answer:
      'Final Value = Starting Value × (1 + Appreciation Rate / 100)^N. N is the number of rate periods in the duration: daily uses (years + months/12) × 365, monthly uses years × 12 + months, and yearly uses years + months/12.',
  },
  {
    question: 'Can I model depreciation?',
    answer:
      'Yes. Enter a negative appreciation rate (greater than −100%), or use a dedicated depreciation calculator if available.',
  },
  {
    question: 'Does changing the currency convert the amount?',
    answer:
      'No. Currency selection changes the denomination and formatting only. It does not apply a live exchange rate.',
  },
  {
    question: 'Why must the rate be greater than −100%?',
    answer:
      'A rate of −100% or lower would make the growth factor zero or negative, which does not produce a meaningful compound result for this formula.',
  },
];
