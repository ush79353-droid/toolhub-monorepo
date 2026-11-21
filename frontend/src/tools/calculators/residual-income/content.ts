import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is Residual Income?' },
  { id: 'formula', label: 'Residual Income Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Residual Income' },
  { id: 'why-important', label: 'Why Is Residual Income Important?' },
  { id: 'vs-net-income', label: 'Residual Income vs. Net Income' },
  { id: 'valuation', label: 'Residual Income and Equity Valuation' },
  { id: 'limitations', label: 'Limitations of Residual Income' },
  { id: 'ri-faq', label: 'Frequently Asked Questions' },
];

export const RI_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the difference between residual income and net income?',
    answer:
      'Net income is accounting profit after recognized expenses. Residual income subtracts an equity charge (equity capital × required return) from net income, so it reflects earnings above the shareholders’ required return.',
  },
  {
    question: 'Can residual income be negative?',
    answer:
      'Yes. When net income is below the equity charge, residual income is negative; even if accounting net income is still positive.',
  },
  {
    question: 'What is a good residual income?',
    answer:
      'Positive residual income means earnings exceeded the equity charge for that period. Whether that is “good” still depends on company size, risk, accounting choices, and the time horizon.',
  },
  {
    question: 'What is residual income most commonly used for?',
    answer:
      'Assessing profitability after equity capital costs, analyzing shareholder value creation, and supporting residual-income equity valuation models.',
  },
  {
    question: 'How do you calculate residual income?',
    answer:
      'Equity charge = equity capital × (cost of equity % ÷ 100). Residual income = net income − equity charge.',
  },
  {
    question: 'What is the equity charge?',
    answer:
      'The opportunity cost of equity capital for the period: equity capital multiplied by the required return (cost of equity).',
  },
  {
    question: 'What is the cost of equity?',
    answer:
      'The return shareholders require for providing equity capital, entered here as a percent (for example 12 for 12%).',
  },
  {
    question: 'Can a profitable company have negative residual income?',
    answer:
      'Yes. Example: net income 17,000,000 with equity capital 500,000,000 and cost of equity 12% → equity charge 60,000,000 → residual income −43,000,000.',
  },
  {
    question: 'Is residual income the same as free cash flow?',
    answer:
      'No. Residual income adjusts accounting earnings by an equity charge. Free cash flow measures cash generated after investments and financing adjustments.',
  },
  {
    question:
      'Is corporate residual income the same as personal residual income?',
    answer:
      'No. This calculator measures corporate earnings after a required equity return, not personal income left after living expenses.',
  },
];
