import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  feetToKilometers,
  formatLength,
  kilometersToFeet,
  FEET_PER_KM,
  METERS_PER_FOOT,
} from './calculation';

export const KM_TO_FEET_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How to Convert Kilometers to Feet' },
  { id: 'how-to-use', label: 'How to Use This km to ft Converter' },
  { id: 'feet-to-km', label: 'Feet to Kilometers Conversion' },
  { id: 'conversion-table', label: 'Kilometers to Feet Conversion Table' },
  { id: 'where-useful', label: 'Where Is km to Feet Conversion Useful?' },
  { id: 'related-converters', label: 'Other Length Conversion Tools' },
  { id: 'km-to-feet-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_KM = [0.001, 0.01, 0.1, 0.5, 1, 2, 5, 10, 20, 50, 100] as const;

export const KM_TO_FEET_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How to Convert Kilometers to Feet',
    paragraphs: [
      'Use the km to Feet Conversion calculator to convert distances between kilometers and feet instantly. Enter a value in kilometers to calculate the equivalent number of feet, or enter a value in feet to convert it back into kilometers.',
      `Kilometers belong to the metric system while feet are commonly used in the imperial and US customary systems. Exactly 1 km = 1,000 m and 1 ft = ${METERS_PER_FOOT} m, so 1 km ≈ ${formatLength(FEET_PER_KM)} ft.`,
      `Example; convert 8.5 km: first 8.5 × 1000 = 8500 m, then 8500 ÷ ${METERS_PER_FOOT} ≈ ${formatLength(kilometersToFeet(8.5))} ft. Therefore 8.5 kilometers ≈ ${formatLength(kilometersToFeet(8.5))} feet.`,
    ],
    formula: `ft = (km × 1000) ÷ ${METERS_PER_FOOT}\nft ≈ km × ${formatLength(FEET_PER_KM)}`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use This km to ft Converter',
    paragraphs: [
      '1. Enter a distance in the kilometers field.',
      '2. The converter immediately calculates the equivalent value in feet.',
      '3. To convert in reverse, enter a measurement in feet.',
      '4. The kilometer value updates automatically.',
      '5. Expand Other length units if additional conversions are needed.',
      '6. Clear the inputs or share the result using the available buttons.',
      'Negative distances are rejected. Fields start empty.',
    ],
  },
  {
    id: 'feet-to-km',
    title: 'Feet to Kilometers Conversion',
    paragraphs: [
      `Multiply feet by ${METERS_PER_FOOT / 1000} (exactly ${METERS_PER_FOOT} m per foot ÷ 1000).`,
      `Example; convert 5,000 feet: 5000 × ${METERS_PER_FOOT / 1000} = ${formatLength(feetToKilometers(5000))} km. Therefore 5,000 feet = ${formatLength(feetToKilometers(5000))} kilometers.`,
    ],
    formula: `km = ft × ${METERS_PER_FOOT / 1000}`,
  },
  {
    id: 'conversion-table',
    title: 'Kilometers to Feet Conversion Table',
    paragraphs: [
      'Common kilometer values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['Kilometers (km)', 'Feet (ft)'],
    table: TABLE_KM.map((km) => [formatLength(km), formatLength(kilometersToFeet(km))]),
  },
  {
    id: 'where-useful',
    title: 'Where Is km to Feet Conversion Useful?',
    paragraphs: [
      'People convert kilometers to feet for road and travel distances, engineering calculations, land and geographical measurements, mapping and surveying, hiking and outdoor activities, and moving measurements between metric and imperial systems.',
      'Both kilometers and feet measure length or distance; not area or volume.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Other Length Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Feet Converter, Kilometer Calculator, Kilometer to Meter Converter, Kilometers to Miles Calculator, Length Converter, Distance Converter, Feet to Miles Converter, Feet to Yards Conversion, Inch Converter, and Height Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KM_TO_FEET_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Feet Are in a Kilometer?',
    answer: `There are approximately ${formatLength(kilometersToFeet(1))} feet in one kilometer. The formula is ft = km × ${formatLength(FEET_PER_KM)}.`,
  },
  {
    question: 'What Are 7 Feet in Kilometers?',
    answer: `Multiply 7 by ${METERS_PER_FOOT / 1000}. 7 × ${METERS_PER_FOOT / 1000} = ${formatLength(feetToKilometers(7))}. Therefore 7 feet = ${formatLength(feetToKilometers(7))} km.`,
  },
  {
    question: 'How Do I Convert 5 km to Feet?',
    answer: `Multiply 5 kilometers by the kilometers-to-feet factor. 5 × ${formatLength(FEET_PER_KM)} ≈ ${formatLength(kilometersToFeet(5))}. Therefore 5 kilometers is approximately ${formatLength(kilometersToFeet(5))} feet.`,
  },
  {
    question: 'How Many Kilometers Are in 10,000 Feet?',
    answer: `10000 × ${METERS_PER_FOOT / 1000} = ${formatLength(feetToKilometers(10000))}. Therefore 10,000 feet = ${formatLength(feetToKilometers(10000))} km.`,
  },
  {
    question: 'Are Feet and Kilometers Both Units of Length?',
    answer:
      'Yes. Feet and kilometers both measure length or distance. Kilometers are part of the metric system, while feet are used in imperial and US customary measurements.',
  },
];
