import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PPP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'PPP Calculator: Purchasing Power Parity' },
  { id: 'what-stands-for', label: 'What Does PPP Stand For?' },
  { id: 'what-is', label: 'What Is Purchasing Power Parity?' },
  { id: 'how-works', label: 'How Does the PPP Calculator Work?' },
  { id: 'formula', label: 'Purchasing Power Parity Formula' },
  { id: 'ppp-rate', label: 'PPP Exchange Rate Formula' },
  { id: 'vs-market', label: 'PPP vs. Market Exchange Rates' },
  { id: 'price-levels', label: 'What Are Price-Level Indices?' },
  { id: 'salary', label: 'PPP Salary Comparison' },
  { id: 'examples', label: 'Examples of Purchasing Power Parity' },
  { id: 'absolute-relative', label: 'Absolute vs. Relative PPP' },
  { id: 'why-matters', label: 'Why PPP Matters' },
  { id: 'limitations', label: 'Limitations of PPP' },
  { id: 'negotiations', label: 'PPP and Salary Negotiations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ppp-faq', label: 'Frequently Asked Questions' },
];

export const PPP_FAQS: readonly FAQItem[] = [
  {
    question: 'What is purchasing power parity?',
    answer:
      'PPP compares currencies by what they can buy of a comparable basket of goods and services, using conversion factors rather than market FX alone.',
  },
  {
    question: 'What does PPP stand for?',
    answer: 'Purchasing Power Parity.',
  },
  {
    question: 'How is PPP calculated?',
    answer:
      'Statistical agencies estimate price levels for comparable baskets. Conversion factors (often LCU per international dollar) come from programs such as the ICP / World Bank WDI.',
  },
  {
    question: 'What is a PPP exchange rate?',
    answer:
      'An implied rate E_PPP = PPP_B / PPP_A (target currency per source currency) from conversion factors; not a tradable market quote.',
  },
  {
    question: 'How do I compare salaries between two countries?',
    answer:
      'Convert with S_B = S_A × (PPP_B / PPP_A) using the same PPP measure and year, then compare carefully with taxes, housing, and local labor markets.',
  },
  {
    question: 'What is the difference between PPP and exchange rates?',
    answer:
      'Market rates clear FX markets; PPP rates reflect relative price levels. They often differ, especially with nontradable services.',
  },
  {
    question: 'Why does PPP differ from market exchange rates?',
    answer:
      'Tradable vs nontradable goods, barriers, productivity differences, and short-run FX volatility all create gaps.',
  },
  {
    question: 'What is an international dollar?',
    answer:
      'A hypothetical unit with the purchasing power of one U.S. dollar over a comparable basket; used to express PPP-adjusted amounts.',
  },
  {
    question: 'How do PPP conversion factors work?',
    answer:
      'They state how many units of local currency buy the same basket as one international dollar under the chosen measure (here: GDP PPP).',
  },
  {
    question: 'How do I calculate a PPP-adjusted salary?',
    answer:
      'S_B = S_A × (PPP_B / PPP_A), or equivalently convert to international dollars then multiply by the target factor.',
  },
  {
    question: 'How does purchasing power parity affect exchange rates?',
    answer:
      'Relative PPP theories link long-run FX moves to inflation differentials; they do not equal the cross-sectional salary formula used here.',
  },
  {
    question: 'Does PPP reflect actual cost of living?',
    answer:
      'Only in a national average sense. City prices, housing, and household baskets can diverge sharply from GDP PPP.',
  },
  {
    question: 'What is the difference between PPP and the cost-of-living index?',
    answer:
      'Cost-of-living indexes are often city- or household-focused; national PPP factors summarize economy-wide price levels for a defined aggregate.',
  },
  {
    question: 'What is a price-level index?',
    answer:
      'A normalized comparison of price levels (often vs the U.S.). One common form uses PPP relative to the market exchange rate.',
  },
  {
    question: 'How is GDP adjusted for PPP?',
    answer:
      'Nominal GDP in LCU is converted with GDP PPP factors to international dollars for cross-country volume comparisons.',
  },
  {
    question: 'What is absolute purchasing power parity?',
    answer:
      'The idea that identical baskets should cost the same when converted at the exchange rate: a strong, often violated, long-run benchmark.',
  },
  {
    question: 'What is relative purchasing power parity?',
    answer:
      'A dynamic claim that exchange-rate changes track inflation differentials over time (quotation direction matters).',
  },
  {
    question: 'Can purchasing power parity predict currency movements?',
    answer:
      'At best weakly and slowly. PPP is a poor short-run FX trading signal.',
  },
  {
    question: 'Is PPP useful for salary negotiations?',
    answer:
      'As one input among many (alongside local wages, taxes, benefits, and personal costs) not as a binding offer number.',
  },
  {
    question: 'Why is purchasing power different across countries?',
    answer:
      'Wages, productivity, nontradables, regulation, and consumption patterns differ, so price levels differ.',
  },
  {
    question: 'How often is PPP data updated?',
    answer:
      'Major ICP benchmarks are infrequent; WDI publishes annual series that can be revised. This calculator uses a curated annual snapshot, not daily updates.',
  },
  {
    question: 'Can PPP be calculated for historical years?',
    answer:
      'Yes when factors exist for that year. Always pair with same-year market rates for fair PPP-vs-market comparisons.',
  },
  {
    question: 'Does purchasing power parity account for taxes?',
    answer:
      'No. PPP is about price levels of goods/services, not net-of-tax take-home pay.',
  },
  {
    question: 'What are the limitations of PPP?',
    answer:
      'Basket differences, housing, nontradables, regional gaps, revisions, and publication lags all limit precision.',
  },
  {
    question: 'Is a higher PPP-adjusted salary always better?',
    answer:
      'Not necessarily: taxes, amenities, risk, career options, and personal preferences also matter.',
  },
];
