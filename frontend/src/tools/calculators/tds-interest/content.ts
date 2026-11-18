import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TDS_INTEREST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-tds-interest', label: 'What Is TDS Interest / Late Fee?' },
  { id: 'tds-interest-formulas', label: 'Sections 201(1A) and 234E' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'tds-interest-faq', label: 'Frequently Asked Questions' },
];

export const TDS_INTEREST_FAQS: readonly FAQItem[] = [
  {
    question: 'How is interest on late deduction calculated?',
    answer:
      'Under Section 201(1A), simple interest at 1% for every month or part of a month applies from the date tax was deductible (payment or credit, whichever is earlier) to the date it is actually deducted. Part of a month counts as a full calendar month.',
  },
  {
    question: 'How is interest on late payment calculated?',
    answer:
      'Under Section 201(1A), simple interest at 1.5% for every month or part of a month applies from the deduction date to the deposit date when the deposit is after the Rule 30 due date (generally the 7th of the following month; March deductions for non-government deductors are due by 30 April). On-time deposits produce zero interest.',
  },
  {
    question: 'How is the Section 234E late filing fee calculated?',
    answer:
      '₹200 for each day after the quarterly statement due date until the return is filed, capped at the TDS amount for that statement. Filing on or before the due date produces no fee. This tool uses the standard quarterly due dates (31 Jul / 31 Oct / 31 Jan / 31 May) and does not apply year-specific CBDT extension circulars.',
  },
  {
    question: 'Does this calculator convert currencies?',
    answer:
      'No. Amounts are fixed Indian Rupees (₹). Statutory rates and dates are never converted.',
  },
];
