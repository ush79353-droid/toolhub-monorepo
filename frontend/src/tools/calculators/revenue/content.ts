import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const REVENUE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-revenue-calculator', label: 'What Is This Calculator?' },
  { id: 'revenue-formulas', label: 'Formulas' },
  { id: 'revenue-example', label: 'Example' },
  { id: 'revenue-faq', label: 'Frequently Asked Questions' },
];

export const REVENUE_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I use the Revenue Calculator?',
    answer:
      'Enter any two of Price, Quantity, and Total revenue, then leave the third blank. The calculator solves for the blank field. Zero is a filled value, not blank. If all three are filled, the last-edited field is recalculated from the other two.',
  },
  {
    question: 'Does changing currency convert my amounts?',
    answer:
      'Yes. Price and Total revenue each have independent currencies. Amounts are converted using stored Phase 2 rates and normalized into the price currency before Price × Quantity math. Quantity is never currency-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Are taxes or discounts included?',
    answer:
      'No. This tool computes simple revenue as Price × Quantity only. It does not apply sales tax, VAT, or discounts.',
  },
];
