import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MILEAGE_REIMBURSEMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-mileage-reimbursement', label: 'What Is Mileage Reimbursement?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'mileage-formulas', label: 'Mileage Formulas' },
  { id: 'irs-rates', label: 'Verified IRS Rates' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'mileage-faq', label: 'Frequently Asked Questions' },
];

export const MILEAGE_REIMBURSEMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this a tax deduction or an employer reimbursement?',
    answer:
      'The output is a nominal combined amount using IRS standard mileage rates. It is not automatically the amount deductible on a federal return, and employer reimbursement policies may differ. Business, medical, and charitable mileage each have separate tax eligibility rules.',
  },
  {
    question: 'Why does 2026 appear as two periods?',
    answer:
      'Official IRS 2026 rates change on July 1 (IR-2025-128 for Jan–Jun; IR-2026-29 for Jul–Dec). This calculator has no travel-date field, so you pick the half-year that matches when the miles were driven instead of silently applying one rate to the whole year.',
  },
  {
    question: 'How do kilometers convert?',
    answer:
      'Distances convert with the international mile: 1 mi = 1.609344 km. Miles = kilometers ÷ 1.609344. Changing a unit selector preserves the same physical distance. IRS rates are always applied per mile in USD.',
  },
];
