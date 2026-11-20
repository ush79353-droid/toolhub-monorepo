import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EBITDA_MULTIPLE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is an EBITDA Multiple?' },
  { id: 'enterprise-value', label: 'Enterprise Value Explained' },
  { id: 'formula', label: 'The EBITDA Multiple Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate EV/EBITDA' },
  { id: 'example', label: 'EBITDA Multiple Calculation Example' },
  { id: 'interpret', label: 'How to Interpret EV/EBITDA' },
  { id: 'industry', label: 'EBITDA Multiples by Industry' },
  { id: 'vs-pe', label: 'EV/EBITDA vs P/E Ratio' },
  { id: 'limitations', label: 'Limitations of the EBITDA Multiple' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'evm-faq', label: 'Frequently Asked Questions' },
];

export const EBITDA_MULTIPLE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is an EBITDA multiple?',
    answer:
      'An EBITDA multiple is enterprise value divided by EBITDA (EV/EBITDA). It expresses how many times EBITDA the enterprise is valued at.',
  },
  {
    question: 'How do you calculate EV/EBITDA?',
    answer:
      'First compute EV = Market Cap + Debt + Minority Interest + Preferred Equity − Cash, then divide EV by EBITDA.',
  },
  {
    question: 'What is a good EBITDA multiple?',
    answer:
      'Benchmarks vary by industry, growth, risk, capital intensity, and market conditions. There is no single universal “good” multiple.',
  },
  {
    question: 'Is a high EBITDA multiple good?',
    answer:
      'Not necessarily. A high multiple can reflect strong growth expectations or quality — or potential overvaluation versus peers.',
  },
  {
    question: 'Is a low EBITDA multiple better?',
    answer:
      'Not automatically. A low multiple may signal risk, slower growth, cyclical conditions, or undervaluation relative to peers.',
  },
  {
    question: 'What happens when EBITDA is negative?',
    answer:
      'A signed ratio can be computed, but negative EV/EBITDA is generally not useful for conventional positive-earnings valuation comparisons.',
  },
  {
    question: 'Can the EBITDA multiple be zero?',
    answer:
      'Yes, when enterprise value is zero and EBITDA is nonzero. A zero multiple with positive EV typically means EBITDA is not zero in the denominator.',
  },
  {
    question: 'What is the difference between enterprise value and market capitalization?',
    answer:
      'Market capitalization values common equity. Enterprise value adjusts for debt, preferred equity, minority interest, and cash to reflect a broader claim on the operating business.',
  },
  {
    question: 'Why is debt added to enterprise value?',
    answer:
      'Debt represents financial claims on the business that an acquirer typically assumes, so it is included in the EV numerator.',
  },
  {
    question: 'Why is cash subtracted from enterprise value?',
    answer:
      'Available cash can offset acquisition cost in a simplified framework, so cash and cash equivalents are subtracted in the common EV formula.',
  },
  {
    question: 'What does an EV/EBITDA ratio of 10 mean?',
    answer:
      'It means enterprise value is ten times the chosen EBITDA figure for the comparison period.',
  },
  {
    question: 'Can EV/EBITDA be used to compare companies?',
    answer:
      'Yes, when assumptions, accounting adjustments, and peer sets are consistent — and when industry context is considered.',
  },
  {
    question: 'What is the difference between EBITDA and EBIT?',
    answer:
      'EBIT is earnings before interest and taxes. EBITDA adds back depreciation and amortization.',
  },
  {
    question: 'Is EV/EBITDA better than P/E?',
    answer:
      'Neither is universally better. EV/EBITDA is an enterprise valuation lens; P/E is an equity earnings lens. They answer different questions.',
  },
  {
    question: 'Does EV/EBITDA include debt?',
    answer:
      'Debt is reflected in enterprise value (the numerator), while EBITDA excludes interest expense.',
  },
];
