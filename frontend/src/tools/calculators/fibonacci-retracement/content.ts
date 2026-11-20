import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FIB_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are', label: 'What Are Fibonacci Levels?' },
  { id: 'sequence', label: 'The Fibonacci Sequence' },
  { id: 'golden-ratio', label: 'The Golden Ratio' },
  { id: 'retracement', label: 'What Are Fibonacci Retracement Levels?' },
  { id: 'extension', label: 'What Are Fibonacci Extension Levels?' },
  { id: 'retracement-formula', label: 'Fibonacci Retracement Formula' },
  { id: 'extension-formula', label: 'Fibonacci Extension Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Fibonacci Retracement' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'trading', label: 'How to Use Fibonacci Levels in Trading' },
  { id: 'support-resistance', label: 'Fibonacci Support and Resistance' },
  { id: 'uptrends', label: 'Fibonacci Levels in Uptrends' },
  { id: 'downtrends', label: 'Fibonacci Levels in Downtrends' },
  { id: 'ratios', label: 'Common Fibonacci Ratios' },
  { id: 'limitations', label: 'Advantages and Limitations' },
  { id: 'fib-faq', label: 'Frequently Asked Questions' },
];

export const FIB_FAQS: readonly FAQItem[] = [
  {
    question: 'What is Fibonacci retracement?',
    answer:
      'Fibonacci retracement measures potential pullback prices within a selected high–low range using ratios related to the Fibonacci sequence.',
  },
  {
    question: 'How do you calculate Fibonacci retracement levels?',
    answer:
      'For an uptrend: High − (High − Low) × ratio. For a downtrend: Low + (High − Low) × ratio.',
  },
  {
    question: 'What is the 61.8% Fibonacci level?',
    answer:
      'About 61.8% relates to the reciprocal of the golden ratio (≈1.618). Traders often watch it as a deeper pullback zone.',
  },
  {
    question: 'Is 50% a Fibonacci ratio?',
    answer:
      'No. The 50% midpoint is widely used in technical analysis even though it is not a Fibonacci ratio.',
  },
  {
    question: 'What is the difference between Fibonacci retracement and extension?',
    answer:
      'Retracements sit within the measured move. Extensions project potential targets beyond that move.',
  },
  {
    question: 'Can Fibonacci retracement predict stock prices?',
    answer:
      'No. Levels are reference points. Markets do not have to respect them.',
  },
  {
    question: 'Which Fibonacci retracement level is most important?',
    answer:
      'None is universally reliable. Importance depends on context, confluence, and the swing points you choose.',
  },
  {
    question: 'How do Fibonacci levels work in a downtrend?',
    answer:
      'Retracements are measured upward from the low: Low + (High − Low) × ratio.',
  },
  {
    question: 'What is the 78.6% retracement level?',
    answer:
      'About 78.6% is often linked to the square root of ≈0.618 and is included on many trading platforms.',
  },
  {
    question: 'Can Fibonacci levels be used for cryptocurrency?',
    answer:
      'The math applies to any price series. Usefulness still depends on liquidity, volatility, and analysis quality.',
  },
  {
    question: 'Can Fibonacci retracement be used for forex?',
    answer:
      'Yes, as a technical-analysis reference on FX pairs, with the same subjectivity around swing selection.',
  },
  {
    question: 'What happens if high price equals low price?',
    answer:
      'The range is zero, so meaningful Fibonacci intervals cannot be calculated. High must be greater than low.',
  },
  {
    question: 'What is Fibonacci extension?',
    answer:
      'An extension projects price levels beyond the original measured move using ratios such as 127.2% and 161.8%.',
  },
  {
    question: 'What is the golden ratio?',
    answer:
      'The golden ratio φ = (1 + √5) / 2 ≈ 1.618. Related ratios appear throughout Fibonacci-based technical analysis.',
  },
  {
    question: 'Are Fibonacci levels reliable?',
    answer:
      'Results vary. They can organize chart analysis but do not guarantee future price movement.',
  },
];
