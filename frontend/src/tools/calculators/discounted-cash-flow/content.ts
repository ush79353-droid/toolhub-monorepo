import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DCF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-dcf', label: 'What Is DCF?' },
  { id: 'fcff-formula', label: 'FCFF Formula' },
  { id: 'eps-formula', label: 'EPS Formula' },
  { id: 'dcf-faq', label: 'Frequently Asked Questions' },
];

export const DCF_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this DCF calculator do?',
    answer:
      'It values a firm or equity using a simplified two-year projection plus a Gordon growth terminal value, then converts equity value to a per-share estimate.',
  },
  {
    question: 'How does the FCFF method work?',
    answer:
      'Terminal Value = FCFF₂ × (1+g)/(WACC−g). Enterprise Value discounts year-1 FCFF and year-2 FCFF plus terminal value. Equity Value = EV + Cash − Debt. Share Value = Equity ÷ Shares.',
  },
  {
    question: 'How does the EPS method work?',
    answer:
      'It is an equity earnings model at cost of equity, not FCFF/WACC. Terminal value per share = EPS₂ × (1+g)/(r−g). Share value discounts year-1 EPS and year-2 EPS plus that terminal value. Equity value = share value × shares. Enterprise value is not produced.',
  },
  {
    question: 'Why must the discount rate exceed perpetual growth?',
    answer:
      'The Gordon terminal-value formula divides by (discount rate − g). If g is not strictly below the discount rate, the terminal value is undefined or meaningless.',
  },
];
