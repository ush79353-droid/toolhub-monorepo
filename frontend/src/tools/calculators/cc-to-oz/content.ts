import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  ccToFluidOunces,
  fluidOuncesToCc,
  formatVolume,
} from './calculation';
import { CC_PER_UK_FL_OZ, CC_PER_US_FL_OZ } from './types';

export const CC_TO_OZ_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-volume', label: 'What Is Volume?' },
  { id: 'how-to-convert-cc-to-oz', label: 'How to Convert CC to OZ' },
  { id: 'us-vs-uk-fluid-ounces', label: 'US Fluid Ounces vs UK Fluid Ounces' },
  { id: 'other-volume-tools', label: 'Other Volume Conversion Calculators' },
  { id: 'cc-to-oz-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_CC = [1, 5, 10, 15, 30, 50, 100, 150, 200, 250, 500, 750, 1000] as const;

function displayUsOz(cc: number): string {
  return formatVolume(Number(ccToFluidOunces(cc, 'us').toFixed(6)));
}

export const CC_TO_OZ_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-volume',
    title: 'What Is Volume?',
    paragraphs: [
      'Volume is the amount of three-dimensional space occupied by an object or substance. Common volume units include cubic centimeters (cc or cm³), milliliters (mL), liters (L), US customary fluid ounces, and UK imperial fluid ounces.',
      'By definition, one cubic centimeter equals one milliliter, and one thousand cubic centimeters equal one liter. Cubic centimeters and fluid ounces can measure liquid volume; cubic centimeters also apply to solids and gases.',
      'Volume is not the same as mass. Fluid ounces measure how much space a liquid occupies. Avoirdupois ounces measure weight. This converter uses fluid ounces only.',
    ],
    formula: '1 cc = 1 mL · 1000 cc = 1 L',
  },
  {
    id: 'how-to-convert-cc-to-oz',
    title: 'How to Convert CC to OZ',
    paragraphs: [
      'Step 1: Determine the CC value. Example: 100 cc.',
      'Step 2: Select the fluid ounce system: US fluid ounces (default) or UK imperial fluid ounces.',
      `Step 3: Apply the correct formula. For US fluid ounces: US fl oz = cc / ${CC_PER_US_FL_OZ}. Example: 100 / ${CC_PER_US_FL_OZ} ≈ ${formatVolume(ccToFluidOunces(100, 'us'))} US fl oz.`,
      `For UK fluid ounces: UK fl oz = cc / ${CC_PER_UK_FL_OZ}. Example: 100 / ${CC_PER_UK_FL_OZ} ≈ ${formatVolume(ccToFluidOunces(100, 'uk'))} UK fl oz.`,
      `Step 4: Convert back to cc with cc = fl oz × factor. Example: 5 × ${CC_PER_US_FL_OZ} = ${formatVolume(fluidOuncesToCc(5, 'us'))} cc.`,
      'The table below uses US fluid ounces. Displayed values may be rounded; the calculator uses the exact constants.',
    ],
    formula: `US fl oz = cc / ${CC_PER_US_FL_OZ} · UK fl oz = cc / ${CC_PER_UK_FL_OZ}`,
    tableHeaders: ['Cubic Centimeters (cc)', 'US Fluid Ounces (fl oz)'],
    table: TABLE_CC.map((cc) => [formatVolume(cc), displayUsOz(cc)]),
  },
  {
    id: 'us-vs-uk-fluid-ounces',
    title: 'US Fluid Ounces vs UK Fluid Ounces',
    paragraphs: [
      `One US customary fluid ounce equals exactly ${CC_PER_US_FL_OZ} cubic centimeters (milliliters). One UK imperial fluid ounce equals exactly ${CC_PER_UK_FL_OZ} cubic centimeters.`,
      'That difference matters for recipes, beverage containers, pharmaceutical dosing notes, and any international measurement where the fluid ounce system is not stated. Always confirm whether a source means US or UK fluid ounces before converting.',
      'Remember again: these are volume units. They are not ounces of weight.',
    ],
    formula: `1 US fl oz = ${CC_PER_US_FL_OZ} cc · 1 UK fl oz = ${CC_PER_UK_FL_OZ} cc · 1 L = 1000 cc`,
    tableHeaders: ['Measurement', 'Cubic Centimeters'],
    table: [
      ['1 US fluid ounce', String(CC_PER_US_FL_OZ)],
      ['1 UK imperial fluid ounce', String(CC_PER_UK_FL_OZ)],
      ['1 cc', '1 mL'],
      ['1 liter', '1000 cc'],
    ],
  },
  {
    id: 'other-volume-tools',
    title: 'Other Volume Conversion Calculators',
    paragraphs: [
      'Related Omega Calculators pages include Volume Conversion, cc to mL Converter, cc to Liter Converter, Liter to cc Converter, and L to Gal Converter. Only active catalog tools appear as live site links below and in the related-tools rail.',
    ],
  },
];

export const CC_TO_OZ_FAQS: readonly FAQItem[] = [
  {
    question: 'Can Volume Be Negative?',
    answer:
      'No. Physical volume cannot be negative. This converter accepts zero and positive values only.',
  },
  {
    question: 'What Is OZ?',
    answer:
      'In this calculator, oz means fluid ounces: a unit of volume. Fluid ounces should not be confused with ounces of weight (avoirdupois ounces).',
  },
  {
    question: 'How Can I Convert 10 CC to OZ?',
    answer: `For US fluid ounces: 10 ÷ ${CC_PER_US_FL_OZ} ≈ ${formatVolume(ccToFluidOunces(10, 'us'))}. So 10 cc ≈ ${formatVolume(ccToFluidOunces(10, 'us'))} US fl oz.`,
  },
  {
    question: 'How Many CC Are in One US Fluid Ounce?',
    answer: `Exactly ${CC_PER_US_FL_OZ} cc.`,
  },
  {
    question: 'Is 1 CC Equal to 1 mL?',
    answer: 'Yes. 1 cc = 1 cm³ = 1 mL.',
  },
  {
    question: 'What Is the Difference Between US FL OZ and UK FL OZ?',
    answer: `One US fluid ounce is exactly ${CC_PER_US_FL_OZ} mL (cc). One UK imperial fluid ounce is exactly ${CC_PER_UK_FL_OZ} mL (cc).`,
  },
  {
    question: 'How Many US Fluid Ounces Are in 250 CC?',
    answer: `250 ÷ ${CC_PER_US_FL_OZ} ≈ ${formatVolume(ccToFluidOunces(250, 'us'))}. So 250 cc ≈ ${formatVolume(ccToFluidOunces(250, 'us'))} US fl oz.`,
  },
];
