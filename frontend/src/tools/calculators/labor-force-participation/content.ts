import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LFPR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Labor Force Participation Rate Calculator' },
  { id: 'what-is', label: 'What Is the Labor Force Participation Rate?' },
  { id: 'labor-force', label: 'What Does Labor Force Mean?' },
  { id: 'formula', label: 'Labor Force Participation Rate Formula' },
  { id: 'how-to', label: 'How to Calculate the Labor Force Participation Rate' },
  { id: 'how-labor-force', label: 'How to Calculate the Labor Force' },
  { id: 'how-unemployment', label: 'How to Calculate the Unemployment Rate' },
  { id: 'vs-unemployment', label: 'LFPR vs. Unemployment Rate' },
  { id: 'working-age', label: 'What Is the Working-Age Population?' },
  { id: 'not-in-lf', label: 'Who Is Not Included in the Labor Force?' },
  { id: 'why-important', label: 'Why Is Labor Force Participation Important?' },
  { id: 'what-affects', label: 'What Affects the Labor Force Participation Rate?' },
  { id: 'growth', label: 'Labor Force Participation and Economic Growth' },
  { id: 'gdp', label: 'Labor Force Participation and GDP' },
  { id: 'aging', label: 'Labor Force Participation and Population Aging' },
  { id: 'countries', label: 'Labor Force Participation in Different Countries' },
  { id: 'trends', label: 'Labor Force Participation Rate Trends' },
  { id: 'good-rate', label: 'What Is a Good Labor Force Participation Rate?' },
  { id: 'limitations', label: 'Labor Force Participation Rate Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'lfpr-faq', label: 'Frequently Asked Questions' },
];

export const LFPR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the labor force participation rate?',
    answer:
      'LFPR is the share of a defined population (often working-age or civilian noninstitutional) that is in the labor force — employed or unemployed under the applicable definition.',
  },
  {
    question: 'How do I calculate the labor force participation rate?',
    answer:
      'Add employed and unemployed people to get the labor force, divide by the relevant population, and multiply by 100.',
  },
  {
    question: 'What is the labor force participation rate formula?',
    answer:
      'LFPR = (Employed + Unemployed) / Working-age (or coverage) Population × 100.',
  },
  {
    question: 'What is the labor force?',
    answer:
      'The labor force is employed people plus unemployed people who meet job-search and availability criteria. It excludes many nonparticipants.',
  },
  {
    question: 'What is the working-age population?',
    answer:
      'The population used as the LFPR denominator. Definitions vary (e.g., US civilian noninstitutional 16+, ages 15+, or 15–64). Always match numerator and denominator coverage.',
  },
  {
    question: 'What does employed population mean?',
    answer:
      'People who have a job under the survey’s employment rules (often including temporary absence from work). Exact rules depend on the statistical agency.',
  },
  {
    question: 'What does unemployed population mean?',
    answer:
      'People without a job who meet the agency’s criteria for seeking work and being available — not everyone who is jobless.',
  },
  {
    question: 'What is the difference between labor force and employment?',
    answer:
      'Employment is only people with jobs. The labor force also includes unemployed people who meet official criteria.',
  },
  {
    question: 'What is the difference between unemployment rate and participation rate?',
    answer:
      'Unemployment rate = Unemployed / Labor force. LFPR = Labor force / Relevant population. Different denominators answer different questions.',
  },
  {
    question: 'Can labor force participation exceed 100%?',
    answer:
      'Not when numerator and denominator describe the same consistent population and period. Values above 100% signal inconsistent inputs or definitions.',
  },
  {
    question: 'Can labor force participation be 0%?',
    answer:
      'Yes, if nobody in the defined population is employed or unemployed under the survey rules — rare for large national populations but possible in a constructed example.',
  },
  {
    question: 'What is a good labor force participation rate?',
    answer:
      'There is no universal target. Interpretation depends on age structure, retirement norms, education, opportunities, and population coverage.',
  },
  {
    question: 'Why does labor force participation decrease?',
    answer:
      'Aging, retirement, schooling, caregiving, health, discouraged job search, and policy changes can all reduce measured participation.',
  },
  {
    question: 'Why does labor force participation increase?',
    answer:
      'Stronger job opportunities, higher wages, later retirement, immigration of working-age people, and more women entering paid work are common drivers.',
  },
  {
    question: 'How does retirement affect labor force participation?',
    answer:
      'Retirees who stop working and stop seeking work leave the labor force, lowering participation if they remain in the coverage population.',
  },
  {
    question: 'How does education affect labor force participation?',
    answer:
      'Full-time students may be outside the labor force; higher educational attainment can raise later-life participation and employment odds.',
  },
  {
    question: 'How does population aging influence participation?',
    answer:
      'A larger share of older people typically lowers aggregate LFPR even if age-specific rates are stable, because older groups participate less on average.',
  },
  {
    question: 'Does labor force participation include unemployed people?',
    answer:
      'Yes. Unemployed people who meet the survey definition are part of the labor force and therefore counted in LFPR.',
  },
  {
    question: 'Are retired people included in the labor force?',
    answer:
      'Usually not, if they are neither working nor actively seeking work under survey rules. They may still be in the LFPR denominator.',
  },
  {
    question: 'Are students included in the labor force?',
    answer:
      'Only if they are employed or meet unemployment criteria. Many full-time students are outside the labor force.',
  },
  {
    question: 'What is the employment-to-population ratio?',
    answer:
      'Employed / Relevant population × 100. It ignores unemployment by focusing only on job holders relative to the population.',
  },
  {
    question: 'How is unemployment calculated?',
    answer:
      'Unemployment rate = Unemployed / Labor force × 100. It is unavailable when the labor force is zero.',
  },
  {
    question: 'Why is labor force participation important?',
    answer:
      'It summarizes labor supply available for production, complements unemployment data, and helps interpret demographic and cyclical labor-market changes.',
  },
  {
    question: 'How does labor force participation affect the economy?',
    answer:
      'Higher participation can expand potential labor input and output, but productivity, hours, and job quality also matter.',
  },
  {
    question: 'How does labor force participation relate to GDP?',
    answer:
      'More participants can raise potential GDP through greater labor input, holding productivity and hours fixed — see also GDP growth and productivity tools.',
  },
  {
    question: 'Why can unemployment fall while participation also falls?',
    answer:
      'If people leave the labor force (stop seeking work), the unemployment rate can drop even as employment and participation weaken.',
  },
  {
    question: 'How do national statistical agencies measure labor force participation?',
    answer:
      'Through household labor-force surveys with precise employment, unemployment, and population coverage rules (e.g., BLS Current Population Survey in the US).',
  },
  {
    question: 'What countries have high labor force participation rates?',
    answer:
      'Rankings depend on year, age definition, and source (ILO, OECD, national agencies). This page does not invent undated country lists.',
  },
  {
    question: 'What countries have low labor force participation rates?',
    answer:
      'Likewise methodology-dependent. Compare only series with matching definitions and years from authoritative databases.',
  },
  {
    question: 'How can labor force participation improve?',
    answer:
      'Policies and conditions that support childcare, health, education-to-work transitions, inclusive hiring, and later-life work can raise participation — effects vary by context.',
  },
];
