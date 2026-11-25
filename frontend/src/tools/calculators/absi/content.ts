import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ABSI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'ABSI Calculator' },
  { id: 'formula', label: 'A Body Shape Index formula' },
  { id: 'z-score', label: 'ABSI z-score' },
  { id: 'how-to', label: 'How to use this calculator' },
  { id: 'absi-faq', label: 'Frequently Asked Questions' },
];

export const ABSI_FAQS: readonly FAQItem[] = [
  {
    question: 'How is ABSI calculated?',
    answer:
      'Convert waist and height to meters and weight to kilograms. Compute BMI = kg/m², then ABSI = waist_m / (BMI^(2/3) × height_m^(1/2)). This matches Krakauer & Krakauer (PLOS One 2012).',
  },
  {
    question: 'What is the ABSI z-score?',
    answer:
      'The z-score is (ABSI − age/sex reference mean) ÷ reference SD from NHANES 1999–2004 Table S1. A value of 0 means ABSI equals the reference mean for that age and sex.',
  },
  {
    question: 'Which ages are supported for the z-score?',
    answer:
      'Table S1 covers ages 2 through 85+. Ages under 2 have no z-score row. Raw ABSI can still be computed without a z-score when height, weight, and waist are valid.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only — never height, weight, waist, age, or sex.',
  },
];
