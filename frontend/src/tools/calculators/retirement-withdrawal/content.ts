import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RW_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Retirement Withdrawal Calculator' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'formulas', label: 'Formulas' },
  { id: 'inflation-timing', label: 'Inflation & Timing' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'retirement-withdrawal-faq', label: 'Frequently Asked Questions' },
];

export const RW_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator solve?',
    answer:
      'Either a sustainable withdrawal per period for a chosen retirement length, or how long a chosen withdrawal lasts before the nest egg reaches your ending-balance target.',
  },
  {
    question: 'Does the currency selector convert with live FX rates?',
    answer:
      'No. Currency only changes number formatting and symbols. Amounts stay in the denomination you enter.',
  },
  {
    question: 'How is compounding applied?',
    answer:
      'The annual interest rate is converted to an equivalent rate per withdrawal period using your compounding method: discrete (1 + i/m)^(m/q) − 1, or continuous e^(i/q) − 1.',
  },
  {
    question: 'What is beginning vs end of period timing?',
    answer:
      'Beginning (annuity due) withdraws at the start of each period before that period’s interest. End (ordinary annuity) earns interest first, then withdraws.',
  },
  {
    question: 'Why is the screenshot default about 600.25?',
    answer:
      'With PKR 100,000, 4% yearly compounding, monthly withdrawals at the beginning, 20 years, and a zero ending balance, the closed-form due annuity payment rounds to 600.25.',
  },
];
