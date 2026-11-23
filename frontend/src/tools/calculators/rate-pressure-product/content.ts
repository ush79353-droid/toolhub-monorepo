import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RATE_PRESSURE_PRODUCT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Rate Pressure Product Calculator' },
  { id: 'formula', label: 'How RPP Is Calculated' },
  { id: 'exercise', label: 'Exercise Measurement Context' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'rpp-faq', label: 'Frequently Asked Questions' },
];

export const RATE_PRESSURE_PRODUCT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the rate-pressure product?',
    answer:
      'It is the product of heart rate and systolic blood pressure (bpm·mmHg), also called the double product. It is used as a simple index related to myocardial oxygen demand during exercise.',
  },
  {
    question: 'Which HR and SBP should I enter?',
    answer:
      'Use maximum (peak) values recorded at the same exercise stage so the product is stage-specific. Mixing rest HR with peak SBP (or vice versa) is not meaningful for that stage.',
  },
  {
    question: 'Is the result scaled or divided by 1,000?',
    answer:
      'This calculator shows the raw product (for example 150 × 160 = 24,000). Some lab reports quote RPP/100 or RPP/1000; those scaled figures are not applied here unless labeled.',
  },
  {
    question: 'Are my numbers stored?',
    answer:
      'No. Inputs stay in the browser. Share and copy use the public page URL only.',
  },
];
