import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BREAK_EVEN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-break-even', label: 'What Is Break-even?' },
  { id: 'break-even-formulas', label: 'Formulas' },
  { id: 'how-to-calculate', label: 'How to Calculate' },
  { id: 'margin-vs-markup', label: 'Margin vs Markup' },
  { id: 'worked-example', label: 'Worked Example' },
  { id: 'break-even-faq', label: 'Frequently Asked Questions' },
];

export const BREAK_EVEN_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the break-even point?',
    answer:
      'It is the sales volume (and matching revenue) where total contribution covers fixed costs, so profit is zero before considering anything beyond these inputs.',
  },
  {
    question: 'What is contribution per unit?',
    answer:
      'Contribution per unit is revenue per unit minus variable cost per unit. It is the amount each sale contributes toward fixed costs and profit.',
  },
  {
    question: 'Why are units rounded up?',
    answer:
      'You cannot sell a fraction of a unit in most businesses, so the calculator uses the ceiling of fixed costs ÷ contribution per unit.',
  },
  {
    question: 'What if cost equals or exceeds price?',
    answer:
      'Contribution is zero or negative, so there is no finite break-even quantity. Raise price, lower variable cost, or reduce fixed costs.',
  },
  {
    question: 'How do margin and markup differ?',
    answer:
      'Margin divides contribution by revenue. Markup divides contribution by cost. Markup is undefined when cost per unit is zero.',
  },
  {
    question: 'Does currency convert amounts?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter all money fields in the same currency.',
  },
];
