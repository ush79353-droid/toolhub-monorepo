import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CONTINUOUS_COMPOUND_INTEREST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-continuous-compound', label: 'What Is Continuous Compounding?' },
  { id: 'continuous-formula', label: 'Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'continuous-compound-faq', label: 'Frequently Asked Questions' },
];

export const CONTINUOUS_COMPOUND_INTEREST_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'It projects final balance and compound interest using continuous compounding (P × e^(r × t)), with optional recurring deposits that also grow continuously from their contribution dates.',
  },
  {
    question: 'What formula is used?',
    answer:
      'Final Balance = P × e^(r × t), where P is the initial balance, r is the annual rate as a decimal, t is years (including months ÷ 12), and e is Euler’s number. Compound interest is final balance minus total cash deposited.',
  },
  {
    question: 'How are additional deposits handled?',
    answer:
      'Each deposit is continuously compounded for the time remaining until the end of the term. Periodic (discrete) compounding is not used.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and formatting. Enter amounts already in the selected currency.',
  },
];
