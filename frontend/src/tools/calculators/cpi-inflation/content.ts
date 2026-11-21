import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CPI_INFLATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'CPI Inflation Calculator' },
  { id: 'what-is-cpi', label: 'What Is the Consumer Price Index?' },
  { id: 'how-cpi-calculated', label: 'How Is CPI Calculated?' },
  { id: 'cpi-formula', label: 'CPI Formula' },
  { id: 'what-is-cpi-inflation', label: 'What Is CPI Inflation?' },
  { id: 'how-to-calculate', label: 'How to Calculate CPI Inflation' },
  { id: 'adjusted-value', label: 'Inflation-Adjusted Value of Money' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'cpi-vs-inflation', label: 'CPI vs. Inflation' },
  { id: 'cpi-vs-col', label: 'CPI vs. Cost of Living' },
  { id: 'cpi-vs-gdp', label: 'CPI vs. GDP Deflator' },
  { id: 'headline-core', label: 'Headline CPI vs. Core CPI' },
  { id: 'purchasing-power', label: 'CPI and Purchasing Power' },
  { id: 'why-matters', label: 'Why Does Inflation Matter?' },
  { id: 'trends', label: 'Historical CPI Inflation Trends' },
  { id: 'limitations', label: 'Limitations of CPI' },
  { id: 'personal-finance', label: 'Inflation and Personal Finance' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'cpi-inflation-faq', label: 'Frequently Asked Questions' },
];

export const CPI_INFLATION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is CPI?',
    answer:
      'The Consumer Price Index measures average price change over time for a market basket of consumer goods and services. This tool uses US CPI-U annual averages (BLS series CUUR0000SA0).',
  },
  {
    question: 'What does CPI measure?',
    answer:
      'CPI tracks price change for a defined consumer basket for a stated population and geography — not every price in the economy and not every household’s exact spending.',
  },
  {
    question: 'How do you calculate CPI?',
    answer:
      'Agencies collect prices, apply expenditure weights, construct component indexes, and aggregate them. A simplified teaching formula is CPI_t = (Cost_t / Cost_base) × 100; official methods are more detailed.',
  },
  {
    question: 'How do you calculate inflation using CPI?',
    answer:
      'Cumulative CPI inflation % = (CPI_target / CPI_base − 1) × 100. The compound average annual rate uses (CPI_later / CPI_earlier)^(1/n) − 1.',
  },
  {
    question: 'What is the CPI inflation formula?',
    answer:
      'Equivalent amount = Original × (CPI_target / CPI_base). Cumulative inflation uses the CPI ratio minus one. Annualized inflation is a CAGR between chronologically ordered observations.',
  },
  {
    question: 'What is the difference between CPI and inflation?',
    answer:
      'CPI is an index level. Inflation is a rate of change in a price level. CPI inflation is the percent change derived from CPI observations.',
  },
  {
    question: 'What does a CPI of 300 mean?',
    answer:
      'It means the index is 300 on its reference base (for US CPI-U, commonly 1982–84 = 100). It is an index number, not a dollar price of a single good.',
  },
  {
    question: 'How do I calculate the value of money in another year?',
    answer:
      'Multiply the amount by the ratio of target-year CPI to base-year CPI from the same series and period type (here, annual averages).',
  },
  {
    question: 'What is cumulative inflation?',
    answer:
      'The total percent change in CPI between two observations, without annualizing.',
  },
  {
    question: 'What is average annual inflation?',
    answer:
      'In this calculator, the compound annual growth rate of CPI between two different years — not a simple arithmetic mean of yearly rates.',
  },
  {
    question: 'What is purchasing power?',
    answer:
      'Purchasing power is what a nominal amount of money can buy. When CPI rises, a fixed nominal sum generally buys less of the measured basket.',
  },
  {
    question: 'How does inflation reduce purchasing power?',
    answer:
      'Higher prices mean each currency unit stretches less far. Purchasing-power change % = (CPI_base / CPI_target − 1) × 100 for a forward comparison.',
  },
  {
    question: 'Can CPI inflation be negative?',
    answer:
      'Yes. A fall in CPI between observations produces a negative cumulative change (deflation over that span).',
  },
  {
    question: 'What is deflation?',
    answer:
      'A sustained decline in the general price level. Over a CPI span, that appears as a lower target CPI than base CPI.',
  },
  {
    question: 'What is disinflation?',
    answer:
      'A slowdown in the inflation rate while prices may still be rising — inflation that is positive but smaller than before.',
  },
  {
    question: 'What is the difference between CPI and the GDP deflator?',
    answer:
      'CPI focuses on consumer purchases (including many imports). The GDP deflator covers domestically produced goods and services more broadly and uses different methods and weights.',
  },
  {
    question: 'What is core CPI?',
    answer:
      'Core CPI typically excludes food and energy prices to highlight underlying inflation trends. It is not automatically a better measure of every household’s cost of living.',
  },
  {
    question: 'What is headline CPI?',
    answer:
      'Headline (all-items) CPI includes food and energy. This calculator uses all-items CPI-U annual averages.',
  },
  {
    question: 'Why does CPI matter to consumers?',
    answer:
      'It helps interpret wages, savings, pensions, and historical prices in inflation-adjusted terms and informs budgeting and policy discussions.',
  },
  {
    question: 'Does CPI represent everyone\'s actual cost of living?',
    answer:
      'No. Spending patterns, locations, and product mixes differ. CPI is a statistical average basket.',
  },
  {
    question: 'How frequently is CPI published?',
    answer:
      'BLS publishes monthly CPI figures and annual averages after a calendar year completes. This tool embeds final annual averages and notes the retrieval date.',
  },
  {
    question: 'Can I calculate inflation between two past years?',
    answer:
      'Yes, for any two years in the embedded US CPI-U annual series (1913 through the latest final annual year included).',
  },
  {
    question: 'Can I calculate inflation for future years?',
    answer:
      'Only with user-supplied custom CPI assumptions. The historical dataset does not invent forecast years as recorded observations.',
  },
  {
    question: 'What is the difference between nominal and real value?',
    answer:
      'Nominal values are face amounts in a given year’s dollars. Real (inflation-adjusted) values convert amounts across years using a price index such as CPI.',
  },
  {
    question: 'How can CPI help with salary comparisons?',
    answer:
      'Converting past wages into today’s dollars (or vice versa) with CPI separates nominal pay changes from purchasing-power changes.',
  },
];
