import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BSA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'BSA Calculator' },
  { id: 'formulas', label: 'The BSA formula' },
  { id: 'why', label: 'Why use this calculator?' },
  { id: 'limits', label: 'Other considerations' },
  { id: 'bsa-faq', label: 'Frequently Asked Questions' },
];

export const BSA_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the primary BSA formula used here?',
    answer:
      'Du Bois: BSA (m²) = 0.007184 × weight_kg^0.425 × height_cm^0.725. Optional alternate formulas (Mosteller, Fujimoto, Gehan & George, Haycock) appear under Additional BSA calculations.',
  },
  {
    question: 'How does Mosteller compare at 180 cm and 80 kg?',
    answer:
      'Mosteller BSA = √(weight_kg × height_cm / 3600). For 80 kg and 180 cm that equals √4 = 2.00 m².',
  },
  {
    question: 'Is this the same as the Body Surface Area Calculator?',
    answer:
      'They are separate catalog tools. This BSA calculator uses Du Bois as the primary result with a collapsed multi-formula disclosure.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
