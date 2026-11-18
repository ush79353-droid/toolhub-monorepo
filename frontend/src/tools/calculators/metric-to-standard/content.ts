import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertTemperature, formatMetricNumber } from './calculation';
import {
  convertArea,
  convertLength,
  convertMass,
  convertVolume,
} from './units';

export const METRIC_TO_STANDARD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-metric', label: 'What Is the Metric System?' },
  { id: 'what-is-standard', label: 'What Are Standard Measurement Units?' },
  { id: 'conversion-charts', label: 'Metric to Standard Conversion Chart' },
  { id: 'how-to-use', label: 'How to Use the Metric to Standard Converter' },
  { id: 'examples', label: 'Metric to Standard Conversion Examples' },
  { id: 'related-converters', label: 'Other Related Converters' },
  { id: 'metric-to-standard-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
  tables?: readonly {
    caption: string;
    headers: readonly string[];
    rows: readonly string[][];
  }[];
}

export const METRIC_TO_STANDARD_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-metric',
    title: 'What Is the Metric System?',
    paragraphs: [
      'The International System of Units (SI) is the modern metric system. It uses coherent base units and decimal prefixes so that scaling between sizes is predictable.',
      'Common base and derived everyday units include the meter (length), kilogram (mass), and liter (volume, exactly 0.001 m³). Powers of ten simplify conversions within the metric system.',
    ],
    tableHeaders: ['Prefix', 'Symbol', 'Factor'],
    table: [
      ['kilo', 'k', '10³'],
      ['hecto', 'h', '10²'],
      ['deca', 'da', '10¹'],
      ['base', '—', '10⁰'],
      ['deci', 'd', '10⁻¹'],
      ['centi', 'c', '10⁻²'],
      ['milli', 'm', '10⁻³'],
      ['micro', 'µ', '10⁻⁶'],
      ['nano', 'n', '10⁻⁹'],
    ],
  },
  {
    id: 'what-is-standard',
    title: 'What Are Standard Measurement Units?',
    paragraphs: [
      'In everyday language, “standard” often means non-metric measurements used in the United States or historically in the United Kingdom. Those systems are not identical.',
      'US customary and British imperial units share some length and mass relationships (for example, the international inch and avoirdupois pound) but differ for many volume units. A US gallon is not an imperial gallon.',
      'This converter labels US and imperial volume units separately so those definitions are never mixed.',
    ],
  },
  {
    id: 'conversion-charts',
    title: 'Metric to Standard Conversion Chart',
    paragraphs: [
      'Charts below are generated from the same exact factors used by the calculator engine.',
    ],
    tables: [
      {
        caption: 'Length Conversion Chart',
        headers: ['Metric', 'Standard Equivalent'],
        rows: [
          ['1 cm', `${formatMetricNumber(convertLength(1, 'cm', 'in'))} inches`],
          ['1 m', `${formatMetricNumber(convertLength(1, 'm', 'ft'))} feet`],
          ['1 km', `${formatMetricNumber(convertLength(1, 'km', 'mi'))} miles`],
          ['10 m', `${formatMetricNumber(convertLength(10, 'm', 'yd'))} yards`],
        ],
      },
      {
        caption: 'Mass Conversion Chart',
        headers: ['Metric', 'Standard Equivalent'],
        rows: [
          ['1 g', `${formatMetricNumber(convertMass(1, 'g', 'oz'))} ounces`],
          ['1 kg', `${formatMetricNumber(convertMass(1, 'kg', 'lb'))} pounds`],
          ['10 kg', `${formatMetricNumber(convertMass(10, 'kg', 'lb'))} pounds`],
          [
            '1 metric tonne',
            `${formatMetricNumber(convertMass(1, 'tonne', 'shortTon'))} US short tons`,
          ],
        ],
      },
      {
        caption: 'Volume Conversion Chart',
        headers: ['Metric', 'US Customary Equivalent'],
        rows: [
          ['1 mL', `${formatMetricNumber(convertVolume(1, 'mL', 'usFlOz'))} US fl oz`],
          ['1 L', `${formatMetricNumber(convertVolume(1, 'L', 'usGallon'))} US gal`],
          ['2 L', `${formatMetricNumber(convertVolume(2, 'L', 'usGallon'))} US gal`],
          ['5 L', `${formatMetricNumber(convertVolume(5, 'L', 'usGallon'))} US gal`],
        ],
      },
      {
        caption: 'Temperature Conversion Chart',
        headers: ['Celsius', 'Fahrenheit'],
        rows: [
          ['0°C', `${formatMetricNumber(convertTemperature(0, 'C', 'F'))}°F`],
          ['10°C', `${formatMetricNumber(convertTemperature(10, 'C', 'F'))}°F`],
          ['20°C', `${formatMetricNumber(convertTemperature(20, 'C', 'F'))}°F`],
          ['30°C', `${formatMetricNumber(convertTemperature(30, 'C', 'F'))}°F`],
          ['100°C', `${formatMetricNumber(convertTemperature(100, 'C', 'F'))}°F`],
        ],
      },
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Metric to Standard Converter',
    paragraphs: [
      '1. Select the type of measurement (length, area, mass, volume, or temperature).',
      '2. Open the appropriate unit group.',
      '3. Enter a value in any field.',
      '4. View all equivalent unit values.',
      '5. Edit another unit to reverse the conversion.',
      '6. Reset or clear values when needed.',
    ],
  },
  {
    id: 'examples',
    title: 'Metric to Standard Conversion Examples',
    paragraphs: [
      `5 meters to feet: 5 × ${formatMetricNumber(convertLength(1, 'm', 'ft'))} ≈ ${formatMetricNumber(convertLength(5, 'm', 'ft'))} ft.`,
      `10 kilometers to miles: 10 × ${formatMetricNumber(convertLength(1, 'km', 'mi'))} ≈ ${formatMetricNumber(convertLength(10, 'km', 'mi'))} mi.`,
      `25 kilograms to pounds: 25 × ${formatMetricNumber(convertMass(1, 'kg', 'lb'))} ≈ ${formatMetricNumber(convertMass(25, 'kg', 'lb'))} lb.`,
      `2 liters to US gallons: 2 × ${formatMetricNumber(convertVolume(1, 'L', 'usGallon'))} ≈ ${formatMetricNumber(convertVolume(2, 'L', 'usGallon'))} US gal.`,
      `30°C to Fahrenheit: (30 × 9/5) + 32 = ${formatMetricNumber(convertTemperature(30, 'C', 'F'))}°F.`,
      `2 hectares to acres: 2 × ${formatMetricNumber(convertArea(1, 'ha', 'acre'))} ≈ ${formatMetricNumber(convertArea(2, 'ha', 'acre'))} ac.`,
    ],
    formula:
      'Linear: target = source × (source factor / target factor) · Temperature: F = (C × 9/5) + 32',
  },
  {
    id: 'related-converters',
    title: 'Other Related Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Metric Converter, Imperial Calculator, Imperial to Metric Conversion, Length Converter, Area Converter, Weight Converter, Volume Converter, Temperature Converter, Inch Converter, Kilometer Calculator, kg to lbs Converter, Hectares to Acres Converter, and Celsius to Fahrenheit Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const METRIC_TO_STANDARD_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 12 Meters to Feet?',
    answer: `Use feet = meters × ${formatMetricNumber(convertLength(1, 'm', 'ft'))}. Therefore 12 × ${formatMetricNumber(convertLength(1, 'm', 'ft'))} ≈ ${formatMetricNumber(convertLength(12, 'm', 'ft'))}. 12 meters ≈ ${formatMetricNumber(convertLength(12, 'm', 'ft'))} feet.`,
  },
  {
    question: 'How Do I Convert Kilograms to Pounds?',
    answer: `Multiply kilograms by approximately ${formatMetricNumber(convertMass(1, 'kg', 'lb'))}. For example, 10 kg ≈ ${formatMetricNumber(convertMass(10, 'kg', 'lb'))} lb.`,
  },
  {
    question: 'How Many Inches Are in One Centimeter?',
    answer: `One centimeter is approximately ${formatMetricNumber(convertLength(1, 'cm', 'in'))} inches.`,
  },
  {
    question: 'What Is the Difference Between Metric and Imperial Units?',
    answer:
      'Metric units primarily use decimal relationships, while imperial units use other conversion relationships, such as 12 inches per foot and 3 feet per yard.',
  },
  {
    question: 'Is a US Gallon the Same as an Imperial Gallon?',
    answer: `No. 1 US gallon = ${formatMetricNumber(convertVolume(1, 'usGallon', 'L'))} liters. 1 imperial gallon = ${formatMetricNumber(convertVolume(1, 'impGallon', 'L'))} liters.`,
  },
  {
    question: 'How Do I Convert Celsius to Fahrenheit?',
    answer: `F = (C × 9/5) + 32. For example, 25°C = ${formatMetricNumber(convertTemperature(25, 'C', 'F'))}°F.`,
  },
];
