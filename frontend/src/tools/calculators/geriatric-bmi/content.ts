import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GERIATRIC_BMI_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Geriatric BMI Calculator' },
  { id: 'bands', label: 'Older-Adult BMI Bands' },
  { id: 'formula', label: 'BMI Formula' },
  { id: 'limits', label: 'Limitations' },
  { id: 'geriatric-bmi-faq', label: 'FAQ' },
];

export const GERIATRIC_BMI_FAQS: readonly FAQItem[] = [
  {
    question: 'How is geriatric BMI different?',
    answer:
      'The Quetelet formula is the same (kg/m²). Interpretation uses elevated cut-points often discussed for older adults: underweight below 23, normal 23–29.9, and overweight/obese at 30 and above.',
  },
  {
    question: 'What happens at BMI 30?',
    answer:
      'BMI ≥ 30 is classified overweight/obese. Normal covers 23 ≤ BMI < 30 (shown as 23–29.9).',
  },
  {
    question: 'Is this a diagnosis?',
    answer:
      'No. BMI is a screening number only. Clinical nutrition decisions need professional assessment.',
  },
];
