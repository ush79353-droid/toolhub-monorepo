import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DROPS_PER_MINUTE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Drops Per Minute Calculator' },
  { id: 'how', label: 'How to calculate drops per minute' },
  { id: 'factor', label: 'Drop factor equation' },
  { id: 'dpm-faq', label: 'FAQs' },
];

export const DROPS_PER_MINUTE_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate drops per minute?',
    answer:
      'Drops/min = (volume in mL × drop factor in gtts/mL) ÷ time in minutes. Example: 100 mL over 60 min with factor 15 → 25 gtts/min.',
  },
  {
    question: 'What is drip rate in mL/h?',
    answer:
      'mL/h = 60 × volume_mL ÷ time_minutes. The same example yields 100 mL/h. Drops/hour = drops/min × 60.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
