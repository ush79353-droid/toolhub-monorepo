import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  POUNDS_PER_STONE,
  formatMass,
  formatMixedStonePounds,
  poundsToStone,
  splitPoundsToStoneAndPounds,
  stoneToPounds,
} from './calculation';
import { KG_PER_STONE } from './types';

export const POUNDS_TO_STONE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Pounds to Stone Converter' },
  { id: 'how-to-convert', label: 'How to Convert Weight From Pounds to Stone' },
  { id: 'how-to-use', label: 'How to Use the Pounds to Stone Converter' },
  { id: 'lb-to-st-table', label: 'Pounds to Stone Conversion Chart' },
  { id: 'st-to-lb-table', label: 'Stone to Pounds Conversion Chart' },
  { id: 'what-is-stone', label: 'What Is a Stone in Weight?' },
  { id: 'pounds-versus-stone', label: 'Pounds Versus Stone' },
  { id: 'related-converters', label: 'Other Weight Converters' },
  { id: 'pounds-to-stone-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_LB = [1, 7, 14, 28, 42, 56, 70, 84, 98, 112, 126, 140, 154, 168, 182, 196, 210] as const;
const TABLE_ST = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const;

export const POUNDS_TO_STONE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Pounds to Stone Converter',
    paragraphs: [
      'Convert mass between pounds (lb) and stone (st). One stone equals exactly 14 avoirdupois pounds. Stone is commonly used for body weight in the United Kingdom and Ireland.',
      'Enter either pounds or stone and see the equivalent value instantly. Decimal stone is the primary result; a mixed stone-and-pounds reading is shown as secondary information.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Weight From Pounds to Stone',
    paragraphs: [
      `One stone contains exactly ${POUNDS_PER_STONE} pounds. Divide pounds by ${POUNDS_PER_STONE} to get decimal stone.`,
      `Example — convert 168 pounds: 168 ÷ ${POUNDS_PER_STONE} = ${formatMass(poundsToStone(168))}. Therefore 168 pounds = ${formatMass(poundsToStone(168))} stone.`,
      (() => {
        const split = splitPoundsToStoneAndPounds(128);
        return `Example — convert 128 pounds: 128 ÷ ${POUNDS_PER_STONE} ≈ ${formatMass(poundsToStone(128))} stone. As whole stone plus remaining pounds, that is exactly ${formatMixedStonePounds(split.wholeStones, split.remainingPounds)}.`;
      })(),
      'Do not confuse 10.5 st with 10 st 5 lb. Because 0.5 st = 7 lb, 10.5 st = 10 st 7 lb.',
    ],
    formula: `Weight in stone = Weight in pounds ÷ ${POUNDS_PER_STONE}\nWeight in pounds = Weight in stone × ${POUNDS_PER_STONE}`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Pounds to Stone Converter',
    paragraphs: [
      '1. Enter the weight in pounds in the first input field.',
      `2. The calculator automatically divides the value by ${POUNDS_PER_STONE}.`,
      '3. Read the equivalent decimal stone value in the second field.',
      '4. To reverse the conversion, enter a weight in stone.',
      `5. The calculator automatically multiplies the value by ${POUNDS_PER_STONE} to display pounds.`,
      '6. Use Reload Calculator to restore the default of 14 lb, or Clear All Changes to empty both fields.',
      'Results update instantly — no Convert button is required.',
    ],
  },
  {
    id: 'lb-to-st-table',
    title: 'Pounds to Stone Conversion Chart',
    paragraphs: [
      `Values use the exact factor of ${POUNDS_PER_STONE} pounds per stone. Displayed decimals are rounded for readability where the result is repeating.`,
    ],
    tableHeaders: ['Pounds (lb)', 'Stone (st)'],
    table: TABLE_LB.map((lb) => [formatMass(lb), formatMass(poundsToStone(lb))]),
  },
  {
    id: 'st-to-lb-table',
    title: 'Stone to Pounds Conversion Chart',
    paragraphs: [
      `Multiply stone by ${POUNDS_PER_STONE} to obtain pounds.`,
    ],
    tableHeaders: ['Stone (st)', 'Pounds (lb)'],
    table: TABLE_ST.map((st) => [formatMass(st), formatMass(stoneToPounds(st))]),
  },
  {
    id: 'what-is-stone',
    title: 'What Is a Stone in Weight?',
    paragraphs: [
      'Stone is a unit of mass in the British imperial system. The standard stone equals exactly 14 avoirdupois pounds.',
      'It is commonly used in the United Kingdom and Ireland when describing body weight. In many other countries, weight is more often stated in kilograms or pounds.',
      `Mass equivalent: 1 st ≈ ${KG_PER_STONE} kg (rounded).`,
    ],
    formula: `1 st = ${POUNDS_PER_STONE} lb ≈ ${KG_PER_STONE} kg`,
  },
  {
    id: 'pounds-versus-stone',
    title: 'Pounds Versus Stone',
    paragraphs: [
      'A pound is a smaller unit of mass. Stone is a larger unit used particularly for expressing body weight.',
      `Examples: 140 lb = ${formatMass(poundsToStone(140))} st; 154 lb = ${formatMass(poundsToStone(154))} st; 168 lb = ${formatMass(poundsToStone(168))} st.`,
      (() => {
        const split = splitPoundsToStoneAndPounds(150);
        return `The stone system is often used together with remaining pounds. For example, 150 lb = ${formatMixedStonePounds(split.wholeStones, split.remainingPounds)}.`;
      })(),
    ],
  },
  {
    id: 'related-converters',
    title: 'Other Weight Converters',
    paragraphs: [
      'Related Omega Calculators pages include Weight Converter, kg to lbs Converter, lbs to kg Converter, Pounds to Grams Converter, Pounds to Ounces Converter, Ounces to Pounds Converter, lbs to Stone Converter, and kg to Stones Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const POUNDS_TO_STONE_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is 128 Pounds in Stone?',
    answer: (() => {
      const split = splitPoundsToStoneAndPounds(128);
      return `Divide 128 by ${POUNDS_PER_STONE}: 128 ÷ ${POUNDS_PER_STONE} ≈ ${formatMass(poundsToStone(128))}. Therefore 128 pounds is approximately ${formatMass(poundsToStone(128))} stone. In traditional stone-and-pounds notation, this is exactly ${formatMixedStonePounds(split.wholeStones, split.remainingPounds)}.`;
    })(),
  },
  {
    question: 'How Many Pounds Are in One Stone?',
    answer: `One stone is exactly ${POUNDS_PER_STONE} pounds.`,
  },
  {
    question: 'How Many Pounds Are in 10 Stone?',
    answer: `10 × ${POUNDS_PER_STONE} = ${formatMass(stoneToPounds(10))}. Therefore 10 stone = ${formatMass(stoneToPounds(10))} pounds.`,
  },
  {
    question: 'How Many Stone Is 150 Pounds?',
    answer: (() => {
      const split = splitPoundsToStoneAndPounds(150);
      return `150 ÷ ${POUNDS_PER_STONE} ≈ ${formatMass(poundsToStone(150))}. Therefore 150 pounds is approximately ${formatMass(poundsToStone(150))} stone. Alternatively, it is exactly ${formatMixedStonePounds(split.wholeStones, split.remainingPounds)}.`;
    })(),
  },
  {
    question: 'How Do I Convert Stone Back to Pounds?',
    answer: `Multiply the number of stone by ${POUNDS_PER_STONE}. For example, 12 × ${POUNDS_PER_STONE} = ${formatMass(stoneToPounds(12))}. Therefore 12 stone = ${formatMass(stoneToPounds(12))} pounds.`,
  },
  {
    question: 'Is Stone Still Used in the UK?',
    answer:
      'Yes. Stone remains commonly used for expressing personal body weight in the United Kingdom, although kilograms are also widely used.',
  },
  {
    question: 'Is a Stone the Same as a Kilogram?',
    answer: `No. One stone equals approximately ${KG_PER_STONE} kilograms.`,
  },
];
