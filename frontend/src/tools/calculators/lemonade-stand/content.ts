import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LEMONADE_STAND_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-lemonade', label: 'What This Calculator Does' },
  { id: 'lemonade-formulas', label: 'Formulas' },
  { id: 'lemonade-example', label: 'Example' },
  { id: 'lemonade-faq', label: 'Frequently Asked Questions' },
];

export const LEMONADE_STAND_FAQS: readonly FAQItem[] = [
  {
    question: 'Are cup or recipe prices built in?',
    answer:
      'No. Enter your own cost per cup (or total cup cost), ingredients, permit, and other costs. The calculator does not invent market prices.',
  },
  {
    question: 'How is total profit calculated?',
    answer:
      'Total revenue is selling price × servings. Total profit is revenue minus total cost (cups + ingredients + permit + other).',
  },
  {
    question: 'What if profit is negative?',
    answer:
      'You are below break-even. The explanation shows how far you are from covering costs and the break-even price per serving.',
  },
  {
    question: 'Does changing currency convert my numbers?',
    answer:
      'No. The selector only changes the currency label and formatting. Amounts stay in the denomination you entered.',
  },
];
