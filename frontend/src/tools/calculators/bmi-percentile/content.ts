import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BMI_PERCENTILE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is BMI Percentile?' },
  { id: 'formula', label: 'WHO LMS Formula' },
  { id: 'age-range', label: 'Age Range' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'related', label: 'Related Percentiles' },
  { id: 'bmi-percentile-faq', label: 'Frequently Asked Questions' },
];

export const BMI_PERCENTILE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does a BMI percentile mean?',
    answer:
      'A BMI-for-age percentile compares a child’s BMI with children of the same sex and age in the WHO Child Growth Standards sample. The 50th percentile is the median BMI for that age and sex.',
  },
  {
    question: 'Which reference does this calculator use?',
    answer:
      'WHO Child Growth Standards BMI-for-age (birth to 60 months / 5 years), with sex-specific LMS parameters and the WHO ±3 SD tail adjustment. Ages outside 0–60 months are not extrapolated.',
  },
  {
    question: 'How is the z-score calculated?',
    answer:
      'z = ((BMI/M)^L − 1)/(L×S) when L ≠ 0, or ln(BMI/M)/S when L = 0. Beyond |z| = 3, WHO fixes the outer SD distance to the gap between 2 SD and 3 SD. Percentile = 100 × Φ(z).',
  },
  {
    question: 'Can I enter height and weight instead of BMI?',
    answer:
      'Yes. Uncheck “I know the child’s BMI” to enter height and weight. BMI is then computed as kg/m² before the percentile step, which matches entering that BMI directly.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. Results are educational only. Growth interpretation belongs with a qualified clinician who knows the child’s full history.',
  },
  {
    question: 'Is currency conversion involved?',
    answer: 'No. This calculator uses age, sex, and physical BMI (or height/weight) only.',
  },
];

export const RELATED_PERCENTILE_LINKS = [
  {
    label: 'Weight',
    href: '/tools/weight-percentile-calculator',
  },
  {
    label: 'Height',
    href: '/tools/height-percentile-calculator',
  },
  {
    label: 'Fetal weight',
    href: '/tools/fetal-weight-percentile-calculator',
  },
] as const;
