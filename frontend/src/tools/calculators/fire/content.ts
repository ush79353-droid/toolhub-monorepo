import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FIRE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-fire', label: 'What is the FIRE early retirement movement?' },
  { id: 'fire-formula', label: 'How to calculate your FIRE number' },
  { id: 'fire-example', label: 'FIRE calculator real-life example' },
  { id: 'reach-faster', label: 'How to reach financial independence faster' },
  { id: 'understanding-results', label: 'Understanding your FIRE results' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'fire-faq', label: 'Frequently asked questions' },
];

export const FIRE_FAQS: readonly FAQItem[] = [
  {
    question: 'What are the risks of retiring early through the FIRE movement?',
    answer:
      'Early retirement portfolios face market crashes, inflation, healthcare costs, longevity risk, sequence-of-returns risk, and unexpected expenses. A plan that works on average can still fail in a bad sequence of early withdrawals.',
  },
  {
    question: 'What are the best tips for retiring earlier?',
    answer:
      'Raise income, cut non-essential spending, increase the savings rate, invest consistently, avoid high-interest debt, and build optional income streams. Review the plan as markets and life change.',
  },
  {
    question: 'Is $800,000 enough for FIRE?',
    answer:
      'It depends on annual expenses, withdrawal rate, inflation, returns, and personal circumstances. Under a traditional 4% illustration, $800,000 × 0.04 ≈ $32,000 of initial annual withdrawal — not a guarantee the portfolio lasts forever.',
  },
  {
    question: "Can I retire early if I don't have a high income?",
    answer:
      'Yes, for some households. A high savings rate, controlled expenses, gradual income growth, longer timelines, or a leaner retirement lifestyle can still produce financial independence.',
  },
  {
    question: 'How much should I save to retire early?',
    answer:
      'Start from annual retirement expenses and a withdrawal-rate assumption (for example 4% → expenses × 25). Then solve for the annual contribution needed given current savings, returns, and years until retirement.',
  },
  {
    question: 'What is the 4% rule in FIRE?',
    answer:
      'A historical planning guideline suggesting an initial 4% withdrawal (adjusted for inflation) may sustain a diversified portfolio for a long retirement. It is a rule of thumb with real limitations — market conditions, fees, taxes, and spending flexibility matter.',
  },
  {
    question: 'What is a good savings rate for FIRE?',
    answer:
      'Higher savings rates generally shorten the path to independence, but no single percentage fits everyone. Your rate must fit income, expenses, risk tolerance, and timeline.',
  },
  {
    question: 'What is the difference between Lean FIRE and Fat FIRE?',
    answer:
      'Lean FIRE targets a frugal retirement budget and a smaller portfolio. Fat FIRE assumes higher annual spending and therefore a much larger FIRE number. Traditional FIRE sits between them.',
  },
  {
    question: 'Does inflation affect my FIRE number?',
    answer:
      'Yes. Future living costs usually rise, so this calculator can inflate today’s expenses to retirement-year dollars before applying a withdrawal rate or duration model.',
  },
  {
    question: 'What happens if my investments do not reach my FIRE target?',
    answer:
      'Options include saving more, spending less, delaying retirement, adjusting the withdrawal rate, or revisiting return assumptions. The scenario comparison helps stress-test different returns.',
  },
];
