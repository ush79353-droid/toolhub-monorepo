import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GDP_GROWTH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'GDP Growth Rate Calculator' },
  { id: 'what-is', label: 'What Is GDP Growth Rate?' },
  { id: 'formula', label: 'GDP Growth Rate Formula' },
  { id: 'how-to', label: 'How to Calculate Economic Growth Rate' },
  { id: 'examples', label: 'GDP Growth Rate Calculation Examples' },
  { id: 'real-growth', label: 'What Is Real GDP Growth?' },
  { id: 'nominal-vs-real', label: 'Nominal vs. Real GDP Growth' },
  { id: 'quarterly-vs-annual', label: 'Quarterly vs. Annual GDP Growth' },
  { id: 'business-cycle', label: 'GDP Growth and the Business Cycle' },
  { id: 'why-matters', label: 'Why GDP Growth Matters' },
  { id: 'inflation', label: 'GDP Growth and Inflation' },
  { id: 'vs-gap', label: 'GDP Growth vs. GDP Gap' },
  { id: 'per-capita', label: 'GDP Growth and GDP per Capita' },
  { id: 'factors', label: 'Factors Affecting GDP Growth' },
  { id: 'limitations', label: 'Limitations of GDP Growth' },
  { id: 'facts', label: 'Interesting Facts About GDP Growth' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'gdp-growth-faq', label: 'Frequently Asked Questions' },
];

export const GDP_GROWTH_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the GDP growth rate?',
    answer:
      'The percentage change in GDP between two periods, relative to the earlier period’s GDP.',
  },
  {
    question: 'How do you calculate GDP growth rate?',
    answer:
      'Subtract previous GDP from current GDP, divide by previous GDP, and multiply by 100.',
  },
  {
    question: 'What is the GDP growth formula?',
    answer:
      'Growth (%) = ((GDP_current − GDP_previous) / GDP_previous) × 100. The denominator is previous GDP.',
  },
  {
    question: 'What is a good GDP growth rate?',
    answer:
      'There is no universal “good” rate. Context depends on development stage, population growth, inflation, and capacity. Treat benchmarks as country- and period-specific.',
  },
  {
    question: 'What does negative GDP growth mean?',
    answer:
      'GDP fell versus the previous period. For real GDP, that is a contraction in measured output. One negative period does not automatically define a recession.',
  },
  {
    question: 'What does zero GDP growth mean?',
    answer:
      'Current GDP equals previous GDP under the chosen measure; no percentage change between those two observations.',
  },
  {
    question: 'Can GDP growth exceed 100%?',
    answer:
      'Yes, if current GDP is more than twice previous GDP. Check data quality and whether the base was unusually low.',
  },
  {
    question: 'Can GDP growth be below -100%?',
    answer:
      'Not while both GDP levels stay positive under this formula. Growth ≤ −100% would imply non-positive current GDP when starting from positive previous GDP.',
  },
  {
    question: 'What is the difference between real and nominal GDP growth?',
    answer:
      'Real growth adjusts for price changes; nominal growth includes prices and volumes. Nominal can rise even when real output is flat.',
  },
  {
    question: 'Why is real GDP used to measure economic growth?',
    answer:
      'It better tracks changes in production volume by controlling for inflation, which is usually the intent of “economic growth.”',
  },
  {
    question: 'What is quarterly GDP growth?',
    answer:
      'Growth between quarterly GDP observations; often quarter-over-quarter or year-over-year. Those rates are not interchangeable without converting periods.',
  },
  {
    question: 'What is annual GDP growth?',
    answer:
      'Growth between annual GDP totals (or annual averages), typically year-over-year for annual series.',
  },
  {
    question: 'How do you annualize quarterly GDP growth?',
    answer:
      'For consecutive quarterly levels: ((Current/Previous)^4 − 1) × 100. Label it annualized QoQ; it is not the same as the raw quarterly percent change.',
  },
  {
    question: 'How does GDP growth affect employment?',
    answer:
      'Stronger growth often supports job creation over time, but the link varies with productivity, labor-force participation, and sector mix.',
  },
  {
    question: 'Does negative GDP growth mean recession?',
    answer:
      'Not by itself. Recessions are usually defined by broader criteria (for example sustained declines or committee dating), not a single growth print.',
  },
  {
    question: 'What is the difference between GDP growth and GDP gap?',
    answer:
      'Growth compares GDP across time. The GDP gap compares actual GDP with estimated potential GDP at a point in time.',
  },
  {
    question: 'How does inflation affect GDP growth?',
    answer:
      'Inflation raises nominal GDP. Real growth strips out price effects (often via a GDP deflator). Growth and inflation remain distinct concepts.',
  },
  {
    question: 'How do you calculate previous GDP from current GDP and growth rate?',
    answer:
      'Previous = Current / (1 + g/100), with g > −100%.',
  },
  {
    question: 'How do you calculate future GDP using a growth rate?',
    answer:
      'Future ≈ Previous × (1 + g/100) for one period, or compound for multiple periods if the rate is assumed constant.',
  },
  {
    question: 'What is the difference between GDP growth and GDP per capita growth?',
    answer:
      'Total GDP growth can be high while per-person growth is lower if population rises quickly. Per capita focuses on average output per person.',
  },
  {
    question: 'What is compound GDP growth?',
    answer:
      'Multi-period growth that multiplies period factors: ending = starting × ∏(1 + g_t). Average compound rates summarize paths over many years.',
  },
  {
    question: 'What are the limitations of GDP growth?',
    answer:
      'GDP omits distribution, many aspects of well-being, unpaid work, and full environmental costs; data revise; short-run series can be volatile.',
  },
  {
    question: 'Why do countries have different GDP growth rates?',
    answer:
      'Differences in productivity, investment, demographics, institutions, trade, and cyclical position all matter, plus measurement methods.',
  },
  {
    question: 'How often is GDP growth reported?',
    answer:
      'Many statistical agencies publish quarterly and annual GDP; flash estimates and revisions are common. Frequency varies by country.',
  },
  {
    question: 'What happens when GDP growth slows but remains positive?',
    answer:
      'The economy is still expanding, but more slowly. That can coincide with softer labor markets or cooling demand without a contraction.',
  },
];
