import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INTEREST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-interest-calculator', label: 'What Is an Interest Calculator?' },
  { id: 'interest-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'interest-faq', label: 'Frequently Asked Questions' },
];

export const INTEREST_FAQS: readonly FAQItem[] = [
  {
    question: 'How are contributions timed?',
    answer:
      'Beginning deposits are added before that month’s growth; end deposits are added after. Annual contributions fall on the first month of each year (beginning) or the last month of each year (end). Monthly contributions apply every month.',
  },
  {
    question: 'How does the tax rate affect interest?',
    answer:
      'The calculator uses a simplified after-tax rate: nominal rate × (1 − tax rate / 100). It does not model brackets, capital-gains vs ordinary income, or deferral accounts.',
  },
  {
    question: 'How is inflation adjustment calculated?',
    answer:
      'Buying power = ending balance ÷ (1 + inflation rate)^t, where t is the exact investment length in years (years + months/12).',
  },
  {
    question: 'Can I change currencies?',
    answer:
      'No. The reference uses fixed USD ($) symbols without currency selectors.',
  },
];
