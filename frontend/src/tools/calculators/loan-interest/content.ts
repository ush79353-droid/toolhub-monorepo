import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LOAN_INTEREST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-loan-interest', label: 'What Is Loan Interest?' },
  { id: 'loan-interest-formulas', label: 'Loan Interest Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'loan-interest-faq', label: 'Frequently Asked Questions' },
];

export const LOAN_INTEREST_FAQS: readonly FAQItem[] = [
  {
    question: 'How are payment and compounding frequencies combined?',
    answer:
      'The calculator builds an effective rate per payment period: r = (1 + APR/(100 × m))^(m/p) − 1, where m is compounding periods per year and p is payments per year. When m equals p, that simplifies to APR/(100 × p).',
  },
  {
    question: 'Why does the repayment label change?',
    answer:
      'The repayment field follows the selected payment frequency (for example Monthly payment, Weekly payment). A non-monthly schedule is never labeled as a monthly installment.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes for money fields. Changing the loan-balance currency converts that principal using the stored exchange-rate snapshot. Interest, total payment, and repayment each have independent display currencies that re-express the same loan-currency totals. Rate, term, and frequencies are never converted. Missing or unusable rates block cross-currency switching.',
  },
];
