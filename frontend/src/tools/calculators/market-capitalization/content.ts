import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MCAP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'Market Capitalization – What Is It?' },
  { id: 'formula', label: 'Market Capitalization Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Market Capitalization' },
  { id: 'categories', label: 'Market Capitalization Categories' },
  { id: 'vs-ev', label: 'Market Capitalization vs Enterprise Value' },
  { id: 'why-matters', label: 'Why Market Capitalization Matters' },
  { id: 'stock-splits', label: 'How Stock Splits Affect Market Capitalization' },
  { id: 'limitations', label: 'Limitations of Market Capitalization' },
  { id: 'mcap-faq', label: 'Frequently Asked Questions' },
];

export const MCAP_FAQS: readonly FAQItem[] = [
  {
    question: 'What is market capitalization?',
    answer:
      'Market capitalization is the equity market value of a company: current share price multiplied by shares outstanding.',
  },
  {
    question: 'How do you calculate the market cap of a stock?',
    answer:
      'Market Cap = Share Price × Outstanding Shares. Example: $100 × 10,000,000 = $1,000,000,000.',
  },
  {
    question: 'What is a fully diluted market cap?',
    answer:
      'Fully diluted market cap estimates equity value using shares that would be outstanding if convertible securities, options, or similar instruments were converted or exercised, under stated assumptions.',
  },
  {
    question: 'Is a high market cap good or bad?',
    answer:
      'Neither by itself. Market cap describes size, not investment quality, profitability, or future returns.',
  },
  {
    question: 'What is market cap in crypto?',
    answer:
      'Crypto market cap is often token price × circulating supply. Circulating supply differs from corporate outstanding shares and methodologies vary by data provider.',
  },
  {
    question: 'What is the difference between market cap and enterprise value?',
    answer:
      'Market cap is equity market value. Enterprise value typically starts from market cap and adjusts for debt, cash, and sometimes preferred equity or minority interests.',
  },
  {
    question: 'Does a stock split change market cap?',
    answer:
      'A conventional split changes share count and price proportionally, so market cap is unchanged at the moment of the split. Later price moves can change market cap.',
  },
  {
    question: 'Can market cap be negative?',
    answer:
      'With a nonnegative share price and a positive outstanding share count, market capitalization is nonnegative under this formula.',
  },
  {
    question: 'What is the difference between outstanding shares and float?',
    answer:
      'Outstanding shares are all shares held by investors. Float (free float) is the subset generally available for public trading after excluding restricted or closely held shares.',
  },
  {
    question: 'How does a share buyback affect market cap?',
    answer:
      'Buybacks reduce outstanding shares. Market price can also react, so market cap may fall, rise, or stay similar depending on the price response.',
  },
  {
    question: 'How do you find outstanding shares?',
    answer:
      'Check company filings, earnings releases, investor presentations, and reputable financial data providers. Definitions can vary slightly by source.',
  },
  {
    question: 'Is market cap the same as company value?',
    answer:
      'No. Market cap measures equity market value. The broader business value often considers debt, cash, and other claims — as in enterprise value.',
  },
];
