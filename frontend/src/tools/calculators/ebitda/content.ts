import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EBITDA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'definition', label: 'EBITDA Definition' },
  { id: 'how-to-calculate', label: 'How to Calculate EBITDA' },
  { id: 'from-operating-profit', label: 'EBITDA From Operating Profit' },
  { id: 'from-net-income', label: 'EBITDA From Net Income' },
  { id: 'worked-example', label: 'EBITDA Calculation Example' },
  { id: 'vs-ebit', label: 'EBITDA vs EBIT' },
  { id: 'vs-net-income', label: 'EBITDA vs Net Income' },
  { id: 'vs-ocf', label: 'EBITDA vs Operating Cash Flow' },
  { id: 'vs-fcf', label: 'EBITDA vs Free Cash Flow' },
  { id: 'ebitda-margin', label: 'What Is EBITDA Margin?' },
  { id: 'ebitda-multiple', label: 'What Is an EBITDA Multiple?' },
  { id: 'good-ebitda', label: 'What Is a Good EBITDA?' },
  { id: 'why-important', label: 'Why Is EBITDA Important?' },
  { id: 'improve', label: 'How Can a Business Improve EBITDA?' },
  { id: 'mistakes', label: 'Common EBITDA Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations of EBITDA' },
  { id: 'ebitda-faq', label: 'Frequently Asked Questions' },
];

export const EBITDA_FAQS: readonly FAQItem[] = [
  {
    question: 'What does EBITDA stand for?',
    answer:
      'EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and Amortization.',
  },
  {
    question: 'How do I calculate EBITDA?',
    answer:
      'Under the operating-profit method: EBITDA = Operating profit (EBIT) + Depreciation + Amortization, adding back only D&A already deducted.',
  },
  {
    question: 'What is the difference between EBIT and EBITDA?',
    answer:
      'EBIT is before interest and taxes. EBITDA starts from that measure and adds back depreciation and amortization.',
  },
  {
    question: 'Can EBITDA be negative?',
    answer:
      'Yes. If operating losses exceed the D&A add-backs, EBITDA is negative.',
  },
  {
    question: 'Can EBITDA be higher than EBIT?',
    answer:
      'Yes, when the relevant depreciation and amortization add-backs are positive.',
  },
  {
    question: 'Can EBITDA equal EBIT?',
    answer:
      'Yes, when depreciation and amortization add-backs are zero.',
  },
  {
    question: 'Is EBITDA the same as operating profit?',
    answer:
      'No. Operating profit/EBIT generally includes D&A. EBITDA adds those expenses back under the reconciliation assumptions.',
  },
  {
    question: 'Is EBITDA the same as cash flow?',
    answer:
      'No. EBITDA excludes working-capital changes, cash taxes, capital expenditures, and other cash-flow statement adjustments.',
  },
  {
    question: 'How do I calculate EBITDA from net income?',
    answer:
      'A simplified reconciliation is EBITDA = Net income + Interest + Income taxes + Depreciation + Amortization, with further adjustments often required in practice.',
  },
  {
    question: 'What is EBITDA margin?',
    answer:
      'EBITDA margin = (EBITDA ÷ Revenue) × 100. It is unavailable when revenue is zero.',
  },
  {
    question: 'What is an EBITDA multiple?',
    answer:
      'EV/EBITDA = Enterprise value ÷ EBITDA. It is a common valuation multiple and varies by industry, growth, and risk.',
  },
  {
    question: 'What is a good EBITDA multiple?',
    answer:
      'There is no universal good multiple. Compare peers, growth, capital intensity, risk, and market conditions.',
  },
  {
    question:
      'What is EBITDA if EBIT is $80,000, depreciation is $15,000, and amortization is $5,000?',
    answer: 'EBITDA = 80,000 + 15,000 + 5,000 = $100,000.',
  },
  {
    question: 'Is depreciation included in EBITDA?',
    answer:
      'Depreciation is added back when reconciling from an EBIT measure that already deducted it.',
  },
  {
    question: 'Is amortization included in EBITDA?',
    answer:
      'Yes: amortization is added back under the same assumptions as depreciation.',
  },
  {
    question: 'Why do investors use EBITDA?',
    answer:
      'It supports operating comparisons and valuation discussions before interest, taxes, and non-cash D&A; always with cash-flow and debt context.',
  },
  {
    question: 'What happens when EBITDA is zero in the EV/EBITDA formula?',
    answer:
      'The multiple is undefined because division by zero is not allowed.',
  },
  {
    question: 'Does high EBITDA guarantee financial stability?',
    answer:
      'No. Debt, capital expenditures, working capital, and cash flow can still create stress despite high EBITDA.',
  },
];
