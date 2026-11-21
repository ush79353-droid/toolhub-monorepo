import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { ROTH_RULE_YEAR } from './roth-limits';

export const ROTH_IRA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Roth IRA Calculator' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'limits', label: `${ROTH_RULE_YEAR} Limits & Phase-Outs` },
  { id: 'projection', label: 'Retirement Projection' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'roth-ira-faq', label: 'Frequently Asked Questions' },
];

export const ROTH_IRA_FAQS: readonly FAQItem[] = [
  {
    question: `What contribution limit does this use for ${ROTH_RULE_YEAR}?`,
    answer: `IRS ${ROTH_RULE_YEAR} Roth/IRA elective limit of $7,500, plus $1,100 catch-up if you are age 50+ by year-end (Notice 2025-67).`,
  },
  {
    question: 'How does the MAGI phase-out work?',
    answer: `For ${ROTH_RULE_YEAR}: single/HoH-style band $153,000–$168,000; MFJ $242,000–$252,000; MFS (lived with spouse) $0–$10,000. The reduced limit is rounded up to the next $10.`,
  },
  {
    question: 'Does currency selection convert with live FX?',
    answer:
      'No. Currency only formats labels. MAGI is compared directly to IRS USD statutory thresholds — enter MAGI in those same units.',
  },
  {
    question: 'What is eligible contribution after-tax?',
    answer:
      'Eligible contribution × (1 − your income tax rate). It is an illustrative tax-cost view, not payroll withholding or a Traditional IRA deduction model.',
  },
  {
    question: 'How is the retirement balance projected?',
    answer:
      'End-of-year ordinary annuity: each year’s eligible contribution compounds at your constant annual return until retirement age.',
  },
];
