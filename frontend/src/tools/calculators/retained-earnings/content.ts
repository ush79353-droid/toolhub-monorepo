import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RETAINED_EARNINGS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-re', label: 'What Are Retained Earnings?' },
  { id: 'definition', label: 'Retained Earnings Definition' },
  { id: 'net-income', label: 'What Is Net Income?' },
  { id: 'dividends', label: 'What Are Dividends?' },
  { id: 'payout-ratio', label: 'What Is the Dividend Payout Ratio?' },
  { id: 'payout-formula', label: 'Dividend Payout Ratio Formula' },
  { id: 'retention', label: 'Retention Ratio Formula' },
  { id: 'period-formula', label: 'Retained Earnings Formula' },
  { id: 'cumulative', label: 'Cumulative Retained Earnings Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Retained Earnings' },
  { id: 'worked-example', label: 'Retained Earnings Calculation Example' },
  { id: 'reps', label: 'What Is Retained Earnings per Share?' },
  { id: 'reps-formula', label: 'Retained Earnings per Share Formula' },
  { id: 'vs-ni', label: 'Retained Earnings vs Net Income' },
  { id: 'vs-revenue', label: 'Retained Earnings vs Revenue' },
  { id: 'vs-cash', label: 'Retained Earnings vs Cash' },
  { id: 'vs-equity', label: 'Retained Earnings vs Shareholders Equity' },
  { id: 'vs-eps', label: 'Retained Earnings vs Earnings per Share' },
  { id: 'vs-dividends', label: 'Retained Earnings vs Dividends' },
  { id: 'positive', label: 'Positive Retained Earnings' },
  { id: 'negative', label: 'Negative Retained Earnings' },
  { id: 'zero', label: 'Can Retained Earnings Be Zero?' },
  { id: 'good-balance', label: 'What Is a Good Retained Earnings Balance?' },
  { id: 'growth', label: 'Retained Earnings and Business Growth' },
  { id: 'reinvestment', label: 'Retained Earnings and Reinvestment' },
  { id: 'policies', label: 'Retained Earnings and Dividend Policies' },
  { id: 'small-business', label: 'Retained Earnings in Small Businesses' },
  { id: 'corporations', label: 'Retained Earnings in Large Corporations' },
  { id: 'statements', label: 'Retained Earnings in Financial Statements' },
  { id: 'statement-of-re', label: 'Statement of Retained Earnings' },
  { id: 'roe', label: 'Retained Earnings and Return on Equity' },
  { id: 'roi', label: 'Retained Earnings and Return on Investment' },
  { id: 'stability', label: 'Retained Earnings and Financial Stability' },
  { id: 'mistakes', label: 'Common Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations' },
  { id: 're-faq', label: 'Frequently Asked Questions' },
];

export const RETAINED_EARNINGS_FAQS: readonly FAQItem[] = [
  {
    question: 'What are retained earnings?',
    answer:
      'Profits kept in the business after dividends. This calculator shows the current-period amount (earnings − dividends), which differs from the cumulative equity balance.',
  },
  {
    question: 'How do I calculate retained earnings?',
    answer:
      'For the period: Retained Earnings = Net Income − Dividends. Or Earnings × (1 − payout%).',
  },
  {
    question: 'What is the retained earnings formula?',
    answer:
      'Period: RE = NI − Dividends. Cumulative: Ending RE = Beginning RE + NI − Dividends.',
  },
  {
    question: 'What is net income?',
    answer:
      'Profit after expenses, interest, and taxes — not revenue, EBIT, or EBITDA.',
  },
  {
    question: 'What are dividends?',
    answer:
      'Distributions of earnings (or reserves) to shareholders that reduce retained earnings.',
  },
  {
    question: 'What is the dividend payout ratio?',
    answer:
      'Dividends ÷ Net Income × 100 when net income is positive. Enter 30 for 30%.',
  },
  {
    question: 'How do I calculate dividends distributed?',
    answer: 'Dividends = Earnings × (Payout Ratio ÷ 100) when earnings > 0.',
  },
  {
    question: 'What is the retention ratio?',
    answer: 'Retention % = 100 − Dividend payout %. Example: 30% payout → 70% retention.',
  },
  {
    question: 'What is retained earnings per share?',
    answer:
      'Current-period retained earnings ÷ shares outstanding. Not the same as EPS.',
  },
  {
    question: 'How do I calculate retained earnings per share?',
    answer: 'REPS = Retained Earnings ÷ Outstanding Shares.',
  },
  {
    question: 'Can retained earnings be negative?',
    answer:
      'Yes — from losses, or when dividends exceed current-period earnings (payout > 100%).',
  },
  {
    question: 'Can retained earnings be zero?',
    answer:
      'Yes for the period when payout is 100%. Cumulative RE can also be zero historically.',
  },
  {
    question: 'What does positive retained earnings mean?',
    answer:
      'Some current-period earnings were not distributed as dividends.',
  },
  {
    question: 'Are retained earnings the same as revenue?',
    answer: 'No — revenue is sales; retained earnings are after expenses and dividends.',
  },
  {
    question: 'Are retained earnings the same as profit?',
    answer:
      'Related but different: profit (net income) becomes retained earnings only after dividends.',
  },
  {
    question: 'Are retained earnings the same as cash?',
    answer:
      'No — RE is an equity account, not a bank balance.',
  },
  {
    question: 'Where are retained earnings reported?',
    answer: 'Within shareholders’ equity on the balance sheet / statement of equity.',
  },
  {
    question: 'Are retained earnings part of shareholders’ equity?',
    answer: 'Yes.',
  },
  {
    question: 'What reduces retained earnings?',
    answer: 'Dividends, net losses, and certain equity adjustments/write-downs.',
  },
  {
    question: 'What increases retained earnings?',
    answer: 'Net income retained in the business (not paid as dividends).',
  },
  {
    question: 'Can a company pay dividends with negative earnings?',
    answer:
      'Sometimes, using reserves — but a conventional payout % on a loss is not meaningful. This tool does not infer dividends from losses.',
  },
  {
    question: 'Can dividend payout exceed 100%?',
    answer:
      'Yes for positive earnings — dividends can exceed current-period NI, producing negative period RE.',
  },
  {
    question: 'How do retained earnings affect business growth?',
    answer:
      'Retained profits can fund expansion without new external equity, subject to cash and strategy.',
  },
  {
    question: 'Why do businesses retain earnings?',
    answer:
      'To reinvest, strengthen equity, buffer losses, or fund growth and debt capacity.',
  },
  {
    question: 'What is a good retained earnings balance?',
    answer:
      'It depends on industry, stage, and dividend policy — no universal target.',
  },
  {
    question: 'What is the difference between retained earnings and net income?',
    answer:
      'Net income is period profit; retained earnings keep what remains after dividends (and accumulate over time).',
  },
  {
    question: 'What is the difference between retained earnings and EPS?',
    answer:
      'EPS allocates earnings to shares; REPS allocates period retained earnings to shares.',
  },
  {
    question: 'Do share buybacks reduce retained earnings?',
    answer:
      'Accounting treatment varies by jurisdiction; buybacks often reduce equity but are not modeled here as dividends.',
  },
  {
    question: 'Are retained earnings taxable?',
    answer:
      'Corporate tax usually applies to taxable income when earned; RE itself is an equity residual, not a separate tax event in this model.',
  },
  {
    question: 'What happens when dividends exceed earnings?',
    answer:
      'Current-period RE is negative; the firm may draw on accumulated RE or other funding.',
  },
  {
    question: 'How do I calculate cumulative retained earnings?',
    answer:
      'Ending RE = Beginning RE + Net Income − Dividends (plus adjustments).',
  },
  {
    question: 'How do I calculate ending retained earnings?',
    answer: 'Same cumulative formula: beginning + NI − dividends.',
  },
  {
    question: 'What are beginning retained earnings?',
    answer:
      'The accumulated RE balance at the start of the period — not included in this screenshot calculator.',
  },
  {
    question: 'How does a net loss affect retained earnings?',
    answer:
      'A loss reduces cumulative RE. This payout-based tool does not apply a % to losses.',
  },
  {
    question: 'How do retained earnings affect shareholders’ equity?',
    answer: 'RE is a major component of equity for many profitable firms.',
  },
  {
    question: 'Can retained earnings be used for expansion?',
    answer:
      'Economically yes if cash and capital plans allow — RE is not automatically spendable cash.',
  },
  {
    question: 'Can retained earnings fund dividends?',
    answer:
      'Accumulated RE supports dividend capacity under corporate law, subject to cash and rules.',
  },
  {
    question: 'Does high retained earnings mean a company has a lot of cash?',
    answer: 'No — assets may be inventory, PP&E, or receivables instead of cash.',
  },
  {
    question: 'How do retained earnings affect financial statements?',
    answer:
      'They appear in equity and roll forward on the statement of retained earnings / equity.',
  },
  {
    question: 'What are the limitations of a retained earnings calculator?',
    answer:
      'Period RE ≠ cash; needs beginning RE for cumulative balances; payout % needs positive NI.',
  },
  {
    question:
      'What are retained earnings if a company earns $100,000 and distributes $30,000 in dividends?',
    answer: '100,000 − 30,000 = $70,000.',
  },
  {
    question:
      'What are retained earnings if net income is $500,000 and the payout ratio is 20%?',
    answer: 'Dividends $100,000; retained earnings $400,000.',
  },
  {
    question:
      'What are retained earnings per share if retained earnings are $200,000 and outstanding shares total 10,000?',
    answer: '200,000 ÷ 10,000 = $20 per share.',
  },
  {
    question:
      'What are ending retained earnings if beginning retained earnings are $1,000,000, net income is $300,000, and dividends are $100,000?',
    answer: '1,000,000 + 300,000 − 100,000 = $1,200,000.',
  },
  {
    question:
      'What happens if a company pays out 120% of its $100,000 earnings?',
    answer:
      'Dividends $120,000; current-period retained earnings −$20,000.',
  },
];
