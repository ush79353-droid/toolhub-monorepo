import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SALES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-sales', label: 'What Is This Calculator?' },
  { id: 'sales-formulas', label: 'Formulas' },
  { id: 'sales-deductions', label: 'Sales Deductions' },
  { id: 'sales-faq', label: 'Frequently Asked Questions' },
];

export const SALES_FAQS: readonly FAQItem[] = [
  {
    question: 'How is gross revenue calculated?',
    answer:
      'Gross sales (revenue) = product price × number of products sold for the selected sales period. Monthly and annual revenue convert that total through standard day/week/month/year factors.',
  },
  {
    question: 'What is included under Costs to be deducted?',
    answer:
      'Only sales deductions that reduce revenue: sales returns, sales allowances, and sales discounts. Cost of goods sold and ordinary operating expenses are not subtracted here.',
  },
  {
    question: 'How do currencies and periods work?',
    answer:
      'Each money field has its own currency. Amounts are normalized into the product-price currency before math, then Phase 2 FX converts display outputs. Quantity and period selectors are never FX-converted.',
  },
];
