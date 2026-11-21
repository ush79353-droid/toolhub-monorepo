import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  cubicFeetToCubicMeters,
  cubicMetersToCubicFeet,
  formatVolume,
} from './calculation';
import { CUBIC_FEET_TO_CUBIC_METERS } from './types';

export const CU_FT_TO_CU_M_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How to Convert Cubic Feet to Cubic Meters' },
  { id: 'how-to-use-tool', label: 'How to Use the Cubic Feet to Cubic Meters Converter' },
  { id: 'conversion-table', label: 'Cubic Feet to Cubic Meters Conversion Table' },
  { id: 'cu-ft-to-cu-m-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const EXAMPLE_FT3 = [0, 0.1, 0.5, 1, 2, 5, 10, 15, 25, 50, 100, 250, 500, 1000] as const;

export const CU_FT_TO_CU_M_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How to Convert Cubic Feet to Cubic Meters',
    paragraphs: [
      'Cubic feet and cubic meters both measure volume. A cubic foot is the volume of a one-foot cube; a cubic meter is the volume of a one-meter cube.',
      'Converting cubic feet to cubic meters uses the cubed foot-to-meter factor, not a simple linear feet-to-meters scale. Because 1 ft = 0.3048 m exactly, 1 ft³ = (0.3048)³ m³ = 0.028316846592 m³.',
      `Formula: m³ = ft³ × ${CUBIC_FEET_TO_CUBIC_METERS}.`,
      `Example 1: 10 ft³: 10 × ${CUBIC_FEET_TO_CUBIC_METERS} = ${formatVolume(cubicFeetToCubicMeters(10))} m³.`,
      `Example 2: 100 ft³: 100 × ${CUBIC_FEET_TO_CUBIC_METERS} = ${formatVolume(cubicFeetToCubicMeters(100))} m³.`,
      'Practical uses include construction, room and tank volume, shipping capacity, and engineering estimates.',
    ],
    formula: `1 ft = 0.3048 m  ·  1 ft³ = ${CUBIC_FEET_TO_CUBIC_METERS} m³  ·  m³ = ft³ × ${CUBIC_FEET_TO_CUBIC_METERS}`,
  },
  {
    id: 'how-to-use-tool',
    title: 'How to Use the Cubic Feet to Cubic Meters Converter',
    paragraphs: [
      'Enter a volume in cubic feet; cubic meters update automatically. Or enter cubic meters to convert back to cubic feet.',
      'Expand More Conversion Options for cubic centimeters, liters, milliliters, US gallons, cubic inches, and cubic yards.',
      'Share result copies a summary with the page URL. Reload calculator and Clear all changes reset the fields. No form submit is required.',
      `Reverse example; 9 m³: 9 ÷ ${CUBIC_FEET_TO_CUBIC_METERS} ≈ ${formatVolume(cubicMetersToCubicFeet(9))} ft³.`,
    ],
    formula: `ft³ = m³ ÷ ${CUBIC_FEET_TO_CUBIC_METERS}`,
  },
  {
    id: 'conversion-table',
    title: 'Cubic Feet to Cubic Meters Conversion Table',
    paragraphs: [
      'Common cubic-foot volumes with cubic-meter equivalents. Display values drop insignificant trailing zeros; the calculator keeps full precision.',
    ],
    tableHeaders: ['Cubic feet (ft³)', 'Cubic meters (m³)'],
    table: EXAMPLE_FT3.map((ft3) => [
      formatVolume(ft3),
      formatVolume(cubicFeetToCubicMeters(ft3)),
    ]),
  },
];

export const CU_FT_TO_CU_M_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Cubic Feet to Cubic Meters?',
    answer: `Multiply cubic feet by ${CUBIC_FEET_TO_CUBIC_METERS}. Example: 10 × ${CUBIC_FEET_TO_CUBIC_METERS} = ${formatVolume(cubicFeetToCubicMeters(10))} m³.`,
  },
  {
    question: 'How Do I Convert Cubic Meters to Cubic Feet?',
    answer: `Divide cubic meters by ${CUBIC_FEET_TO_CUBIC_METERS}. Example: 2 ÷ ${CUBIC_FEET_TO_CUBIC_METERS} ≈ ${formatVolume(cubicMetersToCubicFeet(2))} ft³.`,
  },
  {
    question: 'What Is 100 Cubic Feet in Cubic Meters?',
    answer: `100 × ${CUBIC_FEET_TO_CUBIC_METERS} = ${formatVolume(cubicFeetToCubicMeters(100))} m³.`,
  },
  {
    question: 'What Is 15 Cubic Meters in Cubic Feet?',
    answer: `15 ÷ ${CUBIC_FEET_TO_CUBIC_METERS} ≈ ${formatVolume(cubicMetersToCubicFeet(15))} ft³.`,
  },
  {
    question: 'Is a Cubic Foot the Same as a Square Foot?',
    answer:
      'No. A square foot measures area (two dimensions). A cubic foot measures volume (three dimensions).',
  },
  {
    question: 'Why Is the Feet-to-Meters Factor Cubed?',
    answer: `Volume uses length × width × height. Converting each edge from feet to meters cubes the linear factor: (0.3048)³ = ${CUBIC_FEET_TO_CUBIC_METERS}.`,
  },
];
