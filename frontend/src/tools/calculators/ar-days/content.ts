import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AR_DAYS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-ar-days-means', label: 'What Accounts Receivable Days Means' },
  { id: 'ar-days-formula', label: 'A/R Days Formula' },
  { id: 'how-to-calculate-dso', label: 'How to Calculate DSO' },
  { id: 'ending-vs-average', label: 'Ending A/R vs Average A/R' },
  { id: 'ar-days-examples', label: 'Examples' },
  { id: 'cash-flow', label: 'DSO and Cash Flow' },
  { id: 'improve-collections', label: 'Ways to Improve Collection' },
  { id: 'ar-days-faq', label: 'Frequently Asked Questions' },
];

export const AR_DAYS_FAQS: readonly FAQItem[] = [
  {
    question: 'What are accounts receivable days?',
    answer:
      'Accounts receivable days, often called days sales outstanding or DSO, estimate how many days of net credit sales are tied up in unpaid invoices. It is a timing measure for the receivables balance you enter, not a credit score.',
  },
  {
    question: 'Which sales belong in the calculation?',
    answer:
      'Use net credit sales: credit sales after returns and allowances. Cash sales were never sitting in receivables, so they do not belong in the denominator. This calculator does not split a total sales figure for you.',
  },
  {
    question: 'Should I use ending receivables or an average?',
    answer:
      'Ending receivables compare the closing balance with sales for the period. An average of the beginning and ending balances dampens a balance that jumped or fell at the period end. Expand Average balance calculation, enter both balances, then choose Use average A/R. The calculator does not switch methods for you.',
  },
  {
    question: 'Is a lower DSO always better?',
    answer:
      'Not by itself. A short figure can mean customers pay quickly, or that the business sells mostly for cash and the receivables balance is small. A long figure can mean slow collection, or terms that intentionally allow more time. Compare the result with your stated terms and with similar firms.',
  },
  {
    question: 'How is DSO different from receivables turnover?',
    answer:
      'Turnover is net credit sales divided by the receivables used in the formula. It counts how many times that balance fits into the period’s credit sales. A/R days rescale the same relationship into days. If turnover is 10 for a 365-day period, A/R days are 36.5.',
  },
  {
    question: 'Why can the calculator leave A/R days blank?',
    answer:
      'Empty or invalid required inputs do not invent a result. Net credit sales of zero cannot support an A/R days ratio when receivables are not zero. Both zeros are indeterminate. Negative money amounts and a non-positive period length are rejected.',
  },
  {
    question: 'Does currency change the day count?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter receivables and sales in the same currency. The calculator does not convert between currencies.',
  },
];
