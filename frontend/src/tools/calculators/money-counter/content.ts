import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MONEY_COUNTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Money Counter Calculator' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'denominations', label: 'Supported Denominations' },
  { id: 'formula', label: 'Formula' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'money-counter-faq', label: 'Frequently Asked Questions' },
];

export const MONEY_COUNTER_FAQS: readonly FAQItem[] = [
  {
    question: 'How does the money counter work?',
    answer:
      'Pick a currency, optionally include coins, then enter how many pieces you have of each denomination. Total money = Σ(count × face value) using exact minor-unit arithmetic.',
  },
  {
    question: 'Does changing currency convert my total with exchange rates?',
    answer:
      'No. The currency selector only switches which banknotes and coins appear. Counts stay piece counts; there is no live FX conversion.',
  },
  {
    question: 'Which currencies are supported?',
    answer:
      'USD, EUR, GBP, CAD, AUD, INR, JPY, and PKR with verified everyday circulating denomination lists documented in the calculator module.',
  },
  {
    question: 'Can I enter fractional counts?',
    answer:
      'No. Counts must be nonnegative whole numbers (blank counts as zero).',
  },
  {
    question: 'What is the Candy example total?',
    answer:
      '10×$10 + 20×$50 + 15×$100 + 20×$1 coins + 40×50¢ = $2,640.',
  },
];
