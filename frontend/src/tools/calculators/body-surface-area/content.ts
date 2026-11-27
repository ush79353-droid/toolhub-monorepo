import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BODY_SURFACE_AREA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Body Surface Area Calculator' },
  { id: 'what-is', label: 'What is BSA?' },
  { id: 'formulas', label: 'Formulas' },
  { id: 'limits', label: 'Limits' },
  { id: 'bsa-net-faq', label: 'Frequently Asked Questions' },
];

export const BODY_SURFACE_AREA_FAQS: readonly FAQItem[] = [
  {
    question: 'Which BSA formula should I use?',
    answer:
      'Du Bois (1916) remains widely cited for adults. Mosteller is a simple square-root form. Pediatric and population-specific equations (Haycock, Fujimoto, Takahira, Schlich) exist. This tool lists common published estimates side by side for education — follow your institutional protocol for dosing.',
  },
  {
    question: 'Why does sex appear if most formulas ignore it?',
    answer:
      'Most classic BSA equations use only weight and height. Sex is required for the Schlich sex-specific equations shown in the results.',
  },
  {
    question: 'How do feet/inches and centimeters interact?',
    answer:
      'Enter either imperial feet+inches or centimeters. The last edited representation is used, and the other side is cleared so stale values cannot mix.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only — not your measurements.',
  },
];
