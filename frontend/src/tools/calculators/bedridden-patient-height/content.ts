import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BEDRIDDEN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Bedridden Patient Height Calculator' },
  { id: 'height', label: 'Estimating height without standing' },
  { id: 'weight', label: 'Estimating weight formulas' },
  { id: 'example', label: 'Worked examples' },
  { id: 'bed-faq', label: 'Frequently Asked Questions' },
];

export const BEDRIDDEN_FAQS: readonly FAQItem[] = [
  {
    question: 'How does Mitchell & Lipschitz estimate height?',
    answer: 'Height (cm) = 2 × semi-span (cm). Example: semi-span 85 cm → 170 cm.',
  },
  {
    question: 'Which measurements does Ross Laboratories weight need?',
    answer:
      'Sex, race (Black/White), knee height, and mid-arm circumference. White adult male: weight = 1.19×knee + 3.21×arm − 86.82 (kg, cm).',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
