import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { ccToLiters, formatVolume, litersToCc } from './calculation';
import { CC_PER_LITER } from './types';

export const CC_TO_LITER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-cubic-centimeter', label: 'What Is a Cubic Centimeter?' },
  { id: 'how-to-convert-cc-to-liters', label: 'How to Convert Cubic Centimeters to Liters' },
  { id: 'how-to-use', label: 'How to Use the cc to Liter Converter' },
  { id: 'other-volume-tools', label: 'Other Interesting Volume Conversion Tools' },
  { id: 'cc-to-liter-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_CC = [1, 5, 10, 50, 100, 250, 500, 750, 1000, 1500, 2000, 5000, 10000] as const;

export const CC_TO_LITER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-a-cubic-centimeter',
    title: 'What Is a Cubic Centimeter?',
    paragraphs: [
      'A cubic centimeter is a metric unit of volume. Its symbol is cm³, and it is commonly abbreviated as cc.',
      'It is the volume of a cube measuring one centimeter on every side. By definition, one cubic centimeter equals one milliliter.',
      'Cubic centimeters appear in medicine (syringe markings), laboratory work, and engine displacement (where “cc” is everyday language for cm³).',
      `Exactly 1 cm³ = 1 mL, and ${CC_PER_LITER.toLocaleString('en-US')} cm³ = 1 L.`,
    ],
    formula: `1 cm³ = 1 mL · ${CC_PER_LITER.toLocaleString('en-US')} cm³ = 1 L`,
  },
  {
    id: 'how-to-convert-cc-to-liters',
    title: 'How to Convert Cubic Centimeters (cc or cm³) to Liters',
    paragraphs: [
      `The conversion factor is exact: 1 cc = 0.001 L, because 1 L = ${CC_PER_LITER.toLocaleString('en-US')} cc.`,
      `Formula: Liters = Cubic Centimeters / ${CC_PER_LITER.toLocaleString('en-US')}.`,
      `Example 1: Convert 500 cc to liters → 500 / ${CC_PER_LITER.toLocaleString('en-US')} = ${formatVolume(ccToLiters(500))} L.`,
      `Example 2: Convert 2500 cc to liters → 2500 / ${CC_PER_LITER.toLocaleString('en-US')} = ${formatVolume(ccToLiters(2500))} L.`,
      `Reverse: Cubic Centimeters = Liters × ${CC_PER_LITER.toLocaleString('en-US')}. Example: 3.5 L × ${CC_PER_LITER.toLocaleString('en-US')} = ${formatVolume(litersToCc(3.5))} cc.`,
    ],
    formula: `L = cc / ${CC_PER_LITER.toLocaleString('en-US')} · cc = L × ${CC_PER_LITER.toLocaleString('en-US')}`,
    tableHeaders: ['Cubic centimeters (cc)', 'Liters (L)'],
    table: TABLE_CC.map((cc) => [formatVolume(cc), formatVolume(ccToLiters(cc))]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the cc to Liter Converter',
    paragraphs: [
      '1. Open the cc to Liter Converter.',
      '2. Enter a value in cubic centimeters.',
      '3. View the automatically calculated value in liters.',
      '4. Alternatively, enter a value in liters to calculate cubic centimeters.',
      '5. Optionally switch the cubic-centimeter label among cm³, cc, and mL — the number is the same volume.',
      '6. Use Share Result, Reload, or Clear as needed.',
      'No manual Calculate step is required for valid numbers.',
    ],
  },
  {
    id: 'other-volume-tools',
    title: 'Other Interesting Volume Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages include Volume Conversion, Liter to cc Converter, Liters to Centiliters Converter, L to Gal Converter, Cubic Meter Calculator, and mL to Cups Converter. Only active catalog tools appear as live site links.',
    ],
  },
];

export const CC_TO_LITER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do You Convert cm³ to Liters?',
    answer: `Divide cubic centimeters by ${CC_PER_LITER.toLocaleString('en-US')}: Liters = cm³ / ${CC_PER_LITER.toLocaleString('en-US')}. Example: 1500 cm³ / ${CC_PER_LITER.toLocaleString('en-US')} = ${formatVolume(ccToLiters(1500))} L.`,
  },
  {
    question: 'Does 1 cm³ Equal 1 Liter?',
    answer: `No. One cubic centimeter equals 0.001 liter. ${CC_PER_LITER.toLocaleString('en-US')} cm³ = 1 L.`,
  },
  {
    question: 'Is 1 cc Equal to 1 mL?',
    answer: 'Yes. 1 cc = 1 cm³ = 1 mL.',
  },
  {
    question: 'How Many cc Are in One Liter?',
    answer: `1 L = ${CC_PER_LITER.toLocaleString('en-US')} cc.`,
  },
  {
    question: 'How Many Liters Is 250 cc?',
    answer: `250 / ${CC_PER_LITER.toLocaleString('en-US')} = ${formatVolume(ccToLiters(250))} L.`,
  },
  {
    question: 'How Many cc Are in 2.5 Liters?',
    answer: `2.5 × ${CC_PER_LITER.toLocaleString('en-US')} = ${formatVolume(litersToCc(2.5))} cc.`,
  },
];
