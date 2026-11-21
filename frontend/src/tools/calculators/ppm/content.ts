import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PPM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-calculate', label: 'How to Calculate PPM and Percents' },
  { id: 'ppm-example', label: 'PPM Conversion: An Example' },
  { id: 'ppm-table', label: 'PPM Conversion Table' },
  { id: 'where-used', label: 'Where Is PPM Used?' },
  { id: 'ppm-calculator-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const PPM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-calculate',
    title: 'How to Calculate PPM and Percents',
    paragraphs: [
      'A dimensionless decimal ratio is the shared base for percent, per mille, parts per million (ppm), parts per billion (ppb), and parts per trillion (ppt). Multiply the ratio by the matching scale factor to express the same proportion in another unit.',
      'Percent = Ratio × 100. Per mille = Ratio × 1,000. PPM = Ratio × 1,000,000. PPB = Ratio × 1,000,000,000. PPT = Ratio × 1,000,000,000,000. Divide by the same factors to go back to the ratio.',
      'Useful identities: 1% = 10,000 ppm, 1‰ = 1,000 ppm, 1 ppm = 1,000 ppb, 1 ppb = 1,000 ppt, and 1 ppm = 0.0001%. Percentages and PPM both describe proportions; PPM is preferred for very dilute concentrations.',
    ],
    formula: 'PPM = Ratio × 1,000,000 · Percent = Ratio × 100 · 1% = 10,000 ppm',
  },
  {
    id: 'ppm-example',
    title: 'PPM Conversion: An Example',
    paragraphs: [
      'Mass-by-mass example: a solution contains 0.005 g of a dissolved substance in a total solution mass of 1,000 g. The mass fraction is 0.005 ÷ 1,000 = 0.000005.',
      'As a percent that is 0.0005%. As ppm it is 5 ppm. As ppb it is 5,000 ppb. As ppt it is 5,000,000 ppt.',
      'PPM may represent a mass fraction, mole fraction, or volume fraction depending on context. It is a dimensionless proportion unless the measurement basis is stated. In dilute aqueous solutions, 1 mg/L is often approximately 1 ppm by mass when density is near 1 kg/L; that approximation is not universal. This calculator converts proportions and does not convert mass-concentration units without additional density information.',
    ],
  },
  {
    id: 'ppm-table',
    title: 'PPM Conversion Table',
    paragraphs: ['Selected ratios with matching percent, ppm, and ppb values:'],
    tableHeaders: ['Ratio', 'Percent', 'PPM', 'PPB'],
    table: [
      ['1', '100%', '1,000,000', '1,000,000,000'],
      ['0.1', '10%', '100,000', '100,000,000'],
      ['0.01', '1%', '10,000', '10,000,000'],
      ['0.001', '0.1%', '1,000', '1,000,000'],
      ['0.0001', '0.01%', '100', '100,000'],
      ['0.00001', '0.001%', '10', '10,000'],
      ['0.000001', '0.0001%', '1', '1,000'],
    ],
  },
  {
    id: 'where-used',
    title: 'Where Is PPM Used?',
    paragraphs: [
      'PPM appears in water quality, environmental monitoring, air pollutant reporting, chemistry, industrial manufacturing, food production, agriculture, and laboratory analysis.',
      'Always name the substance and the measurement basis (mass, volume, or mole) when reporting a concentration. Context determines whether a ppm figure is meaningful for a given process or regulation.',
    ],
  },
];

export const PPM_FAQS: readonly FAQItem[] = [
  {
    question: 'What Are PPMs?',
    answer:
      'PPM means parts per million; one part of a quantity per one million parts of the whole. It is a dimensionless proportion scaled by 10⁶.',
  },
  {
    question: 'What Are PPMs of CO₂?',
    answer:
      'Atmospheric CO₂ is commonly reported as a mole fraction in ppm (CO₂ molecules per million air molecules). Exact current values change over time; use a trusted atmospheric data source for the latest reading.',
  },
  {
    question: 'How Do I Calculate PPM from a Percentage?',
    answer: 'PPM = Percent × 10,000. Example: 0.12% = 1,200 ppm.',
  },
  {
    question: 'How Do I Convert Parts Per Notation?',
    answer:
      'Convert to the decimal ratio first, then scale. Each step of 1,000 moves between ppm, ppb, and ppt (1 ppm = 1,000 ppb = 1,000,000 ppt).',
  },
  {
    question: 'How Many PPM Are in a 0.05% Solution?',
    answer: '0.05 × 10,000 = 500 ppm.',
  },
  {
    question: 'What Is the Difference Between PPM and PPB?',
    answer: '1 ppm = 1,000 ppb. PPB is one-thousandth of a ppm.',
  },
  {
    question: 'Can PPM Be Greater Than One Million?',
    answer:
      'Numerically yes if the underlying ratio exceeds 1 (more than 100%). That may be a valid scale conversion, but it is not a conventional part-to-whole concentration.',
  },
  {
    question: 'Is 1 PPM Equal to 1 mg/L?',
    answer:
      'Approximately for dilute aqueous mass concentrations when solution density is near 1 kg/L. It is not a general identity for all liquids or all concentration bases.',
  },
];
