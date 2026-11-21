import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PTB_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-book', label: 'What Is Book Value of Equity?' },
  { id: 'tangible', label: 'What Is Tangible Book Value?' },
  { id: 'bvps', label: 'Book Value per Share and Tangible BVPS' },
  { id: 'what-is-pb', label: 'What Is the Price-to-Book Ratio?' },
  { id: 'how-to-calculate', label: 'How to Calculate Price-to-Book Ratio' },
  { id: 'book-vs-market', label: 'Book Value vs Market Value' },
  { id: 'interpret', label: 'How to Interpret Price-to-Book Ratio' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limitations', label: 'Advantages and Limitations' },
  { id: 'ptb-faq', label: 'Frequently Asked Questions' },
];

export const PTB_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a price-to-book ratio?',
    answer:
      'P/B is market price per common share divided by book value per common share, comparing market valuation with accounting equity per share.',
  },
  {
    question: 'How do you calculate the P/B ratio?',
    answer:
      'Common equity = total stockholder equity − preferred equity. BVPS = common equity ÷ shares outstanding. P/B = share price ÷ BVPS when BVPS is positive.',
  },
  {
    question: 'Is a P/B ratio below 1 good?',
    answer:
      'It means price is below reported book value per share, which can reflect a discount, but it does not guarantee undervaluation. Asset quality and profitability still matter.',
  },
  {
    question: 'What does a P/B ratio of 2 mean?',
    answer:
      'The market price is about twice the reported book value per common share.',
  },
  {
    question: 'Can the P/B ratio be negative?',
    answer:
      'With negative common book equity, BVPS is negative and a conventional positive P/B multiple is not meaningful for valuation comparisons.',
  },
  {
    question: 'What is book value per share?',
    answer:
      'BVPS is common book equity divided by common shares outstanding: the accounting equity attributable to each common share.',
  },
  {
    question: 'What is tangible book value?',
    answer:
      'Tangible common equity typically starts from common book equity and subtracts goodwill and other intangible assets.',
  },
  {
    question: 'What is the difference between P/B and P/E?',
    answer:
      'P/B uses balance-sheet book value; P/E uses earnings. They answer different valuation questions and can diverge when earnings or equity are distorted.',
  },
  {
    question: 'Which industries commonly use P/B ratios?',
    answer:
      'Banks, insurers, and other asset-intensive businesses often emphasize P/B, with important accounting and regulatory caveats.',
  },
  {
    question: 'Does a high P/B ratio mean a stock is overvalued?',
    answer:
      'Not necessarily. High P/B can reflect expected profitability, growth, or valuable intangibles not fully captured on the balance sheet.',
  },
  {
    question: 'How do share buybacks affect book value per share?',
    answer:
      'Effects depend on repurchase price versus BVPS and other balance-sheet impacts. Buybacks can raise or lower BVPS depending on those factors.',
  },
  {
    question: 'Why does preferred equity need to be deducted?',
    answer:
      'BVPS for common shareholders should exclude equity claims attributable to preferred stock.',
  },
];
