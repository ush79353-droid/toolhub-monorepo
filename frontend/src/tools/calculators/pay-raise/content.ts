import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PAY_RAISE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-pay-raise-calculator', label: 'What Is a Pay Raise Calculator?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'pay-period-formulas', label: 'Pay Period Formulas' },
  { id: 'raise-formulas', label: 'Raise Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'pay-raise-faq', label: 'Frequently Asked Questions' },
];

export const PAY_RAISE_FAQS: readonly FAQItem[] = [
  {
    question: 'How does the Pay Raise Calculator convert between pay periods?',
    answer:
      'Enter hours per week (default 40) and any one before-raise amount. That last-edited field is authoritative. Annual pay = hourly × hours × 52; weekly = annual ÷ 52; monthly = annual ÷ 12. The same rules convert monetary raise amounts. A month is never treated as exactly four weeks.',
  },
  {
    question: 'Can I enter a percentage or a cash raise?',
    answer:
      'Yes. Enter either a raise percentage or one monetary raise (hourly, weekly, monthly, or annual). The last-edited raise field is authoritative. Percentage and money raises are never stacked as separate cumulative raises.',
  },
  {
    question: 'What happens if original pay is zero?',
    answer:
      'A zero before-raise with a zero raise shows a zero-change result (0%). A positive monetary raise on zero original pay leaves the percentage undefined — the calculator does not show Infinity or invent 0%.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each money field has an independent currency. Math runs in the authoritative before-raise currency; other money fields convert for display. Hours per week and raise percentage never FX-convert. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'How is this different from Future Salary or Wage calculators?',
    answer:
      'Future Salary projects multi-year growth. Wage converters map one rate across periods without a raise section. This tool focuses on a single raise: before pay, raise (% or money), and after pay with synchronized periods.',
  },
];
