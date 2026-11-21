import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PAKISTAN_INCOME_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-pakistan-income-tax', label: 'What Is This Calculator?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'fbr-tax-year-slabs', label: 'FBR Salaried Tax Slabs (TY 2027)' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'pakistan-income-tax-faq', label: 'Frequently Asked Questions' },
];

export const PAKISTAN_INCOME_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'Which Pakistan tax year does this calculator use?',
    answer:
      'Tax Year 2027 (1 July 2026 – 30 June 2027) salaried-individual rates from Finance Act, 2026; Clause (2) of Division I of Part I of the First Schedule to the Income Tax Ordinance, 2001, as explained in FBR Circular No. 02 of 2026-27. It does not mix rates from earlier Finance Acts.',
  },
  {
    question: 'Is the salaried surcharge included?',
    answer:
      'No. Finance Act, 2026 withdrew the former 9% surcharge under section 4AB for persons whose income is chargeable under the head “Salary”. This calculator therefore applies only the progressive salary table (no surcharge add-on).',
  },
  {
    question: 'How is monthly tax calculated?',
    answer:
      'Annual income = monthly income × 12. Yearly tax is computed on that annual figure with the progressive FBR salary slabs. Monthly tax = yearly tax ÷ 12. Monthly income after tax = monthly income − monthly tax.',
  },
  {
    question: 'What is excluded from this estimate?',
    answer:
      'Results are simplified estimates for gross taxable employment salary only. Individual deductions, credits, exemptions, rebates, non-salary income, and employer withholding timing differences are not modeled. Official assessments follow the Income Tax Ordinance, 2001 and FBR filings.',
  },
];
