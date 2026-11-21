import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { meltValueTenKaratOneGramAt2000PerOzt } from './calculation';

const tenKaratExample = meltValueTenKaratOneGramAt2000PerOzt();
const tenKaratFormatted = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(tenKaratExample);

export const GOLD_MELT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-karat', label: 'What is a karat and gold purity?' },
  { id: 'how-to-calculate', label: 'How to calculate gold melt value' },
  { id: 'manual-formula', label: 'Manually calculate gold jewelry melt value' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'gold-melt-faq', label: 'Frequently asked questions' },
];

export const GOLD_MELT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the melting point of gold?',
    answer:
      'Pure gold melts at approximately 1,064°C (1,947°F). Gold alloys can melt at different temperatures depending on the other metals mixed in.',
  },
  {
    question: 'How pure is 14 karat gold?',
    answer:
      '14 ÷ 24 × 100 ≈ 58.33%. So 14K gold is about 58.33% gold by weight, with the remainder typically other metals for strength and color.',
  },
  {
    question: 'What is 10 karat gold melt value of 1 gram at $2,000 per troy ounce?',
    answer: `Convert $2,000/ozt to a per-gram price (÷ 31.1034768), multiply by purity 10/24, then by 1 gram. Illustrative result: about ${tenKaratFormatted}. $2,000 is an example price, not a live quote.`,
  },
  {
    question: 'How do I calculate gold coin melt value?',
    answer:
      'Find the coin’s actual gold weight and purity, convert the pure-gold spot price to a matching unit, then multiply pure-gold content by that price. Collectible coins may sell above melt value.',
  },
  {
    question: 'Is gold melt value the same as selling price?',
    answer:
      'Usually not. Dealers apply spreads, refining and testing costs, and fees. Jewelry may also carry design or brand premiums above intrinsic melt value.',
  },
  {
    question: 'Does gold purity affect melt value?',
    answer:
      'Yes. For the same total weight, higher purity means more actual gold content and therefore a higher melt value at the same pure-gold price.',
  },
  {
    question: 'How much is 18K gold worth compared to 24K gold?',
    answer:
      '18K is about 75% gold by weight. All else equal, 18K melt value is roughly three-quarters of the melt value of the same weight of near-pure 24K gold.',
  },
  {
    question: 'Can gold jewelry be worth more than its melt value?',
    answer:
      'Yes: craftsmanship, brand, design, antique status, and gemstones can push resale above scrap/melt estimates. Melt value is a floor estimate for the metal content only.',
  },
];
