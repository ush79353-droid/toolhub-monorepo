import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is a Pivot Point?' },
  { id: 'types', label: 'Types of Pivot Points' },
  { id: 'how-to-calculate', label: 'How to Calculate Pivot Points' },
  { id: 'classic', label: 'Floor Pivot Points (Classic)' },
  { id: 'woodie', label: 'Woodie Pivot Points' },
  { id: 'camarilla', label: 'Camarilla Pivot Points' },
  { id: 'fibonacci', label: 'Fibonacci Pivot Points' },
  { id: 'demark', label: 'DeMark Pivot Points' },
  { id: 'how-to-use', label: 'How to Use the Pivot Point Calculator' },
  { id: 'how-to-trade', label: 'How to Trade Pivot Points' },
  { id: 'limitations', label: 'Limitations of Pivot Points' },
  { id: 'pp-faq', label: 'Frequently Asked Questions' },
];

export const PP_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a pivot point in stock trading?',
    answer:
      'A pivot point is a formula-based price reference derived from the prior period’s high, low, and close. Traders use it with related support and resistance levels as potential reaction zones — not guaranteed turning points.',
  },
  {
    question: 'How do you calculate pivot points in forex trading?',
    answer:
      'Use the previous session’s high, low, and close (and open for DeMark). Classic pivot = (H+L+C)/3, then build R1–R3 and S1–S3 from the pivot and range. Other methods weight or scale those inputs differently.',
  },
  {
    question: 'How do you trade pivot points?',
    answer:
      'Common approaches treat pivots as potential support/resistance, watch for breakouts beyond R1/S1, and combine levels with trend, volume, and risk controls. Confirmation matters; pivots alone are not a complete strategy.',
  },
  {
    question: 'Which pivot point method is best?',
    answer:
      'There is no universal best method. Classic is widely used; Woodie weights the close; Camarilla emphasizes short-range levels; Fibonacci scales the range; DeMark depends on open vs close. Choice depends on market, timeframe, and style.',
  },
  {
    question: 'What is the difference between Classic and Fibonacci pivot points?',
    answer:
      'Both share the same central pivot (H+L+C)/3. Fibonacci levels offset that pivot by Fibonacci fractions of the prior range (0.382, 0.618, 1.0), while Classic uses the standard floor-trader R/S formulas.',
  },
  {
    question: 'What is the difference between pivot points and support/resistance?',
    answer:
      'Pivot-derived levels are algorithmic references from prior OHLC. Broader support/resistance can come from swing highs/lows, volume, and structure. They often overlap but are not identical concepts.',
  },
  {
    question: 'Can pivot points predict market direction?',
    answer:
      'No. They organize historical price into potential zones. Direction remains uncertain and should be assessed with broader analysis and risk management.',
  },
  {
    question: 'What timeframe should I use for pivot points?',
    answer:
      'Daily pivots from the prior day are common for intraday work. Weekly or monthly pivots suit longer horizons. Match the OHLC period to the timeframe you trade.',
  },
  {
    question: 'Do pivot points work for cryptocurrency?',
    answer:
      'The same formulas apply to crypto OHLC data. They do not guarantee performance; 24/7 sessions and feed choices can change which “prior period” you use.',
  },
  {
    question: 'Why do different pivot point calculators give different results?',
    answer:
      'Methods differ, as do session definitions, price feeds, whether open is included, and rounding. Confirm which method and OHLC source you are comparing.',
  },
];
