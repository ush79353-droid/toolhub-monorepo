import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const IDEAL_WEIGHT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Ideal Weight Calculator' },
  { id: 'formulas', label: 'How much should I weigh?' },
  { id: 'limits', label: 'Limitations of IBW formulas' },
  { id: 'ibw-faq', label: 'Frequently Asked Questions' },
];

export const IDEAL_WEIGHT_FAQS: readonly FAQItem[] = [
  {
    question: 'Which ideal weight formulas are used?',
    answer:
      'Devine, Robinson, Miller, and Hamwi adult formulas based on inches of height above 5 feet (60 in), with sex-specific intercepts and slopes.',
  },
  {
    question: 'Does current weight change the ideal weight?',
    answer:
      'No. Height and sex alone set each IBW estimate. Current weight is optional and only appears in comparison text.',
  },
  {
    question: 'What if height is under 5 feet?',
    answer:
      'The same linear equations are extrapolated below 60 in with an explicit notice. Those values are less reliable than estimates near the adult reference stature.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
