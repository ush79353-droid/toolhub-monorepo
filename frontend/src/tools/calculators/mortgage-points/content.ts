import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MORTGAGE_POINTS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-mortgage-points', label: 'What Are Mortgage Points?' },
  { id: 'mortgage-points-formula', label: 'How the Comparison Works' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'mortgage-points-faq', label: 'Frequently Asked Questions' },
];

export const MORTGAGE_POINTS_FAQS: readonly FAQItem[] = [
  {
    question: 'How much does one mortgage point cost?',
    answer:
      'One mortgage point costs 1% of the original loan amount. Cost = principal × points ÷ 100. For a PKR 250,000 loan, 1 point costs PKR 2,500 and 3 points cost PKR 7,500.',
  },
  {
    question: 'How is break-even calculated?',
    answer:
      'Break-even months = points cost ÷ monthly payment savings versus the no-points baseline (initial rate). The result is rounded up to whole months. If savings are zero or negative, break-even is not defined.',
  },
  {
    question: 'What does rolling points into the loan do?',
    answer:
      'When payment type is rolled into the loan, the points cost is added to principal before amortization. Total payments then come from the schedule alone so the points cost is not added again. Upfront payment adds the points cost once to total payments after the schedule.',
  },
  {
    question: 'Which amounts convert when I change currency?',
    answer:
      'Original loan amount and each option’s points cost have independent currencies and convert with stored MongoDB exchange rates. Values are normalized into the loan currency before amortization. Interest rates, term, points counts, discount percent, and dates never convert.',
  },
];
