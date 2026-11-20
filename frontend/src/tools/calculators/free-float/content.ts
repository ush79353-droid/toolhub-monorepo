import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FREE_FLOAT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is Free Float?' },
  { id: 'definition', label: 'Free Float Shares Definition' },
  { id: 'outstanding-vs-float', label: 'Outstanding Shares vs. Free Float' },
  { id: 'restricted', label: 'Restricted Shares Explained' },
  { id: 'closely-held', label: 'Closely Held Shares Explained' },
  { id: 'formula', label: 'Free Float Formula' },
  { id: 'percentage-formula', label: 'Free Float Percentage Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Free Float Shares' },
  { id: 'example', label: 'Free Float Calculation Example' },
  { id: 'why-matters', label: 'Why Free Float Matters' },
  { id: 'liquidity', label: 'Free Float and Stock Liquidity' },
  { id: 'volatility', label: 'Free Float and Stock Volatility' },
  { id: 'vs-market-cap', label: 'Free Float vs. Market Capitalization' },
  { id: 'limitations', label: 'Limitations of Free Float' },
  { id: 'ff-faq', label: 'Frequently Asked Questions' },
];

export const FREE_FLOAT_FAQS: readonly FAQItem[] = [
  {
    question: 'Can free float be negative?',
    answer:
      'Not with valid inputs. If restricted plus closely held shares exceed outstanding shares, the data is inconsistent or categories may have been double-counted.',
  },
  {
    question: 'What are restricted shares?',
    answer:
      'Restricted shares are shares that cannot currently be freely traded because of legal, contractual, lockup, or other limitations.',
  },
  {
    question: 'How do you calculate free float?',
    answer:
      'Free float = outstanding shares − restricted shares − closely held shares. Example: 10,000 − 2,000 − 1,000 = 7,000.',
  },
  {
    question: 'How do you calculate free float percentage?',
    answer:
      'Free float percentage = (free float ÷ outstanding shares) × 100. Example: 7,000 ÷ 10,000 × 100 = 70%.',
  },
  {
    question: 'What is the difference between free float and outstanding shares?',
    answer:
      'Outstanding shares are all issued shares held by investors. Free float is the subset generally available for public trading after exclusions.',
  },
  {
    question: 'What is closely held stock?',
    answer:
      'Closely held shares are typically held by insiders, controlling shareholders, or strategic holders and are often excluded from public float estimates.',
  },
  {
    question: 'Is a higher free float better?',
    answer:
      'It depends. Higher float can support liquidity, but ownership structure, trading volume, and investment goals also matter. Free float alone does not determine investment quality.',
  },
  {
    question: 'Why do companies have low free float?',
    answer:
      'Common reasons include controlling ownership, lockups after offerings, employee equity restrictions, and concentrated strategic holdings.',
  },
  {
    question: 'Does free float affect stock price?',
    answer:
      'Float can influence supply and liquidity, which may affect price behavior, but it does not guarantee any price outcome.',
  },
  {
    question: 'Can free float be 100%?',
    answer:
      'Yes, mathematically, when no shares are classified as restricted or closely held under the calculator’s assumptions.',
  },
  {
    question: 'What does a 40% free float mean?',
    answer:
      'It means 40% of outstanding shares are classified as freely tradable under the chosen exclusion assumptions.',
  },
  {
    question: 'How often does free float change?',
    answer:
      'It can change with ownership shifts, share issuance, buybacks, lockup expirations, and updates to restriction classifications.',
  },
  {
    question: 'What is float-adjusted market capitalization?',
    answer:
      'Float-adjusted market cap multiplies share price by free float shares instead of all outstanding shares.',
  },
  {
    question: 'Is free float the same as trading volume?',
    answer:
      'No. Free float is a stock of potentially tradable shares. Trading volume is how many shares actually trade over a period.',
  },
  {
    question: 'What happens when restricted shares become tradable?',
    answer:
      'As restrictions lift, previously excluded shares may enter the free float, increasing the freely tradable supply.',
  },
];
