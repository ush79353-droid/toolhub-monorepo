import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PRESENT_VALUE_OF_ANNUITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-pva', label: 'What Is Present Value of an Annuity?' },
  { id: 'pva-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'pva-faq', label: 'Frequently Asked Questions' },
];

export const PRESENT_VALUE_OF_ANNUITY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the difference between ordinary annuity and annuity due?',
    answer:
      'Ordinary annuity payments occur at the end of each period. Annuity due payments occur at the beginning, so each payment is discounted one period less and the present value is higher by a factor of (1 + i).',
  },
  {
    question: 'How are compounding and payment frequencies combined?',
    answer:
      'The nominal annual rate is converted to an effective rate per payment period: i = (1 + r/m)^(m/q) − 1 for discrete compounding, or i = e^(r/q) − 1 for continuous compounding. Period count n = round(term years × payments per year).',
  },
  {
    question: 'What does the growth rate do?',
    answer:
      'In Growth rate and additional information, growth rate g raises each successive payment. With g = 0 you get a level annuity. With g ≠ 0 the calculator uses the growing-annuity present-value formulas.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Changing payment currency converts the payment amount with stored MongoDB FX. Changing the present-value currency only re-expresses the calculated result. Rates, term, and frequencies never convert.',
  },
];
