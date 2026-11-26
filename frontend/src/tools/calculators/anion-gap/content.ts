import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ANION_GAP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Anion Gap Calculator' },
  { id: 'what', label: 'What is anion gap?' },
  { id: 'formula', label: 'How is the anion gap calculated?' },
  { id: 'albumin', label: 'Why correct for albumin?' },
  { id: 'ag-faq', label: 'Frequently Asked Questions' },
];

export const ANION_GAP_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the anion gap calculated?',
    answer:
      'Primary AG = Na − (Cl + HCO₃) in mEq/L (same numeric values as mmol/L for these ions). Potassium is not included in that primary result.',
  },
  {
    question: 'Does potassium change the main anion gap?',
    answer:
      'No. K⁺ defaults to 0 in the correction panel and is used only for AG_K = (Na + K) − (Cl + HCO₃) when computing the albumin-corrected value.',
  },
  {
    question: 'How is albumin correction applied?',
    answer:
      'Corrected AG = AG_K + 2.5 × (4.0 − albumin g/dL), following the Figge et al. (1998) teaching factor. Corrected AG stays blank until albumin is entered.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
