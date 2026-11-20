import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NET_OPERATING_ASSETS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-noa', label: 'What Does NOA Stand For?' },
  { id: 'noa-formula', label: 'Net Operating Assets Formula' },
  { id: 'operating-assets', label: 'What Are Operating Assets?' },
  { id: 'operating-liabilities', label: 'What Are Operating Liabilities?' },
  { id: 'calc-oa', label: 'How to Calculate Operating Assets' },
  { id: 'calc-ol', label: 'How to Calculate Operating Liabilities' },
  { id: 'how-to-calculate', label: 'How to Calculate Net Operating Assets' },
  { id: 'worked-example', label: 'Complete NOA Example' },
  { id: 'why-useful', label: 'Why Are Net Operating Assets Useful?' },
  { id: 'pos-neg', label: 'Positive vs Negative NOA' },
  { id: 'vs-total-assets', label: 'NOA vs Total Assets' },
  { id: 'vs-working-capital', label: 'NOA vs Working Capital' },
  { id: 'vs-nowc', label: 'NOA vs Net Operating Working Capital' },
  { id: 'vs-noi', label: 'NOA vs Net Operating Income' },
  { id: 'rnoa', label: 'NOA and Return on Net Operating Assets' },
  { id: 'valuation', label: 'NOA and Business Valuation' },
  { id: 'performance', label: 'NOA and Financial Performance' },
  { id: 'balance-sheet', label: 'NOA and Balance Sheet Analysis' },
  { id: 'cash-effects', label: 'How Cash Affects NOA' },
  { id: 'inventory-effects', label: 'How Inventory Affects NOA' },
  { id: 'ar-effects', label: 'How Accounts Receivable Affects NOA' },
  { id: 'ap-effects', label: 'How Accounts Payable Affects NOA' },
  { id: 'efficiency', label: 'How to Improve Operating Asset Efficiency' },
  { id: 'mistakes', label: 'Common NOA Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'noa-faq', label: 'Frequently Asked Questions' },
];

export const NET_OPERATING_ASSETS_FAQS: readonly FAQItem[] = [
  {
    question: 'What are net operating assets?',
    answer:
      'Net operating assets (NOA) are operating assets minus operating liabilities — the net capital tied to ordinary business operations.',
  },
  {
    question: 'What does NOA stand for?',
    answer: 'NOA stands for Net Operating Assets.',
  },
  {
    question: 'What is the net operating assets formula?',
    answer: 'NOA = Operating Assets − Operating Liabilities.',
  },
  {
    question: 'How do I calculate net operating assets?',
    answer:
      'Sum operating assets, sum operating liabilities, then subtract liabilities from assets.',
  },
  {
    question: 'What are operating assets?',
    answer:
      'Assets used in ordinary operations — such as operating cash, receivables, inventory, prepaid expenses, and fixed assets in this simplified model.',
  },
  {
    question: 'What are operating liabilities?',
    answer:
      'Liabilities arising from operations — commonly accounts payable and accrued operating expenses — not interest-bearing financing debt.',
  },
  {
    question: 'What is the difference between operating assets and total assets?',
    answer:
      'Total assets include all recognized assets; operating assets exclude non-operating items such as many financial investments.',
  },
  {
    question:
      'What is the difference between operating liabilities and financial liabilities?',
    answer:
      'Operating liabilities arise from trading and accrued operations; financial liabilities are typically interest-bearing borrowings.',
  },
  {
    question: 'Does cash count as an operating asset?',
    answer:
      'Operating cash needed for day-to-day activity can. Excess cash held as a financial investment is often excluded in strict NOA analysis.',
  },
  {
    question: 'Is inventory an operating asset?',
    answer: 'Yes — inventory is typically a core operating asset.',
  },
  {
    question: 'Are accounts receivable operating assets?',
    answer: 'Yes — trade receivables generally arise from operating sales.',
  },
  {
    question: 'Are prepaid expenses operating assets?',
    answer: 'Yes — prepaid operating costs are assets until consumed.',
  },
  {
    question: 'Are fixed assets included in NOA?',
    answer:
      'Yes when they support operations. Prefer net carrying value after accumulated depreciation.',
  },
  {
    question: 'Are accounts payable operating liabilities?',
    answer: 'Yes — trade payables are commonly operating liabilities.',
  },
  {
    question: 'Are accrued expenses operating liabilities?',
    answer:
      'Accrued operating expenses usually are. Exclude accrued interest on financing debt when classifying strictly.',
  },
  {
    question: 'Are bank loans operating liabilities?',
    answer: 'No — bank loans are typically financing liabilities, not operating.',
  },
  {
    question: 'Can net operating assets be negative?',
    answer: 'Yes, when operating liabilities exceed operating assets.',
  },
  {
    question: 'What does positive NOA mean?',
    answer: 'Operating assets exceed operating liabilities under the chosen classification.',
  },
  {
    question: 'What does negative NOA mean?',
    answer:
      'Operating liabilities exceed operating assets. It is not automatically insolvency.',
  },
  {
    question: 'What happens when NOA equals zero?',
    answer: 'Operating assets equal operating liabilities in the model used.',
  },
  {
    question: 'Is negative NOA bad?',
    answer:
      'Not always — some models run with negative operating working capital or NOA. Context matters.',
  },
  {
    question: 'Is a higher NOA always better?',
    answer:
      'No. Higher NOA means more capital invested in operations; efficiency and returns matter more than size alone.',
  },
  {
    question: 'What is the difference between NOA and working capital?',
    answer:
      'Working capital is current assets minus current liabilities. NOA can include long-term operating assets such as fixed assets.',
  },
  {
    question: 'What is the difference between NOA and net operating working capital?',
    answer:
      'NOWC focuses on operating current items; NOA can add long-term operating assets and related operating liabilities.',
  },
  {
    question: 'What is the difference between NOA and NOI?',
    answer:
      'NOA is a balance-sheet stock of net operating capital. NOI is an income-statement operating-profit concept.',
  },
  {
    question: 'What is the difference between NOA and total equity?',
    answer:
      'Equity = assets − liabilities for the whole firm. NOA uses only operating classifications, not total equity.',
  },
  {
    question: 'What is Return on Net Operating Assets?',
    answer:
      'RNOA = NOPAT ÷ Average NOA × 100 — a profitability ratio on operating capital. Not computed in this primary calculator.',
  },
  {
    question: 'How do I calculate RNOA?',
    answer:
      'Divide NOPAT by average NOA ((beginning + ending) ÷ 2) and multiply by 100. Protect against zero average NOA.',
  },
  {
    question: 'How is NOA used in financial analysis?',
    answer:
      'Analysts use NOA for capital intensity, RNOA, residual income, and operating/financing reformulations.',
  },
  {
    question: 'How does NOA affect business valuation?',
    answer:
      'Valuation often links operating earnings to the capital invested in operations (NOA), separate from financing.',
  },
  {
    question: 'How do inventory changes affect NOA?',
    answer: 'Higher inventory raises operating assets and, other things equal, raises NOA.',
  },
  {
    question: 'How do receivables affect NOA?',
    answer: 'Higher receivables raise operating assets and typically raise NOA.',
  },
  {
    question: 'How do accounts payable affect NOA?',
    answer:
      'Higher operating payables raise operating liabilities and reduce NOA — supplier credit finances operations.',
  },
  {
    question: 'What is the relationship between NOA and NOPAT?',
    answer:
      'NOPAT is operating profit after tax; RNOA relates NOPAT to the NOA capital base.',
  },
  {
    question: 'What is a good net operating assets value?',
    answer:
      'There is no universal target. Compare peers, margins, turnover, and growth needs.',
  },
  {
    question: 'How can a company improve its operating asset efficiency?',
    answer:
      'Collect receivables faster, optimize inventory, utilize fixed assets better, and manage payables thoughtfully.',
  },
  {
    question: 'Can NOA be calculated from a balance sheet?',
    answer:
      'Yes, by classifying line items into operating vs financing categories consistently.',
  },
  {
    question: 'Why are financial assets excluded from NOA?',
    answer:
      'Financial assets relate to financing/treasury activity, not the core operating capital base in a strict reformulation.',
  },
  {
    question:
      'What are net operating assets if operating assets are $800,000 and operating liabilities are $300,000?',
    answer: 'NOA = 800,000 − 300,000 = $500,000.',
  },
  {
    question: 'What happens when operating liabilities exceed operating assets?',
    answer:
      'NOA is negative. Example: OA $300,000 − OL $400,000 = −$100,000.',
  },
  {
    question: 'How do I calculate operating assets?',
    answer:
      'Example: 50k + 100k + 150k + 20k + 300k = $620,000 operating assets.',
  },
];
