import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PLASMA_VOLUME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Plasma Volume Calculator' },
  { id: 'what', label: 'What is plasma volume?' },
  { id: 'formula', label: 'How the calculator works' },
  { id: 'pv-faq', label: 'Frequently Asked Questions' },
];

export const PLASMA_VOLUME_FAQS: readonly FAQItem[] = [
  {
    question: 'How is plasma volume calculated?',
    answer:
      'PV = TBV × (1 − Hct/100). Weight-only TBV is 65 mL/kg for females and 70 mL/kg for males. Both estimates are shown from the same weight and hematocrit.',
  },
  {
    question: 'What does height change?',
    answer:
      'Optional height enables Nadler and Lemmens–Bernstein–Brodsky blood-volume estimates before applying the same hematocrit fraction.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
