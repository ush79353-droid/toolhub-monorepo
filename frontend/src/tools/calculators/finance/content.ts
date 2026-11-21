import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FINANCE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'time-value-of-money', label: 'The Time Value of Money (TVM)' },
  { id: 'pmt-section', label: 'PMT' },
  { id: 'finance-class', label: 'Finance class' },
  { id: 'importance', label: 'The importance of the Finance Calculator' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'finance-faq', label: 'Frequently asked questions' },
];

export const FINANCE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a finance calculator?',
    answer:
      'A finance calculator solves time-value-of-money problems involving present value (PV), future value (FV), periodic payments (PMT), interest rate (I/Y), and number of periods (N). You enter four known values and solve for the fifth.',
  },
  {
    question: 'What is the time value of money?',
    answer:
      'Money available today can earn interest or investment returns, so it is worth more than the same nominal amount received later. Discounting and compounding convert amounts between present and future dates.',
  },
  {
    question: 'What does PV mean in finance?',
    answer:
      'Present Value is the current worth of a future lump sum or series of payments, discounted at an applicable interest rate. In cash-flow terms, a positive PV is money received now; a negative PV is money paid now.',
  },
  {
    question: 'What does FV mean in finance?',
    answer:
      'Future Value is the worth of an investment or cash-flow stream at a future date after interest and payments. It is the cash amount at the end of the last period in a TVM equation.',
  },
  {
    question: 'What does PMT mean?',
    answer:
      'PMT is a recurring payment made or received each period, for example a loan installment, mortgage payment, or regular savings contribution. Timing can be end-of-period (ordinary) or beginning-of-period (annuity due).',
  },
  {
    question: 'What does I/Y mean on a financial calculator?',
    answer:
      'I/Y is the nominal annual interest rate. This calculator converts it into a rate per payment period using your compounding and payment-frequency settings.',
  },
  {
    question: 'What does N mean on a financial calculator?',
    answer:
      'N is the total number of payment periods. If payments are monthly and N is 120, the horizon is 120 months (10 years).',
  },
  {
    question: 'What is the difference between PV and FV?',
    answer:
      'PV is today’s value; FV is the value at a later date after compounding and cash flows. They are linked by the interest rate, number of periods, and any periodic payments.',
  },
  {
    question: 'How do I calculate future value?',
    answer:
      'For a lump sum with no payments: FV = PV × (1 + r)^n. With periodic payments, add the future value of the annuity. Select the FV tab, enter N, I/Y, PV, and PMT, then calculate.',
  },
  {
    question: 'Can this Finance Calculator calculate loan payments?',
    answer:
      'Yes. Choose the PMT mode, enter the loan amount as PV (often positive if received), set FV to 0 for a fully amortizing loan, enter I/Y and N, then calculate the periodic payment.',
  },
];
