import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GDP_PER_CAPITA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'GDP per Capita Calculator' },
  { id: 'what-is', label: 'What Is GDP per Capita?' },
  { id: 'formula', label: 'GDP per Capita Formula' },
  { id: 'how-to', label: 'How to Calculate GDP per Capita' },
  { id: 'real-vs-nominal', label: 'Real vs. Nominal GDP per Capita' },
  { id: 'ppp', label: 'GDP per Capita at PPP' },
  { id: 'countries', label: 'Countries with the Highest GDP per Capita' },
  { id: 'united-states', label: 'GDP per Capita in the United States' },
  { id: 'growth', label: 'GDP per Capita and Economic Growth' },
  { id: 'inequality', label: 'GDP per Capita and Income Inequality' },
  { id: 'vs-income', label: 'GDP per Capita vs. Average Income' },
  { id: 'vs-gni', label: 'GDP per Capita vs. GNI per Capita' },
  { id: 'why-matters', label: 'Why GDP per Capita Matters' },
  { id: 'limitations', label: 'Limitations of GDP per Capita' },
  { id: 'examples', label: 'GDP per Capita Calculation Examples' },
  { id: 'interpret', label: 'How to Interpret Results' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'gdp-per-capita-faq', label: 'Frequently Asked Questions' },
];

export const GDP_PER_CAPITA_FAQS: readonly FAQItem[] = [
  {
    question: 'What is GDP per capita?',
    answer:
      'GDP per capita is total GDP divided by population — average economic output per person, not each person’s income or wealth.',
  },
  {
    question: 'How do you calculate GDP per capita?',
    answer:
      'Normalize GDP and population to base units, then divide GDP by population.',
  },
  {
    question: 'What is the GDP per Capita formula?',
    answer: 'GDPpc = GDP / Population.',
  },
  {
    question: 'What is real GDP per capita?',
    answer:
      'Inflation-adjusted GDP divided by population — useful for tracking volume of output per person over time.',
  },
  {
    question: 'What is nominal GDP per capita?',
    answer:
      'Current-price GDP divided by population. It mixes price and volume changes.',
  },
  {
    question: 'What is PPP-adjusted GDP per capita?',
    answer:
      'GDP converted with purchasing-power-parity factors (often international dollars) then divided by population for some cross-country comparisons.',
  },
  {
    question: 'Why is GDP per capita important?',
    answer:
      'It summarizes average output per person for development comparisons, productivity discussions, and long-run performance — with important caveats.',
  },
  {
    question: 'Is GDP per capita the same as average income?',
    answer:
      'No. It is average output, not wages, disposable income, median income, or household income.',
  },
  {
    question: 'Is high GDP per capita always good?',
    answer:
      'Not automatically. Distribution, prices, public services, environment, and non-market work also shape living standards.',
  },
  {
    question: 'What country has the highest GDP per capita?',
    answer:
      'Rankings depend on year, whether values are nominal or PPP, and whether microstates are included. Use World Bank, IMF, or OECD releases rather than undated lists.',
  },
  {
    question: 'What is the GDP per Capita of the United States?',
    answer:
      'It changes with GDP and population revisions. Look up the latest BEA/Census or international database figures for a dated value — this tool does not invent a current number.',
  },
  {
    question: 'How does population affect GDP per Capita?',
    answer:
      'For a given GDP, a larger population lowers GDP per capita. Population growth can dilute GDP growth in per-person terms.',
  },
  {
    question: 'Can GDP per Capita decrease while GDP increases?',
    answer:
      'Yes, if population grows faster than GDP. Per-person output can fall even as the total expands.',
  },
  {
    question: 'What causes GDP per Capita to increase?',
    answer:
      'Faster GDP growth than population growth — often via productivity, capital deepening, or technology — raises GDPpc.',
  },
  {
    question: 'What causes GDP per Capita to decrease?',
    answer:
      'GDP falling, population rising faster than GDP, or both can reduce GDP per capita.',
  },
  {
    question: 'How does inflation affect GDP per Capita?',
    answer:
      'Inflation raises nominal GDP per capita. Real GDP per capita removes price effects for volume comparisons over time.',
  },
  {
    question: 'What is the difference between GDP and GDP per Capita?',
    answer:
      'GDP is the total; GDP per capita divides that total by population.',
  },
  {
    question: 'What is the difference between GDP per Capita and GNI per Capita?',
    answer:
      'GDP is domestic production; GNI adjusts for net income from abroad. Per-capita versions divide each aggregate by population.',
  },
  {
    question: 'How do you calculate population using GDP per Capita?',
    answer: 'Population = GDP / GDP per Capita.',
  },
  {
    question: 'How do you calculate GDP using GDP per Capita?',
    answer: 'GDP = GDP per Capita × Population.',
  },
  {
    question: 'What is the difference between nominal and PPP GDP per Capita?',
    answer:
      'Nominal uses market exchange rates; PPP adjusts for relative price levels. They can rank economies differently.',
  },
  {
    question: 'Does GDP per Capita measure wealth?',
    answer:
      'No. Wealth is a stock of assets; GDP per capita is a flow of average output.',
  },
  {
    question: 'Does GDP per Capita measure the standard of living?',
    answer:
      'It is a rough proxy for average material resources, not a complete living-standards index.',
  },
  {
    question: 'How is GDP per Capita growth calculated?',
    answer:
      'Exactly: (1+g_pc)=(1+g_GDP)/(1+g_population). For small rates, g_pc ≈ g_GDP − g_population.',
  },
  {
    question: 'What are the limitations of GDP per Capita?',
    answer:
      'Ignores distribution, many non-market activities, environment, health/education outcomes, informal activity, and regional gaps; population estimates also revise.',
  },
];
