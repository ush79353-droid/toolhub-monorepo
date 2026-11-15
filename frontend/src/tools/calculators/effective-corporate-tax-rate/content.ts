import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EFFECTIVE_CORPORATE_TAX_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-effective-corporate-tax-rate', label: 'What Is Effective Corporate Tax Rate?' },
  { id: 'effective-tax-rate-formula', label: 'Formula' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'effective-tax-rate-example', label: 'Worked Example' },
  { id: 'effective-tax-rate-faq', label: 'Frequently Asked Questions' },
];

export const EFFECTIVE_CORPORATE_TAX_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the effective corporate tax rate?',
    answer:
      'It is income tax paid divided by earnings before tax, expressed as a percent. It reflects the average rate actually paid on pre-tax earnings, not a statutory bracket alone.',
  },
  {
    question: 'Why must earnings before tax be greater than zero?',
    answer:
      'Dividing by zero is undefined. A non-positive EBT cannot produce a meaningful percentage rate in this calculator.',
  },
  {
    question: 'Can the rate exceed 100%?',
    answer:
      'Yes. If tax paid is larger than earnings before tax, the calculated rate is above 100%. The tool does not cap the result.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter earnings and tax in the same currency.',
  },
];
