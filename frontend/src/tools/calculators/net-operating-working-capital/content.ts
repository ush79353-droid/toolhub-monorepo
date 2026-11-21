import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NET_OPERATING_WORKING_CAPITAL_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'what-is-nowc', label: 'What Is Net Operating Working Capital?' },
    { id: 'formula', label: 'Net Operating Working Capital Formula' },
    { id: 'coa', label: 'Current Operating Assets' },
    { id: 'col', label: 'Current Operating Liabilities' },
    { id: 'calc-coa', label: 'How to Calculate Current Operating Assets' },
    { id: 'calc-col', label: 'How to Calculate Current Operating Liabilities' },
    { id: 'how-to-calculate', label: 'How to Calculate NOWC' },
    { id: 'worked-example', label: 'Complete NOWC Example' },
    { id: 'why-important', label: 'Why Is NOWC Important?' },
    { id: 'pos-neg', label: 'Positive NOWC vs Negative NOWC' },
    { id: 'vs-wc', label: 'NOWC vs Working Capital' },
    { id: 'vs-noa', label: 'NOWC vs Net Operating Assets' },
    { id: 'vs-ccc', label: 'NOWC vs Cash Conversion Cycle' },
    { id: 'vs-current', label: 'NOWC vs Current Ratio' },
    { id: 'ar', label: 'NOWC and Accounts Receivable' },
    { id: 'inventory', label: 'NOWC and Inventory' },
    { id: 'ap', label: 'NOWC and Accounts Payable' },
    { id: 'cash-flow', label: 'NOWC and Operating Cash Flow' },
    { id: 'change', label: 'Change in NOWC' },
    { id: 'improve', label: 'How to Improve NOWC Management' },
    { id: 'negative-ok', label: 'Why Negative NOWC Is Not Always Bad' },
    { id: 'analysis', label: 'NOWC in Financial Statement Analysis' },
    { id: 'valuation', label: 'NOWC in Business Valuation' },
    { id: 'mistakes', label: 'Common NOWC Calculation Mistakes' },
    { id: 'limitations', label: 'Limitations' },
    { id: 'nowc-faq', label: 'Frequently Asked Questions' },
  ];

export const NET_OPERATING_WORKING_CAPITAL_FAQS: readonly FAQItem[] = [
  {
    question: 'What is net operating working capital?',
    answer:
      'NOWC is current operating assets minus current operating liabilities: the net short-term capital tied to day-to-day operations under a stated classification.',
  },
  {
    question: 'What does NOWC stand for?',
    answer: 'Net Operating Working Capital.',
  },
  {
    question: 'What is the NOWC formula?',
    answer:
      'NOWC = Current Operating Assets − Current Operating Liabilities. In this tool: (Cash + AR + Inventories) − (AP + Accrued expenses).',
  },
  {
    question: 'How do I calculate net operating working capital?',
    answer:
      'Sum operating cash, receivables, and inventories; sum payables and accrued expenses; subtract COL from COA.',
  },
  {
    question: 'What are current operating assets?',
    answer:
      'Short-term assets used in operations. Here: cash, accounts receivable, and inventories.',
  },
  {
    question: 'What are current operating liabilities?',
    answer:
      'Short-term operating obligations. Here: accounts payable and accrued expenses.',
  },
  {
    question: 'Does cash count as a current operating asset?',
    answer:
      'This calculator includes cash to match the reference layout. Prefer operating cash; excess investment cash is often excluded in stricter analysis.',
  },
  {
    question: 'Are accounts receivable operating assets?',
    answer: 'Yes: trade receivables typically arise from ordinary sales.',
  },
  {
    question: 'Is inventory included in NOWC?',
    answer: 'Yes: inventories are included in current operating assets here.',
  },
  {
    question: 'Are accounts payable operating liabilities?',
    answer: 'Yes: trade payables typically arise from ordinary purchases.',
  },
  {
    question: 'Are accrued expenses included in NOWC?',
    answer: 'Yes: operating accruals are included in COL in this model.',
  },
  {
    question: 'Are short-term bank loans included in NOWC?',
    answer:
      'No. Interest-bearing financing liabilities are generally excluded from operating working capital.',
  },
  {
    question: 'Can net operating working capital be negative?',
    answer: 'Yes: when COL exceeds COA.',
  },
  {
    question: 'What does positive NOWC mean?',
    answer:
      'Current operating assets exceed current operating liabilities under the selected categories.',
  },
  {
    question: 'What does negative NOWC mean?',
    answer:
      'Current operating liabilities exceed current operating assets; not automatically insolvency.',
  },
  {
    question: 'What happens if NOWC equals zero?',
    answer: 'COA equals COL under the entered categories.',
  },
  {
    question: 'Is negative NOWC always bad?',
    answer:
      'No. Fast inventory turns and strong supplier credit can support negative operating working capital.',
  },
  {
    question: 'Is higher NOWC always better?',
    answer:
      'No. Excess inventory or slow collections can inflate NOWC without improving performance.',
  },
  {
    question: 'What is the difference between working capital and NOWC?',
    answer:
      'Working capital uses all current assets and liabilities. NOWC focuses on operating components.',
  },
  {
    question: 'What is the difference between NOWC and NOA?',
    answer:
      'NOWC is current operating capital. NOA can include longer-term operating assets such as fixed assets.',
  },
  {
    question: 'What is the difference between NOWC and the current ratio?',
    answer:
      'Current ratio = current assets ÷ current liabilities (dimensionless). NOWC is a currency amount.',
  },
  {
    question: 'What is the difference between NOWC and the cash conversion cycle?',
    answer:
      'CCC is measured in days (DIO + DSO − DPO). NOWC is measured in money.',
  },
  {
    question: 'How does NOWC affect liquidity?',
    answer:
      'It indicates net operating investment in short-term assets, but it is not a complete liquidity test.',
  },
  {
    question: 'How does NOWC affect operating cash flow?',
    answer:
      'Increases in non-cash operating working capital often use cash. Do not treat cash-inclusive NOWC changes as a direct cash-flow plug.',
  },
  {
    question: 'How do I calculate the change in NOWC?',
    answer: 'ΔNOWC = Ending NOWC − Beginning NOWC.',
  },
  {
    question: 'Why does increasing inventory affect NOWC?',
    answer: 'Higher inventory raises COA and usually raises NOWC, all else equal.',
  },
  {
    question: 'Why does increasing accounts payable reduce NOWC?',
    answer: 'Higher AP raises COL and reduces NOWC, all else equal.',
  },
  {
    question: 'How do customer payments affect NOWC?',
    answer:
      'Collecting receivables reduces AR (and often increases cash). Net NOWC impact depends on the cash classification used.',
  },
  {
    question: 'How can a company reduce its operating working capital requirement?',
    answer:
      'Collect faster, manage inventory tightly, and negotiate appropriate supplier terms without harming operations.',
  },
  {
    question: 'How can a company improve working capital management?',
    answer:
      'Align forecasting, credit policy, inventory planning, and payables discipline with cash-flow goals.',
  },
  {
    question: 'What is a good NOWC value?',
    answer:
      'It depends on industry, seasonality, and business model. Compare peers and history.',
  },
  {
    question: 'Does positive NOWC guarantee profitability?',
    answer: 'No: NOWC is a balance-sheet measure, not an income measure.',
  },
  {
    question: 'Can a profitable company have negative NOWC?',
    answer: 'Yes: especially with rapid turns and favorable payables.',
  },
  {
    question: 'Is NOWC the same as cash?',
    answer: 'No. Cash is only one component of COA in this model.',
  },
  {
    question: 'Can NOWC be calculated from a balance sheet?',
    answer:
      'Yes, by selecting operating current assets and operating current liabilities from the balance sheet.',
  },
  {
    question: 'Why are financial liabilities excluded from NOWC?',
    answer:
      'Bank loans and similar interest-bearing debt are financing, not day-to-day operating obligations.',
  },
  {
    question: 'What happens when operating liabilities exceed operating assets?',
    answer: 'NOWC is negative under that classification.',
  },
  {
    question: 'Why is NOWC important for business valuation?',
    answer:
      'Forecasts often require investment in operating working capital as sales grow, affecting free cash flow.',
  },
  {
    question:
      'What is NOWC if current operating assets are $1,000 and operating liabilities are $700?',
    answer: 'NOWC = 1,000 − 700 = $300.',
  },
  {
    question: 'What if operating liabilities are higher than operating assets?',
    answer: 'Example: COA $20,000 − COL $25,000 = NOWC −$5,000.',
  },
  {
    question: 'How do I calculate current operating assets?',
    answer:
      'Example: Cash $5,000 + AR $10,000 + Inventories $15,000 = COA $30,000.',
  },
];
