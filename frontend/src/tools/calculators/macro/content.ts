import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MACRO_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Macro Calculator' },
  { id: 'method', label: 'Calories and macros' },
  { id: 'macro-faq', label: 'Frequently Asked Questions' },
];

export const MACRO_FAQS: readonly FAQItem[] = [
  {
    question: 'How are calories estimated?',
    answer:
      'Mifflin–St Jeor BMR × activity factor (same model as the IIFYM calculator), then AMDR energy shares convert to protein/carb/fat gram ranges.',
  },
  {
    question: 'Are my values stored?',
    answer: 'No. Inputs stay in your browser. Share uses the public page URL only.',
  },
];
