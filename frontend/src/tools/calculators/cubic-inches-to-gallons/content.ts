import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  cubicInchesToLiters,
  cubicInchesToUKGallons,
  cubicInchesToUSGallons,
  formatVolume,
  ukGallonsToCubicInches,
} from './calculation';
import {
  CUBIC_INCHES_PER_US_GALLON,
  LITERS_PER_CUBIC_INCH,
  LITERS_PER_UK_GALLON,
  LITERS_PER_US_GALLON,
} from './types';

export const CU_IN_TO_GAL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'cubic-inches-to-gallons-formula', label: 'Cubic Inches to Gallons Formula' },
  { id: 'convert-to-us-gallons', label: 'How Do I Convert Cubic Inches to US Gallons?' },
  { id: 'convert-to-uk-gallons', label: 'How Do I Convert Cubic Inches to UK Gallons?' },
  { id: 'related-volume-tools', label: 'Other Useful Conversion Tools' },
  { id: 'cu-in-to-gal-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const EXAMPLE_IN3 = [0, 1, 10, 50, 100, 231, 462, 500, 1000, 1155] as const;

export const CU_IN_TO_GAL_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'cubic-inches-to-gallons-formula',
    title: 'Cubic Inches to Gallons Formula',
    paragraphs: [
      'This converter turns cubic inches into US liquid gallons, UK imperial gallons, and other volume units such as liters. Practical uses include tank capacity, container volumes, engine displacement comparisons, liquid storage, plumbing, manufacturing, and engineering estimates.',
      'A cubic inch is the volume of a cube measuring one inch on each edge. One US liquid gallon contains exactly 231 cubic inches. One UK imperial gallon equals exactly 4.54609 liters. One cubic inch equals exactly 0.016387064 liters.',
      `Example: 462 in³ ÷ 231 = ${formatVolume(cubicInchesToUSGallons(462))} US gal. Selecting UK gallons produces a different gallon count for the same physical volume because the imperial gallon is larger.`,
    ],
    formula: `US gal = in³ ÷ ${CUBIC_INCHES_PER_US_GALLON}  ·  UK gal = (in³ × ${LITERS_PER_CUBIC_INCH}) ÷ ${LITERS_PER_UK_GALLON}  ·  L = in³ × ${LITERS_PER_CUBIC_INCH}`,
    tableHeaders: ['Cubic inches (in³)', 'US gallons', 'Liters'],
    table: EXAMPLE_IN3.map((in3) => [
      formatVolume(in3),
      formatVolume(cubicInchesToUSGallons(in3)),
      formatVolume(cubicInchesToLiters(in3)),
    ]),
  },
  {
    id: 'convert-to-us-gallons',
    title: 'How Do I Convert Cubic Inches to US Gallons?',
    paragraphs: [
      '1. Enter the volume in cubic inches.',
      '2. Select US gallons in the gallon dropdown.',
      '3. Divide cubic inches by 231 (or read the calculated result).',
      `Example: 500 ÷ 231 ≈ ${formatVolume(cubicInchesToUSGallons(500))}. Therefore 500 cubic inches is approximately ${formatVolume(cubicInchesToUSGallons(500))} US liquid gallons.`,
      `Reverse: multiply US gallons by 231. For example, 5 US gal = ${formatVolume(5 * CUBIC_INCHES_PER_US_GALLON)} in³.`,
    ],
    formula: `US gal = in³ / ${CUBIC_INCHES_PER_US_GALLON}  ·  in³ = US gal × ${CUBIC_INCHES_PER_US_GALLON}`,
  },
  {
    id: 'convert-to-uk-gallons',
    title: 'How Do I Convert Cubic Inches to UK Gallons?',
    paragraphs: [
      `UK gal = (in³ × ${LITERS_PER_CUBIC_INCH}) / ${LITERS_PER_UK_GALLON}.`,
      `Example for 500 cubic inches: first 500 × ${LITERS_PER_CUBIC_INCH} = ${formatVolume(cubicInchesToLiters(500))} L, then ${formatVolume(cubicInchesToLiters(500))} ÷ ${LITERS_PER_UK_GALLON} ≈ ${formatVolume(cubicInchesToUKGallons(500))} UK gal.`,
      'UK imperial gallons are larger than US liquid gallons, so the UK gallon reading is smaller for the same cubic-inch volume.',
      `One UK gallon is approximately ${formatVolume(ukGallonsToCubicInches(1))} cubic inches.`,
    ],
    formula: `UK gal = (in³ × ${LITERS_PER_CUBIC_INCH}) / ${LITERS_PER_UK_GALLON}`,
    tableHeaders: ['Cubic inches (in³)', 'UK gallons'],
    table: [0, 1, 100, 231, 500, 1000].map((in3) => [
      formatVolume(in3),
      formatVolume(cubicInchesToUKGallons(in3)),
    ]),
  },
  {
    id: 'related-volume-tools',
    title: 'Other Useful Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Converter, Cubic Feet to Gallons Converter, Liter to Gallon Converter, CC to mL Converter, Cubic Feet to Cubic Meters Converter, and other volume tools. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CU_IN_TO_GAL_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 1 Cubic Inch to Gallons?',
    answer: `US: 1 ÷ 231 ≈ ${formatVolume(cubicInchesToUSGallons(1))} US gal. UK: ${LITERS_PER_CUBIC_INCH} ÷ ${LITERS_PER_UK_GALLON} ≈ ${formatVolume(cubicInchesToUKGallons(1))} UK gal.`,
  },
  {
    question: 'How Many Cubic Inches Are in One US Gallon?',
    answer: `There are exactly ${CUBIC_INCHES_PER_US_GALLON} cubic inches in one US liquid gallon.`,
  },
  {
    question: 'How Many Cubic Inches Are in One UK Gallon?',
    answer: `One UK imperial gallon is approximately ${formatVolume(ukGallonsToCubicInches(1))} cubic inches (from ${LITERS_PER_UK_GALLON} L ÷ ${LITERS_PER_CUBIC_INCH} L/in³).`,
  },
  {
    question: 'Are US Gallons and UK Gallons the Same?',
    answer: `No. A US liquid gallon equals ${LITERS_PER_US_GALLON} liters. A UK imperial gallon equals ${LITERS_PER_UK_GALLON} liters. The UK gallon is larger.`,
  },
  {
    question: 'How Do I Convert Cubic Inches to Liters?',
    answer: `Multiply by ${LITERS_PER_CUBIC_INCH}. Example: 100 × ${LITERS_PER_CUBIC_INCH} = ${formatVolume(cubicInchesToLiters(100))} L.`,
  },
];
