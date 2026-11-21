import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BUYING_POWER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Buying Power Calculator' },
  { id: 'time-affects', label: 'How Time Affects Buying Power' },
  { id: 'what-is-pp', label: 'What Is Purchasing Power?' },
  { id: 'how-it-works', label: 'How Does the Calculator Work?' },
  { id: 'step-by-step', label: 'Calculate Buying Power Step by Step' },
  { id: 'what-is-cpi', label: 'What Is the Consumer Price Index?' },
  { id: 'inflation-vs-pp', label: 'Inflation vs. Purchasing Power' },
  { id: 'nominal-vs-real', label: 'Nominal Money vs. Real Money' },
  { id: 'compare-years', label: 'Compare Money Across Years' },
  { id: 'economy', label: 'Purchasing Power and the Economy' },
  { id: 'causes', label: 'What Causes Purchasing Power to Change?' },
  { id: 'savings', label: 'How Inflation Affects Savings' },
  { id: 'vs-inflation', label: 'Buying Power vs. Inflation Calculator' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'buying-power-faq', label: 'Frequently Asked Questions' },
];

export const BUYING_POWER_FAQS: readonly FAQItem[] = [
  {
    question: 'What is buying power?',
    answer:
      'Buying power (purchasing power) is how many goods and services a unit of money can buy. When general prices rise, the same nominal amount buys less; when prices fall, it buys more.',
  },
  {
    question: 'How do you calculate buying power?',
    answer:
      'Multiply the original amount by the ratio of Consumer Price Index values: Adjusted Amount = Original Amount × (CPI_target / CPI_reference). This calculator uses US CPI-U annual averages from the BLS.',
  },
  {
    question: 'How does inflation affect buying power?',
    answer:
      'Inflation means a rising general price level. Holding a fixed nominal cash balance during inflation typically reduces what that cash can purchase, even though the face value is unchanged.',
  },
  {
    question: 'What is the purchasing power formula?',
    answer:
      'Target value = Original amount × (Target-year CPI ÷ Reference-year CPI). Cumulative inflation % = (CPI_target/CPI_reference − 1) × 100. Purchasing-power change of one nominal unit = (CPI_reference/CPI_target − 1) × 100.',
  },
  {
    question: 'What is CPI?',
    answer:
      'The Consumer Price Index measures average price change over time for a market basket of consumer goods and services. This tool uses CPI-U (all urban consumers), US city average, all items, not seasonally adjusted, annual average (series CUUR0000SA0).',
  },
  {
    question: 'How do I calculate the value of money in a different year?',
    answer:
      'Enter the amount, choose the year that amount refers to (reference year), choose the comparison year (target year), and read the adjusted dollar value. The calculator applies the CPI ratio automatically.',
  },
  {
    question: 'Why was money worth more in some earlier years?',
    answer:
      'Because the general price level was lower. A dollar in a year with a lower CPI typically commanded more goods and services than a dollar in a later high-CPI year, all else equal.',
  },
  {
    question: 'Can buying power increase over time?',
    answer:
      'Yes. During deflation or when comparing a high-CPI reference year to a lower-CPI target year, the adjusted amount for a fixed nominal sum can fall, which means one nominal dollar buys more in the target year.',
  },
  {
    question: 'What is the difference between inflation and purchasing power?',
    answer:
      'Inflation describes how price levels change. Purchasing power describes what money can buy. They move inversely for a fixed nominal amount: higher prices generally mean lower purchasing power of that cash.',
  },
  {
    question: 'How does deflation affect buying power?',
    answer:
      'Deflation is a falling general price level. A fixed nominal amount usually gains purchasing power in that environment, so the CPI-adjusted equivalent in the later year can be lower than the original amount.',
  },
  {
    question: 'What is the difference between nominal and real money?',
    answer:
      'Nominal amounts are face values in current dollars of a given year. Real amounts adjust for price-level changes so comparisons across years reflect purchasing power rather than currency face value alone.',
  },
  {
    question: 'How does purchasing power affect salaries?',
    answer:
      'A raise that trails inflation can leave real (inflation-adjusted) pay lower even if the paycheck number is higher. Comparing wages across years with CPI helps separate nominal growth from real growth.',
  },
  {
    question: 'Can this calculator compare money from any two years?',
    answer:
      'It supports any two years in the embedded US CPI-U annual series (1913 through the latest final annual average included). Years outside that range, other countries, or other CPI series are not mixed into the calculation.',
  },
  {
    question: 'How accurate are CPI-based calculations?',
    answer:
      'They accurately apply the published index ratio, but CPI is an average basket. Households, regions, and product mixes differ, so results are illustrative of general price change—not a personalized cost-of-living audit.',
  },
  {
    question: 'Is purchasing power the same as currency exchange value?',
    answer:
      'No. Domestic purchasing power compares price levels over time in one currency. Exchange rates compare currencies across countries and can move independently of domestic CPI.',
  },
  {
    question: 'How does purchasing power affect retirement planning?',
    answer:
      'Retirement spending needs are often thought of in today’s dollars. Inflation can raise the future nominal cost of the same lifestyle, so planners often translate goals across years using price indexes.',
  },
  {
    question: 'Why do different inflation calculators show different results?',
    answer:
      'They may use different CPI series (CPI-U vs CPI-W), monthly vs annual averages, base periods, revision vintages, or geographic coverage. Always check the series ID and whether values are annual averages.',
  },
  {
    question: 'Can the calculator estimate future buying power?',
    answer:
      'Only for years that have supported CPI entries in the dataset. It does not invent forecasts or treat partial current-year indexes as finalized annual averages.',
  },
  {
    question: 'What is the difference between CPI and PPI?',
    answer:
      'CPI tracks consumer purchase prices. The Producer Price Index (PPI) tracks selling prices received by domestic producers. This calculator uses CPI-U, not PPI.',
  },
  {
    question: 'How frequently is CPI updated?',
    answer:
      'BLS publishes monthly CPI figures and annual averages after a calendar year completes. This tool embeds final annual averages and is updated when those official annual values are refreshed in the dataset.',
  },
];
