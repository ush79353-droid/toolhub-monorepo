import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HOME_VALUE_US_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-home-value', label: 'What Is the Value of My Home?' },
  { id: 'case-shiller', label: 'Case-Shiller Index' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'formula', label: 'Home Value Calculation Formula' },
  { id: 'nominal-vs-real', label: 'Nominal vs. Real Home Value' },
  { id: 'inflation', label: 'How Inflation Affects Home Values' },
  { id: 'mortgage-rates', label: 'Mortgage Rates and Home Prices' },
  { id: 'improvements', label: 'Home Improvements and Value' },
  { id: 'value-vs-equity', label: 'Home Value vs. Home Equity' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'home-value-us-faq', label: 'Frequently Asked Questions' },
];

export const HOME_VALUE_US_FAQS: readonly FAQItem[] = [
  {
    question: 'How accurate is a home value calculator?',
    answer:
      'Accuracy depends on the index series, observation dates, local conditions, and property-specific traits. Metro indices describe broad market movement — they are not a substitute for a professional appraisal or a listing-based estimate of one address.',
  },
  {
    question: 'What is the Case-Shiller Home Price Index?',
    answer:
      'The S&P CoreLogic Case-Shiller Home Price Indices track changes in residential property prices using a repeat-sales approach. Metro series summarize market trends across participating transactions, not every individual home.',
  },
  {
    question: 'How do I calculate how much my home has appreciated?',
    answer:
      'Estimated value = purchase price × (valuation index ÷ purchase index). Nominal appreciation % = (estimated value ÷ purchase price − 1) × 100. Use matching observations from the same metro series.',
  },
  {
    question: 'Can my home value decrease?',
    answer:
      'Yes. If the valuation index is below the purchase-date index, the indexed estimate falls and nominal change is negative. Housing markets can and do decline.',
  },
  {
    question: 'Does home value account for inflation?',
    answer:
      'Nominal results use home price indices only. This calculator also shows real change when matching CPI-U observations are available, using ratio-based inflation adjustment — not by subtracting inflation percentages.',
  },
  {
    question: 'How often is the home price index updated?',
    answer:
      'Case-Shiller metro series on FRED are monthly and typically released with a lag. “Present value” means the latest published observation for the selected series, which may not be the current calendar month.',
  },
  {
    question: 'Is estimated home value the same as appraised value?',
    answer:
      'No. An appraisal evaluates a specific property. This tool applies metro-level index ratios to a purchase price you enter.',
  },
  {
    question: 'Why does my home value differ from online property listings?',
    answer:
      'Listings and AVMs use different data and methods. Neighborhood, condition, renovations, and property type can diverge from metro averages.',
  },
  {
    question: 'How do mortgage rates affect home values?',
    answer:
      'Higher rates can reduce borrowing power and buyer demand, which may pressure prices; lower rates can support demand. Rates are one factor among many.',
  },
  {
    question: 'What is the difference between home value and home equity?',
    answer:
      'Home value is an estimate of market worth. Home equity is roughly current value minus outstanding mortgage balance. Value alone does not determine equity without debt information.',
  },
];
