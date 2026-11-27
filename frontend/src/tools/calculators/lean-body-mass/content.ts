import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LBM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Lean Body Mass Calculator' },
  { id: 'formula', label: 'Boer lean body mass formula' },
  { id: 'lbm-faq', label: 'Frequently Asked Questions' },
];

export const LBM_FAQS: readonly FAQItem[] = [
  {
    question: 'Which lean body mass equation is used?',
    answer:
      'This calculator uses the Boer equations only: male 0.407·W + 0.267·H − 19.2; female 0.252·W + 0.473·H − 48.3 (W in kg, H in cm). Hume and James formulas are not applied here.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
