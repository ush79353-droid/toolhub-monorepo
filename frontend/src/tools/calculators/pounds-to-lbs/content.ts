import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMass } from './calculation';
import { KG_PER_POUND } from './types';

export const POUNDS_TO_LBS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Pounds to lbs Converter' },
  { id: 'how-to-convert', label: 'How to Convert 1 Pound to lbs?' },
  { id: 'how-to-use', label: 'How to Use the Pounds to lbs Converter' },
  { id: 'conversion-table', label: 'Pounds to lbs Conversion Chart' },
  { id: 'are-same', label: 'Are Pounds and lbs the Same?' },
  { id: 'pounds-vs-kg', label: 'Pounds vs Kilograms' },
  { id: 'related-converters', label: 'More Weight Converters' },
  { id: 'pounds-to-lbs-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_LB = [0.5, 1, 2, 5, 10, 22.5, 25, 50, 100, 250, 500] as const;

export const POUNDS_TO_LBS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Pounds to lbs Converter',
    paragraphs: [
      'Pound and lb name the same unit of mass. This converter maps the full English name to its standard abbreviation so you can confirm that the numerical value never changes.',
      'There is no change in weight or mass when you switch between these labels; only the wording changes.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert 1 Pound to lbs?',
    paragraphs: [
      'One pound equals one lb. The abbreviation lb is the standard symbol for pound, so the numerical value stays the same.',
      'Examples: 1 pound = 1 lb; 2 pounds = 2 lbs; 5 pounds = 5 lbs; 10 pounds = 10 lbs; 20 pounds = 20 lbs.',
      'Why are pounds abbreviated as lbs? The symbol lb comes from the Latin word libra, historically tied to weighing scales and units of weight. The informal plural lbs is common in everyday writing, while lb is the standard unit symbol for both singular and plural quantities.',
    ],
    formula: '1 pound = 1 lb',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Pounds to lbs Converter',
    paragraphs: [
      '1. Enter a numerical value in the Pounds field.',
      '2. The corresponding value appears automatically in the lbs field.',
      '3. The value remains unchanged because both labels represent the same unit.',
      '4. You can also enter a value in the lbs field.',
      '5. The Pounds field updates automatically.',
      '6. Use Reload Calculator to restore the default of 1, or Clear All Changes to empty both fields.',
      'No separate Convert button is required; both directions update as you type.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Pounds to lbs Conversion Chart',
    paragraphs: [
      'Because the conversion factor is exactly 1, every pounds value equals the same lbs value.',
    ],
    tableHeaders: ['Pounds', 'lbs'],
    table: TABLE_LB.map((lb) => [formatMass(lb), formatMass(lb)]),
  },
  {
    id: 'are-same',
    title: 'Are Pounds and lbs the Same?',
    paragraphs: [
      'Yes. They refer to exactly the same quantity of mass.',
      'Writing 10 pounds, 10 lb, or informally 10 lbs all describe the same mass.',
    ],
    tableHeaders: ['Term', 'Meaning'],
    table: [
      ['Pound', 'Full English unit name'],
      ['lb', 'Standard abbreviation or symbol'],
      ['lbs', 'Common informal plural abbreviation'],
      ['1 pound', '1 lb'],
      ['10 pounds', '10 lb'],
    ],
  },
  {
    id: 'pounds-vs-kg',
    title: 'Pounds vs Kilograms',
    paragraphs: [
      `Pounds (lb) and kilograms (kg) are different units. The exact international relationship is 1 lb = ${KG_PER_POUND} kg.`,
      'Converting pounds to kilograms requires a real numerical conversion, unlike converting pounds to lbs. Use the lbs to kg Converter when you need that change of unit.',
    ],
    formula: `1 lb = ${KG_PER_POUND} kg`,
  },
  {
    id: 'related-converters',
    title: 'More Weight Converters',
    paragraphs: [
      'Related Omega Calculators pages include Weight Converter, kg to lbs Converter, lbs to kg Converter, mg to lbs Converter, Pounds to Grams Converter, Pounds and Ounces Calculator, Ounces to Pounds Converter, lbs to Stone Converter, lbs to g Converter, and Grams to Ounces Calculator. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const POUNDS_TO_LBS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 12 Pounds to lbs?',
    answer:
      'No mathematical calculation is needed. Both terms refer to the same mass unit. Therefore 12 pounds = 12 lb.',
  },
  {
    question: 'How Do I Convert 5 Pounds to lbs?',
    answer: 'The numerical value remains unchanged: 5 pounds = 5 lb.',
  },
  {
    question: 'Is 1 Pound Equal to 1 lb?',
    answer: 'Yes. They refer to exactly the same unit.',
  },
  {
    question: 'What Is the Difference Between lb and lbs?',
    answer:
      'lb is the standard unit symbol. lbs is a common informal plural form. Both are used to refer to pounds in everyday contexts.',
  },
  {
    question: 'Why Is Pound Abbreviated as lb?',
    answer: 'The abbreviation comes from the Latin word libra.',
  },
  {
    question: 'How Many lbs Are in 100 Pounds?',
    answer: 'There are exactly 100 lbs in 100 pounds.',
  },
  {
    question: 'Do I Need to Multiply Pounds to Get lbs?',
    answer:
      'No. The conversion factor is exactly 1, so the numerical value remains unchanged.',
  },
];
