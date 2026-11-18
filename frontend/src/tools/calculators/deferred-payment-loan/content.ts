import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DEFERRED_PAYMENT_LOAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-deferment', label: 'What Is Loan Deferment?' },
  { id: 'how-deferment-works', label: 'How Deferred Payment Works' },
  { id: 'interest-treatments', label: 'Interest Treatments' },
  { id: 'repayment-types', label: 'Repayment After Deferment' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'deferred-payment-loan-faq', label: 'Frequently Asked Questions' },
];

export const DEFERRED_PAYMENT_LOAN_FAQS: readonly FAQItem[] = [
  {
    question: 'What does capitalized interest mean during deferment?',
    answer:
      'Unpaid interest is added to principal each compounding period. The balance grows during the pause, so post-deferment payments are calculated on a higher amount.',
  },
  {
    question: 'What is “Increased payment - original term”?',
    answer:
      'The original payoff date stays the same. After deferment you repay the remaining balance over fewer months, so the monthly payment rises.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Loan amount and original monthly payment each have an independent currency. Changing loan currency converts the principal with stored FX rates. Changing payment currency converts an entered payment or re-expresses the calculated payment. Interest rate, dates, and durations are never converted.',
  },
  {
    question: 'Are zero interest and invalid deferments handled?',
    answer:
      'Yes. A 0% rate uses simple principal ÷ periods. If deferment leaves no repayment months for the chosen repayment style, or an original payment cannot amortize the post-deferment balance, the calculator reports an error instead of inventing a schedule.',
  },
];
