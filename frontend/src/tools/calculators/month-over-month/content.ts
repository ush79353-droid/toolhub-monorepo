import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MONTH_OVER_MONTH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-mom', label: 'What Does Month-over-Month Mean?' },
  { id: 'mom-formula', label: 'Month-over-Month Formula' },
  { id: 'how-to-calculate-mom', label: 'How to Calculate MoM Growth' },
  { id: 'mom-example', label: 'Month-over-Month Calculation Example' },
  { id: 'what-is-cmgr', label: 'What Is Compounding Monthly Growth Rate?' },
  { id: 'cmgr-formula', label: 'CMGR Formula' },
  { id: 'cmgr-example', label: 'CMGR Calculation Example' },
  { id: 'mom-vs-cmgr', label: 'MoM vs CMGR' },
  { id: 'what-is-qoq', label: 'What Is Quarter-over-Quarter Growth?' },
  { id: 'qoq-formula', label: 'Quarter-over-Quarter Formula' },
  { id: 'what-is-yoy', label: 'What Is Year-over-Year Growth?' },
  { id: 'yoy-formula', label: 'Year-over-Year Formula' },
  { id: 'compare-periods', label: 'MoM vs QoQ vs YoY' },
  { id: 'revenue-growth', label: 'Month-over-Month Revenue Growth' },
  { id: 'sales-growth', label: 'Month-over-Month Sales Growth' },
  { id: 'customer-growth', label: 'Month-over-Month Customer Growth' },
  { id: 'saas-growth', label: 'MoM Growth in SaaS Businesses' },
  { id: 'interpret-signs', label: 'Interpreting Positive and Negative MoM' },
  { id: 'fluctuations', label: 'Why MoM Growth Fluctuates' },
  { id: 'seasonality', label: 'Seasonality and MoM Growth' },
  { id: 'why-yoy', label: 'Why Year-over-Year Growth Is Useful' },
  { id: 'pct-vs-points', label: 'MoM vs Percentage Points' },
  { id: 'improve-mom', label: 'How to Improve MoM Growth' },
  { id: 'mistakes', label: 'Common MoM Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations of MoM Analysis' },
  { id: 'mom-faq', label: 'Frequently Asked Questions' },
];

export const MONTH_OVER_MONTH_FAQS: readonly FAQItem[] = [
  {
    question: 'What is month-over-month growth?',
    answer:
      'Month-over-month (MoM) growth is the percentage change in a metric between one month and the next.',
  },
  {
    question: 'What does MoM stand for?',
    answer: 'MoM stands for Month-over-Month.',
  },
  {
    question: 'What is the month-over-month growth formula?',
    answer: 'MoM = ((Month 2 − Month 1) ÷ Month 1) × 100.',
  },
  {
    question: 'How do I calculate MoM growth?',
    answer:
      'Subtract the earlier month from the later month, divide by the earlier month, and multiply by 100.',
  },
  {
    question: 'How do I calculate a MoM percentage decrease?',
    answer:
      'Use the same formula. If Month 2 is lower than Month 1 with a positive baseline, MoM is negative.',
  },
  {
    question: 'What does 20% MoM growth mean?',
    answer:
      'The metric rose 20% versus the prior month, for example, 50,000 → 60,000.',
  },
  {
    question: 'Can MoM growth be negative?',
    answer: 'Yes. Negative MoM means the current month is lower than the prior month.',
  },
  {
    question: 'Can MoM growth be zero?',
    answer: 'Yes, when both months have the same nonzero value.',
  },
  {
    question: 'What happens if the previous month has a value of zero?',
    answer:
      'MoM is undefined because the formula divides by zero. This calculator shows MoM as unavailable.',
  },
  {
    question: 'What is a good MoM growth rate?',
    answer:
      'There is no universal benchmark. Context depends on industry, stage, seasonality, and the metric.',
  },
  {
    question: 'Is a higher MoM percentage always better?',
    answer:
      'No. Rising expenses or churn can show positive MoM while harming the business.',
  },
  {
    question: 'What is Compounding Monthly Growth Rate?',
    answer:
      'CMGR is the constant monthly rate that would compound an initial value into a final value over n months.',
  },
  {
    question: 'How do I calculate CMGR?',
    answer: 'CMGR = ((Final ÷ Initial)^(1 ÷ months) − 1) × 100.',
  },
  {
    question: 'What is the difference between MoM and CMGR?',
    answer:
      'MoM compares two consecutive months. CMGR is an equivalent compounded monthly rate across a multi-month span.',
  },
  {
    question: 'What is the difference between CMGR and CAGR?',
    answer:
      'Both use the same compounding structure. CMGR uses monthly periods; CAGR typically uses annual periods.',
  },
  {
    question: 'What does negative CMGR mean?',
    answer:
      'The final value is below the initial value: an equivalent constant monthly decline.',
  },
  {
    question: 'Can CMGR be calculated with a zero starting value?',
    answer: 'No. The standard CMGR model requires a positive initial value.',
  },
  {
    question: 'What is quarter-over-quarter growth?',
    answer:
      'QoQ growth is the percentage change between two consecutive quarters.',
  },
  {
    question: 'How do I calculate QoQ growth?',
    answer: 'QoQ = ((Current quarter − Previous quarter) ÷ Previous quarter) × 100.',
  },
  {
    question: 'What is year-over-year growth?',
    answer:
      'YoY growth compares corresponding periods one year apart to reduce some seasonal noise.',
  },
  {
    question: 'How do I calculate YoY growth?',
    answer: 'YoY = ((Current year − Previous year) ÷ Previous year) × 100.',
  },
  {
    question: 'What is the difference between MoM and YoY?',
    answer:
      'MoM is short-term consecutive months; YoY compares year-apart periods and can mute some seasonality.',
  },
  {
    question: 'Is MoM growth better than YoY growth?',
    answer:
      'Neither is universally better. MoM is timely; YoY is often more seasonality-aware.',
  },
  {
    question: 'Why does monthly growth fluctuate?',
    answer:
      'Campaigns, seasonality, holidays, launches, economic conditions, and reporting differences all move MoM.',
  },
  {
    question: 'How does seasonality affect MoM growth?',
    answer:
      'Peak seasons followed by quieter months can show negative MoM without a structural decline.',
  },
  {
    question: 'How do SaaS businesses calculate monthly growth?',
    answer:
      'Common metrics include MRR, customers, active users, churn, and expansion; each with its own MoM.',
  },
  {
    question: 'How do I calculate monthly revenue growth?',
    answer: 'Apply MoM to comparable monthly revenue totals.',
  },
  {
    question: 'How do I calculate monthly customer growth?',
    answer: 'Apply MoM to customer or active-user counts for consecutive months.',
  },
  {
    question: 'How do I calculate monthly sales growth?',
    answer: 'Apply MoM to comparable sales units or sales revenue.',
  },
  {
    question: 'Can I calculate MoM growth using negative numbers?',
    answer:
      'Yes with the signed formula, but interpret carefully; improving from −100 to −50 yields −50% MoM.',
  },
  {
    question: 'What is the difference between percentage growth and percentage-point change?',
    answer:
      '4% → 5% is +1 percentage point, but relative growth is (5−4)/4 × 100 = 25%.',
  },
  {
    question: 'How do I calculate a future value from monthly growth?',
    answer: 'V₂ = V₁ × (1 + g/100) for a single MoM step.',
  },
  {
    question: 'How many months should I use to calculate CMGR?',
    answer:
      'Use elapsed observation intervals (e.g. Jan→Jan next year = 12; Jan→Dec same year = 11).',
  },
  {
    question: 'Can YoY growth be positive when MoM growth is negative?',
    answer: 'Yes: different windows can disagree in the same month.',
  },
  {
    question: 'Can MoM growth be calculated for expenses?',
    answer:
      'Yes. Falling expenses show negative MoM, which may be favorable depending on context.',
  },
  {
    question: 'What is MoM growth if revenue increases from $80,000 to $100,000?',
    answer: '(100,000 − 80,000) ÷ 80,000 × 100 = +25%.',
  },
  {
    question:
      'What is MoM change if website traffic decreases from 50,000 to 40,000 visits?',
    answer: '(40,000 − 50,000) ÷ 50,000 × 100 = −20%.',
  },
  {
    question: 'What is CMGR if a company’s revenue doubles over 12 months?',
    answer: 'CMGR = (2^(1/12) − 1) × 100 ≈ 5.95% per month.',
  },
];
