import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MILLIONAIRE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'saving-a-million', label: 'Saving a million' },
  {
    id: 'how-long-formulas',
    label: 'How long to save a million? Formulas needed',
  },
  {
    id: 'sample-calculation',
    label: 'Sample calculation on how to save a million dollars',
  },
  { id: 'using-calculator', label: 'Using our millionaire calculator' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'millionaire-faq', label: 'Frequently asked questions' },
];

export const MILLIONAIRE_FAQS: readonly FAQItem[] = [
  {
    question: 'How can I become a millionaire?',
    answer:
      'Consistent saving, investing regularly, starting early, letting compound interest work, controlling unnecessary spending, planning for the long term, and increasing contributions as income grows all help. No particular investment return is guaranteed.',
  },
  {
    question: 'How long does it take to save one million dollars?',
    answer:
      'Duration depends on initial savings, periodic contributions, investment return, compounding frequency, and deposit timing. With $20,000 saved, $1,000 monthly deposits, and 4% annual interest compounded monthly, this calculator estimates roughly 35 years — change the inputs to see other scenarios.',
  },
  {
    question: 'How much should I save each month to become a millionaire?',
    answer:
      'Required monthly savings depend on your target date, starting balance, and expected return. Use this calculator to experiment with different deposit amounts until the estimated duration matches your plan.',
  },
  {
    question: 'How does compound interest help you become a millionaire?',
    answer:
      'Interest earned can itself earn interest. For example, $10,000 at 4% grows to about $10,400 after one year; the next year interest applies to $10,400, not just the original principal. Over decades, that snowball effect can exceed total contributions.',
  },
  {
    question: 'How does inflation affect my million-dollar savings goal?',
    answer:
      'Inflation reduces purchasing power. PV = FV / (1+f)^t converts a future balance into today’s dollars. A nominal $1,000,000 in 35 years at 2% inflation is worth far less than $1,000,000 today.',
  },
  {
    question: 'What is the best interest rate to use?',
    answer:
      'The appropriate rate depends on your savings or investment type, risk tolerance, time horizon, and market conditions. Use a conservative estimate for planning; this tool does not recommend or guarantee a rate.',
  },
  {
    question: 'Does compounding frequency matter?',
    answer:
      'Yes. For the same nominal annual rate, more frequent compounding generally produces a slightly higher effective yield. Annual, quarterly, monthly, and daily compounding can change the timeline and final balance.',
  },
  {
    question: 'Should I make deposits at the beginning or end of each period?',
    answer:
      'Beginning-of-period deposits earn interest for an extra period compared with end-of-period deposits. When all other assumptions are equal, beginning deposits generally produce a higher final balance.',
  },
  {
    question: 'Can I become a millionaire without initial savings?',
    answer:
      'Yes, it can be mathematically reachable through regular contributions and investment growth alone, depending on the deposit size, return assumption, and time horizon.',
  },
  {
    question: 'Is one million dollars enough to retire?',
    answer:
      'Retirement adequacy depends on living expenses, location, inflation, healthcare costs, retirement length, other income, and investment strategy. One million dollars is not universally enough or insufficient — it depends on personal circumstances.',
  },
];
