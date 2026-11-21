import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  ML_PER_UK_FL_OZ,
  ML_PER_US_FL_OZ,
  fluidOuncesToMilliliters,
  formatVolume,
  millilitersToFluidOunces,
} from './calculation';

export const OUNCES_TO_MILLILITERS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Ounces to Milliliters Converter' },
  { id: 'what-is-fl-oz', label: 'What Is a Fluid Ounce?' },
  { id: 'how-to-convert', label: 'How Do You Convert Ounces to Milliliters?' },
  { id: 'conversion-table', label: 'Fluid Ounces to Milliliters Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the Ounces to Milliliters Converter' },
  { id: 'related-tools', label: 'Volume Conversion Beyond Ounces' },
  { id: 'ounces-to-milliliters-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_FL_OZ = [1, 2, 4, 5, 8, 10, 12, 16, 20, 32, 50, 100] as const;

function tableMl(amount: number, system: 'us' | 'uk'): string {
  return Number(fluidOuncesToMilliliters(amount, system).toFixed(4)).toString();
}

export const OUNCES_TO_MILLILITERS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Ounces to Milliliters Converter',
    paragraphs: [
      'Convert fluid ounces (fl oz) to milliliters (mL) and back. Choose US customary or UK imperial fluid ounces: the factors differ.',
      'Useful for cooking and baking, beverage and packaging measurements, laboratory volume checks, international recipes, and everyday customary ↔ metric volume work.',
    ],
  },
  {
    id: 'what-is-fl-oz',
    title: 'What Is a Fluid Ounce?',
    paragraphs: [
      'A fluid ounce measures volume. An ordinary ounce usually measures mass. This calculator uses fluid ounces only.',
      `Exactly 1 US fl oz = ${ML_PER_US_FL_OZ} mL. Exactly 1 UK imperial fl oz = ${ML_PER_UK_FL_OZ} mL.`,
      'One US gallon contains 128 US fluid ounces. One UK imperial gallon contains 160 UK imperial fluid ounces. Select the correct system for accurate results.',
    ],
    formula: `1 US fl oz = ${ML_PER_US_FL_OZ} mL\n1 UK fl oz = ${ML_PER_UK_FL_OZ} mL`,
  },
  {
    id: 'how-to-convert',
    title: 'How Do You Convert Ounces to Milliliters?',
    paragraphs: [
      `US: mL = US fl oz × ${ML_PER_US_FL_OZ}. Example; 5 US fl oz = ${formatVolume(fluidOuncesToMilliliters(5, 'us'))} mL.`,
      `UK: mL = UK fl oz × ${ML_PER_UK_FL_OZ}. Example; 5 UK fl oz = ${formatVolume(fluidOuncesToMilliliters(5, 'uk'))} mL.`,
      'Know which fluid-ounce system you are using before converting.',
    ],
    formula: `mL = US fl oz × ${ML_PER_US_FL_OZ}\nmL = UK fl oz × ${ML_PER_UK_FL_OZ}`,
  },
  {
    id: 'conversion-table',
    title: 'Fluid Ounces to Milliliters Conversion Table',
    paragraphs: [
      'Values generated from the exact US and UK factors; milliliters shown to four decimal places.',
    ],
    tableHeaders: ['Fluid ounces', 'US fl oz to mL', 'UK fl oz to mL'],
    table: TABLE_FL_OZ.map((oz) => [
      formatVolume(oz),
      tableMl(oz, 'us'),
      tableMl(oz, 'uk'),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Ounces to Milliliters Converter',
    paragraphs: [
      '1. Enter a volume in the fluid-ounce field.',
      '2. Choose US or UK fluid ounces.',
      '3. View the equivalent volume in milliliters.',
      '4. Alternatively, enter a milliliter value.',
      '5. Read the reverse conversion in fluid ounces for the selected system.',
      '6. Use Reload (restores 1 US fl oz), Clear, or Share as needed.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Volume Conversion Beyond Ounces',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Conversion, oz to cc Converter, mL to oz Converter, Cups to Oz Converter, and other liquid-volume tools. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const OUNCES_TO_MILLILITERS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do You Convert from Fluid Ounces to Milliliters?',
    answer: `Multiply US fluid ounces by ${ML_PER_US_FL_OZ}, or UK imperial fluid ounces by ${ML_PER_UK_FL_OZ}.`,
  },
  {
    question: 'How Many Milliliters Are in an Ounce?',
    answer: `One US fluid ounce contains exactly ${ML_PER_US_FL_OZ} mL. One UK imperial fluid ounce contains exactly ${ML_PER_UK_FL_OZ} mL. This refers to fluid ounces, not mass ounces.`,
  },
  {
    question: 'How Many Milliliters Are in 8 US Fluid Ounces?',
    answer: `8 × ${ML_PER_US_FL_OZ} = ${formatVolume(fluidOuncesToMilliliters(8, 'us'))} mL; about 236.59 mL.`,
  },
  {
    question: 'Is 1 US Fluid Ounce the Same as 1 UK Fluid Ounce?',
    answer: 'No. US and UK imperial fluid ounces have different volumes.',
  },
  {
    question: 'Is 1 mL Equal to 1 cc?',
    answer: 'Yes. One milliliter equals exactly one cubic centimeter.',
  },
  {
    question: 'Can I Convert Weight Ounces to Milliliters?',
    answer:
      'Not directly. A mass-to-volume conversion requires the density of the substance.',
  },
  {
    question: 'How Many US Fluid Ounces Are in 100 mL?',
    answer: `About ${formatVolume(millilitersToFluidOunces(100, 'us'))} US fl oz.`,
  },
];
