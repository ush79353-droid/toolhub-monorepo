import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MARGIN_OF_SAFETY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-margin-of-safety', label: 'What Is Margin of Safety?' },
  { id: 'margin-of-safety-formulas', label: 'Margin of Safety Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'margin-of-safety-faq', label: 'Frequently Asked Questions' },
];

export const MARGIN_OF_SAFETY_FAQS: readonly FAQItem[] = [
  {
    question: 'What does margin of safety measure?',
    answer:
      'It is how far current (or expected) sales sit above breakeven sales; in money, as a ratio or percent of current sales, and optionally in units when a selling price per unit is provided.',
  },
  {
    question: 'Does cost price per unit set breakeven sales?',
    answer:
      'No. Breakeven sales are entered directly. Unit cost alone cannot define breakeven without fixed costs, so this calculator does not invent a breakeven from cost price.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each money field has an independent currency. Changing a field’s currency converts that amount using the stored exchange-rate snapshot. Amounts normalize into the current-sales currency before math; the monetary margin of safety can display in a separate result currency. Ratio, percentage, and unit counts are never FX-converted. If rates are unavailable, cross-currency switching is blocked.',
  },
];
