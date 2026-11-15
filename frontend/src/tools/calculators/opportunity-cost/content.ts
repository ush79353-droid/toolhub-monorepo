import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const OPPORTUNITY_COST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-opportunity-cost', label: 'What Is Opportunity Cost?' },
  { id: 'opportunity-cost-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'opportunity-cost-faq', label: 'Frequently Asked Questions' },
];

export const OPPORTUNITY_COST_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this opportunity cost calculator measure?',
    answer:
      'It estimates the inflation-adjusted investment gain you forgo by spending money today instead of investing it for a chosen period after income tax on earnings.',
  },
  {
    question: 'How is total savings after tax calculated?',
    answer:
      'After-tax annual return = annual return × (1 − tax). Total savings = money × (1 + after-tax return)^t, where t is years + months/12.',
  },
  {
    question: 'How is the inflation-adjusted opportunity cost calculated?',
    answer:
      'Real savings = total savings ÷ (1 + inflation)^t. Opportunity cost = real savings − money spent. That is the real forgone gain, not the full future balance.',
  },
  {
    question: 'What do the supplementary metrics show?',
    answer:
      'Inflation-adjusted savings (Real FV) and the nominal investment gain (total savings − money spent). They stay hidden until you enable the checkbox.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter all money fields already in the selected currency.',
  },
];
