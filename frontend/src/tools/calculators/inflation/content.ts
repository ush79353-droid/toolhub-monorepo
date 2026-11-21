import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INFLATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Inflation Calculator' },
  { id: 'what-is', label: 'What Is Inflation?' },
  { id: 'inflation-rate', label: 'What Is the Inflation Rate?' },
  { id: 'how-to-rate', label: 'How to Calculate the Inflation Rate' },
  { id: 'adjusted-value', label: 'How to Calculate Inflation-Adjusted Value' },
  { id: 'how-to-use', label: 'How to Use the Inflation Calculator' },
  { id: 'purchasing-power', label: 'What Is Purchasing Power?' },
  { id: 'cpi', label: 'Inflation and the Consumer Price Index' },
  { id: 'financial', label: 'Inflation in a Financial Context' },
  { id: 'savings', label: 'How Inflation Affects Savings' },
  { id: 'interest', label: 'Inflation and Interest Rates' },
  { id: 'wages', label: 'Inflation and Wages' },
  { id: 'deflation', label: 'What Is Deflation?' },
  { id: 'hyperinflation', label: 'What Is Hyperinflation?' },
  { id: 'hyper-examples', label: 'Historical Examples of Hyperinflation' },
  { id: 'investments', label: 'Inflation and Investments' },
  { id: 'vs-col', label: 'Inflation vs. Cost of Living' },
  { id: 'vs-pp', label: 'Inflation vs. Purchasing Power' },
  { id: 'vs-deflation', label: 'Inflation vs. Deflation vs. Disinflation' },
  { id: 'limitations', label: 'Limitations of Inflation Calculators' },
  { id: 'why-matters', label: 'Why Inflation Matters' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'inflation-faq', label: 'Frequently Asked Questions' },
];

export const INFLATION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is inflation?',
    answer:
      'Inflation is a sustained rise in the general price level of goods and services, which reduces the purchasing power of a currency unit over time.',
  },
  {
    question: 'How do you calculate inflation?',
    answer:
      'Using price indexes: Inflation Rate = ((CPI_new − CPI_old) / CPI_old) × 100. To adjust money: Adjusted = Amount × (CPI_target / CPI_reference).',
  },
  {
    question: 'What is the inflation rate formula?',
    answer:
      'Inflation Rate = ((CPI_new − CPI_old) / CPI_old) × 100. Cumulative change between periods uses the same ratio framework.',
  },
  {
    question: 'What is the Consumer Price Index?',
    answer:
      'CPI measures average price change for a market basket of consumer goods and services. This tool’s historical mode uses US CPI-U annual averages (BLS CUUR0000SA0).',
  },
  {
    question: 'How does an inflation calculator work?',
    answer:
      'Historical mode multiplies an amount by the ratio of two CPI observations. Custom mode compounds a user-chosen annual rate over a time span as an estimate.',
  },
  {
    question: 'How do I calculate inflation between two years?',
    answer:
      'Select both years, look up each year’s CPI, then compute ((CPI_later/CPI_earlier) − 1) × 100 for cumulative inflation, or adjust an amount with the CPI ratio.',
  },
  {
    question: 'What is cumulative inflation?',
    answer:
      'The total percentage change in the price index between two periods: ((CPI_target / CPI_reference) − 1) × 100. It can be negative if prices fell.',
  },
  {
    question: 'What is average annual inflation?',
    answer:
      'A compound annualized rate over elapsed years t: (CPI_target / CPI_reference)^(1/t) − 1. It is not the arithmetic average of yearly rates.',
  },
  {
    question: 'How does inflation affect purchasing power?',
    answer:
      'Positive inflation means each dollar buys fewer goods over time. The purchasing-power factor 1/(1+r)^t (custom) or CPI_ref/CPI_target (historical) summarizes remaining power of money held without return.',
  },
  {
    question: 'How much will $1,000 be worth in 10 years?',
    answer:
      'It depends on the assumed inflation path. At a constant 5% annual rate, about $1,628.89 would be needed for equal purchasing power; $1 held would keep roughly 61.4% of its power.',
  },
  {
    question: 'What is the difference between inflation and deflation?',
    answer:
      'Inflation is a rising general price level; deflation is a falling general price level (negative inflation rate).',
  },
  {
    question: 'What is disinflation?',
    answer:
      'Disinflation is a slowdown in the inflation rate while prices may still be rising; not the same as deflation.',
  },
  {
    question: 'What causes inflation?',
    answer:
      'Common drivers include demand outpacing supply, cost shocks, expectations, and monetary expansion. Causes vary by episode and country.',
  },
  {
    question: 'What is hyperinflation?',
    answer:
      'Extremely rapid, out-of-control price increases that severely erode currency value. Definitions vary; classic cases include Weimar Germany, postwar Hungary, and Zimbabwe.',
  },
  {
    question: 'What is the difference between nominal and real value?',
    answer:
      'Nominal values are measured in current dollars; real values adjust for price-level changes to compare purchasing power across time.',
  },
  {
    question: 'How does inflation affect savings?',
    answer:
      'If cash earns less than inflation, real purchasing power falls even if the nominal balance is unchanged.',
  },
  {
    question: 'How does inflation affect wages?',
    answer:
      'Nominal wage growth can look strong while real wages stagnate if inflation is higher. Cost-of-living adjustments try to offset price rises.',
  },
  {
    question: 'How does inflation affect retirement savings?',
    answer:
      'Long horizons magnify purchasing-power risk. Plans often target real returns after inflation, not only nominal balances.',
  },
  {
    question: 'How does inflation affect investments?',
    answer:
      'It influences real returns on stocks, bonds, cash, and real assets differently. No asset class guarantees inflation protection in every period.',
  },
  {
    question: 'What is the difference between CPI and inflation?',
    answer:
      'CPI is a price index level; inflation is the rate of change in that index (or another price measure) over time.',
  },
  {
    question: 'Can inflation be negative?',
    answer:
      'Yes: that is deflation, when the general price level falls between the compared periods.',
  },
  {
    question: 'Can the inflation rate exceed 100%?',
    answer:
      'Yes. Rates above 100% mean prices more than doubled over the measured interval; hyperinflation episodes can be far higher.',
  },
  {
    question: 'How do I calculate future inflation?',
    answer:
      'Future paths are uncertain. Custom mode compounds an assumed annual rate: FV = PV(1+r)^t. Treat results as estimates, not forecasts.',
  },
  {
    question: 'How do I calculate past purchasing power?',
    answer:
      'Use historical CPI: Adjusted = Amount × (CPI_target / CPI_reference) with verified index values for both periods.',
  },
  {
    question: 'Why can my personal inflation rate differ from official inflation?',
    answer:
      'Household baskets, regions, housing, and healthcare shares differ from the national CPI basket, so personal experience can diverge from the published rate.',
  },
];
