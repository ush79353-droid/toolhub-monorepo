import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const UNEMPLOYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-unemployment-rate', label: 'What Is the Unemployment Rate?' },
  { id: 'unemployment-formula', label: 'Formulas' },
  { id: 'who-counts-as-unemployed', label: 'Who Counts as Unemployed?' },
  { id: 'population-units', label: 'Population Units' },
  { id: 'labor-force-participation', label: 'Labor Force Participation' },
  { id: 'worked-example', label: 'Worked Example' },
  { id: 'related-calculators', label: 'Related Calculators' },
  { id: 'unemployment-faq', label: 'Frequently Asked Questions' },
];

export const UNEMPLOYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the unemployment rate?',
    answer:
      'The unemployment rate is the share of the labor force that is unemployed. Labor force means employed people plus unemployed people. People outside the labor force (not working and not actively seeking work) are not included in the rate.',
  },
  {
    question: 'Who counts as unemployed?',
    answer:
      'Under standard labor-market definitions (for example, BLS / ILO-style concepts), unemployed people are those without a job who are available for work and actively seeking employment. Not everyone without a job is unemployed; retirees, full-time students not seeking work, and other non-participants are outside the labor force.',
  },
  {
    question: 'How do population units work?',
    answer:
      'Each population field has a people / thousand / million selector. Amounts are converted to a count of people before formulas run. Changing a unit preserves the underlying population. Percentages (unemployment rate and participation rate) are never unit-converted.',
  },
  {
    question: 'Can I enter any two of employed, unemployed, and labor force?',
    answer:
      'Yes. Enter any two consistent values and the calculator derives the third when possible. If all three are filled, employed + unemployed must equal the labor force (within ordinary rounding). Zero is a valid count.',
  },
  {
    question: 'What if the labor force is zero?',
    answer:
      'An unemployment rate is undefined when the labor force is zero, because the formula divides by the labor force. The calculator reports that case instead of inventing a percentage.',
  },
  {
    question: 'What is the labor force participation rate?',
    answer:
      'Optional section: Labor Force Participation Rate (%) = Labor Force ÷ Working-Age Population × 100. Working-age population must be greater than zero and at least as large as the labor force. A separate Labor Force Participation Rate Calculator exists for the dedicated tool page.',
  },
];
