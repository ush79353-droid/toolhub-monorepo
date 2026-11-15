import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WEEK_OVER_WEEK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-week-over-week', label: 'What Is Week-over-Week Growth?' },
  { id: 'week-over-week-formula', label: 'Week-over-Week Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'week-over-week-faq', label: 'Frequently Asked Questions' },
];

export const WEEK_OVER_WEEK_FAQS: readonly FAQItem[] = [
  {
    question: 'What is week-over-week growth?',
    answer:
      'Week-over-week (WoW) growth measures how a metric changed from one week to the next, expressed as a percentage of the initial week’s value.',
  },
  {
    question: 'How is week-over-week % change calculated?',
    answer:
      'WoW % = ((Following week value − Initial week value) ÷ Initial week value) × 100. The initial week value must be nonzero.',
  },
  {
    question: 'Can the result be negative or zero?',
    answer:
      'Yes. A decline produces a negative percentage; identical week values produce 0%.',
  },
  {
    question: 'What about Weekly CAGR?',
    answer:
      'Weekly CAGR compounds growth across multiple weeks. This page ships the WoW section from the reference screenshot; expanded Weekly CAGR fields need a verified expanded screenshot before they are added.',
  },
];
