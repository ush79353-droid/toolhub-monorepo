import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EBT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ebt', label: 'What Is EBT?' },
  { id: 'ebt-formula', label: 'EBT Formula' },
  { id: 'gross-profit', label: 'How to Calculate Gross Profit' },
  { id: 'operating-expenses', label: 'How to Calculate Operating Expenses' },
  { id: 'how-to-calculate', label: 'How to Calculate EBT' },
  { id: 'worked-example', label: 'Complete EBT Calculation Example' },
  { id: 'importance', label: 'What Is the Importance of EBT?' },
  { id: 'vs-ebit', label: 'EBT vs EBIT' },
  { id: 'vs-ebitda', label: 'EBT vs EBITDA' },
  { id: 'vs-net-income', label: 'EBT vs Net Income' },
  { id: 'good-ebt', label: 'What Is a Good EBT?' },
  { id: 'ebt-margin', label: 'What Is EBT Margin?' },
  { id: 'improve', label: 'How Can a Company Improve EBT?' },
  { id: 'mistakes', label: 'Common EBT Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations of EBT' },
  { id: 'ebt-faq', label: 'Frequently Asked Questions' },
];

export const EBT_FAQS: readonly FAQItem[] = [
  {
    question: 'What does EBT stand for?',
    answer: 'EBT stands for Earnings Before Tax (also called pretax income).',
  },
  {
    question: 'What is earnings before tax?',
    answer:
      'Earnings before tax measures a company’s earnings after relevant operating and non-operating items, but before income tax expense.',
  },
  {
    question: 'How do I calculate EBT?',
    answer:
      'Under this calculator: EBT = Gross profit − Operating expenses − Interest expenses + Other income, where Gross profit = Revenue − COGS and Operating expenses = SG&A + D&A.',
  },
  {
    question: 'What is the EBT formula?',
    answer:
      'EBT = Revenue − COGS − SG&A − D&A − Interest + Other income (with D&A entered only if not already in COGS or SG&A).',
  },
  {
    question: 'Is EBT the same as EBIT?',
    answer:
      'No. EBIT is before interest and taxes. EBT subtracts interest (and includes other income) before taxes.',
  },
  {
    question: 'What is the difference between EBT and EBITDA?',
    answer:
      'EBITDA adds back depreciation and amortization to an EBIT measure. EBT is pretax earnings after interest and other income, without those D&A add-backs.',
  },
  {
    question: 'Is EBT the same as net income?',
    answer:
      'No. Net income is after income tax expense (and other applicable after-tax items).',
  },
  {
    question: 'Can EBT be negative?',
    answer: 'Yes. A pretax loss is a valid mathematical and financial result.',
  },
  {
    question: 'Can EBT equal zero?',
    answer:
      'Yes. Zero EBT means no pretax earnings under the entered assumptions.',
  },
  {
    question: 'Are interest expenses included in EBT?',
    answer:
      'Yes. Interest expenses reduce EBT in this calculator’s formula.',
  },
  {
    question: 'Are income taxes included in EBT?',
    answer:
      'No. EBT is calculated before income tax expense.',
  },
  {
    question: 'How do I calculate gross profit?',
    answer: 'Gross profit = Revenue − Cost of goods sold.',
  },
  {
    question: 'How do I calculate operating expenses?',
    answer:
      'In this calculator, Operating expenses = SG&A + Depreciation and amortization (uncounted D&A only).',
  },
  {
    question: 'What is EBT margin?',
    answer:
      'EBT margin = (EBT ÷ Revenue) × 100. It is unavailable when revenue is zero.',
  },
  {
    question: 'Why is EBT important for financial analysis?',
    answer:
      'It shows pretax profitability after operating and financing items, helping separate operating performance from tax effects.',
  },
  {
    question: 'Does positive EBT guarantee positive cash flow?',
    answer:
      'No. Working capital, capital expenditures, and non-cash items can differ from pretax earnings.',
  },
  {
    question: 'What does negative EBT indicate?',
    answer:
      'A pretax loss for the period under the entered assumptions — not automatically insolvency.',
  },
  {
    question: 'How is other income treated when calculating EBT?',
    answer:
      'Other income is added. Negative other income represents net other losses and reduces EBT.',
  },
  {
    question:
      'What is EBT if gross profit is $300,000, operating expenses are $100,000, interest expenses are $30,000, and other income is $10,000?',
    answer: 'EBT = 300,000 − 100,000 − 30,000 + 10,000 = $180,000.',
  },
];
