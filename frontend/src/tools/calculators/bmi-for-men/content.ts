import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BMI_FOR_MEN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'BMI Calculator for Men' },
  { id: 'what-is', label: 'What Is BMI?' },
  { id: 'formula', label: 'BMI and BMI Prime Formulas' },
  { id: 'who-categories', label: 'WHO Adult Categories' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'age-guard', label: 'Age and Adult Cut-offs' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'bmi-for-men-faq', label: 'Frequently Asked Questions' },
];

export const BMI_FOR_MEN_FAQS: readonly FAQItem[] = [
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
    question: 'Are men’s adult BMI cut-offs different from women’s?',
    answer:
      'No. WHO adult BMI cut-offs are the same for men and women. This calculator omits a sex switch because the adult formula and categories do not change by sex.',
  },
  {
    question: 'Why ask for age?',
    answer:
      'Adult WHO categories apply for ages 20+. If age is under 20, the tool still shows BMI and BMI Prime but withholds adult category labels and points you to BMI-for-age percentiles instead.',
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
    question: 'Is currency conversion involved?',
    answer: 'No. This calculator uses physical height and weight units only.',
  },
];
