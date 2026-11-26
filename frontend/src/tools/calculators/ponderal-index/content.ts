import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PONDERAL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Ponderal Index Calculator' },
  { id: 'formula', label: 'Ponderal index formula' },
  { id: 'ponderal-faq', label: 'Frequently Asked Questions' },
];

export const PONDERAL_FAQS: readonly FAQItem[] = [
  {
    question: 'How is adult ponderal index calculated?',
    answer:
      'PI = weight in kilograms ÷ (height in meters)³. Example: 80 kg and 2 m → 80 ÷ 8 = 10 kg/m³.',
  },
  {
    question: 'How is neonate/infant ponderal index calculated?',
    answer:
      'PI = 100 × weight in grams ÷ (height in centimeters)³, which equals 0.1 × the adult kg/m³ value for the same body.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
