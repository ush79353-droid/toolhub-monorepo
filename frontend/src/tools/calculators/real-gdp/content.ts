import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const REAL_GDP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Real GDP Calculator' },
  { id: 'what-is-real-gdp', label: 'What Is Real GDP?' },
  { id: 'real-vs-nominal-gdp', label: 'Real GDP vs. Nominal GDP' },
  { id: 'real-gdp-formula', label: 'Real GDP Formula' },
  { id: 'calculate-real-gdp', label: 'How to Calculate Real GDP' },
  { id: 'gdp-deflator', label: 'What Is the GDP Deflator?' },
  { id: 'calculate-deflator', label: 'How to Calculate the GDP Deflator' },
  { id: 'nominal-from-real', label: 'Nominal GDP from Real GDP' },
  { id: 'real-gdp-growth', label: 'Real GDP Growth Rate' },
  { id: 'real-gdp-per-capita', label: 'Real GDP per Capita' },
  { id: 'why-matters', label: 'Why Real GDP Matters' },
  { id: 'inflation-effects', label: 'How Inflation Affects GDP' },
  { id: 'recessions', label: 'Real GDP and Recessions' },
  { id: 'cross-country', label: 'Comparing Across Countries' },
  { id: 'limitations', label: 'Limitations of Real GDP' },
  { id: 'business-investors', label: 'Businesses and Investors' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'real-gdp-faq', label: 'Frequently Asked Questions' },
];

export const REAL_GDP_FAQS: readonly FAQItem[] = [
  {
    question: 'What is real GDP?',
    answer:
      'Real GDP is the value of final goods and services produced in an economy measured at constant (base-year or reference) prices. It adjusts for changes in the overall price level so analysts can focus on changes in quantities produced.',
  },
  {
    question: 'How do you calculate real GDP?',
    answer:
      'Divide nominal GDP by the GDP deflator and multiply by 100: Real GDP = (Nominal GDP / GDP Deflator) × 100. Keep currency and magnitude units consistent before dividing.',
  },
  {
    question: 'What is the real GDP formula?',
    answer:
      'Real GDP = (Nominal GDP / GDP Deflator) × 100. Rearrangements: Nominal GDP = (Real GDP × GDP Deflator) / 100 and GDP Deflator = (Nominal GDP / Real GDP) × 100.',
  },
  {
    question: 'What is the difference between nominal GDP and real GDP?',
    answer:
      'Nominal GDP uses current prices; real GDP uses constant prices. Nominal can rise because of more output, higher prices, or both. Real GDP isolates the volume of production after removing price-level effects measured by the deflator.',
  },
  {
    question: 'What is a GDP deflator?',
    answer:
      'The GDP deflator is a broad price index that compares nominal GDP with real GDP. It is typically scaled so a base or reference year equals 100 and covers domestically produced final goods and services.',
  },
  {
    question: 'How do you calculate the GDP deflator?',
    answer:
      'GDP Deflator = (Nominal GDP / Real GDP) × 100. A reading of 125 means the measured aggregate price level is 25% above the base-year level under that index methodology.',
  },
  {
    question: 'Why do economists use real GDP?',
    answer:
      'Real GDP helps measure economic growth, track business cycles, compare output across periods, and support fiscal and monetary analysis without confusing price changes with quantity changes.',
  },
  {
    question: 'Can real GDP be higher than nominal GDP?',
    answer:
      'Yes. When the GDP deflator is below 100, real GDP exceeds nominal GDP because the measured price level is below the base-year level. That can occur after deflation relative to the base or when the base year is later than the period measured.',
  },
  {
    question: 'Can the GDP deflator be below 100?',
    answer:
      'Yes. Values below 100 are valid and mean the aggregate price level is below the base-year reference of 100. This calculator rejects only non-positive deflators.',
  },
  {
    question: 'What does a GDP deflator of 125 mean?',
    answer:
      'It means the measured price level is 25% above the base-year level (100). It is a cumulative price-level comparison under the chosen methodology — not automatically “25% inflation in the latest year.”',
  },
  {
    question: 'How do you calculate real GDP growth?',
    answer:
      'g = (R_t − R_{t−1}) / R_{t−1} × 100, where R_t is current-period real GDP and R_{t−1} is previous-period real GDP. Example: 20 to 21 trillion → 5% real growth.',
  },
  {
    question: 'How do you calculate real GDP per capita?',
    answer:
      'Real GDP per capita = Real GDP / Population. It is a rough measure of average economic output per person, not a direct measure of household income, inequality, or living standards.',
  },
  {
    question: 'Does real GDP account for inflation?',
    answer:
      'Yes. Real GDP removes the effect of changes in the overall price level measured by the GDP deflator (or equivalent constant-price methods), so period-to-period changes reflect real output more closely than nominal GDP alone.',
  },
  {
    question: 'How does inflation affect nominal GDP?',
    answer:
      'Rising prices raise the current-dollar value of the same basket of goods and services, so nominal GDP can grow even when physical output is unchanged. Real GDP is designed to strip out that price effect.',
  },
  {
    question: 'Can nominal GDP grow while real GDP falls?',
    answer:
      'Yes. If prices rise faster than volumes fall, nominal GDP can increase while real GDP declines. That pattern can appear during stagflationary or high-inflation periods with contracting real activity.',
  },
  {
    question: "What is the GDP deflator's base year?",
    answer:
      'The base or reference year is the period assigned an index value of 100. Statistical agencies periodically update base years or use chain-linking; always check the series documentation for the reference methodology.',
  },
  {
    question: 'What is the difference between CPI and the GDP deflator?',
    answer:
      'CPI tracks a consumer basket (often including imports). The GDP deflator covers domestically produced final output, including investment and government purchases, and generally excludes imported consumer goods as domestic production.',
  },
  {
    question: 'Does real GDP measure living standards?',
    answer:
      'Only roughly. Real GDP and real GDP per capita omit unpaid work, environmental costs, leisure, inequality, and many non-market aspects of well-being. They measure market output, not happiness or welfare.',
  },
  {
    question: 'Can real GDP be negative?',
    answer:
      'In standard national accounts with nonnegative nominal GDP and a positive deflator, real GDP is nonnegative. This calculator uses a simplified nonnegative-GDP model and rejects negative GDP inputs.',
  },
  {
    question: 'How does monetary policy affect real GDP?',
    answer:
      'Central banks influence short-term interest rates, credit conditions, and inflation expectations. Those channels can affect spending, investment, and employment, and therefore real GDP over the business cycle — with lags and uncertainty. This calculator does not forecast policy outcomes.',
  },
];
