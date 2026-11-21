import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FUTURES_CONTRACTS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Futures Contracts Calculator' },
  { id: 'definition', label: 'What Is Futures P/L?' },
  { id: 'formula', label: 'Point Value and P/L Formulas' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'contracts', label: 'Contract Presets' },
  { id: 'example', label: 'Worked Example' },
  { id: 'currency', label: 'Currencies and FX' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'fc-faq', label: 'Frequently Asked Questions' },
];

export const FUTURES_CONTRACTS_FAQS: readonly FAQItem[] = [
  {
    question: 'How is futures profit or loss calculated?',
    answer:
      'Point value = tick value × ticks per point. Points = selling price − buying price. Long P/L = points × point value × contracts. Short P/L is the negative of the long amount.',
  },
  {
    question: 'What is a tick value?',
    answer:
      'The money value of one minimum price increment for the contract. Multiplying by ticks per point yields the value of a one-point move.',
  },
  {
    question: 'Does long always profit when the sell price is higher?',
    answer:
      'Yes under this model: a positive (sell − buy) produces a positive long P/L. Shorts profit when sell − buy is negative.',
  },
  {
    question: 'Which contracts are listed?',
    answer:
      'Presets include E-Mini S&P 500, Micro E-Mini S&P 500, E-Mini Nasdaq-100, E-Mini Dow, Crude Oil, Gold, and a custom option. Selecting a preset updates ticks per point; tick money remains editable.',
  },
  {
    question: 'Can tick value, point value, and P/L use different currencies?',
    answer:
      'Yes. Pricing runs in the tick currency. Point value and P/L convert for display when Omega FX rates are available. Quote prices never convert.',
  },
  {
    question: 'Are tick values live CME quotes?',
    answer:
      'No. Enter the tick money amount you want to model. Presets only supply ticks-per-point conventions from the shared catalog.',
  },
  {
    question: 'What is a worked example?',
    answer:
      'Tick 1.25 · 4 ticks/point · buy 4500 · sell 4510 · 2 contracts (long) → point value 5 · 10 points · P/L 100 in the tick currency.',
  },
  {
    question: 'Does this include commissions or margin?',
    answer:
      'No. It estimates trade P/L from prices and point value only. For margin-call equity checks, use the Margin Call Calculator.',
  },
];
