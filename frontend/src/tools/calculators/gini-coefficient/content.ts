import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GINI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Gini Coefficient Calculator' },
  { id: 'what-is', label: 'What Is the Gini Coefficient?' },
  { id: 'formula', label: 'Gini Coefficient Formula' },
  { id: 'how-to', label: 'How to Calculate the Gini Coefficient' },
  { id: 'lorenz', label: 'What Is the Lorenz Curve?' },
  { id: 'read-lorenz', label: 'How to Read a Lorenz Curve' },
  { id: 'index-vs', label: 'Gini Coefficient vs. Gini Index' },
  { id: 'examples', label: 'Gini Coefficient Calculation Examples' },
  { id: 'from-incomes', label: 'How to Calculate Gini from Income Distribution' },
  { id: 'good-gini', label: 'What Is a Good Gini Coefficient?' },
  { id: 'countries', label: 'Countries with High and Low Gini Coefficients' },
  { id: 'united-states', label: 'What Is the Gini Coefficient of the United States?' },
  { id: 'inequality', label: 'Gini Coefficient and Economic Inequality' },
  { id: 'vs-gdp', label: 'Gini Coefficient vs. GDP per Capita' },
  { id: 'advantages', label: 'Advantages of the Gini Coefficient' },
  { id: 'limitations', label: 'Limitations of the Gini Coefficient' },
  { id: 'governments', label: 'How Governments Use the Gini Coefficient' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'gini-faq', label: 'Frequently Asked Questions' },
];

export const GINI_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Gini Coefficient?',
    answer:
      'It is a dimensionless inequality measure, usually between 0 and 1, summarizing how unevenly a resource such as income or wealth is distributed across a population.',
  },
  {
    question: 'How do you calculate the Gini Coefficient?',
    answer:
      'From Lorenz areas, use G = A / (A + B). From nonnegative sorted incomes, use G = 2∑(i·x_i)/(n·∑x_i) − (n+1)/n. Grouped data often estimate B with trapezoids and then G = 1 − 2B on a unit square.',
  },
  {
    question: 'What is the Gini Coefficient formula?',
    answer:
      'Primary area formula: G = A / (A + B). When the Lorenz diagram is normalized so A + B = 0.5, equivalently G = 2A = 1 − 2B.',
  },
  {
    question: 'What does a Gini Coefficient of 0 mean?',
    answer:
      'Perfect equality in the measured distribution: Area A is zero and everyone has the same share of the resource under that definition.',
  },
  {
    question: 'What does a Gini Coefficient of 1 mean?',
    answer:
      'The theoretical maximum-inequality limit in the simple area model. Finite populations may not reach exactly 1 under every Gini definition and income assumption.',
  },
  {
    question: 'Can the Gini Coefficient be negative?',
    answer:
      'Not under standard nonnegative income or wealth assumptions with conventional Lorenz constructions. Negative values usually signal a data or formula error.',
  },
  {
    question: 'What does a Gini Coefficient of 0.4 mean?',
    answer:
      'It indicates relatively high measured inequality compared with many lower-Gini distributions, but meaning still depends on income definition, unit of analysis, and context. Descriptive bands are not official standards.',
  },
  {
    question: 'What is a good Gini Coefficient?',
    answer:
      'There is no universally optimal value. Lower measured inequality is not automatically “better” without considering growth, mobility, measurement, and policy goals.',
  },
  {
    question: 'What is the difference between the Gini Coefficient and Gini Index?',
    answer:
      'The coefficient is typically 0–1; the index is the same figure × 100 (0–100). Example: 0.24 coefficient ↔ index 24.',
  },
  {
    question: 'What is a Lorenz curve?',
    answer:
      'A graph of cumulative population share (x-axis) versus cumulative income or wealth share (y-axis), starting at (0,0) and ending at (1,1).',
  },
  {
    question: 'How is the Lorenz curve related to the Gini Coefficient?',
    answer:
      'Gini is the share of the area between the equality diagonal and the Lorenz curve relative to the area under the diagonal (or A/(A+B) in the area formulation).',
  },
  {
    question: 'What happens when the Lorenz curve is a straight line?',
    answer:
      'If it coincides with the diagonal of perfect equality, Gini is 0. Any bow away from the diagonal increases measured inequality.',
  },
  {
    question: 'Can two countries have the same Gini Coefficient?',
    answer:
      'Yes. Different Lorenz shapes can share the same Gini. Always compare definitions, years, and sources before ranking.',
  },
  {
    question: 'What is the Gini Coefficient of the United States?',
    answer:
      'US figures vary by source, year, pre-tax vs after-tax-and-transfer income, and household vs person unit. Use Census, CBO, OECD, or World Bank dated series — this page does not invent a current number.',
  },
  {
    question: 'What country has the highest Gini Coefficient?',
    answer:
      'Rankings depend on year, income vs wealth, and methodology. Consult World Bank, OECD, or UN databases rather than undated lists.',
  },
  {
    question: 'What country has the lowest Gini Coefficient?',
    answer:
      'Likewise methodology-dependent. Many published low values are for disposable household income in specific years — verify the source before citing.',
  },
  {
    question: 'How does the Gini Coefficient measure income inequality?',
    answer:
      'It compresses the entire Lorenz curve of cumulative income shares into one number summarizing relative dispersion, not absolute living standards.',
  },
  {
    question: 'What is the difference between income inequality and wealth inequality?',
    answer:
      'Income is a flow (earnings, transfers) over a period; wealth is a stock of assets net of liabilities. Wealth Gini values are often much higher and are not interchangeable with income Gini.',
  },
  {
    question: 'Does a low Gini Coefficient mean a country is wealthy?',
    answer:
      'No. Gini measures dispersion, not prosperity. Low inequality can coexist with low average income, and high GDP per capita can coexist with high inequality.',
  },
  {
    question: 'What are the limitations of the Gini Coefficient?',
    answer:
      'Same Gini, different shapes; sensitivity to definitions and underreporting; weak absolute-income information; household-size and top-income measurement challenges.',
  },
  {
    question: 'How do you calculate Gini from individual incomes?',
    answer:
      'Sort nonnegative incomes ascending, then apply G = 2∑(i·x_i)/(n·∑x_i) − (n+1)/n with positive total income and at least two observations.',
  },
  {
    question: 'How do you calculate Gini from grouped data?',
    answer:
      'Build cumulative population and income shares, estimate area B under the Lorenz curve with trapezoids, then G = 1 − 2B on the unit square. Do not apply unweighted individual formulas to frequency-weighted groups.',
  },
  {
    question: 'What is the difference between the Gini Coefficient and GDP per Capita?',
    answer:
      'GDP per capita is average output per person; Gini summarizes distributional inequality. High average output does not guarantee low inequality.',
  },
  {
    question: 'Can the Gini Coefficient change over time?',
    answer:
      'Yes. Labor markets, taxes, transfers, demographics, and measurement changes can all move published Gini series.',
  },
  {
    question: 'Why is the Gini Coefficient important in economics?',
    answer:
      'It provides a compact, widely used metric for comparing inequality across places and periods and for informing debates on tax, transfer, and development policy — with clear caveats.',
  },
];
