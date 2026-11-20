import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RECEIVABLES_TURNOVER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-rtr', label: 'What Is the Receivables Turnover Ratio?' },
  { id: 'definition', label: 'Receivables Turnover Ratio Definition' },
  { id: 'ar-explained', label: 'Accounts Receivable Explained' },
  { id: 'net-credit-sales', label: 'What Are Net Credit Sales?' },
  { id: 'ncs-formula', label: 'Net Credit Sales Formula' },
  { id: 'avg-ar', label: 'What Is Average Accounts Receivable?' },
  { id: 'avg-formula', label: 'Average Accounts Receivable Formula' },
  { id: 'rtr-formula', label: 'Accounts Receivable Turnover Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Receivables Turnover' },
  { id: 'worked-example', label: 'Complete Receivables Turnover Example' },
  { id: 'interpret', label: 'How to Interpret Receivables Turnover' },
  { id: 'good-ratio', label: 'What Is a Good Receivables Turnover Ratio?' },
  { id: 'high', label: 'High Receivables Turnover Ratio' },
  { id: 'low', label: 'Low Receivables Turnover Ratio' },
  { id: 'vs-dso', label: 'Receivables Turnover vs DSO' },
  { id: 'ccc', label: 'Receivables Turnover and the Cash Conversion Cycle' },
  { id: 'cash-flow', label: 'Receivables Turnover and Cash Flow' },
  { id: 'working-capital', label: 'Receivables Turnover and Working Capital' },
  { id: 'credit-policies', label: 'Credit Policies and Receivables Turnover' },
  { id: 'improve', label: 'How to Improve Receivables Turnover' },
  { id: 'aging', label: 'Accounts Receivable Aging' },
  { id: 'retail', label: 'Receivables Turnover in Retail' },
  { id: 'manufacturing', label: 'Receivables Turnover in Manufacturing' },
  { id: 'services', label: 'Receivables Turnover in Service Businesses' },
  { id: 'small-business', label: 'Receivables Turnover in Small Businesses' },
  { id: 'vs-inventory', label: 'Receivables Turnover vs Inventory Turnover' },
  { id: 'vs-payables', label: 'Receivables Turnover vs Payables Turnover' },
  { id: 'vs-revenue', label: 'Receivables Turnover vs Revenue' },
  { id: 'seasonal', label: 'Seasonal Changes and Receivables Turnover' },
  { id: 'mistakes', label: 'Common Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'rtr-faq', label: 'Frequently Asked Questions' },
];

export const RECEIVABLES_TURNOVER_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the receivables turnover ratio?',
    answer:
      'An activity ratio that compares net credit sales to average accounts receivable for a reporting period, expressed as times per period.',
  },
  {
    question: 'How do I calculate receivables turnover?',
    answer:
      'Divide net credit sales by average accounts receivable: (Opening AR + Closing AR) ÷ 2.',
  },
  {
    question: 'What is the accounts receivable turnover formula?',
    answer: 'RTR = Net Credit Sales ÷ Average Accounts Receivable.',
  },
  {
    question: 'What are net credit sales?',
    answer:
      'Credit sales after applicable returns, allowances, and discounts — excluding cash sales.',
  },
  {
    question: 'How do I calculate net credit sales?',
    answer:
      'Gross credit sales − applicable returns − allowances − discounts related to credit sales.',
  },
  {
    question: 'What is opening accounts receivable?',
    answer: 'The AR balance at the start of the reporting period.',
  },
  {
    question: 'What is closing accounts receivable?',
    answer: 'The AR balance at the end of the reporting period.',
  },
  {
    question: 'How do I calculate average accounts receivable?',
    answer: 'Average AR = (Opening AR + Closing AR) ÷ 2.',
  },
  {
    question: 'Why is average accounts receivable used?',
    answer:
      'A two-point average better represents the receivable balance that supported credit sales during the period than ending AR alone.',
  },
  {
    question: 'What does receivables turnover measure?',
    answer:
      'How many times net credit sales turn over average receivables during the period — a collection-activity indicator, not a profit measure.',
  },
  {
    question: 'What does a turnover ratio of 5 mean?',
    answer:
      'Net credit sales were about five times average AR during the period.',
  },
  {
    question: 'What does a turnover ratio of 10 mean?',
    answer:
      'Net credit sales were about ten times average AR — often faster collections or lower average balances, all else equal.',
  },
  {
    question: 'What is a good receivables turnover ratio?',
    answer:
      'It depends on industry terms, credit policy, and seasonality. Compare history and peers — there is no universal ideal.',
  },
  {
    question: 'Is a high receivables turnover ratio good?',
    answer:
      'Often associated with faster collections, but very high turnover can also reflect restrictive credit that limits sales.',
  },
  {
    question: 'Is a low receivables turnover ratio bad?',
    answer:
      'It may signal slow collections or long terms, but some industries normally operate with longer cycles.',
  },
  {
    question: 'Can receivables turnover be zero?',
    answer:
      'Yes — when net credit sales are zero and average AR is positive.',
  },
  {
    question: 'Can receivables turnover be negative?',
    answer:
      'Not in this calculator — negative sales or AR balances are rejected.',
  },
  {
    question: 'What happens if average accounts receivable is zero?',
    answer:
      'The ratio is undefined (division by zero). Do not display Infinity.',
  },
  {
    question: 'Why is the turnover ratio undefined?',
    answer:
      'Because average AR is zero, so Net Credit Sales ÷ Average AR cannot be computed.',
  },
  {
    question: 'What is the difference between receivables turnover and DSO?',
    answer:
      'Turnover is times per period; DSO is days. DSO ≈ Days in Period ÷ Turnover.',
  },
  {
    question: 'How do I calculate DSO from turnover?',
    answer:
      'DSO = Days in Period ÷ Receivables Turnover (use the matching period length).',
  },
  {
    question: 'How does receivables turnover affect cash flow?',
    answer:
      'Faster collection of credit sales typically improves operating cash timing, all else equal.',
  },
  {
    question: 'How does receivables turnover affect working capital?',
    answer:
      'Lower average AR for the same credit sales frees working capital tied up in receivables.',
  },
  {
    question: 'How can I improve receivables turnover?',
    answer:
      'Invoice promptly, clarify terms, follow up, resolve disputes, and apply disciplined credit checks.',
  },
  {
    question: 'How do payment terms affect turnover?',
    answer:
      'Longer terms usually raise average AR and lower turnover for similar credit sales.',
  },
  {
    question: 'How do overdue invoices affect turnover?',
    answer:
      'Overdue balances inflate average AR and typically reduce turnover.',
  },
  {
    question: 'Should cash sales be included?',
    answer: 'No — use net credit sales only.',
  },
  {
    question: 'Should sales returns be deducted?',
    answer:
      'Yes when they apply to credit sales and reduce net credit sales.',
  },
  {
    question: 'Is receivables turnover the same as revenue?',
    answer: 'No — turnover is a ratio; revenue is a currency amount.',
  },
  {
    question: 'Is receivables turnover the same as profitability?',
    answer: 'No — it does not measure profit or margins.',
  },
  {
    question: 'How often should receivables turnover be calculated?',
    answer:
      'As often as you review collections — monthly, quarterly, or annually with consistent periods.',
  },
  {
    question: 'Can I calculate monthly receivables turnover?',
    answer:
      'Yes — use monthly net credit sales and opening/closing AR for that month.',
  },
  {
    question: 'Can I calculate quarterly receivables turnover?',
    answer:
      'Yes — use quarterly net credit sales with quarter-start and quarter-end AR.',
  },
  {
    question: 'How do seasonal sales affect turnover?',
    answer:
      'Seasonality can distort two-point averages; more frequent AR observations may help.',
  },
  {
    question:
      'What is the difference between receivables turnover and inventory turnover?',
    answer:
      'Receivables turnover uses credit sales and AR; inventory turnover uses COGS and inventory.',
  },
  {
    question:
      'What is the difference between receivables turnover and payables turnover?',
    answer:
      'Receivables track customer collections; payables track supplier payment activity.',
  },
  {
    question: 'How does bad debt affect receivables turnover?',
    answer:
      'Write-offs reduce AR and can change averages and comparability across periods.',
  },
  {
    question: 'Can high turnover indicate restrictive credit policies?',
    answer:
      'Yes — very tight credit can raise turnover while limiting sales growth.',
  },
  {
    question: 'Why do turnover ratios differ between industries?',
    answer:
      'Payment terms, customer mix, and credit norms vary widely by sector.',
  },
  {
    question: 'What are the limitations of receivables turnover?',
    answer:
      'It is a period aggregate, not invoice-level behavior, and two-point averages can miss seasonality.',
  },
  {
    question:
      'What is the receivables turnover ratio if net credit sales are $100,000 and average accounts receivable is $20,000?',
    answer: '100,000 ÷ 20,000 = 5 times.',
  },
  {
    question:
      'What is average accounts receivable if opening AR is $20,000 and closing AR is $30,000?',
    answer: '(20,000 + 30,000) ÷ 2 = $25,000.',
  },
  {
    question:
      'What is DSO if the receivables turnover ratio is 10 over a 365-day year?',
    answer: '365 ÷ 10 = 36.5 days.',
  },
  {
    question:
      'What is the receivables turnover ratio if credit sales are $500,000 and average AR is $25,000?',
    answer: '500,000 ÷ 25,000 = 20 times.',
  },
  {
    question: 'What happens when average accounts receivable is zero?',
    answer:
      'The turnover ratio is undefined — do not display Infinity or a false zero.',
  },
];
