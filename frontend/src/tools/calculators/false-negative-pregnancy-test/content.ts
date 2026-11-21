import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FALSE_NEGATIVE_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'False-Negative Pregnancy Tests' },
  { id: 'why', label: 'Why False Negatives Happen' },
  { id: 'timing', label: 'Timing Widget' },
  { id: 'follow-up', label: 'Verified Follow-Up Language' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'false-negative-faq', label: 'Frequently Asked Questions' },
];

export const FALSE_NEGATIVE_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this tool calculate the chance of a false negative?',
    answer:
      'No. It embeds the same educational test-timing calculator as the Pregnancy Test Calculator. It does not output probabilities or diagnose pregnancy.',
  },
  {
    question: 'What should I do after a negative test?',
    answer:
      'If your period is late or symptoms continue, retest after the suggested timing window or contact a clinician. Follow the package insert.',
  },
];
