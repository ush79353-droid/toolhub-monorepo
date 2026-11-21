import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ROIC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is Return on Invested Capital?' },
  { id: 'formula', label: 'ROIC Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate ROIC' },
  { id: 'good-roic', label: 'What Is a Good ROIC?' },
  { id: 'roic-vs-roe', label: 'ROIC vs. ROE' },
  { id: 'roic-vs-roce', label: 'ROIC vs. ROCE' },
  { id: 'roic-vs-roi', label: 'ROIC vs. ROI' },
  { id: 'roic-vs-wacc', label: 'ROIC vs. WACC' },
  { id: 'nopat', label: 'What Is NOPAT?' },
  { id: 'invested-capital', label: 'How to Calculate Invested Capital' },
  { id: 'improve', label: 'How Companies Improve ROIC' },
  { id: 'limitations', label: 'Limitations of ROIC' },
  { id: 'examples', label: 'Practical ROIC Examples' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'roic-faq', label: 'Frequently Asked Questions' },
];

export const ROIC_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the ROIC formula?',
    answer:
      'ROIC = (NOPAT ÷ Invested Capital) × 100. In the simplified calculator, NOPAT = EBIT × (1 − tax rate) and invested capital ≈ equity + interest-bearing debt.',
  },
  {
    question: 'Is ROIC the same as ROE?',
    answer:
      'No. ROE uses net income over shareholders’ equity. ROIC uses after-tax operating profit (NOPAT) over a broader capital base that includes interest-bearing debt.',
  },
  {
    question: 'How do I calculate NOPAT?',
    answer:
      'A common simplified estimate is NOPAT = EBIT × (1 − tax rate). Example: EBIT 500,000 and tax 25% → NOPAT 375,000. Actual tax treatment of losses can differ.',
  },
  {
    question: 'What is considered a good ROIC?',
    answer:
      'There is no universal cutoff. Compare ROIC with the company’s WACC, industry peers, capital intensity, and historical trends. Sustainable returns above the cost of capital matter more than a single headline percentage.',
  },
  {
    question: 'Can ROIC be negative?',
    answer:
      'Yes. Negative NOPAT (for example from negative EBIT) produces negative ROIC when invested capital is positive. Also check that the capital denominator is defined consistently.',
  },
  {
    question: 'Can ROIC be greater than 100%?',
    answer:
      'Yes, mathematically, when NOPAT exceeds invested capital. That outcome warrants reviewing capital definitions, accounting policies, and whether the capital base is unusually small.',
  },
  {
    question: 'What is the difference between ROIC and ROI?',
    answer:
      'ROI is a broad label for return on a specific investment or project. ROIC is a company-level ratio of after-tax operating profit to invested capital with a defined accounting structure.',
  },
  {
    question: 'Why is ROIC important to investors?',
    answer:
      'ROIC helps evaluate how efficiently a business converts invested capital into after-tax operating earnings — a core signal of capital efficiency and potential value creation when compared with financing costs.',
  },
  {
    question: 'Should ROIC be higher than WACC?',
    answer:
      'A positive ROIC − WACC spread suggests operating returns exceed the estimated financing cost under the assumptions used. A negative spread suggests the opposite. Neither alone decides whether a stock is a good investment.',
  },
  {
    question: 'What is invested capital?',
    answer:
      'In this calculator, invested capital is the simplified sum of equity and interest-bearing debt. Advanced analyses may adjust for excess cash, leases, non-operating assets, and operating liabilities.',
  },
  {
    question: 'Why use average invested capital?',
    answer:
      'NOPAT is a period flow while capital is a balance-sheet stock. Averaging beginning and ending invested capital can better match capital used during the period when the balance sheet changed.',
  },
  {
    question: 'How can a company increase ROIC?',
    answer:
      'By improving operating margins, raising asset and working-capital productivity, allocating capital carefully, and avoiding investments that persistently earn below the cost of capital — not by indiscriminate cost-cutting alone.',
  },
];
