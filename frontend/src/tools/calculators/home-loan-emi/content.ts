import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HOME_LOAN_EMI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-home-loan-emi', label: 'What Is Home Loan EMI?' },
  { id: 'home-loan-emi-formula', label: 'EMI Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'home-loan-emi-faq', label: 'Frequently Asked Questions' },
];

export const HOME_LOAN_EMI_FAQS: readonly FAQItem[] = [
  {
    question: 'How is EMI calculated?',
    answer:
      'With monthly rate r = annual rate ÷ 12 ÷ 100 and n months: EMI = P × r × (1+r)^n / ((1+r)^n − 1). If the rate is zero, EMI = P ÷ n.',
  },
  {
    question: 'What do total payable and total interest mean?',
    answer:
      'Total amount payable is EMI × n. Total interest due is total payable minus the principal. The chart compares principal and total interest as shares of that total payment.',
  },
  {
    question: 'Does changing currency convert the principal?',
    answer:
      'Yes. Changing the principal currency converts that amount with stored exchange rates. EMI, total payable, and total interest currencies only re-express calculated results. Term and interest rate never convert.',
  },
];
