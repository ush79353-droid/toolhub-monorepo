import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertMeasurement, formatValue } from './calculation';

export const METRIC_TO_IMPERIAL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'metric-vs-imperial', label: 'Metric vs. Imperial Measurement Systems' },
  { id: 'converting-length', label: 'Converting Length from Metric to Imperial' },
  { id: 'temperature-converter', label: 'Temperature Converter from Metric to Imperial' },
  { id: 'other-conversions', label: 'Other Metric to Imperial Conversions' },
  { id: 'how-to-use', label: 'How to Use the Metric to Imperial Converter' },
  { id: 'related-converters', label: 'Related Calculators' },
  { id: 'metric-to-imperial-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
  subsections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
  }[];
}

function must(category: 'length' | 'area' | 'volume' | 'mass' | 'temperature' | 'speed', from: string, to: string, value = 1): string {
  const result = convertMeasurement(value, category, from, to);
  return result.ok ? formatValue(result.value) : '';
}

export const METRIC_TO_IMPERIAL_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'metric-vs-imperial',
    title: 'Metric vs. Imperial Measurement Systems',
    paragraphs: [
      'Measurement systems assign numbers to physical quantities so people can communicate sizes, masses, volumes, temperatures, and speeds consistently. Converting between metric and imperial units is common in travel, engineering collaboration, cooking, and international trade.',
      'This converter maps metric units to imperial or US customary units within one physical dimension at a time; length, area, volume, mass, temperature, or speed.',
    ],
    subsections: [
      {
        id: 'the-metric-system',
        title: 'The Metric System',
        paragraphs: [
          'The International System of Units (SI) is decimal-based. Prefixes such as milli, centi, deci, and kilo scale units by powers of ten. Common everyday metric units include meters, kilograms, and liters, alongside SI-derived quantities used in science and engineering.',
        ],
      },
      {
        id: 'the-imperial-system',
        title: 'The Imperial System',
        paragraphs: [
          'Imperial and US customary systems use inches, feet, yards, and miles for length; ounces and pounds for mass; and gallons, quarts, and pints for volume. US liquid volume units differ from British imperial volumes: a US gallon is not the same as an imperial gallon.',
        ],
      },
    ],
  },
  {
    id: 'converting-length',
    title: 'Converting Length from Metric to Imperial',
    paragraphs: [
      'Exact relationships include 1 in = 2.54 cm, 1 ft = 0.3048 m, 1 yd = 0.9144 m, and 1 mi = 1.609344 km.',
      `Examples: 1 m ≈ ${must('length', 'm', 'ft')} ft; 1 km ≈ ${must('length', 'km', 'mi')} mi; 1 cm ≈ ${must('length', 'cm', 'in')} in.`,
    ],
    formula: 'target = source × (source meters / target meters)',
    tableHeaders: ['Metric', 'Imperial'],
    table: [
      ['1 mm', `${must('length', 'mm', 'in')} in`],
      ['1 cm', `${must('length', 'cm', 'in')} in`],
      ['1 m', `${must('length', 'm', 'ft')} ft`],
      ['1 km', `${must('length', 'km', 'mi')} mi`],
    ],
  },
  {
    id: 'temperature-converter',
    title: 'Temperature Converter from Metric to Imperial',
    paragraphs: [
      'Temperature scales need affine formulas with offsets, not simple multiplication.',
      `Examples: 0°C = ${must('temperature', 'C', 'F')}°F; 20°C = ${must('temperature', 'C', 'F', 20)}°F; 25°C = ${must('temperature', 'C', 'F', 25)}°F; 37°C = ${must('temperature', 'C', 'F', 37)}°F; 100°C = ${must('temperature', 'C', 'F', 100)}°F.`,
      'Absolute zero is −273.15°C / 0 K. Values below absolute zero are rejected.',
    ],
    formula: '°F = °C × 9/5 + 32 · °C = (°F − 32) × 5/9',
  },
  {
    id: 'other-conversions',
    title: 'Other Metric to Imperial Conversions',
    paragraphs: [
      `Mass: 1 kg ≈ ${must('mass', 'kg', 'lb')} lb. Volume: 1 L ≈ ${must('volume', 'L', 'usGal')} US gal (US and UK gallons differ). Area: 1 m² ≈ ${must('area', 'm2', 'ft2')} ft². Speed: 100 km/h ≈ ${must('speed', 'kmh', 'mph', 100)} mph.`,
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Metric to Imperial Converter',
    paragraphs: [
      '1. Select the type of conversion.',
      '2. Choose the metric unit.',
      '3. Choose the imperial or US customary unit.',
      '4. Enter a value in either field.',
      '5. Read the converted result.',
      '6. Switch units or categories as needed.',
      '7. Share or reset the calculation.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages include Metric Converter, Measurement Converter, Meter Converter, Meters to Feet Converter, Celsius Converter, and Temperature Conversion. Only active catalog tools appear as live site links in the related-tools rail.',
    ],
  },
];

export const METRIC_TO_IMPERIAL_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Metric to Imperial?',
    answer:
      'Select a measurement category, choose the metric and imperial units, and enter a value in either field. The calculator applies the correct factor or temperature formula.',
  },
  {
    question: 'How Many Feet Are in 1 Meter?',
    answer: `Approximately ${must('length', 'm', 'ft')} feet.`,
  },
  {
    question: 'How Many Inches Are in 1 Centimeter?',
    answer: `Approximately ${must('length', 'cm', 'in')} inches.`,
  },
  {
    question: 'How Do I Convert Kilograms to Pounds?',
    answer: `Multiply kilograms by approximately ${must('mass', 'kg', 'lb')}.`,
  },
  {
    question: 'How Do I Convert Celsius to Fahrenheit?',
    answer: 'Multiply Celsius by 9/5 and add 32.',
  },
  {
    question: 'How Many Miles Are in 1 Kilometer?',
    answer: `Approximately ${must('length', 'km', 'mi')} miles.`,
  },
  {
    question: 'Is a US Gallon the Same as an Imperial Gallon?',
    answer:
      'No. A US liquid gallon is 3.785411784 liters, while an imperial gallon is 4.54609 liters.',
  },
  {
    question: 'How Do I Convert Square Meters to Square Feet?',
    answer: `Multiply square meters by approximately ${must('area', 'm2', 'ft2')}.`,
  },
];
