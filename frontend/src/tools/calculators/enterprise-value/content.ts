import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EV_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is Enterprise Value?' },
  { id: 'meaning', label: 'Enterprise Value Meaning' },
  { id: 'formula', label: 'Enterprise Value Formula' },
  { id: 'components', label: 'Components of Enterprise Value' },
  { id: 'vs-mcap', label: 'Market Cap vs Enterprise Value' },
  { id: 'how-to-calculate', label: 'How to Calculate Enterprise Value' },
  { id: 'example', label: 'Enterprise Value Calculation Example' },
  { id: 'why-debt', label: 'Why Debt Is Added' },
  { id: 'why-cash', label: 'Why Cash Is Subtracted' },
  { id: 'mi-ps', label: 'Minority Interest and Preferred Shares' },
  { id: 'vs-equity', label: 'Enterprise Value vs Equity Value' },
  { id: 'multiples', label: 'Enterprise Value Multiples' },
  { id: 'interpret', label: 'How to Interpret Enterprise Value' },
  { id: 'limitations', label: 'Limitations of Enterprise Value' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'ev-faq', label: 'Frequently Asked Questions' },
];

export const EV_FAQS: readonly FAQItem[] = [
  {
    question: 'What is enterprise value?',
    answer:
      'Enterprise value is a broader company valuation measure that starts from market capitalization and adjusts for debt, preferred equity, minority interest, and cash.',
  },
  {
    question: 'What is the enterprise value formula?',
    answer:
      'EV = Market Cap + Debt + Minority Interest + Preferred Shares − Cash and Cash Equivalents.',
  },
  {
    question: 'How do you calculate enterprise value?',
    answer:
      'Add market capitalization, financial debt, minority interest, and preferred equity, then subtract qualifying cash and cash equivalents.',
  },
  {
    question: 'Is enterprise value the same as market capitalization?',
    answer:
      'No. Market capitalization values common equity only. Enterprise value also reflects financing claims and cash adjustments.',
  },
  {
    question: 'Why is debt added to enterprise value?',
    answer:
      'Debt holders have claims on the business, so financial debt is included in the EV numerator under the common convention.',
  },
  {
    question: 'Why is cash subtracted from enterprise value?',
    answer:
      'Qualifying cash and cash equivalents can offset financing requirements in a simplified acquisition framework, so they are deducted.',
  },
  {
    question: 'Can enterprise value be negative?',
    answer:
      'Yes, mathematically, when cash exceeds the sum of equity and debt claims under this formula. Interpret that case carefully.',
  },
  {
    question: 'Can enterprise value be lower than market capitalization?',
    answer:
      'Yes, when cash and cash equivalents exceed the debt and other claims added in the formula.',
  },
  {
    question: 'What is minority interest?',
    answer:
      'Non-controlling equity interests in consolidated subsidiaries, included so EV aligns with consolidated operating measures.',
  },
  {
    question: 'Are preferred shares included in enterprise value?',
    answer:
      'Yes, when preferred equity claims are material under the chosen valuation convention.',
  },
  {
    question: 'What is EV/EBITDA?',
    answer:
      'A valuation multiple equal to enterprise value divided by EBITDA, used for peer and acquisition comparisons.',
  },
  {
    question: 'Is high enterprise value good?',
    answer:
      'Not by itself. EV must be interpreted with earnings, growth, industry norms, leverage, and peer multiples.',
  },
  {
    question: 'What is the difference between enterprise value and equity value?',
    answer:
      'Equity value focuses on common equity. EV includes debt and other claims and subtracts cash. A simplified reverse is Equity ≈ EV − Debt − MI − Preferred + Cash.',
  },
  {
    question: 'What happens when a company has no debt?',
    answer:
      'The debt term is zero, so EV simplifies to market cap plus minority/preferred claims minus cash.',
  },
  {
    question: 'Does enterprise value include accounts payable?',
    answer:
      'Ordinary trade payables are operating liabilities and are not automatically added as financial debt in this calculator.',
  },
];
