import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ROE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is Return on Equity?' },
  { id: 'formula', label: 'Return on Equity Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Return on Equity' },
  { id: 'good-roe', label: 'What Is a Good Return on Equity?' },
  { id: 'roe-vs-roce', label: 'ROE vs. Return on Capital Employed' },
  { id: 'roe-vs-roa', label: 'Return on Equity vs. Return on Assets' },
  { id: 'leverage', label: 'How Financial Leverage Affects ROE' },
  { id: 'dupont', label: 'DuPont Analysis and ROE' },
  { id: 'investors', label: 'How Investors Use ROE' },
  { id: 'advantages', label: 'Advantages and Limitations of ROE' },
  { id: 'examples', label: 'ROE Calculation Examples' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'roe-faq', label: 'Frequently Asked Questions' },
];

export const ROE_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate ROE?',
    answer:
      "ROE = (net profit ÷ shareholders' equity) × 100. Example: net profit 35,000 and equity 450,000 → ROE ≈ 7.78%. Some analysts use average equity = (beginning + ending) ÷ 2.",
  },
  {
    question: 'Is a 2% ROE good?',
    answer:
      'A 2% ROE may look low in many competitive industries, but it cannot be judged in isolation. Compare peers, risk, capital intensity, and the company’s own history before labeling any single percentage “good” or “bad.”',
  },
  {
    question: 'What is a strong ROE ratio?',
    answer:
      'Strong ROE is industry-specific and ideally sustainable. Look for peer medians, multi-year trends, and whether profitability is supported by cash flow rather than one-time gains or extreme leverage.',
  },
  {
    question: 'What if net profit is $5,000 and equity is $20,000?',
    answer:
      'ROE = (5,000 / 20,000) × 100 = 25%. That means about $0.25 of net profit per $1 of shareholders’ equity for the measured period.',
  },
  {
    question: 'Can ROE be negative?',
    answer:
      'Yes. Negative net profit with positive equity produces negative ROE (a loss relative to equity). Negative equity can also produce a negative percentage; that case needs careful interpretation and should not be compared casually with positive-equity ROE.',
  },
  {
    question: 'Can ROE exceed 100%?',
    answer:
      'Yes, when net profit exceeds the equity base. That can reflect high profitability, a small equity base, leverage, or accounting timing; always inspect the context before treating it as a quality signal.',
  },
  {
    question: 'What is the difference between ROE and ROA?',
    answer:
      'ROE divides net profit by equity; ROA divides net profit by assets. Debt financing can raise ROE relative to ROA even when asset profitability is unchanged.',
  },
  {
    question: "Why is average shareholders' equity used?",
    answer:
      'Net profit is a flow over a period, while equity is a balance-sheet stock. Averaging beginning and ending equity can better match the equity used during the period when the balance sheet changed.',
  },
  {
    question: 'Is high ROE always good?',
    answer:
      'No. High ROE can reflect strong earnings, but also heavy leverage, share buybacks that shrink equity, or temporary income. Pair ROE with leverage, ROA, cash flow, and valuation analysis.',
  },
  {
    question: 'How can a company improve ROE?',
    answer:
      'Sustainable paths include raising net profit, improving asset efficiency (DuPont), and thoughtful capital structure; not simply borrowing more to shrink equity and inflate the ratio.',
  },
];
