import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BMI_KIDS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'BMI Calculator for Kids' },
  { id: 'what-is', label: 'What Is BMI for Children?' },
  { id: 'formula', label: 'BMI and BMI Prime' },
  { id: 'cdc-categories', label: 'CDC BMI-for-Age Categories' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'bmi-kids-faq', label: 'Frequently Asked Questions' },
];

export const BMI_KIDS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is BMI for kids?',
    answer:
      'Body mass index is still weight ÷ height² (kg/m²). For children and teens ages 2 to under 20, weight status is judged by BMI-for-age percentile (sex-specific), not by adult WHO cut-offs.',
  },
  {
    question: 'What is BMI Prime?',
    answer:
      'BMI Prime = BMI ÷ 25. It compares BMI to the upper edge of the WHO adult “normal” range. This kids tool shows Prime for reference only and never uses it to assign a child weight category.',
  },
  {
    question: 'Which reference does “How healthy is this BMI?” use?',
    answer:
      'CDC Growth Charts 2000 BMI-for-age LMS parameters (bmiagerev.csv) for ages 2–20 years. Categories: underweight (<5th), healthy weight (5th–<85th), overweight (85th–<95th), obesity (≥95th).',
  },
  {
    question: 'Why do I need age and sex?',
    answer:
      'Childhood BMI charts are age- and sex-specific. Open “How healthy is this BMI?”, enter exact age in years, and choose female or male to compute the CDC percentile.',
  },
  {
    question: 'Can I use this for adults?',
    answer:
      'No. Ages 20 and older are outside the CDC BMI-for-age table used here. Use an adult BMI calculator for WHO adult categories.',
  },
  {
    question: 'Worked example?',
    answer:
      'A 10-year-old boy, 140 cm and 32.7 kg, has BMI ≈ 16.68 kg/m². With CDC LMS that sits near the median (~50th percentile), which is healthy weight. BMI Prime ≈ 0.67 is informational only.',
  },
  {
    question: 'Is personal data stored?',
    answer:
      'No. Height, weight, age, and results stay in your browser for this session. Share uses only the public page URL—not measurements.',
  },
];
