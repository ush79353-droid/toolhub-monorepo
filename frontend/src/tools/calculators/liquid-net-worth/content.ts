import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LNW_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-liquid-net-worth', label: 'What is liquid net worth?' },
  { id: 'lnw-formula', label: 'Formula' },
  { id: 'lnw-example', label: 'Worked example' },
  { id: 'lnw-faq', label: 'Frequently asked questions' },
];

export interface LnwGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const LNW_GUIDE_SECTIONS: readonly LnwGuideSection[] = [
  {
    id: 'what-liquid-net-worth',
    title: 'What is liquid net worth?',
    paragraphs: [
      'Liquid net worth is how much cash-like wealth you have after subtracting what you owe. It focuses on assets you can access quickly, not illiquid holdings such as a primary home or private business equity.',
      'A positive figure means liquid assets exceed liabilities. A negative figure means debts and near-term obligations exceed ready cash — that result is shown as a signed number, not forced to zero.',
    ],
  },
  {
    id: 'lnw-formula',
    title: 'Liquid net worth formula',
    paragraphs: [
      'Subtract total liabilities from total liquid assets. Keep every amount in the same currency for the same snapshot date.',
    ],
    formula: 'Liquid Net Worth = Total Liquid Assets − Total Liabilities',
  },
  {
    id: 'lnw-example',
    title: 'Worked example',
    paragraphs: [
      'Total liquid assets 500,000 and total liabilities 200,000 produce liquid net worth of 300,000.',
    ],
  },
];

export const LNW_FAQS: readonly FAQItem[] = [
  {
    question: 'What counts as liquid assets?',
    answer:
      'Cash and near-cash balances you can convert quickly — checking, savings, money market accounts, and similar holdings. This calculator does not invent a list; enter the total you already measured.',
  },
  {
    question: 'Can liquid net worth be negative?',
    answer:
      'Yes. When liabilities exceed liquid assets, the result is negative and is not clamped to zero.',
  },
  {
    question: 'Does changing the currency convert my numbers?',
    answer:
      'No. The currency control only changes the symbol and grouping. Amounts stay in the denomination you typed.',
  },
];
