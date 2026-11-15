import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { cubicMetersToCubicFeet, formatMeasure } from './calculation';
import { CUBIC_METERS_PER_CUBIC_FOOT } from './types';

export const CUBIC_METER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-a-cubic-meter', label: 'What Is a Cubic Meter?' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'how-to-calculate', label: 'How to Calculate Cubic Meters' },
  { id: 'from-centimeters', label: 'How to Calculate from Centimeters' },
  { id: 'ft3-to-m3', label: 'Cubic Feet to Cubic Meters' },
  { id: 'm3-to-ft3', label: 'Cubic Meters to Cubic Feet' },
  { id: 'to-liters', label: 'Cubic Meters to Liters' },
  { id: 'to-gallons', label: 'Cubic Meters to Gallons' },
  { id: 'conversion-table', label: 'Cubic Meter Conversion Table' },
  { id: 'm2-vs-m3', label: 'Square Meters vs Cubic Meters' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'cubic-meter-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  cubicMeters: string;
  liters: string;
  cubicFeet: string;
}

export interface CubicMeterGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
}

const TABLE_M3 = [0.1, 0.5, 1, 2, 5, 10, 25, 50, 100] as const;

export const CUBIC_METER_GUIDE_SECTIONS: readonly CubicMeterGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This calculator finds the volume of a rectangular object or space in cubic meters (m³) from height, length, and width, and converts between common volume units such as cubic feet and liters.',
      'Each edge can use its own length unit. A separate conversion section converts a known volume into cubic meters without inventing the three dimensions.',
    ],
  },
  {
    id: 'what-is-a-cubic-meter',
    title: 'What Is a Cubic Meter?',
    paragraphs: [
      'A cubic meter is a volume unit with symbol m³. It is the volume of a cube measuring one meter on each edge. One cubic meter equals exactly 1000 liters and exactly 1,000,000 cubic centimeters.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Calculator',
    paragraphs: [
      'Enter height, length, and width with their units to compute cubic meters. Or enter a known volume and pick its unit to convert into m³. Expand More conversion options for feet, yards, inches, liters, and gallons. Find a missing dimension solves one unknown edge when volume and the other two edges are known.',
    ],
  },
  {
    id: 'how-to-calculate',
    title: 'How to Calculate Cubic Meters of a Box or Space',
    paragraphs: [
      'Convert each edge to meters, then multiply. Example: 4 m × 3 m × 2 m = 24 m³.',
    ],
    formula: 'Volume (m³) = Length (m) × Width (m) × Height (m)',
  },
  {
    id: 'from-centimeters',
    title: 'How to Calculate Cubic Meters from Centimeters',
    paragraphs: [
      'Multiply the three dimensions in centimeters and divide by 1,000,000. Example: 100 cm × 50 cm × 40 cm = 0.2 m³.',
    ],
    formula: 'm³ = Length(cm) × Width(cm) × Height(cm) / 1,000,000',
  },
  {
    id: 'ft3-to-m3',
    title: 'How to Convert Cubic Feet to Cubic Meters',
    paragraphs: [
      `Multiply cubic feet by ${CUBIC_METERS_PER_CUBIC_FOOT}. Example: 50 ft³ = ${formatMeasure(50 * CUBIC_METERS_PER_CUBIC_FOOT)} m³.`,
    ],
    formula: 'm³ = ft³ × 0.028316846592',
  },
  {
    id: 'm3-to-ft3',
    title: 'How to Convert Cubic Meters to Cubic Feet',
    paragraphs: [
      `Divide cubic meters by ${CUBIC_METERS_PER_CUBIC_FOOT}. Example: 1 m³ ≈ ${formatMeasure(cubicMetersToCubicFeet(1))} ft³.`,
    ],
    formula: 'ft³ = m³ / 0.028316846592',
  },
  {
    id: 'to-liters',
    title: 'Cubic Meters to Liters',
    paragraphs: ['Multiply cubic meters by 1000. Example: 2.5 m³ = 2500 liters.'],
    formula: 'Liters = Cubic meters × 1000',
  },
  {
    id: 'to-gallons',
    title: 'Cubic Meters to Gallons',
    paragraphs: [
      'Use the exact US liquid gallon (0.003785411784 m³). Example: 1 m³ ≈ 264.172052358 US gallons. Imperial gallons use 0.00454609 m³ each.',
    ],
    formula: 'US gallons = m³ / 0.003785411784',
  },
  {
    id: 'conversion-table',
    title: 'Cubic Meter Conversion Table',
    paragraphs: [
      'Common cubic-meter values with liters and cubic feet from the same constants used by the calculator.',
    ],
    table: TABLE_M3.map((m3) => ({
      cubicMeters: formatMeasure(m3),
      liters: formatMeasure(m3 * 1000),
      cubicFeet: formatMeasure(cubicMetersToCubicFeet(m3)),
    })),
  },
  {
    id: 'm2-vs-m3',
    title: 'Difference Between Square Meters and Cubic Meters',
    paragraphs: [
      'Square meters (m²) measure area from two dimensions. Cubic meters (m³) measure volume from three. You cannot convert area into volume without a height or depth.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Use cubic meters for construction takeoffs, concrete, water-tank capacity, shipping, storage, engineering, excavation, soil volume, room measurements, and material planning.',
      'Results assume a rectangular prism. Irregular shapes need different geometry.',
    ],
  },
];

export const CUBIC_METER_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a cubic meter?',
    answer: 'A cubic meter is the volume of a cube measuring one meter along each edge.',
  },
  {
    question: 'How do I calculate cubic meters?',
    answer:
      'Multiply length, width, and height after converting all measurements to meters.',
  },
  {
    question: 'How many cubic centimeters are in one cubic meter?',
    answer: 'Exactly 1,000,000 cubic centimeters.',
  },
  {
    question: 'How many cubic feet are in one cubic meter?',
    answer: `Approximately ${formatMeasure(cubicMetersToCubicFeet(1))} cubic feet.`,
  },
  {
    question: 'How many liters are in one cubic meter?',
    answer: 'Exactly 1000 liters.',
  },
  {
    question: 'How many US gallons are in one cubic meter?',
    answer: 'Approximately 264.172052358 US liquid gallons.',
  },
  {
    question: 'How do I convert cubic feet to cubic meters?',
    answer: 'Multiply cubic feet by exactly 0.028316846592.',
  },
  {
    question: 'How do I convert cubic meters to cubic feet?',
    answer: 'Divide cubic meters by 0.028316846592.',
  },
  {
    question: 'How do I calculate cubic meters from centimeters?',
    answer:
      'Multiply the three dimensions in centimeters and divide the result by one million.',
  },
  {
    question: 'How many cubic meters are in a 2 m × 3 m × 4 m box?',
    answer: '2 × 3 × 4 = 24 m³.',
  },
  {
    question: 'How many cubic meters are in 100 cubic feet?',
    answer: '100 × 0.028316846592 = 2.8316846592 m³.',
  },
  {
    question: 'Can I calculate cubic meters using feet and inches?',
    answer:
      'Yes. The calculator converts each measurement to meters before calculating volume.',
  },
  {
    question: 'Is one cubic meter equal to one square meter?',
    answer: 'No. Cubic meters measure volume, while square meters measure area.',
  },
  {
    question: 'Can cubic meters be used to measure water?',
    answer: 'Yes. One cubic meter represents a volume equal to 1000 liters.',
  },
  {
    question: 'Can I calculate the missing height from a known volume?',
    answer:
      'Yes, when the length and width are also known, using Height = Volume / (Length × Width).',
  },
];
