import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PITI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-piti', label: 'What Is PITI?' },
  { id: 'why-matters', label: 'Why Does PITI Matter?' },
  { id: 'how-to-calculate', label: 'How to Calculate PITI' },
  { id: 'how-calculator-works', label: 'How Does This Calculator Work?' },
  { id: 'vs-payment', label: 'PITI vs. Monthly Mortgage Payment' },
  { id: 'taxes-effect', label: 'How Do Property Taxes Affect PITI?' },
  { id: 'insurance-effect', label: 'How Does Insurance Affect PITI?' },
  { id: 'lower-piti', label: 'How to Lower PITI' },
  { id: 'included', label: 'What Is Included in PITI?' },
  { id: 'dti', label: 'PITI and Debt-to-Income Ratio' },
  { id: 'piti-faq', label: 'Frequently Asked Questions' },
];

export const PITI_FAQS: readonly FAQItem[] = [
  {
    question: 'What does PITI stand for?',
    answer:
      'Principal, Interest, Taxes, and Insurance — the four parts of a common monthly housing payment estimate.',
  },
  {
    question: 'Is PITI the same as a mortgage payment?',
    answer:
      'Not always. A “mortgage payment” may mean principal and interest only. PITI adds estimated property tax and homeowners insurance.',
  },
  {
    question: 'Does PITI include PMI?',
    answer:
      'Standard PITI does not automatically include private mortgage insurance. Some lenders fold mortgage insurance into a broader housing payment, but this calculator does not add PMI unless you include it yourself elsewhere.',
  },
  {
    question: 'Does PITI include HOA fees?',
    answer:
      'No. HOA or condo fees are typically separate housing expenses outside basic PITI.',
  },
  {
    question: 'How do I calculate monthly property taxes?',
    answer: 'Divide the annual property tax bill by 12.',
  },
  {
    question: 'How do I calculate monthly homeowners insurance?',
    answer: 'Divide the annual premium by 12.',
  },
  {
    question: 'What is a good PITI-to-income ratio?',
    answer:
      'Affordability guidelines vary by lender, loan program, and borrower circumstances. PITI is one input to budgeting — not a universal cutoff.',
  },
  {
    question: 'Can my PITI change over time?',
    answer:
      'Yes. Property taxes and insurance can change, and adjustable-rate loans can change interest. This calculator models a fixed-rate amortizing payment unless you change the inputs.',
  },
  {
    question: 'Does a bigger down payment reduce PITI?',
    answer:
      'A larger down payment usually lowers the loan principal and therefore P&I. Taxes and insurance depend on the property and policy, not automatically on the down payment.',
  },
  {
    question: 'What is escrow in a mortgage payment?',
    answer:
      'Many lenders collect estimated taxes and insurance with each payment and pay those bills from an escrow account when due.',
  },
  {
    question: 'Does PITI include utilities?',
    answer: 'No. Utilities and maintenance are separate from PITI.',
  },
  {
    question: 'How much is PITI on a 200,000 mortgage?',
    answer:
      'With a 30-year term at 7%, annual taxes of 3,600, and annual insurance of 1,200, monthly PITI is about 1,730.60 under this calculator’s formulas.',
  },
  {
    question: 'Can PITI decrease?',
    answer:
      'Yes — for example after refinancing to a lower rate, paying down principal via a shorter remaining term recalculation, or if taxes/insurance fall.',
  },
  {
    question: 'Why is PITI important when buying a home?',
    answer:
      'It helps budget the full recurring housing payment lenders and buyers often care about, not just the loan’s P&I.',
  },
  {
    question: 'What is the difference between principal and interest?',
    answer:
      'Principal reduces the loan balance; interest is the cost of borrowing. Early payments are interest-heavy on a standard amortizing loan.',
  },
];
