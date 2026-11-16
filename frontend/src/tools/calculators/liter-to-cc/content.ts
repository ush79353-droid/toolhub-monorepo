import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { ccToLiters, formatVolume, litersToCc } from './calculation';
import { CC_PER_LITER } from './types';

export const LITER_TO_CC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-liter', label: 'What Is a Liter?' },
  { id: 'how-to-convert-liters-to-cc', label: 'How to Convert Liters to cc' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'other-volume-converters', label: 'Other Volume Converters' },
  { id: 'liter-to-cc-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_LITERS = [0, 0.001, 0.01, 0.1, 0.5, 1, 1.5, 2, 2.5, 5, 10, 25, 100, 1000] as const;

export const LITER_TO_CC_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-a-liter',
    title: 'What Is a Liter?',
    paragraphs: [
      'A liter (L) is a metric unit of volume equal to one cubic decimeter. It is commonly used for beverages, fuel, liquids, and container capacity.',
      `Exactly 1 L = 1 dm³ = ${CC_PER_LITER.toLocaleString('en-US')} cm³ = ${CC_PER_LITER.toLocaleString('en-US')} cc.`,
      'Volume and mass are different quantities. A liter measures volume; a kilogram measures mass. Relating them requires density: Mass = Density × Volume.',
      'Under commonly assumed conditions, one liter of water has a mass of about one kilogram, but that does not apply to every liquid or temperature.',
    ],
    formula: `1 L = 1 dm³ = ${CC_PER_LITER.toLocaleString('en-US')} cm³ = ${CC_PER_LITER.toLocaleString('en-US')} cc`,
  },
  {
    id: 'how-to-convert-liters-to-cc',
    title: 'How to Convert Liters to cc',
    paragraphs: [
      `Formula: cc = L × ${CC_PER_LITER.toLocaleString('en-US')}.`,
      `Example: 3.5 L × ${CC_PER_LITER.toLocaleString('en-US')} = ${formatVolume(litersToCc(3.5))} cc.`,
      `Reverse: L = cc ÷ ${CC_PER_LITER.toLocaleString('en-US')}. Example: 1500 ÷ ${CC_PER_LITER.toLocaleString('en-US')} = ${formatVolume(ccToLiters(1500))} L.`,
      'These factors are exact metric definitions, not approximate experimental values.',
    ],
    formula: `cc = L × ${CC_PER_LITER.toLocaleString('en-US')} · L = cc ÷ ${CC_PER_LITER.toLocaleString('en-US')}`,
    tableHeaders: ['Liters (L)', 'Cubic centimeters (cc)'],
    table: TABLE_LITERS.map((L) => [formatVolume(L), formatVolume(litersToCc(L))]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Liter to cc Converter',
    paragraphs: [
      '1. Enter the volume in liters — cubic centimeters update instantly.',
      '2. Or enter cubic centimeters (cc) to calculate liters.',
      '3. Use Swap Units to reverse the visual field order.',
      '4. Share or copy the result when needed.',
      '5. Reload restores the default (1 L); Clear empties both fields.',
      'Both inputs stay editable and no Calculate button is required.',
    ],
  },
  {
    id: 'other-volume-converters',
    title: 'Other Volume Converters',
    paragraphs: [
      'Related Omega Calculators pages that already exist include Volume Conversion, Liters to Centiliters Converter, mL to Cups Converter, Cubic Meter Calculator, and Liters to Pounds Calculator.',
    ],
  },
];

export const LITER_TO_CC_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Cubic Centimeters Are in a Liter?',
    answer: `One liter contains exactly ${CC_PER_LITER.toLocaleString('en-US')} cubic centimeters: 1 L = ${CC_PER_LITER.toLocaleString('en-US')} cm³ = ${CC_PER_LITER.toLocaleString('en-US')} cc. One cubic centimeter is the volume of a 1 cm × 1 cm × 1 cm cube.`,
  },
  {
    question: 'Is a Liter a Mass or a Volume?',
    answer:
      'A liter is a unit of volume, not mass. Kilograms measure mass. Converting between volume and mass requires the material density.',
  },
  {
    question: 'What Is the Volume of a 2 Liter Bottle?',
    answer: `A two-liter bottle has a nominal volume of 2 L = ${formatVolume(litersToCc(2))} cc. Actual internal capacity can vary slightly by container design.`,
  },
  {
    question: 'Is 1 cc the Same as 1 mL?',
    answer: 'Yes. 1 cc = 1 cm³ = 1 mL.',
  },
  {
    question: 'How Do I Convert 500 cc to Liters?',
    answer: `500 ÷ ${CC_PER_LITER.toLocaleString('en-US')} = ${formatVolume(ccToLiters(500))} L.`,
  },
  {
    question: 'How Many cc Are in 0.75 Liters?',
    answer: `0.75 × ${CC_PER_LITER.toLocaleString('en-US')} = ${formatVolume(litersToCc(0.75))} cc.`,
  },
  {
    question: 'Why Are cc and cm³ Equivalent?',
    answer:
      '“cc” is shorthand for cubic centimeter, written mathematically as cm³. They name the same volume.',
  },
];
