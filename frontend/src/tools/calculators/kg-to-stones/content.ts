import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatMass,
  kilogramsToStones,
  stonesToKilograms,
  KG_PER_STONE,
  STONES_PER_KG,
} from './calculation';

export const KG_TO_STONES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How Do I Convert kg to Stones?' },
  { id: 'how-to-use', label: 'How Do I Use the kg to Stones Converter?' },
  { id: 'conversion-table', label: 'kg to Stones Conversion Table' },
  { id: 'what-is-stone', label: 'What Is a Stone in Weight Measurement?' },
  { id: 'stones-to-kg', label: 'How to Convert Stones to Kilograms' },
  { id: 'related-converters', label: 'Other Related Weight Converters' },
  { id: 'kg-to-stones-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_KG = [1, 5, 10, 20, 50, 60, 70, 80, 90, 100] as const;

/** 1 stone = 14 lb; used for stones-and-pounds FAQ examples. */
const LB_PER_STONE = 14;
const KG_PER_POUND = KG_PER_STONE / LB_PER_STONE;

function stonesAndPoundsLabel(kg: number): string {
  const totalLb = kg / KG_PER_POUND;
  const wholeSt = Math.floor(totalLb / LB_PER_STONE);
  let remLb = totalLb - wholeSt * LB_PER_STONE;
  if (remLb >= LB_PER_STONE - 1e-12) {
    return `${wholeSt + 1} st 0 lb`;
  }
  if (remLb < 0 && remLb > -1e-12) remLb = 0;
  return `${wholeSt} st ${formatMass(remLb)} lb`;
}

export const KG_TO_STONES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How Do I Convert kg to Stones?',
    paragraphs: [
      'This converter changes mass between kilograms and British imperial stones. Both directions are supported.',
      `One stone equals exactly ${KG_PER_STONE} kilograms (14 international avoirdupois pounds). To convert kilograms into stones, divide by ${KG_PER_STONE} (about ${formatMass(STONES_PER_KG)} st per kg).`,
      `Example — convert 70 kg: 70 ÷ ${KG_PER_STONE} ≈ ${formatMass(kilogramsToStones(70))} st.`,
    ],
    formula: `st = kg ÷ ${KG_PER_STONE}   ·   kg = st × ${KG_PER_STONE}`,
  },
  {
    id: 'how-to-use',
    title: 'How Do I Use the kg to Stones Converter?',
    paragraphs: [
      '1. Enter a mass in kilograms.',
      '2. Read the equivalent mass in stones.',
      '3. Enter a value in stones to reverse the conversion.',
      '4. Share or copy the result when you need it elsewhere.',
      'Negative mass values are rejected. Fields start empty and update as you type.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'kg to Stones Conversion Table',
    paragraphs: [
      'Common kilogram values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['Kilograms (kg)', 'Stones (st)'],
    table: TABLE_KG.map((kg) => [formatMass(kg), formatMass(kilogramsToStones(kg))]),
  },
  {
    id: 'what-is-stone',
    title: 'What Is a Stone in Weight Measurement?',
    paragraphs: [
      'The stone is a traditional British imperial unit of mass. One stone contains exactly 14 pounds.',
      `One stone equals exactly ${KG_PER_STONE} kilograms.`,
      'Stones are commonly used for expressing body weight in the United Kingdom and in some other contexts that retain imperial body-mass wording.',
    ],
  },
  {
    id: 'stones-to-kg',
    title: 'How to Convert Stones to Kilograms',
    paragraphs: [
      `Multiply the mass in stones by ${KG_PER_STONE}.`,
      `Example — convert 12 st: 12 × ${KG_PER_STONE} = ${formatMass(stonesToKilograms(12))} kg.`,
    ],
    formula: `kg = st × ${KG_PER_STONE}`,
  },
  {
    id: 'related-converters',
    title: 'Other Related Weight Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Stones to kg Converter, kg to lbs Converter, kg to Ounce Converter, Weight Converter, Pounds to kg Converter, Stones to Pounds Converter, and Grams to kg Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KG_TO_STONES_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Stones Are in 1 kg?',
    answer: `One kilogram is approximately ${formatMass(kilogramsToStones(1))} stones.`,
  },
  {
    question: 'How Many Stones Are in 70 kg?',
    answer: `Seventy kilograms are approximately ${formatMass(kilogramsToStones(70))} stones.`,
  },
  {
    question: 'How Many kg Are in 10 Stones?',
    answer: `Ten stones equal exactly ${formatMass(stonesToKilograms(10))} kilograms.`,
  },
  {
    question: 'How Many Pounds Are in One Stone?',
    answer: 'One stone equals exactly 14 pounds.',
  },
  {
    question: 'How Do I Convert 90 kg to Stones and Pounds?',
    answer: `90 kg is approximately ${formatMass(kilogramsToStones(90))} stones. As stones and pounds: ${stonesAndPoundsLabel(90)}.`,
  },
  {
    question: 'Is a Stone the Same as a Kilogram?',
    answer: `No. Both measure mass, but one stone is equivalent to ${KG_PER_STONE} kilograms.`,
  },
  {
    question: 'How Do I Convert Stones Back to kg?',
    answer: `Multiply the mass in stones by ${KG_PER_STONE}.`,
  },
];
