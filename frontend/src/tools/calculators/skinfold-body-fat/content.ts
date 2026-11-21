import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SKINFOLD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Skinfold Body Fat Calculator' },
  { id: 'formula', label: 'Formulas' },
  { id: 'sites', label: 'Skinfold measurement sites' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits & Age Bands' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'skinfold-body-fat-faq', label: 'Frequently Asked Questions' },
];

export const SKINFOLD_FAQS: readonly FAQItem[] = [
  {
    question: 'Which equation does this calculator use?',
    answer:
      'Durnin & Womersley (1974) predict body density from the base-10 logarithm of the sum of four skinfolds (biceps, triceps, subscapular, suprailiac), with separate coefficients by sex and age band. Percent body fat uses the Siri equation: %BF = 495/D − 450.',
  },
  {
    question: 'Why is age under 17 blocked?',
    answer:
      'The adult Table 5 bands start at 17–19 for men and 16–19 for women in the primary paper. This tool does not invent pediatric coefficients for ages under 17. Choose 17–19 or an older band to run the estimate.',
  },
  {
    question: 'Should I enter millimetres or inches?',
    answer:
      'Caliper readings are usually recorded in millimetres. You can switch units; values convert while preserving the physical thickness. Equations always use millimetres internally.',
  },
  {
    question: 'How accurate is skinfold body fat?',
    answer:
      'Original work reported roughly a few percentage points of fat as typical model error for many subjects, but individual error can be larger. Technique, caliper type, and body-water status matter. Treat the result as an educational estimate only.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. It does not diagnose obesity, malnutrition, or disease, and it is not a substitute for clinical densitometry or DXA when those are indicated.',
  },
];
