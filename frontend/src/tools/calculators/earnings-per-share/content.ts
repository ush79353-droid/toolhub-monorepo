import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EPS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Introduction' },
  { id: 'what-is', label: 'What Is Earnings per Share?' },
  { id: 'formula', label: 'Earnings per Share Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate EPS' },
  { id: 'applications', label: 'Applications of EPS' },
  { id: 'basic-vs-diluted', label: 'Basic EPS vs Diluted EPS' },
  { id: 'why-changes', label: 'Why EPS Changes' },
  { id: 'limitations', label: 'Limitations of EPS' },
  { id: 'considerations', label: 'Investment Considerations' },
  { id: 'eps-faq', label: 'Frequently Asked Questions' },
];

export const EPS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is earnings per share?',
    answer:
      'EPS is the portion of a company’s earnings attributable to each weighted-average common share outstanding during the period.',
  },
  {
    question: 'How do you calculate EPS?',
    answer:
      'Basic EPS = (Net Income − Preferred Dividends) ÷ Weighted-Average Common Shares Outstanding.',
  },
  {
    question: 'What is a good EPS?',
    answer:
      'It depends on industry, company size, share count, valuation, and earnings trends. There is no single universal “good” EPS.',
  },
  {
    question: 'Can EPS be negative?',
    answer:
      'Yes. Negative EPS usually means a loss attributable to common shareholders after preferred dividends.',
  },
  {
    question: 'What is the difference between EPS and diluted EPS?',
    answer:
      'Basic EPS uses weighted-average common shares. Diluted EPS also considers potentially dilutive securities such as certain options, warrants, and convertibles when applicable.',
  },
  {
    question: 'Why are preferred dividends subtracted?',
    answer:
      'Preferred dividends reduce earnings available to common shareholders, so they are deducted before dividing by common shares.',
  },
  {
    question: 'Does a higher EPS mean a better stock?',
    answer:
      'Not necessarily. Valuation, growth, risk, capital structure, and accounting quality all matter alongside EPS.',
  },
  {
    question: 'Can EPS increase without net income increasing?',
    answer:
      'Yes. Share repurchases can reduce the weighted-average share count and raise EPS even if net income is unchanged.',
  },
  {
    question: 'What is the difference between EPS and net income?',
    answer:
      'Net income is total period earnings. EPS expresses earnings on a per common share basis after preferred dividends.',
  },
  {
    question: 'What is the difference between EPS and dividends?',
    answer:
      'EPS is an accounting profitability measure. Dividends are cash (or other) distributions actually paid to shareholders.',
  },
  {
    question: 'How is EPS related to the P/E ratio?',
    answer:
      'P/E = Share Price ÷ EPS. A conventional P/E is not meaningful when EPS is zero or negative.',
  },
  {
    question: 'What is weighted-average shares outstanding?',
    answer:
      'It weights shares by how long they were outstanding during the reporting period, rather than using only the period-end share count.',
  },
  {
    question: 'Can preferred dividends exceed net income?',
    answer:
      'Yes. In that case earnings available to common shareholders are negative and basic EPS can be negative.',
  },
  {
    question: 'Is EPS calculated annually or quarterly?',
    answer:
      'Companies commonly report EPS for annual and interim (for example quarterly) reporting periods.',
  },
  {
    question: 'Why is EPS important to investors?',
    answer:
      'It supports profitability trend analysis, period comparisons, and valuation ratios such as P/E when EPS is positive.',
  },
];
