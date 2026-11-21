import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BMI_TEENS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'BMI Calculator for Teens' },
  { id: 'what-is', label: 'What Is Teen BMI?' },
  { id: 'formula', label: 'BMI, BMI Prime, and Percentiles' },
  { id: 'categories', label: 'CDC Weight-Status Categories' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'age-bounds', label: 'Age 10–20 Bounds' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'bmi-teens-faq', label: 'Frequently Asked Questions' },
];

export const BMI_TEENS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is BMI for teens?',
    answer:
      'Teen BMI uses the same Quetelet formula (kg/m²) as adults, but weight status is judged with CDC BMI-for-age percentiles that depend on sex and age—not adult WHO cut-offs.',
  },
  {
    question: 'What is BMI Prime?',
    answer:
      'BMI Prime is BMI ÷ 25. It is shown for reference only. This calculator never classifies teen weight status from BMI Prime.',
  },
  {
    question: 'Why do I need sex and age?',
    answer:
      'CDC BMI-for-age charts are sex-specific and age-specific (LMS parameters by month). Without both, the tool can still show BMI and BMI Prime but cannot report a percentile category.',
  },
  {
    question: 'What ages are supported?',
    answer:
      'Ages 10 through 20 years inclusive, matching the labeled field. Younger children belong on a kids/percentile tool; older adults use WHO adult BMI categories.',
  },
  {
    question: 'What are the CDC category cut-offs?',
    answer:
      'Underweight < 5th percentile; healthy weight 5th to under 85th; overweight 85th to under 95th; obesity at or above the 95th percentile.',
  },
  {
    question: 'Is personal data stored?',
    answer:
      'No. Height, weight, age, sex, and results stay in your browser for this session. Share uses only the public page URL—not your measurements.',
  },
  {
    question: 'Worked example?',
    answer:
      'Male · 15 years · 170 cm · 60 kg → BMI ≈ 20.76 · BMI Prime ≈ 0.83, then CDC percentile and category from LMS tables for that sex and age.',
  },
];
