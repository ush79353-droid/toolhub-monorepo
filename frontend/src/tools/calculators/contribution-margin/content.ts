import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-contribution-margin', label: 'What is contribution margin?' },
  { id: 'cm-formulas', label: 'Formulas' },
  { id: 'cm-example', label: 'Worked example' },
  { id: 'cm-faq', label: 'Frequently asked questions' },
];

export interface CmGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const CM_GUIDE_SECTIONS: readonly CmGuideSection[] = [
  {
    id: 'what-contribution-margin',
    title: 'What is contribution margin?',
    paragraphs: [
      'Contribution margin is the amount left from sales after variable costs. It is the pool available to cover fixed costs and then generate profit.',
      'The ratio expresses that same leftover as a percent of selling price, so you can compare products with different prices on a common scale.',
    ],
  },
  {
    id: 'cm-formulas',
    title: 'Contribution margin formulas',
    paragraphs: [
      'Total contribution margin multiplies the per-unit leftover by the number of units. Profit subtracts fixed costs from that total. A negative profit means fixed costs exceed contribution margin for the period.',
      'When selling price is zero, the ratio is undefined. This calculator leaves the ratio blank instead of showing Infinity or NaN.',
    ],
    formula:
      'Contribution margin = (Selling price − Variable cost) × Units\nContribution margin ratio (%) = ((Selling price − Variable cost) ÷ Selling price) × 100\nProfit generated = Contribution margin − Fixed costs',
  },
  {
    id: 'cm-example',
    title: 'Worked example',
    paragraphs: [
      'Selling price 100, variable cost 60, units 200, fixed costs 3,000. Contribution per unit is 40, so contribution margin is 8,000. The ratio is 40%. Profit is 8,000 − 3,000 = 5,000.',
    ],
  },
];

export const CM_FAQS: readonly FAQItem[] = [
  {
    question: 'What is contribution margin?',
    answer:
      'It is sales leftover after variable costs: (selling price per unit − variable cost per unit) × number of units. That amount helps cover fixed costs and profit.',
  },
  {
    question: 'How is the contribution margin ratio calculated?',
    answer:
      'Divide contribution per unit by selling price per unit and multiply by 100. If selling price is zero, the ratio is omitted so the result never becomes Infinity or NaN.',
  },
  {
    question: 'Can profit generated be negative?',
    answer:
      'Yes. When fixed costs exceed contribution margin, profit is shown as a negative number (a loss for the period). It is not clamped to zero.',
  },
  {
    question: 'Does changing the currency convert my numbers?',
    answer:
      'No. The currency control only changes the symbol and grouping. Amounts stay in the denomination you typed.',
  },
];
