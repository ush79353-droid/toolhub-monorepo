import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SIX_MINUTE_WALK_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: '6 Minute Walk Test Calculator' },
  { id: 'equations', label: 'Enright–Sherrill Equations' },
  { id: 'percent', label: 'Percent of Expected' },
  { id: 'limits', label: 'Population & Limits' },
  { id: 'six-minute-walk-faq', label: 'FAQ' },
];

export const SIX_MINUTE_WALK_FAQS: readonly FAQItem[] = [
  {
    question: 'Which reference equation does this use?',
    answer:
      'Enright and Sherrill (1998) gender-specific regressions for healthy adults aged 40–80 years. Male: 7.57×height(cm) − 5.02×age − 1.76×weight(kg) − 309. Female: 2.11×height(cm) − 2.29×weight(kg) − 5.78×age + 667.',
  },
  {
    question: 'How is percent of expected calculated?',
    answer:
      'Percent of expected = 100 × observed six-minute walk distance ÷ predicted healthy 6MWD. Equal distances give 100%; zero observed gives 0%.',
  },
  {
    question: 'Who is this population for?',
    answer:
      'The published equations were derived from healthy adults aged 40–80. Ages outside that band and non-positive predictions are suppressed. This tool is educational and not a substitute for a supervised protocol.',
  },
];
