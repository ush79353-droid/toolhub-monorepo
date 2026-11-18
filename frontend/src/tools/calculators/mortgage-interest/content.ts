import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MORTGAGE_INTEREST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-mortgage-interest', label: 'What Is Mortgage Interest?' },
  { id: 'mortgage-interest-formulas', label: 'Payment and APR Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'mortgage-interest-faq', label: 'Frequently Asked Questions' },
];

export const MORTGAGE_INTEREST_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the monthly payment calculated?',
    answer:
      'For a fixed-rate mortgage, M = P × r / (1 − (1+r)^(−n)), where r is the monthly period rate from the selected compounding convention and n is the term in months. If the rate is zero, M = P / n. Any annual fee is spread as annualFee / 12 and added to the displayed monthly payment.',
  },
  {
    question: 'How is mortgage interest calculated?',
    answer:
      'Mortgage interest is the sum of interest charges from the full-precision monthly amortization schedule: Total payments of principal and interest minus principal, or equivalently the schedule interest column. Up-front fees and points are not counted as interest.',
  },
  {
    question: 'How is APR calculated?',
    answer:
      'APR is solved from cash flows: net proceeds = principal − points cost − up-front fee, and monthly cash flow = base payment + annual fee / 12. The monthly IRR that equates those cash flows is annualized as APR = 12 × i × 100. APR is not the same as the nominal interest rate when fees apply.',
  },
  {
    question: 'Why is only Fixed-rate available?',
    answer:
      'This tool ships Fixed-rate only. Adjustable-rate (ARM) payment paths are not invented without a verified specification for this calculator.',
  },
  {
    question: 'Does changing currency convert the amounts?',
    answer:
      'Yes. Mortgage principal, up-front fee, annual fee, monthly payment, mortgage interest, and total payments each have their own currency. Mixed-currency inputs are normalized into the principal currency before calculation. Changing a result currency re-expresses that money result using stored MongoDB exchange rates. Rates, points, term lengths, and dates are never converted.',
  },
];
