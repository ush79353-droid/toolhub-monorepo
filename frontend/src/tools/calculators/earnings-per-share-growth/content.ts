import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EPS_GROWTH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-eps', label: 'What Are Earnings per Share?' },
  { id: 'how-to-find', label: 'How to Find Earnings per Share' },
  { id: 'what-is-growth', label: 'What Is EPS Growth?' },
  { id: 'growth-formula', label: 'How to Calculate EPS Growth' },
  { id: 'what-is-cagr', label: 'What Is EPS CAGR?' },
  { id: 'how-cagr', label: 'How to Calculate EPS Growth Rate' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'examples', label: 'Worked EPS Growth Examples' },
  { id: 'applications', label: 'Applications of EPS Growth' },
  { id: 'limitations', label: 'Limitations of EPS Growth' },
  { id: 'epsg-faq', label: 'Frequently Asked Questions' },
];

export const EPS_GROWTH_FAQS: readonly FAQItem[] = [
  {
    question: 'What is EPS growth?',
    answer:
      'EPS growth is the change in earnings per share between two reporting periods, usually expressed as a percentage when the starting EPS is positive.',
  },
  {
    question: 'How do you calculate EPS growth?',
    answer:
      'Total growth (%) = (Final EPS − Initial EPS) ÷ Initial EPS × 100, when initial EPS is positive.',
  },
  {
    question: 'What is a good EPS growth rate?',
    answer:
      'There is no universal benchmark. Industry norms, company maturity, sustainability of earnings, and valuation all matter.',
  },
  {
    question: 'What does negative EPS growth mean?',
    answer:
      'When initial EPS is positive, negative growth means final EPS is lower than initial EPS — a decline in earnings per share.',
  },
  {
    question: 'Can EPS growth be greater than 100%?',
    answer:
      'Yes. If EPS more than doubles, total growth exceeds 100%.',
  },
  {
    question: 'What is EPS CAGR?',
    answer:
      'EPS CAGR is the constant compounded per-period rate that would turn initial EPS into final EPS over n periods.',
  },
  {
    question: 'What is the difference between EPS growth and EPS CAGR?',
    answer:
      'Total growth is the overall percentage change between two endpoints. CAGR annualizes (or period-averages) that change as a compound rate.',
  },
  {
    question: 'Can EPS growth be calculated from negative EPS?',
    answer:
      'Absolute EPS change can still be shown, but conventional percentage growth and CAGR are not meaningful when starting EPS is negative or when values cross zero into losses for CAGR.',
  },
  {
    question: 'What happens when initial EPS is zero?',
    answer:
      'The standard percentage formula divides by initial EPS, so growth and CAGR are undefined.',
  },
  {
    question: 'Does higher EPS growth mean a better investment?',
    answer:
      'Not necessarily. Valuation, risk, earnings quality, and cash flow still matter.',
  },
  {
    question: 'Can stock buybacks increase EPS growth?',
    answer:
      'Yes. Reducing the weighted-average share count can raise EPS even if net income is unchanged.',
  },
  {
    question: 'Should I use basic EPS or diluted EPS?',
    answer:
      'Use the same measure consistently across periods so the growth comparison is meaningful.',
  },
  {
    question: 'How do you calculate five-year EPS CAGR?',
    answer:
      'CAGR = (Final EPS ÷ Initial EPS)^(1/5) − 1, then multiply by 100 for a percentage (when both EPS values support conventional CAGR).',
  },
  {
    question: 'Why can EPS growth differ from revenue growth?',
    answer:
      'Margins, costs, taxes, financing, and share count can move EPS differently from revenue.',
  },
  {
    question: 'Can EPS CAGR be negative?',
    answer:
      'Yes. When positive EPS declines over time, the compound growth rate is negative.',
  },
];
