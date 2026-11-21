import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DEFENSIVE_INTERVAL_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'introduction', label: 'Defensive Interval Ratio Calculator' },
    { id: 'definition', label: 'What Is the Defensive Interval Ratio?' },
    { id: 'formula', label: 'Defensive Interval Ratio Formula' },
    { id: 'defensive-assets', label: 'What Are Defensive Assets?' },
    { id: 'daily-expenditure', label: 'Average Daily Cash Expenditure' },
    { id: 'example', label: 'Step-by-Step Calculation Example' },
    { id: 'how-to-use', label: 'How to Use the Calculator' },
    { id: 'interpret', label: 'How to Interpret DIR' },
    { id: 'importance', label: 'Why DIR Matters' },
    { id: 'vs-current', label: 'DIR vs Current Ratio' },
    { id: 'vs-quick', label: 'DIR vs Quick Ratio' },
    { id: 'vs-cash', label: 'DIR vs Cash Ratio' },
    { id: 'limitations', label: 'Limitations' },
    { id: 'improve', label: 'How to Improve DIR' },
    { id: 'related', label: 'Related Calculators' },
    { id: 'dir-faq', label: 'Frequently Asked Questions' },
  ];

export const DEFENSIVE_INTERVAL_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the defensive interval ratio?',
    answer:
      'The defensive interval ratio (DIR) estimates how many days a company can cover average daily cash operating expenditures using qualifying defensive assets (cash, marketable securities, and collectible receivables), without relying on new operating inflows or financing.',
  },
  {
    question: 'What is the defensive interval ratio formula?',
    answer:
      'DIR = Defensive Assets ÷ Average Daily Cash Expenditure. Expanded: DIR = (Cash + Marketable Securities + Accounts Receivable) ÷ ((Operating Expenses − Non-Cash Charges) ÷ 365).',
  },
  {
    question: 'How do you calculate the defensive interval ratio?',
    answer:
      'Sum defensive assets, subtract non-cash charges from annual operating expenses, divide that cash expenditure by 365 to get a daily figure, then divide defensive assets by daily cash expenditure.',
  },
  {
    question: 'What does a defensive interval ratio of 160 days mean?',
    answer:
      'Under the inputs used, qualifying defensive assets could cover about 160 days of average cash operating spending. It does not guarantee the firm can operate for 160 days under all real-world conditions.',
  },
  {
    question: 'Is a higher defensive interval ratio better?',
    answer:
      'A higher DIR often indicates longer coverage from liquid defensive assets, which can support resilience. Whether that is “better” depends on opportunity cost of idle liquidity, industry norms, and overall strategy.',
  },
  {
    question: 'What is a good defensive interval ratio?',
    answer:
      'There is no universal good DIR. Benchmarks vary by industry, seasonality, access to credit, and cash-flow volatility. Avoid fixed rules such as “above 90 days is always healthy.”',
  },
  {
    question: 'Can the defensive interval ratio be zero?',
    answer:
      'Yes. If defensive assets are zero while daily cash expenditure is positive, DIR is zero days. That signals no measured liquid coverage from the included asset set.',
  },
  {
    question: 'Can the defensive interval ratio be negative?',
    answer:
      'Not in the standard formulation used here. Asset and expense inputs are constrained to non-negative values, so DIR is zero or positive when calculable.',
  },
  {
    question: 'What are defensive assets?',
    answer:
      'In this calculator, defensive assets are cash and cash equivalents, marketable securities, and collectible accounts receivable; assets expected to convert into cash relatively quickly for operating needs.',
  },
  {
    question: 'Are accounts receivable included in the defensive interval ratio?',
    answer:
      'Yes, collectible receivables are typically included. Use amounts reasonably expected to convert into cash; doubtful or restricted receivables can overstate the ratio.',
  },
  {
    question: 'Is inventory included in defensive assets?',
    answer:
      'No. Inventory is generally excluded from the standard defensive asset subtotal because it is less liquid and may not convert into cash on the same timeline as cash, securities, or receivables.',
  },
  {
    question: 'Why are non-cash expenses excluded?',
    answer:
      'Depreciation, amortization, and similar non-cash charges do not require the same current-period cash outflows as cash operating costs. Subtracting them approximates cash operating expenditure when they were included in operating expenses.',
  },
  {
    question: 'How do you calculate daily cash expenditure?',
    answer:
      'Daily cash expenditure = (Annual operating expenses − Annual non-cash charges) ÷ 365. This calculator uses a 365-day year and does not silently switch to 360 days.',
  },
  {
    question:
      'What is the difference between defensive interval ratio and current ratio?',
    answer:
      'Current ratio compares current assets to current liabilities. DIR measures days of cash operating expense coverage from selected liquid assets and does not use current liabilities in the primary formula.',
  },
  {
    question:
      'What is the difference between defensive interval ratio and quick ratio?',
    answer:
      'Quick ratio is a coverage ratio of liquid assets to current liabilities. DIR converts a similar liquid-asset idea into a days-of-expenditure runway metric rather than a multiple of liabilities.',
  },
  {
    question: 'How can a business improve its defensive interval ratio?',
    answer:
      'Options include accelerating collections, building cash reserves, improving receivable quality, and managing cash operating costs. Improving DIR is not always the same as maximizing long-term enterprise value.',
  },
  {
    question:
      'Why is the defensive interval ratio important for liquidity analysis?',
    answer:
      'DIR translates liquidity into an intuitive days figure for short-term planning, stress discussion, and working-capital review alongside other ratios and cash-flow forecasts.',
  },
  {
    question: 'What are the limitations of defensive interval ratio?',
    answer:
      'Limitations include receivable collection risk, securities liquidity/valuation, restricted cash, seasonal spending, upcoming debt maturities, accounting vs cash differences, and unexpected obligations.',
  },
  {
    question:
      'Can a company have a high defensive interval ratio and still face financial problems?',
    answer:
      'Yes. Assets may be less liquid than assumed, liabilities may mature soon, spending may spike, or cash may be restricted. DIR is one liquidity lens, not a complete solvency test.',
  },
  {
    question: 'Is defensive interval ratio the same as cash runway?',
    answer:
      'They are related ideas (coverage time from liquidity), but runway tools often use burn rate and cash only, while DIR uses a defined defensive-asset set and accounting-based average daily cash expenditure assumptions.',
  },
];
