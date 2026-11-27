import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BRI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'BRI Calculator — Body Roundness Index' },
  { id: 'what', label: 'What is the BRI and how is it calculated?' },
  { id: 'how', label: 'How to calculate your BRI using this calculator' },
  { id: 'health', label: 'What the BRI says about your health status' },
  { id: 'mean', label: 'What does my BRI result mean?' },
  { id: 'vs-bmi', label: 'BRI vs. BMI' },
  { id: 'bri-faq', label: 'Frequently Asked Questions' },
];

export const BRI_FAQS: readonly FAQItem[] = [
  {
    question: 'How is BRI calculated?',
    answer:
      'BRI = 364.2 − 365.5 × √(1 − (waist/(π×height))²) using matching length units (Thomas et al.). If the expression under the square root is negative, BRI is unavailable — values are not clamped.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
