import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FFMI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'FFMI Calculator' },
  { id: 'what', label: 'What is FFMI?' },
  { id: 'formula', label: 'How to calculate FFMI' },
  { id: 'normalized', label: 'Normalized FFMI' },
  { id: 'ffmi-faq', label: 'Frequently Asked Questions' },
];

export const FFMI_FAQS: readonly FAQItem[] = [
  {
    question: 'How is FFMI calculated?',
    answer:
      'Fat-free mass (kg) = weight × (1 − body fat % / 100). FFMI = fat-free mass ÷ height(m)². Example: 80 kg, 25% fat, 2 m height → 60 kg FFM and FFMI 15.',
  },
  {
    question: 'What is normalized FFMI?',
    answer:
      'Normalized FFMI = FFMI + 6.1 × (1.8 − height in meters), adjusting the index toward a 1.8 m reference height.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
