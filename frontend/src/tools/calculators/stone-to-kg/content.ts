import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatMass,
  kgToStone,
  KG_PER_STONE,
  stoneToKg,
} from './calculation';

export const ST_TO_KG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Stone to kg Converter' },
  { id: 'units', label: 'Stone and Kilogram' },
  { id: 'how-to-convert', label: 'How to Convert Stone to kg' },
  { id: 'example', label: 'Stones to Kilograms Conversion — An Example' },
  { id: 'conversion-table', label: 'Stone to Kilograms Conversion Table' },
  { id: 'related-tools', label: 'Other Weight/Mass Converters' },
  { id: 'st-to-kg-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_ST = [0.5, 1, 2, 3, 5, 8, 10, 12, 14, 15, 20, 25] as const;

function tableKg(st: number): string {
  return stoneToKg(st).toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

export const ST_TO_KG_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Stone to kg Converter',
    paragraphs: [
      'Convert measurements between stones and kilograms instantly. Use it for body weight conversions, medical and fitness measurements, comparing UK and international weight units, everyday mass calculations, and converting imperial units into metric units.',
      'Type a value in either field to obtain the corresponding result immediately. Both directions — stone → kilograms and kilograms → stone — are supported.',
    ],
  },
  {
    id: 'units',
    title: 'Stone and Kilogram',
    paragraphs: [
      'A kilogram (kg) is the SI base unit of mass. It is commonly used worldwide for body weight, scientific calculations, shipping and packaging, and everyday mass measurements.',
      'A stone (st) is an imperial unit of mass. One stone equals exactly 14 avoirdupois pounds: 1 st = 14 lb. Stone is particularly associated with body weight measurements in the United Kingdom and Ireland. Kilograms are used more widely internationally.',
      `Because 1 lb = 0.45359237 kg, one stone equals exactly ${KG_PER_STONE} kg.`,
    ],
    formula: `1 st = 14 lb\n1 lb = 0.45359237 kg\n1 st = ${KG_PER_STONE} kg`,
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Stone to kg',
    paragraphs: [
      `Formula: kg = st × ${KG_PER_STONE}. Multiply the number of stones by that factor.`,
      `Example — convert 15 stone: 15 × ${KG_PER_STONE} = ${formatMass(stoneToKg(15))}. Therefore 15 stone equals approximately 95.25 kilograms.`,
      `Reverse conversion: st = kg ÷ ${KG_PER_STONE}. Example — 70 ÷ ${KG_PER_STONE} ≈ ${formatMass(kgToStone(70))}, so 70 kg ≈ 11.02 stone.`,
    ],
    formula: `kg = st × ${KG_PER_STONE}\nst = kg ÷ ${KG_PER_STONE}\n15 × ${KG_PER_STONE} = ${formatMass(stoneToKg(15))}`,
  },
  {
    id: 'example',
    title: 'Stones to Kilograms Conversion — An Example',
    paragraphs: [
      '1. Find the Weight in stones field.',
      '2. Enter the weight, for example, 15.',
      '3. The calculator instantly calculates the equivalent mass.',
      '4. Read the result in the Weight in kilograms field.',
      '5. To convert in reverse, enter a value in kilograms.',
      `Example result: 15 st = ${formatMass(stoneToKg(15))} kg.`,
      'Use Share result or Copy result when you need the values elsewhere. Reload or clear to start again.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Stone to Kilograms Conversion Table',
    paragraphs: [
      'Common stone values with kilogram equivalents from the same conversion engine. Displayed decimals are rounded for readability; calculations use full precision.',
    ],
    tableHeaders: ['Stones (st)', 'Kilograms (kg)'],
    table: TABLE_ST.map((st) => [formatMass(st), tableKg(st)]),
  },
  {
    id: 'related-tools',
    title: 'Other Weight/Mass Converters',
    paragraphs: [
      'Related Omega Calculators mass tools include the Weight Converter, Ounces to Grams Converter, Pounds to Ounces Converter, Ounce to kg Converter, kg to Stones Converter, Pounds to Grams Converter, lbs to kg Converter, kg to Ounce Converter, and Pounds to Stone Converter. Only catalog tools that exist on this site appear as links below.',
    ],
  },
];

export const ST_TO_KG_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 8 Stone to kg?',
    answer: `Multiply 8 by ${KG_PER_STONE}: 8 × ${KG_PER_STONE} = ${formatMass(stoneToKg(8))}. Therefore 8 stone equals approximately 50.80 kg.`,
  },
  {
    question: 'What Is 10 Stone in kg?',
    answer: `10 × ${KG_PER_STONE} = ${formatMass(stoneToKg(10))}. Therefore 10 stone equals approximately 63.50 kg.`,
  },
  {
    question: 'How Many Kilograms Are in One Stone?',
    answer: `One stone contains exactly ${KG_PER_STONE} kilograms. 1 st = ${KG_PER_STONE} kg.`,
  },
  {
    question: 'How Do I Convert kg to Stone?',
    answer: `Divide the weight in kilograms by ${KG_PER_STONE}. Example: 70 ÷ ${KG_PER_STONE} ≈ ${formatMass(kgToStone(70))}. Therefore 70 kg is approximately 11.02 stone.`,
  },
  {
    question: 'Is Stone a Unit of Weight or Mass?',
    answer:
      'Stone is traditionally used as a unit of mass, especially for measuring body weight in the UK and Ireland. In everyday language, people commonly refer to body mass measurements as weight.',
  },
  {
    question: 'How Many Pounds Are in One Stone?',
    answer: 'One stone is exactly equal to 14 pounds. 1 st = 14 lb.',
  },
];
