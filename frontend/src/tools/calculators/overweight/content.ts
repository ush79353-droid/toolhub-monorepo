import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const OVERWEIGHT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'What is the BMI of an overweight person?' },
  { id: 'epidemic', label: 'Obesity epidemic' },
  { id: 'how', label: 'How to determine BMI and ponderal index' },
  { id: 'ow-faq', label: 'FAQs' },
];

export const OVERWEIGHT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is BMI calculated?',
    answer:
      'BMI = weight (kg) ÷ height (m)². Example: 80 kg at 1.75 m → BMI ≈ 26.1 (WHO overweight band for adults).',
  },
  {
    question: 'How is adult ponderal index calculated?',
    answer:
      'Adult ponderal (Rohrer) index = weight (kg) ÷ height (m)³. BMI and ponderal can classify the same person differently — always interpret with a clinician.',
  },
  {
    question: 'How are children classified?',
    answer:
      'For ages 2–19 with sex entered, weight status uses CDC 2000 BMI-for-age percentiles (underweight <5th; healthy 5th–<85th; overweight 85th–<95th; obesity ≥95th), not adult WHO cut-offs.',
  },
  {
    question: 'Are values stored?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL only.',
  },
];
