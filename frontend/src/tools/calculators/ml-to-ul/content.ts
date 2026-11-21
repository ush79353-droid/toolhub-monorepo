import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatVolume,
  microlitersToMl,
  mlToMicroliters,
  UL_PER_ML,
} from './calculation';

export const MLUL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'mL to µL Conversion' },
  { id: 'how-to-convert', label: 'How to Convert µL to mL and mL to µL' },
  { id: 'how-many', label: 'How Many Microliters Are in a Milliliter?' },
  { id: 'where-used', label: 'Where Are Microliters Used?' },
  { id: 'related-tools', label: 'Other Volume Conversion Calculators' },
  { id: 'mlul-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_ML = [0.001, 0.01, 0.1, 1, 10, 100] as const;

export const MLUL_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'mL to µL Conversion',
    paragraphs: [
      'Convert between milliliters (mL) and microliters (µL) in either direction. The relationship is exact: one milliliter equals one thousand microliters. The tool is useful for small liquid volumes in laboratory work, analytical chemistry, and micro-scale measurements. It is not a medical dosing tool.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert µL to mL and mL to µL',
    paragraphs: [
      `Exact definitions: 1 mL = ${UL_PER_ML.toLocaleString('en-US')} µL and 1 µL = 0.001 mL.`,
      `Milliliters to microliters: µL = mL × ${UL_PER_ML}. Example: 2.5 mL = ${formatVolume(mlToMicroliters(2.5))} µL.`,
      `Microliters to milliliters: mL = µL ÷ ${UL_PER_ML}. Example: ${formatVolume(mlToMicroliters(2.5))} µL = ${formatVolume(microlitersToMl(2500))} mL.`,
    ],
    formula: `1 mL = ${UL_PER_ML} µL\nµL = mL × ${UL_PER_ML}\nmL = µL ÷ ${UL_PER_ML}\n2.5 mL = 2500 µL`,
  },
  {
    id: 'how-many',
    title: 'How Many Microliters Are in a Milliliter?',
    paragraphs: [
      `One milliliter contains exactly ${UL_PER_ML.toLocaleString('en-US')} microliters. The table below uses the same conversion engine as the calculator.`,
    ],
    tableHeaders: ['Milliliters (mL)', 'Microliters (µL)'],
    table: CHART_ML.map((ml) => [formatVolume(ml), formatVolume(mlToMicroliters(ml))]),
  },
  {
    id: 'where-used',
    title: 'Where Are Microliters Used?',
    paragraphs: [
      'Microliters appear in laboratory pipetting, small-volume chemical samples, microfluidics, biological research, analytical testing, and pharmaceutical research. The information here is educational; it does not replace laboratory protocols or clinical dosing guidance.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Volume Conversion Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Conversion, mL to cc Converter, mL to tsp Converter, mL to tbsp Converter, mL to oz Converter, Liter to cc Converter, and Milliliter Calculator. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MLUL_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is Smaller Than a Milliliter?',
    answer: `A microliter is one-thousandth of a milliliter (1 mL = ${UL_PER_ML.toLocaleString('en-US')} µL). Smaller metric volume units include nanoliters and picoliters (1 µL = 1,000 nL and 1 nL = 1,000 pL).`,
  },
  {
    question: 'How Many Microliters Are in 0.024 Milliliters?',
    answer: `Multiply by ${UL_PER_ML}: 0.024 × ${UL_PER_ML} = ${formatVolume(mlToMicroliters(0.024))}. Therefore 0.024 mL equals ${formatVolume(mlToMicroliters(0.024))} µL.`,
  },
  {
    question: 'How Many mL Are in 500 µL?',
    answer: `Divide by ${UL_PER_ML}: 500 ÷ ${UL_PER_ML} = ${formatVolume(microlitersToMl(500))}. Therefore 500 µL equals ${formatVolume(microlitersToMl(500))} mL.`,
  },
  {
    question: 'Is 1 mL Equal to 1,000 µL?',
    answer: `Yes. One milliliter equals exactly ${UL_PER_ML.toLocaleString('en-US')} microliters.`,
  },
  {
    question: 'How Do I Convert 250 µL to mL?',
    answer: `Divide by ${UL_PER_ML}: 250 ÷ ${UL_PER_ML} = ${formatVolume(microlitersToMl(250))}. Therefore 250 µL equals ${formatVolume(microlitersToMl(250))} mL.`,
  },
  {
    question: 'Is µL the Same as uL?',
    answer:
      'Yes. µL is the standard unit symbol for microliter. uL is a common plain-text alternative when the micro symbol (µ) is unavailable.',
  },
];
