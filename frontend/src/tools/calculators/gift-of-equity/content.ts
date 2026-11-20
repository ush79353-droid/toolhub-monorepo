import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GIFT_OF_EQUITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-gift-of-equity', label: 'What Is Gift of Equity?' },
  { id: 'how-to-calculate', label: 'How to Calculate Gift of Equity' },
  { id: 'gift-of-equity-formula', label: 'Gift of Equity Formula' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'vs-down-payment', label: 'Gift of Equity vs. Down Payment' },
  { id: 'as-down-payment', label: 'Can It Be Used as a Down Payment?' },
  { id: 'vs-home-equity', label: 'Gift of Equity vs. Home Equity' },
  { id: 'negative-gift', label: 'Can a Gift of Equity Be Negative?' },
  { id: 'appraisals', label: 'Gift of Equity and Appraisals' },
  { id: 'tax-legal', label: 'Tax and Legal Considerations' },
  { id: 'gift-of-equity-faq', label: 'Frequently Asked Questions' },
];

export const GIFT_OF_EQUITY_FAQS: readonly FAQItem[] = [
  {
    question:
      'What is the gift of equity if both market value and sales price are $1,000,000?',
    answer:
      'Gift of equity = 1,000,000 − 1,000,000 = $0. When market value equals sales price, there is no below-market difference, so the mathematical gift of equity is zero.',
  },
  {
    question: 'Can the gift of equity be negative?',
    answer:
      'Yes, mathematically. If sales price exceeds market value, Market Value − Sales Price is negative. That signed difference is not a positive gift of equity — it means the buyer is paying above the stated market value figure.',
  },
  {
    question: 'How do I calculate my gift of equity?',
    answer:
      'Use Gift of Equity = Market Value − Sales Price. Example: $600,000 market value and $500,000 sales price → $100,000. Express both amounts in the same currency before subtracting.',
  },
  {
    question:
      'What is the difference between the sale price and the market value of a property?',
    answer:
      'Sales price is the agreed amount in the purchase contract. Market value is an estimate of what the property could sell for under normal conditions, often informed by comparable sales or an appraisal. They can differ when a seller intentionally accepts a below-market price.',
  },
  {
    question: 'Can gift of equity be used for a down payment?',
    answer:
      'Some mortgage programs may allow a qualifying gift of equity toward purchase funding requirements, subject to lender policy, documentation, valuation, and relationship rules. Acceptance is not universal — confirm with the lender and program guidelines.',
  },
  {
    question: 'Is a gift of equity taxable?',
    answer:
      'Tax treatment depends on jurisdiction, transaction facts, and applicable gift or transfer rules. This calculator does not determine tax liability. Obtain advice from a qualified tax professional for significant transfers.',
  },
  {
    question: 'Does a gift of equity require an appraisal?',
    answer:
      'Lenders and transaction rules often require reliable valuation documentation. An informal estimate may not be enough when financing or gift documentation is involved. Follow the appraisal or valuation process required for your deal.',
  },
  {
    question: 'Is a gift of equity the same as a cash gift?',
    answer:
      'No. A cash gift is money transferred to the buyer. A gift of equity is the below-market discount embedded in the property sale price. Documentation, lender treatment, and tax considerations can differ.',
  },
  {
    question: 'Who can give a gift of equity?',
    answer:
      'Eligible relationships vary by mortgage program and applicable rules. Family transfers are common in examples, but program eligibility is not automatic. Confirm who qualifies under the specific lender and loan type.',
  },
  {
    question: 'Does a gift of equity reduce the property purchase price?',
    answer:
      'The buyer typically pays the agreed sales price. Gift of equity measures how far that sales price sits below market value. It describes a discount relative to market value; it does not automatically change the contracted sales price itself.',
  },
];
