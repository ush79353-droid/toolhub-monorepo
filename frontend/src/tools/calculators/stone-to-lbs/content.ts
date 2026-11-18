import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatMass,
  lbsToStone,
  POUNDS_PER_STONE,
  stoneToKg,
  stoneToLbs,
  KG_PER_STONE,
} from './calculation';

export const ST_TO_LB_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Stone to lbs Converter' },
  { id: 'what-is-stone', label: 'What Is a Stone Unit of Weight?' },
  { id: 'how-to-convert', label: 'How to Convert Stones to lbs or lbs to Stones?' },
  { id: 'conversion-chart', label: 'Conversion Chart' },
  { id: 'related-tools', label: 'Every Weight Conversion That You Think Of!' },
  { id: 'st-to-lb-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_ST = [0.5, 1, 2, 3, 4, 5, 8, 10, 12, 15, 18, 20, 120] as const;

export const ST_TO_LB_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Stone to lbs Converter',
    paragraphs: [
      'Convert mass measurements between stones and pounds instantly. The converter also shows an equivalent in kilograms (or another selected mass unit).',
      'Use it for body weight measurements, UK weight conversions, imperial mass calculations, comparing stones, pounds, and kilograms, and everyday measurement conversions. Enter a value in any field to calculate the others.',
    ],
  },
  {
    id: 'what-is-stone',
    title: 'What Is a Stone Unit of Weight?',
    paragraphs: [
      'A stone is a unit of mass in the British imperial measurement system. One stone equals exactly fourteen avoirdupois pounds.',
      `1 stone = ${POUNDS_PER_STONE} pounds. The standard abbreviation is st. Stone is commonly used for body weight in the UK and Ireland.`,
      'Stones and pounds are units of mass, although everyday speech often calls these measurements weight.',
      `Using the international pound (1 lb = 0.45359237 kg), one stone equals exactly ${KG_PER_STONE} kg.`,
    ],
    formula: `1 st = ${POUNDS_PER_STONE} lb\n1 st = ${KG_PER_STONE} kg`,
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Stones to lbs or lbs to Stones?',
    paragraphs: [
      `Stones to pounds: multiply stones by ${POUNDS_PER_STONE}. Formula: lb = st × ${POUNDS_PER_STONE}. Example: 12 × 14 = 168, so 12 stone = 168 pounds.`,
      `Pounds to stones: divide pounds by ${POUNDS_PER_STONE}. Formula: st = lb ÷ ${POUNDS_PER_STONE}. Example: 150 ÷ 14 ≈ ${formatMass(lbsToStone(150))}, so 150 pounds ≈ 10.7143 stone.`,
      'Enter either value in the calculator to convert both directions instantly, with kilograms (or another unit) updating automatically.',
    ],
    formula: `lb = st × ${POUNDS_PER_STONE}\nst = lb ÷ ${POUNDS_PER_STONE}\n12 × 14 = 168\n150 ÷ 14 ≈ ${formatMass(lbsToStone(150))}`,
  },
  {
    id: 'conversion-chart',
    title: 'Conversion Chart',
    paragraphs: [
      'Common stone values with pound equivalents from the exact factor of 14. Enter any measurement in the calculator for values not listed here.',
    ],
    tableHeaders: ['Mass in Stone (st)', 'Mass in Pounds (lb)'],
    table: TABLE_ST.map((st) => [formatMass(st), formatMass(stoneToLbs(st))]),
  },
  {
    id: 'related-tools',
    title: 'Every Weight Conversion That You Think Of!',
    paragraphs: [
      'Related Omega Calculators mass tools include the Weight Converter, lbs to kg Converter, kg to lbs Converter, Pounds and Ounces Calculator, Pounds to lbs Converter, Pounds to Stone Converter, Pounds to Grams Converter, lbs to Pounds Converter, lbs to Stone Converter, Grams to Ounces Calculator, and Stone to kg Converter. Only catalog tools that exist on this site appear as links below.',
    ],
  },
];

export const ST_TO_LB_FAQS: readonly FAQItem[] = [
  {
    question: 'How Much Is 150 lbs in Stones?',
    answer: `Divide 150 by ${POUNDS_PER_STONE}: 150 ÷ 14 ≈ ${formatMass(lbsToStone(150))}. Therefore 150 lbs ≈ 10.71 stone.`,
  },
  {
    question: 'How Much Is 18 Stones in lbs?',
    answer: `Multiply 18 by ${POUNDS_PER_STONE}: 18 × 14 = ${formatMass(stoneToLbs(18))}. Therefore 18 stone = 252 lbs.`,
  },
  {
    question: 'How Many Pounds Are in One Stone?',
    answer: `There are exactly ${POUNDS_PER_STONE} pounds in one international avoirdupois stone. 1 st = ${POUNDS_PER_STONE} lb.`,
  },
  {
    question: 'How Do I Convert 10 Stone to Pounds?',
    answer: `Multiply 10 by ${POUNDS_PER_STONE}: 10 × 14 = ${formatMass(stoneToLbs(10))}. Therefore 10 stone = 140 pounds.`,
  },
  {
    question: 'How Many Stones Are in 200 Pounds?',
    answer: `Divide 200 by ${POUNDS_PER_STONE}: 200 ÷ 14 ≈ ${formatMass(lbsToStone(200))}. Therefore 200 pounds ≈ 14.29 stone.`,
  },
  {
    question: 'Is Stone the Same as Pound?',
    answer: `No. Stone and pound are different units of mass in the imperial system. One stone equals ${POUNDS_PER_STONE} pounds.`,
  },
  {
    question: 'Can I Convert Stone to Kilograms?',
    answer: `Yes. Multiply stones by ${KG_PER_STONE}. Example: 10 × ${KG_PER_STONE} = ${formatMass(stoneToKg(10))}. Therefore 10 stone = ${formatMass(stoneToKg(10))} kilograms.`,
  },
];
