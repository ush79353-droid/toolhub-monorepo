import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WELLS_PE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Wells Score Calculator for Pulmonary Embolism' },
  { id: 'what-is', label: 'What This Calculator Does' },
  { id: 'weights', label: 'Scoring Weights' },
  { id: 'bands', label: 'Two- and Three-Level Bands' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'wells-pe-faq', label: 'Frequently Asked Questions' },
];

export const WELLS_PE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Wells score for PE?',
    answer:
      'It is a validated clinical decision rule that estimates pretest probability of pulmonary embolism from seven bedside criteria with published point weights (Wells et al.).',
  },
  {
    question: 'Does heart rate of exactly 100 count?',
    answer:
      'No. The published criterion is heart rate greater than 100 beats per minute. A pulse of 100 does not add the 1.5 points.',
  },
  {
    question: 'What does “PE as likely as an alternative” mean?',
    answer:
      'It matches the published Wells wording that PE is as likely as, or more likely than, an alternative diagnosis (equivalent to “an alternative diagnosis is less likely than PE”).',
  },
  {
    question: 'Are my answers stored?',
    answer:
      'No. Values stay in your browser. Share and copy use the public page URL only.',
  },
];
