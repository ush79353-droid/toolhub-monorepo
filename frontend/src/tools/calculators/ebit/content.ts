import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EBIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ebit', label: 'What Is EBIT?' },
  { id: 'ebit-formula', label: 'EBIT Formula' },
  { id: 'vs-ebitda', label: 'EBIT vs EBITDA' },
  { id: 'how-to-calculate', label: 'How to Calculate EBIT' },
  { id: 'worked-example', label: 'EBIT Calculation Example' },
  { id: 'from-net-income', label: 'How to Calculate EBIT From Net Income' },
  { id: 'vs-net-income', label: 'EBIT vs Net Income' },
  { id: 'vs-operating-income', label: 'EBIT vs Operating Income' },
  { id: 'good-ebit', label: 'What Is a Good EBIT?' },
  { id: 'ebit-margin', label: 'What Is EBIT Margin?' },
  { id: 'why-important', label: 'Why Is EBIT Important?' },
  { id: 'improve-ebit', label: 'How Can a Business Improve EBIT?' },
  { id: 'mistakes', label: 'Common EBIT Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations of EBIT' },
  { id: 'ebit-faq', label: 'Frequently Asked Questions' },
];

export const EBIT_FAQS: readonly FAQItem[] = [
  {
    question: 'What does EBIT stand for?',
    answer: 'EBIT stands for Earnings Before Interest and Taxes.',
  },
  {
    question: 'How do I calculate EBIT?',
    answer:
      'In this simplified calculator, EBIT = Revenue − Operating expenses, where operating expenses include all relevant operating costs (including COGS where applicable) and exclude interest and income taxes.',
  },
  {
    question: 'Is EBIT the same as operating profit?',
    answer:
      'They often coincide, but may differ depending on accounting presentation, definitions, and non-operating items. Do not treat them as universally identical.',
  },
  {
    question: 'What is the difference between EBIT and EBITDA?',
    answer:
      'EBITDA typically adds back depreciation and amortization to EBIT: EBITDA = EBIT + D + A under common reconciliation assumptions. EBITDA is not the same as cash flow.',
  },
  {
    question: 'Is EBIT the same as net income?',
    answer:
      'No. Net income is after interest, income taxes, and other applicable income-statement items that EBIT excludes.',
  },
  {
    question: 'Can EBIT be negative?',
    answer:
      'Yes. When operating expenses exceed revenue, EBIT is negative: a valid operating loss at the EBIT level.',
  },
  {
    question: 'Can EBIT equal zero?',
    answer:
      'Yes. When operating expenses equal revenue, the business breaks even at the EBIT level under the entered assumptions.',
  },
  {
    question: 'How do I calculate EBIT from net income?',
    answer:
      'Under a simplified reconciliation: EBIT = Net income + Interest expense + Income tax expense. Actual statements may need further adjustments.',
  },
  {
    question: 'Is depreciation included in EBIT?',
    answer:
      'Depreciation expense generally reduces EBIT when it is included in the operating costs being measured.',
  },
  {
    question: 'Are interest expenses included in EBIT?',
    answer:
      'No. EBIT is measured before interest expense.',
  },
  {
    question: 'Are income taxes included in EBIT?',
    answer:
      'No. EBIT is calculated before income taxes.',
  },
  {
    question: 'What is EBIT margin?',
    answer:
      'EBIT margin = (EBIT ÷ Revenue) × 100. It is unavailable when revenue is zero.',
  },
  {
    question: 'What is EBIT if revenue is $100,000 and operating expenses are $65,000?',
    answer: 'EBIT = 100,000 − 65,000 = $35,000.',
  },
  {
    question: 'What happens when operating expenses exceed revenue?',
    answer:
      'EBIT is negative. That is a valid result and does not by itself mean the company is insolvent.',
  },
  {
    question: 'Does high EBIT mean a company has strong cash flow?',
    answer:
      'Not necessarily. EBIT is an earnings measure, not operating cash flow or free cash flow. Working capital, capital expenditures, and non-cash items can differ.',
  },
  {
    question: 'Why do investors use EBIT?',
    answer:
      'EBIT helps compare operating earnings before financing costs and income taxes across periods or businesses, alongside margins and other context.',
  },
];
