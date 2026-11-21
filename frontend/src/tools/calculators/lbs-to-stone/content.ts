import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatMixedStonePounds,
  formatWeight,
  poundsToStone,
  splitPoundsToStoneAndPounds,
  stoneToPounds,
} from './calculation';
import { POUNDS_PER_STONE } from './types';

export const LBS_TO_STONE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'formula-lbs-to-stone', label: 'Formula Used to Convert Lbs to Stone' },
  { id: 'what-is-a-pound', label: 'What Is a Pound (lb)?' },
  { id: 'what-is-a-stone', label: 'What Is a Stone (st)?' },
  { id: 'pounds-in-one-stone', label: 'How Many Pounds Are in One Stone?' },
  { id: 'how-to-convert-pounds-to-stone', label: 'How to Convert Pounds to Stone' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'other-weight-converters', label: 'Other Weight Converters' },
  { id: 'lbs-to-stone-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_POUNDS = [0, 1, 7, 14, 28, 42, 70, 100, 112, 140, 154, 168, 196, 210, 280] as const;

export const LBS_TO_STONE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'formula-lbs-to-stone',
    title: 'Formula Used to Convert Lbs to Stone',
    paragraphs: [
      `The standard relationship is 1 stone = ${POUNDS_PER_STONE} pounds. To convert pounds into stones, divide by ${POUNDS_PER_STONE}.`,
      `Example: 15 ÷ ${POUNDS_PER_STONE} ≈ ${formatWeight(poundsToStone(15))} st; about 1.0714 stones, so the result is a decimal when the pound count is not a multiple of 14.`,
      `Example: 140 ÷ ${POUNDS_PER_STONE} = ${formatWeight(poundsToStone(140))} st exactly.`,
      `Reverse: pounds = stones × ${POUNDS_PER_STONE}. Example: 12 × ${POUNDS_PER_STONE} = ${formatWeight(stoneToPounds(12))} lb.`,
    ],
    formula: `st = lb ÷ ${POUNDS_PER_STONE} · lb = st × ${POUNDS_PER_STONE}`,
    tableHeaders: ['Pounds (lb)', 'Stones (st)'],
    table: TABLE_POUNDS.map((lb) => [formatWeight(lb), formatWeight(poundsToStone(lb))]),
  },
  {
    id: 'what-is-a-pound',
    title: 'What Is a Pound (lb)?',
    paragraphs: [
      'The pound is a unit of mass commonly used in the United States and other countries. Its standard abbreviation is lb.',
      'One international avoirdupois pound equals exactly 0.45359237 kilograms and exactly 16 ounces. This converter uses that international pound.',
      'Pounds appear in everyday contexts such as body weight, groceries, and shipping.',
    ],
    formula: '1 lb = 0.45359237 kg = 16 oz',
  },
  {
    id: 'what-is-a-stone',
    title: 'What Is a Stone (st)?',
    paragraphs: [
      'A stone is a unit of mass used particularly in the United Kingdom and Ireland. Its abbreviation is st.',
      `One stone equals exactly ${POUNDS_PER_STONE} pounds, or 6.35029318 kilograms. It is often used when discussing human body weight.`,
      'Outside the UK and Ireland, kilograms or pounds are usually preferred.',
    ],
    formula: `1 st = ${POUNDS_PER_STONE} lb = 6.35029318 kg`,
  },
  {
    id: 'pounds-in-one-stone',
    title: 'How Many Pounds Are in One Stone?',
    paragraphs: [
      `One stone equals exactly ${POUNDS_PER_STONE} pounds.`,
      `Examples: 1 st = 14 lb, 2 st = 28 lb, 5 st = 70 lb, 10 st = 140 lb, 15 st = 210 lb.`,
      `Multiply the number of stones by ${POUNDS_PER_STONE} to get pounds.`,
    ],
    formula: `Pounds = Stones × ${POUNDS_PER_STONE}`,
  },
  {
    id: 'how-to-convert-pounds-to-stone',
    title: 'How to Convert Pounds to Stone',
    paragraphs: [
      `1. Identify the weight in pounds.`,
      `2. Divide by ${POUNDS_PER_STONE} for decimal stones.`,
      `3. Optionally express the result as whole stones plus remaining pounds.`,
      (() => {
        const split = splitPoundsToStoneAndPounds(175);
        return `Example: 175 ÷ ${POUNDS_PER_STONE} = ${formatWeight(poundsToStone(175))} st, or ${formatMixedStonePounds(split.wholeStones, split.remainingPounds)}.`;
      })(),
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Lbs to Stone Converter',
    paragraphs: [
      '1. Open the Lbs to Stone Converter.',
      '2. Enter the weight in pounds. stones update instantly.',
      '3. Or enter stones to calculate pounds.',
      '4. Change either value for another conversion; no Calculate button is required.',
      '5. Use Share Result or Copy Result when you need the pair elsewhere.',
      '6. Reload restores the default (140 lb); Clear empties both fields.',
      'The converter is free and runs in the browser with no account required.',
    ],
  },
  {
    id: 'other-weight-converters',
    title: 'Other Weight Converters',
    paragraphs: [
      'Depending on your dataset you may also need kilograms, ounces, or a multi-unit mass converter.',
      'Related Omega Calculators pages that already exist include Weight Converter, Grams to Ounces Calculator, and Pounds and Ounces Calculator.',
    ],
  },
];

export const LBS_TO_STONE_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Pounds to Stone?',
    answer: `Divide pounds by ${POUNDS_PER_STONE}. Example: 140 ÷ ${POUNDS_PER_STONE} = ${formatWeight(poundsToStone(140))} st.`,
  },
  {
    question: 'How Many Pounds Are in One Stone?',
    answer: `One stone contains exactly ${POUNDS_PER_STONE} pounds.`,
  },
  {
    question: 'How Many Stones Are 100 Pounds?',
    answer: `100 ÷ ${POUNDS_PER_STONE} ≈ ${formatWeight(poundsToStone(100))} st (about 7.143 stones).`,
  },
  {
    question: 'How Many Stones Are 150 Pounds?',
    answer: (() => {
      const split = splitPoundsToStoneAndPounds(150);
      return `150 ÷ ${POUNDS_PER_STONE} ≈ ${formatWeight(poundsToStone(150))} st, or ${formatMixedStonePounds(split.wholeStones, split.remainingPounds)}.`;
    })(),
  },
  {
    question: 'How Many Pounds Are 10 Stones?',
    answer: `10 × ${POUNDS_PER_STONE} = ${formatWeight(stoneToPounds(10))} lb.`,
  },
  {
    question: 'What Is 12 Stone in Pounds?',
    answer: `12 × ${POUNDS_PER_STONE} = ${formatWeight(stoneToPounds(12))} lb.`,
  },
  {
    question: 'How Do I Convert 70 Kilograms to Stone?',
    answer:
      'First convert kilograms to pounds, then divide by 14. Alternatively use Stones = Kilograms ÷ 6.35029318. Example: 70 kg ≈ 11.0231 st.',
  },
  {
    question: 'Is Stone Used for Body Weight?',
    answer:
      'Yes. Stones and pounds are commonly used to express human body weight in the United Kingdom and Ireland.',
  },
];
