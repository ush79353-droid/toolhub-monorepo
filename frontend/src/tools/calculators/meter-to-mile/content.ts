import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatLength, metersToMiles, milesToMeters } from './calculation';
import { METERS_PER_MILE } from './types';

export const METER_TO_MILE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-meters-and-miles', label: 'What Are Meters and Miles?' },
  { id: 'meters-to-miles-conversion', label: 'Meters to Miles Conversion' },
  { id: 'how-to-use', label: 'How to Use Our Meter to Mile Converter' },
  { id: 'our-length-converters', label: 'Our Length Converters' },
  { id: 'meter-to-mile-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_METERS = [1, 10, 100, 250, 500, 1000, 1609.344, 2000, 5000, 10000, 42195] as const;

export const METER_TO_MILE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-are-meters-and-miles',
    title: 'What Are Meters and Miles?',
    paragraphs: [
      'A meter (m) is the SI base unit of length, used worldwide in science, engineering, and everyday measurement.',
      'A mile (mi) is a length unit in US customary and British imperial systems. The international statute mile is exactly 1609.344 meters, which equals 1.609344 kilometers.',
      'Miles are common for road distances in countries such as the United States and the United Kingdom. This converter uses the statute mile, not the nautical mile (exactly 1852 m).',
    ],
    formula: `1 mi = ${METERS_PER_MILE} m = 1.609344 km`,
  },
  {
    id: 'meters-to-miles-conversion',
    title: 'Meters to Miles Conversion',
    paragraphs: [
      `Formula: miles = meters / ${METERS_PER_MILE}.`,
      `Example 1 — convert 600 meters to miles: 600 ÷ ${METERS_PER_MILE} ≈ ${formatLength(metersToMiles(600))} mi.`,
      `Example 2 — convert 2.3 miles to meters: 2.3 × ${METERS_PER_MILE} = ${formatLength(milesToMeters(2.3))} m.`,
      `Example 3 — convert 5 kilometers to miles: 5 km = 5000 m; 5000 ÷ ${METERS_PER_MILE} ≈ ${formatLength(metersToMiles(5000))} mi.`,
      'Displayed table values may be rounded; the calculator uses the exact 1609.344 factor.',
    ],
    formula: `mi = m / ${METERS_PER_MILE} · m = mi × ${METERS_PER_MILE}`,
    tableHeaders: ['Meters (m)', 'Miles (mi)'],
    table: TABLE_METERS.map((m) => [formatLength(m), formatLength(metersToMiles(m))]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use Our Meter to Mile Converter',
    paragraphs: [
      '1. Enter a distance in the Length in meters field.',
      '2. The converter immediately displays the equivalent distance in miles.',
      '3. Alternatively, enter a value in the Length in miles field.',
      '4. The converter immediately calculates the equivalent distance in meters.',
      '5. Use Share Result to copy or share the conversion.',
      '6. Use Clear All Changes or Reload to start another conversion.',
      `Example: ${formatLength(METERS_PER_MILE)} meters converts to exactly 1 mile.`,
    ],
  },
  {
    id: 'our-length-converters',
    title: 'Our Length Converters',
    paragraphs: [
      'Related Omega Calculators pages include Meter Converter, Meters to Feet Converter, Length Converter, Feet and Inches Calculator, Decimeter to Meter Converter, and Measurement Converter. Only active catalog tools appear as live site links.',
    ],
  },
];

export const METER_TO_MILE_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Miles Are in a Meter?',
    answer: `One meter is approximately ${formatLength(metersToMiles(1))} miles (1 / ${METERS_PER_MILE}).`,
  },
  {
    question: 'How Many Meters Are in a Mile?',
    answer: `There are exactly ${METERS_PER_MILE} meters in one international statute mile.`,
  },
  {
    question: 'How Many Miles Are in 35 Kilometers?',
    answer: `35 km = 35,000 m. 35000 ÷ ${METERS_PER_MILE} ≈ ${formatLength(metersToMiles(35000))} miles.`,
  },
  {
    question: 'How Do I Convert Meters to Miles?',
    answer: `Divide meters by ${METERS_PER_MILE}.`,
  },
  {
    question: 'How Do I Convert Miles to Meters?',
    answer: `Multiply miles by ${METERS_PER_MILE}.`,
  },
  {
    question: 'Is a Nautical Mile the Same as a Statute Mile?',
    answer:
      'No. An international nautical mile is exactly 1852 meters, whereas an international statute mile is exactly 1609.344 meters.',
  },
  {
    question: 'How Many Meters Are in a Marathon?',
    answer: `A standard marathon is 42,195 meters (42.195 km), about ${formatLength(metersToMiles(42195))} miles.`,
  },
];
