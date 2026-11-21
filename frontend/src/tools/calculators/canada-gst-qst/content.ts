import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CANADA_GST_QST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-canada-sales-tax', label: 'Canadian Sales Taxes Overview' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'rates-and-sources', label: 'Rates and Official Sources' },
  { id: 'formulas', label: 'Formulas by Regime' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'canada-gst-qst-faq', label: 'Frequently Asked Questions' },
];

export const CANADA_GST_QST_FAQS: readonly FAQItem[] = [
  {
    question: 'Which rates does this calculator use?',
    answer:
      'Federal GST/HST and companion provincial rates follow the CRA GST/HST calculator table, including Nova Scotia HST at 14% on or after April 1, 2025. Quebec QST is 9.975%. Amounts are CAD estimates for a generally taxable purchase.',
  },
  {
    question: 'How is Quebec QST calculated?',
    answer:
      'For ordinary taxable supplies, GST and QST are each calculated on the amount before tax. This tool does not apply QST on a GST-inclusive base unless a special rule requires it (not modeled here).',
  },
  {
    question: 'Does HST include GST?',
    answer:
      'Yes. In HST provinces the calculator shows a single HST line at the combined rate and does not add GST again.',
  },
  {
    question: 'Are exemptions and place-of-supply rules included?',
    answer:
      'No. Product type, exemptions, zero-rated supplies, customer residency, and place-of-supply rules are not collected. Treat results as educational estimates, not filing advice.',
  },
];
