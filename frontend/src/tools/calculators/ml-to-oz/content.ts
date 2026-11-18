import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatVolume,
  mlToUkFluidOunces,
  mlToUsFluidOunces,
  ukFluidOuncesToMl,
  usFluidOuncesToMl,
  ML_PER_UK_FL_OZ,
  ML_PER_US_FL_OZ,
} from './calculation';

export const MLOZ_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'mL to oz Converter' },
  { id: 'what-is-ml', label: 'What Is a Milliliter (mL)?' },
  { id: 'what-is-floz', label: 'What Is a Fluid Ounce (fl oz)?' },
  { id: 'ml-to-floz', label: 'How to Convert mL to Fluid Ounces' },
  { id: 'floz-to-ml', label: 'How to Convert Fluid Ounces to mL' },
  { id: 'conversion-chart', label: 'mL to Fluid Ounces Conversion Chart' },
  { id: 'related-tools', label: 'Other Volume Conversion Calculators' },
  { id: 'mloz-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_ML = [1, 5, 10, 30, 50, 100, 250, 500, 1000] as const;

export const MLOZ_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'mL to oz Converter',
    paragraphs: [
      'Convert milliliters into fluid ounces and other volume units in either direction. The calculator supports both US customary fluid ounces and UK Imperial fluid ounces, which are different sizes. Labels always say fl oz so they are not confused with mass ounces.',
    ],
  },
  {
    id: 'what-is-ml',
    title: 'What Is a Milliliter (mL)?',
    paragraphs: [
      'A milliliter is a metric volume unit equal to one-thousandth of a liter. By definition used here, one milliliter equals one cubic centimeter. Milliliters appear often in cooking, medicine packaging, laboratory work, and beverage labeling.',
      '1 mL = 0.001 L and 1 mL = 1 cm³.',
    ],
    formula: '1 mL = 0.001 L\n1 mL = 1 cm³',
  },
  {
    id: 'what-is-floz',
    title: 'What Is a Fluid Ounce (fl oz)?',
    paragraphs: [
      'A fluid ounce measures volume. The US customary system and the UK Imperial system define different fluid ounce sizes. A fluid ounce is not the same as an ounce of mass (weight).',
      `Exact definitions used here: 1 US fl oz = ${ML_PER_US_FL_OZ} mL and 1 UK fl oz = ${ML_PER_UK_FL_OZ} mL.`,
    ],
    formula: `1 US fl oz = ${ML_PER_US_FL_OZ} mL\n1 UK fl oz = ${ML_PER_UK_FL_OZ} mL`,
  },
  {
    id: 'ml-to-floz',
    title: 'How to Convert mL to Fluid Ounces',
    paragraphs: [
      `For US fluid ounces: US fl oz = mL ÷ ${ML_PER_US_FL_OZ}.`,
      `Example: 250 mL → ${formatVolume(mlToUsFluidOunces(250))} US fl oz.`,
      `For UK Imperial fluid ounces: UK fl oz = mL ÷ ${ML_PER_UK_FL_OZ}. The same 250 mL is about ${formatVolume(mlToUkFluidOunces(250))} UK fl oz.`,
    ],
    formula: `US fl oz = mL / ${ML_PER_US_FL_OZ}\n250 mL ≈ ${formatVolume(mlToUsFluidOunces(250))} US fl oz\nUK fl oz = mL / ${ML_PER_UK_FL_OZ}`,
  },
  {
    id: 'floz-to-ml',
    title: 'How to Convert Fluid Ounces to mL',
    paragraphs: [
      `For US fluid ounces: mL = US fl oz × ${ML_PER_US_FL_OZ}.`,
      `Example: 8 US fl oz → ${formatVolume(usFluidOuncesToMl(8))} mL.`,
      `For UK Imperial fluid ounces: mL = UK fl oz × ${ML_PER_UK_FL_OZ}. Eight UK fl oz → ${formatVolume(ukFluidOuncesToMl(8))} mL.`,
    ],
    formula: `mL = US fl oz × ${ML_PER_US_FL_OZ}\n8 US fl oz = ${formatVolume(usFluidOuncesToMl(8))} mL`,
  },
  {
    id: 'conversion-chart',
    title: 'mL to Fluid Ounces Conversion Chart',
    paragraphs: [
      'Values below use the same conversion engine as the calculator (exact US and UK fluid ounce definitions).',
    ],
    tableHeaders: ['mL', 'US fl oz', 'UK fl oz'],
    table: CHART_ML.map((ml) => [
      formatVolume(ml),
      formatVolume(mlToUsFluidOunces(ml)),
      formatVolume(mlToUkFluidOunces(ml)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Volume Conversion Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Conversion, mL to cc Converter, Liter to cc Converter, mL to Cups Converter, Gallons to Liters Converter, Liters to Gallons Converter, and Cubic Inches Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MLOZ_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Fluid Ounces Are in 1 mL?',
    answer: `One milliliter equals approximately ${formatVolume(mlToUsFluidOunces(1))} US fluid ounces or ${formatVolume(mlToUkFluidOunces(1))} UK Imperial fluid ounces.`,
  },
  {
    question: 'How Do I Convert mL to oz?',
    answer: `Divide milliliters by ${ML_PER_US_FL_OZ} for US fluid ounces, or by ${ML_PER_UK_FL_OZ} for UK fluid ounces. Always confirm which fluid-ounce system you need.`,
  },
  {
    question: 'How Do I Convert oz to mL?',
    answer: `For US fluid ounces, multiply by ${ML_PER_US_FL_OZ}. For UK Imperial fluid ounces, multiply by ${ML_PER_UK_FL_OZ}.`,
  },
  {
    question: 'How Many mL Are in 8 oz?',
    answer: `Eight US fluid ounces equal ${formatVolume(usFluidOuncesToMl(8))} mL. Eight UK Imperial fluid ounces equal ${formatVolume(ukFluidOuncesToMl(8))} mL.`,
  },
  {
    question: 'Is 1 oz Equal to 30 mL?',
    answer: `One US fluid ounce is ${ML_PER_US_FL_OZ} mL, often rounded to 30 mL for quick estimates. One UK fluid ounce is ${ML_PER_UK_FL_OZ} mL.`,
  },
  {
    question: 'Are US and UK Fluid Ounces the Same?',
    answer:
      'No. A US fluid ounce is larger than a UK Imperial fluid ounce. Always check which system your recipe or label uses.',
  },
  {
    question: 'What Is the Difference Between oz and fl oz?',
    answer:
      'An ounce (oz) usually indicates mass or weight in everyday usage, while a fluid ounce (fl oz) measures volume. Converting mass ounces to milliliters requires density.',
  },
  {
    question: 'How Many mL Are in 16 US Fluid Ounces?',
    answer: `Sixteen US fluid ounces equal ${formatVolume(usFluidOuncesToMl(16))} mL.`,
  },
];
