import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SERUM_OSMOLALITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Serum Osmolality Calculator' },
  { id: 'what', label: 'What is serum osmolality?' },
  { id: 'formula', label: 'Serum osmolality formula' },
  { id: 'gap', label: 'Osmotic gap' },
  { id: 'sosm-faq', label: 'Frequently Asked Questions' },
];

export const SERUM_OSMOLALITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How is improved serum osmolality calculated?',
    answer:
      '2×Na + BUN/2.8 + glucose/18 + ethanol/3.7 using mg/dL for BUN, glucose, and ethanol. Ethanol entered in mmol/L is converted with ×4.607. Example: Na 140, BUN 14, glucose 90, ethanol 37 mg/dL → 300 mOsm/kg.',
  },
  {
    question: 'When is the osmotic gap shown?',
    answer:
      'Only when a positive measured serum osmolality is entered. A blank field or displayed 0 is treated as empty so the gap is not computed from a placeholder zero.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
