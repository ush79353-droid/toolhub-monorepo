import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FFO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ffo', label: 'What Are Funds From Operations (FFO)?' },
  { id: 'reit-meaning', label: 'FFO Meaning in REITs' },
  { id: 'ffo-formula', label: 'FFO Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate FFO' },
  { id: 'worked-example', label: 'Complete FFO Calculation Example' },
  { id: 'why-important', label: 'Why Is FFO Important for REIT Investors?' },
  { id: 'vs-net-income', label: 'FFO vs Net Income' },
  { id: 'vs-cfo', label: 'FFO vs Operating Cash Flow' },
  { id: 'vs-ebitda', label: 'FFO vs EBITDA' },
  { id: 'vs-affo', label: 'FFO vs AFFO' },
  { id: 'ffo-per-share', label: 'What Is FFO Per Share?' },
  { id: 'how-investors-use', label: 'How Do Investors Use FFO?' },
  { id: 'good-ffo', label: 'What Is a Good FFO?' },
  { id: 'negative-ffo', label: 'Can FFO Be Negative?' },
  { id: 'mistakes', label: 'Common FFO Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations of FFO' },
  { id: 'ffo-faq', label: 'Frequently Asked Questions' },
];

export const FFO_FAQS: readonly FAQItem[] = [
  {
    question: 'What does FFO stand for?',
    answer: 'FFO stands for Funds From Operations.',
  },
  {
    question: 'What are funds from operations?',
    answer:
      'FFO is a non-GAAP performance measure commonly used for REITs. A simplified reconciliation starts with net income, adds qualifying real estate depreciation and amortization, subtracts qualifying property sale gains, and adds qualifying property sale losses.',
  },
  {
    question: 'How do I calculate FFO?',
    answer:
      'Standard simplified FFO = Net income + Qualifying real estate D&A − Property sale gains + Property sale losses.',
  },
  {
    question: 'What is the FFO formula?',
    answer: 'FFO = NI + D&A − Gains + Losses (simplified Nareit-style educational form).',
  },
  {
    question: 'Why do REITs use FFO?',
    answer:
      'Real estate depreciation can make GAAP net income less informative for recurring property operations; FFO adjusts selected items for REIT analysis.',
  },
  {
    question: 'Is FFO the same as net income?',
    answer:
      'No. FFO adjusts net income for selected real estate D&A and property sale gains/losses.',
  },
  {
    question: 'Is FFO the same as operating cash flow?',
    answer:
      'No. FFO does not automatically capture working-capital changes, all cash timing differences, or recurring CapEx.',
  },
  {
    question: 'What is the difference between FFO and AFFO?',
    answer:
      'AFFO typically starts from FFO and makes further adjustments (often including recurring CapEx). Unlike Nareit FFO, AFFO is not universally standardized across REITs.',
  },
  {
    question: 'What is the difference between FFO and EBITDA?',
    answer:
      'EBITDA adds back D&A to a pre-interest, pre-tax earnings measure. FFO starts from net income with selected real estate adjustments. They are not interchangeable.',
  },
  {
    question: 'Can FFO be negative?',
    answer: 'Yes. Negative FFO is a valid result and does not automatically mean insolvency.',
  },
  {
    question: 'Can FFO equal zero?',
    answer: 'Yes. Zero FFO means the reconciliation nets to zero under the entered assumptions.',
  },
  {
    question: 'Why is depreciation added back when calculating FFO?',
    answer:
      'Qualifying real estate D&A already reduced net income; adding it back focuses the measure on recurring property operations under the FFO convention.',
  },
  {
    question: 'Are gains from property sales included in FFO?',
    answer:
      'Qualifying gains already in net income are subtracted so FFO emphasizes ongoing operations rather than one-time sale profits.',
  },
  {
    question: 'Are losses from property sales added back?',
    answer:
      'Yes: qualifying property sale losses already in net income are typically added back in the simplified FFO reconciliation.',
  },
  {
    question: 'Is interest income deducted from standard REIT FFO?',
    answer:
      'No. Under standard REIT FFO, interest income generally remains in net income and is not subtracted again. This calculator’s optional adjusted mode can exclude it as a custom choice.',
  },
  {
    question: 'What is FFO per share?',
    answer:
      'FFO per share = FFO ÷ weighted-average diluted common shares (when used). It is not the same as EPS or dividends per share.',
  },
  {
    question: 'What is a good FFO for a REIT?',
    answer:
      'It depends on size, sector, leverage, growth, occupancy, financing costs, and CapEx needs. Avoid universal thresholds.',
  },
  {
    question: 'How is FFO used in REIT valuation?',
    answer:
      'Investors track FFO and FFO per share trends and may compare price-to-FFO multiples alongside other metrics.',
  },
  {
    question: 'Does positive FFO guarantee dividends?',
    answer:
      'No. Dividends depend on cash, liquidity, covenants, board policy, and capital needs.',
  },
  {
    question: 'What is the difference between FFO and cash available for distribution?',
    answer:
      'Cash available for distribution typically reflects cash after additional items such as CapEx and financing constraints; FFO alone is not CAD.',
  },
  {
    question: 'Can a REIT have negative net income and positive FFO?',
    answer:
      'Yes. Large qualifying D&A add-backs can produce positive FFO even when net income is negative.',
  },
  {
    question: 'What is the Nareit FFO definition?',
    answer:
      'Nareit provides industry guidance for FFO reconciliations. Official reporting may also adjust impairments and unconsolidated joint ventures. This tool is a simplified educational model.',
  },
  {
    question: 'How do recurring capital expenditures affect AFFO?',
    answer:
      'Many AFFO definitions subtract recurring CapEx (and other adjustments) from FFO; formulas vary by issuer.',
  },
  {
    question: 'Why can REITs report FFO different from net income?',
    answer:
      'Because FFO deliberately adjusts selected depreciation and property sale items that affect GAAP earnings.',
  },
  {
    question:
      'What is FFO if net income is $200,000, qualifying depreciation is $75,000, gains from property sales are $25,000, and property sale losses are $10,000?',
    answer: 'FFO = 200,000 + 75,000 − 25,000 + 10,000 = $260,000.',
  },
];
