import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BMI_WEIGHT_LOSS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What This Calculator Does' },
  { id: 'formula', label: 'BMI, Prime, and Target Weight' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'safe-targets', label: 'Choosing a Safe Target' },
  { id: 'percentile', label: 'BMI Percentile Panel' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'faq', label: 'Frequently Asked Questions' },
];

export const BMI_WEIGHT_LOSS_FAQS: readonly FAQItem[] = [
  {
    question: 'How is target weight calculated?',
    answer:
      'Target weight (kg) = target BMI × [height in meters]². For example, height 1.75 m and target BMI 22 → 22 × 3.0625 ≈ 67.38 kg.',
  },
  {
    question: 'What is BMI Prime?',
    answer:
      'BMI Prime is BMI ÷ 25. The value 1.00 matches the upper edge of the WHO adult normal range (BMI 25). Target BMI Prime links the same way: multiply by 25 to get target BMI.',
  },
  {
    question: 'Why are some target BMIs rejected?',
    answer:
      'Targets below BMI 16 fall in WHO severe thinness and are blocked. Targets below 18.5 show a warning because underweight goals can carry health risks. This tool does not prescribe dieting.',
  },
  {
    question: 'Does the percentile panel work for adults?',
    answer:
      'CDC BMI-for-age LMS charts apply to ages 2 through 19. Adults use WHO BMI categories instead of a childhood percentile.',
  },
];
