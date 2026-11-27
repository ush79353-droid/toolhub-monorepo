import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PLASMA_OSMOLALITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Plasma Osmolality Calculator' },
  { id: 'what', label: 'What is plasma osmolality?' },
  { id: 'vs-osmolarity', label: 'Plasma osmolality vs osmolarity' },
  { id: 'normal', label: 'What is normal plasma osmolality?' },
  { id: 'formula', label: 'Plasma osmolality formula' },
  { id: 'posm-faq', label: 'Frequently Asked Questions' },
];

export const PLASMA_OSMOLALITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How is calculated plasma osmolality computed?',
    answer:
      'Using the Worthley-style teaching formula 2×Na + glucose/18 + BUN/2.8 when sodium is mEq/L and glucose and BUN are mg/dL. Example: Na 140, glucose 90, BUN 14 → 290 mOsm/kg H₂O.',
  },
  {
    question: 'Is this measured osmolality or an osmolar gap?',
    answer:
      'This worksheet reports calculated osmolality only. Measured osmolality from freezing-point depression and the osmolar gap are separate laboratory values not computed here.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
