import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COGS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cogs', label: 'What Is COGS?' },
  { id: 'cogs-formula', label: 'COGS Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'cogs-faq', label: 'Frequently Asked Questions' },
];

export const COGS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is cost of goods sold (COGS)?',
    answer:
      'COGS is the direct cost of inventory sold during a period. It starts with beginning inventory, adds purchases, and subtracts ending inventory.',
  },
  {
    question: 'How do you calculate COGS?',
    answer:
      'COGS = Beginning inventory + Purchases − Ending inventory. Example: 50,000 + 30,000 − 20,000 = 60,000.',
  },
  {
    question: 'Can inventory values be zero?',
    answer:
      'Yes. Zero beginning inventory, purchases, or ending inventory is allowed. Negative amounts are rejected.',
  },
  {
    question: 'Why can’t ending inventory exceed beginning inventory plus purchases?',
    answer:
      'Goods available for sale equal beginning inventory plus purchases. Ending inventory cannot be larger than that pool without implying a negative COGS, which this calculator flags instead of showing.',
  },
  {
    question: 'Does changing the currency convert amounts?',
    answer:
      'No. The currency selector only changes the display symbol and formatting. Entered amounts stay in the currency you choose.',
  },
];
