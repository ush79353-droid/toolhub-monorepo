import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GDP_DEFLATOR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'GDP Deflator Formula Calculator' },
  { id: 'what-is', label: 'What Is the GDP Deflator?' },
  { id: 'formula', label: 'GDP Deflator Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate GDP Deflator' },
  { id: 'example', label: 'GDP Deflator Calculation Example' },
  { id: 'nominal-vs-real', label: 'Nominal GDP vs. Real GDP' },
  { id: 'nominal-from-real', label: 'Calculate Nominal GDP from Real GDP' },
  { id: 'real-from-nominal', label: 'Calculate Real GDP from Nominal GDP' },
  { id: 'inflation', label: 'Inflation Using the GDP Deflator' },
  { id: 'importance', label: 'Why the GDP Deflator Matters' },
  { id: 'vs-cpi', label: 'GDP Deflator vs. CPI' },
  { id: 'vs-pce', label: 'GDP Deflator vs. PCE' },
  { id: 'can-decrease', label: 'Can the GDP Deflator Decrease?' },
  { id: 'limitations', label: 'Limitations of the GDP Deflator' },
  { id: 'how-used', label: 'How Economists Use the GDP Deflator' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'gdp-deflator-faq', label: 'Frequently Asked Questions' },
];

export const GDP_DEFLATOR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the GDP deflator?',
    answer:
      'The GDP deflator is a broad price-level index for domestically produced final goods and services. It compares nominal GDP (current prices) with real GDP (constant prices) and is typically scaled so a reference period equals 100.',
  },
  {
    question: 'What is the GDP deflator formula?',
    answer:
      'GDP Deflator = (Nominal GDP / Real GDP) × 100. Nominal and real GDP must use compatible currency units and consistent national-accounts definitions.',
  },
  {
    question: 'How do you calculate GDP deflator?',
    answer:
      'Convert both GDP figures to the same base units, divide nominal by real, and multiply by 100. Interpret the result as an index relative to the reference level of 100.',
  },
  {
    question: 'What is the difference between nominal GDP and real GDP?',
    answer:
      'Nominal GDP values output at current prices; real GDP values output at constant reference-period prices. Nominal can rise from output growth, price growth, or both; real focuses on volume changes.',
  },
  {
    question: 'Why is the GDP deflator multiplied by 100?',
    answer:
      'Multiplying by 100 expresses the ratio as a conventional index, so the reference period reads 100 rather than 1. A reading of 125 means the measured price level is 25% above that reference.',
  },
  {
    question: 'What does a GDP deflator of 100 mean?',
    answer:
      'It means the measured overall price level for the period matches the index’s reference level (often the base year or chain-linked reference). It is not by itself a statement about year-over-year inflation.',
  },
  {
    question: 'What does a GDP deflator of 125 mean?',
    answer:
      'It means the price-level index is 25% above the reference level of 100. That is a cumulative price-level comparison under the chosen methodology; not automatically “25% inflation this year.”',
  },
  {
    question: 'Is GDP deflator the same as inflation?',
    answer:
      'No. The deflator is an index. Inflation from the GDP deflator is the percent change between two period indexes: (D_t − D_t−1) / D_t−1 × 100.',
  },
  {
    question: 'How do you calculate inflation from the GDP deflator?',
    answer:
      'Take previous and current deflator indexes and compute ((current − previous) / previous) × 100. You need at least two comparable periods; a single index is not an inflation rate.',
  },
  {
    question: 'Can the GDP deflator be less than 100?',
    answer:
      'Yes. Readings below 100 indicate a measured price level below the index reference. That can reflect a lower overall price level relative to the base or reference methodology.',
  },
  {
    question: 'Can the GDP deflator be negative?',
    answer:
      'Not under standard national accounts with positive GDP values. The index is a scaled ratio of two non-negative GDP aggregates; a negative deflator would not be economically meaningful here.',
  },
  {
    question: 'What happens when nominal GDP exceeds real GDP?',
    answer:
      'The deflator exceeds 100, indicating a higher measured price level than the reference. Output valued at current prices exceeds the same volumes valued at reference prices.',
  },
  {
    question: 'Why do economists use the GDP deflator?',
    answer:
      'It helps convert nominal GDP into real GDP, summarize economy-wide domestic price changes, and support growth and inflation analysis alongside other indexes such as CPI and PCE.',
  },
  {
    question: 'What is the difference between GDP deflator and CPI?',
    answer:
      'CPI tracks a consumer basket (including many imports). The GDP deflator covers domestically produced final output, including investment and government purchases, and generally excludes imported consumer goods as domestic production.',
  },
  {
    question: 'Does GDP deflator include imports?',
    answer:
      'Imported goods are not treated as domestic production. CPI can rise with import prices that the GDP deflator may not reflect the same way because GDP measures domestic value added and final domestic output.',
  },
  {
    question: 'What are the limitations of GDP deflator?',
    answer:
      'Revisions, chain-weighting complexities, coverage gaps, differences from household cost-of-living measures, and inconsistent historical series all require careful interpretation.',
  },
  {
    question: 'How can real GDP be calculated using GDP deflator?',
    answer:
      'Real GDP = (Nominal GDP × 100) / GDP Deflator, when the deflator is positive and definitions match.',
  },
  {
    question: 'How do you calculate nominal GDP using GDP deflator?',
    answer:
      'Nominal GDP = Real GDP × (GDP Deflator / 100), again requiring consistent units and accounts definitions.',
  },
];
