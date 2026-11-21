import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AVERAGE_RETURN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-average-return', label: 'What is average return?' },
  { id: 'what-is-arr', label: 'What is average rate of return?' },
  { id: 'what-is-cumulative', label: 'What is cumulative return?' },
  { id: 'average-vs-cumulative', label: 'Average return vs. cumulative return' },
  { id: 'cash-flow-method', label: 'How to calculate average return based on cash flow' },
  { id: 'average-cumulative-method', label: 'How to calculate average and cumulative return' },
  { id: 'time-weighted', label: 'What is the time-weighted rate of return?' },
  { id: 'money-weighted', label: 'What is the money-weighted rate of return?' },
  { id: 'limitations', label: 'Limitations of average return calculations' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'average-return-faq', label: 'Frequently asked questions' },
];

export const AVERAGE_RETURN_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a good average return on investment?',
    answer:
      'It depends on risk, asset class, horizon, inflation, fees, and objectives. There is no universal “good” percentage that fits every investor or market.',
  },
  {
    question: 'How do you calculate average return?',
    answer:
      'Choose a methodology: arithmetic average of annualized period returns, money-weighted XIRR with dated cash flows, geometric/cumulative compounding, or time-weighted linking. This calculator supports cash-flow XIRR and arithmetic average of annualized period returns plus cumulative compounding.',
  },
  {
    question: 'What is the difference between average return and cumulative return?',
    answer:
      'Average return (here) is the arithmetic mean of each period’s annualized return. Cumulative return compounds the period returns: ∏(1+Ri) − 1.',
  },
  {
    question: 'Can average return be negative?',
    answer:
      'Yes. A negative average or cumulative return means losses under the selected methodology.',
  },
  {
    question: 'What is an annualized return?',
    answer:
      'An annualized return expresses performance as an equivalent yearly rate, for example (1+R)^(12/M) − 1 for a period return R over M months.',
  },
  {
    question: 'What is money-weighted return?',
    answer:
      'A money-weighted return (XIRR-style) reflects the size and timing of deposits and withdrawals as well as starting and ending balances.',
  },
  {
    question: 'What is time-weighted return?',
    answer:
      'Time-weighted return links subperiod returns to reduce the impact of external cash-flow timing; often used to compare managers. It differs from the money-weighted cash-flow section in this tool.',
  },
  {
    question: 'Why is cumulative return different from average return?',
    answer:
      'Cumulative return compounds sequential results. Adding percentages (10% − 2% + 15% = 23%) is not the same as 1.10 × 0.98 × 1.15 − 1 = 24.07%.',
  },
  {
    question: 'Can cumulative return be negative?',
    answer: 'Yes. A cumulative return below zero means the compounded path lost value overall.',
  },
  {
    question: 'Do deposits and withdrawals affect investment return?',
    answer:
      'They affect money-weighted return because they change invested capital over time. They are not investment gains or losses themselves.',
  },
  {
    question: 'What is XIRR?',
    answer:
      'XIRR finds an annualized internal rate of return for cash flows on different dates using a day-count convention (this tool uses a 365-day year).',
  },
  {
    question: 'Does average return account for inflation?',
    answer:
      'Not automatically. Results here are nominal unless you adjust inputs for inflation separately.',
  },
];
