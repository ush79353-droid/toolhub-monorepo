import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SAVINGS_INTEREST_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-savings-interest-rate', label: 'What This Calculator Does' },
  { id: 'how-we-calculate', label: 'How We Calculate' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'savings-interest-rate-faq', label: 'Frequently Asked Questions' },
];

export const SAVINGS_INTEREST_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'Is the required rate an APR or APY?',
    answer:
      'The result is the annual nominal interest rate that compounds at the selected frequency. Effective annual yield differs when compounding is more frequent than yearly.',
  },
  {
    question: 'What if deposits alone already reach the goal?',
    answer:
      'If the starting balance plus planned deposits reach the goal with no interest, the required rate is reported as 0%.',
  },
  {
    question: 'Can the calculator fail to find a rate?',
    answer:
      'Yes. If both the starting balance and deposits are zero (or otherwise cannot grow to the goal), no finite positive rate exists and a clear message is shown.',
  },
  {
    question: 'How are beginning vs end of period deposits handled?',
    answer:
      'End-of-period deposits use the ordinary annuity factor. Beginning-of-period deposits multiply that factor by (1 + i), so each contribution earns one extra period of interest.',
  },
];
