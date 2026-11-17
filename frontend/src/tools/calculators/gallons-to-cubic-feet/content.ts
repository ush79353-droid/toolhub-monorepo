import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertVolume, formatVolume } from './calculation';
import {
  LITERS_PER_CUBIC_FOOT,
  LITERS_PER_UK_GALLON,
  LITERS_PER_US_GALLON,
} from './types';

export const GAL_TO_CU_FT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'us-uk-gallons', label: 'US and UK Gallons' },
  { id: 'gallons-and-cubic-feet', label: 'Gallons and Cubic Feet' },
  { id: 'how-to-convert', label: 'How Do I Convert Gallons to Cubic Feet?' },
  { id: 'related-tools', label: 'Other Useful Converters' },
  { id: 'gal-to-cu-ft-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const US_TO_FT3 = convertVolume(1, 'us_gal', 'ft3');
const UK_TO_FT3 = convertVolume(1, 'uk_gal', 'ft3');
const FT3_TO_US = convertVolume(1, 'ft3', 'us_gal');
const FT3_TO_UK = convertVolume(1, 'ft3', 'uk_gal');

export const GAL_TO_CU_FT_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'us-uk-gallons',
    title: 'US and UK Gallons',
    paragraphs: [
      'Gallons and cubic feet both measure volume. People convert between them for tanks, containers, water storage, engineering, and everyday liquid-volume calculations.',
      `A US liquid gallon equals exactly ${LITERS_PER_US_GALLON} liters (231 cubic inches). It is the gallon used for liquid volume in the United States. This calculator uses US liquid gallons — not US dry gallons.`,
      `A UK imperial gallon equals exactly ${LITERS_PER_UK_GALLON} liters. It is larger than a US liquid gallon by about 20%. Never treat US and UK gallons as interchangeable.`,
    ],
    formula: `1 US gal = ${LITERS_PER_US_GALLON} L · 1 UK gal = ${LITERS_PER_UK_GALLON} L`,
  },
  {
    id: 'gallons-and-cubic-feet',
    title: 'Gallons and Cubic Feet',
    paragraphs: [
      `A cubic foot is the volume of a cube one foot on each side. Exactly 1 ft³ = 1,728 in³ = ${LITERS_PER_CUBIC_FOOT} liters = (0.3048 m)³.`,
      `Using liter factors: 1 US gal ≈ ${formatVolume(US_TO_FT3)} ft³, and 1 UK gal ≈ ${formatVolume(UK_TO_FT3)} ft³.`,
      `In reverse: 1 ft³ ≈ ${formatVolume(FT3_TO_US)} US gal ≈ ${formatVolume(FT3_TO_UK)} UK gal.`,
    ],
    formula: `1 ft³ = ${LITERS_PER_CUBIC_FOOT} L · 1 US gal ≈ ${formatVolume(US_TO_FT3)} ft³ · 1 UK gal ≈ ${formatVolume(UK_TO_FT3)} ft³`,
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert Gallons to Cubic Feet?',
    paragraphs: [
      'Convert through liters (or any shared volume base): ft³ = gallons × (liters per gallon) ÷ (liters per cubic foot).',
      `US gallons to cubic feet: ft³ = US gal × (${LITERS_PER_US_GALLON} / ${LITERS_PER_CUBIC_FOOT}). Example — 20 US gal: 20 × ${formatVolume(US_TO_FT3)} ≈ ${formatVolume(convertVolume(20, 'us_gal', 'ft3'))} ft³.`,
      `UK gallons to cubic feet: ft³ = UK gal × (${LITERS_PER_UK_GALLON} / ${LITERS_PER_CUBIC_FOOT}). Example — 20 UK gal ≈ ${formatVolume(convertVolume(20, 'uk_gal', 'ft3'))} ft³.`,
      `Reverse: multiply cubic feet by ≈ ${formatVolume(FT3_TO_US)} for US gallons or ≈ ${formatVolume(FT3_TO_UK)} for UK gallons.`,
    ],
    formula: `ft³ = gal × L_per_gal / ${LITERS_PER_CUBIC_FOOT}`,
    tableHeaders: ['Volume', 'US gal', 'UK gal', 'ft³'],
    table: [
      [
        '10 US gal',
        formatVolume(10),
        formatVolume(convertVolume(10, 'us_gal', 'uk_gal')),
        formatVolume(convertVolume(10, 'us_gal', 'ft3')),
      ],
      [
        '10 UK gal',
        formatVolume(convertVolume(10, 'uk_gal', 'us_gal')),
        formatVolume(10),
        formatVolume(convertVolume(10, 'uk_gal', 'ft3')),
      ],
      [
        '5 ft³',
        formatVolume(convertVolume(5, 'ft3', 'us_gal')),
        formatVolume(convertVolume(5, 'ft3', 'uk_gal')),
        formatVolume(5),
      ],
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Useful Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Cubic Feet to Gallons Converter, Cubic Inches to Gallons Converter, Cubic Feet to Cubic Meters Converter, Volume Conversion, Cups to Gallons Converter, Liters to Gallons tools, and Gallon Calculator. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const GAL_TO_CU_FT_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Cubic Feet Are in 5 Gallons?',
    answer: `For 5 US liquid gallons: ≈ ${formatVolume(convertVolume(5, 'us_gal', 'ft3'))} ft³. For 5 UK imperial gallons: ≈ ${formatVolume(convertVolume(5, 'uk_gal', 'ft3'))} ft³.`,
  },
  {
    question: 'How Many US Gallons Are in One Cubic Foot?',
    answer: `There are approximately ${formatVolume(FT3_TO_US)} US liquid gallons in one cubic foot.`,
  },
  {
    question: 'How Many UK Gallons Are in One Cubic Foot?',
    answer: `There are approximately ${formatVolume(FT3_TO_UK)} UK imperial gallons in one cubic foot.`,
  },
  {
    question: 'Is a UK Gallon Larger Than a US Gallon?',
    answer: `Yes. A UK imperial gallon equals ${LITERS_PER_UK_GALLON} liters, while a US liquid gallon equals ${LITERS_PER_US_GALLON} liters. The UK gallon is approximately 20% larger.`,
  },
  {
    question: 'How Do I Convert Cubic Feet to US Gallons?',
    answer: `Multiply cubic feet by approximately ${formatVolume(FT3_TO_US)}. Example: 3 × ${formatVolume(FT3_TO_US)} ≈ ${formatVolume(convertVolume(3, 'ft3', 'us_gal'))} US gal.`,
  },
];
