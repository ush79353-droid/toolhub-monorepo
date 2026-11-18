import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CASH_BACK_OR_LOW_INTEREST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  {
    id: 'what-is-cash-back-or-low-interest',
    label: 'What Is a Cash Back or Low Interest Calculator?',
  },
  { id: 'how-the-comparison-works', label: 'How the Comparison Works' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'cash-back-or-low-interest-faq', label: 'Frequently Asked Questions' },
];

export const CASH_BACK_OR_LOW_INTEREST_FAQS: readonly FAQItem[] = [
  {
    question: 'Are cash back and low interest usually exclusive?',
    answer:
      'Often yes. Many manufacturer or dealer promotions force a choice between a cash rebate at a higher APR and a lower promotional APR without the rebate. This calculator compares the two paths using the same vehicle price, term, down payment, trade-in, tax, and fees.',
  },
  {
    question: 'How is sales tax calculated?',
    answer:
      'Sales tax is auto price × sales tax %. Cash back and trade-in do not change the tax base in this model. Enter the rate that applies in your jurisdiction; the state dropdown lists US states for reference only and does not invent or overwrite a tax rate.',
  },
  {
    question: 'What does “Include All Fees in Loan” do?',
    answer:
      'When unchecked, sales tax and title/registration/other fees are paid upfront with the down payment. When checked, those same tax and fee amounts are added to the financed principal instead, so upfront is only the down payment. They are never counted twice in total cost.',
  },
  {
    question: 'How do you decide which offer is better?',
    answer:
      'By total economic cost: auto price + loan interest + sales tax + fees − cash back (cash back only on the rebate scenario). Monthly payment alone can be misleading when principals differ.',
  },
  {
    question: 'Can I change currencies?',
    answer:
      'No. The reference uses fixed USD ($) amounts without currency selectors.',
  },
];
