import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SALES_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-sales-tax', label: 'What Is a Sales Tax Calculator?' },
  { id: 'sales-tax-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'sales-tax-faq', label: 'Frequently Asked Questions' },
];

export const SALES_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I use this calculator?',
    answer:
      'Enter the sales tax percent and either the net (tax-exclusive) or gross (tax-inclusive) price. The other price and the tax amount update from the last-edited price field.',
  },
  {
    question: 'What formulas are used?',
    answer:
      'From net: Tax = Net × rate/100 and Gross = Net + Tax. From gross: Net = Gross / (1 + rate/100) and Tax = Gross − Net. Zero tax is allowed.',
  },
  {
    question: 'Do currency selectors convert amounts?',
    answer:
      'Yes. Net, gross, and tax amount each have independent currencies. Money is normalized into the driver price currency before calculation using stored FX rates. The tax percent is never converted.',
  },
  {
    question: 'Does this look up ZIP or state tax rates?',
    answer:
      'No. This is a generic rate calculator. Jurisdiction-specific tools (for example California or Florida) are separate catalog entries.',
  },
];
