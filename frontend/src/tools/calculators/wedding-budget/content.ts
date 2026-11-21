import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WEDDING_BUDGET_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-wedding-budget', label: 'What Is a Wedding Budget?' },
  { id: 'wedding-budget-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'wedding-budget-faq', label: 'Frequently Asked Questions' },
];

export const WEDDING_BUDGET_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the wedding budget balance calculated?',
    answer:
      'Wedding Budget Balance = Planned Budget − Total Wedding Cost. A positive balance means you are under budget; zero is balanced; a negative balance means overspending.',
  },
  {
    question: 'How is cost per guest calculated?',
    answer:
      'Total Average Cost per Guest = Total Wedding Cost ÷ Number of Guests. Guest count must be greater than zero. Guests are never currency-converted.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each money field has an independent currency. Changing a selector converts that amount using stored MongoDB rates when available. All expenses normalize into the planned-budget currency before totals. Guest counts are never FX-converted.',
  },
  {
    question: 'What belongs in custom expenses?',
    answer:
      'Anything outside the fixed sections (bride and groom, subcontractors, venue/food, ceremony, transport). Custom lines are added once into the grand total and do not affect other category totals.',
  },
];
