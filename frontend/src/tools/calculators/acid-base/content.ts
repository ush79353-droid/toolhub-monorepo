import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ACID_BASE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Acid Base Calculator' },
  { id: 'what', label: 'What is acid–base balance?' },
  { id: 'abg', label: 'Arterial blood gas values' },
  { id: 'formula', label: 'How to calculate anion gap' },
  { id: 'example', label: 'A practical example' },
  { id: 'ab-faq', label: 'Frequently Asked Questions' },
];

export const ACID_BASE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the anion gap calculated?',
    answer:
      'AG = Na − Cl − HCO₃ in mEq/L (same numeric values as mmol/L for these monovalent ions).',
  },
  {
    question: 'How is the albumin-corrected anion gap calculated?',
    answer:
      'Corrected AG = AG + 2.5 × (4.0 − albumin g/dL), using the Figge teaching factor. Corrected AG stays blank until albumin is entered.',
  },
  {
    question: 'Do pH and PCO₂ change the anion gap?',
    answer:
      'No. They support educational ABG framing when entered with bicarbonate. The gap still uses Na, Cl, and HCO₃ only.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
