import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NET_INCOME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ni', label: 'What Is Net Income?' },
  { id: 'formula', label: 'Net Income Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Net Income' },
  { id: 'gross-profit', label: 'Gross Profit Calculation' },
  { id: 'operating-income', label: 'Operating Income Calculation' },
  { id: 'ebt', label: 'Earnings Before Tax' },
  { id: 'income-tax', label: 'Income Tax Calculation' },
  { id: 'niat', label: 'Net Income After Tax' },
  { id: 'worked-example', label: 'Complete Net Income Example' },
  { id: 'vs-gross', label: 'Net Income vs Gross Profit' },
  { id: 'vs-operating', label: 'Net Income vs Operating Income' },
  { id: 'vs-ebit', label: 'Net Income vs EBIT' },
  { id: 'vs-ebitda', label: 'Net Income vs EBITDA' },
  { id: 'vs-revenue', label: 'Net Income vs Revenue' },
  { id: 'vs-cash', label: 'Net Income vs Cash Flow' },
  { id: 'margin', label: 'What Is Net Profit Margin?' },
  { id: 'why-matters', label: 'Why Net Income Matters' },
  { id: 'improve', label: 'How to Improve Net Income' },
  { id: 'negative', label: 'What Causes Negative Net Income?' },
  { id: 'income-statement', label: 'How to Read an Income Statement' },
  { id: 'financial-statements', label: 'Net Income in Financial Statements' },
  { id: 'retained', label: 'Net Income and Retained Earnings' },
  { id: 'valuation', label: 'Net Income and Business Valuation' },
  { id: 'roe', label: 'Net Income and Return on Equity' },
  { id: 'eps', label: 'Net Income and Earnings Per Share' },
  { id: 'mistakes', label: 'Common Net Income Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'ni-faq', label: 'Frequently Asked Questions' },
];

export const NET_INCOME_FAQS: readonly FAQItem[] = [
  {
    question: 'What is net income?',
    answer:
      'Net income (net profit / bottom line) is profit remaining after cost of sales, operating expenses, interest, and income taxes under a given reporting model.',
  },
  {
    question: 'What is the net income formula?',
    answer:
      'In this calculator: Net Income = Revenue − COGS − Operating Expenses − Interest − Taxes.',
  },
  {
    question: 'How do I calculate net income?',
    answer:
      'Compute gross profit, subtract operating expenses and interest to get EBT, estimate taxes on positive EBT, then subtract taxes from EBT.',
  },
  {
    question: 'What is net income after taxes?',
    answer: 'The bottom-line result after deducting estimated (or actual) income tax expense from pretax income.',
  },
  {
    question: 'What is net income before taxes?',
    answer:
      'Earnings before tax (EBT / pretax income) — here operating income minus interest.',
  },
  {
    question: 'What is the difference between net income and revenue?',
    answer:
      'Revenue is top-line sales. Net income is what remains after expenses and taxes.',
  },
  {
    question: 'What is the difference between net income and gross profit?',
    answer:
      'Gross profit is revenue minus cost of sales only. Net income also deducts operating costs, interest, and taxes.',
  },
  {
    question: 'What is the difference between operating income and net income?',
    answer:
      'Operating income is before financing costs and taxes. Net income is after interest and taxes in this model.',
  },
  {
    question: 'What is the difference between EBIT and net income?',
    answer:
      'EBIT is operating earnings before interest and taxes. Net income subtracts interest and taxes (and may include other items in full statements).',
  },
  {
    question: 'What is the difference between EBITDA and net income?',
    answer:
      'EBITDA adds back D&A to operating earnings and still excludes interest and taxes. Net income is after those deductions.',
  },
  {
    question: 'Is net income the same as profit?',
    answer:
      'Often yes in everyday language — specifically profit after the costs and taxes included in the model.',
  },
  {
    question: 'Is net income the same as cash flow?',
    answer:
      'No. Accrual accounting, working capital, and financing/investing cash flows can diverge from net income.',
  },
  {
    question: 'Can net income be negative?',
    answer: 'Yes. A net loss means expenses (and taxes, if any) exceed revenue under the model.',
  },
  {
    question: 'What causes a net loss?',
    answer:
      'Low revenue, high COGS or operating costs, heavy interest, or other expenses that overwhelm sales.',
  },
  {
    question: 'What happens if revenue is zero?',
    answer:
      'Net income can still be a loss from expenses. Net profit margin is undefined.',
  },
  {
    question: 'Does net income include taxes?',
    answer: 'Yes — this calculator’s net income is after estimated income taxes.',
  },
  {
    question: 'Does net income include interest expenses?',
    answer: 'Yes — interest is deducted before taxes in the pretax income step.',
  },
  {
    question: 'How do I calculate gross profit?',
    answer: 'Gross Profit = Revenue − Cost of Sales.',
  },
  {
    question: 'How do I calculate operating income?',
    answer: 'Operating Income = Gross Profit − Operating Expenses.',
  },
  {
    question: 'How do I calculate earnings before tax?',
    answer: 'EBT = Operating Income − Interest (in this simplified model).',
  },
  {
    question: 'How do I calculate income taxes from EBT?',
    answer:
      'Estimated Taxes = max(EBT, 0) × (Tax Rate ÷ 100). No automatic refund on pretax loss.',
  },
  {
    question: 'What happens when earnings before tax are negative?',
    answer:
      'Estimated taxes are treated as zero here. Net income equals the pretax loss.',
  },
  {
    question: 'What is net profit margin?',
    answer: 'Net Income ÷ Revenue × 100 when revenue is positive.',
  },
  {
    question: 'How do I calculate net profit margin?',
    answer: 'Divide net income after taxes by revenue and multiply by 100.',
  },
  {
    question: 'What is a good net profit margin?',
    answer:
      'It varies by industry, scale, and cycle. Compare peers and history rather than a universal target.',
  },
  {
    question: 'Why is net income important?',
    answer:
      'It summarizes period profitability for owners, lenders, and analysts — alongside cash flow and balance-sheet health.',
  },
  {
    question: 'How can a business improve net income?',
    answer:
      'Grow profitable revenue, reduce COGS and operating waste, manage financing costs, and plan taxes within applicable rules.',
  },
  {
    question: 'How is net income shown on the income statement?',
    answer:
      'Usually as the final line after revenues, expenses, and tax expense for the reporting period.',
  },
  {
    question: 'What is the relationship between net income and retained earnings?',
    answer:
      'Profits generally increase retained earnings; dividends and some adjustments reduce them.',
  },
  {
    question: 'How does net income affect shareholder equity?',
    answer:
      'Through retained earnings and related equity accounts, holding other equity transactions constant.',
  },
  {
    question: 'How does net income affect earnings per share?',
    answer:
      'Basic EPS typically uses net income attributable to common shareholders divided by weighted-average shares.',
  },
  {
    question: 'What is the difference between net income and taxable income?',
    answer:
      'Book net income follows accounting rules; taxable income follows tax law. They often differ.',
  },
  {
    question: 'Can a business have positive revenue but negative net income?',
    answer: 'Yes — costs and taxes can exceed sales.',
  },
  {
    question: 'Can a company have positive net income but negative cash flow?',
    answer:
      'Yes — for example when receivables grow, inventory builds, or debt is repaid.',
  },
  {
    question: 'How do operating expenses affect net income?',
    answer:
      'Higher operating expenses reduce operating income, EBT, and usually net income.',
  },
  {
    question:
      'What is net income if revenue is $100,000 and total expenses including taxes are $75,000?',
    answer: 'Net Income = 100,000 − 75,000 = $25,000.',
  },
  {
    question: 'What is net income if EBT is $200,000 and the tax rate is 30%?',
    answer: 'Taxes = $60,000; Net Income = $140,000.',
  },
  {
    question: 'Can net income be negative?',
    answer:
      'Yes. Example: $100,000 revenue and $130,000 total expenses with $0 tax → net loss of $30,000.',
  },
];
