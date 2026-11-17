import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatLength,
  kilometersToMiles,
  milesToKilometers,
  KM_PER_MILE,
} from './calculation';

export const KM_TO_MI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'mile-vs-km', label: "What's the Difference Between a Mile and a Kilometer?" },
  { id: 'km-to-mi', label: 'How Do I Convert Kilometers to Miles?' },
  { id: 'mi-to-km', label: 'How to Convert Miles to Kilometers' },
  { id: 'examples', label: 'Examples of Kilometers to Miles Conversion' },
  { id: 'conversion-table', label: 'Kilometers to Miles Conversion Table' },
  { id: 'related-converters', label: 'Other Length Conversion Related Calculators' },
  { id: 'km-to-mi-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_KM = [0.5, 1, 2, 3, 5, 10, 20, 25, 50, 100, 200] as const;

export const KM_TO_MI_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'mile-vs-km',
    title: "What's the Difference Between a Mile and a Kilometer?",
    paragraphs: [
      'The Kilometers to Miles Calculator converts distances between kilometers (km) and miles (mi). Enter a measurement in either field to see the equivalent distance instantly. Both units are used for road distances, travel, exercise, and navigation.',
      'A kilometer is a metric unit of length equal to 1,000 meters. A mile is commonly used in the United States and the United Kingdom for road distances.',
      `The exact international conversion is 1 mile = ${KM_PER_MILE} km, so 1 km ≈ ${formatLength(kilometersToMiles(1))} mi. A mile is longer than a kilometer.`,
    ],
    formula: `1 mi = ${KM_PER_MILE} km\n1 km ≈ ${formatLength(kilometersToMiles(1))} mi`,
  },
  {
    id: 'km-to-mi',
    title: 'How Do I Convert Kilometers to Miles?',
    paragraphs: [
      `Divide kilometers by ${KM_PER_MILE}.`,
      `Example — convert 10 km: 10 ÷ ${KM_PER_MILE} ≈ ${formatLength(kilometersToMiles(10))} mi. Therefore 10 km ≈ ${formatLength(kilometersToMiles(10))} mi.`,
      'Rounding to two or three decimal places is often suitable for road signs and everyday travel; keep more digits for precise navigation or race distances.',
    ],
    formula: `mi = km ÷ ${KM_PER_MILE}`,
  },
  {
    id: 'mi-to-km',
    title: 'How to Convert Miles to Kilometers',
    paragraphs: [
      `Multiply miles by ${KM_PER_MILE}.`,
      `Example — convert 8 mi: 8 × ${KM_PER_MILE} = ${formatLength(milesToKilometers(8))} km. Therefore 8 mi = ${formatLength(milesToKilometers(8))} km.`,
    ],
    formula: `km = mi × ${KM_PER_MILE}`,
  },
  {
    id: 'examples',
    title: 'Examples of Kilometers to Miles Conversion',
    paragraphs: [
      `Example 1 — a 5 km run: 5 ÷ ${KM_PER_MILE} ≈ ${formatLength(kilometersToMiles(5))} mi.`,
      `Example 2 — a 42.195 km marathon: 42.195 ÷ ${KM_PER_MILE} ≈ ${formatLength(kilometersToMiles(42.195))} mi.`,
      `Example 3 — a 100 km road trip: 100 ÷ ${KM_PER_MILE} ≈ ${formatLength(kilometersToMiles(100))} mi.`,
      'This converter is useful when switching between metric and imperial distance measurements for travel, fitness, and mapping.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Kilometers to Miles Conversion Table',
    paragraphs: [
      'Common kilometer values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['Kilometers (km)', 'Miles (mi)'],
    table: TABLE_KM.map((km) => [formatLength(km), formatLength(kilometersToMiles(km))]),
  },
  {
    id: 'related-converters',
    title: 'Other Length Conversion Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Kilometer Calculator, Kilometer to Meter Converter, Distance Converter, Length Converter, Miles to Kilometers Converter, Feet to Miles Converter, Inch Converter, Feet Converter, Height Converter, Meters to Feet Converter, and Centimeter Calculator. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KM_TO_MI_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 10 Kilometers to Miles?',
    answer: `Divide 10 by ${KM_PER_MILE}. 10 ÷ ${KM_PER_MILE} ≈ ${formatLength(kilometersToMiles(10))}. Therefore 10 kilometers is approximately 6.21 miles.`,
  },
  {
    question: 'How Many Miles Are in a Kilometer?',
    answer: `There are approximately ${formatLength(kilometersToMiles(1))} miles in one kilometer.`,
  },
  {
    question: 'How Many Kilometers Are in One Mile?',
    answer: `One international mile is exactly ${KM_PER_MILE} kilometers.`,
  },
  {
    question: 'Is a Mile Longer Than a Kilometer?',
    answer: `Yes. One mile is approximately ${KM_PER_MILE} times as long as one kilometer.`,
  },
  {
    question: 'How Many Miles Is a 5K Run?',
    answer: `A 5K run measures 5 kilometers. 5 ÷ ${KM_PER_MILE} ≈ ${formatLength(kilometersToMiles(5))}. A 5K run is approximately 3.11 miles.`,
  },
  {
    question: 'How Do I Convert Miles Back to Kilometers?',
    answer: `Multiply the number of miles by ${KM_PER_MILE}. For example, 15 × ${KM_PER_MILE} = ${formatLength(milesToKilometers(15))} km.`,
  },
];
