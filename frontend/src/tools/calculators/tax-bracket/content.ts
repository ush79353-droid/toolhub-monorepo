import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TAX_BRACKET_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-tax-bracket-calculator', label: 'What Is a Tax Bracket Calculator?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'verified-irs-brackets', label: 'Verified IRS Brackets' },
  { id: 'progressive-tax-formula', label: 'Progressive Tax Formula' },
  { id: 'deductions-note', label: 'Deductions Note' },
  { id: 'tax-bracket-faq', label: 'Frequently Asked Questions' },
];

export const TAX_BRACKET_FAQS: readonly FAQItem[] = [
  {
    question: 'Which tax years are supported?',
    answer:
      '2024 (default), 2025, and 2026. Brackets come from IRS Rev. Proc. 2023-34, 2024-40, and 2025-32 / IR-2025-103. Changing the year updates thresholds and results.',
  },
  {
    question: 'How are deductions applied?',
    answer:
      'Taxable income used = max(0, Total taxable income − Deductions). If your entered income is already IRS taxable income, leave deductions at $0 so amounts are not reduced twice. This tool does not auto-apply the standard deduction on top of your entry.',
  },
  {
    question: 'What is the difference between marginal and effective rates?',
    answer:
      'Marginal rate is the rate on the next dollar of taxable income. Effective rate = estimated tax ÷ taxable income × 100. At zero taxable income the effective rate is 0%.',
  },
  {
    question: 'Is this a complete federal tax return?',
    answer:
      'No. It estimates ordinary-income tax from progressive brackets only. Credits, AMT, NIIT, capital gains preferences, payroll (FICA), and state tax are not included.',
  },
];
