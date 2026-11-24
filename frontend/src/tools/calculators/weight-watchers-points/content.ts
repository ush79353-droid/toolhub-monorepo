import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WW_POINTS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Weight Watchers Points Calculator' },
  { id: 'formula', label: 'SmartPoints formula' },
  { id: 'limits', label: 'Limits & editions' },
  { id: 'ww-points-faq', label: 'Frequently Asked Questions' },
];

export const WW_POINTS_FAQS: readonly FAQItem[] = [
  {
    question: 'Which Weight Watchers points system is this?',
    answer:
      'This worksheet uses the publicly documented SmartPoints (2015–2021) food formula: calories, sugar, saturated fat, and protein. Later WW algorithms (including 2022+) are not publicly published, so they are not implemented here.',
  },
  {
    question: 'Is this for one food or my whole day?',
    answer:
      'Enter the nutrition amounts for whatever you are scoring — a single serving, a meal, or a day’s totals. The formula is the same; only the grams and calories you enter change.',
  },
  {
    question: 'How is SmartPoints rounded?',
    answer:
      'The educational estimate rounds the formula result to the nearest whole number and never goes below zero.',
  },
  {
    question: 'Are my entries stored?',
    answer:
      'No. Values stay in your browser. Share uses the public page URL only — never your nutrition numbers.',
  },
];
