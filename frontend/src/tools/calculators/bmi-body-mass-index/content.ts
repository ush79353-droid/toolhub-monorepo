import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BMI_BODY_MASS_INDEX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'BMI Calculator – Body Mass Index' },
  { id: 'what-is', label: 'What Is BMI?' },
  { id: 'formula', label: 'BMI and BMI Prime Formulas' },
  { id: 'who-categories', label: 'WHO Adult Categories' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'percentile-athletes', label: 'Percentiles and Athletes' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'bmi-body-mass-index-faq', label: 'Frequently Asked Questions' },
];

export const BMI_BODY_MASS_INDEX_FAQS: readonly FAQItem[] = [
  {
    question: 'What is BMI?',
    answer:
      'Body mass index (BMI) is weight in kilograms divided by height in meters squared (kg/m²). It is a screening index for underweight, normal weight, overweight, and obesity in adults—not a diagnosis.',
  },
  {
    question: 'What is BMI Prime?',
    answer:
      'BMI Prime is BMI ÷ 25. The value 1.00 sits at the upper edge of the WHO adult “normal” range (BMI 25). Values below 1 are under that threshold; values above 1 are at or above overweight on the WHO scale.',
  },
  {
    question: 'Do Female and Male use different adult cut-offs?',
    answer:
      'No. WHO adult BMI cut-offs are the same for women and men. Sex is collected for reporting and for childhood BMI-for-age paths that are sex-specific.',
  },
  {
    question: 'Why is there no numeric BMI percentile?',
    answer:
      'Ages 2–19.99 need CDC BMI-for-age LMS tables by sex. Those tables are not bundled in this tool, so the advanced section explains the path instead of inventing a percentile. Ages 20+ use WHO adult categories.',
  },
  {
    question: 'Why can athletes look “overweight” on BMI?',
    answer:
      'BMI ignores body composition. Dense muscle raises weight without raising fat. Mark the athlete checkbox for a caution note and consider body-fat % or clinical measures.',
  },
  {
    question: 'Worked example: 80 kg at 2 m?',
    answer:
      'BMI = 80 / (2²) = 20.00 kg/m². BMI Prime = 20 / 25 = 0.80. That sits in the WHO normal range (18.5–24.99).',
  },
  {
    question: 'Is personal data stored?',
    answer:
      'No. Height, weight, age, and results stay in your browser for this session. Share uses only the public page URL—not your measurements.',
  },
  {
    question: 'What units can I use?',
    answer:
      'Height: cm (default), m, in, or ft. Weight: kg (default), lb, or st. Values convert to metric before BMI is computed.',
  },
];
