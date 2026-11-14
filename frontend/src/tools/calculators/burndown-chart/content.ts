import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BURNDOWN_CHART_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-burndown-chart', label: 'What Is a Burndown Chart?' },
  { id: 'how-the-calculator-works', label: 'How the Calculator Works' },
  { id: 'ideal-vs-actual', label: 'Ideal vs Actual Burndown' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'burndown-chart-faq', label: 'Frequently Asked Questions' },
];

export const BURNDOWN_CHART_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a burndown chart?',
    answer:
      'A burndown chart tracks remaining work across a sprint. The ideal line falls in a straight path from the starting story points to zero; the actual line shows remaining points after each working day’s completed work.',
  },
  {
    question: 'How is ideal remaining calculated?',
    answer:
      'Ideal remaining on day N equals total story points × (1 − N / sprint duration). Day 0 is the full backlog; the last day reaches zero on the ideal line.',
  },
  {
    question: 'How is actual remaining calculated?',
    answer:
      'Actual remaining on day N equals total story points minus the sum of story points burned on days 1 through N. Future days you have not logged are not drawn on the actual line.',
  },
  {
    question: 'Why does the actual line stop early?',
    answer:
      'Editing a day’s burn marks progress through that day. Days after your last logged day are treated as future work and are not plotted as completed (including as zero remaining).',
  },
  {
    question: 'Can cumulative burn exceed total story points?',
    answer:
      'No. The calculator rejects inputs when the sum of logged daily burns is greater than the sprint’s total story points.',
  },
];
