import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FIFO_INVENTORY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-fifo', label: 'What FIFO Means' },
  { id: 'fifo-formulas', label: 'Formulas' },
  { id: 'fifo-example', label: 'Example' },
  { id: 'fifo-faq', label: 'Frequently Asked Questions' },
];

export const FIFO_INVENTORY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is FIFO inventory costing?',
    answer:
      'First-in, first-out assumes the earliest purchased units are sold first, so cost of goods sold draws from batch 1 before batch 2.',
  },
  {
    question: 'Can I sell more units than I purchased?',
    answer: 'No. Total units sold cannot exceed batch 1 quantity plus batch 2 quantity.',
  },
  {
    question: 'What happens when revenue is zero?',
    answer:
      'Revenue and COGS still calculate. Gross margin is omitted when revenue is zero so the rate stays defined.',
  },
  {
    question: 'Does changing currency convert my numbers?',
    answer:
      'No. The selector only changes the currency label and formatting. Amounts stay in the denomination you entered.',
  },
];
