import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  convertPintGallon,
  formatVolume,
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_LIQUID_GALLON,
  VOLUME_UNITS_ML,
} from './calculation';
import { PINTS_PER_GALLON } from './types';

export const PINTS_TO_GALLONS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Pints to Gallons Converter' },
  { id: 'how-many', label: 'Pints to Gallons Conversion; How Many Pints Are in a Gallon?' },
  { id: 'half-pints', label: 'How Many Half-Pints Are in a Gallon?' },
  { id: 'us-vs-uk', label: 'US vs UK Pints and Gallons' },
  { id: 'conversion-table', label: 'Pints to Gallons Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the Pints to Gallons Converter' },
  { id: 'related-tools', label: 'Other Similar Volume Conversion Tools' },
  { id: 'pints-to-gallons-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_PINTS = [0.5, 1, 2, 3, 4, 6, 8, 10, 12, 16, 24, 32, 40, 50] as const;

export const PINTS_TO_GALLONS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Pints to Gallons Converter',
    paragraphs: [
      'Convert volume between US and UK pints and gallons instantly. Useful for cooking, liquid storage, fuel quantities, beverage measurements, recipe conversions, and comparing US customary with Imperial units.',
      'Enter any one of the four fields (US pints, UK pints, US gallons, or UK gallons) and the other three update automatically from exact milliliter definitions.',
    ],
  },
  {
    id: 'how-many',
    title: 'Pints to Gallons Conversion; How Many Pints Are in a Gallon?',
    paragraphs: [
      `Within the US customary system: 1 US gallon = ${PINTS_PER_GALLON} US pints, so US gallons = US pints ÷ ${PINTS_PER_GALLON}.`,
      `Within the UK imperial system: 1 UK gallon = ${PINTS_PER_GALLON} UK pints, so UK gallons = UK pints ÷ ${PINTS_PER_GALLON}.`,
      'The same numerical 8× relationship exists inside both systems, but absolute volumes differ because US and UK units are not identical.',
      `Example; convert 12 US pints: 12 ÷ ${PINTS_PER_GALLON} = ${formatVolume(convertPintGallon(12, 'usPt', 'usGal'))} US gallons.`,
      `Example; convert 20 UK pints: 20 ÷ ${PINTS_PER_GALLON} = ${formatVolume(convertPintGallon(20, 'ukPt', 'ukGal'))} UK gallons.`,
    ],
    formula: `US gal = US pt ÷ ${PINTS_PER_GALLON} · UK gal = UK pt ÷ ${PINTS_PER_GALLON}`,
  },
  {
    id: 'half-pints',
    title: 'How Many Half-Pints Are in a Gallon?',
    paragraphs: [
      'One pint contains two half-pints. Since one gallon contains eight pints in the same measurement system:',
      `${PINTS_PER_GALLON} × 2 = 16. Therefore there are 16 half-pints in one gallon when pint and gallon use the same system.`,
    ],
    formula: '8 pints × 2 half-pints/pint = 16 half-pints/gallon',
  },
  {
    id: 'us-vs-uk',
    title: 'US vs UK Pints and Gallons',
    paragraphs: [
      `1 US liquid pint = ${VOLUME_UNITS_ML.usPt} mL. 1 UK imperial pint = ${VOLUME_UNITS_ML.ukPt} mL.`,
      `1 US liquid gallon = ${VOLUME_UNITS_ML.usGal.toLocaleString('en-US')} mL (${LITERS_PER_US_LIQUID_GALLON} L). 1 UK imperial gallon = ${VOLUME_UNITS_ML.ukGal.toLocaleString('en-US')} mL (${LITERS_PER_IMPERIAL_GALLON} L).`,
      `Both systems use ${PINTS_PER_GALLON} pints per gallon internally, but you must match the correct measuring system for accurate results.`,
    ],
    formula: `1 US pt = ${VOLUME_UNITS_ML.usPt} mL · 1 UK pt = ${VOLUME_UNITS_ML.ukPt} mL`,
    tableHeaders: ['Measurement', 'US Customary', 'UK Imperial'],
    table: [
      ['1 pint', `${VOLUME_UNITS_ML.usPt} mL`, `${VOLUME_UNITS_ML.ukPt} mL`],
      [
        '1 gallon',
        `${VOLUME_UNITS_ML.usGal.toLocaleString('en-US')} mL`,
        `${VOLUME_UNITS_ML.ukGal.toLocaleString('en-US')} mL`,
      ],
      ['Pints per gallon', String(PINTS_PER_GALLON), String(PINTS_PER_GALLON)],
    ],
  },
  {
    id: 'conversion-table',
    title: 'Pints to Gallons Conversion Table',
    paragraphs: [
      'Values apply when the pint and gallon belong to the same measurement system (US customary or UK imperial). Generated with the same engine as the calculator.',
    ],
    tableHeaders: ['Pints', 'Gallons (same system)'],
    table: CHART_PINTS.map((pints) => [
      formatVolume(pints),
      formatVolume(convertPintGallon(pints, 'usPt', 'usGal')),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Pints to Gallons Converter',
    paragraphs: [
      '1. Open the Pints section (expanded by default).',
      '2. Enter a value in either US pints or UK pints.',
      '3. Review the automatically calculated results.',
      '4. Read equivalent US and UK gallons in the Gallons section.',
      '5. Alternatively, enter a gallon field to convert in reverse.',
      '6. Collapse or expand groups without losing values.',
      '7. Share, reload, or clear the calculation when needed.',
      'All four values remain synchronized through exact milliliter factors.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Similar Volume Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Converter, Gallons to Pints Converter, Pints to Cups Converter, Gallons to Cups Converter, Gallons to Quarts Converter, Cups to Pints Converter, and Cups to Quarts Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const PINTS_TO_GALLONS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do You Convert 4 Pints to Gallons?',
    answer: `Divide the number of pints by ${PINTS_PER_GALLON}: 4 ÷ ${PINTS_PER_GALLON} = ${formatVolume(convertPintGallon(4, 'usPt', 'usGal'))}. Four US pints equal half a US gallon. The same relationship holds for UK pints and UK gallons.`,
  },
  {
    question: 'How Many Gallons Are in 50 Pints?',
    answer: `50 ÷ ${PINTS_PER_GALLON} = ${formatVolume(convertPintGallon(50, 'usPt', 'usGal'))}. Fifty pints equal 6.25 gallons when both units use the same measurement system.`,
  },
  {
    question: 'How Many Pints Are in One Gallon?',
    answer: `There are ${PINTS_PER_GALLON} pints in one gallon within either the US customary or UK Imperial measurement system.`,
  },
  {
    question: 'How Many Half-Pints Are in One Gallon?',
    answer: 'There are 16 half-pints in one gallon (8 pints × 2 half-pints per pint).',
  },
  {
    question: 'Is a US Gallon the Same as a UK Gallon?',
    answer: `No. A US liquid gallon equals ${VOLUME_UNITS_ML.usGal.toLocaleString('en-US')} mL, while a UK Imperial gallon equals ${VOLUME_UNITS_ML.ukGal.toLocaleString('en-US')} mL.`,
  },
  {
    question: 'Is a UK Pint Larger Than a US Pint?',
    answer: `Yes. A UK Imperial pint contains ${VOLUME_UNITS_ML.ukPt} mL, compared with ${VOLUME_UNITS_ML.usPt} mL in a US liquid pint.`,
  },
  {
    question: 'How Many US Gallons Are in 16 US Pints?',
    answer: `16 ÷ ${PINTS_PER_GALLON} = ${formatVolume(convertPintGallon(16, 'usPt', 'usGal'))}. Sixteen US pints equal two US gallons.`,
  },
];
