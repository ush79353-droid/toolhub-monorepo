import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PQ_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-price-quantity', label: 'What does this calculator compare?' },
  { id: 'pq-formulas', label: 'Formulas' },
  { id: 'pq-example', label: 'Worked example' },
  { id: 'pq-faq', label: 'Frequently asked questions' },
];

export interface PqGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const PQ_GUIDE_SECTIONS: readonly PqGuideSection[] = [
  {
    id: 'what-price-quantity',
    title: 'What does this calculator compare?',
    paragraphs: [
      'It compares two pack sizes by converting each total price into a price per unit, then estimates what the larger quantity would have cost at the smaller pack’s unit price.',
      'Savings can be negative when the larger product is actually more expensive per unit.',
    ],
  },
  {
    id: 'pq-formulas',
    title: 'Formulas',
    paragraphs: [
      'Divide each product’s price by its quantity. Multiply the larger quantity by the smaller product’s unit price to get “would have cost,” then subtract the larger product’s price for savings.',
      'Quantities must be greater than zero so the calculator never divides by zero.',
    ],
    formula:
      'Smaller Price / Unit = Smaller Price ÷ Smaller Quantity\nLarger Price / Unit = Larger Price ÷ Larger Quantity\nWould Have Cost = Larger Quantity × Smaller Price / Unit\nYou Save = Would Have Cost − Larger Price',
  },
  {
    id: 'pq-example',
    title: 'Worked example',
    paragraphs: [
      'Smaller product: 500 units for 100 → 0.20 per unit. Larger product: 1,000 units for 150 → 0.15 per unit. Would have cost = 1,000 × 0.20 = 200. You save = 200 − 150 = 50.',
    ],
  },
];

export const PQ_FAQS: readonly FAQItem[] = [
  {
    question: 'What does “Would have cost” mean?',
    answer:
      'It is the cost of buying the larger quantity at the smaller product’s price per unit: a baseline for comparing the larger pack’s deal.',
  },
  {
    question: 'Can savings be negative?',
    answer:
      'Yes. Negative savings means the larger product costs more per unit than the smaller one. The figure is not clamped to zero.',
  },
  {
    question: 'Why must quantity be greater than zero?',
    answer:
      'Price per unit divides by quantity. A zero quantity would produce Infinity or NaN, so the calculator rejects it.',
  },
  {
    question: 'Does changing the currency convert my numbers?',
    answer:
      'No. The currency control only changes the symbol and grouping. Enter every amount in the same denomination.',
  },
];
