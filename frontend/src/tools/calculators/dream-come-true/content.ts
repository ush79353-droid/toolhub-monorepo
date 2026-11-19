import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DREAM_COME_TRUE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro-dream', label: 'How long to afford your dream?' },
  { id: 'step-1', label: 'Step 1: Get in the right mindset' },
  { id: 'step-2', label: 'Step 2: Build your saving strategy' },
  { id: 'step-3', label: 'Step 3: Put your savings to work' },
  { id: 'step-4', label: 'Step 4: Find out how long you need' },
  { id: 'example-car', label: 'Example: Saving for a new car' },
  { id: 'after-goal', label: 'I saved for my dream! What now?' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'dream-come-true-faq', label: 'Frequently asked questions' },
];

export const DREAM_COME_TRUE_FAQS: readonly FAQItem[] = [
  {
    question: 'How does the Dream Come True Calculator work?',
    answer:
      'It estimates how many months of end-of-month deposits, plus monthly compounding on a nominal annual rate ÷ 12, are needed for initial savings and contributions to reach your dream price. The period is rounded up to a whole month.',
  },
  {
    question: 'What interest rate should I enter?',
    answer:
      'Use a realistic expected annual return for the account where you will save — for example a savings APY assumption. It is not a guarantee of future performance.',
  },
  {
    question: 'What if I already have enough savings?',
    answer:
      'If initial savings are at or above the dream price, the calculator reports that the goal is already achieved with zero additional months required.',
  },
  {
    question: 'Can the goal be unreachable?',
    answer:
      'Yes. For example, if you have less than the target, contribute nothing each month, and earn zero interest, there is no path to the goal. Increase deposits, start with more savings, or allow for a positive return.',
  },
  {
    question: 'Are monthly contributions made at the beginning or end of the month?',
    answer:
      'This tool assumes end-of-month contributions, matching the standard ordinary annuity future-value formula used in the time-to-goal equation.',
  },
];
