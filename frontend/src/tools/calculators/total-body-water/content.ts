import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TOTAL_BODY_WATER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Total Body Water Calculator' },
  { id: 'how', label: 'How does total body water calculator work?' },
  {
    id: 'why',
    label: 'Why is the total body water calculated by body weight, height, age, and sex?',
  },
  { id: 'interpret', label: 'How to interpret the calculated body water percentage?' },
  { id: 'tbw-faq', label: 'Frequently Asked Questions' },
];

export const TOTAL_BODY_WATER_FAQS: readonly FAQItem[] = [
  {
    question: 'Which equation does this calculator use?',
    answer:
      'Watson et al. 1980: male TBW (L) = 2.447 − 0.09516×age + 0.1074×height_cm + 0.3362×weight_kg; female TBW (L) = −2.097 + 0.1069×height_cm + 0.2466×weight_kg. The female equation has no age term.',
  },
  {
    question: 'How is water mass calculated from volume?',
    answer:
      'This worksheet uses the teaching approximation 1 L ≈ 1 kg of body water, then percentage = 100 × water mass / body mass.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
