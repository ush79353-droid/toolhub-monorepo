import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NJ_SALES_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-nj-sales-tax', label: 'What Is New Jersey Sales Tax?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'nj-sales-tax-formulas', label: 'Formulas' },
  { id: 'zip-and-uez', label: 'ZIP Codes and UEZ Limits' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'nj-sales-tax-faq', label: 'Frequently Asked Questions' },
];

export const NJ_SALES_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'What sales tax rate does New Jersey use?',
    answer:
      'New Jersey has a single statewide sales tax rate of 6.625% (effective January 1, 2018), as published by the New Jersey Division of Taxation. This calculator uses that standard taxable-purchase rate.',
  },
  {
    question: 'Why do I need a ZIP code if the rate is statewide?',
    answer:
      'The ZIP confirms the purchase is associated with a New Jersey location (official ZIP range 07001–08989). It does not invent local surtaxes; New Jersey does not layer general local sales tax on top of the state rate for ordinary taxable sales.',
  },
  {
    question: 'Does this calculator apply Urban Enterprise Zone (UEZ) reduced rates?',
    answer:
      'No. UEZ reduced-rate treatment depends on certified seller status and transaction circumstances that cannot be proven from ZIP alone. This tool never auto-applies a reduced UEZ rate from the ZIP field.',
  },
  {
    question: 'Are product exemptions included?',
    answer:
      'No. Clothing, certain foods, and other exemptions require product classification that the screenshot inputs do not provide. Results assume a standard taxable purchase.',
  },
  {
    question: 'Why is there no currency selector?',
    answer:
      'The reference layout uses fixed USD with a $ prefix. Amounts are not FX-converted, and ZIP codes and tax rates are never treated as currency values.',
  },
];
