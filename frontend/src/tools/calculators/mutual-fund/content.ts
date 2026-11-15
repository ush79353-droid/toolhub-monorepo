import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MUTUAL_FUND_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-mutual-fund-calculator', label: 'What Is a Mutual Fund Calculator?' },
  { id: 'mutual-fund-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'mutual-fund-faq', label: 'Frequently Asked Questions' },
];

export const MUTUAL_FUND_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this mutual fund calculator do?',
    answer:
      'It projects an investment amount at maturity for a Systematic Investment Plan (SIP) or a one-time lump-sum investment using monthly compounding and an expected annual return you enter.',
  },
  {
    question: 'How is SIP maturity calculated?',
    answer:
      'With monthly rate i = annual return ÷ 12 and n = years × 12 + months, maturity = P × [((1 + i)^n − 1) / i] for end-of-month contributions. If the return is zero, maturity = P × n.',
  },
  {
    question: 'How is lump-sum maturity calculated?',
    answer:
      'Maturity = P × (1 + i)^n with the same monthly rate and period count. If the return is zero, maturity equals the original investment.',
  },
  {
    question: 'Are projected returns guaranteed?',
    answer:
      'No. Results are estimates based on the expected annual return you enter. Actual mutual fund returns can be higher or lower and are not guaranteed.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter all money fields already in the selected currency.',
  },
];
