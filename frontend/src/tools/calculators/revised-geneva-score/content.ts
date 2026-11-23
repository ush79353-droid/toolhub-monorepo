import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const REVISED_GENEVA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Revised Geneva Score Calculator' },
  { id: 'what-is', label: 'What This Calculator Does' },
  { id: 'weights', label: 'Scoring Weights' },
  { id: 'bands', label: 'Two- and Three-Level Bands' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'rgs-faq', label: 'Frequently Asked Questions' },
];

export const REVISED_GENEVA_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the revised Geneva score?',
    answer:
      'It is a validated clinical decision rule that estimates pretest probability of pulmonary embolism from bedside risk factors and findings (Le Gal et al., 2006).',
  },
  {
    question: 'How are heart-rate points assigned?',
    answer:
      'Heart rate &lt;75 beats/min scores 0; 75–94 scores 3; ≥95 scores 5. A pulse of exactly 95 belongs in the ≥95 band.',
  },
  {
    question: 'What does the combined leg finding require?',
    answer:
      'Four points are awarded only when both pain on deep venous palpation and unilateral edema are present (published AND criterion).',
  },
  {
    question: 'Are my answers stored?',
    answer:
      'No. Values stay in your browser. Share and copy use the public page URL only.',
  },
];
