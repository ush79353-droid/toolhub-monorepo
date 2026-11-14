import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SAFETY_STOCK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-safety-stock', label: 'What Is Safety Stock?' },
  { id: 'safety-stock-formulas', label: 'Formulas' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'safety-stock-example', label: 'Worked Example' },
  { id: 'safety-stock-faq', label: 'Frequently Asked Questions' },
];

export const SAFETY_STOCK_FAQS: readonly FAQItem[] = [
  {
    question: 'What is safety stock?',
    answer:
      'Safety stock is buffer inventory held to cover demand or lead-time spikes above the average. This calculator uses the classic max–min formula.',
  },
  {
    question: 'How is reorder point related to safety stock?',
    answer:
      'Reorder point is average demand during lead time plus safety stock. It is the inventory level at which a replenishment order should be placed.',
  },
  {
    question: 'Why are lead times in days?',
    answer:
      'Both max and average lead time must use the same unit. This tool uses days for both so the usage×lead products stay consistent.',
  },
  {
    question: 'Why round up to whole units?',
    answer:
      'Inventory is ordered in whole units. Ceiling avoids understating buffer stock when the formula produces a fractional quantity.',
  },
];
